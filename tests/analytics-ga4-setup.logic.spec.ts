import { test, expect } from "@playwright/test";
import { linkClickEvent } from "../lib/analytics";

// GA4 setup, 2026-11-18: what a link click reports.
//   - A Bookwhen click counts only when it opens this account's booking pages, and it is a
//     click, never a booking.
//   - No click event names the page it happened on. GA4 records the page address with every
//     event, and gtag.js takes a page_path parameter as its own page field, so it never arrives.

const SCHEDULE = new URL("https://www.lasvegasmahj.com/schedule");
const at = (href: string) => new URL(href, SCHEDULE);

test("a click to a booking page on Bookwhen is a booking-link click, without the query or fragment", () => {
  expect(linkClickEvent(at("https://bookwhen.com/lasvegasmahjong/e/ev-abc1-20261201100000?ref=x#y"), SCHEDULE)).toEqual({
    name: "booking_link_click",
    params: { link_url: "https://bookwhen.com/lasvegasmahjong/e/ev-abc1-20261201100000", link_domain: "bookwhen.com", source_slug: undefined },
  });
  expect(linkClickEvent(at("https://bookwhen.com/lasvegasmahjong"), SCHEDULE)?.name).toBe("booking_link_click");
});

test("other Bookwhen pages, such as its privacy policy, are not counted at all", () => {
  const privacy = new URL("https://www.lasvegasmahj.com/privacy");
  for (const href of ["https://bookwhen.com/privacy", "https://bookwhen.com/lasvegasmahjongs", "https://bookwhen.com/"]) {
    expect(linkClickEvent(at(href), privacy), href).toBeNull();
  }
});

test("no click event names the page it happened on", () => {
  const studio = new URL("https://www.lasvegasmahj.com/studio");
  for (const href of ["/schedule", "/contact?source=studio", "https://bookwhen.com/lasvegasmahjong"]) {
    const hit = linkClickEvent(at(href), studio);
    expect(hit, href).not.toBeNull();
    expect(Object.keys(hit?.params ?? {}).sort(), href).toEqual(["link_domain", "link_url", "source_slug"]);
  }
});
