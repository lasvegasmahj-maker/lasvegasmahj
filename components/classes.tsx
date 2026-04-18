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
    <section id="classes" className="classes-section" ref={sectionRef}>
      <div className="section">
        <p className="section-label reveal">Mahjong Lessons</p>
        <h2 className="section-title reveal">Mahjong Lessons</h2>

        <div className="classes-grid">
          <div className="class-tiers">
            <div className="class-card reveal">
              <div className="class-card-label">MAHJ 101</div>
              <h3>Absolute Beginners</h3>
              <p>
                Never played before? Perfect. This class covers everything from
                setting up the tiles to understanding the card. You&rsquo;ll be
                playing your first hand by the end of the session.
              </p>
            </div>

            <div className="class-card reveal">
              <div className="class-card-label">MAHJ 102</div>
              <h3>Beyond the Basics</h3>
              <p>
                You know the basics but want to level up your game. We&rsquo;ll
                dive into strategy, defensive play, and reading the table like a
                pro.
              </p>
            </div>

            <div className="class-card reveal">
              <div className="class-card-label">Teams &amp; Tiles</div>
              <h3>Large Groups / Corporate / Charity</h3>
              <p>
                Looking for a unique team-building activity or charity event?
                Mahjong is the perfect icebreaker. We&rsquo;ll bring the tiles,
                the teaching, and the fun to your group.
              </p>
            </div>
          </div>

          <div className="classes-cta reveal">
            <h3>Ready to Learn?</h3>
            <div className="price-row">
              <span className="price-label">Small Group</span>
              <span className="price-value">$50 / person</span>
            </div>
            <div className="price-row">
              <span className="price-label">Large Groups</span>
              <span className="price-value">Pricing Varies</span>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <button className="btn-primary" onClick={onInquiryOpen}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
