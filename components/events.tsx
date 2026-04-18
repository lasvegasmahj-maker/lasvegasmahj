"use client";

import { useEffect, useRef } from "react";

export default function Events() {
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
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) {
      const reveals = el.querySelectorAll(".reveal");
      reveals.forEach((r) => observer.observe(r));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="events" className="events-section" ref={sectionRef}>
      <div className="section">
        <p className="section-label reveal">Upcoming Events</p>
        <h2 className="section-title reveal">Upcoming Events</h2>

        <div className="event-card reveal">
          <div className="event-card-header">
            <h3>Open Play at Honey Salt</h3>
            <div className="event-meta">
              <span className="event-meta-item">
                <strong>Sunday, March 29, 2026</strong>
              </span>
              <span className="event-meta-item">
                <strong>3 &ndash; 5 PM</strong>
              </span>
              <span className="event-meta-item">
                Honey Salt Las Vegas
              </span>
            </div>
          </div>
          <div className="event-card-body">
            <p>
              Join us for an afternoon of tiles, laughter, and wine at one of
              Las Vegas&rsquo;s favorite restaurants. All skill levels welcome.
              Bring a friend or come solo &mdash; you&rsquo;ll leave with new
              ones.
            </p>
            <div className="event-price">$45 / person</div>
            <a
              href="https://partiful.com/e/wAs4XkKloghMYV1odE8p"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Reserve a Spot
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
