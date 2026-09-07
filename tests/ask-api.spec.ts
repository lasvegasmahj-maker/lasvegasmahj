import { test, expect, type APIRequestContext } from "@playwright/test";

// API contract for /api/ask. Each test uses its own fake client IP so the per-IP limiter
// never bleeds between tests or between the desktop and mobile projects.

function ipFor(name: string) {
  const project = test.info().project.name === "mobile" ? 40 : 10;
  const n = Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) % 200;
  return `203.0.113.${project + (n % 30)}`;
}

async function ask(request: APIRequestContext, question: string, history: unknown[] = [], ip = ipFor(question)) {
  const res = await request.post("/api/ask", { data: { question, history }, headers: { "x-forwarded-for": ip } });
  return { res, body: await res.json() };
}

test.describe("POST /api/ask", () => {
  test("answers a rules question from approved text with label and follow-ups", async ({ request }) => {
    const { res, body } = await ask(request, "Can I use a joker in a pair?");
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("no-store");
    expect(body.ok).toBe(true);
    expect(body.entry_id).toBe("joker-in-pair");
    expect(body.label).toBe("standard");
    expect(body.answer).toMatch(/never be used in a pair/i);
    expect(body.followups.length).toBeGreaterThanOrEqual(2);
    expect(body.source_url).toContain("/rules/jokers");
    expect(["rules", "model"]).toContain(body.via);
  });

  test("follow-up with history keeps the topic", async ({ request }) => {
    const first = await ask(request, "Can I use a joker in a pair?", [], ipFor("followup"));
    const history = [
      { role: "user", content: "Can I use a joker in a pair?" },
      { role: "assistant", content: first.body.answer, entry_id: first.body.entry_id },
    ];
    const { body } = await ask(request, "What about a kong?", history, ipFor("followup"));
    expect(body.ok).toBe(true);
    expect(["jokers-basics", "joker-substitute"]).toContain(body.entry_id);
  });

  test("card contents are refused and an unknown rule is clarified, never refused", async ({ request }) => {
    const card = await ask(request, "What hands are on the 2026 card?");
    expect(card.body.kind).toBe("card_refusal");
    expect(card.body.answer).toMatch(/copyrighted/);
    const unknown = await ask(request, "What happens if my elbow knocks over the rack?");
    expect(unknown.body.kind).toBe("clarify");
    expect(unknown.body.clarify.id).toBe("topic");
    expect(unknown.body.answer).toMatch(/Which part of the game/);
    expect(unknown.body.answer).not.toMatch(/cannot verify/i);
  });

  test("a clarification round trip resolves to the rule, by option and by typed reply", async ({ request }) => {
    const ip = ipFor("clarify-trip");
    const first = await ask(request, "Can I call that tile?", [], ip);
    expect(first.body.kind).toBe("clarify");
    expect(first.body.clarify.id).toBe("call-purpose");
    expect(first.body.clarify.options.map((o: { label: string }) => o.label)).toEqual(["To make an exposure", "It would complete mahjong"]);
    const ctx = { id: first.body.clarify.id, question: first.body.clarify.question };
    const picked = await request.post("/api/ask", { data: { question: "It would complete mahjong", history: [], clarify: ctx }, headers: { "x-forwarded-for": ip } });
    const pickedBody = await picked.json();
    expect(pickedBody.kind).toBe("answer");
    expect(pickedBody.entry_id).toBe("calling-for-mahjong");
    const typed = await request.post("/api/ask", { data: { question: "for an exposure", history: [], clarify: ctx }, headers: { "x-forwarded-for": ip } });
    expect((await typed.json()).entry_id).toBe("calling-for-exposure");
  });

  test("a studio question gets the local pointer, never a rule", async ({ request }) => {
    const { body } = await ask(request, "do I need to call ahead for open play");
    expect(body.kind).toBe("offtopic");
    expect(body.entry_id).toBeUndefined();
    expect(body.suggestions.map((s: { href: string }) => s.href)).toContain("/mahjong-open-play-las-vegas");
  });

  test("the version endpoint reports the shared core identity without secrets", async ({ request }) => {
    const res = await request.get("/api/ask/version");
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("no-store");
    const body = await res.json();
    expect(body.site).toBe("lvm");
    expect(body.core_version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(body.corpus_fingerprint).toMatch(/^[0-9a-f]{16}$/);
    expect(body.behavior_fingerprint).toMatch(/^[0-9a-f]{16}$/);
    expect(body.overrides.map((o: { canonical_id: string }) => o.canonical_id)).toContain("payments-basics");
    expect(JSON.stringify(body)).not.toMatch(/sk-ant|ANTHROPIC/);
  });

  test("rejects bad input with JSON, not a stack trace", async ({ request }) => {
    const empty = await ask(request, "");
    expect(empty.res.status()).toBe(400);
    expect(empty.body.ok).toBe(false);
    const long = await ask(request, "x".repeat(301));
    expect(long.res.status()).toBe(400);
    const badHistory = await request.post("/api/ask", { data: { question: "hi", history: "nope" }, headers: { "x-forwarded-for": ipFor("bad") } });
    expect(badHistory.status()).toBe(400);
    const notJson = await request.post("/api/ask", { data: "not json", headers: { "content-type": "application/json", "x-forwarded-for": ipFor("notjson") } });
    expect(notJson.status()).toBe(400);
    expect(await notJson.text()).not.toMatch(/at .*\.ts:\d+/);
  });

  test("GET is not allowed", async ({ request }) => {
    const res = await request.get("/api/ask");
    expect(res.status()).toBe(405);
    expect(res.headers()["allow"]).toBe("POST");
    expect((await res.json()).ok).toBe(false);
  });

  test("rate limit returns 429 with a friendly message after 30 questions in a minute", async ({ request }) => {
    test.skip(Boolean(process.env.PLAYWRIGHT_BASE_URL?.includes("vercel.app") || process.env.PLAYWRIGHT_BASE_URL?.includes("lasvegasmahj.com")), "deployed hosts see one real IP; local only");
    const ip = `198.51.100.${test.info().project.name === "mobile" ? 2 : 1}`;
    let last = 200;
    for (let i = 0; i < 31; i++) {
      const { res } = await ask(request, "Can I use a joker in a pair?", [], ip);
      last = res.status();
      if (last === 429) break;
    }
    expect(last).toBe(429);
    const { res, body } = await ask(request, "Can I use a joker in a pair?", [], ip);
    expect(res.status()).toBe(429);
    expect(body.error).toMatch(/minute/);
    expect(body.fallback).toBe("/rules");
  });

  test("responses never leak internals", async ({ request }) => {
    const { body } = await ask(request, "How does the Charleston work?");
    const raw = JSON.stringify(body);
    for (const f of ["ANTHROPIC", "SYSTEM_PROMPT", "KNOWLEDGE INDEX", "sk-ant-", "patterns", "keywords", "api_key", "process.env"]) expect(raw).not.toContain(f);
  });
});
