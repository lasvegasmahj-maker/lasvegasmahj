import { test, expect } from "@playwright/test";

// Internal links and title tags the owner decided on 2026-11-12, against a real production
// build at desktop and phone widths.

// Everything that decides how a run of text looks.
const look = (el: Element) => {
  const s = getComputedStyle(el);
  return [s.color, s.fontWeight, s.fontSize, s.fontFamily, s.fontStyle, s.textDecorationLine].join(" | ");
};

test.describe("/studio: the word Leagues links to the leagues page", () => {
  const SENTENCE =
    "Lucky Wishbone is the teaching room. Classes meet here, from people who have never touched a tile to players who already know the card and want to get sharper. Leagues run here, and so do special events, so this is the room where the community comes together.";

  test("the sentence reads exactly as before, and only the one word is the link", async ({ page }) => {
    await page.goto("/studio");
    const paragraph = page.locator("main p", { hasText: "Lucky Wishbone is the teaching room" });
    await expect(paragraph).toHaveText(SENTENCE);
    const link = paragraph.locator("a");
    await expect(link).toHaveCount(1);
    await expect(link).toHaveText("Leagues");
    await expect(link).toHaveAttribute("href", "/mahjong-leagues-las-vegas");
    await expect(page.locator('main a[href="/mahjong-leagues-las-vegas"]')).toHaveCount(1);
  });

  // First built to look like plain text; the owner then approved the standard treatment, so
  // a visitor can see it is a link. It must match the page's other in-text links exactly.
  test("the link carries the same green in-text style as the page's other links", async ({ page }) => {
    await page.goto("/studio");
    const paragraph = page.locator("main p", { hasText: "Lucky Wishbone is the teaching room" });
    const link = paragraph.locator("a");
    const sibling = page.locator('main p a[href="/mahjong-lessons-las-vegas"]').first();
    expect(await link.evaluate(look)).toBe(await sibling.evaluate(look));
    expect(await link.evaluate(look)).not.toBe(await paragraph.evaluate(look));
  });

  test("the link leads to the leagues page", async ({ page }) => {
    await page.goto("/studio");
    await page.locator('main a[href="/mahjong-leagues-las-vegas"]').click();
    await expect(page).toHaveURL(/\/mahjong-leagues-las-vegas$/);
    await expect(page.locator("h1")).toHaveText("Mahjong Leagues in Las Vegas");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.lasvegasmahj.com/mahjong-leagues-las-vegas");
  });
});

// The footer link is the visitor page's route in from every page. Its label names who it is
// for, and it sits with the ways to play, not with private events: the visitor page is open
// play for people who already play.
for (const from of ["/", "/mahjong-corporate-las-vegas", "/mahjong-lessons-henderson"]) {
  test(`the footer on ${from} offers "Visiting Las Vegas?" and it leads to the visitor page`, async ({ page }) => {
    await page.goto(from);
    const link = page.locator('footer a[href="/play-mahjong-las-vegas"]');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveText("Visiting Las Vegas?");
    await link.click();
    await expect(page).toHaveURL(/\/play-mahjong-las-vegas$/);
    await expect(page.locator("h1")).toContainText("Looking for a Mahjong Game While Visiting");
  });
}

// Title tags only, in wording the owner chose. She asked for the headings and the share
// titles to stay as they were, so the H1 and og:title are pinned beside each title: neither
// may follow the title in a later tidy-up.
const TITLES = [
  {
    path: "/private-mahjong-lessons-las-vegas",
    title: "Private Mahjong Lessons in Las Vegas | Las Vegas Mahjong",
    h1: /^Private Mahjong Lessons at Our Studio$/,
    shareTitle: "Private Mahjong Lessons at Our Las Vegas Studio | Las Vegas Mahjong",
  },
  {
    path: "/rules/scoring",
    title: "American Mahjong Scoring Rules | Las Vegas Mahjong",
    h1: /Scoring and Payment$/,
    shareTitle: "Scoring and Payment Rules in American Mahjong | Las Vegas Mahjong",
  },
  {
    path: "/about",
    // Chosen by the owner on 2026-11-15, replacing the interim "18 Years at the Mahjong Table".
    title: "About Shauna | Las Vegas Mahjong",
    h1: /^Meet Shauna$/,
    shareTitle: "About Shauna | Las Vegas Mahjong",
  },
];

for (const t of TITLES) {
  test(`${t.path} has its approved title, with the same visible heading and share title as before`, async ({ page }) => {
    await page.goto(t.path);
    await expect(page).toHaveTitle(t.title);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(t.h1);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", t.shareTitle);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.lasvegasmahj.com${t.path}`);
  });
}
