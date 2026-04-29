"use client";

import { useEffect, useRef } from "react";

interface PrivateEventsProps {
  onInquiryOpen: () => void;
}

const eventTypes = [
  {
    icon: "\uD83C\uDF89",
    title: "Bachelorette Parties",
    desc: "Tiles, wine, and unforgettable fun \u2014 a unique experience your crew will talk about forever.",
  },
  {
    icon: "\uD83C\uDFE2",
    title: "Corporate Team Building",
    desc: "Break the ice and build connections. Mahjong is the perfect mix of strategy and teamwork for any group size.",
  },
  {
    icon: "\uD83C\uDF82",
    title: "Birthday Celebrations",
    desc: "Skip the same old dinner party. Give your guest of honor a birthday they\u2019ll actually remember.",
  },
  {
    icon: "\u2764\uFE0F",
    title: "Charity & Fundraisers",
    desc: "Host a mahjong tournament or social to raise funds and bring your community together for a great cause.",
  },
  {
    icon: "\uD83C\uDF77",
    title: "Girls\u2019 Night Out",
    desc: "Grab your crew for an evening of tiles, laughter, drinks, and zero screen time. The ultimate girls\u2019 night.",
  },
  {
    icon: "\uD83C\uDFB0",
    title: "Vegas Visitor Experiences",
    desc: "Visiting Las Vegas? Try something off the Strip \u2014 a hands-on mahjong experience you won\u2019t find anywhere else.",
  },
];

export default function PrivateEvents({ onInquiryOpen }: PrivateEventsProps) {
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
    <section className="private-events tile-bg" id="private-events" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">Bring the Fun</p>
          <h2 className="section-title">
            Private <span className="accent-pink">Events</span>
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "600px",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            From intimate gatherings to large-scale events, we bring the tiles,
            the teaching, and the energy. You bring the crew. Every event is
            fully customized to your group.
          </p>
        </div>

        <div className="private-events-grid">
          {eventTypes.map((item) => (
            <div className="private-event-card reveal" key={item.title}>
              <span className="private-event-icon">{item.icon}</span>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ textAlign: "center", marginTop: "3rem" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            Events start at <strong style={{ color: "var(--green)" }}>$50/person</strong> &middot; Groups of any size &middot; Venues across the Valley or your location
          </p>
          <button
            className="btn-primary"
            onClick={onInquiryOpen}
          >
            Plan Your Event
          </button>
        </div>
      </div>
    </section>
  );
}
