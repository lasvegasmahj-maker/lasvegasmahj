import { test, expect, type Page } from "@playwright/test";

// Booking and inquiry journeys, fixed in the 2026-11-13 sprint. Nothing here submits a form or
// leaves for Bookwhen: Formspree is blocked, and the schedule checks only read the links.

const OPENER = { name: "Plan Your Event", exact: true } as const;

async function openModal(page: Page) {
  await page.route("https://formspree.io/**", (route) => route.abort());
  await page.goto("/");
  const trigger = page.getByRole("button", OPENER).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Plan Your Mahjong Experience" });
  await expect(dialog).toBeVisible();
  return { trigger, dialog };
}

const focusInside = (page: Page) =>
  page.evaluate(() => document.querySelector('[role="dialog"]')?.contains(document.activeElement) ?? false);

test.describe("the homepage Plan Your Event modal is a real dialog", () => {
  test("it opens as a named modal dialog and takes focus", async ({ page }) => {
    const { dialog } = await openModal(page);
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(await focusInside(page)).toBe(true);
  });

  test("Tab and Shift+Tab stay inside the dialog", async ({ page }) => {
    const { dialog } = await openModal(page);
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press("Tab");
      expect(await focusInside(page), `Tab ${i + 1} left the dialog`).toBe(true);
    }
    const close = dialog.getByRole("button", { name: "Close" });
    const send = dialog.getByRole("button", { name: "Send Message" });
    await send.focus();
    await page.keyboard.press("Tab");
    await expect(close).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(send).toBeFocused();
  });

  test("after a send, Tab still stays inside the dialog", async ({ page }) => {
    const { dialog } = await openModal(page);
    await page.unroute("https://formspree.io/**");
    await page.route("https://formspree.io/**", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
    );
    await page.fill("#contact-name", "Sprint Journey");
    await page.fill("#contact-email", "sprint@example.com");
    await page.fill("#contact-phone", "702-555-0100");
    await page.selectOption("#contact-inquiry", "Private Party or Celebration");
    await dialog.getByRole("button", { name: "Send Message" }).click();
    await expect(dialog.getByText("on our radar")).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
      expect(await focusInside(page), `Tab ${i + 2} left the dialog`).toBe(true);
    }
  });

  test("Escape closes it and puts focus back on Plan Your Event", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", OPENER).first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("focus that leaves the dialog some other way is brought back, as Safari's Tab order can do", async ({ page }) => {
    const { dialog } = await openModal(page);
    await page.evaluate(() => (document.querySelector("footer input") as HTMLElement | null)?.focus());
    expect(await focusInside(page)).toBe(true);
    await expect(dialog).toBeVisible();
  });

  test("closing returns focus to Plan Your Event even when pressing it did not focus it, as in Safari", async ({ page }) => {
    await page.route("https://formspree.io/**", (route) => route.abort());
    await page.goto("/");
    const trigger = page.getByRole("button", OPENER).first();
    await trigger.scrollIntoViewIfNeeded();
    const dialog = page.getByRole("dialog", { name: "Plan Your Mahjong Experience" });
    // A dispatched click never moves focus by itself, which is how Safari treats a pressed
    // button. Retried because a click that lands before hydration opens nothing.
    await expect(async () => {
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await trigger.dispatchEvent("click");
      await expect(dialog).toBeVisible({ timeout: 1000 });
    }).toPass();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("selecting text and letting go outside keeps the dialog and what was typed", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "a mouse drag; phones have no equivalent gesture");
    await openModal(page);
    const name = page.locator("#contact-name");
    await name.fill("Half Typed");
    const box = (await name.boundingBox())!;
    await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(4, box.y + box.height / 2, { steps: 8 });
    await page.mouse.up();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(name).toHaveValue("Half Typed");
  });

  test("a press inside keeps it open, and the backdrop still closes it", async ({ page, isMobile }) => {
    const { trigger, dialog } = await openModal(page);
    const heading = dialog.getByRole("heading", { name: "Plan Your Mahjong Experience" });
    const overlay = page.locator(".modal-overlay");
    if (isMobile) await heading.tap();
    else await heading.click();
    await expect(dialog).toBeVisible();
    if (isMobile) await overlay.tap({ position: { x: 5, y: 5 } });
    else await overlay.click({ position: { x: 5, y: 5 } });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
});

test.describe("schedule Book links say which session they book", () => {
  test("each Book link names its session and that it opens a new tab", async ({ page }) => {
    await page.route(/^https?:\/\/([a-z0-9-]+\.)*bookwhen\.com\//, (route) => route.abort());
    await page.goto("/schedule");
    const cards = page.locator("#calendar .sched-card");
    const count = await cards.count();
    test.skip(count === 0, "no sessions on the calendar right now");

    const names: string[] = [];
    const cardTexts: string[] = [];
    for (let i = 0; i < count; i++) {
      const card = cards.nth(i);
      const link = card.locator(".sched-book a");
      const visible = (await link.innerText()).trim();
      const title = (await card.locator(".sched-body > div").first().innerText()).trim();
      const name = await link.getAttribute("aria-label");
      expect(name, `card ${i + 1} has no accessible name of its own`).toBeTruthy();
      // The spoken name starts with the words on the button, so voice control still finds it.
      expect(name!.toLowerCase().startsWith(`${visible.toLowerCase()}: ${title.toLowerCase()}, `), name!).toBe(true);
      expect(name).toMatch(/\(opens in a new tab\)$/);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAccessibleName(name!);
      names.push(name!);
      cardTexts.push(await card.innerText());
    }
    expect(new Set(names).size, "two different sessions share a link name").toBe(new Set(cardTexts).size);
  });
});
