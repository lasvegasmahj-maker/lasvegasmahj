import { test, expect } from "@playwright/test";

// The two room cards on the homepage studio section are now whole-card links. What matters
// is that the entire card is the hit area, that it works by click, key and tap, and that
// nothing about the protected homepage moved to make it happen.

const CARDS = [
  {
    name: "Lucky Wishbone",
    selector: ".studio-room-card-teach",
    href: "/mahjong-lessons-las-vegas",
    cue: "Explore Lessons",
    heading: "Mahjong Lessons in Las Vegas",
  },
  {
    name: "Lucky Sevens",
    selector: ".studio-room-card-play",
    href: "/mahjong-open-play-las-vegas",
    cue: "Book Open Play",
    heading: "Mahjong Open Play in Las Vegas",
  },
];

test.describe("the room cards are links", () => {
  for (const card of CARDS) {
    test(`${card.name} is one link to ${card.href}, with its cue`, async ({ page }) => {
      await page.goto("/");
      const el = page.locator(`#studio a${card.selector}`);
      await expect(el).toHaveCount(1);
      await expect(el).toHaveAttribute("href", card.href);
      await expect(el).toContainText(card.name);
      await expect(el).toContainText(card.cue);
      // Same tab, normal internal navigation.
      expect(await el.getAttribute("target")).toBeNull();
      // A link inside a link would be invalid and would steal the hit area.
      expect(await el.locator("a").count(), "nested link inside the card").toBe(0);
    });

    test(`${card.name} navigates on click`, async ({ page }) => {
      await page.goto("/");
      await page.locator(`#studio a${card.selector}`).click();
      await expect(page).toHaveURL(new RegExp(`${card.href}$`));
      await expect(page.locator("h1")).toContainText(card.heading);
    });

    test(`${card.name} is reachable and activated by keyboard`, async ({ page, isMobile }) => {
      test.skip(isMobile, "keyboard journey is a desktop concern");
      await page.goto("/");
      const el = page.locator(`#studio a${card.selector}`);
      await el.focus();
      await expect(el).toBeFocused();
      // focus-visible has to actually paint something, or keyboard users get no cue.
      const ring = await el.evaluate((n) => {
        const s = getComputedStyle(n);
        return { width: s.outlineWidth, style: s.outlineStyle };
      });
      expect(ring.style, "no focus ring style").not.toBe("none");
      expect(parseFloat(ring.width), "focus ring has no width").toBeGreaterThan(0);
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp(`${card.href}$`));
    });

    test(`${card.name} is clickable across its whole area`, async ({ page }) => {
      await page.goto("/");
      const el = page.locator(`#studio a${card.selector}`);
      // elementFromPoint works in viewport coordinates, so the card has to be on screen.
      await el.scrollIntoViewIfNeeded();
      const box = (await el.boundingBox())!;
      // The far corners belong to the link, not just the text in the middle.
      for (const [dx, dy] of [
        [6, 6],
        [box.width - 6, 6],
        [6, box.height - 6],
        [box.width - 6, box.height - 6],
      ]) {
        const owns = await page.evaluate(
          ([x, y, sel]) => {
            const hit = document.elementFromPoint(x as number, y as number);
            return !!hit?.closest(sel as string);
          },
          [box.x + (dx as number), box.y + (dy as number), `a${card.selector}`],
        );
        expect(owns, `corner ${dx},${dy} is not part of the card`).toBe(true);
      }
      // Comfortable to tap: taller than the 44px minimum on any viewport.
      expect(box.height, "card is too short to tap comfortably").toBeGreaterThanOrEqual(44);
    });
  }

  test("a tap on the card body navigates on a phone", async ({ page, isMobile }) => {
    test.skip(!isMobile, "phone project only");
    await page.goto("/");
    const el = page.locator("#studio a.studio-room-card-play");
    await el.scrollIntoViewIfNeeded();
    const box = (await el.boundingBox())!;
    await page.touchscreen.tap(box.x + box.width - 12, box.y + box.height - 12);
    await expect(page).toHaveURL(/\/mahjong-open-play-las-vegas$/);
  });
});

test.describe("the section around them is untouched", () => {
  test("both accents and both existing buttons survive", async ({ page }) => {
    await page.goto("/");
    const teach = page.locator("#studio a.studio-room-card-teach");
    const play = page.locator("#studio a.studio-room-card-play");
    const colour = (l: typeof teach) =>
      l.locator(".studio-room-cue").evaluate((n) => getComputedStyle(n).color);
    expect(await colour(teach), "Wishbone lost its pink").toBe("rgb(233, 30, 140)");
    expect(await colour(play), "Sevens lost its green").toBe("rgb(57, 230, 57)");

    await expect(page.locator('#studio a.btn-primary[href="/studio"]')).toHaveText("See the Studio");
    await expect(page.locator('#studio a.btn-outline[href="/schedule"]')).toHaveText("See the Calendar");
  });

  test("the studio photograph and copy are still there", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#studio img")).toHaveCount(1);
    await expect(page.locator("#studio")).toContainText("8687 W. Sahara Ave., Suite 200");
    await expect(page.locator("#studio .studio-open-badge")).toHaveText("Now Open");
  });

  test("the cards do not shift the page as it loads", async ({ page }) => {
    await page.goto("/");
    await page.locator("#studio").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const cls = await page.evaluate(
      () =>
        new Promise<number>((res) => {
          let v = 0;
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) {
              const s = e as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
              if (!s.hadRecentInput) v += s.value ?? 0;
            }
          }).observe({ type: "layout-shift", buffered: true });
          setTimeout(() => res(Number(v.toFixed(4))), 600);
        }),
    );
    expect(cls).toBeLessThan(0.1);
  });
});

test("the protected homepage is unchanged", async ({ page }) => {
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
