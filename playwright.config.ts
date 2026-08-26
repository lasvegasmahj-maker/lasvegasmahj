import { defineConfig, devices } from "@playwright/test";

// Set PLAYWRIGHT_BASE_URL to test a deployed preview or production; otherwise a local
// production build is started automatically. Logic specs (*.logic.spec.ts) need no browser.
const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: { baseURL, trace: "on-first-retry" },
  projects: [
    { name: "logic", testMatch: /.*\.logic\.spec\.ts/ },
    { name: "desktop-chromium", testIgnore: /.*\.logic\.spec\.ts/, use: { ...devices["Desktop Chrome"], extraHTTPHeaders: { "x-forwarded-for": "203.0.113.250" } } },
    // iPhone 13 viewport, touch, and user agent on the Chromium engine. Playwright's WebKit
    // build for macOS 14 crashes on launch (Bus error) on the owner's machine; set
    // PLAYWRIGHT_WEBKIT=1 to run the same project on real WebKit where it works.
    { name: "mobile", testIgnore: /.*\.logic\.spec\.ts/, use: { ...devices["iPhone 13"], extraHTTPHeaders: { "x-forwarded-for": "203.0.113.251" }, ...(process.env.PLAYWRIGHT_WEBKIT ? {} : { browserName: "chromium" }) } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "pnpm build && pnpm start",
        url: "http://localhost:3000",
        timeout: 240_000,
        // Opt in explicitly so a stale server on :3000 can never stand in for a fresh build.
        reuseExistingServer: process.env.PLAYWRIGHT_REUSE === "1",
      },
});
