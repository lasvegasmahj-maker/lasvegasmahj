"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Molly",
    text: "If you need a mahjong lesson (or 5) @lasvegasmahjong is your woman. Amazing teacher.",
  },
  {
    name: "Carole",
    text: "Throwing a big thank you for putting together such a fun, social evening. The venue was fabulous, the company was wonderful, and the mahjong was on point. Can\u2019t wait for the next one!",
  },
  {
    name: "Sabrina",
    text: "I had such a great time learning Mahjong with Shauna! She was so patient and made the game easy to understand. I was intimidated at first, but she broke everything down with such clarity and enthusiasm. By the end of the session, I actually felt confident picking up tiles. Highly recommend for anyone curious about the game!",
  },
  {
    name: "Tamar",
    text: "I was on the verge of giving up on learning to play Mahjong. I had taken several classes with other teachers and still didn\u2019t get it. Then I found Shauna. After just one lesson, everything finally clicked. She has a gift for explaining the game in a way that actually makes sense. I\u2019m now playing weekly and loving every minute.",
  },
  {
    name: "Kristi, Northmarq",
    text: "We worked with Shauna for a mahjong-oriented corporate event for our team, and it was a huge hit. She was organized, engaging, and made the game accessible for everyone \u2014 even those who had never heard of mahjong. It was the perfect mix of learning, laughing, and team bonding. We\u2019d absolutely book her again.",
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
    <section id="testimonials" className="testimonials-section" ref={sectionRef}>
      <div className="section">
        <p className="section-label reveal">What Players Are Saying</p>
        <h2 className="section-title reveal">What Players Are Saying</h2>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card reveal" key={t.name}>
              <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-author">&mdash; {t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
