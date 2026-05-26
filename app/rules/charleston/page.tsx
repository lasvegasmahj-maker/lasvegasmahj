import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "The Charleston Rules in American Mahjong | Las Vegas Mahjong",
  description:
    "How the charleston works in American Mahjong: passes, blind passes, courtesy passes, stopping early, and what to do when tiles are passed incorrectly.",
  alternates: { canonical: "https://lasvegasmahj.com/rules/charleston" },
  openGraph: {
    title: "The Charleston Rules in American Mahjong | Las Vegas Mahjong",
    description: "How many passes? Can I stop early? What is a blind pass? All your charleston questions answered by a certified instructor.",
    url: "https://lasvegasmahj.com/rules/charleston",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "How many passes are in the charleston?",
    a: "The first charleston has three mandatory passes: first right (3 tiles), first across (3 tiles), and first left (3 tiles). After the first charleston, players may agree to a second charleston with the same three passes in reverse order: second left, second across, second right. The second charleston requires all four players to agree.",
  },
  {
    q: "Can I stop the charleston before it is finished?",
    a: "After the first right pass is complete, any player can call 'stop' before the first across pass. This ends the charleston immediately. However, once the first across pass begins, you must complete the full first charleston (through first left). The second charleston can be refused by any single player.",
  },
  {
    q: "What is a blind pass?",
    a: "A blind pass occurs during the 'across' pass in either charleston. You must pass 3 tiles across, but you may also pass some (or all) of the tiles you just received from the right without looking at them. These unseen tiles pass 'blindly' to the player across from you. You can use the blind pass to get rid of unwanted tiles without technically seeing them.",
  },
  {
    q: "What is a courtesy pass and is it optional?",
    a: "After both charlestons are complete, players may offer a courtesy pass (exchanging 1 to 3 tiles with the player across from you). Both players must agree on how many tiles to exchange, and both pass simultaneously. It is optional and either player can decline.",
  },
  {
    q: "Can I look at tiles before passing them?",
    a: "Yes, except during a blind pass. In all other passes you see and choose which 3 tiles to pass. During a blind pass, you may pass tiles you just received without looking at them, but you are not required to; you can look and still pass them.",
  },
  {
    q: "What happens if someone passes fewer than 3 tiles?",
    a: "If a player passes the wrong number of tiles and it is caught before play begins, the pass should be corrected. If it is caught after the first tile is drawn, house rules typically apply. The standard remedy is to correct the count if possible, or replay the charleston if necessary.",
  },
  {
    q: "Do I have to pass jokers?",
    a: "No. You are never required to pass a joker. You may choose to pass jokers if you wish, but most players hold them.",
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

export default function CharlestonPage() {
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
              🔄 The <span className="accent-pink">Charleston</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              Passes, blind passes, stopping early: every charleston question answered.
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
                The charleston is much easier to understand when you practice it with real tiles. Book a lesson and we&rsquo;ll run through it until it clicks.
              </p>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["jokers", "calling-tiles", "the-card", "winning", "scoring", "dead-hands", "etiquette"].map((slug) => (
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
