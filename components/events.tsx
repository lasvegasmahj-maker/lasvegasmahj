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
      { threshold: 0.12 }
    );

    const el = sectionRef.current;
    if (el) {
      const reveals = el.querySelectorAll(".reveal");
      reveals.forEach((r) => observer.observe(r));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="events" id="events" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">What&rsquo;s On</p>
          <h2 className="section-title">
            Upcoming <span className="accent-pink">Events</span>
          </h2>
        </div>

        <div className="events-grid">
          <div className="event-card reveal">
            <div className="event-card-header">
              <h3>Open Play at Honey Salt</h3>
              <p className="event-meta">
                Sunday, March 29, 2026 &middot; 3:00&ndash;5:00 PM &middot;
                Honey Salt, Las Vegas
              </p>
            </div>
            <div className="event-card-body">
              <p>
                Join us for two hours of tiles, laughter, and great company at
                the beautiful Honey Salt. Gather with friends, meet fellow
                players, and enjoy a relaxed afternoon of mahjong. Your ticket
                includes a glass of wine or soft drink plus a raffle ticket for
                fun prizes. Come early, stay after, and make it a full outing
                &mdash; delicious food available for purchase from Honey
                Salt&rsquo;s menu.
              </p>
              <div className="event-price">
                <span className="price-amount">$45</span>
                <span className="price-label">
                  per person &middot; wine or soft drink + raffle ticket included
                </span>
              </div>
              <a
                href="https://partiful.com/e/wAs4XkKloghMYV1odE8p"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-card"
              >
                Reserve a Spot
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
