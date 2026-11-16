import { test, expect, type Locator, type Page } from "@playwright/test";

// What the site hands to analytics, checked without an analytics account. A dataLayer array
// is planted before the page loads, which is all the tracker looks for, and every push is
// read back. No tag script loads, the form service is mocked, and nothing leaves the browser.

const ENDPOINT = "https://formspree.io/**";
type Push = Record<string, unknown>;

async function plantDataLayer(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
  });
}

const pushes = (page: Page) =>
  page.evaluate(() => (window as unknown as { dataLayer: Push[] }).dataLayer.filter((e) => typeof e.event === "string"));

// Lets a click be observed without leaving the page. The tracker listens in the capture
// phase and never cancels anything, so stopping the navigation afterwards changes nothing
// about what it records.
async function holdNavigation(page: Page) {
  await page.evaluate(() => document.addEventListener("click", (e) => e.preventDefault()));
}

// The listener is attached after hydration, so a click that lands first is not recorded.
// Navigation is held, which makes the click safe to repeat until the listener is there.
async function clickUntilRecorded(page: Page, link: Locator, event: string) {
  let hits: Push[] = [];
  await expect(async () => {
    await page.evaluate(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.length = 0;
    });
    await link.click();
    hits = (await pushes(page)).filter((e) => e.event === event);
    expect(hits).toHaveLength(1);
  }).toPass();
  return hits;
}

const TYPED = {
  name: "Analytics Probe Person",
  email: "probe.person@example.com",
  phone: "(702) 555-0188",
  message: "Private note that must never reach analytics",
};

async function fillForm(page: Page) {
  await page.fill("#contact-name", TYPED.name);
  await page.fill("#contact-email", TYPED.email);
  await page.fill("#contact-phone", TYPED.phone);
  await page.fill("#contact-message", TYPED.message);
}

test("a click on a link to the schedule is reported with the page it was clicked on", async ({ page }) => {
  await plantDataLayer(page);
  await page.goto("/studio");
  await holdNavigation(page);
  const hits = await clickUntilRecorded(page, page.locator('main a[href="/schedule"]').first(), "schedule_link_click");
  expect(hits[0]).toMatchObject({ link_url: "/schedule", page_path: "/studio" });
});

test("a click that leaves for Bookwhen is reported as a link click, never as a booking", async ({ page }) => {
  await plantDataLayer(page);
  await page.goto("/schedule");
  const out = page.locator('main a[href*="bookwhen.com"]').first();
  test.skip((await out.count()) === 0, "no Bookwhen link on the schedule right now");
  await holdNavigation(page);
  const hits = await clickUntilRecorded(page, out, "booking_link_click");
  expect(String(hits[0].link_domain)).toMatch(/(^|\.)bookwhen\.com$/);
  expect(hits[0]).toMatchObject({ page_path: "/schedule" });
  const all = await pushes(page);
  // The booking itself happens on bookwhen.com, where this site cannot see it, so no event
  // may claim one.
  expect(all.map((e) => String(e.event)).filter((n) => /purchase|booked|booking_complete|conversion/i.test(n))).toEqual([]);
});

test("a click on a tagged inquiry button reports that page's source slug", async ({ page }) => {
  await plantDataLayer(page);
  await page.goto("/mahjong-corporate-las-vegas");
  await holdNavigation(page);
  const hits = await clickUntilRecorded(page, page.locator('main a[href="/contact?source=corporate"]').first(), "contact_link_click");
  expect(hits[0]).toMatchObject({ link_url: "/contact", source_slug: "corporate", page_path: "/mahjong-corporate-las-vegas" });
});

test("a successful inquiry is reported apart from the attempt, and carries nothing the visitor typed", async ({ page }) => {
  await plantDataLayer(page);
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.goto("/contact?source=corporate");
  await fillForm(page);
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Message Sent!")).toBeVisible();

  const all = await pushes(page);
  const names = all.map((e) => e.event);
  expect(names).toContain("contact_form_attempt");
  expect(names).toContain("contact_form_success");
  expect(names).not.toContain("contact_form_error");
  expect(all.find((e) => e.event === "contact_form_success")).toMatchObject({
    source_label: "Corporate Events page",
    inquiry_type: "Corporate or Team Building",
  });

  // Only values the site itself defines may be sent: never a name, an address, a number or
  // the message.
  const sent = JSON.stringify(all);
  for (const value of Object.values(TYPED)) expect(sent).not.toContain(value);
  expect(sent).not.toMatch(/555-0188|example\.com/);
  for (const e of all.filter((x) => String(x.event).startsWith("contact_form"))) {
    expect(Object.keys(e).sort()).toEqual(["event", "inquiry_type", "source_label"]);
  }
});

test("a failed submission is reported as an error, never as a success", async ({ page }) => {
  await plantDataLayer(page);
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 500, contentType: "application/json", body: "{}" }));
  await page.goto("/contact?source=parties");
  await fillForm(page);
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect.poll(async () => (await pushes(page)).map((e) => e.event)).toContain("contact_form_error");
  const names = (await pushes(page)).map((e) => e.event);
  expect(names).not.toContain("contact_form_success");
  expect(names).not.toContain("contact_submit");
});

// The owner chose the direct GA4 tag on 2026-11-13. The tag hands events to Google through
// gtag("event", name, params) and also creates window.dataLayer, so this plants both, the way
// the real tag does, and records every gtag call. Nothing is sent to Google.
async function plantGa4(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void; gtagCalls: unknown[][] };
    w.dataLayer = [];
    w.gtagCalls = [];
    w.gtag = (...args: unknown[]) => {
      w.gtagCalls.push(args);
    };
  });
}

const gtagEvents = (page: Page) =>
  page.evaluate(() =>
    (window as unknown as { gtagCalls: unknown[][] }).gtagCalls.filter((c) => c[0] === "event").map((c) => ({ name: c[1] as string, params: c[2] as Push })),
  );

test("with the GA4 tag on the page, a click and an inquiry each reach GA4 once, with nothing typed", async ({ page }) => {
  await plantGa4(page);
  await page.goto("/studio");
  await holdNavigation(page);
  const link = page.locator('main a[href="/schedule"]').first();
  await expect(async () => {
    await page.evaluate(() => {
      (window as unknown as { gtagCalls: unknown[] }).gtagCalls.length = 0;
    });
    await link.click();
    expect((await gtagEvents(page)).filter((e) => e.name === "schedule_link_click")).toHaveLength(1);
  }).toPass();
  expect(await page.evaluate(() => (window as unknown as { dataLayer: Push[] }).dataLayer.filter((e) => typeof e.event === "string"))).toEqual([]);

  await page.route(ENDPOINT, (route) => route.fulfill({ status: 200, contentType: "application/json", body: "{}" }));
  await page.goto("/contact?source=corporate");
  await fillForm(page);
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Message Sent!")).toBeVisible();
  const events = await gtagEvents(page);
  expect(events.filter((e) => e.name === "contact_form_success")).toHaveLength(1);
  expect(events.find((e) => e.name === "contact_form_success")?.params).toMatchObject({
    source_label: "Corporate Events page",
    inquiry_type: "Corporate or Team Building",
  });
  const sent = JSON.stringify(await page.evaluate(() => (window as unknown as { gtagCalls: unknown[] }).gtagCalls));
  for (const value of Object.values(TYPED)) expect(sent).not.toContain(value);
});

test("with no analytics on the page, nothing is recorded and links still work", async ({ page }) => {
  // Only meaningful for a build with no analytics ID, which is how the site ships today.
  test.skip(!!(process.env.NEXT_PUBLIC_GA4_ID || process.env.NEXT_PUBLIC_GTM_ID), "this build has an analytics ID configured");
  await page.goto("/studio");
  expect(await page.evaluate(() => "dataLayer" in window)).toBe(false);
  await page.locator('main a[href="/schedule"]').first().click();
  await expect(page).toHaveURL(/\/schedule$/);
  expect(await page.evaluate(() => "dataLayer" in window)).toBe(false);
});
