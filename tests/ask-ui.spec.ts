import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";

// Real-user flows on /ask at desktop and mobile viewports. Network goes to the real API
// except where a failure is deliberately injected.

const SHOTS = "test-results/screens";

function shotName(page: Page, name: string) {
  fs.mkdirSync(SHOTS, { recursive: true });
  return `${SHOTS}/${test.info().project.name}-${name}.png`;
}

async function askAndWait(page: Page, question: string) {
  await page.getByLabel("Your American Mahjong rules question").fill(question);
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(page.locator(".ask-turn-answer:not(.ask-thinking)").last()).toBeVisible();
}

test.describe("/ask page", () => {
  test("metadata, canonical, headings, and schema are in place", async ({ page }) => {
    await page.goto("/ask");
    await expect(page).toHaveTitle("Ask a Mahjong Rule | Las Vegas Mahjong");
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc!.length).toBeGreaterThan(80);
    expect(desc!.length).toBeLessThanOrEqual(165);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.lasvegasmahj.com/ask");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", "https://www.lasvegasmahj.com/ask");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Ask a Mahjong Rule/);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Ask");
    await expect(page.locator("h1")).toContainText("Mahjong");
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = schemas.map((s) => JSON.parse(s)["@type"]);
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("WebPage");
    expect(types).not.toContain("FAQPage");
    await expect(page.locator("main")).toContainText("not affiliated with or endorsed by the National Mah Jongg League");
  });

  test("links back into Las Vegas Mahjong exist and stay on-site", async ({ page }) => {
    await page.goto("/ask");
    for (const href of ["/rules", "/mahjong-lessons-las-vegas", "/mahjong-open-play-las-vegas"]) {
      await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
    }
    const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
    for (const h of hrefs) expect(h).not.toMatch(/findmymahj/i);
  });

  test("starter chip, follow-up chip, typed question, and reset all work", async ({ page }) => {
    await page.goto("/ask");
    await page.getByRole("button", { name: "Can I use a joker in a pair?" }).click();
    await expect(page.locator(".ask-turn-user")).toHaveCount(1);
    const first = page.locator(".ask-turn-answer:not(.ask-thinking)").first();
    await expect(first).toBeVisible();
    await expect(first).toContainText(/never be used in a pair/i);
    await expect(first.locator(".ask-label")).toHaveText("Standard rule");
    await expect(first.locator(".ask-note a[href='/rules/jokers']")).toBeVisible();

    const chips = first.locator(".ask-followups .ask-chip");
    expect(await chips.count()).toBeGreaterThanOrEqual(2);
    const chipText = (await chips.first().textContent())!.trim();
    await chips.first().click();
    await expect(page.locator(".ask-turn-user")).toHaveCount(2);
    await expect(page.locator(".ask-turn-user").nth(1)).toHaveText(new RegExp(chipText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(page.locator(".ask-turn-answer:not(.ask-thinking)")).toHaveCount(2);
    await expect(first.locator(".ask-followups")).toHaveCount(0);

    const input = page.getByLabel("Your American Mahjong rules question");
    await input.fill("What about during the Charleston?");
    await input.press("Enter");
    await expect(page.locator(".ask-turn-answer:not(.ask-thinking)")).toHaveCount(3);
    await expect(page.locator(".ask-turn-answer:not(.ask-thinking)").nth(2)).toContainText(/charleston/i);

    await page.screenshot({ path: shotName(page, "conversation"), fullPage: true });

    await page.getByRole("button", { name: "Start a new question" }).click();
    await expect(page.locator(".ask-turn-user")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Can I use a joker in a pair?" })).toBeVisible();
  });

  test("thread survives a reload in the same tab", async ({ page }) => {
    await page.goto("/ask");
    await askAndWait(page, "Can I use a joker in a pair?");
    await page.reload();
    await expect(page.locator(".ask-turn-user")).toHaveCount(1);
  });

  test("API failure shows a helpful fallback with a link to the rules guide", async ({ page }) => {
    await page.goto("/ask");
    await page.route("**/api/ask", (route) => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false, error: "down" }) }));
    await askAndWait(page, "Can I use a joker in a pair?");
    const answer = page.locator(".ask-turn-failed");
    await expect(answer).toContainText("taking a break");
    await expect(answer.locator("a[href='/rules']")).toBeVisible();
    await expect(page.getByLabel("Your American Mahjong rules question")).toBeEnabled();
  });

  test("rate limit message is shown to the player", async ({ page }) => {
    await page.goto("/ask");
    await page.route("**/api/ask", (route) => route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ ok: false, error: "That is a lot of questions at once. Give it a minute and ask again.", fallback: "/rules" }) }));
    await askAndWait(page, "Can I use a joker in a pair?");
    await expect(page.locator(".ask-turn-failed")).toContainText("Give it a minute");
  });

  test("network drop shows the fallback instead of a blank screen", async ({ page }) => {
    await page.goto("/ask");
    await page.route("**/api/ask", (route) => route.abort());
    await askAndWait(page, "Can I use a joker in a pair?");
    await expect(page.locator(".ask-turn-failed")).toBeVisible();
  });

  test("keyboard and accessibility basics", async ({ page }) => {
    await page.goto("/ask");
    const input = page.getByLabel("Your American Mahjong rules question");
    await expect(input).toHaveAttribute("enterkeyhint", "send");
    await expect(page.locator(".ask-thread")).toHaveAttribute("aria-live", "polite");
    await expect(page.getByRole("button", { name: "Ask", exact: true })).toBeDisabled();
    await input.fill("joker");
    await expect(page.getByRole("button", { name: "Ask", exact: true })).toBeEnabled();
    await input.press("Tab");
    await expect(page.getByRole("button", { name: "Ask", exact: true })).toBeFocused();
    const fontSize = await input.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeGreaterThanOrEqual(16);
  });

  test("layout: no horizontal overflow, tap targets, sticky composer after answers", async ({ page }) => {
    await page.goto("/ask");
    await page.screenshot({ path: shotName(page, "empty"), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    for (const chip of await page.locator(".ask-chip").all()) {
      const box = (await chip.boundingBox())!;
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
    const askBox = (await page.getByRole("button", { name: "Ask", exact: true }).boundingBox())!;
    expect(askBox.height).toBeGreaterThanOrEqual(44);

    await page.getByRole("button", { name: "Can I use a joker in a pair?" }).click();
    await expect(page.locator(".ask-turn-answer:not(.ask-thinking)")).toHaveCount(1);
    await page.locator(".ask-turn-answer .ask-chip").first().click();
    await expect(page.locator(".ask-turn-answer:not(.ask-thinking)")).toHaveCount(2);
    await page.locator(".ask-turn-answer .ask-chip").first().click();
    await expect(page.locator(".ask-turn-answer:not(.ask-thinking)")).toHaveCount(3);

    const viewport = page.viewportSize()!;
    const composer = (await page.locator(".ask-composer").boundingBox())!;
    expect(composer.y + composer.height).toBeLessThanOrEqual(viewport.height + 1);
    expect(composer.y).toBeGreaterThanOrEqual(0);
    const overflowAfter = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflowAfter).toBeLessThanOrEqual(0);
    await page.screenshot({ path: shotName(page, "viewport-after-answers") });
  });
});

test.describe("entry points", () => {
  test("navigation link reaches /ask", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.locator(".nav-toggle").click();
    const link = page.locator('nav .nav-links a[href="/ask"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveText("Ask a Rule");
    await link.click();
    await expect(page).toHaveURL(/\/ask$/);
    await expect(page.locator("h1")).toContainText("Ask");
  });

  test("desktop nav does not wrap or overflow with the new link", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop only");
    for (const width of [1440, 1280, 1100, 1024, 900, 800]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");
      const nav = (await page.locator("nav").boundingBox())!;
      expect(nav.height, `nav height at ${width}px`).toBeLessThan(80);
      if (width > 1024) {
        await expect(page.locator(".nav-links"), `links visible at ${width}px`).toBeVisible();
        const links = (await page.locator(".nav-links").boundingBox())!;
        expect(links.height, `links on one row at ${width}px`).toBeLessThan(40);
      } else {
        await expect(page.locator(".nav-toggle"), `menu button at ${width}px`).toBeVisible();
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `overflow at ${width}px`).toBeLessThanOrEqual(0);
    }
  });

  test("homepage FAQ, rules index, learn page, and lessons page link to /ask", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('#faq a[href="/ask"]')).toHaveText("Ask a Mahjong Rule");
    for (const path of ["/rules", "/learn-mahjong", "/mahjong-lessons-las-vegas"]) {
      await page.goto(path);
      await expect(page.locator('main a[href="/ask"]').first()).toBeVisible();
    }
  });
});

test.describe("model clarification rendering", () => {
  test("a Quick check answer from the API renders with its label and chips, on desktop and phone", async ({ page, isMobile }) => {
    await page.route("**/api/ask", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, answer: "Are you asking about exchanging a joker from an exposure, or about a joker in a pair?", label: "clarify", kind: "clarify", followups: ["When can I exchange a joker?", "Can I use a joker in a pair?"], via: "model" }),
      })
    );
    await page.goto("/ask");
    await page.locator("#ask-input").fill("what can i do with a joker on the table");
    await page.locator("#ask-input").press("Enter");
    await expect(page.locator(".ask-label-clarify").last()).toHaveText("Quick check");
    await expect(page.getByText("Are you asking about exchanging a joker", { exact: false })).toBeVisible();
    await expect(page.locator(".ask-chip", { hasText: "When can I exchange a joker?" })).toBeVisible();
    await expect(page.locator("a", { hasText: /rules page/ })).toHaveCount(0);
    if (isMobile) await expect(page.locator("#ask-input")).toBeInViewport();
  });
});
