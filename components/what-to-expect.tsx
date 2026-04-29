"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Arrive & Settle In",
    desc: "Grab a seat, meet your fellow players, and relax. We handle all the setup \u2014 tiles, racks, cards, everything.",
  },
  {
    num: "02",
    title: "Learn the Basics",
    desc: "We walk you through the tiles, the card, and how a hand works. No rush, no pressure \u2014 just clear, fun instruction.",
  },
  {
    num: "03",
    title: "Play Your First Hand",
    desc: "You\u2019ll be playing within the first hour. We\u2019re right there guiding you through every pick, pass, and call.",
  },
  {
    num: "04",
    title: "Leave Hooked",
    desc: "By the end, you\u2019ll know the game, have new friends, and already be thinking about your next session.",
  },
];

export default function WhatToExpect() {
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
    <section className="what-to-expect" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">First Time?</p>
          <h2 className="section-title">
            What to <span className="accent-green">Expect</span>
          </h2>
        </div>

        <div className="expect-steps">
          {steps.map((step) => (
            <div className="expect-step reveal" key={step.num}>
              <div className="expect-num">{step.num}</div>
              <div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
