"use client";

import { useEffect, useRef } from "react";

export default function Instagram() {
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
    <section className="instagram-section" ref={sectionRef}>
      <div className="container reveal" style={{ textAlign: "center" }}>
        <p className="section-label">Follow Along</p>
        <h2 className="section-title">
          Join the <span className="accent-green">Community</span>
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "500px",
            margin: "0 auto 2rem",
            lineHeight: 1.7,
          }}
        >
          See what we&rsquo;re up to &mdash; event recaps, behind-the-scenes,
          tips, and tile talk. Come hang out!
        </p>

        <div className="instagram-grid">
          <a
            href="https://instagram.com/lasvegasmahjong"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-card"
            aria-label="Follow us on Instagram"
          >
            <div className="instagram-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            <h3>@lasvegasmahjong</h3>
            <p>Follow us on Instagram</p>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=61581027728474"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-card"
            aria-label="Follow us on Facebook"
          >
            <div className="instagram-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </div>
            <h3>Las Vegas Mahjong</h3>
            <p>Join us on Facebook</p>
          </a>

          <a
            href="https://www.tiktok.com/@lasvegasmahjong"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-card"
            aria-label="Follow us on TikTok"
          >
            <div className="instagram-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.11V9a6.27 6.27 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43V13a8.16 8.16 0 005.58 2.18V11.7a4.85 4.85 0 01-3.77-1.24V6.69z" />
              </svg>
            </div>
            <h3>@lasvegasmahjong</h3>
            <p>Watch us on TikTok</p>
          </a>
        </div>
      </div>
    </section>
  );
}
