"use client";

import { useEffect, useRef } from "react";
import { SHOW_PAST_EVENTS, type HomeEvent } from "@/lib/events";

const tagClasses: Record<string, string> = {
  tournament: "tag-tournament",
  "open-play": "tag-open-play",
  lessons: "tag-lessons",
  charity: "tag-charity",
  special: "tag-special",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EventCard({ event, isPast }: { event: HomeEvent; isPast: boolean }) {
  return (
    <div
      className="event-card reveal visible"
      style={isPast ? { opacity: 0.6 } : undefined}
    >
      <div className="event-card-header">
        {event.tag && (
          <span className={`event-tag ${tagClasses[event.tag] || ""}`}>
            {event.tag.replace("-", " ")}
          </span>
        )}
        <h3>{event.title}</h3>
        <p className="event-meta">
          {formatDate(event.event_date)}
          {event.start_time && <> &middot; {event.start_time}</>}
          {event.end_time && <>&ndash;{event.end_time}</>}
          {event.location && <> &middot; {event.location}</>}
        </p>
      </div>
      <div className="event-card-body">
        {event.description && <p>{event.description}</p>}
        {event.price && !isPast && (
          <div className="event-price">
            <span className="price-amount">{event.price}</span>
            <span className="price-label">per person</span>
          </div>
        )}
        {event.ticket_url && !isPast ? (
          <a
            href={event.ticket_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-card"
          >
            Reserve a Spot
          </a>
        ) : isPast ? (
          <span
            style={{
              display: "inline-block",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.35)",
              fontStyle: "italic",
            }}
          >
            This event has passed
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default function Events({
  upcoming,
  past,
}: {
  upcoming: HomeEvent[];
  past: HomeEvent[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    const el = sectionRef.current;
    if (el) {
      const reveals = el.querySelectorAll(".reveal");
      reveals.forEach((r) => observer.observe(r));
    }

    return () => observer.disconnect();
  }, [upcoming, past]);

  // Nothing to show: hide the whole section rather than an empty placeholder.
  // It reappears automatically once there is an upcoming event again.
  const hasContent =
    upcoming.length > 0 || (SHOW_PAST_EVENTS && past.length > 0);
  if (!hasContent) {
    return null;
  }

  return (
    <section className="events" id="events" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">What&rsquo;s On</p>
          <h2 className="section-title">
            Upcoming <span className="accent-pink">Events</span>
          </h2>
        </div>

        {upcoming.length > 0 ? (
          <div className="events-grid">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} isPast={false} />
            ))}
          </div>
        ) : (
          <div className="reveal" style={{ textAlign: "center", padding: "2rem 0" }}>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "1.1rem",
                lineHeight: 1.7,
              }}
            >
              No upcoming events right now. Check back soon!
            </p>
          </div>
        )}

        {SHOW_PAST_EVENTS && past.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <div className="reveal">
              <p className="section-label">Looking Back</p>
              <h2 className="section-title">
                Past <span className="accent-green">Events</span>
              </h2>
            </div>
            <div className="events-grid">
              {past.map((event) => (
                <EventCard key={event.id} event={event} isPast={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
