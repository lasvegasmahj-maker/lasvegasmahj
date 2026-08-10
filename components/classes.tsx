"use client";

import { useEffect, useRef } from "react";

export default function Classes() {
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
                <h3>Absolute Beginners</h3>
                <p>
                  Never touched a tile? No problem. We start from scratch:
                  sorting the tiles, understanding the card, and playing your
                  first hand.
                </p>
              </div>
            </div>
            <div className="tier">
              <div className="tier-num">MAHJ102</div>
              <div>
                <h3>Beyond the Basics</h3>
                <p>
                  We&rsquo;ll start with a quick recap of everything covered in
                  MAHJ101, then jump straight into the tiles: more hands,
                  more practice, and more confidence at the table.
                </p>
              </div>
            </div>
            <div className="tier">
              <div className="tier-num">Teams &amp; Tiles</div>
              <div>
                <h3>Large Groups, Corporate &amp; Charity Events</h3>
                <p>
                  From birthday parties to corporate team building, charity
                  events, and more; private events for groups large and
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
              Group and private mahjong lessons at our studio inside Lucky Hare,
              8687 W. Sahara Ave. Suite 200. All levels welcome, from absolute
              beginners to experienced players.
            </p>
            <div className="price-row">
              <span>Group Lesson (4-8 people)</span>
              <span className="price">$60 / person</span>
            </div>
            <div className="price-row">
              <span>Private, Groups &amp; Corporate</span>
              <span className="price">Reach out for pricing</span>
            </div>
            <a
              className="btn-primary"
              href="/schedule"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1.5rem",
                width: "100%",
              }}
            >
              Book Now
            </a>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.7, marginTop: "1.25rem", marginBottom: 0 }}>
              Want a private lesson for a group of 4-8 at a time that is not on
              the schedule? We can also come to you across the valley
              (Henderson, Summerlin, and beyond) for an added fee. Email{" "}
              <a href="mailto:lasvegasmahj@gmail.com" style={{ color: "var(--green)", fontWeight: 600 }}>
                lasvegasmahj@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
