import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Best Mahjong Sets 2026 | American Mahjong Set Guide & Reviews",
  description:
    "Looking for the best American mahjong set? A certified instructor's honest guide to the top mahjong sets, accessories, and where to buy them — with exclusive discount codes. All budgets covered.",
  keywords: [
    "best mahjong set",
    "best American mahjong set",
    "mahjong set review",
    "buy mahjong set",
    "mahjong set recommendations",
    "mahjong accessories",
    "Oh My Mahjong review",
    "Bespoke Mahjong review",
    "mahjong set for beginners",
    "mahjong gift ideas",
    "mahjong sets 2026",
    "where to buy mahjong set",
    "mahjong set discount",
    "NMJL mahjong set",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/mahjong-sets-guide" },
  openGraph: {
    title: "Best Mahjong Sets 2026 | A Certified Instructor's Guide",
    description: "A certified instructor's honest guide to the best American mahjong sets and accessories — with exclusive discount codes. All budgets covered.",
    url: "https://lasvegasmahj.com/mahjong-sets-guide",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best American Mahjong Sets 2026 — A Certified Instructor's Guide",
  description: "An honest guide to the best American mahjong sets and accessories, written by a certified Oh My Mahjong instructor.",
  author: { "@type": "Person", name: "Shauna", jobTitle: "Certified Oh My Mahjong Instructor" },
  publisher: { "@type": "Organization", name: "Las Vegas Mahjong", url: "https://lasvegasmahj.com" },
  mainEntityOfPage: "https://lasvegasmahj.com/mahjong-sets-guide",
};

const sets = [
  {
    name: "Oh My Mahjong",
    url: "https://ohmymahjong.com?sca_ref=9661578.Ks3olHSQzr",
    site: "ohmymahjong.com",
    badge: "My #1 Pick",
    badgeColor: "var(--pink)",
    price: "$$–$$$",
    best: "Best overall selection",
    desc: "Oh My Mahjong is my go-to recommendation for almost every student. They offer a wide range of sets from beginner-friendly to luxury, all with beautiful tile quality. Their customer service is excellent and their designs are consistently stunning.",
    pros: ["Widest selection of styles and price points", "Excellent tile quality", "Fast shipping", "Great for gifts", "Accessories galore"],
    code: "LASVEGASMAHJ",
    discount: "10% off your order",
  },
  {
    name: "Bespoke Mahjong",
    url: "https://www.bespokemahjong.com?sca_ref=10595326.4agm2llL78",
    site: "bespokemahjong.com",
    badge: "Best for Gifts",
    badgeColor: "#ff8282",
    price: "$$$",
    best: "Best personalized/custom sets",
    desc: "If you want something truly unique — a custom set with your name, monogram, or a special design — Bespoke Mahjong is unmatched. They do incredible work and the sets make unforgettable gifts for players who have everything.",
    pros: ["Fully customizable sets", "Premium quality", "Unique gift option", "Beautiful packaging"],
    code: "LASVEGASMAHJ",
    discount: "10% off",
  },
  {
    name: "Mahjong Maven",
    url: "https://mahjonggmaven.com/?ref=Lasvegasmahj",
    site: "mahjonggmaven.com",
    badge: "Best Value",
    badgeColor: "var(--green)",
    price: "$–$$",
    best: "Best for beginners on a budget",
    desc: "Mahjong Maven has a great selection of beginner-friendly sets at accessible prices. If you're just starting out and not ready to invest in a high-end set, this is where I'd send you. Quality is solid and the price is right.",
    pros: ["Accessible price points", "Good beginner options", "Bags and accessories too", "Reliable quality"],
    code: "LASVEGASMAHJ",
    discount: "10% off",
  },
  {
    name: "Peace Love Mahjong",
    url: "https://peacelovemahjong.com/?ref=LASVEGASMAHJ",
    site: "peacelovemahjong.com",
    badge: "Most Stylish",
    badgeColor: "var(--gold)",
    price: "$$",
    best: "Best for modern, fashionable players",
    desc: "Peace Love Mahjong nails the modern aesthetic. Their sets and accessories feel fresh and current — great for the player who wants their mahjong gear to match their personal style. Very giftable.",
    pros: ["Trendy, modern designs", "Great accessories line", "Fun gifting option", "Consistently fresh styles"],
    code: "LASVEGASMAHJ",
    discount: "10% off",
  },
  {
    name: "My Fair Mahjong",
    url: "https://myfairmahjong.com/LASVEGASMAHJ",
    site: "myfairmahjong.com",
    badge: "Most Elegant",
    badgeColor: "#c8a8ff",
    price: "$$–$$$",
    best: "Best for elegant, classic style",
    desc: "My Fair Mahjong has a beautiful, refined aesthetic that feels luxurious without the highest price tag. If you want something that looks elegant on a table and serves as a conversation piece, this is a great pick.",
    pros: ["Elegant, classic designs", "Beautiful tile cases", "Great mid-range pricing", "Lovely gift packaging"],
    code: "LASVEGASMAHJ",
    discount: "Discount applied at link",
  },
  {
    name: "Bird Bam Boutique",
    url: "https://www.bambirdboutique.com/lasvegasmahj",
    site: "bambirdboutique.com",
    badge: "Best Apparel",
    badgeColor: "#64dcff",
    price: "$–$$",
    best: "Best mahjong-themed apparel & lifestyle",
    desc: "Not a set, but a must-visit for mahjong-themed apparel, accessories, and lifestyle products. Great for the player who wants to wear their obsession proudly — or for fun gifts that aren't tiles.",
    pros: ["Unique mahjong apparel", "Fun lifestyle products", "Great gift items", "Affordable"],
    code: "LASVEGASMAHJ",
    discount: "10% off",
  },
];

export default function MahjongSetsGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Written by a Certified Oh My Mahjong Instructor</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", marginBottom: "1.5rem" }}>
              Best Mahjong Sets <span className="accent-pink">2026</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto 1.5rem", lineHeight: 1.75 }}>
              An honest guide from a certified instructor who has used them all. No fluff — just the sets I actually recommend to my students, with exclusive discount codes.
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>
              Some links are affiliate links — I earn a small commission at no extra cost to you.
            </p>
          </div>
        </section>

        {/* QUICK PICKS */}
        <section style={{ padding: "3rem 2rem", background: "var(--navy)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <h2 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.5rem" }}>Quick Picks</h2>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {[
                { label: "Best Overall", pick: "Oh My Mahjong", url: "https://ohmymahjong.com?sca_ref=9661578.Ks3olHSQzr" },
                { label: "Best for Beginners", pick: "Mahjong Maven", url: "https://mahjonggmaven.com/?ref=Lasvegasmahj" },
                { label: "Best Gift", pick: "Bespoke Mahjong (custom)", url: "https://www.bespokemahjong.com?sca_ref=10595326.4agm2llL78" },
                { label: "Most Stylish", pick: "Peace Love Mahjong", url: "https://peacelovemahjong.com/?ref=LASVEGASMAHJ" },
                { label: "Most Elegant", pick: "My Fair Mahjong", url: "https://myfairmahjong.com/LASVEGASMAHJ" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>{item.label}</span>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)", fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "0.9rem" }}>{item.pick} ↗</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FULL REVIEWS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Full Reviews</p>
            <h2 className="section-title">The <span className="accent-green">Full Breakdown</span></h2>
            <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "3rem" }}>
              {sets.map(set => (
                <div key={set.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", color: "var(--white)", margin: 0 }}>{set.name}</h3>
                    <span style={{ background: set.badgeColor, color: "var(--navy-dark)", fontFamily: "var(--font-nav)", fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.7rem", borderRadius: "3px", letterSpacing: "0.08em" }}>{set.badge}</span>
                  </div>
                  <p style={{ color: "var(--green)", fontFamily: "var(--font-nav)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "1rem" }}>{set.best} · Price: {set.price}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>{set.desc}</p>
                  <ul style={{ listStyle: "none", padding: 0, marginBottom: "1.2rem" }}>
                    {set.pros.map(pro => (
                      <li key={pro} style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.7, paddingLeft: "1.2rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: "var(--green)" }}>✓</span> {pro}
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                    <a href={set.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.7rem 1.5rem" }}>Shop {set.name} ↗</a>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Code: <strong style={{ color: "var(--green)" }}>{set.code}</strong> — {set.discount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT TO LOOK FOR */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Buyer&rsquo;s Guide</p>
            <h2 className="section-title">What to Look <span className="accent-pink">For</span></h2>
            <div style={{ marginTop: "2rem" }}>
              {[
                { q: "Do I need 152 or 166 tiles?", a: "American Mahjong requires 166 tiles (the extra tiles include the Jokers and Flowers). Make sure any set you buy is specifically for American Mahjong." },
                { q: "What's the difference between $50 and $300 sets?", a: "Mostly materials and aesthetics. Budget sets use plastic tiles with printed designs. Premium sets use heavier tiles with embossed or inlaid designs that feel great in hand. Both play identically." },
                { q: "Do I need a case?", a: "Yes — a case keeps your tiles organized and protected. Most sets come with one. Look for a case with dividers and a soft interior." },
                { q: "Do I need to buy the NMJL card separately?", a: "Yes, always. The NMJL card is sold separately at nmjl.org for about $14. It changes every year and must be purchased fresh each March." },
              ].map(item => (
                <div key={item.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "1rem", color: "var(--white)", marginBottom: "0.5rem" }}>{item.q}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Ready to <span className="accent-green">Play?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Got your set — now learn to use it! Book a beginner lesson in Las Vegas and you&rsquo;ll be playing your first hand within the hour.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson in Las Vegas</a>
              <a href="/learn-mahjong" className="btn-outline">Read the Beginner Guide</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
