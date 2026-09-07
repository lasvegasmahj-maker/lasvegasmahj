import { test, expect } from "@playwright/test";
import { STUDIO_MEDIA } from "../lib/studio-media";

test.describe("the FOX5 band on the homepage", () => {
  test("sits between the studio section and Our Why", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#press")).toBeVisible();
    const tops = await page.evaluate(() =>
      ["home", "studio", "press", "about"].map(
        (id) => document.getElementById(id)?.getBoundingClientRect().top ?? NaN,
      ),
    );
    expect(tops[0], "hero first").toBeLessThan(tops[1]);
    expect(tops[1], "studio second").toBeLessThan(tops[2]);
    expect(tops[2], "press third, above Our Why").toBeLessThan(tops[3]);
  });

  test("says FOX5 visited, and does not claim an endorsement", async ({ page }) => {
    await page.goto("/");
    const band = page.locator("#press");
    await expect(band.getByRole("heading", { level: 2 })).toContainText("As Seen on FOX5 Las Vegas");
    await expect(band).toContainText("FOX5 visited Las Vegas Mahjong for our Grand Opening");
    const text = (await band.innerText()).toLowerCase();
    for (const phrase of ["recommends", "endorse", "voted best", "award-winning"]) {
      expect(text, `homepage press band implies endorsement: ${phrase}`).not.toContain(phrase);
    }
  });

  test("shows both stories with outlet, headline, date and a working CTA", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#press .press-card");
    await expect(cards).toHaveCount(2);
    for (const item of STUDIO_MEDIA) {
      const card = page.locator(`#press a.press-card[href="${item.url}"]`);
      await expect(card, item.url).toHaveCount(1);
      await expect(card).toContainText("FOX5 Las Vegas");
      await expect(card).toContainText(item.headline);
      await expect(card).toContainText("September 2, 2026");
      await expect(card).toContainText("Watch on FOX5 Las Vegas");
      await expect(card).toHaveAttribute("target", "_blank");
      await expect(card).toHaveAttribute("rel", /noopener/);
    }
  });
});

test.describe("the FOX5 section on /studio", () => {
  test("renders larger, and explains the Grand Opening visit", async ({ page }) => {
    await page.goto("/studio");
    const band = page.locator("#press");
    await expect(band).toBeVisible();
    await expect(band.getByRole("heading", { level: 2 })).toContainText("As Seen on FOX5 Las Vegas");
    await expect(band).toContainText("FOX5 came to the studio for our Grand Opening");
    await expect(band.locator(".press-cards-full")).toHaveCount(1);
    await expect(band.locator(".press-card")).toHaveCount(2);
  });

  test("both links point at the exact official pages", async ({ page }) => {
    await page.goto("/studio");
    const hrefs = await page
      .locator("#press a.press-card")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")));
    expect(hrefs.sort()).toEqual(STUDIO_MEDIA.map((m) => m.url).sort());
  });

  test("card artwork loads and is decorative, so the headline is the accessible name", async ({ page }) => {
    test.slow();
    await page.goto("/studio");
    for (const el of await page.locator("#press .press-card img").all()) {
      await el.scrollIntoViewIfNeeded();
      await expect
        .poll(() => el.evaluate((n: HTMLImageElement) => n.complete && n.naturalWidth > 0), { timeout: 60_000 })
        .toBe(true);
      expect(await el.getAttribute("alt"), "card art duplicates the headline if it is named").toBe("");
    }
  });
});

test.describe("no third party media is loaded or framed", () => {
  test("neither page requests anything from a station host", async ({ page }) => {
    const foreign: string[] = [];
    page.on("request", (r) => {
      const u = r.url();
      if (/fox5vegas|gtv-cdn|cloudfront|anvato|gray-kvvu/i.test(u)) foreign.push(u);
    });
    for (const path of ["/", "/studio"]) {
      await page.goto(path);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(900);
    }
    expect(foreign, `station resources were fetched: ${foreign.join(", ")}`).toEqual([]);
  });

  test("no iframe or video element is added by the press sections", async ({ page }) => {
    for (const path of ["/", "/studio"]) {
      await page.goto(path);
      expect(await page.locator("#press iframe").count(), path).toBe(0);
      expect(await page.locator("#press video").count(), path).toBe(0);
    }
  });
});

test.describe("the About mention", () => {
  test("is one line that links to the studio coverage", async ({ page }) => {
    await page.goto("/about");
    const link = page.locator('main a[href="/studio#press"]');
    await expect(link).toHaveCount(1);
    await expect(link).toContainText("FOX5 Las Vegas");
    expect(await page.locator("main .press-card").count(), "About should not repeat the cards").toBe(0);
  });

  test("the link lands on the studio press section", async ({ page }) => {
    await page.goto("/about");
    await page.locator('main a[href="/studio#press"]').click();
    await expect(page).toHaveURL(/\/studio#press$/);
    await expect(page.locator("#press")).toBeVisible();
  });
});

test.describe("the protected pages are unchanged", () => {
  test("the homepage keeps its H1, title, canonical and hero copy", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Las Vegas Mahjong | Lessons, Events & Open Play");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.lasvegasmahj.com",
    );
    await expect(page.locator("h1.hero-title")).toHaveCount(1);
    await expect(page.locator(".hero-sub")).toContainText(
      "Our studio inside Lucky Hare on West Sahara is home base for the Las Vegas mahjong community",
    );
  });

  test("no layout shift from the press cards", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    const cls = await page.evaluate(
      () =>
        new Promise<number>((res) => {
          let v = 0;
          new PerformanceObserver((l) => {
            for (const e of l.getEntries() as PerformanceEntry[] & { hadRecentInput?: boolean; value?: number }[]) {
              if (!(e as { hadRecentInput?: boolean }).hadRecentInput) v += (e as { value?: number }).value ?? 0;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => res(Number(v.toFixed(4))), 600);
        }),
    );
    expect(cls, "the press cards shift the page").toBeLessThan(0.1);
  });
});
