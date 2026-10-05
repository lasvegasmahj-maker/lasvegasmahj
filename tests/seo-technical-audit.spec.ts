import { test, expect, type Page } from "@playwright/test";
import sitemap from "../app/sitemap";

// Technical SEO audit, 2026-10-04. Checks what a crawler and a phone actually receive from a
// production build: one consistent head on every sitemap URL, and layouts that hold at 320px.

const PROD = "https://www.lasvegasmahj.com";
const PATHS = sitemap().map((e) => e.url.replace(PROD, "") || "/");

async function ldTypes(page: Page) {
  const types: string[] = [];
  for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
    const parsed = JSON.parse(raw);
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) types.push(node["@type"]);
  }
  return types;
}

test("every sitemap URL is 200, self-canonical, keeps the preview directives and has one share image", async ({ request }) => {
  expect(PATHS.length).toBeGreaterThan(30);
  for (const p of PATHS) {
    const res = await request.get(p, { maxRedirects: 0 });
    expect(res.status(), p).toBe(200);
    const html = await res.text();
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    expect(canonical, p).toBe(p === "/" ? PROD : `${PROD}${p}`);
    expect(html, p).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
    expect(html, p).toMatch(/<meta name="googlebot" content="[^"]*max-image-preview:large/);
    expect(html.match(/<meta property="og:image" content=/g)?.length ?? 0, p).toBeGreaterThanOrEqual(1);
    const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    expect(ogUrl, p).toBe(canonical);
  }
});

test("the leagues page sends no robots meta of its own and a share image that loads", async ({ page, request }) => {
  await page.goto("/mahjong-leagues-las-vegas");
  expect(await page.locator('meta[name="robots"]').count()).toBe(0);
  const img = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(img).toMatch(/^https:\/\/www\.lasvegasmahj\.com\/.+\.jpg$/);
  const res = await request.get(img!.replace(PROD, ""));
  expect(res.status()).toBe(200);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
});

test("/schedule has a BreadcrumbList, and /learn-mahjong no HowTo", async ({ page }) => {
  await page.goto("/schedule");
  expect(await ldTypes(page)).toContain("BreadcrumbList");
  await page.goto("/learn-mahjong");
  const types = await ldTypes(page);
  expect(types).toContain("Article");
  expect(types).not.toContain("HowTo");
});

test("a 404 is noindex with no canonical and no og:url", async ({ request }) => {
  const res = await request.get("/no-such-page-technical-audit");
  expect(res.status()).toBe(404);
  const html = await res.text();
  expect(html).toMatch(/<meta name="robots" content="noindex"/);
  expect(html).not.toContain('rel="canonical"');
  expect(html).not.toContain('property="og:url"');
});

test("the homepage hero image is requested at high priority", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toMatch(/<img[^>]*fetchPriority="high"[^>]*src="\/_next\/image\?url=%2Fhero-bg\.jpg/i);
});

test.describe("phone layout", () => {
  test("the about story and the birthday section stack into one column on a phone", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone layout only");
    for (const [p, heading] of [
      ["/about", "18 Years, One"],
      ["/mahjong-parties-las-vegas", "Make Her Feel Like the"],
    ] as const) {
      await page.goto(p);
      const grid = page.locator(".split-stack", { has: page.locator("h2", { hasText: heading }) });
      const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").filter((t) => parseFloat(t) > 0).length);
      expect(cols, p).toBe(1);
    }
  });

  test("every changed section keeps its two desktop columns", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "desktop layout only");
    for (const [p, heading] of [
      ["/about", "18 Years, One"],
      ["/mahjong-parties-las-vegas", "Make Her Feel Like the"],
      ["/mahjong-parties-las-vegas", "What Guests Say"],
      ["/mahjong-corporate-las-vegas", "How a Corporate Mahjong Event"],
      ["/mahjong-corporate-las-vegas", "Corporate Testimonial"],
      ["/corporate-team-building-las-vegas", "What Happens at"],
      ["/las-vegas-meeting-planner-activities", "Where It Fits in"],
    ] as const) {
      await page.goto(p);
      const label = page.locator("h2, p.section-label", { hasText: heading }).first();
      const cols = await label.evaluate((el) => {
        let node: Element | null = el;
        while (node && getComputedStyle(node).display !== "grid") node = node.parentElement;
        // auto-fit keeps collapsed empty tracks as 0px in the computed value; count real ones.
        return node ? getComputedStyle(node).gridTemplateColumns.split(" ").filter((t) => parseFloat(t) > 0).length : 0;
      });
      expect(cols, `${p} ${heading}`).toBe(2);
    }
  });

  test("the above-the-fold image on /about and the convention page loads eagerly at high priority", async ({ page }) => {
    for (const p of ["/about", "/convention-activities-las-vegas"]) {
      await page.goto(p);
      const img = page.locator("main img").first();
      await expect(img, p).toHaveAttribute("fetchpriority", "high");
      expect(await img.getAttribute("loading"), p).not.toBe("lazy");
    }
  });

  test("nothing is wider than a 320px screen on the pages with auto-fit grids", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const p of [
      "/mahjong-parties-las-vegas",
      "/mahjong-corporate-las-vegas",
      "/corporate-team-building-las-vegas",
      "/las-vegas-meeting-planner-activities",
      "/about",
    ]) {
      await page.goto(p);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, p).toBe(0);
    }
  });
});
