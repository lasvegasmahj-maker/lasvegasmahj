import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "How to Learn American Mahjong | Beginner's Complete Guide",
  description:
    "The complete beginner's guide to learning American Mahjong. Learn the tiles, the card, how to play your first hand, and where to find lessons and open play near you. Written by a certified Oh My Mahjong instructor.",
  keywords: [
    "how to learn mahjong",
    "learn American mahjong",
    "how to play American mahjong",
    "American mahjong for beginners",
    "mahjong beginner guide",
    "NMJL mahjong rules",
    "mahjong tiles guide",
    "mahjong card explained",
    "American mahjong vs Chinese mahjong",
    "mahjong lessons near me",
    "learn mahjong online",
    "mahjong tips for beginners",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/learn-mahjong" },
  openGraph: {
    title: "How to Learn American Mahjong | Complete Beginner's Guide",
    description: "Everything you need to start playing American Mahjong — the tiles, the card, your first hand, and where to find lessons near you. Written by a certified instructor.",
    url: "https://lasvegasmahj.com/learn-mahjong",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Learn American Mahjong: A Complete Beginner's Guide",
  description: "The complete beginner's guide to learning American Mahjong — tiles, the NMJL card, how to play, and how to find lessons near you.",
  author: { "@type": "Person", name: "Shauna", jobTitle: "Certified Oh My Mahjong Instructor" },
  publisher: { "@type": "Organization", name: "Las Vegas Mahjong", url: "https://lasvegasmahj.com" },
  mainEntityOfPage: "https://lasvegasmahj.com/learn-mahjong",
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Learn American Mahjong",
  description: "Step-by-step guide to learning American Mahjong for complete beginners.",
  step: [
    { "@type": "HowToStep", name: "Get a Mahjong Set", text: "You need a 166-piece American Mahjong set and a current NMJL card. Sets range from $50 to $300+." },
    { "@type": "HowToStep", name: "Learn the Tiles", text: "American Mahjong has three suits (Bams, Craks, Dots), plus winds, dragons, flowers, and jokers." },
    { "@type": "HowToStep", name: "Read the NMJL Card", text: "The card changes every year and contains the winning hands. Learning to read it is the foundation of the game." },
    { "@type": "HowToStep", name: "Play Your First Hand", text: "Start with a guided lesson or join a beginner-friendly open play session. Playing with others is the fastest way to learn." },
    { "@type": "HowToStep", name: "Keep Playing", text: "Practice is everything. Join a weekly group, find open play near you, or take a follow-up lesson to keep improving." },
  ],
};

const affiliates = [
  { name: "Oh My Mahjong", url: "https://ohmymahjong.com?sca_ref=9661578.Ks3olHSQzr", desc: "My favorite source for mahjong sets, accessories, and gifts. Huge selection, beautiful quality.", discount: "10% off with code LASVEGASMAHJ" },
  { name: "Bespoke Mahjong", url: "https://www.bespokemahjong.com?sca_ref=10595326.4agm2llL78", desc: "Custom, personalized mahjong sets — perfect if you want something truly unique.", discount: "10% off with code LASVEGASMAHJ" },
  { name: "Mahjong Maven", url: "https://mahjonggmaven.com/?ref=Lasvegasmahj", desc: "Everything a new player needs — sets, bags, tile holders, and accessories.", discount: "10% off with code LASVEGASMAHJ" },
  { name: "My Fair Mahjong", url: "https://myfairmahjong.com/LASVEGASMAHJ", desc: "Gorgeous sets and accessories with a beautiful, elegant aesthetic.", discount: "Discount with code LASVEGASMAHJ" },
];

export default function LearnMahjong() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Written by a Certified Oh My Mahjong Instructor</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 7vw, 4.5rem)", marginBottom: "1.5rem" }}>
              How to Learn <span className="accent-green">American Mahjong</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
              A complete beginner&rsquo;s guide — from &ldquo;what even is mahjong?&rdquo; to playing your first winning hand.
            </p>
          </div>
        </section>

        {/* ARTICLE CONTENT */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "740px" }}>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", marginBottom: "1rem" }}>What Is American Mahjong?</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              American Mahjong is a tile-based game played by four players, each building a hand of 14 tiles toward a winning combination. It&rsquo;s a game of strategy, memory, and a little luck — and it&rsquo;s one of the fastest-growing social games in the United States.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
              Unlike the Chinese or Hong Kong versions you might have seen, American Mahjong is played using the <strong>National Mah Jongg League (NMJL) card</strong> — a card that changes every year and contains all the winning hands for that year&rsquo;s play. This is the version taught and played at most mahjong groups, clubs, and events across the US.
            </p>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", marginBottom: "1rem" }}>The Tiles</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>A standard American Mahjong set has 166 tiles, divided into several categories:</p>
            <ul style={{ color: "rgba(255,255,255,0.7)", lineHeight: 2, paddingLeft: "1.5rem", marginBottom: "2.5rem" }}>
              <li><strong style={{ color: "var(--white)" }}>Bams (Bamboo)</strong> — numbered 1–9, shown with bamboo stalks</li>
              <li><strong style={{ color: "var(--white)" }}>Craks (Characters)</strong> — numbered 1–9, shown with Chinese characters</li>
              <li><strong style={{ color: "var(--white)" }}>Dots</strong> — numbered 1–9, shown with circles</li>
              <li><strong style={{ color: "var(--white)" }}>Winds</strong> — North, South, East, West</li>
              <li><strong style={{ color: "var(--white)" }}>Dragons</strong> — Red (Chun), Green (Fa), White (Soap)</li>
              <li><strong style={{ color: "var(--white)" }}>Flowers</strong> — numbered 1–4, used in special hands</li>
              <li><strong style={{ color: "var(--white)" }}>Jokers</strong> — wild tiles, unique to American Mahjong</li>
            </ul>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", marginBottom: "1rem" }}>The NMJL Card</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              The NMJL card is updated every year and lists all the valid winning hands for that year. Learning to read the card — and choosing which hands to build toward — is the core skill of American Mahjong.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
              The card is organized into categories (Like Numbers, Quints, Consecutive Run, etc.) and uses symbols like P (Pair), K (Kong), and N (Number) to describe the structure of each hand. It looks intimidating at first — but within one lesson, most students are reading it confidently.
            </p>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", marginBottom: "1rem" }}>How a Game Works</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Each player starts with 13 tiles. You take turns drawing and discarding tiles, trying to build one of the hands on the NMJL card. When you complete a hand, you call &ldquo;Mahjong!&rdquo; and win the hand.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
              You can also &ldquo;call&rdquo; a tile that another player discards if it completes an exposed section of your hand (a Pung, Kong, or Quint). Jokers can be used as any tile, but other players can swap a real tile for your joker if they need it.
            </p>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", marginBottom: "1rem" }}>How to Get Started</h2>
            <div style={{ marginBottom: "2.5rem" }}>
              {[
                { num: "1", title: "Take a Lesson", desc: "The fastest way to learn. One 2–3 hour lesson with a certified instructor gets most people playing confidently. If you're in Las Vegas, that's us." },
                { num: "2", title: "Get a Set", desc: "You don't need your own set to learn — instructors and groups provide them. But once you're hooked, you'll want your own. See our recommended sets below." },
                { num: "3", title: "Buy the NMJL Card", desc: "The card costs about $14/year and can be ordered from the National Mah Jongg League website. New card releases every March." },
                { num: "4", title: "Join a Group or Open Play", desc: "Playing with others is how you actually get good. Find a local group, attend open play events, or join a league." },
              ].map(step => (
                <div key={step.num} style={{ display: "flex", gap: "1.2rem", padding: "1.2rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--green)", opacity: 0.5, flexShrink: 0, lineHeight: 1 }}>{step.num}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem" }}>{step.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AFFILIATE SECTION */}
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", marginBottom: "0.5rem" }}>Recommended Mahjong Sets & Accessories</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>As a certified instructor and affiliate partner, I earn a small commission on purchases at no extra cost to you.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem", marginBottom: "2.5rem" }}>
              {affiliates.map(a => (
                <a key={a.name} href={a.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "1.5rem", textDecoration: "none", transition: "border-color 0.2s" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "1rem", color: "var(--white)", marginBottom: "0.4rem" }}>{a.name}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "0.6rem" }}>{a.desc}</p>
                  <span style={{ fontFamily: "var(--font-nav)", fontSize: "0.75rem", color: "var(--green)", fontWeight: 700 }}>{a.discount} ↗</span>
                </a>
              ))}
            </div>

            <div style={{ background: "rgba(57,230,57,0.06)", border: "1px solid rgba(57,230,57,0.2)", borderRadius: "8px", padding: "1.2rem 1.5rem", marginBottom: "2.5rem" }}>
              <p style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
                Use code <strong style={{ color: "var(--green)" }}>LASVEGASMAHJ</strong> at checkout for discounts at most of our affiliate partners.
              </p>
            </div>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", marginBottom: "1rem" }}>Learn Mahjong in Las Vegas</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "2rem" }}>
              If you&rsquo;re in the Las Vegas Valley, I&rsquo;d love to be your instructor. I offer beginner lessons (MAHJ101), intermediate lessons (MAHJ102), private lessons, and open play events across Las Vegas, Summerlin, and Henderson. Most students are playing confidently after their first session.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson in Las Vegas</a>
              <a href="/#events" className="btn-outline">See Upcoming Events</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
