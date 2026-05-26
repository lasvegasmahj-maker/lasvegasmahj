import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Reading the NMJL Mahjong Card | Las Vegas Mahjong",
  description:
    "How to read the NMJL mahjong card: what the symbols mean, when the new card releases, consecutive numbers, any like number, open vs. closed hands, and more.",
  alternates: { canonical: "https://lasvegasmahj.com/rules/the-card" },
  openGraph: {
    title: "Reading the NMJL Mahjong Card | Las Vegas Mahjong",
    description: "What do P, K, N mean on the card? What is 'any like number'? What is an open vs. closed hand? The card explained by a certified instructor.",
    url: "https://lasvegasmahj.com/rules/the-card",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const QA = [
  {
    q: "When does the new NMJL card come out each year?",
    a: "The National Mah Jongg League releases a new card every spring. The new card is the only valid card for that year's play -- the previous year's card is retired. You can order the new card at the NMJL website (nationalmahjonggleague.org) for a small annual fee.",
  },
  {
    q: "What do the symbols P, K, and N mean on the card?",
    a: "P stands for Pair (2 identical tiles). K stands for Kong (4 identical tiles). N represents a specific number you choose (must be consistent within the hand). Some cards also use Q for Quint (5 identical tiles, requiring jokers). The symbols tell you the exact structure of each hand.",
  },
  {
    q: "What does 'any like number' mean on the card?",
    a: "'Any like number' means you can choose any number (1 through 9) and use that same number across the required suits. For example, if the hand calls for 3 Bams, 3 Craks, and 3 Dots of 'any like number,' all three sets must use the same number -- say, all 4s.",
  },
  {
    q: "What does 'consecutive numbers' mean?",
    a: "Consecutive numbers are sequential: 1-2-3, or 4-5-6, etc. The hand will specify how many consecutive numbers you need and in which suits. You choose the starting number, but all tiles must follow in order without gaps.",
  },
  {
    q: "What is the difference between an open and closed hand?",
    a: "An open hand allows you to call discards from other players to build exposed sets. A closed hand must be built entirely from your own draws -- you cannot call any discards. On the card, closed hands typically pay more and are noted as 'closed' or have no calling permitted. Always confirm with your group which hands require closed play.",
  },
  {
    q: "Can I play with last year's card?",
    a: "Not in official or competitive play. The NMJL releases a new card each year and play should use the current year's card. However, in casual home games, groups sometimes agree to use any card they have -- just make sure everyone is playing from the same card.",
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

export default function TheCardPage() {
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
              🃎 Reading the <span className="accent-pink">Card</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              The NMJL card is the foundation of American Mahjong. Here is how to read it.
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
              <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.2rem" }}>Reading the card clicks fastest with a real card in hand. Book a lesson and we&rsquo;ll work through it together.</p>
              <Link href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson &rarr;</Link>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--navy-dark)", padding: "3rem 2rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", marginBottom: "1.2rem" }}>Other rules topics:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["jokers", "charleston", "calling-tiles", "winning", "scoring", "dead-hands", "etiquette"].map((slug) => (
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
