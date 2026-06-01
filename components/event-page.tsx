/**
 * EventPage — reusable server component for individual event SEO pages.
 *
 * Usage (in app/events/[slug]/page.tsx):
 *   import EventPage from "@/components/event-page";
 *   export default function CafeLolaPage() {
 *     return <EventPage {...cafeLolaEvent} />;
 *   }
 *
 * The component is intentionally a Server Component (no "use client").
 * Interactive bits (contact modal) are handled by SubpageNav.
 */

import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import { buildEventSchema } from "@/lib/schema";

/* ── PROP TYPES ── */

export interface EventPageProps {
  /** Full event name, e.g. "Cafe Lola Open Play Mahjong Party" */
  name: string;
  /** ISO 8601 with timezone offset, e.g. "2026-05-31T18:00:00-07:00" */
  startDate: string;
  /** ISO 8601 with timezone offset */
  endDate: string;
  /** Venue display name, e.g. "Cafe Lola" */
  venueName: string;
  /** Street address — include if known */
  venueAddress?: string;
  /** City, defaults to "Las Vegas" */
  venueCity?: string;
  /** State, defaults to "NV" */
  venueState?: string;
  /** Short paragraph description (1-3 sentences) — used in meta and hero */
  description: string;
  /** Full richtext body paragraphs — shown under the hero */
  body?: string[];
  /** Ticket or RSVP URL */
  ticketUrl?: string;
  /** Display price string, e.g. "$25" or "Free" */
  price?: string;
  /** Numeric price for JSON-LD Offer, e.g. 25 */
  priceAmount?: number;
  /** Hero/OG image URL */
  imageUrl?: string;
  /** Canonical URL for this event page on lasvegasmahj.com */
  canonicalUrl: string;
  /** Event tag for display badge */
  tag?: "open-play" | "tournament" | "lessons" | "charity" | "special";
  /** What to bring / what's included bullets */
  whatToKnow?: string[];
  /** Past event recap content — shown after the event date has passed */
  recapBody?: string[];
  /** Testimonials collected after the event */
  testimonials?: { quote: string; name: string }[];
  /** Related upcoming event slugs to link to */
  relatedEventSlugs?: { slug: string; name: string; date: string }[];
  /** Override the schema.org eventStatus URL (defaults to EventScheduled) */
  eventStatus?: string;
}

/* ── HELPERS ── */

const TAG_COLORS: Record<string, string> = {
  "open-play": "var(--green)",
  tournament: "#ff6b35",
  lessons: "var(--pink)",
  charity: "var(--gold)",
  special: "var(--pink)",
};

function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

function formatDisplayTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
    timeZoneName: "short",
  });
}

function isPastEvent(startDate: string): boolean {
  return new Date(startDate) < new Date();
}

/* ── COMPONENT ── */

export default function EventPage(props: EventPageProps) {
  const {
    name,
    startDate,
    endDate,
    venueName,
    venueAddress,
    venueCity = "Las Vegas",
    venueState = "NV",
    description,
    body = [],
    ticketUrl,
    price,
    priceAmount,
    imageUrl,
    canonicalUrl,
    tag,
    whatToKnow = [],
    recapBody = [],
    testimonials = [],
    relatedEventSlugs = [],
    eventStatus,
  } = props;

  const past = isPastEvent(startDate);
  const displayDate = formatDisplayDate(startDate);
  const startTime = formatDisplayTime(startDate);
  const endTime = formatDisplayTime(endDate);
  const tagColor = tag ? TAG_COLORS[tag] ?? "var(--pink)" : "var(--pink)";
  const tagLabel = tag ? tag.replace("-", " ") : null;

  const jsonLd = buildEventSchema({
    name,
    description,
    startDate,
    endDate,
    venueName,
    venueAddress: venueAddress ?? "",
    venueCity,
    venueState,
    ticketUrl,
    price: priceAmount,
    imageUrl: imageUrl ?? "https://lasvegasmahj.com/hero-bg.jpg",
    eventUrl: canonicalUrl,
    eventStatus,
  });

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://lasvegasmahj.com" },
      { "@type": "ListItem", position: 2, name: "Events", item: "https://lasvegasmahj.com/#events" },
      { "@type": "ListItem", position: 3, name, item: canonicalUrl },
    ],
  };

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }}
      />

      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>

        {/* ── HERO ── */}
        <section
          style={{
            background: "var(--navy-dark)",
            padding: "5rem 2rem 4rem",
            textAlign: "center",
            borderBottom: "1px solid rgba(233,30,140,0.2)",
            position: "relative",
          }}
        >
          {imageUrl && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.12,
                zIndex: 0,
              }}
            />
          )}

          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            {/* Breadcrumb — screen-reader friendly */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem" }}>
              <ol
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  listStyle: "none",
                  fontSize: "0.8rem",
                  color: "rgba(255,255,255,0.4)",
                  padding: 0,
                  margin: 0,
                }}
              >
                <li><a href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</a></li>
                <li aria-hidden>›</li>
                <li><a href="/#events" style={{ color: "inherit", textDecoration: "none" }}>Events</a></li>
                <li aria-hidden>›</li>
                <li aria-current="page" style={{ color: "rgba(255,255,255,0.7)" }}>{name}</li>
              </ol>
            </nav>

            {tagLabel && (
              <p
                className="section-label"
                style={{ color: tagColor, marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem" }}
              >
                {tagLabel}
              </p>
            )}

            <h1
              className="section-title"
              style={{ fontSize: "clamp(2rem, 7vw, 4.5rem)", marginBottom: "1.25rem", lineHeight: 1.05 }}
            >
              {name}
            </h1>

            <p
              style={{
                fontSize: "1.05rem",
                color: "rgba(255,255,255,0.65)",
                maxWidth: "580px",
                margin: "0 auto 0.75rem",
                lineHeight: 1.75,
              }}
            >
              {description}
            </p>

            {/* Date / time / venue pill row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
                margin: "1.75rem 0 2rem",
              }}
            >
              {[
                { icon: "📅", label: displayDate },
                { icon: "🕐", label: `${startTime} – ${endTime}` },
                { icon: "📍", label: venueAddress ? `${venueName}, ${venueAddress}` : `${venueName}, ${venueCity}, ${venueState}` },
                ...(price ? [{ icon: "🎟️", label: price }] : []),
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "999px",
                    padding: "0.4rem 1rem",
                    fontSize: "0.875rem",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {icon} {label}
                </span>
              ))}
            </div>

            {/* CTA */}
            {!past && ticketUrl && (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: "inline-block" }}
              >
                Reserve Your Spot
              </a>
            )}
            {past && (
              <p style={{ color: "rgba(255,255,255,0.35)", fontStyle: "italic", fontSize: "0.9rem" }}>
                This event has passed. See upcoming events below.
              </p>
            )}
          </div>
        </section>

        {/* ── ABOUT THIS EVENT ── */}
        {body.length > 0 && (
          <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
            <div className="container" style={{ maxWidth: "720px" }}>
              <p className="section-label">About This Event</p>
              <h2 className="section-title">
                What to <span className="accent-pink">Expect</span>
              </h2>
              {body.map((paragraph, i) => (
                <p
                  key={i}
                  style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: "1rem" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* ── WHAT TO KNOW ── */}
        {whatToKnow.length > 0 && (
          <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
            <div className="container" style={{ maxWidth: "720px" }}>
              <p className="section-label">Good to Know</p>
              <h2 className="section-title">
                What to <span className="accent-green">Bring</span>
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {whatToKnow.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      color: "rgba(255,255,255,0.72)",
                      lineHeight: 1.7,
                      marginBottom: "0.9rem",
                    }}
                  >
                    <span style={{ color: "var(--green)", flexShrink: 0, marginTop: "0.15em" }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              {!past && ticketUrl && (
                <div style={{ marginTop: "2.5rem" }}>
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Get Your Ticket
                  </a>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── VENUE ── */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Where We Are</p>
            <h2 className="section-title">
              <span className="accent-gold">Venue</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "0.5rem", fontSize: "1.1rem", fontWeight: 600 }}>
              {venueName}
            </p>
            {venueAddress && (
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                {venueAddress}, {venueCity}, {venueState}
              </p>
            )}
            {!venueAddress && (
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                {venueCity}, {venueState}
              </p>
            )}
          </div>
        </section>

        {/* ── PAST EVENT RECAP (post-event SEO value) ── */}
        {past && recapBody.length > 0 && (
          <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
            <div className="container" style={{ maxWidth: "720px" }}>
              <p className="section-label">Looking Back</p>
              <h2 className="section-title">
                Event <span className="accent-green">Recap</span>
              </h2>
              {recapBody.map((paragraph, i) => (
                <p
                  key={i}
                  style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.85, marginBottom: "1rem" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ── */}
        {testimonials.length > 0 && (
          <section style={{ padding: "5rem 2rem", background: past ? "var(--navy)" : "var(--navy-dark)" }}>
            <div className="container" style={{ maxWidth: "860px" }}>
              <p className="section-label">From the Table</p>
              <h2 className="section-title">
                What People <span className="accent-pink">Said</span>
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "2.5rem",
                }}
              >
                {testimonials.map((t, i) => (
                  <blockquote
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "1.5rem",
                      margin: 0,
                    }}
                  >
                    <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: "1rem", fontStyle: "italic" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer style={{ color: "var(--pink)", fontSize: "0.875rem", fontWeight: 600 }}>
                      {t.name}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA / RELATED EVENTS ── */}
        <section
          style={{
            padding: "5rem 2rem",
            background: "var(--navy-dark)",
            textAlign: "center",
            borderTop: "1px solid rgba(233,30,140,0.2)",
          }}
        >
          <div className="container">
            <p className="section-label">Las Vegas Mahjong</p>
            {past ? (
              <>
                <h2 className="section-title">
                  Ready for the <span className="accent-pink">Next One?</span>
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
                  We host open play events, themed parties, leagues, and tournaments across Las Vegas all year. Check out what is coming up next.
                </p>
                <a href="/#events" className="btn-primary">See All Upcoming Events</a>
              </>
            ) : (
              <>
                <h2 className="section-title">
                  Grab Your <span className="accent-pink">Spot</span>
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "2rem", maxWidth: "520px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
                  Spots are limited. Reserve yours now and come join the Valley&rsquo;s most fun mahjong community.
                </p>
                {ticketUrl && (
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Reserve a Spot
                  </a>
                )}
                <div style={{ marginTop: "1rem" }}>
                  <a href="/#events" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
                    View all upcoming events
                  </a>
                </div>
              </>
            )}

            {relatedEventSlugs.length > 0 && (
              <div style={{ marginTop: "3rem" }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  More Events
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                  {relatedEventSlugs.map(({ slug, name: relName, date }) => (
                    <a
                      key={slug}
                      href={`/events/${slug}`}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        padding: "0.75rem 1.25rem",
                        color: "rgba(255,255,255,0.75)",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        lineHeight: 1.5,
                      }}
                    >
                      <strong style={{ display: "block", color: "white" }}>{relName}</strong>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{date}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* ── METADATA HELPER ── */

/**
 * Call this in your event page's generateMetadata to produce consistent SEO metadata.
 *
 * Example:
 *   export const metadata: Metadata = buildEventMetadata({
 *     name: "Cafe Lola Open Play Mahjong Party",
 *     description: "...",
 *     canonicalUrl: "https://lasvegasmahj.com/events/cafe-lola-open-play-may-2026",
 *     startDate: "2026-05-31T18:00:00-07:00",
 *     imageUrl: "https://lasvegasmahj.com/events/cafe-lola-may-2026.jpg",
 *   });
 */
export function buildEventMetadata({
  name,
  description,
  canonicalUrl,
  startDate,
  imageUrl,
}: {
  name: string;
  description: string;
  canonicalUrl: string;
  startDate: string;
  imageUrl?: string;
}): Metadata {
  const date = new Date(startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });

  return {
    title: `${name} — ${date}`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${name} | Las Vegas Mahjong`,
      description,
      url: canonicalUrl,
      type: "website",
      images: imageUrl ? [imageUrl] : ["https://lasvegasmahj.com/hero-bg.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | Las Vegas Mahjong`,
      description,
      images: imageUrl ? [imageUrl] : ["https://lasvegasmahj.com/hero-bg.jpg"],
    },
  };
}
