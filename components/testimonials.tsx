"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Tamar S.",
    text: "Thanks to Shauna I learned how to play Mahjong. I nearly gave up after having tried for months... Her precise, logical and fun way of explaining the rules and concepts of the game allowed me to not only understand the game but also to really enjoy it.",
  },
  {
    name: "Nicole P.",
    text: "Whether you're brand new to Mahjong or looking to improve your game, Shauna is a patient, knowledgeable, and engaging teacher. She makes learning the rules and strategies easy to understand while creating a fun and welcoming atmosphere.",
  },
  {
    name: "Carole B.",
    text: "The people are friendly and Shauna always makes 2 hours go by lightning fast... and she has party favors AND prizes! Just come and meet other mahjong like minded folk who are searching for the right tiles, just like you.",
  },
  {
    name: "Kelly S.",
    text: "Shauna made learning easy and fun! She came to my home and taught myself and 3 friends. I definitely recommend her if you're looking to learn American Mahjong.",
  },
  {
    name: "Abby G.",
    text: "I never played before, didn't even own a card, and walked away with my own card and a solid working knowledge of the game. Shauna is patient and makes the process fun.",
  },
  {
    name: "Kristi, Northmarq",
    text: "We worked with Shauna for a mahjong-oriented corporate event. She was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we've ever received from this event.",
  },
];

export default function Testimonials() {
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
    <section className="community" id="community" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">
            What Players <span className="accent-pink">Are Saying</span>
          </h2>
          <a
            href="https://maps.app.goo.gl/dGeHMfMDjuXjDFPs5"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: "0.75rem", fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.03em", color: "rgba(255,255,255,0.7)" }}
          >
            <span style={{ color: "var(--gold)" }}>★★★★★</span>{" "}
            <span style={{ color: "var(--green)" }}>5.0 on Google</span>
            {" · 25+ five-star reviews"}
          </a>
        </div>

        <div className="community-inner">
          <div className="testimonials-grid reveal">
            {testimonials.map((t) => (
              <div className="testimonial" key={t.name}>
                <p>&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
