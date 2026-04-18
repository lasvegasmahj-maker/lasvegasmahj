"use client";

import { useRef, useEffect } from "react";

export default function Newsletter() {
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
    <section className="newsletter-section" ref={sectionRef}>
      <div className="section">
        <p className="section-label reveal">Stay in the Loop</p>
        <h2 className="section-title reveal">Never Miss a Game</h2>

        <form
          className="newsletter-form reveal"
          action="https://gmail.us15.list-manage.com/subscribe/post?u=85959bbed840b4e31ea78b3f3&id=6dacbc956d&f_id=0043a3e1f0"
          method="POST"
          target="_blank"
        >
          {/* Honeypot field for bot prevention */}
          <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
            <input
              type="text"
              name="b_85959bbed840b4e31ea78b3f3_6dacbc956d"
              tabIndex={-1}
              defaultValue=""
            />
          </div>

          <input
            type="email"
            name="EMAIL"
            className="newsletter-input"
            placeholder="Your email address"
            required
            aria-label="Email address"
          />
          <button type="submit" className="btn-primary">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
