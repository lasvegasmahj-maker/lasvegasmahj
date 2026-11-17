import { test, expect } from "@playwright/test";
import crypto from "node:crypto";

// Round 11, 2026-11-13: the owner's follow-ups, checked on the pages a visitor is served,
// at desktop and phone widths.

// The corporate client's name is deliberately not written here. See the note beside the same
// value in seo-round11-followups.logic.spec.ts.
const CLIENT_FINGERPRINT = "d0a93026a075841aed507398ab34bbdc444ab44ce53454d370e9cc3406b3c0c9";
const fingerprint = (word: string) => crypto.createHash("sha256").update(word).digest("hex");

for (const route of ["/", "/about", "/mahjong-corporate-las-vegas"]) {
  test(`${route}: nothing served names the corporate client`, async ({ page }) => {
    await page.goto(route);
    // The whole document, including the data the page ships for hydration, not only the
    // words on screen.
    const words = new Set((await page.content()).toLowerCase().match(/[a-z]{4,}/g) ?? []);
    expect([...words].filter((w) => fingerprint(w) === CLIENT_FINGERPRINT)).toEqual([]);
  });
}

test("the corporate quote shows once, on the corporate page, with no attribution line", async ({ page }) => {
  await page.goto("/mahjong-corporate-las-vegas");
  const quote = page.locator("main blockquote");
  await expect(quote).toHaveCount(1);
  await expect(quote).toContainText("We worked with Shauna for a mahjong-oriented corporate event in early 2026.");
  await expect(page.locator("main cite")).toHaveCount(0);
  for (const route of ["/", "/about"]) {
    await page.goto(route);
    await expect(page.locator("body")).not.toContainText("best guest feedback");
  }
});

test("every review card on the homepage names its reviewer", async ({ page }) => {
  await page.goto("/");
  const cards = await page.locator(".testimonial").count();
  expect(cards).toBeGreaterThan(0);
  await expect(page.locator(".testimonial-author")).toHaveCount(cards);
});

test("the About page says group lessons seat 4 to 8", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("main")).toContainText("For group lessons, I work with 4 to 8 students max");
});

for (const route of ["/mahjong-lessons-summerlin", "/mahjong-lessons-henderson"]) {
  test(`${route} credits the years at the table to Shauna by name`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toContainText("Our founder, Shauna, has played American Mahjong for nearly 18 years.");
  });
}

test("the lessons page leads with the lessons, and the homepage's search description leads with the offering", async ({ page }) => {
  await page.goto("/mahjong-lessons-las-vegas");
  await expect(page.locator("main")).toContainText(
    "Las Vegas Mahjong offers in-person American Mahjong lessons at our Las Vegas studio. Beginner-friendly, patient, and genuinely fun.",
  );
  await page.goto("/");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    "Mahjong lessons, open play, and private parties across Las Vegas, Summerlin, and Henderson. Beginner classes need no experience.",
  );
});

test("the parties page's second button opens the private lessons page and fits the screen", async ({ page }) => {
  await page.goto("/mahjong-parties-las-vegas");
  const button = page.locator("main").getByRole("link", { name: "View Private Lessons", exact: true });
  await expect(button).toBeVisible();
  const box = await button.boundingBox();
  const width = page.viewportSize()!.width;
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(width);
  await button.click();
  await expect(page).toHaveURL(/\/private-mahjong-lessons-las-vegas$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Private");
});
