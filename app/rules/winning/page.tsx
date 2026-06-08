import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: { absolute: "Winning Rules in American Mahjong | Las Vegas Mahjong" },
  description:
    "What counts as a valid mahjong, self-drawn wins, false mahjong penalties, and wall games. Winning rules in American Mahjong explained by a certified instructor.",
  alternates: { canonical: "https://www.lasvegasmahj.com/rules/winning" },
  openGraph: {
    ...ogBase,
    title: "Winning Rules in American Mahjong | Las Vegas Mahjong",
    description: "What makes a valid mahjong? What is a wall game? What is false mahjong? All winning rules answered.",
    url: "https://www.lasvegasmahj.com/rules/winning",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "How many tiles does each player start with?",
    a: "Each player starts with 13 tiles (except East, the dealer, who starts with 14). East is already holding a full hand and discards first to begin play.",
  },
  {
    q: "What makes a valid mahjong?",
    a: "A valid mahjong is a complete hand of 14 tiles that exactly matches one of the hands on the current year's NMJL card. Every tile must be in the right position, every suit must be correct, and exposed sets must match what you declared. If any element is off, it is not a valid mahjong.",
  },
  {
    q: "Can I win on a tile I called (not my own draw)?",
    a: "Yes. You can win by calling a discarded tile from any other player to complete your hand. This is called a 'discard win.' You declare mahjong, expose your full winning hand, and collect payment.",
  },
  {
    q: "Can I win on my own draw?",
    a: "Yes. Drawing the tile you need from the wall to complete your hand is called a 'self-drawn win.' Self-drawn wins still pay the standard amount, though some groups play that self-drawn pays double; confirm your group's house rules.",
  },
  {
    q: "What is a wall game and how does it pay?",
    a: "A wall game occurs when all tiles in the wall are drawn and no one has won. Play ends immediately when the last tile is drawn. In a wall game, nobody collects a win payment. Each player typically pays a flat amount to every other player (house rules determine the amount), or in some groups no money changes hands.",
  },
  {
    q: "What is a false mahjong and what is the penalty?",
    a: "A false mahjong is calling mahjong when your hand does not actually complete a valid hand on the card. The penalty is set by house rules but typically means the player pays each other player the value of a full win. Play continues without that player; their hand is dead for the rest of the game.",
  },
  {
    q: "Can I declare mahjong and then change my mind?",
    a: "No. Once you call mahjong and expose your tiles, the declaration stands. If it turns out your hand is not valid, it is treated as a false mahjong. Do not call mahjong until you are certain.",
  },
  {
    q: "What happens if a player passes on their winning tile during the charleston?",
    a: "This happens! If you accidentally pass a tile you could have used to win, you can simply continue play. There is no penalty; you just do not have that tile anymore.",
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

export default function WinningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" }, { "@type": "ListItem", position: 2, name: "American Mahjong Rules", item: "https://www.lasvegasmahj.com/rules" }, { "@type": "ListItem", position: 3, name: "Winning", item: "https://www.lasvegasmahj.com/rules/winning" }] }).replace(/</g, "\\u003c") }} />
      <SubpageNav />
      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <Link href="/rules" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", textDecoration: "none", display: "block", marginBottom: "1.5rem" }}>
              &larr; All Rules Topics
            </Link>
            <p className="section-label">American Mahjong Rules</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 7vw, 4rem)", marginBottom: "1rem" }}>
              🏆 <span className="accent-pink">Winning</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              Valid mahjongg, wall games, false mahjong: the rules around declaring a win.
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
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.2rem" }}>Want to practice calling mahjong with confidence? A lesson is the fastest way.</p>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["jokers", "charleston", "calling-tiles", "the-card", "scoring", "dead-hands", "etiquette"].map((slug) => (
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
