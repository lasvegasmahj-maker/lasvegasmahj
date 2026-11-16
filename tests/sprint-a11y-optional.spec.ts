import { test, expect } from "@playwright/test";

// Two accessibility fixes merged on 2026-11-13: shop card web addresses readable on their white
// headers, and the nav collapsing at a larger browser text size. The button pink proposed with
// them was approved on 2026-11-15 and is tested in tests/owner-approvals-2026-11-15.spec.ts.

function contrast(fg: number[], bg: number[]) {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const [a, b] = [lum(fg), lum(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const parse = (css: string) => {
  const p = css.match(/[\d.]+/g)!.map(Number);
  return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
};

test("shop web addresses hold 4.5:1 on their white card headers", async ({ page }) => {
  await page.goto("/");
  const css = await page.evaluate(() => ({
    meta: getComputedStyle(document.querySelector(".shop-grid .event-card-header .event-meta")!).color,
  }));
  const header = [0.97 * 255 + 0.03 * 26, 0.97 * 255 + 0.03 * 27, 0.97 * 255 + 0.03 * 110];
  const m = parse(css.meta);
  const text = m.rgb.map((v, i) => m.a * v + (1 - m.a) * header[i]);
  expect(contrast(text, header)).toBeGreaterThanOrEqual(4.5);
});

test("a larger browser text size collapses the nav instead of pushing links off screen", async ({ page, isMobile, browserName }) => {
  test.skip(isMobile || browserName !== "chromium", "desktop Chromium: the text size is set through the DevTools protocol");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/about");
  await expect(page.locator(".nav-toggle")).toBeHidden();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Page.setFontSizes", { fontSizes: { standard: 32, fixed: 26 } });
  await page.reload();
  await expect(page.locator(".nav-toggle")).toBeVisible();
  const cta = (await page.locator(".nav-cta").boundingBox())!;
  expect(cta.x + cta.width).toBeLessThanOrEqual(1280);
});
