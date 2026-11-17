import { test, expect } from "@playwright/test";

// Round 9, 2026-11-10: what a link-preview fetcher and a crawler receive from the corporate
// cluster, the visitor page and the studio page. Nothing here is visible on the page.

const CORPORATE = [
  "/mahjong-corporate-las-vegas",
  "/corporate-team-building-las-vegas",
  "/conference-activities-las-vegas",
  "/convention-activities-las-vegas",
  "/corporate-event-activities-las-vegas",
  "/las-vegas-meeting-planner-activities",
  "/trade-show-booth-activities-las-vegas",
  "/incentive-group-activities-las-vegas",
];

for (const path of [...CORPORATE, "/play-mahjong-las-vegas", "/studio"]) {
  test(`${path} describes its share image: size and alt text, for both card formats`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", /^\d{3,4}$/);
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", /^\d{3,4}$/);
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /\S{3,}/);
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute("content", /\S{3,}/);
  });
}

for (const path of [...CORPORATE, "/mahjong-parties-las-vegas", "/private-mahjong-lessons-las-vegas", "/mahjong-lessons-summerlin", "/mahjong-lessons-henderson"]) {
  test(`${path} publishes a Service tied to its own canonical address`, async ({ page }) => {
    await page.goto(path);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`https://www.lasvegasmahj.com${path}`);
    const nodes = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
    const services = nodes.filter((n) => n["@type"] === "Service");
    expect(services).toHaveLength(1);
    expect(services[0]["@id"]).toBe(`${canonical}#service`);
    expect(services[0].url).toBe(canonical);
  });
}

for (const path of ["/learn-mahjong", "/mahjong-sets-guide"]) {
  test(`${path} shares as an article, matching its Article schema`, async ({ page }) => {
    await page.goto(path);
    const nodes = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t));
    expect(nodes.filter((n) => n["@type"] === "Article")).toHaveLength(1);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  });
}

test("every page in the sitemap describes its share image fully: type, size and alt text", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(paths.length).toBeGreaterThan(30);
  const missing: string[] = [];
  for (const p of paths) {
    const html = await (await request.get(p)).text();
    for (const prop of ["og:image", "og:image:type", "og:image:width", "og:image:height", "og:image:alt"]) {
      if (!new RegExp(`<meta property="${prop}" content="[^"]+"`).test(html)) missing.push(`${p} lacks ${prop}`);
    }
  }
  expect(missing).toEqual([]);
});
