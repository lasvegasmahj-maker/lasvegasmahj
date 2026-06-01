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
      name: "Las Vegas Mahjong",
      url: "https://lasvegasmahj.com",
      email: "lasvegasmahj@gmail.com",
    },
    image: event.imageUrl
      ? [event.imageUrl]
      : ["https://lasvegasmahj.com/hero-bg.jpg"],
    url: event.eventUrl ?? "https://lasvegasmahj.com",
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
        item: "https://lasvegasmahj.com",
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
