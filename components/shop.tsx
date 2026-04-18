"use client";

import { useEffect, useRef } from "react";

const shopItems = [
  {
    name: "Oh My Mahjong",
    accent: "#e91e8c",
    url: "https://ohmymahjong.com?sca_ref=9661578.Ks3olHSQzr",
    cta: "Shop Now \u00B7 10% Off",
  },
  {
    name: "Bespoke Mahjong",
    accent: "#ff8282",
    url: "https://www.bespokemahjong.com?sca_ref=10595326.4agm2llL78",
    cta: "Shop Now \u00B7 10% Off",
  },
  {
    name: "Mahjong Maven",
    accent: "#39e639",
    url: "https://mahjonggmaven.com/?ref=Lasvegasmahj",
    cta: "Shop Now \u00B7 10% Off",
  },
  {
    name: "Peace Love Mahjong",
    accent: "#ffd700",
    url: "https://peacelovemahjong.com/?ref=LASVEGASMAHJ",
    cta: "Shop Now \u00B7 10% Off",
  },
  {
    name: "My Fair Mahjong",
    accent: "#c8a8ff",
    url: "https://myfairmahjong.com/LASVEGASMAHJ",
    cta: "Shop Now \u00B7 10% Off",
  },
  {
    name: "Bird Bam Boutique",
    accent: "#64dcff",
    url: "https://www.bambirdboutique.com/lasvegasmahj",
    cta: "Shop Now \u00B7 10% Off",
  },
  {
    name: "Mahjong Co.",
    accent: "#39e639",
    url: "https://mahjongco.com?sca_ref=10562543.QSnXvEYdBu",
    cta: "Shop Now \u00B7 10% Off",
  },
  {
    name: "Modern Tribe",
    accent: "#ffb347",
    url: "https://moderntribe.com?aff=255",
    cta: "Shop Now",
  },
];

const amazonLinks = [
  { label: "Mahjong Book", url: "https://amzn.to/3NjrPFl" },
  { label: "Beginner Set", url: "https://amzn.to/4bxC9Bz" },
  { label: "Line Finders", url: "https://amzn.to/4bsjmaC" },
  { label: "Mahjong Co on Amazon", url: "https://amzn.to/4bLjW4G" },
];

export default function Shop() {
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
    <section id="shop" className="shop-section" ref={sectionRef}>
      <div className="section">
        <p className="section-label reveal">My Favorite Finds</p>
        <h2 className="section-title reveal">My Favorite Finds</h2>
        <p className="shop-disclaimer reveal">
          Some links below are affiliate links. I may earn a small commission at
          no extra cost to you. I only recommend products I truly love.
        </p>
        <div className="promo-badge reveal">
          Use Code: LASVEGASMAHJ
        </div>

        <div className="shop-grid">
          {shopItems.map((item) => (
            <div className="shop-card reveal" key={item.name}>
              <h3
                className="shop-card-name"
                style={{ color: item.accent }}
              >
                {item.name}
              </h3>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shop-card-link"
                style={{ background: item.accent }}
              >
                {item.cta}
              </a>
            </div>
          ))}

          {/* Amazon card */}
          <div className="shop-card reveal">
            <h3 className="shop-card-name" style={{ color: "#ff9900" }}>
              Shauna&rsquo;s Amazon Finds
            </h3>
            <div className="amazon-links">
              {amazonLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
