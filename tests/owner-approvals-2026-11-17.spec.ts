import { test, expect } from "@playwright/test";

// The owner's photo decisions of 2026-11-16 and 2026-11-17, checked on the rendered pages at
// desktop and phone sizes: the leagues page photo and share image, and one FOX5 card's picture.

const APPROVED_ALT =
  "Three mahjong tables set for play with mats, tiles, racks and drinks, surrounded by navy velvet chairs";
const CLASSES_URL = "https://www.fox5vegas.com/video/2026/09/02/american-mahjong-classes-now-being-taught-las-vegas-mahjong/";
const LEARN_URL = "https://www.fox5vegas.com/video/2026/09/02/learn-play-american-mahjong-new-business-las-vegas-mahjong-sahara/";

const noSidewaysScroll = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

test("the leagues page shows the approved photo between its buttons and the league list", async ({ page }) => {
  await page.goto("/mahjong-leagues-las-vegas");
  const photo = page.locator(`main img[alt="${APPROVED_ALT}"]`);
  await expect(photo).toHaveCount(1);
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute("fetchpriority", "high");
  expect(await photo.getAttribute("loading")).not.toBe("lazy");
  expect(decodeURIComponent((await photo.getAttribute("src")) ?? "")).toContain("/studio-tables-set-for-play.jpg");
  await expect.poll(() => photo.evaluate((n: HTMLImageElement) => n.complete && n.naturalWidth)).toBeGreaterThan(0);

  const buttons = await page.getByRole("link", { name: "View the Full Schedule" }).first().boundingBox();
  const box = await photo.boundingBox();
  const list = await page.locator("#leagues").boundingBox();
  expect(box!.y).toBeGreaterThan(buttons!.y + buttons!.height);
  expect(box!.y + box!.height).toBeLessThanOrEqual(list!.y);
  // The whole photo, in its own 4:3 shape, at most 760 pixels wide.
  expect(box!.width).toBeLessThanOrEqual(760);
  expect(Math.abs(box!.width / box!.height - 4 / 3)).toBeLessThan(0.02);
  expect(await noSidewaysScroll(page)).toBe(true);
});

test("the leagues page has no sideways scroll on the narrowest phones", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/mahjong-leagues-las-vegas");
  await expect(page.locator(`main img[alt="${APPROVED_ALT}"]`)).toBeVisible();
  expect(await noSidewaysScroll(page)).toBe(true);
});

test("the leagues page's link preview uses the same photo, and the file loads", async ({ page, request }) => {
  await page.goto("/mahjong-leagues-las-vegas");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://www.lasvegasmahj.com/studio-tables-set-for-play.jpg");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", APPROVED_ALT);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute("content", "https://www.lasvegasmahj.com/studio-tables-set-for-play.jpg");
  expect((await request.get("/studio-tables-set-for-play.jpg")).status()).toBe(200);
});

for (const route of ["/", "/studio"]) {
  test(`the FOX5 classes card on ${route} shows the lesson table photo and keeps its link`, async ({ page }) => {
    await page.goto(route);
    const cards = page.locator("#press a.press-card");
    await expect(cards).toHaveCount(2);
    const classes = cards.filter({ hasText: "American Mahjong Classes NOW being taught at Las Vegas Mahjong" });
    await expect(classes).toHaveAttribute("href", CLASSES_URL);
    await expect(classes).toHaveAttribute("target", "_blank");
    const art = classes.locator("img");
    await art.scrollIntoViewIfNeeded();
    expect(decodeURIComponent((await art.getAttribute("src")) ?? "")).toContain("/studio-lesson-table-set.jpg");
    await expect.poll(() => art.evaluate((n: HTMLImageElement) => n.complete && n.naturalWidth)).toBeGreaterThan(0);
    const learn = cards.filter({ hasText: "LEARN & PLAY American Mahjong at NEW business Las Vegas Mahjong on Sahara" });
    await expect(learn).toHaveAttribute("href", LEARN_URL);
    expect(decodeURIComponent((await learn.locator("img").getAttribute("src")) ?? "")).toContain("/studio-open-play-room.jpg");
    expect(await noSidewaysScroll(page)).toBe(true);
  });
}
