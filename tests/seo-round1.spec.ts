import { test, expect } from "@playwright/test";

// What the server actually sends: the 301, the 404 head, the Event JSON-LD, the cache
// headers on the decorative texture, and a full internal-link crawl.

const RETIRED = "/blog/bachelorette-party-ideas-las-vegas";

function withoutScripts(html: string) {
  return html.replace(/<script[\s\S]*?<\/script>/g, "");
}

async function sitemapPaths(request: import("@playwright/test").APIRequestContext) {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .map((p) => (p === "" ? "/" : p));
}

test.describe("bachelorette removal", () => {
  test("the retired URL 301s to the parties page", async ({ request }) => {
    const res = await request.get(RETIRED, { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(new URL(res.headers()["location"], "http://localhost").pathname)
      .toBe("/mahjong-parties-las-vegas");
  });

  test("following the redirect lands on a 200 parties page", async ({ request }) => {
    const res = await request.get(RETIRED);
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain("Mahjong");
  });

  test("no rendered page anywhere contains the word", async ({ request }) => {
    const paths = await sitemapPaths(request);
    expect(paths.length).toBeGreaterThan(20);
    for (const p of paths) {
      const html = await (await request.get(p)).text();
      expect(html.toLowerCase(), p).not.toContain("bachelorette");
    }
  });

  test("the sitemap no longer lists it", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).not.toContain("bachelorette");
  });
});

test.describe("things to do stays live but unpromoted", () => {
  const POST = "/blog/things-to-do-las-vegas-besides-gambling";

  test("still 200 and still indexable", async ({ request }) => {
    const res = await request.get(POST);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).not.toMatch(/<meta name="robots"[^>]*noindex/i);
    expect(html).toContain(`<link rel="canonical" href="https://www.lasvegasmahj.com${POST}"/>`);
  });

  test("still in the sitemap", async ({ request }) => {
    expect(await (await request.get("/sitemap.xml")).text()).toContain(POST);
  });

  test("no longer linked from the sitewide footer", async ({ request }) => {
    const home = await (await request.get("/")).text();
    const footer = home.slice(home.lastIndexOf("<footer"));
    expect(footer).not.toContain(POST);
  });

  test("still reachable from the blog index so it can gather Search Console data", async ({ request }) => {
    expect(await (await request.get("/blog")).text()).toContain(POST);
  });
});

test.describe("404 head", () => {
  test("returns 404 with a distinct title, noindex, and no canonical", async ({ request }) => {
    const res = await request.get("/a-page-that-does-not-exist-abc123");
    expect(res.status()).toBe(404);
    const html = await res.text();

    expect(html).toContain("<title>Page Not Found | Las Vegas Mahjong</title>");
    expect(html).not.toContain('rel="canonical"');
    expect(html).toMatch(/<meta name="robots" content="noindex"\/?>/);
    // The old bug shipped two contradicting robots tags.
    expect(html).not.toMatch(/content="index, follow"/);
  });

  test("real pages still carry their own canonical and are indexable", async ({ request }) => {
    for (const [path, canonical] of [
      ["/", "https://www.lasvegasmahj.com"],
      ["/contact", "https://www.lasvegasmahj.com/contact"],
      ["/mahjong-lessons-las-vegas", "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas"],
    ]) {
      const html = await (await request.get(path)).text();
      expect(html, path).toContain(`<link rel="canonical" href="${canonical}"/>`);
      expect(html, path).not.toMatch(/<meta name="robots"[^>]*noindex/i);
    }
  });
});

test.describe("/contact", () => {
  test("is a real crawlable page with complete metadata", async ({ request }) => {
    const res = await request.get("/contact");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("<title>Contact Las Vegas Mahjong | Lessons, Parties, Events</title>");
    expect(html).toMatch(/<meta name="description" content="Contact Las Vegas Mahjong about[^"]{60,}"/);
    expect(html).toContain('<link rel="canonical" href="https://www.lasvegasmahj.com/contact"/>');
    expect(html).toContain("8687 W. Sahara Ave., Suite 200");
    expect(html).toContain("lasvegasmahj@gmail.com");
  });

  test("has exactly one H1 and a working form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("#contact-name")).toBeVisible();
    await expect(page.locator("#contact-email")).toBeVisible();
    await expect(page.locator('main button[type="submit"]')).toHaveText("Send Message");
  });

  test("nav and footer Contact links point here, not at href=#", async ({ page, isMobile }) => {
    await page.goto("/mahjong-lessons-las-vegas");
    if (isMobile) await page.locator(".nav-toggle").click();
    await expect(page.locator('nav .nav-links a[href="/contact"]')).toBeVisible();
    await expect(page.locator('footer a[href="/contact"]')).toHaveCount(1);
    expect(await page.locator('a[href="#"]').count()).toBe(0);
  });

  test("publishes no phone number in visible copy", async ({ request }) => {
    const html = withoutScripts(await (await request.get("/contact")).text());
    expect(html).not.toMatch(/tel:|847[.\s-]?609[.\s-]?3112/);
  });
});

test("the personal phone number appears only in the LocalBusiness telephone field", async ({ request }) => {
  const paths = await sitemapPaths(request);
  const PHONE = /847[.\s-]?609[.\s-]?3112/;
  const visible: string[] = [];
  for (const p of paths) {
    const html = await (await request.get(p)).text();
    if (PHONE.test(withoutScripts(html))) visible.push(p);
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<")));
    const carriers = blocks.flatMap((b) => (Array.isArray(b) ? b : [b]))
      .filter((b) => PHONE.test(JSON.stringify(b)));
    for (const c of carriers) {
      expect(c["@id"], `${p}: unexpected schema node carries the phone`)
        .toBe("https://www.lasvegasmahj.com/#business");
      expect(PHONE.test(c.telephone ?? ""), `${p}: phone is outside the telephone field`).toBe(true);
    }
  }
  expect(visible, "phone number surfaced in visible copy").toEqual([]);
});

test.describe("/private-mahjong-lessons-las-vegas", () => {
  test("is live, studio-first, and priced by contact only", async ({ request }) => {
    const res = await request.get("/private-mahjong-lessons-las-vegas");
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain("Private Mahjong Lessons at Our Las Vegas Studio");
    expect(html).toContain('<link rel="canonical" href="https://www.lasvegasmahj.com/private-mahjong-lessons-las-vegas"/>');
    expect(html).toContain("Private lessons are taught at our studio inside Lucky Hare");
    expect(html).toContain("In home sessions are available by request");
    expect(withoutScripts(html)).not.toMatch(/\$\d/);
  });

  test("declares itself a child of the broad lessons page", async ({ request }) => {
    const html = await (await request.get("/private-mahjong-lessons-las-vegas")).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<")));
    const crumb = blocks.find((b) => b["@type"] === "BreadcrumbList");
    expect(crumb).toBeTruthy();
    expect(crumb.itemListElement.map((i: { item: string }) => i.item)).toEqual([
      "https://www.lasvegasmahj.com",
      "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas",
      "https://www.lasvegasmahj.com/private-mahjong-lessons-las-vegas",
    ]);
  });

  test("the broad page still owns the group offer", async ({ request }) => {
    const html = await (await request.get("/mahjong-lessons-las-vegas")).text();
    expect(html).toContain("$60");
    expect(html).toContain("/private-mahjong-lessons-las-vegas");
    expect(html).not.toMatch(/travel fee/i);
  });
});

test.describe("Event structured data on /schedule", () => {
  test("emits valid future Events with a real venue address and no invented fields", async ({ request }) => {
    const html = await (await request.get("/schedule")).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<")));
    const events = blocks.flatMap((b) => (Array.isArray(b) ? b : [b])).filter((b) => b["@type"] === "Event");

    expect(events.length).toBeGreaterThan(0);
    const now = Date.now();
    for (const ev of events) {
      expect(ev.name, JSON.stringify(ev)).toBeTruthy();
      expect(ev.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00[+-]\d{2}:\d{2}$/);
      expect(new Date(ev.startDate).getTime()).toBeGreaterThan(now - 36 * 3600 * 1000);
      expect(ev.location["@type"]).toBe("Place");
      expect(ev.location.address.streetAddress).toBe("8687 W. Sahara Ave., Suite 200");
      expect(ev.eventStatus).toBe("https://schema.org/EventScheduled");
      expect(ev.organizer["@id"]).toBe("https://www.lasvegasmahj.com/#business");
      expect(ev).not.toHaveProperty("offers");
      expect(ev).not.toHaveProperty("performer");
      expect(ev).not.toHaveProperty("aggregateRating");
    }
  });

  test("the visible schedule is unchanged", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page.locator("h1")).toContainText("Schedule");
    expect(await page.locator(".sched-card").count()).toBeGreaterThan(0);
  });
});

test.describe("LocalBusiness entity", () => {
  test("carries the studio street address and no stale geo tags", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1].replace(/\\u003c/g, "<")));
    const biz = blocks.flatMap((b) => (Array.isArray(b) ? b : [b]))
      .find((b) => b["@id"] === "https://www.lasvegasmahj.com/#business" && b.address);

    expect(biz).toBeTruthy();
    expect(biz.address.streetAddress).toBe("8687 W. Sahara Ave., Suite 200");
    expect(biz.address.postalCode).toBe("89117");
    expect(biz.hasMap).toContain("maps.app.goo.gl");
    expect(biz.founder.hasCredential.name).toBe("Certified Oh My Mahjong Instructor");
    expect(biz).not.toHaveProperty("priceRange");
    expect(html).not.toContain('name="geo.position"');
    expect(html).not.toContain('name="ICBM"');
  });
});

test.describe("decorative texture performance", () => {
  test("the optimized texture is served and cached immutably", async ({ request }) => {
    const res = await request.get("/tile-texture-v2.webp");
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("immutable");
    expect(Number(res.headers()["content-length"])).toBeLessThan(150_000);
  });

  test("the 431KB duplicate is gone", async ({ request }) => {
    expect((await request.get("/tile-texture.jpg")).status()).toBe(404);
  });
});

test.describe("no broken internal links", () => {
  test("every internal href on every indexed page resolves", async ({ request }) => {
    const paths = await sitemapPaths(request);
    const targets = new Set<string>();
    for (const p of paths) {
      const html = await (await request.get(p)).text();
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) targets.add(m[1]);
    }
    expect(targets.size).toBeGreaterThan(10);

    const broken: string[] = [];
    for (const t of targets) {
      const status = (await request.get(t, { maxRedirects: 0 })).status();
      if (status !== 200) broken.push(`${t} -> ${status}`);
    }
    expect(broken).toEqual([]);
  });
});
