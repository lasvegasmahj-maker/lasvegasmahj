import { test, expect, type Page } from "@playwright/test";
import { OPEN_PLAY_PRICE_LINE } from "../lib/pricing";

// What a visitor and a crawler receive after the owner's final wording pass.

async function ldNodes(page: Page) {
  const out: Record<string, unknown>[] = [];
  for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
    const parsed = JSON.parse(raw);
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) out.push(node);
  }
  return out;
}

test.describe("/mahjong-open-play-las-vegas", () => {
  test("keeps its URL, canonical and H1, with the new title", async ({ page }) => {
    const res = await page.goto("/mahjong-open-play-las-vegas");
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle("Mahjong Open Play Las Vegas | Social American Mahjong");
    await expect(page.locator("h1")).toHaveText("Mahjong Open Play in Las Vegas");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.lasvegasmahj.com/mahjong-open-play-las-vegas");
    expect(await page.locator('meta[name="robots"]').count()).toBe(0);
  });

  test("shows the current price, and prices the service in its markup", async ({ page }) => {
    await page.goto("/mahjong-open-play-las-vegas");
    await expect(page.locator("main")).toContainText(OPEN_PLAY_PRICE_LINE);
    const service = (await ldNodes(page)).find((n) => n["@type"] === "Service") as { offers: { price: string }[] };
    expect(service.offers.map((o) => o.price)).toEqual(["20.00", "85.00"]);
  });

  test("the FAQ markup matches the visible FAQ", async ({ page }) => {
    await page.goto("/mahjong-open-play-las-vegas");
    const faq = (await ldNodes(page)).find((n) => n["@type"] === "FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    const section = page.locator("section", { has: page.locator("p.section-label", { hasText: "Questions?" }) });
    expect(faq.mainEntity.map((q) => q.name)).toEqual(await section.locator("h3").allTextContents());
    expect(faq.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(await section.locator("h3 + p").allTextContents());
  });

  test("sends visiting players to their own page", async ({ page }) => {
    await page.goto("/mahjong-open-play-las-vegas");
    await page.locator('main a[href="/play-mahjong-las-vegas"]').click();
    await expect(page).toHaveURL(/\/play-mahjong-las-vegas$/);
  });
});

test("the visitor page shows the same price, from the same place", async ({ page }) => {
  await page.goto("/play-mahjong-las-vegas");
  await expect(page.locator("main")).toContainText(OPEN_PLAY_PRICE_LINE);
});

test("the sitewide offer catalog prices Social Open Play", async ({ page }) => {
  await page.goto("/");
  const biz = (await ldNodes(page)).find((n) => n["@id"] === "https://www.lasvegasmahj.com/#business" && n.hasOfferCatalog) as {
    hasOfferCatalog: { itemListElement: { itemOffered: { name: string; offers?: { price: string }[] } }[] };
  };
  const openPlay = biz.hasOfferCatalog.itemListElement.find((o) => o.itemOffered.name === "Social Open Play")!;
  expect(openPlay.itemOffered.offers!.map((o) => o.price)).toEqual(["20.00", "85.00"]);
});
