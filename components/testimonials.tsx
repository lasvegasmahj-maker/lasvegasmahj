"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Molly",
    text: "If you need a mahjong lesson (or 5) @lasvegasmahjong is your woman. Amazing teacher.",
  },
  {
    name: "Carole",
    text: "Throwing a big thank you for putting together such a fun, social evening of Mahjong at Lifetime Summerlin with new faces, beautiful table pads, fancy sets, and PRIZES!",
  },
  {
    name: "Sabrina",
    text: "I had such a great time learning Mahjong with Shauna! She\u2019s an amazing teacher \u2014 super patient, clear in her explanations, and she makes the whole experience really fun. Mahjong can feel a bit overwhelming at first, but Shauna breaks everything down in a way that\u2019s easy to understand and keeps the energy light and enjoyable. Highly recommend learning from her if you get the chance!",
  },
  {
    name: "Tamar",
    text: "I was on the verge of giving up on learning to play Mahjong. I just couldn\u2019t wrap my head around it. So many people tried to teach me, but it just became more and more confusing. Then Shauna taught me. I \u2018got it\u2019 straight away, after having tried for months!! The way she teaches is so clear and logical, but also fun and exciting. Honestly, if it wasn\u2019t for Shauna, I wouldn\u2019t be playing Mahjong today and LOVING it!!",
  },
  {
    name: "Kristi, Northmarq",
    text: "We worked with Shauna for a mahjong-oriented corporate event in early 2026. Shauna was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we\u2019ve ever received from this event, and we hope to work with Shauna again on a future mahjong social!",
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
        </div>

        <div className="community-inner">
          <div className="testimonials-grid reveal">
            {testimonials.map((t) => (
              <div className="testimonial" key={t.name}>
                <p>&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">&mdash; {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
