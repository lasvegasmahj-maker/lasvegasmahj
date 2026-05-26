import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Joker Rules in American Mahjong | Las Vegas Mahjong",
  description:
    "Everything you need to know about jokers in American Mahjong: what they substitute for, when they can be swapped, calling a joker, and joker-free hands. Answered by a certified instructor.",
  alternates: { canonical: "https://lasvegasmahj.com/rules/jokers" },
  openGraph: {
    title: "Joker Rules in American Mahjong | Las Vegas Mahjong",
    description: "Can jokers be used in pairs? Can you swap a joker? What is joker-free? All your joker questions answered.",
    url: "https://lasvegasmahj.com/rules/jokers",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "What tiles can jokers substitute for?",
    a: "Jokers can substitute for any tile in a set of three or more identical tiles -- a pung (3), kong (4), or quint (5). They cannot substitute in pairs or single tiles. So jokers work in groups, never alone or in twos.",
  },
  {
    q: "Can jokers be used in a pair?",
    a: "No. Jokers cannot be used in pairs under any circumstance. A pair must be two real, identical tiles. This is one of the most common misconceptions for newer players.",
  },
  {
    q: "Can jokers be used in a single tile slot?",
    a: "No. A single tile position on the card requires a real tile. Jokers only work in groups of three or more.",
  },
  {
    q: "Can I swap a real tile for a joker in another player's exposed set?",
    a: "Yes -- but only when it is your turn to discard. You may exchange a real tile for a joker sitting in any player's exposed pung, kong, or quint. You take the joker and leave the real tile in its place. You cannot do this mid-turn or out of turn.",
  },
  {
    q: "Can I use a joker in a Singles and Pairs hand?",
    a: "No. Singles and Pairs hands (hands with all single tiles and pairs) are joker-free by definition. No jokers anywhere in those hands.",
  },
  {
    q: "What is a joker-free hand and what does it pay?",
    a: "A joker-free hand is any complete mahjong hand that contains zero jokers. These hands pay double from all three players -- meaning you collect twice the normal amount. This applies to self-drawn wins too.",
  },
  {
    q: "Can I call another player's discard and use a joker to complete the set?",
    a: "Yes. When you call a discard to complete a pung, kong, or quint, you can use jokers to fill the remaining tiles in that exposed group. You just need the called tile plus at least one real matching tile in the group.",
  },
  {
    q: "What happens to jokers at the end of a wall game?",
    a: "In a wall game (nobody wins), there is no payment for jokers specifically. Each player pays the others based on house rules -- most groups pay a flat amount per player per wall game.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QA.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function JokersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <SubpageNav />
      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <Link href="/rules" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
              &larr; All Rules Topics
            </Link>
            <p className="section-label">American Mahjong Rules</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 7vw, 4rem)", marginBottom: "1rem" }}>
              🃏 Joker <span className="accent-pink">Rules</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              The most argued topic at the mahjong table. Here is exactly how jokers work.
            </p>
          </div>
        </section>

        <section style={{ background: "var(--navy)", padding: "5rem 2rem" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {QA.map(({ q, a }, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "1.6rem 1.8rem" }}>
                  <h2 style={{ fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "1.05rem", color: "white", marginBottom: "0.7rem", lineHeight: 1.4 }}>{q}</h2>
                  <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: 0, fontSize: "0.93rem" }}>{a}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "3rem", padding: "2rem", background: "rgba(233,30,140,0.08)", border: "1px solid rgba(233,30,140,0.25)", borderRadius: 16, textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.2rem", lineHeight: 1.65 }}>
                Still unsure? Rules make a lot more sense at a real table. Las Vegas players can book a lesson and we&rsquo;ll work through the rules with live tiles.
              </p>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["charleston", "calling-tiles", "the-card", "winning", "scoring", "dead-hands", "etiquette"].map((slug) => (
                <Link key={slug} href={`/rules/${slug}`}
                  style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 6, padding: "0.3rem 0.8rem", textDecoration: "none", textTransform: "capitalize" }}>
                  {slug.replace("-", " ")}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
