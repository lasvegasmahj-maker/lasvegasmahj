"use client";

import { useEffect, useRef } from "react";

export default function WhySection() {
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
    <section className="why" id="about" ref={sectionRef}>
      <div className="container">
        <div className="why-grid">
          <div className="why-text reveal">
            <p className="section-label">Our Why</p>
            <h2 className="section-title">
              More Than a <span className="accent-green">Game</span>
            </h2>
            <p>
              When I moved to Las Vegas almost 14 years ago, I was searching for
              the same thing so many of us are &mdash;{" "}
              <strong>community, connection, and real friendships</strong>. I
              found all of that at the mahjong table.
            </p>
            <p>
              Mahjong is a game of friendship, fun, strategy, and a little luck
              &mdash; brain-stimulating enough to keep you sharp, social enough
              to make you stay. Whether you&rsquo;re a total beginner or a
              seasoned player, there&rsquo;s a seat at the table for you.
            </p>
            <a
              href="#events"
              className="btn-primary"
              style={{ display: "inline-block", marginTop: "1.5rem" }}
            >
              Find Your Table
            </a>
          </div>

          <div className="why-pillars reveal">
            <div className="pillar">
              <div className="pillar-icon">&#129504;</div>
              <h4>Brain Health</h4>
              <p>Keep your mind sharp with every hand played.</p>
            </div>
            <div className="pillar">
              <div className="pillar-icon">&#128155;</div>
              <h4>Friendship</h4>
              <p>Meet your new favorite people across the table.</p>
            </div>
            <div className="pillar">
              <div className="pillar-icon">&#126980;</div>
              <h4>Pure Fun</h4>
              <p>Every game is different. Every session a good time.</p>
            </div>
            <div className="pillar">
              <div className="pillar-icon">&#127959;&#65039;</div>
              <h4>Vegas Community</h4>
              <p>Built for locals, transplants, visitors and newcomers alike.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
