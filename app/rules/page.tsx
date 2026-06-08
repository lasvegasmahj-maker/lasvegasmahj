import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: { absolute: "American Mahjong Rules Guide | Las Vegas Mahjong" },
  description:
    "Complete American Mahjong rules guide by a certified instructor: jokers, the charleston, calling tiles, scoring, dead hands, and more, answered plainly.",
  alternates: { canonical: "https://www.lasvegasmahj.com/rules" },
  openGraph: {
    ...ogBase,
    title: "American Mahjong Rules Guide | Las Vegas Mahjong",
    description: "Every common American Mahjong rules question, answered by a certified Oh My Mahjong instructor. Jokers, charleston, scoring, dead hands, and more.",
    url: "https://www.lasvegasmahj.com/rules",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "American Mahjong Rules Guide",
  description: "Complete American Mahjong rules guide by certified instructor Shauna of Las Vegas Mahjong.",
  url: "https://www.lasvegasmahj.com/rules",
  author: { "@type": "Person", name: "Shauna", jobTitle: "Certified Oh My Mahjong Instructor" },
  publisher: { "@type": "Organization", name: "Las Vegas Mahjong", url: "https://www.lasvegasmahj.com" },
};

const CATEGORIES = [
  {
    slug: "jokers",
    title: "Jokers",
    icon: "🃏",
    desc: "The most-debated topic at any mahjong table. When can jokers be used, swapped, and claimed?",
    count: 8,
    highlight: true,
  },
  {
    slug: "charleston",
    title: "The Charleston",
    icon: "🔄",
    desc: "How many passes, blind passes, courtesy passes, and what happens when you pass wrong.",
    count: 7,
    highlight: false,
  },
  {
    slug: "calling-tiles",
    title: "Calling Tiles",
    icon: "📢",
    desc: "Pungs, kongs, priority, and what happens when two players call the same discard.",
    count: 7,
    highlight: false,
  },
  {
    slug: "the-card",
    title: "Reading the Card",
    icon: "🃎",
    desc: "How to read the NMJL card, what the symbols mean, and how to choose your hand.",
    count: 6,
    highlight: false,
  },
  {
    slug: "winning",
    title: "Winning",
    icon: "🏆",
    desc: "What makes a valid mahjong, self-drawn wins, false mahjong, and wall games.",
    count: 8,
    highlight: false,
  },
  {
    slug: "scoring",
    title: "Scoring and Payment",
    icon: "💰",
    desc: "Who pays, how much, doubles, joker-free bonuses, and wall game settlements.",
    count: 6,
    highlight: false,
  },
  {
    slug: "dead-hands",
    title: "Dead Hands",
    icon: "❌",
    desc: "What kills a hand, when it can be saved, and whether a dead hand player still pays.",
    count: 5,
    highlight: false,
  },
  {
    slug: "etiquette",
    title: "Etiquette and Disputes",
    icon: "🤝",
    desc: "Table talk, taking back discards, resolving disputes, and house rules vs. NMJL rules.",
    count: 6,
    highlight: false,
  },
];

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "American Mahjong Rules", item: "https://www.lasvegasmahj.com/rules" },
  ],
};

const collectionSchema = {
  ...schema,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.title,
      url: `https://www.lasvegasmahj.com/rules/${c.slug}`,
    })),
  },
};

export default function RulesIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">From a Certified Oh My Mahjong Instructor</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", marginBottom: "1.5rem" }}>
              American Mahjong <span className="accent-pink">Rules Guide</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Real answers to the questions that come up mid-game. Written the way I&rsquo;d answer them at the table: no ambiguity, no legalese.
            </p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto" }}>
              Based on American Mahjong played with the NMJL card. Rules are updated annually when the new card releases.
            </p>
          </div>
        </section>

        {/* CATEGORIES GRID */}
        <section style={{ background: "var(--navy)", padding: "5rem 2rem" }}>
          <div className="container" style={{ maxWidth: "960px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.2rem" }}>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/rules/${cat.slug}`}
                  style={{
                    display: "block",
                    padding: "1.8rem",
                    background: cat.highlight ? "rgba(233,30,140,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${cat.highlight ? "rgba(233,30,140,0.4)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 16,
                    textDecoration: "none",
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.8rem" }}>{cat.icon}</div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: cat.highlight ? "var(--pink)" : "white", marginBottom: "0.5rem" }}>
                    {cat.title}
                  </h2>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                    {cat.desc}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "1rem", marginBottom: 0 }}>
                    {cat.count} questions &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ background: "var(--navy-dark)", padding: "4rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="container">
            <p className="section-label">Still confused?</p>
            <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "1rem" }}>
              Learn It Right the <span className="accent-green">First Time</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "0 auto 2rem", lineHeight: 1.7 }}>
              Most rule confusion disappears after one lesson. Las Vegas players can book a beginner or intermediate session; online answers only go so far.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
              <a href="https://findmymahjgame.com/states" target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", padding: "0.85rem 1.8rem", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 10, color: "rgba(255,255,255,0.7)", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem" }}>
                Find Players Near You
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
