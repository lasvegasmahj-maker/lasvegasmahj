import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Open Play Las Vegas | Events, Leagues & Community Games",
  description:
    "Join mahjong open play events across Las Vegas, Summerlin, and Henderson. Meet new players, practice your game, and be part of the Valley's most vibrant mahjong community. All skill levels welcome.",
  keywords: [
    "mahjong open play Las Vegas",
    "mahjong events Las Vegas",
    "mahjong community Las Vegas",
    "mahjong league Las Vegas",
    "mahjong games Las Vegas",
    "where to play mahjong Las Vegas",
    "mahjong Summerlin",
    "mahjong Henderson",
    "mahjong social Las Vegas",
    "mahjong tournament Las Vegas",
    "things to do Las Vegas",
    "mahjong near me Las Vegas",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/mahjong-open-play-las-vegas" },
  openGraph: {
    title: "Mahjong Open Play Las Vegas | Events & Community Games",
    description: "Join mahjong open play events across Las Vegas, Summerlin, and Henderson. All skill levels welcome — come solo, bring a friend, or meet new players.",
    url: "https://lasvegasmahj.com/mahjong-open-play-las-vegas",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Las Vegas Mahjong — Open Play Events",
  description: "Mahjong open play events, leagues, and community games across Las Vegas, Summerlin, and Henderson.",
  url: "https://lasvegasmahj.com/mahjong-open-play-las-vegas",
  location: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Las Vegas", addressRegion: "NV" } },
};

export default function MahjongOpenPlayLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Las Vegas · Summerlin · Henderson · The Whole Valley</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong <span className="accent-green">Open Play</span> in Las Vegas
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Show up, sit down, and play. Our open play events bring Las Vegas mahjong players together at great venues across the Valley. All skill levels welcome — come solo or bring a friend.
            </p>
            <a href="/#events" className="btn-primary">See Upcoming Events</a>
          </div>
        </section>

        {/* WHAT IS OPEN PLAY */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">What to Expect</p>
            <h2 className="section-title">What Is <span className="accent-pink">Open Play?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
              Open play is a casual, social mahjong session where players of all skill levels gather to play. No strict tournament rules — just good games, good people, and a welcoming environment.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
              Our events are hosted at restaurants, community venues, and local spots across Las Vegas. Tickets typically include a drink, and we always keep the energy light, fun, and beginner-friendly.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              Already know how to play? Come and meet the local mahjong community. Just learning? Come anyway — open play is the best way to practice and get better fast.
            </p>
          </div>
        </section>

        {/* WHY JOIN */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">Why Come</p>
            <h2 className="section-title">More Than a <span className="accent-green">Game</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🧠", title: "Stay Sharp", desc: "American Mahjong is a genuinely brain-stimulating game. Strategy, memory, pattern recognition — every session works your mind." },
                { icon: "👯", title: "Meet People", desc: "Las Vegas is a city of transplants and newcomers. Open play is one of the best ways to make real, lasting friendships in the Valley." },
                { icon: "🍷", title: "Great Venues", desc: "We host at restaurants, wine bars, and community spaces with great food and drinks. It's an outing, not just a game." },
                { icon: "📈", title: "Get Better Fast", desc: "Nothing improves your game faster than playing with different people. Come once, leave a better player." },
              ].map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UPCOMING EVENTS CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Find Your Next <span className="accent-pink">Event</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Check the full event calendar for upcoming open play sessions, leagues, and tournaments across the Las Vegas Valley.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#events" className="btn-primary">See All Events</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">Learn First →</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
