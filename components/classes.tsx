"use client";

import { useEffect, useRef } from "react";

interface ClassesProps {
  onInquiryOpen: () => void;
}

export default function Classes({ onInquiryOpen }: ClassesProps) {
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
    <section className="classes tile-bg" id="classes" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">Learn Mahjong in Las Vegas</p>
          <h2 className="section-title">
            Mahjong <span className="accent-green">Lessons</span>
          </h2>
        </div>

        <div className="classes-layout">
          <div className="class-tiers reveal">
            <div className="tier">
              <div className="tier-num">MAHJ101</div>
              <div>
                <h4>Absolute Beginners</h4>
                <p>
                  Never touched a tile? No problem. We start from scratch &mdash;
                  sorting the tiles, understanding the card, and playing your
                  first hand.
                </p>
              </div>
            </div>
            <div className="tier">
              <div className="tier-num">MAHJ102</div>
              <div>
                <h4>Beyond the Basics</h4>
                <p>
                  We&rsquo;ll start with a quick recap of everything covered in
                  MAHJ101, then jump straight into the tiles &mdash; more hands,
                  more practice, and more confidence at the table.
                </p>
              </div>
            </div>
            <div className="tier">
              <div className="tier-num">Teams &amp; Tiles</div>
              <div>
                <h4>Large Groups, Corporate &amp; Charity Events</h4>
                <p>
                  From bachelorette parties to corporate team building, charity
                  events, and more &mdash; private events for groups large and
                  small, fully customized and endlessly fun.
                </p>
              </div>
            </div>
          </div>

          <div className="classes-cta reveal">
            <h3>
              Book a <span style={{ color: "var(--green)" }}>Lesson</span>
            </h3>
            <p>
              Private or group mahjong lessons available at venues across Las
              Vegas, Summerlin, and Henderson &mdash; or virtually via Zoom. All
              levels welcome, from absolute beginners to experienced players.
            </p>
            <div className="price-row">
              <span>Small Group (3&ndash;8 people)</span>
              <span className="price">$50 / person</span>
            </div>
            <div className="price-row">
              <span>Private Lesson (1&ndash;2 people)</span>
              <span className="price">$75 / person</span>
            </div>
            <div className="price-row">
              <span>Large Groups &amp; Corporate Events</span>
              <span className="price">Starting at $50 / person</span>
            </div>
            <button
              className="btn-primary"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1.5rem",
                width: "100%",
              }}
              onClick={onInquiryOpen}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
