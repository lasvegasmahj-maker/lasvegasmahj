import { test, expect } from "@playwright/test";

// What the browser actually does on desktop and on an iPhone viewport: click the real
// button, land on /contact, see a working form. Plus the round 1 behaviours most likely
// to regress underneath a CTA change.

const INQUIRY_PAGES = [
  { path: "/mahjong-corporate-las-vegas", ctas: ["Request a Quote", "Request a Corporate Quote"] },
  { path: "/corporate-team-building-las-vegas", ctas: ["Request a Quote"] },
  { path: "/conference-activities-las-vegas", ctas: ["Request a Quote"] },
  { path: "/convention-activities-las-vegas", ctas: ["Request a Quote", "Request a Convention Quote"] },
  {
    path: "/mahjong-parties-las-vegas",
    ctas: ["Plan Your Event", "Book a Birthday Party", "Get a Quote", "Book Your Event"],
  },
];

// Pinned to the values live on production at 55c5d04. These two pages rank at roughly
// position 1.2 and 2.3 for "mahjong lessons las vegas", so the guard asserts the actual
// strings, not merely that a title and a canonical exist.
const PROTECTED = [
  {
    path: "/",
    title: "Las Vegas Mahjong | Lessons, Events &amp; Open Play",
    canonical: "https://www.lasvegasmahj.com",
    h1: "Las VegasMahjong",
  },
  {
    path: "/mahjong-lessons-las-vegas",
    title: "Mahjong Lessons in Las Vegas | Las Vegas Mahjong",
    canonical: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas",
    h1: "Mahjong Lessons in Las Vegas",
  },
];

function h1Text(html: string) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return m ? m[1].replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").trim() : null;
}

async function sitemapPaths(request: import("@playwright/test").APIRequestContext) {
  const xml = await (await request.get("/sitemap.xml")).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || "/");
}

test.describe("quote CTAs land on /contact", () => {
  for (const page of INQUIRY_PAGES) {
    test(`${page.path}: every inquiry CTA href is /contact`, async ({ request }) => {
      const html = await (await request.get(page.path)).text();
      for (const label of page.ctas) {
        const re = new RegExp(`<a[^>]*href="([^"]+)"[^>]*class="btn-primary"[^>]*>${label}</a>`, "g");
        const found = [...html.matchAll(re)];
        expect(found.length, `${label} missing from ${page.path}`).toBeGreaterThan(0);
        for (const m of found) expect(m[1].split("?")[0], `${label} on ${page.path}`).toBe("/contact");
      }
    });

    test(`${page.path}: clicking the first CTA reaches a working contact form`, async ({ page: p }) => {
      await p.goto(page.path);
      const cta = p.getByRole("link", { name: page.ctas[0], exact: true }).first();
      await expect(cta).toBeVisible();
      await cta.click();
      await p.waitForURL(/\/contact(\?|$)/);
      expect(new URL(p.url()).pathname).toBe("/contact");
      await expect(p.getByRole("heading", { level: 1 })).toContainText("Contact");
      await expect(p.locator("#contact-name")).toBeVisible();
      await expect(p.locator("#contact-email")).toBeVisible();
      await expect(p.getByRole("button", { name: "Send Message" })).toBeVisible();
    });
  }

  test("no inquiry page still links to a homepage anchor from a button", async ({ request }) => {
    for (const page of INQUIRY_PAGES) {
      const html = await (await request.get(page.path)).text();
      const buttons = [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*class="btn-[^"]*"/g)].map((m) => m[1]);
      for (const href of buttons) {
        expect(href, `${page.path} button`).not.toMatch(/^\/#/);
        expect(href, `${page.path} button`).not.toBe("/");
      }
    }
  });
});

test.describe("/contact works end to end", () => {
  test("responds 200 with no redirect", async ({ request }) => {
    const res = await request.get("/contact", { maxRedirects: 0 });
    expect(res.status()).toBe(200);
  });

  test("the form posts and confirms", async ({ page }) => {
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "{}" })
    );
    await page.goto("/contact");
    await page.fill("#contact-name", "Test Planner");
    await page.fill("#contact-email", "planner@example.com");
    await page.selectOption("#contact-inquiry", "Corporate or Team Building");
    await page.fill("#contact-message", "Corporate offsite for 40 people in November.");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Message Sent!")).toBeVisible();
  });

  test("shows no phone number in copy or structured data", async ({ request }) => {
    const html = await (await request.get("/contact")).text();
    expect(html).not.toMatch(/847[.\s-]?609[.\s-]?3112|href="tel:/);
    expect(html).not.toContain('"telephone"');
  });

  test("Contact is reachable from the site nav on this viewport", async ({ page }) => {
    await page.goto("/mahjong-corporate-las-vegas");
    const navContact = page.locator('nav a[href="/contact"]').first();
    await expect(navContact, "the nav must carry a Contact link").toHaveCount(1);

    if (!(await navContact.isVisible())) {
      // On a phone the links sit behind the menu toggle; opening it must reveal Contact.
      const toggle = page.locator(".nav-toggle, .menu-toggle, [aria-label*='enu']").first();
      await expect(toggle, "a hidden nav link needs a toggle that reveals it").toHaveCount(1);
      await toggle.click();
    }
    await expect(navContact, "Contact must be visible after opening the menu").toBeVisible();
    await navContact.click();
    await page.waitForURL("**/contact");
    expect(new URL(page.url()).pathname).toBe("/contact");

    const footerContact = page.locator('footer a[href="/contact"]');
    await expect(footerContact).toHaveCount(1);
  });
});

test.describe("no phone number anywhere on the site", () => {
  test("every sitemap URL is clean", async ({ request }) => {
    const paths = await sitemapPaths(request);
    expect(paths.length).toBeGreaterThan(20);
    for (const p of paths) {
      const html = await (await request.get(p)).text();
      expect(html, p).not.toMatch(/847[.\s-]?609[.\s-]?3112|href="tel:/);
      expect(html, p).not.toContain('"telephone"');
    }
  });
});

test.describe("round 1 behaviour still holds", () => {
  test("bachelorette is a 301 to the parties page", async ({ request }) => {
    const res = await request.get("/blog/bachelorette-party-ideas-las-vegas", { maxRedirects: 0 });
    expect(res.status()).toBe(301);
    expect(new URL(res.headers()["location"], "http://localhost").pathname).toBe("/mahjong-parties-las-vegas");
  });

  test("Things To Do is 410 and noindex", async ({ request }) => {
    const res = await request.get("/blog/things-to-do-las-vegas-besides-gambling", { maxRedirects: 0 });
    expect(res.status()).toBe(410);
    expect(res.headers()["x-robots-tag"] || "").toContain("noindex");
  });

  test("protected pages keep their exact title, H1 and canonical", async ({ request }) => {
    for (const page of PROTECTED) {
      const html = await (await request.get(page.path)).text();
      expect(html, page.path).toContain(`<title>${page.title}</title>`);
      expect(html, page.path).toContain(`rel="canonical" href="${page.canonical}"`);
      expect(h1Text(html), page.path).toBe(page.h1.replace(/&amp;/g, "&"));
      expect((html.match(/<h1[\s>]/g) || []).length, `${page.path} h1 count`).toBe(1);
      expect(html.toLowerCase(), page.path).not.toContain("noindex");
      // This diff never touched these files; a button-styled /contact CTA here would mean it did.
      expect(html, page.path).not.toMatch(/<a[^>]*class="btn-[^"]*"[^>]*href="\/contact"|<a[^>]*href="\/contact"[^>]*class="btn-/);
    }
  });

  test("no commercial page is noindexed", async ({ request }) => {
    const commercial = [...INQUIRY_PAGES.map((p) => p.path), "/contact", "/private-mahjong-lessons-las-vegas", ...PROTECTED.map((p) => p.path)];
    for (const p of commercial) {
      const html = await (await request.get(p)).text();
      expect(html.toLowerCase(), p).not.toContain("noindex");
    }
  });
});

test.describe("internal links resolve", () => {
  test("no internal link on a sitemap page 404s, 5xxes, or loops", async ({ request }) => {
    const paths = await sitemapPaths(request);
    const targets = new Set<string>();
    for (const p of paths) {
      const html = await (await request.get(p)).text();
      for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) targets.add(m[1] || "/");
    }
    expect(targets.size).toBeGreaterThan(10);
    for (const t of targets) {
      // The retired post is a deliberate 410 and the retired bachelorette URL a deliberate
      // 301; neither is linked from a page, but guard the assertion anyway.
      if (t.startsWith("/blog/things-to-do")) continue;
      const res = await request.get(t, { maxRedirects: 0 });
      expect([200, 301, 308], `${t} returned ${res.status()}`).toContain(res.status());
      if (res.status() !== 200) {
        const to = new URL(res.headers()["location"], "http://localhost").pathname;
        expect(to, `${t} redirects to itself`).not.toBe(t);
        const second = await request.get(to, { maxRedirects: 0 });
        expect(second.status(), `${t} -> ${to} chains again`).toBe(200);
      }
    }
  });
});
