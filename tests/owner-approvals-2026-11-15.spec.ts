import { test, expect, type Locator } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { OPEN_PLAY_PRICES, OPEN_PLAY_PRICE_LINE } from "../lib/pricing";
import { SHAUNA_NEON } from "../lib/studio-photos";

// What a visitor's browser gets from the owner's approval-gallery decisions of 2026-11-15.

const ROOT = path.join(__dirname, "..");
const sha256 = (b: Buffer) => crypto.createHash("sha256").update(b).digest("hex");

function contrast(fg: number[], bg: number[]) {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const [a, b] = [lum(fg), lum(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
const rgb = (css: string) => css.match(/[\d.]+/g)!.slice(0, 3).map(Number);

test("pink buttons keep white text at 4.5:1 or more at rest, on hover, while pressed and on focus", async ({ page, isMobile }) => {
  // In a 720px-tall window the hero's decorative scroll hint sits over the middle of this button
  // and takes the pointer (reported to the owner separately), so the desktop check uses 800px.
  if (!isMobile) await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  const colors = (el: Locator) =>
    el.evaluate((node) => {
      const s = getComputedStyle(node);
      return { bg: s.backgroundColor, fg: s.getPropertyValue("-webkit-text-fill-color") || s.color };
    });
  for (const button of [page.locator(".nav-cta"), page.locator(".hero .btn-primary").first()]) {
    await button.scrollIntoViewIfNeeded();
    const states = [await colors(button)];
    await button.hover();
    await page.waitForTimeout(300);
    states.push(await colors(button));
    await page.mouse.down();
    states.push(await colors(button));
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await button.focus();
    states.push(await colors(button));
    for (const s of states) {
      expect(s.bg).toBe("rgb(221, 29, 133)");
      expect(contrast(rgb(s.fg), rgb(s.bg))).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test("the homepage photo is the neon-sign studio photo", async ({ page }) => {
  await page.goto("/");
  const img = page.locator(".teacher-photo-wrapper img");
  await img.scrollIntoViewIfNeeded();
  await expect(img).toHaveAttribute("alt", SHAUNA_NEON.alt);
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  expect(decodeURIComponent(await img.evaluate((el: HTMLImageElement) => el.currentSrc))).toContain(SHAUNA_NEON.src);
});

test("share previews and business details name the studio photo, and it is served", async ({ page, request }) => {
  for (const route of ["/about", "/contact", "/mahjong-lessons-las-vegas", "/private-mahjong-lessons-las-vegas", "/mahjong-lessons-summerlin", "/mahjong-lessons-henderson"]) {
    await page.goto(route);
    const og = await page.locator('meta[property="og:image"]').evaluateAll((m) => m.map((e) => e.getAttribute("content")));
    expect(og, route).toEqual([`https://www.lasvegasmahj.com${SHAUNA_NEON.src}`]);
  }
  await page.goto("/");
  const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
  expect(ld).toContain(SHAUNA_NEON.src);
  expect(ld).not.toContain("shauna.jpg");
  const photo = await request.get(SHAUNA_NEON.src);
  expect(photo.status()).toBe(200);
  expect(photo.headers()["content-type"]).toBe("image/jpeg");
});

test("the iPhone home-screen icon is the approved pink die", async ({ page, request }) => {
  await page.goto("/");
  const link = page.locator('link[rel="apple-touch-icon"]');
  await expect(link).toHaveAttribute("sizes", "180x180");
  const res = await request.get((await link.getAttribute("href"))!);
  expect(res.status()).toBe(200);
  const served = sha256(await res.body());
  expect(served).toBe(sha256(fs.readFileSync(path.join(ROOT, "app/apple-icon.png"))));
  expect(served).toBe("72e5ca249e12ff4f09e7c64ac16245f23a03075da8d35dc9610f4d92e8d107b0");
});

test("the removed photos and the retired headshot are no longer served, directly or through the image optimizer", async ({ request }) => {
  for (const f of ["lvm-lesson-group.jpg", "lvm-private-game.jpg", "birthday-mat.jpg", "shauna.jpg"]) {
    expect((await request.get(`/${f}`)).status(), f).toBe(404);
    expect((await request.get(`/_next/image?url=%2F${f}&w=640&q=75`)).status(), f).toBeGreaterThanOrEqual(400);
  }
});

test("See the Calendar takes the click and the keyboard in a short laptop window", async ({ page, isMobile }) => {
  // 1280x720 is where the decorative scroll hint used to cover the middle of the button.
  if (!isMobile) await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/");
  const button = page.locator(".hero .btn-primary").first();
  await expect(page.locator(".hero-btns")).toHaveCSS("opacity", "1");
  const geometry = await button.evaluate((el) => {
    const b = el.getBoundingClientRect();
    const hint = document.querySelector(".scroll-hint")!.getBoundingClientRect();
    const hits = [[b.left + b.width / 2, b.top + b.height / 2], [b.left + b.width / 2, b.bottom - 2], [b.left + 4, b.bottom - 2], [b.right - 4, b.bottom - 2]]
      .filter(([, y]) => y < innerHeight)
      .map(([x, y]) => { const hit = document.elementFromPoint(x, y); return !!hit && (hit === el || el.contains(hit)); });
    return { clearOfHint: hint.top >= b.bottom, hits };
  });
  expect(geometry.clearOfHint).toBe(true);
  expect(geometry.hits.length).toBeGreaterThan(0);
  expect(geometry.hits.every(Boolean)).toBe(true);
  await button.click();
  await expect(page).toHaveURL(/\/schedule$/);
  await page.goBack();
  await page.locator(".hero .btn-primary").first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/schedule$/);
});

test("Open Play eligibility reads the owner's requirement on both pages and in the markup", async ({ page }) => {
  for (const route of ["/mahjong-open-play-las-vegas", "/play-mahjong-las-vegas"]) {
    await page.goto(route);
    await expect(page.locator("main")).toContainText("comfortable playing independently");
    await expect(page.locator("main")).not.toContainText(/completed Mahj 101|Mahj 101 graduates/i);
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    expect(ld, route).not.toMatch(/completed Mahj 101|Mahj 101 graduates|5-pack|85\.00/i);
  }
});

test("lessons chooser: Private Lessons, independent players, and the session price only", async ({ page }) => {
  await page.goto("/mahjong-lessons-las-vegas");
  await expect(page.getByRole("heading", { name: "Private Lessons", exact: true })).toBeVisible();
  const chooser = page.locator("#choose-your-lesson");
  await expect(chooser).toContainText("Best for: Players who already know American Mahjong and are comfortable playing independently.");
  await expect(chooser).toContainText(OPEN_PLAY_PRICE_LINE);
  await expect(chooser).not.toContainText(`$${OPEN_PLAY_PRICES.fivePack}`);
  await expect(chooser).not.toContainText(/5-pack|MAHJ101 completion|completed MAHJ101/i);
});

test("corporate At a Glance: the owner's two sentences, no tournament promise", async ({ page }) => {
  await page.goto("/mahjong-corporate-las-vegas");
  const glance = page.locator("section", { has: page.getByRole("heading", { name: /at a Glance/i }) });
  await expect(glance).toContainText("NMJL card arrangements are confirmed in your quote.");
  await expect(glance).toContainText("We confirm the venue, tables, chairs and setup arrangements when planning your event.");
  await expect(glance).not.toContainText(/tournament/i);
  await expect(glance.locator('a[href="/contact?source=corporate"]')).toHaveText("Request a Quote");
});

test("parties page closing line, with no word left alone on a line", async ({ page }) => {
  await page.goto("/mahjong-parties-las-vegas");
  const line = page.getByText("Mahjong equipment and instruction provided · We come to you · No experience needed");
  await expect(line).toBeVisible();
  for (const width of [320, 360, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    const together = await line.evaluate((el) => {
      const node = el.firstChild as Text;
      const top = (word: string) => {
        const range = document.createRange();
        const at = node.data.indexOf(word);
        range.setStart(node, at);
        range.setEnd(node, at + word.length);
        return range.getBoundingClientRect().top;
      };
      return Math.abs(top("No") - top("needed")) < 2 && Math.abs(top("We") - top("you")) < 2;
    });
    expect(together, `${width}px`).toBe(true);
  }
});

test("the approved titles render as written, and no page repeats the brand", async ({ page, request }) => {
  await page.goto("/about");
  await expect(page).toHaveTitle("About Shauna | Las Vegas Mahjong");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "About Shauna | Las Vegas Mahjong");
  await page.goto("/mahjong-lessons-las-vegas");
  await expect(page).toHaveTitle("Mahjong Lessons in Las Vegas | Las Vegas Mahjong");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Mahjong Lessons Las Vegas | Beginner-Friendly Classes");
  // The layout's template adds the brand to search titles, so a page title that also carries it
  // would show "Las Vegas Mahjong" twice. Checked on every sitemap page, for both kinds of title.
  const sitemap = await (await request.get("/sitemap.xml")).text();
  const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.lasvegasmahj\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  expect(routes.length).toBeGreaterThan(30);
  for (const route of routes) {
    const html = await (await request.get(route)).text();
    const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "";
    const share = (html.match(/<meta property="og:title" content="([^"]*)"/) ?? [])[1] ?? "";
    expect(title, route).not.toBe("");
    for (const t of [title, share]) {
      const brands = t.split("|").filter((part) => part.trim() === "Las Vegas Mahjong").length;
      expect(brands, `${route}: ${t}`).toBeLessThanOrEqual(1);
    }
  }
});

test("the homepage FAQ and the corporate pages carry the approved final wording", async ({ page }) => {
  await page.goto("/");
  const question = page.getByRole("button", { name: "How long does it take to learn?" });
  await question.click();
  await expect(page.getByText("Start with MAHJ101 and build your skills through practice and our follow-on classes.")).toBeVisible();
  for (const route of ["/mahjong-corporate-las-vegas", "/corporate-team-building-las-vegas", "/las-vegas-meeting-planner-activities", "/corporate-event-activities-las-vegas", "/incentive-group-activities-las-vegas"]) {
    await page.goto(route);
    await expect(page.locator("main"), route).not.toContainText(/tournament/i);
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    expect(ld, route).not.toMatch(/tournament/i);
  }
});

test("Learn Mahjong shows the two approved sentences and no one-lesson promise", async ({ page }) => {
  await page.goto("/learn-mahjong");
  const main = page.locator("main");
  await expect(main).toContainText("It looks intimidating at first, but it gets easier with practice.");
  await expect(main).toContainText("Start with MAHJ101 and build your skills through practice and our follow-on classes.");
  await expect(main).not.toContainText(/within one lesson|reading it confidently|after their first session/i);
});

// Every Formspree call below is intercepted, so no test sends a real message.
const FORMSPREE = "https://formspree.io/**";

test("the contact page's confirmation speaks as the team", async ({ page }) => {
  await page.route(FORMSPREE, (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.goto("/contact");
  await page.fill("#contact-name", "Team Voice");
  await page.fill("#contact-email", "teamvoice@example.com");
  await page.fill("#contact-phone", "(702) 555-0123");
  await page.selectOption("#contact-inquiry", "Something Else");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.locator(".form-success h4")).toHaveText("Message Sent!");
  await expect(page.locator(".form-success p")).toHaveText("Thanks for reaching out. We’ll be in touch soon!");
});

test("the homepage pop-up's confirmation speaks as the team", async ({ page }) => {
  await page.route(FORMSPREE, (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.goto("/");
  const cta = page.getByRole("button", { name: "Plan Your Event", exact: true }).first();
  await expect(cta).toBeVisible();
  await cta.click();
  const modal = page.locator(".modal-content");
  await expect(modal).toBeVisible();
  await modal.locator("#contact-name").fill("Team Voice");
  await modal.locator("#contact-email").fill("teamvoice@example.com");
  await modal.locator("#contact-phone").fill("(702) 555-0123");
  await modal.locator("#contact-inquiry").selectOption("Something Else");
  await modal.getByRole("button", { name: "Send Message" }).click();
  await expect(modal.locator(".form-success h4")).toHaveText("You’re on our radar!");
  await expect(modal.locator(".form-success p")).toHaveText("Thanks for reaching out. We’ll be in touch soon. Get ready to play!");
});

test("each curriculum card on the lessons page is one link, by keyboard and by pointer", async ({ page }) => {
  await page.goto("/mahjong-lessons-las-vegas");
  const cards = page.locator("a.lesson-card");
  await expect(cards).toHaveCount(4);
  const expected = [
    { num: "MAHJ101", title: "Absolute Beginners", price: "$60 per lesson", href: "/schedule#calendar" },
    { num: "MAHJ102", title: "Beyond the Basics", price: "$60 per lesson", href: "/schedule#calendar" },
    { num: "MAHJ103", title: "Confident Play", price: "$60 per lesson", href: "/schedule#calendar" },
    { num: "Private", title: "Private Lessons", price: "Contact for pricing", href: "/private-mahjong-lessons-las-vegas" },
  ];
  for (const [i, want] of expected.entries()) {
    const card = cards.nth(i);
    await expect(card).toHaveAttribute("href", want.href);
    await expect(card.locator("h3")).toHaveText(want.title);
    await expect(card).toContainText(want.num);
    await expect(card).toContainText(want.price);
    await expect(card.locator("li")).toHaveCount(5);
    // A link may not hold another link, button or field.
    await expect(card.locator("a, button, input, select, textarea, [tabindex]"), want.num).toHaveCount(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  // Keyboard: Tab reaches the card, a ring shows, Enter follows it.
  let reached = false;
  for (let i = 0; i < 80 && !reached; i++) {
    await page.keyboard.press("Tab");
    reached = await page.evaluate(() => document.activeElement?.classList.contains("lesson-card") ?? false);
  }
  expect(reached, "Tab never reached a curriculum card").toBe(true);
  const ring = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement as Element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(ring).toEqual({ style: "solid", width: "3px" });
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/schedule#calendar$/);
  await expect(page.locator("#calendar")).toBeVisible();

  // Pointer: a press anywhere in the card follows the link, not only on its title.
  await page.goto("/mahjong-lessons-las-vegas");
  await page.locator("a.lesson-card").nth(3).locator("li").first().click();
  await expect(page).toHaveURL(/\/private-mahjong-lessons-las-vegas$/);
});

test("a curriculum card shows it is a link when the pointer is over it", async ({ page, isMobile }) => {
  test.skip(isMobile, "a touch screen has no hover");
  await page.goto("/mahjong-lessons-las-vegas");
  const card = page.locator("a.lesson-card").first();
  await card.scrollIntoViewIfNeeded();
  const border = () => card.evaluate((el) => getComputedStyle(el).borderTopColor);
  const before = await border();
  await card.hover();
  await expect.poll(border).not.toBe(before);
  expect(await card.evaluate((el) => getComputedStyle(el).cursor)).toBe("pointer");
});
