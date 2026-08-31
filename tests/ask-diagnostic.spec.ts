import { test, expect } from "@playwright/test";

// Temporary, paired with app/api/ask/diagnostic/route.ts. Guards the allow-list so the
// endpoint cannot start reporting anything sensitive while it exists.

test.describe("temporary Ask gate diagnostic", () => {
  test("reports only non-secret gate booleans", async ({ request }) => {
    const res = await request.get("/api/ask/diagnostic");
    expect(res.status()).toBe(200);
    const raw = await res.text();
    const body = JSON.parse(raw);
    expect(Object.keys(body).sort()).toEqual(["commit", "key_present", "model", "model_disabled", "model_enabled", "vercel_env"]);
    expect(body.model).toMatch(/^claude-[a-z0-9-]+$/);
    for (const k of ["key_present", "model_disabled", "model_enabled"]) expect(typeof body[k], k).toBe("boolean");
    for (const forbidden of ["sk-ant", "ANTHROPIC_API_KEY", "SYSTEM_PROMPT", "KNOWLEDGE", "patterns", "keywords", "process.env"]) expect(raw).not.toContain(forbidden);
    expect(raw.length).toBeLessThan(300);
  });
});
