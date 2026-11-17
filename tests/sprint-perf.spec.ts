import { test, expect, type Page } from "@playwright/test";

// Performance sprint, 2026-11-13: which homepage hero file a screen actually downloads.

async function heroWidth(page: Page) {
  await page.goto("/");
  const hero = page.locator("section#home img").first();
  await expect(hero).toHaveJSProperty("complete", true);
  const src = await hero.evaluate((img: HTMLImageElement) => img.currentSrc);
  return Number(new URL(src).searchParams.get("w"));
}

test.describe("a Lighthouse-size phone (412px at 1.75x)", () => {
  test.use({ viewport: { width: 412, height: 823 }, deviceScaleFactor: 1.75, isMobile: true, hasTouch: true });
  test("still gets the 750px hero", async ({ page }) => {
    expect(await heroWidth(page)).toBe(750);
  });
});

test.describe("a 430px 3x phone", () => {
  test.use({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  test("gets a hero narrower than the 1920px file", async ({ page }) => {
    const w = await heroWidth(page);
    expect(w).toBeGreaterThanOrEqual(1280);
    expect(w).toBeLessThan(1920);
  });
});

test.describe("a 1280px laptop at 1x", () => {
  test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
  test("gets the 1280px hero", async ({ page }) => {
    expect(await heroWidth(page)).toBe(1280);
  });
});
