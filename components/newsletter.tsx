"use client";

import { useRef, useEffect, useState, type FormEvent } from "react";
import { useMailchimpSubscribe } from "@/lib/use-mailchimp";

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const { status, message, subscribe } = useMailchimpSubscribe();

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void subscribe(email);
  }

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

        <form onSubmit={handleSubmit} noValidate>
          <div className="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address"
              disabled={status === "loading"}
            />
            <button type="submit" className="btn-primary" disabled={status === "loading"}>
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            style={{
              marginTop: "1rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              color:
                status === "error"
                  ? "#ff8a8a"
                  : status === "success"
                  ? "var(--green)"
                  : "rgba(255,255,255,0.85)",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
