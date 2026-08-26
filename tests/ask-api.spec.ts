import { test, expect, type APIRequestContext } from "@playwright/test";

// API contract for /api/ask. Each test uses its own fake client IP so the per-IP limiter
// never bleeds between tests or between the desktop and mobile projects.

function ipFor(name: string) {
  const project = test.info().project.name === "mobile" ? 20 : 10;
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

  test("card contents are refused and unknown rules fail honestly", async ({ request }) => {
    const card = await ask(request, "What hands are on the 2026 card?");
    expect(card.body.kind).toBe("card_refusal");
    expect(card.body.answer).toMatch(/copyrighted/);
    const unknown = await ask(request, "What happens if my elbow knocks over the rack?");
    expect(unknown.body.kind).toBe("unverified");
    expect(unknown.body.answer).toMatch(/cannot verify/i);
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
