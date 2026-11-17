import { test, expect, type Page } from "@playwright/test";

// Round 10, 2026-11-12: what a visitor, a keyboard user and a crawler get from the visible
// improvements the owner approved, against a real production build at desktop and phone
// widths.

async function ldNodes(page: Page) {
  const out: Record<string, unknown>[] = [];
  for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) {
    const parsed = JSON.parse(raw);
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) out.push(node);
  }
  return out;
}

test("the schedule's payment note and the business's structured data name the same four methods", async ({ page }) => {
  await page.goto("/schedule");
  // Stated beside the booking calendar, so the second half is what keeps it honest: only
  // card works at online checkout.
  await expect(page.locator("main")).toContainText("We accept card, cash, Venmo and Zelle; online checkout takes card only.");
  const business = (await ldNodes(page)).find((n) => n["@type"] === "LocalBusiness" && "paymentAccepted" in n);
  expect(business?.paymentAccepted).toBe("Cash, Credit Card, Venmo, Zelle");
});

test("the About page's structured data gives Instagram and TikTok to the business, not to Shauna", async ({ page }) => {
  await page.goto("/about");
  const person = (await ldNodes(page)).find((n) => n["@type"] === "Person") as { sameAs?: unknown; worksFor: { sameAs: string[] } };
  expect(person.sameAs).toBeUndefined();
  expect(person.worksFor.sameAs).toEqual(["https://www.instagram.com/lasvegasmahjong", "https://www.tiktok.com/@lasvegasmahjong"]);
});

test("every icon the page declares loads as an image, and the stock favicon is gone", async ({ page, request }) => {
  await page.goto("/");
  const icons = await page
    .locator('link[rel="icon"], link[rel="apple-touch-icon"]')
    .evaluateAll((els) => els.map((e) => ({ rel: e.getAttribute("rel")!, href: e.getAttribute("href")! })));
  // Browsers choose among every rel="icon" for a tab, so only the two pink-die files may be declared.
  expect(icons.filter((i) => i.rel === "icon").map((i) => new URL(i.href, page.url()).pathname).sort()).toEqual(["/favicon.ico", "/icon.png"]);
  expect(icons.some((i) => i.rel === "apple-touch-icon" && i.href.includes("apple-icon.png"))).toBe(true);
  for (const icon of icons) {
    const res = await request.get(icon.href);
    expect(res.status(), icon.href).toBe(200);
    expect(res.headers()["content-type"], icon.href).toMatch(/^image\//);
  }
  // The create-next-app favicon is exactly this many bytes.
  expect((await (await request.get("/favicon.ico")).body()).length).not.toBe(25931);
});

// The two local lesson pages. The owner confirmed that lessons happen at the studio, at
// customers' homes and at venues, including in Summerlin and Henderson, and asked that the
// studio be named as the one business location with no suggestion of a local branch.
const LOCAL_PAGES = [
  { path: "/mahjong-lessons-summerlin", slug: "summerlin", label: "Summerlin Lessons page", noBranch: "We do not have a separate studio in Summerlin." },
  { path: "/mahjong-lessons-henderson", slug: "henderson", label: "Henderson Lessons page", noBranch: "There is no Henderson branch." },
];

for (const p of LOCAL_PAGES) {
  test.describe(p.path, () => {
    test("names the studio as the one location and offers a home or venue lesson by request", async ({ page }) => {
      await page.goto(p.path);
      const main = page.locator("main");
      await expect(main).toContainText("8687 W. Sahara Ave., Suite 200");
      await expect(main).toContainText(p.noBranch);
      await expect(main).toContainText(/home or venue/);
      await expect(main).toContainText(/by request/i);
      await expect(main).not.toContainText(/come to you|we serve you|travel fee/i);
    });

    test("each way to learn has its own link, and the booking buttons still open the class section", async ({ page }) => {
      await page.goto(p.path);
      for (const href of ["/studio", "/schedule", "/private-mahjong-lessons-las-vegas", `/contact?source=${p.slug}`]) {
        await expect(page.locator(`main a[href="${href}"]`).first(), href).toBeVisible();
      }
      const buttons = await page.locator("main a.btn-primary").all();
      expect(buttons.length).toBeGreaterThan(0);
      for (const b of buttons) expect(await b.getAttribute("href")).toBe("/#classes");
    });

    test("the inquiry link reaches the contact form attributed to this page, with Private Lesson chosen", async ({ page }) => {
      await page.goto(p.path);
      await page.locator(`main a[href="/contact?source=${p.slug}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`/contact\\?source=${p.slug}$`));
      await expect(page.locator('input[name="source"]')).toHaveValue(p.label);
      await expect(page.locator("#contact-inquiry")).toHaveValue("Private Lesson");
    });

    test("the FAQ markup says exactly what the visible FAQ says, and the share text makes no travel promise", async ({ page }) => {
      await page.goto(p.path);
      const faq = (await ldNodes(page)).find((n) => n["@type"] === "FAQPage") as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
      const text = await page.locator("main").innerText();
      for (const q of faq.mainEntity) {
        expect(text, q.name).toContain(q.name);
        expect(text, q.name).toContain(q.acceptedAnswer.text);
      }
      expect(JSON.stringify(faq)).not.toMatch(/come to you|come to your/i);
      await expect(page.locator('meta[property="og:description"]')).not.toHaveAttribute("content", /come to you/i);
    });
  });
}

// Keyboard users. Links used to show only the browser's default ring, which is hard to see
// on navy; every link now gets the same green ring the Ask chips already had.
for (const target of [
  { page: "/studio", selector: 'main a[href="/mahjong-leagues-las-vegas"]', lands: /\/mahjong-leagues-las-vegas$/ },
  { page: "/about", selector: 'footer a[href="/play-mahjong-las-vegas"]', lands: /\/play-mahjong-las-vegas$/ },
]) {
  test(`keyboard: ${target.selector} on ${target.page} shows a green focus ring and Enter follows it`, async ({ page, isMobile }) => {
    test.skip(isMobile, "Tab-key focus is a keyboard concern, not a phone one");
    await page.goto(target.page);
    const link = page.locator(target.selector);
    for (let i = 0; i < 300; i++) {
      await page.keyboard.press("Tab");
      if (await link.evaluate((el) => el === document.activeElement)) break;
    }
    await expect(link).toBeFocused();
    const ring = await link.evaluate((el) => {
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth), color: s.outlineColor };
    });
    expect(ring).toEqual({ style: "solid", width: 2, color: "rgb(57, 230, 57)" });
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(target.lands);
  });
}

// Booking paths. Each of these was a small, measured snag on the way to a booking or an
// inquiry; the owner approved fixing labels, links and calls to action, nothing larger.
test.describe("booking paths", () => {
  test("the lessons page offers a direct way to the class dates", async ({ page }) => {
    await page.goto("/mahjong-lessons-las-vegas");
    // Every button on this page used to lead back to the homepage.
    const link = page.locator("main a.btn-outline", { hasText: "See the Class Schedule" });
    await expect(link).toHaveAttribute("href", "/schedule");
    await link.click();
    await expect(page).toHaveURL(/\/schedule$/);
  });

  test("the lessons page's two closing buttons never overlap, whatever the width", async ({ page }) => {
    // On a phone "Back to Homepage" used to wrap onto "Book a Lesson" and take a quarter to
    // a third of its tap area.
    for (const width of [360, 390, 430, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/mahjong-lessons-las-vegas");
      const section = page.locator("main section", { hasText: "Ready to Play?" });
      const book = await section.locator("a.btn-primary").boundingBox();
      const back = await section.locator("a.btn-outline").boundingBox();
      expect(book && back, `buttons render at ${width}px`).toBeTruthy();
      const overlapX = Math.min(book!.x + book!.width, back!.x + back!.width) - Math.max(book!.x, back!.x);
      const overlapY = Math.min(book!.y + book!.height, back!.y + back!.height) - Math.max(book!.y, back!.y);
      expect(overlapX > 0 && overlapY > 0, `buttons overlap at ${width}px`).toBe(false);
      // One box each: a button that wraps onto two lines reports more than one.
      for (const button of [section.locator("a.btn-primary"), section.locator("a.btn-outline")]) {
        expect(await button.evaluate((el) => el.getClientRects().length), `a button is split at ${width}px`).toBe(1);
      }
    }
  });

  test("the schedule's Private & Parties card leads to the inquiry form, attributed to the schedule", async ({ page }) => {
    await page.goto("/schedule");
    const link = page.locator("main a", { hasText: "Plan Something Private" });
    await expect(link).toHaveAttribute("href", "/contact?source=schedule");
    await link.click();
    await expect(page).toHaveURL(/\/contact\?source=schedule$/);
    await expect(page.locator('input[name="source"]')).toHaveValue("Schedule page");
    // Attribution only: this card covers lessons and parties, so the visitor chooses.
    await expect(page.locator("#contact-inquiry")).toHaveValue("");
  });

  test("the open play page's first button lands on the dates it promises", async ({ page }) => {
    await page.goto("/mahjong-open-play-las-vegas");
    await page.locator("main a.btn-primary", { hasText: "See Open Play Dates" }).first().click();
    await expect(page).toHaveURL(/\/schedule#calendar$/);
    await expect(page.locator("#calendar")).toBeInViewport();
  });
});

test("a made-up source name, or one that matches a built-in object property, falls back to the general bucket", async ({ page }) => {
  // ?source=constructor used to find Object's own constructor and leave the lead unattributed.
  for (const slug of ["constructor", "__proto__", "not-a-real-page"]) {
    await page.goto(`/contact?source=${slug}`);
    await expect(page.locator('input[name="source"]'), slug).toHaveValue("General (nav, footer or direct)");
    await expect(page.locator("#contact-inquiry"), slug).toHaveValue("");
  }
});
