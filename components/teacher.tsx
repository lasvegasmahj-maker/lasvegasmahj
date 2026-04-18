"use client";

import { useEffect, useRef } from "react";

interface TeacherProps {
  onInquiryOpen: () => void;
}

export default function Teacher({ onInquiryOpen }: TeacherProps) {
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
    <section className="teacher-section" ref={sectionRef}>
      <div className="section">
        <div className="teacher-grid">
          <div className="teacher-photo reveal">
            {/* Placeholder for Shauna's photo */}
            <span>Photo Coming Soon</span>
          </div>
          <div className="teacher-info">
            <p className="section-label reveal">Meet Your Teacher</p>
            <h2 className="reveal">Hi, I&rsquo;m Shauna!</h2>
            <p className="reveal">
              I&rsquo;m a certified Oh My Mahjong instructor and the founder of
              Las Vegas Mahjong. I fell in love with the game and knew I had to
              share it with my community.
            </p>
            <p className="reveal">
              My teaching style is patient, fun, and beginner-friendly. I break
              down the game into simple steps so you can start playing
              confidently from day one. No judgment, no pressure — just tiles,
              laughter, and maybe a glass of wine.
            </p>
            <p className="reveal">
              Whether you&rsquo;re a complete beginner or looking to sharpen
              your strategy, I&rsquo;d love to welcome you to the table.
            </p>
            <button className="btn-primary reveal" onClick={onInquiryOpen}>
              Learn With Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
