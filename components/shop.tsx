"use client";

import { useEffect, useRef } from "react";

const shopItems = [
  {
    name: "Oh My Mahjong",
    color: "var(--pink)",
    borderColor: "rgba(233,30,140,0.3)",
    borderBottomColor: "rgba(233,30,140,0.1)",
    url: "https://ohmymahjong.com?sca_ref=9661578.Ks3olHSQzr",
    site: "ohmymahjong.com",
    desc: "Beautiful mahjong sets, accessories & gifts. My go-to for everything mahjong!",
    cta: "Shop Now \u00B7 10% Off \u2197",
    logo: "/logos/ohmymahjong.jpg",
  },
  {
    name: "Bespoke Mahjong",
    color: "#ff8282",
    borderColor: "rgba(255,130,130,0.3)",
    borderBottomColor: "rgba(255,130,130,0.1)",
    url: "https://www.bespokemahjong.com?sca_ref=10595326.4agm2llL78",
    site: "bespokemahjong.com",
    desc: "Custom, personalized mahjong sets \u2014 the perfect gift for the player who has everything.",
    cta: "Shop Now \u00B7 10% Off \u2197",
    logo: "/logos/bespoke.jpg",
  },
  {
    name: "Mahjong Maven",
    color: "var(--green)",
    borderColor: "rgba(57,230,57,0.3)",
    borderBottomColor: "rgba(57,230,57,0.1)",
    url: "https://mahjonggmaven.com/?ref=Lasvegasmahj",
    site: "mahjonggmaven.com",
    desc: "Everything a mahjong lover needs \u2014 sets, bags, accessories & more.",
    cta: "Shop Now \u00B7 10% Off \u2197",
    logo: "/logos/maven.jpg",
  },
  {
    name: "Peace Love Mahjong",
    color: "var(--gold)",
    borderColor: "rgba(255,215,0,0.3)",
    borderBottomColor: "rgba(255,215,0,0.1)",
    url: "https://peacelovemahjong.com/?ref=LASVEGASMAHJ",
    site: "peacelovemahjong.com",
    desc: "Stylish mahjong gear for the modern player. Fun, fresh & totally giftable.",
    cta: "Shop Now \u00B7 10% Off \u2197",
    logo: "/logos/peacelovemahjong.jpg",
  },
  {
    name: "My Fair Mahjong",
    color: "#c8a8ff",
    borderColor: "rgba(200,168,255,0.3)",
    borderBottomColor: "rgba(200,168,255,0.1)",
    url: "https://myfairmahjong.com/LASVEGASMAHJ",
    site: "myfairmahjong.com",
    desc: "Gorgeous mahjong sets and accessories with a beautiful, elegant aesthetic.",
    cta: "Shop Now \u00B7 10% Off \u2197",
    logo: "/logos/myfairmahjong.jpg",
  },
  {
    name: "Bird Bam Boutique",
    color: "#64dcff",
    borderColor: "rgba(100,220,255,0.3)",
    borderBottomColor: "rgba(100,220,255,0.1)",
    url: "https://www.bambirdboutique.com/lasvegasmahj",
    site: "bambirdboutique.com",
    desc: "Cute mahjong-inspired apparel, accessories & lifestyle products for the tile obsessed.",
    cta: "Shop Now \u00B7 10% Off \u2197",
    logo: "/logos/birdbam.jpg",
  },
  {
    name: "Mahjong Co.",
    color: "var(--green)",
    borderColor: "rgba(57,230,57,0.2)",
    borderBottomColor: "rgba(57,230,57,0.08)",
    url: "https://mahjongco.com?sca_ref=10562543.QSnXvEYdBu",
    site: "mahjongco.com",
    desc: "Premium mahjong sets and accessories for serious players and stylish beginners alike.",
    cta: "Shop Now \u00B7 10% Off \u2197",
    logo: "/logos/mahjongco.jpg",
  },
  {
    name: "Modern Tribe",
    color: "#ffb347",
    borderColor: "rgba(255,165,0,0.3)",
    borderBottomColor: "rgba(255,165,0,0.1)",
    url: "https://moderntribe.com?aff=255",
    site: "moderntribe.com",
    desc: "Modern Judaica and lifestyle gifts \u2014 including beautiful mahjong-themed gifts and accessories with a contemporary twist.",
    cta: "Shop Now \u2197",
    logo: "/logos/moderntribe.jpg",
  },
];

const amazonLinks = [
  {
    label: "\uD83D\uDCDA Mahjong Book for Beginners",
    url: "https://amzn.to/3NjrPFl",
  },
  {
    label: "\uD83C\uDC04 Beginner Mahjong Set",
    url: "https://amzn.to/4bxC9Bz",
  },
  {
    label: "\uD83D\uDCCF Mahjong Line Finders",
    url: "https://amzn.to/4bsjmaC",
  },
  {
    label: "\uD83C\uDC04 Mahjong Co. on Amazon",
    url: "https://amzn.to/4bLjW4G",
  },
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
      id="shop"
      className="tile-bg shop-section"
      ref={sectionRef}
      style={{ padding: "6rem 2rem" }}
    >
      <div className="container">
        <div className="reveal">
          <p className="section-label">Shop</p>
          <h2 className="section-title">
            My Favorite <span className="accent-green">Finds</span>
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.6)",
              maxWidth: "580px",
              lineHeight: 1.7,
              marginBottom: "0.5rem",
            }}
          >
            Products I personally use, love, and recommend. Shop through these
            links to support Las Vegas Mahjong!
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "rgba(255,255,255,0.35)",
              maxWidth: "580px",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            Some links are affiliate links &mdash; I may earn a small commission
            at no extra cost to you. As an Amazon Associate I earn from
            qualifying purchases.
          </p>
          <div
            style={{
              display: "inline-block",
              background: "rgba(57,230,57,0.08)",
              border: "1px solid rgba(57,230,57,0.25)",
              borderRadius: "8px",
              padding: "0.6rem 1.4rem",
              marginBottom: "3rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-nav)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              Use code &middot;{" "}
            </span>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.6rem",
                color: "var(--green)",
                letterSpacing: "0.12em",
              }}
            >
              LASVEGASMAHJ
            </span>
          </div>
        </div>

        <div className="shop-grid">
          {shopItems.map((item) => (
            <div
              className="event-card reveal"
              key={item.name}
              style={{ borderColor: item.borderColor }}
            >
              <div
                className="event-card-header"
                style={{
                  borderBottom: `1px solid ${item.borderBottomColor}`,
                  background: "rgba(255,255,255,0.97)",
                }}
              >
                <img
                  src={item.logo}
                  alt={`${item.name} logo`}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "contain",
                    display: "block",
                    marginBottom: "0.5rem",
                    borderRadius: "4px",
                  }}
                />
                <h3 style={{ fontSize: "1.05rem", color: item.color }}>
                  {item.name}
                </h3>
                <p className="event-meta">{item.site}</p>
              </div>
              <div className="event-card-body">
                <p>{item.desc}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-card"
                  style={{
                    borderColor: item.color,
                    color: item.color,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  {item.cta}
                </a>
              </div>
            </div>
          ))}

          {/* Amazon Finds */}
          <div
            className="event-card reveal"
            style={{ borderColor: "rgba(255,153,0,0.4)" }}
          >
            <div
              className="event-card-header"
              style={{
                borderBottom: "1px solid rgba(255,153,0,0.15)",
                background: "rgba(255,255,255,0.97)",
              }}
            >
              <h3 style={{ fontSize: "1.05rem", color: "#ff9900" }}>
                Shauna&rsquo;s Amazon Finds
              </h3>
              <p className="event-meta">amazon.com &middot; Shauna&rsquo;s picks</p>
            </div>
            <div className="event-card-body">
              {amazonLinks.map((link, i) => (
                <div
                  key={link.label}
                  style={{
                    borderBottom:
                      i < amazonLinks.length - 1
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "none",
                    paddingBottom: i < amazonLinks.length - 1 ? "1rem" : 0,
                    marginBottom: i < amazonLinks.length - 1 ? "1rem" : 0,
                  }}
                >
                  <p
                    style={{
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.9)",
                      marginBottom: "0.8rem",
                    }}
                  >
                    {link.label}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-card"
                    style={{
                      borderColor: "#ff9900",
                      color: "#ff9900",
                      display: "block",
                      textAlign: "center",
                    }}
                  >
                    Shop on Amazon &#8599;
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
