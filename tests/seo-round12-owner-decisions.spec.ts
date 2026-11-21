import { test, expect } from "@playwright/test";

// Round 12, 2026-11-13: Shauna's certification may appear only in her About biography. No
// page text, title, description or share text mentions it anywhere else, so nothing leads
// with it and nothing suggests the other instructors hold it. Structured data is not shown
// to visitors and is left out of this check.

test("the certification appears only in Shauna's About biography", async ({ page, request, isMobile }) => {
  test.skip(isMobile, "the words are the same at every width");
  test.setTimeout(180_000);
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(paths.length).toBeGreaterThan(30);
  // The Ask page is governed separately; its one mention waits for the owner's decision.
  const routes = [...paths.filter((p) => p !== "/ask"), "/events/cafe-lola-open-play-may-2026"];
  const offenders: string[] = [];
  for (const route of routes) {
    await page.goto(route);
    const found = await page.evaluate(() => {
      const out: string[] = [];
      const meta = [document.title, ...Array.from(document.querySelectorAll("meta[content]"), (m) => m.getAttribute("content") ?? "")];
      for (const t of meta) if (/certif/i.test(t)) out.push(`meta: ${t.slice(0, 90)}`);
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.textContent ?? "";
        const el = n.parentElement;
        if (!/certif/i.test(text) || !el || el.closest("script, style, noscript")) continue;
        const section = el.closest("section");
        const inBiography =
          location.pathname === "/about" && !!section && /One\s*Tile\s*at a Time/i.test(section.querySelector("h2")?.textContent ?? "");
        if (!inBiography) out.push(`text: ${text.trim().slice(0, 90)}`);
      }
      return out;
    });
    offenders.push(...found.map((f) => `${route} ${f}`));
  }
  expect(offenders).toEqual([]);
});

test("until a GA4 ID is set, the privacy page says the site uses no analytics", async ({ page }) => {
  test.skip(!!process.env.NEXT_PUBLIC_GA4_ID, "this build has a GA4 ID, so the analytics section is shown");
  await page.goto("/privacy");
  await expect(page.locator("main")).toContainText("This website does not use an analytics service right now.");
  await expect(page.locator("main")).toContainText("This website does not set any cookies.");
  await expect(page.locator("main")).toContainText("Last updated November 20, 2026");
  await expect(page.locator("main")).not.toContainText("Google Analytics");
  await expect(page.locator('meta[name="description"]')).not.toHaveAttribute("content", /analytics/i);
});

test("once a GA4 ID is set, the privacy page names Google Analytics and moves its date", async ({ page }) => {
  test.skip(!process.env.NEXT_PUBLIC_GA4_ID, "this build has no GA4 ID, so the page still says no analytics is used");
  await page.goto("/privacy");
  await expect(page.locator("main")).toContainText("We use Google Analytics 4");
  await expect(page.locator("main")).toContainText("Last updated November 20, 2026");
  await expect(page.locator("main")).toContainText("Google Analytics sets the cookies described above.");
  await expect(page.locator("main")).not.toContainText("does not use an analytics service");
});

test("the About page leads with Shauna's experience and keeps the credential in her story", async ({ page }) => {
  await page.goto("/about");
  await expect(page).toHaveTitle("About Shauna | Las Vegas Mahjong");
  await expect(page.locator("main section").first()).toContainText("Founder of Las Vegas Mahjong. 18 years at the table, and counting.");
  await expect(page.getByRole("heading", { name: "Certified Instructor" })).toHaveCount(0);
  await expect(page.locator("main")).toContainText("I became a certified Oh My Mahjong instructor");
  await expect(page.locator("main")).not.toContainText(/added fee/i);
});
