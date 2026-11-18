type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const FB_STANDARD_EVENT: Record<string, string> = {
  lesson_inquiry: "Lead",
  contact_submit: "Contact",
  newsletter_signup: "Subscribe",
};

// Sends a conversion event to whichever analytics tools happen to be loaded
// (GA4, GTM dataLayer, Meta Pixel). It no-ops safely when none are configured,
// which is the case in production until the NEXT_PUBLIC_* IDs are set, so this
// never affects rendering or behavior.
export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  try {
    // The GA4 tag creates window.dataLayer too, so pushing the event there as well could
    // count it twice. Tag Manager (no gtag function) is the only case that needs the push.
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...params });
    }
    const fbEvent = FB_STANDARD_EVENT[name];
    if (fbEvent && typeof window.fbq === "function") {
      window.fbq("track", fbEvent, params);
    }
  } catch {
    // Analytics must never break the UI.
  }
}

// Link clicks go to GA4 or GTM only (the Meta Pixel receives just the three events mapped
// above), so with neither on the page there is nowhere for a click to be reported.
export function analyticsLoaded() {
  return typeof window.gtag === "function" || Array.isArray(window.dataLayer);
}

type LinkTarget = Pick<URL, "origin" | "hostname" | "pathname" | "search" | "hash">;
type CurrentPage = Pick<URL, "origin" | "pathname" | "search">;

const BOOKING_HOST = "bookwhen.com";
// Every Book button and league link opens this account's pages. Other Bookwhen pages, such as
// its privacy policy, are not booking links.
const BOOKING_PATH = "/lasvegasmahjong";
const SOURCE_SLUG = /^[a-z]+(-[a-z]+)*$/;

// Names a click on one of the three links worth measuring and returns null for every other
// link. Only the destination's host and path and a well-formed ?source= slug are reported:
// every other query string and fragment is dropped, so nothing else carried in a URL can reach
// analytics.
//
// No parameter names the page clicked on: GA4 records the page address with every event, and
// gtag.js takes a page_path parameter as its own page field, so one sent here never arrives.
//
// booking_link_click is a click that leaves for Bookwhen, not a booking. The booking itself
// happens on bookwhen.com, where this site cannot see it.
export function linkClickEvent(to: LinkTarget, page: CurrentPage): { name: string; params: EventParams } | null {
  // Every event carries the same three keys. GTM keeps a dataLayer value until something
  // overwrites it, so a key left out here would inherit whatever the previous click set.
  const params: EventParams = { link_url: to.pathname, link_domain: to.hostname, source_slug: undefined };

  if (to.hostname === BOOKING_HOST || to.hostname.endsWith(`.${BOOKING_HOST}`)) {
    if (to.pathname !== BOOKING_PATH && !to.pathname.startsWith(`${BOOKING_PATH}/`)) return null;
    return { name: "booking_link_click", params: { ...params, link_url: to.origin + to.pathname } };
  }
  if (to.origin !== page.origin) return null;
  // A jump within the page, such as #calendar on /schedule, resolves to /schedule but opens nothing.
  if (to.hash && to.pathname === page.pathname && to.search === page.search) return null;

  if (to.pathname === "/schedule") return { name: "schedule_link_click", params };
  if (to.pathname === "/contact") {
    const slug = new URLSearchParams(to.search).get("source") ?? "";
    return { name: "contact_link_click", params: { ...params, source_slug: SOURCE_SLUG.test(slug) ? slug : undefined } };
  }
  return null;
}
