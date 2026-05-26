import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Scoring and Payment Rules in American Mahjong | Las Vegas Mahjong",
  description:
    "How scoring works in American Mahjong: who pays, how much, joker-free doubles, self-drawn wins, and wall game payments. Answered by a certified instructor.",
  alternates: { canonical: "https://lasvegasmahj.com/rules/scoring" },
  openGraph: {
    title: "Scoring and Payment Rules in American Mahjong | Las Vegas Mahjong",
    description: "Who pays when someone wins? What is joker-free double? How does a wall game settle? Scoring rules explained.",
    url: "https://lasvegasmahj.com/rules/scoring",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "Who pays when someone wins by calling a discard?",
    a: "When a player wins by calling a discard, the player who discarded that tile pays twice the normal amount (they pay for themselves and double). The other two players each pay the standard single amount. This is the standard NMJL payment structure, though some groups play 'all pay'; confirm with your group.",
  },
  {
    q: "Who pays when someone wins on their own draw (self-drawn)?",
    a: "On a self-drawn win, all three other players each pay the full amount. No one discarded the winning tile, so the cost is shared equally among all three losers.",
  },
  {
    q: "What is the standard game value and how do groups set it?",
    a: "The NMJL does not set a fixed dollar amount; groups agree on their own bet per hand before play begins. Common amounts range from 25 cents to $1 per point or per hand. Whatever your group agrees, that amount is what 'one unit' means for payment purposes.",
  },
  {
    q: "What is a joker-free bonus and how does it pay?",
    a: "A joker-free hand (one completed with zero jokers in the entire hand) pays double from all three players. If the normal win is $1, a joker-free win collects $2 from each of the other three players. This applies whether you win by discard or self-draw.",
  },
  {
    q: "Do any hands pay extra beyond joker-free?",
    a: "Some groups play that certain named hands (like Singles and Pairs or Quint hands) pay double or triple by house agreement. The NMJL card itself does not designate specific multipliers beyond the joker-free rule; any extra payments are house rules and should be agreed on before the game.",
  },
  {
    q: "How does payment work in a wall game?",
    a: "In a wall game (no winner), the NMJL standard is that no money changes hands. However, most groups play a house rule where each player pays every other player a small flat amount. Decide your group's wall game rule before play begins so there is no dispute.",
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

export default function ScoringPage() {
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
              💰 Scoring and <span className="accent-pink">Payment</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              Who pays, how much, and when: the rules around collecting your win.
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
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.2rem" }}>Payment rules are clearest when you practice them in real game situations. Book a lesson and we&rsquo;ll run hands until it is second nature.</p>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["jokers", "charleston", "calling-tiles", "the-card", "winning", "dead-hands", "etiquette"].map((slug) => (
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
