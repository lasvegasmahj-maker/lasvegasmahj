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
    <section className="newsletter" ref={sectionRef}>
      <div className="container reveal">
        <p className="section-label">Stay in the Loop</p>
        <h2 className="section-title">
          Never Miss a <span className="accent-green">Game</span>
        </h2>
        <p>
          Get event announcements, open play reminders, and tips straight to your
          inbox.
        </p>

        <form
          action="https://gmail.us15.list-manage.com/subscribe/post?u=85959bbed840b4e31ea78b3f3&id=6dacbc956d&f_id=0043a3e1f0"
          method="POST"
          noValidate
        >
          <div className="newsletter-form">
            <input
              type="email"
              name="EMAIL"
              placeholder="your@email.com"
              required
              aria-label="Email address"
            />
            {/* Mailchimp honeypot */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", left: "-5000px" }}
            >
              <input
                type="text"
                name="b_85959bbed840b4e31ea78b3f3_6dacbc956d"
                tabIndex={-1}
                defaultValue=""
              />
            </div>
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
