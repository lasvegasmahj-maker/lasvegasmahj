import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Table Etiquette and Disputes | Las Vegas Mahjong",
  description:
    "Mahjong table rules and etiquette: table talk, taking back discards, resolving disputes, and the difference between house rules and NMJL rules.",
  alternates: { canonical: "https://lasvegasmahj.com/rules/etiquette" },
  openGraph: {
    title: "Mahjong Table Etiquette and Disputes | Las Vegas Mahjong",
    description: "Can I take back a discard? What counts as table talk? How are disputes resolved? Etiquette rules for American Mahjong.",
    url: "https://lasvegasmahj.com/rules/etiquette",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "Can I take back a discard once it leaves my hand?",
    a: "No. Once a tile is placed face-up on the table as a discard, it cannot be taken back. The moment a tile is set down as a discard, other players may call it. Be certain before you discard.",
  },
  {
    q: "What counts as table talk?",
    a: "Table talk is any verbal communication that gives information about your hand or strategy to other players -- or that influences how others play. Examples: announcing what you need, commenting on another player's discard choices, or reacting to tiles in a way that signals your hand. Table talk is generally prohibited in competitive play. In casual home games, groups set their own rules.",
  },
  {
    q: "How fast do I have to call a discarded tile?",
    a: "You must call a tile before the next player draws from the wall. Once the next player has drawn, the window to call the previous discard is closed. There is no strict timer, but you should call promptly -- hesitating too long is considered poor etiquette.",
  },
  {
    q: "Who resolves rules disputes during a game?",
    a: "In a home game, all four players agree together -- majority rules or unanimity, depending on the group. In a league or club setting, a designated rule referee or club leader makes the call. If no resolution is possible mid-game, the safest option is to replay the hand.",
  },
  {
    q: "Can I ask to see another player's exposed tiles?",
    a: "Yes. Exposed tiles (those placed face-up on the table after a call) are always visible and any player may look at them at any time. Concealed tiles in another player's rack are private.",
  },
  {
    q: "What is the difference between a house rule and an NMJL rule?",
    a: "NMJL rules are the official rules published by the National Mah Jongg League and apply to all standard American Mahjong play. House rules are variations or additions agreed upon by a specific group that are not part of the official rules. House rules are fine for casual play -- just make sure all players agree before the game starts. When in doubt about what is 'official,' the NMJL card and published guidelines are the authority.",
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

export default function EtiquettePage() {
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
              🤝 Etiquette and <span className="accent-pink">Disputes</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              Table manners, dispute resolution, and the difference between house rules and official rules.
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
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.2rem" }}>Good etiquette comes naturally once you have played a few real games. Join an open play session and we&rsquo;ll model the whole thing.</p>
              <Link href="/mahjong-open-play-las-vegas" className="btn-primary">Find Open Play &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["jokers", "charleston", "calling-tiles", "the-card", "winning", "scoring", "dead-hands"].map((slug) => (
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
