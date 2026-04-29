"use client";

import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "Do I need to know how to play before coming?",
    a: "Not at all! Most of our students are complete beginners. MAHJ101 starts from scratch \u2014 we\u2019ll teach you everything from sorting the tiles to playing your first hand. No experience needed.",
  },
  {
    q: "What version of mahjong do you teach?",
    a: "We teach American Mahjong, played with the National Mah Jongg League (NMJL) card. This is the most popular version in the US and the one you\u2019ll find at most local games.",
  },
  {
    q: "What do I need to bring?",
    a: "Just yourself! We provide the tiles, racks, and everything else you need. If you have your own NMJL card, feel free to bring it \u2014 otherwise we\u2019ll have extras.",
  },
  {
    q: "Can I come alone, or do I need a group?",
    a: "You\u2019re welcome to come solo! Open play events are a great way to meet fellow players. For private lessons, we can pair you with other students if you don\u2019t have a full group.",
  },
  {
    q: "How long does it take to learn?",
    a: "Most people feel comfortable playing after just one 2\u20133 hour lesson. You won\u2019t be an expert overnight, but you\u2019ll know enough to sit down and play \u2014 and that\u2019s when the real fun starts.",
  },
  {
    q: "Where do you hold classes and events?",
    a: "We host at restaurants, community spaces, and private venues across the Las Vegas Valley \u2014 from Summerlin to Henderson. We also offer private lessons at your home or preferred location.",
  },
  {
    q: "What\u2019s the difference between MAHJ101 and MAHJ102?",
    a: "MAHJ101 is for absolute beginners \u2014 we cover the basics from the ground up. MAHJ102 picks up where 101 left off with more hands, strategy, and table time. We recommend taking 101 first.",
  },
  {
    q: "Can you host a private event for my group?",
    a: "Absolutely! We do bachelorette parties, birthday celebrations, corporate team building, charity events, and more. Events are fully customized for your group. Just reach out and we\u2019ll plan something amazing.",
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
    <section className="faq" id="faq" ref={sectionRef}>
      <div className="container">
        <div className="reveal">
          <p className="section-label">Questions?</p>
          <h2 className="section-title">
            Frequently <span className="accent-pink">Asked</span>
          </h2>
        </div>

        <div className="faq-list reveal">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className={`faq-item ${openIndex === i ? "faq-open" : ""}`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="faq-question">
                <h3>{faq.q}</h3>
                <span className="faq-toggle">
                  {openIndex === i ? "\u2212" : "+"}
                </span>
              </div>
              {openIndex === i && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
