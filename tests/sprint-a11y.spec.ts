import { test, expect, type Page } from "@playwright/test";

// Accessibility sprint, 2026-11-13: keyboard paths, form announcements, contrast steps,
// reduced motion and larger browser text. Each test pins one fix so it cannot quietly regress.

const FORM = "https://formspree.io/f/mwvrnjrb";

function contrast(fg: number[], bg: number[]) {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const lum = (c: number[]) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const [a, b] = [lum(fg), lum(bg)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function rgba(css: string) {
  const p = css.match(/[\d.]+/g)!.map(Number);
  return { rgb: p.slice(0, 3), a: p.length > 3 ? p[3] : 1 };
}

function over(fg: string, bg: number[]) {
  const { rgb, a } = rgba(fg);
  return rgb.map((v, i) => a * v + (1 - a) * bg[i]);
}

const NAVY = [26, 27, 110];
const NAVY_DARK = [17, 18, 74];

async function tabUntil(page: Page, predicate: () => boolean, max = 60) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(predicate)) return true;
  }
  return false;
}

test.describe("keyboard", () => {
  test("the first Tab reveals a skip link that moves focus into main", async ({ page, isMobile }) => {
    test.skip(isMobile, "Tab-key focus is a keyboard concern, not a phone one");
    for (const path of ["/", "/contact"]) {
      await page.goto(path);
      await page.keyboard.press("Tab");
      const skip = page.locator("a.skip-link");
      await expect(skip).toBeFocused();
      await expect(skip).toHaveText("Skip to main content");
      await expect(skip).toBeInViewport();
      await page.keyboard.press("Enter");
      await expect(page.locator("main")).toBeFocused();
      await page.keyboard.press("Tab");
      const inMain = await page.evaluate(() => !!document.activeElement?.closest("main"));
      expect(inMain, `next Tab on ${path} lands inside main`).toBe(true);
    }
  });

  test("the skip link points at the page's main on every kind of page", async ({ page }) => {
    for (const path of ["/", "/about", "/contact", "/schedule", "/rules", "/mahjong-lessons-las-vegas"]) {
      await page.goto(path);
      const href = await page.locator("a.skip-link").getAttribute("href");
      await expect(page.locator(`main${href}`), `skip target on ${path}`).toHaveCount(1);
    }
  });

  test("the homepage has one main landmark around its content", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main #faq")).toHaveCount(1);
    await expect(page.locator("main footer")).toHaveCount(0);
  });

  test("homepage FAQ questions are buttons that open and close by keyboard", async ({ page }) => {
    await page.goto("/");
    const buttons = page.locator(".faq-item h3 > button.faq-question");
    await expect(buttons).toHaveCount(8);
    const first = buttons.first();
    const panelId = await first.getAttribute("aria-controls");
    expect(panelId).toBeTruthy();
    await expect(page.locator(`#${panelId}`)).toBeHidden();
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(first).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(`#${panelId}`)).toBeVisible();
    await page.keyboard.press("Space");
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(`#${panelId}`)).toBeHidden();
  });

  test("the phone menu opens by keyboard, closes on Escape and never hides focus", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the menu button only shows below the nav breakpoint");
    await page.goto("/about");
    const toggle = page.locator(".nav-toggle");
    await expect(toggle).toHaveAttribute("aria-controls", "site-menu");
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#site-menu")).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(page.locator('#site-menu a[href="/studio"]')).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();

    // Tab past the last link: the menu closes, so the next stop is visible, not under the overlay.
    await page.keyboard.press("Enter");
    const links = await page.locator("#site-menu a").count();
    for (let i = 0; i <= links; i++) await page.keyboard.press("Tab");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    const uncovered = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return !!hit && (hit === el || el.contains(hit));
    });
    expect(uncovered).toBe(true);

    // Shift+Tab before the button closes it too.
    await toggle.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Shift+Tab");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".nav-logo")).toBeFocused();
  });

  test("the menu button is at least 44 by 44", async ({ page, isMobile }) => {
    test.skip(!isMobile, "the menu button only shows below the nav breakpoint");
    await page.goto("/");
    const box = (await page.locator(".nav-toggle").boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test("buttons and form fields show a green focus ring", async ({ page, isMobile }) => {
    test.skip(isMobile, "Tab-key focus is a keyboard concern, not a phone one");
    await page.goto("/");
    const faqButton = page.locator(".faq-question").first();
    await faqButton.scrollIntoViewIfNeeded();
    expect(await tabUntil(page, () => document.activeElement?.classList.contains("faq-question") ?? false, 120)).toBe(true);
    const ring = await faqButton.evaluate((el) => {
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth), color: s.outlineColor };
    });
    expect(ring).toEqual({ style: "solid", width: 2, color: "rgb(57, 230, 57)" });

    await page.goto("/contact");
    await page.locator("#contact-name").focus();
    const field = await page.locator("#contact-name").evaluate((el) => getComputedStyle(el).boxShadow);
    expect(field).toContain("rgb(57, 230, 57)");
  });
});

test.describe("forms", () => {
  test("contact form errors are tied to their fields and clear once fixed", async ({ page }) => {
    await page.route(FORM, (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
    await page.goto("/contact");
    await page.locator("main form button[type=submit]").click();
    for (const id of ["contact-name", "contact-email", "contact-phone", "contact-inquiry"]) {
      const field = page.locator(`#${id}`);
      await expect(field, id).toHaveAttribute("aria-invalid", "true");
      await expect(field, id).toHaveAttribute("aria-describedby", `${id}-error`);
      await expect(page.locator(`#${id}-error`), id).not.toBeEmpty();
      expect(await field.evaluate((el: HTMLInputElement) => el.required)).toBe(true);
    }
    await expect(page.locator("#contact-name")).toBeFocused();
    await page.fill("#contact-name", "Test Person");
    await expect(page.locator("#contact-name")).not.toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#contact-name-error")).toHaveCount(0);
    await expect(page.locator("#contact-email")).toHaveAttribute("aria-invalid", "true");
  });

  async function send(page: Page, status: number) {
    await page.route(FORM, (route) => route.fulfill({ status, contentType: "application/json", body: "{}" }));
    await page.goto("/contact");
    await page.fill("#contact-name", "Test Person");
    await page.fill("#contact-email", "test@example.com");
    await page.fill("#contact-phone", "7025550123");
    await page.selectOption("#contact-inquiry", "Private Lesson");
    await page.fill("#contact-message", "Line one\nLine two\nLine three\nLine four\nLine five\nLine six");
    await page.locator("main form button[type=submit]").click();
  }

  // The message must be both focused (read out, keyboard place kept) and on screen below the
  // fixed nav, at desktop and phone widths.
  async function expectRevealed(page: Page, selector: string) {
    const el = page.locator(selector);
    await expect(el).toBeFocused();
    await expect(el).toBeInViewport();
    await expect
      .poll(
        () =>
          el.evaluate((node) => {
            const r = node.getBoundingClientRect();
            const nav = document.querySelector("nav")!.getBoundingClientRect();
            return r.top >= nav.bottom - 1 && r.bottom <= innerHeight;
          }),
        { message: `${selector} sits between the nav and the bottom of the screen` },
      )
      .toBe(true);
  }

  test("a sent message moves focus to the confirmation and shows it", async ({ page }) => {
    await send(page, 200);
    await expect(page.locator(".form-success h4")).toHaveText("Message Sent!");
    await expectRevealed(page, ".form-success h4");
  });

  test("a failed send moves focus to the error and shows it", async ({ page }) => {
    await send(page, 500);
    const error = page.locator("main form p", { hasText: "Something went wrong" });
    await expect(error).toBeVisible();
    await expectRevealed(page, 'main form p[tabindex="-1"]');
    await page.keyboard.press("Shift+Tab");
    await expect(page.locator("main form button[type=submit]")).toBeFocused();
  });

  test("the homepage newsletter announces its message and marks the field", async ({ page }) => {
    await page.route("**/api/subscribe", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"result":"success","msg":"ok"}' }));
    await page.goto("/");
    const region = page.locator(".newsletter [role=status]");
    await expect(region).toHaveCount(1);
    await expect(region).toBeEmpty();
    const input = page.locator(".newsletter input[type=email]");
    await input.scrollIntoViewIfNeeded();
    await page.locator(".newsletter button[type=submit]").click();
    await expect(region).toContainText("Please enter your email.");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAttribute("aria-describedby", "newsletter-message");
    await input.fill("test@example.com");
    await page.locator(".newsletter button[type=submit]").click();
    await expect(region).toContainText("subscribed");
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
  });

  test("a failed signup marks the address invalid only when the address itself was refused", async ({ page }) => {
    let reply: "down" | "refused" | "offline" = "down";
    await page.route("**/api/subscribe", (route) => {
      if (reply === "offline") return route.abort();
      return reply === "down"
        ? route.fulfill({ status: 502, contentType: "application/json", body: '{"result":"error","msg":"Could not reach the subscription service. Please try again."}' })
        : route.fulfill({ status: 400, contentType: "application/json", body: '{"result":"error","msg":"Please enter a valid email address."}' });
    });
    await page.goto("/");
    for (const scope of [".newsletter", "footer"]) {
      reply = "down";
      const input = page.locator(`${scope} input[type=email]`);
      const submit = page.locator(`${scope} button[type=submit]`);
      const region = page.locator(`${scope} [role=status]`);
      await input.scrollIntoViewIfNeeded();
      await input.fill("test@example.com");
      await submit.click();
      await expect(region).toContainText("Could not reach");
      await expect(input, `${scope}: a service failure`).not.toHaveAttribute("aria-invalid", "true");
      reply = "refused";
      await submit.click();
      await expect(region).toContainText("valid email address");
      await expect(input, `${scope}: the address refused`).toHaveAttribute("aria-invalid", "true");
      reply = "offline";
      await submit.click();
      await expect(region).toContainText("Network hiccup");
      await expect(input, `${scope}: no connection`).not.toHaveAttribute("aria-invalid", "true");
    }
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the skip link's target is in the page as served", async ({ page }) => {
    for (const path of ["/about", "/mahjong-lessons-las-vegas", "/schedule", "/rules/jokers", "/privacy", "/no-such-page"]) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      const href = await page.locator("a.skip-link").getAttribute("href");
      await expect(page.locator(`main${href}`), `skip target on ${path}`).toHaveCount(1);
    }
  });
});

test.describe("contrast", () => {
  test("pink labels and quiet text hold WCAG AA", async ({ page }) => {
    await page.goto("/");
    const css = await page.evaluate(() => {
      const get = (sel: string, prop: string) => {
        const el = document.querySelector(sel);
        return el ? getComputedStyle(el).getPropertyValue(prop) : "";
      };
      return {
        label: get(".section-label", "color"),
        author: get(".testimonial-author", "color"),
        tierNumOpacity: get(".tier-num", "opacity"),
        tierNum: get(".tier-num", "color"),
        tierText: get(".tier p", "color"),
        pressDate: get(".press-card-date", "color"),
        pressCredit: get(".press-credit", "color"),
        instagram: get(".instagram-card p", "color"),
        footerBrand: get("footer .footer-brand > p", "color"),
        footerBottom: get("footer .footer-bottom", "color"),
      };
    });
    for (const bg of [NAVY, NAVY_DARK]) {
      expect(contrast(over(css.label, bg), bg), "section label").toBeGreaterThanOrEqual(4.5);
      expect(contrast(over(css.footerBrand, bg), bg), "footer text").toBeGreaterThanOrEqual(4.5);
      expect(contrast(over(css.footerBottom, bg), bg), "footer bottom line").toBeGreaterThanOrEqual(4.5);
      expect(contrast(over(css.pressCredit, bg), bg), "press credit").toBeGreaterThanOrEqual(4.5);
    }
    const card = over("rgba(255,255,255,0.03)", NAVY_DARK);
    expect(contrast(over(css.author, card), card), "review names").toBeGreaterThanOrEqual(4.5);
    expect(contrast(over(css.instagram, card), card), "social card lines").toBeGreaterThanOrEqual(4.5);
    const pressCard = over("rgba(255,255,255,0.04)", NAVY);
    expect(contrast(over(css.pressDate, pressCard), pressCard), "press dates").toBeGreaterThanOrEqual(4.5);
    const tierBg = over("rgba(255,255,255,0.03)", NAVY);
    const tierColor = rgba(css.tierNum).rgb;
    const tierLabel = tierColor.map((v, i) => Number(css.tierNumOpacity) * v + (1 - Number(css.tierNumOpacity)) * tierBg[i]);
    expect(contrast(tierLabel, tierBg), "class labels").toBeGreaterThanOrEqual(4.5);
    expect(contrast(over(css.tierText, tierBg), tierBg), "class descriptions").toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("motion", () => {
  test("reduced motion turns off smooth scrolling and the reveal animations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
    const reveal = await page.locator("#faq .reveal").first().evaluate((el) => ({ o: getComputedStyle(el).opacity, t: getComputedStyle(el).transform }));
    expect(reveal).toEqual({ o: "1", t: "none" });
    const hero = await page.locator(".hero-title").evaluate((el) => ({ o: getComputedStyle(el).opacity, a: getComputedStyle(el).animationName }));
    expect(hero).toEqual({ o: "1", a: "none" });

    await page.emulateMedia({ reducedMotion: "no-preference" });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("smooth");
  });
});

test.describe("layout", () => {
  // The footer headings became h2 (the outline jumped from h2 to h5 on every page); these are
  // the h5 values measured before the change, so the footer must look exactly the same.
  test("footer headings are h2 and render exactly as the old h5 did", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("footer h5")).toHaveCount(0);
    const heads = page.locator("footer .footer-col > h2");
    await expect(heads).toHaveText(["Events", "Lessons", "More", "Stay in the Loop"]);
    const styles = await heads.evaluateAll((els) =>
      els.map((el) => {
        const s = getComputedStyle(el);
        return { size: s.fontSize, weight: s.fontWeight, spacing: s.letterSpacing, transform: s.textTransform, color: s.color, lineHeight: s.lineHeight, margin: s.margin, font: s.fontFamily.split(",")[0], height: Math.round(el.getBoundingClientRect().height) };
      }),
    );
    for (const s of styles) {
      expect(s).toEqual({ size: "11.52px", weight: "700", spacing: "1.728px", transform: "uppercase", color: "rgb(57, 230, 57)", lineHeight: "17.28px", margin: "0px 0px 16px", font: "Montserrat", height: 17 });
    }
  });

  // Compares the class with a copy that carries the inline grid the class replaced, at the
  // default text size and at two larger browser text sizes, since the old gap was in rem.
  test("the About experience grid keeps the old columns and centres a short last row", async ({ page, isMobile, browserName }) => {
    test.skip(isMobile || browserName !== "chromium", "desktop Chromium: the text size is set through the DevTools protocol");
    const cdp = await page.context().newCDPSession(page);
    for (const [text, width] of [16, 24, 32].flatMap((t) => [390, 600, 768, 831, 832, 900, 1280].map((w) => [t, w] as const))) {
      if (width === 390) {
        await cdp.send("Page.setFontSizes", { fontSizes: { standard: text, fixed: 13 } });
        await page.goto("/about");
      }
      await page.setViewportSize({ width, height: 900 });
      const r = await page.evaluate(() => {
        const grid = document.querySelector(".about-experience-grid") as HTMLElement;
        const old = grid.cloneNode(true) as HTMLElement;
        old.className = "";
        old.setAttribute("style", "display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 2.5rem");
        grid.after(old);
        const boxes = (g: HTMLElement) => {
          const o = g.getBoundingClientRect();
          return [...g.children].map((c) => {
            const b = c.getBoundingClientRect();
            return { x: b.left - o.left, y: b.top - o.top, w: b.width, gw: o.width };
          });
        };
        const out = { reference: boxes(old), cls: boxes(grid), heights: [grid.getBoundingClientRect().height, old.getBoundingClientRect().height] };
        old.remove();
        return out;
      });
      const cls = r.cls;
      const perRow = cls.filter((c) => Math.abs(c.y - cls[0].y) < 1).length;
      const refPerRow = r.reference.filter((c) => Math.abs(c.y - r.reference[0].y) < 1).length;
      expect(perRow, `columns at ${width}px, text ${text}px`).toBe(refPerRow);
      expect(Math.abs(r.heights[0] - r.heights[1]), `grid height at ${width}px, text ${text}px`).toBeLessThan(0.5);
      const full = Math.floor(cls.length / perRow) * perRow;
      for (let i = 0; i < full; i++) {
        expect(Math.abs(cls[i].w - r.reference[i].w), `card ${i} width at ${width}px, text ${text}px`).toBeLessThan(0.5);
        expect(Math.abs(cls[i].x - r.reference[i].x), `card ${i} x at ${width}px, text ${text}px`).toBeLessThan(0.5);
      }
      const last = cls.slice(full);
      if (last.length) {
        const left = last[0].x;
        const right = last[0].gw - (last[last.length - 1].x + last[last.length - 1].w);
        expect(Math.abs(left - right), `last row centred at ${width}px, text ${text}px`).toBeLessThan(1);
        expect(Math.abs(last[0].w - cls[0].w), `last row card width at ${width}px, text ${text}px`).toBeLessThan(0.5);
      }
    }
  });
});
