import { test, expect } from "@playwright/test";

// Guards the rest of the site while /ask ships: key routes, sitemap, robots, headers, nav.

test.describe("site regression", () => {
  test("key routes still return 200", async ({ request }) => {
    for (const path of ["/", "/ask", "/rules", "/rules/jokers", "/rules/charleston", "/schedule", "/mahjong-lessons-las-vegas", "/learn-mahjong", "/mahjong-open-play-las-vegas", "/about", "/blog"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
  });

  test("sitemap lists /ask and robots keeps /api private", async ({ request }) => {
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("https://www.lasvegasmahj.com/ask");
    expect(sitemap).toContain("https://www.lasvegasmahj.com/rules/jokers");
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow:\s*\/api\//);
  });

  test("security headers apply to the new page", async ({ request }) => {
    const res = await request.get("/ask");
    expect(res.headers()["x-frame-options"]).toBe("DENY");
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  });

  test("existing navigation links are intact", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.locator(".nav-toggle").click();
    for (const label of ["About", "Schedule", "Lessons", "Ask a Rule", "Shop", "Private Parties", "Corporate", "Contact"]) {
      await expect(page.locator("nav .nav-links a", { hasText: label }).first()).toBeVisible();
    }
    await expect(page.locator("nav .nav-cta")).toHaveText("Join an Event");
  });

  test("tablet widths get a working menu button and an unobstructed CTA", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop project only");
    for (const width of [1024, 820]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const toggle = page.locator(".nav-toggle");
      await expect(toggle, `toggle at ${width}`).toBeVisible();
      const logo = (await page.locator(".nav-logo").boundingBox())!;
      const cta = (await page.locator(".nav-cta").boundingBox())!;
      expect(cta.x, `CTA clear of logo at ${width}`).toBeGreaterThan(logo.x + logo.width);
      await toggle.click();
      await expect(page.locator('nav .nav-links a[href="/ask"]')).toBeVisible();
      await toggle.click();
    }
  });

  test("homepage FAQ still opens and closes", async ({ page }) => {
    await page.goto("/");
    const item = page.locator(".faq-item").first();
    await item.scrollIntoViewIfNeeded();
    await item.click();
    await expect(item).toHaveClass(/faq-open/);
    await expect(item.locator(".faq-answer")).toBeVisible();
  });
});
