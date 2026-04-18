"use client";

import { useEffect, useRef } from "react";

interface InquiryModalProps {
  onInquiryOpen: () => void;
}

export default function WhySection({ onInquiryOpen }: InquiryModalProps) {
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
    <section id="about" className="why-section" ref={sectionRef}>
      <div className="section">
        <div className="why-grid">
          <div className="why-text">
            <p className="section-label reveal">Our Why</p>
            <h2 className="section-title reveal">More Than a Game</h2>
            <p className="reveal">
              Mahjong is an ancient game of strategy, skill, and a little bit of
              luck. But here in Las Vegas, it&rsquo;s also about connection. We
              believe everyone deserves a place to belong, laugh, and play.
            </p>
            <p className="reveal">
              Whether you&rsquo;re joining us for a weeknight lesson or a
              weekend open play event, you&rsquo;ll find a warm, inclusive
              community that welcomes all skill levels. No experience needed,
              just bring your curiosity.
            </p>
            <button className="btn-primary reveal" onClick={onInquiryOpen}>
              Find Your Table
            </button>
          </div>

          <div className="pillars-grid reveal">
            <div className="pillar-card">
              <div className="pillar-icon">&#129504;</div>
              <div className="pillar-title">Brain Health</div>
              <div className="pillar-desc">
                Strategy and pattern recognition keep your mind sharp.
              </div>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">&#128155;</div>
              <div className="pillar-title">Friendship</div>
              <div className="pillar-desc">
                Real connections made over tiles and laughter.
              </div>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">&#126980;</div>
              <div className="pillar-title">Pure Fun</div>
              <div className="pillar-desc">
                Every game is a new adventure. Win or lose, you&rsquo;ll have a
                blast.
              </div>
            </div>
            <div className="pillar-card">
              <div className="pillar-icon">&#127959;&#65039;</div>
              <div className="pillar-title">Vegas Community</div>
              <div className="pillar-desc">
                Connecting players across the Las Vegas valley.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
