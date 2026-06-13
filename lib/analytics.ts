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
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
    if (Array.isArray(window.dataLayer)) {
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
