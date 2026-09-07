/**
 * Schema.org JSON-LD helpers for Las Vegas Mahjong.
 * Import these in page.tsx files and render via:
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
 */

/* ── TYPES ── */

export interface EventSchemaInput {
  name: string;
  description: string;
  startDate: string; // ISO 8601, e.g. "2026-05-31T18:00:00-07:00"
  endDate: string;   // ISO 8601
  venueName: string;
  venueAddress: string; // Street address or empty string if unknown
  venueCity?: string;   // defaults to "Las Vegas"
  venueState?: string;  // defaults to "NV"
  ticketUrl?: string;
  price?: number;       // omit if TBD
  priceCurrency?: string; // defaults to "USD"
  imageUrl?: string;
  eventUrl?: string;    // canonical page for this event on lasvegasmahj.com
  eventStatus?: string; // full schema.org URL, defaults to EventScheduled
}

/* ── EVENT SCHEMA GENERATOR ── */

export function buildEventSchema(event: EventSchemaInput) {
  const offers: Record<string, unknown> = {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    ...(event.ticketUrl ? { url: event.ticketUrl } : {}),
  };

  if (typeof event.price === "number") {
    offers.price = event.price.toFixed(2);
    offers.priceCurrency = event.priceCurrency ?? "USD";
  }

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: event.eventStatus ?? "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venueName,
      address: {
        "@type": "PostalAddress",
        ...(event.venueAddress ? { streetAddress: event.venueAddress } : {}),
        addressLocality: event.venueCity ?? "Las Vegas",
        addressRegion: event.venueState ?? "NV",
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      "@id": "https://www.lasvegasmahj.com/#business",
      name: "Las Vegas Mahjong",
      url: "https://www.lasvegasmahj.com",
      email: "hello@lasvegasmahj.com",
    },
    image: event.imageUrl
      ? [event.imageUrl]
      : ["https://www.lasvegasmahj.com/hero-bg.jpg"],
    url: event.eventUrl ?? "https://www.lasvegasmahj.com",
    offers,
  };
}

/* ── BREADCRUMB SCHEMA HELPER ── */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.lasvegasmahj.com",
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: item.url,
      })),
    ],
  };
}

/* ── SCHEDULE EVENT SCHEMA ── */

// Only the studio address is verified, so an event anywhere else is skipped rather than
// given an address we cannot source. Google requires location.address to be a real street
// address, and inventing one for a partner venue would be a factual claim we cannot make.
const STUDIO_PLACE = {
  "@type": "Place",
  "@id": "https://www.lasvegasmahj.com/#studio",
  name: "Lucky Hare",
  address: {
    "@type": "PostalAddress",
    streetAddress: "8687 W. Sahara Ave., Suite 200",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    postalCode: "89117",
    addressCountry: "US",
  },
};

export interface ScheduleEventInput {
  title: string;
  description: string;
  url: string;
  startIso?: string;
  endIso?: string;
  venueKind: "studio" | "partner" | "unknown";
}

// No offers: Bookwhen gives us a booking URL but no price, and an Offer without price and
// priceCurrency adds no eligibility while inviting validator warnings.
export function buildScheduleEventSchema(events: ScheduleEventInput[]) {
  return events
    .filter((e) => e.startIso && e.venueKind === "studio")
    .map((e) => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: e.title,
      startDate: e.startIso,
      ...(e.endIso ? { endDate: e.endIso } : {}),
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: STUDIO_PLACE,
      ...(e.description ? { description: e.description } : {}),
      image: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
      // The first-party page that describes these sessions. Pointing this at the Bookwhen
      // booking host would hand the rich result's link to a third party; the booking link
      // stays where it always was, on the visible card.
      url: "https://www.lasvegasmahj.com/schedule",
      organizer: {
        "@type": "Organization",
        "@id": "https://www.lasvegasmahj.com/#business",
        name: "Las Vegas Mahjong",
        url: "https://www.lasvegasmahj.com",
      },
    }));
}
