import { test, expect } from "@playwright/test";
import { NextRequest } from "next/server";
import { POST } from "../app/api/ask/route";
import { answerDeterministic, buildFollowups, type Turn } from "../lib/ask/engine";
import { composeWithModel, type ModelClient, type ModelInput } from "../lib/ask/llm";

// Ask writes one line per answer to the hosting logs. That line and the model usage line are
// built from fixed codes, entry ids and numbers only; the two error lines add the error's own
// message. The words of a question and of the conversation never reach a log. These tests run
// the real route in-process and record every console call it makes.

const CONSOLE_METHODS = ["log", "info", "warn", "error", "debug"] as const;
const LOG_KEYS = ["event", "kind", "entry", "category", "label", "via", "turn", "ms"];

// Made-up details a player might type. None of these words appears in any rule entry, label
// or code, so finding one in a log means the log copied the player's words.
const MARKERS = ["jennifer", "kowalski", "summerlin", "willowbrook", "grandmother", "zinnia"];

async function captureConsole<T>(fn: () => Promise<T>): Promise<{ result: T; lines: string[] }> {
  const lines: string[] = [];
  const original = CONSOLE_METHODS.map((m) => console[m]);
  for (const m of CONSOLE_METHODS) {
    console[m] = (...args: unknown[]) => {
      lines.push(args.map((a) => (typeof a === "string" ? a : a instanceof Error ? `${a.name}: ${a.message}` : JSON.stringify(a))).join(" "));
    };
  }
  try {
    return { result: await fn(), lines };
  } finally {
    CONSOLE_METHODS.forEach((m, i) => {
      console[m] = original[i];
    });
  }
}

let ipCounter = 0;
async function ask(question: string, history: Turn[] = []) {
  ipCounter += 1;
  const req = new NextRequest("http://localhost/api/ask", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `198.51.100.${ipCounter}` },
    body: JSON.stringify({ question, history }),
  });
  const res = await POST(req);
  return { status: res.status, body: (await res.json()) as Record<string, unknown> };
}

function expectNoTypedWords(lines: string[], typed: string) {
  const text = lines.join("\n").toLowerCase();
  for (const marker of MARKERS) {
    if (typed.toLowerCase().includes(marker)) expect(text, `log carries "${marker}"`).not.toContain(marker);
  }
}

let savedModelSwitch: string | undefined;
test.beforeAll(() => {
  // The route consults the model only when a key is configured; these tests keep it off so
  // they never reach the network. The model path is covered below with a fake client.
  savedModelSwitch = process.env.ASK_MODEL_DISABLED;
  process.env.ASK_MODEL_DISABLED = "1";
});
test.afterAll(() => {
  if (savedModelSwitch === undefined) delete process.env.ASK_MODEL_DISABLED;
  else process.env.ASK_MODEL_DISABLED = savedModelSwitch;
});

test.describe("Ask log lines carry no question text", () => {
  const cases: Array<{ name: string; question: string; history?: Turn[]; kind: string }> = [
    {
      name: "an answer we cannot verify",
      question: "Can Jennifer Kowalski from Summerlin play with her grandmother's zinnia tiles at Willowbrook?",
      kind: "unverified",
    },
    {
      name: "a matched rule",
      question: "Jennifer from Summerlin asks: can I use a joker in a pair?",
      kind: "answer",
    },
    {
      name: "a card question",
      question: "Kowalski wants the 2026 card hands for Willowbrook, what are they?",
      kind: "card_refusal",
    },
    {
      name: "an off-topic question",
      question: "Is the zinnia garden at Willowbrook open for Jennifer Kowalski on Sunday?",
      kind: "offtopic",
    },
    {
      name: "a follow-up after an earlier question with personal details",
      question: "what about my grandmother in Summerlin?",
      history: [
        { role: "user", content: "Jennifer Kowalski at Willowbrook asks: can I use a joker in a pair?" },
        { role: "assistant", content: "No. Jokers cannot be used in a pair.", entry_id: "joker-in-pair" },
      ],
      kind: "",
    },
  ];

  for (const c of cases) {
    test(`${c.name}: one line of fixed fields, none of the typed words`, async () => {
      const { result, lines } = await captureConsole(() => ask(c.question, c.history));
      expect(result.status).toBe(200);
      if (c.kind) expect(result.body.kind).toBe(c.kind);
      expect(lines).toHaveLength(1);
      const record = JSON.parse(lines[0]) as Record<string, unknown>;
      expect(Object.keys(record).sort()).toEqual([...LOG_KEYS].sort());
      expect(record.event).toBe("ask");
      for (const v of Object.values(record)) {
        expect(["string", "number"].includes(typeof v) || v === null).toBe(true);
      }
      expectNoTypedWords(lines, [c.question, ...(c.history ?? []).map((t) => t.content)].join(" "));
    });
  }

  test("a rejected request logs nothing", async () => {
    const { result, lines } = await captureConsole(() => ask("Jennifer Kowalski at Willowbrook " + "x".repeat(400)));
    expect(result.status).toBe(400);
    expect(lines).toEqual([]);
  });
});

test.describe("the model layer logs no question text", () => {
  const question = "Can Jennifer Kowalski from Summerlin use a joker in a pair at Willowbrook?";
  function input(): ModelInput {
    const det = answerDeterministic(question);
    const options = det.entry ? buildFollowups(det.entry, new Set(), 6) : det.followups;
    return { question, history: [{ role: "user", content: "my grandmother plays zinnia rules" }], candidates: det.candidates, followupOptions: options, preferred: det.entry?.id };
  }
  function clientReturning(text: string): ModelClient {
    return {
      messages: {
        create: async () => ({
          id: "m", type: "message", role: "assistant", model: "fake", stop_reason: "end_turn", stop_sequence: null,
          content: [{ type: "text", text, citations: null }],
          usage: { input_tokens: 10, output_tokens: 5 },
        }) as never,
      },
    };
  }

  test("a usable reply, an unreadable reply and a failed call each log JSON that holds none of the typed words", async () => {
    const failing: ModelClient = { messages: { create: async () => { throw Object.assign(new Error("overloaded"), { status: 529 }); } } };
    for (const client of [clientReturning(JSON.stringify({ entry_ids: [], covered: false })), clientReturning("not json"), failing]) {
      const { lines } = await captureConsole(() => composeWithModel(input(), client, 2_000));
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) expect(() => JSON.parse(line)).not.toThrow();
      expectNoTypedWords(lines, `${question} my grandmother plays zinnia rules`);
    }
  });
});
