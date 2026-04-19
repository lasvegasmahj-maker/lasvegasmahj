"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Event {
  id: string;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  description: string | null;
  price: string | null;
  ticket_url: string | null;
  tag: string | null;
}

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

function EventCard({ event, isPast }: { event: Event; isPast: boolean }) {
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

export default function Events() {
  const sectionRef = useRef<HTMLElement>(null);
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Move to past one day after the event
      const cutoff = new Date(today);
      cutoff.setDate(cutoff.getDate() - 1);

      const upcomingEvents: Event[] = [];
      const pastEvents: Event[] = [];

      (data || []).forEach((event: Event) => {
        const eventDate = new Date(event.event_date + "T00:00:00");
        if (eventDate > cutoff) {
          upcomingEvents.push(event);
        } else {
          pastEvents.push(event);
        }
      });

      // Upcoming: soonest first; Past: most recent first
      upcomingEvents.sort(
        (a, b) =>
          new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      );
      pastEvents.sort(
        (a, b) =>
          new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
      );

      setUpcoming(upcomingEvents);
      setPast(pastEvents);
      setLoading(false);
    }

    fetchEvents();
  }, []);

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

  return (
    <section className="events" id="events" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">What&rsquo;s On</p>
          <h2 className="section-title">
            Upcoming <span className="accent-pink">Events</span>
          </h2>
        </div>

        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
            Loading events...
          </p>
        ) : (
          <>
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
                  No upcoming events right now &mdash; check back soon!
                </p>
              </div>
            )}

            {past.length > 0 && (
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
          </>
        )}
      </div>
    </section>
  );
}
