import { test, expect } from "@playwright/test";

// The refresh link must never work without the secret key, and must say nothing useful to
// anyone guessing. CI runs without SCHEDULE_REFRESH_KEY, which must also mean "off".
test.describe("schedule refresh link", () => {
  for (const q of ["", "?key=", "?key=wrong-key-but-long-enough-123"]) {
    test(`answers 404 for /api/refresh-schedule${q || " with no key"}`, async ({ request }) => {
      const res = await request.get(`/api/refresh-schedule${q}`);
      expect(res.status()).toBe(404);
      expect(res.headers()["cache-control"]).toContain("no-store");
      expect(await res.text()).toBe("Not found");
    });
  }
});
