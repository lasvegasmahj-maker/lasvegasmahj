"use client";

import { useEffect, useRef } from "react";

export default function Teacher() {
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
    <section
      className="tile-bg about-section"
      ref={sectionRef}
      style={{ padding: "6rem 2rem" }}
    >
      <div className="container">
        <div className="about-grid">
          <div className="reveal">
            <div className="teacher-photo-wrapper">
              <img
                src="/shauna.jpg"
                alt="Shauna, founder of Las Vegas Mahjong"
                width={600}
                height={800}
              />
            </div>
          </div>
          <div className="reveal">
            <p className="section-label">Meet Your Mahjong Teacher</p>
            <h2 className="section-title">
              Hi, I&rsquo;m <span className="accent-pink">Shauna!</span>
            </h2>
            <p>
              A Chicago suburbs girl turned Las Vegas local, wife, mom to two
              boys and three doodles, and proud Indiana Hoosier!
            </p>
            <p>
              Almost 18 years ago, my grandma sat me down and taught me the game
              she loved and played most days of the week. I was hooked and
              started playing weekly with friends. She later gave me my very own
              set, and I&rsquo;ve been playing ever since.
            </p>
            <p>
              Over the years I started teaching friends, and in 2025 I became
              a certified Oh My Mahjong instructor and turned that passion into
              Las Vegas Mahjong. My goal is simple: to share this beautiful,
              brain-stimulating, friendship-building game with as many people
              across the Las Vegas Valley as possible. I&rsquo;d love to be your
              mahjong teacher.
            </p>
            <a href="#classes" className="btn-primary">
              Learn With Me
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
