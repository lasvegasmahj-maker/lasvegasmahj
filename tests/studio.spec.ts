import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { STUDIO_MEDIA } from "../lib/studio-media";

// Runs against a real production build. Covers the studio page itself, the homepage section
// under the hero, the ninth nav link at both desktop and phone widths, and a regression pass
// over the two pages that already rank.

// The nav collapses to the menu button at a width defined once, in app/globals.css. Reading
// it here instead of repeating the number keeps this test honest when the breakpoint moves.
function navBreakpoint(): number {
  const css = fs.readFileSync(path.join(__dirname, "..", "app", "globals.css"), "utf8");
  const m = css.match(/NAV_BREAKPOINT \*\/\s*@media \(max-width:\s*(\d+)px\)/);
  if (!m) throw new Error("the NAV_BREAKPOINT marker is gone from app/globals.css");
  return Number(m[1]);
}

function jsonLd(page: Page) {
  return page.locator('script[type="application/ld+json"]').allTextContents();
}

async function parsedLd(page: Page) {
  const out: Record<string, unknown>[] = [];
  for (const raw of await jsonLd(page)) {
    const parsed = JSON.parse(raw);
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (node["@graph"]) out.push(...node["@graph"]);
      else out.push(node);
    }
  }
  return out;
}

test.describe("/studio", () => {
  test("serves a 200 with one H1 naming the studio", async ({ page }) => {
    const res = await page.goto("/studio");
    expect(res?.status()).toBe(200);
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Our Mahjong Studio in Las Vegas");
  });

  test("declares its own canonical and an indexable robots directive", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.lasvegasmahj.com/studio",
    );
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots ?? "index").not.toContain("noindex");
  });

  test("the title and description are the ones the page shipped with", async ({ page }) => {
    await page.goto("/studio");
    await expect(page).toHaveTitle("Mahjong Studio in Las Vegas | Las Vegas Mahjong");
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toContain("Lucky Wishbone");
    expect(desc).toContain("Lucky Sevens");
  });

  test("Open Graph points at the studio, with a real studio photo", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://www.lasvegasmahj.com/studio",
    );
    const img = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(img).toContain("/lvm-openplay-room.jpg");
  });

  test("both rooms are described by name", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByRole("heading", { name: "Lucky Wishbone", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Lucky Sevens", exact: true })).toBeVisible();
    await expect(page.locator("body")).toContainText("teaching room");
    await expect(page.locator("body")).toContainText("playing room");
  });

  test("the verified address and the public email are on the page", async ({ page }) => {
    await page.goto("/studio");
    const body = page.locator("body");
    await expect(body).toContainText("8687 W. Sahara Ave., Suite 200");
    await expect(body).toContainText("Las Vegas, NV 89117");
    await expect(body).toContainText("Inside Lucky Hare");
    await expect(page.locator('a[href="mailto:hello@lasvegasmahj.com"]').first()).toBeVisible();
  });

  test("no phone number is rendered anywhere on the page", async ({ page }) => {
    await page.goto("/studio");
    const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    expect(text).not.toMatch(/\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/);
  });

  test("no price is rendered: pricing lives on the lesson pages", async ({ page }) => {
    await page.goto("/studio");
    expect(await page.locator("main").innerText()).not.toMatch(/\$\s?\d/);
  });

  test("the schedule and directions CTAs are both present", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.locator('main a[href="/schedule"]').first()).toBeVisible();
    await expect(
      page.locator('main a[href^="https://maps.app.goo.gl/"]').first(),
    ).toBeVisible();
  });

  test("the media section matches what lib/studio-media.ts actually holds", async ({ page }) => {
    await page.goto("/studio");
    const body = await page.locator("body").innerText();
    // Assert against the real heading the page renders, not a string it never emits, so the
    // empty branch cannot pass vacuously.
    const heading = "The Studio on Local News";
    if (STUDIO_MEDIA.length === 0) {
      expect(body, "an empty media list must render no section").not.toContain(heading);
      expect(body).not.toContain("In the Local Press");
      await expect(page.locator('a:has-text("Watch on")')).toHaveCount(0);
    } else {
      expect(body).toContain(heading);
      const links = page.locator('a:has-text("Watch on")');
      await expect(links).toHaveCount(STUDIO_MEDIA.filter((m) => m.url.startsWith("https://")).length);
      for (const href of await links.evaluateAll((els) => els.map((e) => e.getAttribute("href")!))) {
        expect(href, "a segment link must point at the station over https").toMatch(/^https:\/\//);
      }
    }
  });
});

test.describe("/studio structured data", () => {
  test("reuses the studio Place already used by the schedule", async ({ page }) => {
    await page.goto("/studio");
    const nodes = await parsedLd(page);
    const place = nodes.find((n) => n["@id"] === "https://www.lasvegasmahj.com/#studio") as
      | Record<string, unknown>
      | undefined;
    expect(place, "the studio Place node is missing").toBeTruthy();
    expect(place!["@type"]).toBe("Place");
    const address = place!.address as Record<string, string>;
    expect(address.streetAddress).toBe("8687 W. Sahara Ave., Suite 200");
    expect(address.postalCode).toBe("89117");
    expect(place!.hasMap).toContain("maps.app.goo.gl");
  });

  test("names both rooms as places inside the studio", async ({ page }) => {
    await page.goto("/studio");
    const nodes = await parsedLd(page);
    const place = nodes.find((n) => n["@id"] === "https://www.lasvegasmahj.com/#studio")!;
    const rooms = (place.containsPlace as { name: string }[]).map((r) => r.name);
    expect(rooms).toEqual(["Lucky Wishbone", "Lucky Sevens"]);
  });

  test("attaches the studio to the existing business rather than a new one", async ({ page }) => {
    await page.goto("/studio");
    const nodes = await parsedLd(page);
    // The sitewide LocalBusiness from app/layout.tsx is on this page too. Both nodes share
    // one @id on purpose, which is how the relation merges into the entity that already
    // exists rather than declaring a rival one.
    const business = nodes.filter((n) => n["@id"] === "https://www.lasvegasmahj.com/#business");
    expect(business.length).toBeGreaterThan(0);

    const linking = business.filter((n) => n.location) as Record<string, unknown>[];
    expect(linking, "exactly one node states where the business is").toHaveLength(1);
    expect((linking[0].location as Record<string, string>)["@id"]).toBe(
      "https://www.lasvegasmahj.com/#studio",
    );
    // The node this page adds carries the relation and nothing else that could conflict.
    expect(linking[0].address).toBeUndefined();
    expect(linking[0].hasOfferCatalog).toBeUndefined();

    // And the sitewide node still holds the verified address, unchanged.
    const canonical = business.find((n) => n.address) as Record<string, unknown>;
    expect((canonical.address as Record<string, string>).streetAddress).toBe(
      "8687 W. Sahara Ave., Suite 200",
    );
  });

  test("publishes no telephone and no opening hours", async ({ page }) => {
    await page.goto("/studio");
    for (const raw of await jsonLd(page)) {
      expect(raw).not.toContain("telephone");
      expect(raw).not.toContain("openingHours");
    }
  });

  test("emits a breadcrumb from Home to Studio", async ({ page }) => {
    await page.goto("/studio");
    const nodes = await parsedLd(page);
    const crumb = nodes.find((n) => n["@type"] === "BreadcrumbList") as Record<string, unknown>;
    expect(crumb).toBeTruthy();
    const items = crumb.itemListElement as { position: number; name: string; item: string }[];
    expect(items.map((i) => i.name)).toEqual(["Home", "Studio"]);
    expect(items[1].item).toBe("https://www.lasvegasmahj.com/studio");
  });

  test("every JSON-LD block on the page is valid JSON", async ({ page }) => {
    await page.goto("/studio");
    const blocks = await jsonLd(page);
    expect(blocks.length).toBeGreaterThan(0);
    for (const raw of blocks) expect(() => JSON.parse(raw)).not.toThrow();
  });
});

test.describe("the homepage studio section", () => {
  test("sits directly under the hero and before Our Why", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#studio");
    await expect(section).toBeVisible();

    const order = await page.evaluate(() => {
      const ids = ["home", "studio", "about"];
      return ids.map((id) => document.getElementById(id)?.getBoundingClientRect().top ?? NaN);
    });
    expect(order[0], "hero first").toBeLessThan(order[1]);
    expect(order[1], "studio before Our Why").toBeLessThan(order[2]);
  });

  test("leads with Now Open and names both rooms", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#studio");
    await expect(section.locator(".studio-open-badge")).toHaveText("Now Open");
    await expect(section).toContainText("Lucky Wishbone");
    await expect(section).toContainText("Lucky Sevens");
    await expect(section).toContainText("8687 W. Sahara Ave., Suite 200");
  });

  test("offers a studio CTA and a schedule CTA", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#studio");
    await expect(section.locator('a[href="/studio"]')).toHaveText("See the Studio");
    await expect(section.locator('a[href="/schedule"]')).toHaveText("See the Calendar");
  });

  test("its studio CTA lands on the studio page", async ({ page }) => {
    await page.goto("/");
    await page.locator('#studio a[href="/studio"]').click();
    await expect(page).toHaveURL(/\/studio$/);
    await expect(page.locator("h1")).toContainText("Our Mahjong Studio");
  });

  test("the section image loads and carries alt text", async ({ page }) => {
    await page.goto("/");
    const img = page.locator("#studio img").first();
    await img.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();
    expect(await img.getAttribute("alt")).toBeTruthy();
    const natural = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
    expect(natural, "the image actually decoded").toBeGreaterThan(0);
  });
});

test.describe("navigation", () => {
  test("Studio is reachable from the nav on this viewport", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.locator(".nav-toggle").click();
    const link = page.locator('nav .nav-links a[href="/studio"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveText("Studio");
    await link.click();
    await expect(page).toHaveURL(/\/studio$/);
  });

  test("all nine links stay reachable in the phone menu", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone project only");
    await page.goto("/");
    await page.locator(".nav-toggle").click();
    const links = page.locator("nav .nav-links a");
    await expect(links).toHaveCount(9);
    for (let i = 0; i < 9; i++) {
      const el = links.nth(i);
      await el.scrollIntoViewIfNeeded();
      await expect(el, `link ${i} is reachable`).toBeInViewport();
    }
  });

  test("the desktop bar does not overflow at its narrowest width", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop project only");
    // One pixel above the breakpoint is the tightest the horizontal bar ever gets with nine
    // links in it, so that is where wrapping would show up first.
    // Swept, not sampled: the spacing changes at more than one width, and it was a band
    // between two sampled points (1281px to 1370px) that overflowed unnoticed. The page
    // loads once and only the viewport changes, because media queries re-evaluate on resize
    // and seven navigations is what made this time out on a busy runner.
    await page.goto("/studio");
    for (const width of [navBreakpoint() + 1, 1300, 1366, 1439, 1440, 1512, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      const logo = (await page.locator(".nav-logo").boundingBox())!;
      const links = (await page.locator("nav .nav-links").boundingBox())!;
      const cta = (await page.locator("nav .nav-cta").boundingBox())!;
      expect(links.x, `links clear the logo at ${width}`).toBeGreaterThan(logo.x + logo.width - 1);
      expect(cta.x, `CTA clears the links at ${width}`).toBeGreaterThan(links.x + links.width - 1);
      expect(cta.x + cta.width, `CTA fits on screen at ${width}`).toBeLessThanOrEqual(width);
      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollW, `no horizontal page scroll at ${width}`).toBeLessThanOrEqual(width + 1);
      // A wrapped bar is taller than a single row. This is what the ninth link broke at
      // 1025px before the breakpoint moved.
      const navH = (await page.locator("nav").boundingBox())!.height;
      expect(navH, `the bar stays one row at ${width}`).toBeLessThan(80);
      expect(links.height, `the links stay one row at ${width}`).toBeLessThan(40);
    }
  });

  test("the menu button takes over just below the desktop breakpoint", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop project only");
    await page.goto("/studio");
    for (const width of [navBreakpoint(), 1024, 820]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator(".nav-toggle"), `toggle at ${width}`).toBeVisible();
      await expect(page.locator("nav .nav-links"), `bar hidden at ${width}`).toBeHidden();
    }
  });

  test("the footer links to the studio on every page", async ({ page }) => {
    for (const path of ["/", "/schedule", "/about"]) {
      await page.goto(path);
      await expect(page.locator('footer a[href="/studio"]'), path).toHaveCount(1);
    }
  });
});

test.describe("narrow phones", () => {
  test("nothing on /studio is clipped off the right edge at 320px", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone project only");
    // body sets overflow-x: hidden, so anything past the right edge is unreachable rather
    // than scrollable. An auto-fit track with a hard 300px minimum used to do exactly that.
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/studio");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "page is wider than the viewport").toBeLessThanOrEqual(0);
    const past = await page.evaluate(() =>
      [...document.querySelectorAll("main *")]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
        .map((el) => el.tagName + "." + (el.className || "").toString().slice(0, 30)),
    );
    expect(past, `elements past the right edge: ${past.join(", ")}`).toEqual([]);
  });

  test("the homepage studio section fits a 320px screen too", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone project only");
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/");
    const right = await page.locator("#studio").evaluate((el) => el.getBoundingClientRect().right);
    expect(right).toBeLessThanOrEqual(321);
  });
});

test.describe("routing and links", () => {
  test("the descriptive slug redirects to /studio with a 301", async ({ request }) => {
    const res = await request.get("/mahjong-studio-las-vegas", { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(res.headers()["location"]).toContain("/studio");
  });

  test("the sitemap lists the studio", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("https://www.lasvegasmahj.com/studio");
  });

  test("every internal link on /studio resolves", async ({ page, request }) => {
    await page.goto("/studio");
    const hrefs = await page.locator("a[href^='/']").evaluateAll((els) =>
      [...new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!))],
    );
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) {
      const res = await request.get(href.split("#")[0] || "/");
      expect(res.status(), href).toBe(200);
    }
  });

  test("every page that links to the studio still serves a 200", async ({ request }) => {
    for (const path of [
      "/",
      "/schedule",
      "/about",
      "/contact",
      "/mahjong-lessons-las-vegas",
      "/mahjong-open-play-las-vegas",
    ]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
  });

  test("security headers apply to the new route", async ({ request }) => {
    const res = await request.get("/studio");
    expect(res.headers()["x-frame-options"]).toBe("DENY");
    expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  });
});

test.describe("the ranking pages are unchanged", () => {
  test("the homepage keeps its H1, title and canonical", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Las Vegas Mahjong | Lessons, Events & Open Play");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.lasvegasmahj.com",
    );
    const h1 = page.locator("h1.hero-title");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Las Vegas");
    await expect(h1).toContainText("Mahjong");
  });

  test("the homepage hero copy is untouched", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".hero-sub")).toContainText(
      "Our studio inside Lucky Hare on West Sahara is home base for the Las Vegas mahjong community",
    );
  });

  test("the lessons page keeps its H1, title and canonical", async ({ page }) => {
    await page.goto("/mahjong-lessons-las-vegas");
    await expect(page).toHaveTitle("Mahjong Lessons in Las Vegas | Las Vegas Mahjong");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas",
    );
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("Mahjong Lessons in Las Vegas");
  });

  test("the lessons page keeps its booking CTA and gains only a studio link", async ({ page }) => {
    await page.goto("/mahjong-lessons-las-vegas");
    await expect(page.locator('a.btn-primary[href="/#classes"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/studio"]')).toHaveCount(1);
  });
});
