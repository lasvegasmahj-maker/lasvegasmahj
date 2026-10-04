import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import Image from "next/image";
import { OPEN_PLAY_PLAYERS, SEVENS_OPEN_PLAY } from "@/lib/studio-photos";
import { OPEN_PLAY_SERVICE } from "@/lib/schema";
import { OPEN_PLAY_PRICE_LINE } from "@/lib/pricing";

/**
 * The page for "mahjong open play Las Vegas": what Social Open Play is and how it runs, for
 * anyone who already plays. Visiting players have their own page, /play-mahjong-las-vegas,
 * which this one links to rather than repeats. Operating facts (room, level, registration,
 * card, prices) are the owner's, 2026-09-29; prices come from lib/pricing.ts only.
 */

export const metadata: Metadata = {
  // Absolute: with the brand suffix the title runs past what a results page shows.
  title: { absolute: "Mahjong Open Play Las Vegas | Social American Mahjong" },
  description:
    "Mahjong open play in Las Vegas: social American Mahjong in Lucky Sevens at our studio inside Lucky Hare, for players who know the game. Book online.",
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-open-play-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Mahjong Open Play Las Vegas | Social American Mahjong",
    description: "Social American Mahjong in the Lucky Sevens room at the Las Vegas Mahjong Studio, for players who already know the game. Come solo or with friends.",
    url: "https://www.lasvegasmahj.com/mahjong-open-play-las-vegas",
    images: [`https://www.lasvegasmahj.com${SEVENS_OPEN_PLAY.src}`],
  },
};

// A Service of the one business, not an organization of its own: the old SportsOrganization
// node named a second entity with a city-only address, which competed with #business.
const jsonLd = {
  "@context": "https://schema.org",
  ...OPEN_PLAY_SERVICE,
  provider: { "@id": "https://www.lasvegasmahj.com/#business" },
  areaServed: { "@type": "City", name: "Las Vegas" },
};

const goodToKnow = [
  { title: "Price", body: `${OPEN_PLAY_PRICE_LINE}.` },
  { title: "Registration", body: "Required in advance. Book your seat for a session on the schedule. Spots are limited, with a waitlist when a session fills." },
  { title: "What to bring", body: "Your current National Mah Jongg League card. Tiles, racks and mats are waiting at the studio." },
  { title: "Who can play", body: "Players who already know American Mahjong, including anyone who has completed Mahj 101." },
  { title: "Come as you are", body: "On your own or with friends. You do not need to bring a full table." },
];

const faqs = [
  {
    q: "What is mahjong open play?",
    a: "Social American Mahjong: two hours of play with other players at our studio, using the current National Mah Jongg League card. It is a chance to play, not a lesson.",
  },
  {
    q: "Do I need to know how to play before I come?",
    a: "Yes. Open Play is for players who already know American Mahjong. If you have completed Mahj 101, you are ready to join.",
  },
  {
    q: "How much does Open Play cost?",
    a: `${OPEN_PLAY_PRICE_LINE}. You pay when you book your seat.`,
  },
  {
    q: "Do I need a group to join?",
    a: "No. Come on your own or with friends. You do not need to bring a full table.",
  },
  {
    q: "What should I bring to Open Play?",
    a: "Your current National Mah Jongg League card. The studio has tiles, racks and mats to choose from.",
  },
  {
    q: "Where is Open Play held?",
    a: "Primarily in Lucky Sevens, the playing room at the Las Vegas Mahjong Studio inside Lucky Hare, 8687 W. Sahara Avenue, Suite 200, Las Vegas, NV 89117.",
  },
  {
    q: "How do I sign up for Open Play?",
    a: "Advance registration is required. Choose a session on our schedule and book your seat online.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function MahjongOpenPlayLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" }, { "@type": "ListItem", position: 2, name: "Mahjong Open Play Las Vegas", item: "https://www.lasvegasmahj.com/mahjong-open-play-las-vegas" }] }).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Lucky Sevens · Inside Lucky Hare · West Sahara</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong <span className="accent-green">Open Play</span> in Las Vegas
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Social American Mahjong at the Las Vegas Mahjong Studio. Book a seat, bring your current National Mah Jongg League card, and sit down to play in Lucky Sevens, our playing room. Come on your own or with friends; you do not need a full table.
            </p>
            <a href="/schedule" className="btn-primary">See Open Play Dates</a>
          </div>
        </section>

        {/* WHAT IS OPEN PLAY */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">What to Expect</p>
            <h2 className="section-title">What Is <span className="accent-pink">Open Play?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
              Open Play is social American Mahjong: a relaxed two hours at the table with other players, played with the current National Mah Jongg League card. It is not a lesson. You come to play, and help is there if you want it.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
              Open Play happens primarily in Lucky Sevens, the playing room at{" "}
              <a href="/studio" style={{ color: "var(--green)", fontWeight: 600 }}>our studio inside Lucky Hare</a>, 8687 W. Sahara Avenue, Suite 200. When you arrive, you pick a mat, racks and a set of tiles from the studio&rsquo;s collection.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
              It is for players who already know how to play. If you have completed Mahj 101, you are ready to join. New to the game? Start with Mahj 101 in our{" "}
              <a href="/mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>mahjong lessons</a>.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              In town for a few days? Here is how to{" "}
              <a href="/play-mahjong-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>play mahjong while visiting Las Vegas</a>.
            </p>
          </div>
        </section>

        {/* GOOD TO KNOW */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">Before You Come</p>
            <h2 className="section-title">Good to <span className="accent-pink">Know</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {goodToKnow.map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY PHOTOS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container" style={{ maxWidth: "1000px" }}>
            <p className="section-label">In Lucky Sevens</p>
            <h2 className="section-title">This Is What <span className="accent-green">Open Play</span> Looks Like</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "1rem 0 2.5rem", lineHeight: 1.7 }}>
              Real players at real tables, in the studio&rsquo;s playing room.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", alignItems: "center", maxWidth: "900px" }}>
              <Image
                src={SEVENS_OPEN_PLAY.src}
                alt={SEVENS_OPEN_PLAY.alt}
                width={SEVENS_OPEN_PLAY.width}
                height={SEVENS_OPEN_PLAY.height}
                sizes="(max-width: 760px) 100vw, 480px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
              <Image
                src={OPEN_PLAY_PLAYERS.src}
                alt={OPEN_PLAY_PLAYERS.alt}
                width={OPEN_PLAY_PLAYERS.width}
                height={OPEN_PLAY_PLAYERS.height}
                sizes="(max-width: 760px) 100vw, 380px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
            </div>
          </div>
        </section>

        {/* WHY JOIN */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">Why Come</p>
            <h2 className="section-title">More Than a <span className="accent-green">Game</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🧠", title: "Stay Sharp", desc: "American Mahjong is a genuinely brain-stimulating game. Strategy, memory, pattern recognition: every session works your mind." },
                { icon: "👯", title: "Meet People", desc: "Las Vegas is a city of transplants and newcomers. Open Play is an easy way to meet other players and make friends in the Valley." },
                { icon: "🀄", title: "Your Tablescape", desc: "Pick a mat, racks and a set of tiles from the studio's collection and set up the table you want to play at." },
                { icon: "📈", title: "Keep Playing", desc: "More hands with more players is how your game keeps growing after Mahj 101." },
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

        {/* FAQ */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Open Play</span></h2>
            <div style={{ marginTop: "2rem" }}>
              {faqs.map((faq) => (
                <div key={faq.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>{faq.q}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* UPCOMING SESSIONS CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Find Your Next <span className="accent-pink">Game</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Open Play dates are on the schedule, alongside classes and special events at the studio.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/schedule" className="btn-primary">See Open Play Dates</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">Learn First →</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
