import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Calling Tiles Rules in American Mahjong | Las Vegas Mahjong",
  description:
    "How calling tiles works in American Mahjong: pungs, kongs, priority, calling out of turn, and what happens when two players call the same discard.",
  alternates: { canonical: "https://lasvegasmahj.com/rules/calling-tiles" },
  openGraph: {
    title: "Calling Tiles Rules in American Mahjong | Las Vegas Mahjong",
    description: "Who has priority when two players call? Can I call any discard? What is out of turn? Calling tile rules explained.",
    url: "https://lasvegasmahj.com/rules/calling-tiles",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "What is the difference between a pung and a kong?",
    a: "A pung is a set of three identical tiles. A kong is a set of four. A quint is five, and a sextet is six (both require jokers). The card shows which group size each hand requires using the numbers 3, 4, 5, and 6.",
  },
  {
    q: "Can I call any discard or only the most recent one?",
    a: "You can only call the most recently discarded tile, the one that was just discarded by the player whose turn just ended. You cannot call a tile that was discarded earlier in the game.",
  },
  {
    q: "What happens when two players call the same discarded tile?",
    a: "The player calling for mahjong (to win) has priority over all other calls regardless of seating position. Among players calling for a pung, kong, or quint (not mahjong), the player who would receive the tile in the natural turn order takes priority (specifically, the player closest to the discarder going counterclockwise).",
  },
  {
    q: "Can I call a tile to complete mahjong even if it is not my turn?",
    a: "Yes. Any player can call any discard to complete a winning hand (mahjong). This overrides all other calls and any order of play.",
  },
  {
    q: "What is calling out of turn and what are the consequences?",
    a: "Calling a tile that is not the most recent discard, or calling before the discard is complete, is an out-of-turn call. The penalty varies by house rules but typically results in the hand being declared dead. At minimum, the call is void and play continues.",
  },
  {
    q: "Can I call a tile for a concealed (unexposed) group?",
    a: "No. You can only call a discarded tile to complete a group that will be immediately exposed on the table. You cannot call a tile to add to a concealed section of your hand.",
  },
  {
    q: "Do I have to expose tiles immediately when I call?",
    a: "Yes. When you call a tile, you must immediately expose the full group (pung, kong, quint, or mahjong) to the table. You cannot call and then decide what to do; the declaration and exposure happen together.",
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

export default function CallingTilesPage() {
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
              📢 Calling <span className="accent-pink">Tiles</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              Pungs, kongs, priority, and what happens when two players want the same tile.
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
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.2rem" }}>Learn from a certified instructor and never second-guess a call again.</p>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["jokers", "charleston", "the-card", "winning", "scoring", "dead-hands", "etiquette"].map((slug) => (
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
