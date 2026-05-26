import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Dead Hand Rules in American Mahjong | Las Vegas Mahjong",
  description:
    "What makes a hand dead in American Mahjong, when it can be corrected, and whether dead hand players still pay. Explained by a certified instructor.",
  alternates: { canonical: "https://lasvegasmahj.com/rules/dead-hands" },
  openGraph: {
    title: "Dead Hand Rules in American Mahjong | Las Vegas Mahjong",
    description: "What kills a hand? Can you save it? Does a dead hand player still pay? All dead hand rules answered.",
    url: "https://lasvegasmahj.com/rules/dead-hands",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "What makes a hand dead?",
    a: "A hand is declared dead when a player makes an illegal or impossible call, exposes tiles incorrectly, calls an out-of-turn tile, or exposes a set that cannot possibly complete a valid hand on the current card. False mahjong also results in a dead hand. House rules vary slightly; your group should agree on the list of dead-hand triggers before play.",
  },
  {
    q: "Can a hand be saved before it is officially declared dead?",
    a: "Yes, in some situations. If a player notices an error before other players have acted on it (before the next player draws), the group may agree to correct it. Once play has advanced past the error, the hand is typically dead. The key is catching it immediately.",
  },
  {
    q: "Does a player with a dead hand still pay if someone wins?",
    a: "Yes. A player whose hand is declared dead must still pay the winner if someone else wins. Their hand being dead does not excuse them from payment obligations for the rest of that game.",
  },
  {
    q: "Does a dead hand player continue drawing tiles?",
    a: "No. Once a hand is declared dead, that player does not draw or discard for the rest of the hand. They sit out until the next hand begins.",
  },
  {
    q: "What happens if two players have dead hands?",
    a: "Both sit out. The remaining two players continue, and both dead-hand players still pay if one of the active players wins.",
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

export default function DeadHandsPage() {
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
              ❌ <span className="accent-pink">Dead Hands</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              What kills a hand, when it can be saved, and what dead-hand players still owe.
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
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.2rem" }}>Dead hands are best understood in the context of a real game. Book a lesson and learn to avoid the most common mistakes.</p>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["jokers", "charleston", "calling-tiles", "the-card", "winning", "scoring", "etiquette"].map((slug) => (
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
