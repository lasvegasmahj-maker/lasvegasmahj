import { test, expect, type Page } from "@playwright/test";

// Runs against a real production build, at desktop and phone widths. Checks what a visitor
// and a crawler actually receive from the new page, and the head changes on the pages that
// round 4 touched.

const PATH = "/play-mahjong-las-vegas";

async function ldNodes(page: Page) {
  const out: Record<string, unknown>[] = [];
  for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
    const parsed = JSON.parse(raw);
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (node["@graph"]) out.push(...node["@graph"]);
      else out.push(node);
    }
  }
  return out;
}

test.describe(PATH, () => {
  test("serves the owner's title and H1, a self canonical, and stays indexable", async ({ page }) => {
    const res = await page.goto(PATH);
    expect(res?.status()).toBe(200);
    await expect(page).toHaveTitle("Play Mahjong in Las Vegas | Open Play for Visitors");
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Looking for a Mahjong Game While Visiting Las Vegas?");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.lasvegasmahj.com${PATH}`);
    expect(await page.locator('meta[name="robots"]').count()).toBe(0);
    await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute("content", /max-image-preview:large/);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });

  test("the FAQ schema matches the questions on the page, one for one", async ({ page }) => {
    await page.goto(PATH);
    const faq = (await ldNodes(page)).find((n) => n["@type"] === "FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faq).toBeTruthy();
    const section = page.locator("section", { has: page.locator("h2", { hasText: "Playing While You Visit" }) });
    const questions = await section.locator("h3").allTextContents();
    expect(questions.length).toBeGreaterThanOrEqual(10);
    expect(faq.mainEntity.map((q) => q.name)).toEqual(questions);
    const answers = await section.locator("h3 + p").allTextContents();
    expect(faq.mainEntity.map((q) => q.acceptedAnswer.text)).toEqual(answers);
  });

  test("carries a two-level breadcrumb and no Event markup of its own", async ({ page }) => {
    await page.goto(PATH);
    const nodes = await ldNodes(page);
    const crumb = nodes.find((n) => n["@type"] === "BreadcrumbList") as { itemListElement: { item: string }[] };
    expect(crumb.itemListElement.map((i) => i.item)).toEqual([
      "https://www.lasvegasmahj.com",
      `https://www.lasvegasmahj.com${PATH}`,
    ]);
    expect(nodes.filter((n) => n["@type"] === "Event")).toHaveLength(0);
  });

  test("the primary call to action takes a visitor to the schedule", async ({ page }) => {
    await page.goto(PATH);
    const hero = page.locator("main section").first();
    await expect(hero.locator("a.btn-outline")).toHaveAttribute("href", "/studio");
    await hero.locator("a.btn-primary", { hasText: "See Open Play Dates" }).click();
    await expect(page).toHaveURL(/\/schedule$/);
  });

  test("lists upcoming studio Open Play from the booking feed, or says there is none", async ({ page }) => {
    await page.goto(PATH);
    const section = page.locator("#dates");
    const cards = section.locator(".sched-card");
    const count = await cards.count();
    if (count === 0) {
      await expect(section).toContainText("There are no Open Play sessions on the calendar right now");
    } else {
      expect(count).toBeLessThanOrEqual(4);
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toContainText(/open play/i);
        await expect(cards.nth(i).locator("a")).toHaveAttribute("href", /^https:\/\/bookwhen\.com\//);
      }
    }
    await expect(section.locator('a[href="/schedule"]')).toHaveCount(1);
  });

  test("the private group path carries its attribution", async ({ page }) => {
    await page.goto(PATH);
    await expect(page.locator('a[href="/contact?source=visitors"]')).toHaveCount(1);
  });

  test("fits the viewport with no sideways scroll", async ({ page }) => {
    await page.goto(PATH);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("publishes no phone number and no opening hours", async ({ page }) => {
    await page.goto(PATH);
    const html = await page.content();
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("telephone");
    expect(html).not.toContain("openingHours");
  });
});

test.describe("round 4 head changes elsewhere", () => {
  test("the schedule has a real title, a share image and the preview directives", async ({ request }) => {
    const html = await (await request.get("/schedule")).text();
    expect(html).toContain("<title>Mahjong Class &amp; Open Play Schedule | Las Vegas Mahjong</title>");
    expect(html).toMatch(/<meta property="og:image" content="https:\/\/www\.lasvegasmahj\.com\/studio-lucky-sevens-open-play\.jpg"/);
    expect(html).toContain('content="max-video-preview:-1, max-image-preview:large, max-snippet:-1"');
  });

  test("the studio keeps its canonical and gains the preview directives", async ({ request }) => {
    const html = await (await request.get("/studio")).text();
    expect(html).toContain('<link rel="canonical" href="https://www.lasvegasmahj.com/studio"/>');
    expect(html).toContain('content="max-video-preview:-1, max-image-preview:large, max-snippet:-1"');
    expect(html).not.toMatch(/<meta name="robots"[^>]*noindex/i);
  });

  test("the business names Lucky Hare and keeps one verified address", async ({ page }) => {
    await page.goto("/");
    const biz = (await ldNodes(page)).find(
      (n) => n["@id"] === "https://www.lasvegasmahj.com/#business" && n.address,
    ) as Record<string, unknown>;
    expect(biz).toBeTruthy();
    expect(biz.containedInPlace).toEqual({
      "@type": "Place",
      "@id": "https://www.lasvegasmahj.com/#studio",
      name: "Lucky Hare",
    });
    expect((biz.address as Record<string, string>).streetAddress).toBe("8687 W. Sahara Ave., Suite 200");
    expect((biz.address as Record<string, string>).postalCode).toBe("89117");
    expect(biz).not.toHaveProperty("telephone");
  });

  test("conference and convention pages now link to each other", async ({ request }) => {
    expect(await (await request.get("/conference-activities-las-vegas")).text()).toContain('href="/convention-activities-las-vegas"');
    expect(await (await request.get("/convention-activities-las-vegas")).text()).toContain('href="/conference-activities-las-vegas"');
  });

  test("the open play page links visitors to the new page", async ({ page }) => {
    await page.goto("/mahjong-open-play-las-vegas");
    await page.locator(`a[href="${PATH}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${PATH}$`));
  });
});
