import { test, expect, type Page } from "@playwright/test";

// Runs against a real production build at desktop and phone widths: what a planner and a
// crawler receive from the four new pages, and that the link system resolves.

const NEW_PAGES = [
  { path: "/las-vegas-meeting-planner-activities", h1: "Meeting Activities for Las Vegas Planners", title: "Las Vegas Meeting Planner Activities | Las Vegas Mahjong", crumbs: 3 },
  { path: "/corporate-event-activities-las-vegas", h1: "Corporate Event Activities in Las Vegas", title: "Corporate Event Activities in Las Vegas | Las Vegas Mahjong", crumbs: 3 },
  { path: "/incentive-group-activities-las-vegas", h1: "Incentive Group Activities in Las Vegas", title: "Incentive Group Activities in Las Vegas | Las Vegas Mahjong", crumbs: 3 },
  { path: "/trade-show-booth-activities-las-vegas", h1: "Trade Show Booth Activities in Las Vegas", title: "Trade Show Booth Activities in Las Vegas | Las Vegas Mahjong", crumbs: 4 },
];

async function ldNodes(page: Page) {
  const out: Record<string, unknown>[] = [];
  for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
    const parsed = JSON.parse(raw);
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) out.push(node);
  }
  return out;
}

for (const p of NEW_PAGES) {
  test.describe(p.path, () => {
    test("serves its title, one H1, a self canonical, the preview directives and a share card", async ({ page }) => {
      const res = await page.goto(p.path);
      expect(res?.status()).toBe(200);
      await expect(page).toHaveTitle(p.title);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(p.h1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.lasvegasmahj.com${p.path}`);
      expect(await page.locator('meta[name="robots"]').count()).toBe(0);
      await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute("content", /max-image-preview:large/);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `https://www.lasvegasmahj.com${p.path}`);
    });

    test("the FAQ markup matches the visible FAQ, and the breadcrumb has the right depth", async ({ page }) => {
      await page.goto(p.path);
      const nodes = await ldNodes(page);
      const faq = nodes.find((n) => n["@type"] === "FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
      const section = page.locator("section", { has: page.locator("p.section-label", { hasText: "Questions?" }) });
      expect(faq.mainEntity.map((q) => q.name)).toEqual(await section.locator("h3").allTextContents());
      expect(faq.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(await section.locator("h3 + p").allTextContents());
      const crumb = nodes.find((n) => n["@type"] === "BreadcrumbList") as { itemListElement: unknown[] };
      expect(crumb.itemListElement).toHaveLength(p.crumbs);
      const service = nodes.find((n) => n["@type"] === "Service") as { provider: Record<string, string> };
      expect(service.provider["@id"]).toBe("https://www.lasvegasmahj.com/#business");
    });

    test("every internal link on the page resolves", async ({ page, request }) => {
      await page.goto(p.path);
      const hrefs = await page.locator("main a[href^='/']").evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("href")!))]);
      for (const href of hrefs) {
        const res = await request.get(href, { maxRedirects: 0 });
        expect(res.status(), href).toBe(200);
      }
    });

    test("the quote button reaches the form with its attribution", async ({ page }) => {
      await page.goto(p.path);
      await page.locator("main section").first().locator("a.btn-primary").click();
      await expect(page).toHaveURL(/\/contact\?source=[a-z-]+$/);
      await expect(page.locator('input[name="source"]')).toHaveValue(/ page$/);
    });

    test("fits the viewport with no sideways scroll and no split buttons", async ({ page }) => {
      await page.goto(p.path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
      for (const btn of await page.locator("main a.btn-primary, main a.btn-outline").all()) {
        expect(await btn.evaluate((el) => el.getClientRects().length)).toBe(1);
      }
    });
  });
}

test("the corporate hub, team building, conference and convention pages link to the new pages", async ({ request }) => {
  const expectations: Record<string, string[]> = {
    "/mahjong-corporate-las-vegas": NEW_PAGES.map((p) => p.path).filter((p) => p !== "/trade-show-booth-activities-las-vegas"),
    "/corporate-team-building-las-vegas": ["/las-vegas-meeting-planner-activities", "/corporate-event-activities-las-vegas"],
    "/conference-activities-las-vegas": ["/las-vegas-meeting-planner-activities", "/trade-show-booth-activities-las-vegas", "/incentive-group-activities-las-vegas"],
    "/convention-activities-las-vegas": ["/trade-show-booth-activities-las-vegas", "/incentive-group-activities-las-vegas", "/corporate-event-activities-las-vegas"],
    "/play-mahjong-las-vegas": ["/incentive-group-activities-las-vegas"],
  };
  for (const [from, targets] of Object.entries(expectations)) {
    const html = await (await request.get(from)).text();
    for (const t of targets) expect(html, `${from} -> ${t}`).toContain(`href="${t}"`);
  }
});

test("the sitemap lists all four new pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const p of NEW_PAGES) expect(xml).toContain(`<loc>https://www.lasvegasmahj.com${p.path}</loc>`);
});
