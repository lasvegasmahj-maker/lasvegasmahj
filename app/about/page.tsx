import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "About Shauna | Las Vegas's Only Certified Mahjong Instructor",
  description:
    "Meet Shauna, Las Vegas's only certified Oh My Mahjong instructor with 18 years of playing experience. Learn about her teaching style, her story, and why she started Las Vegas Mahjong.",
  alternates: { canonical: "https://lasvegasmahj.com/about" },
  openGraph: {
    title: "About Shauna | Las Vegas Mahjong",
    description: "Las Vegas's only certified Oh My Mahjong instructor. 18 years of experience, a passion for teaching, and a community built one tile at a time.",
    url: "https://lasvegasmahj.com/about",
    images: ["https://lasvegasmahj.com/shauna.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Shauna",
  jobTitle: "Certified Mahjong Instructor",
  description: "Las Vegas's only certified Oh My Mahjong instructor with 18 years of American Mahjong playing experience.",
  url: "https://lasvegasmahj.com/about",
  image: "https://lasvegasmahj.com/shauna.jpg",
  sameAs: [
    "https://www.instagram.com/lasvegasmahjong",
    "https://www.tiktok.com/@lasvegasmahjong",
  ],
  worksFor: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://lasvegasmahj.com",
  },
  knowsAbout: "American Mahjong, NMJL card, mahjong instruction, mahjong events",
  areaServed: "Las Vegas, NV",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "About Shauna", item: "https://lasvegasmahj.com/about" },
  ],
};

export default function About() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container" style={{ maxWidth: "800px" }}>
            <p className="section-label">Las Vegas's Only Certified Oh My Mahjong Instructor</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Meet <span className="accent-pink">Shauna</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>
              Founder of Las Vegas Mahjong. Certified Oh My Mahjong instructor. 18 years at the table, and counting.
            </p>
          </div>
        </section>

        {/* STORY */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
            <div>
              <img
                src="/shauna.jpg"
                alt="Shauna, founder of Las Vegas Mahjong and certified mahjong instructor"
                style={{ width: "100%", borderRadius: "8px", display: "block" }}
              />
            </div>
            <div>
              <p className="section-label">The Story</p>
              <h2 className="section-title" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", marginBottom: "1.5rem" }}>
                18 Years, One <span className="accent-green">Tile</span> at a Time
              </h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
                I first learned American Mahjong nearly 18 years ago, and I haven&rsquo;t stopped playing since. What started as a game with friends turned into a lifelong obsession with tiles, strategy, and the community that forms around every table.
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
                For years I taught friends and family the game informally. I loved watching the moment it clicked for someone new, that switch from confusion to confidence that happens somewhere in the first hour of a good lesson. Eventually I made it official: I became a <strong style={{ color: "var(--white)" }}>certified Oh My Mahjong instructor</strong>, and Las Vegas Mahjong was born.
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
                My goal is to make this game as accessible as possible. Mahjong has a reputation for being complicated, and I&rsquo;ve spent years proving that wrong, one beginner at a time.
              </p>
            </div>
          </div>
        </section>

        {/* CREDENTIALS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Credentials</p>
            <h2 className="section-title">Why Work <span className="accent-pink">With Me</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🏅", title: "Certified Instructor", desc: "I hold a certification from Oh My Mahjong, one of the leading American Mahjong companies." },
                { icon: "🀄", title: "18 Years Playing", desc: "Nearly two decades at the mahjong table means I've seen every type of hand, every learning style, and every common mistake. I know exactly where beginners get stuck and how to get them unstuck." },
                { icon: "🌟", title: "Beginner-Focused", desc: "Most of my students have never touched a mahjong tile before. I've designed my teaching approach specifically for people who feel intimidated by the game, and the results speak for themselves." },
                { icon: "📍", title: "Across the Valley", desc: "I teach across all of Las Vegas: Summerlin, Henderson, North Las Vegas, and the greater Valley. I come to you, which means you get a lesson at your home, your venue, or wherever works best." },
                { icon: "👥", title: "Over 100 Taught", desc: "I've taught over 100 people to play across the Las Vegas Valley, from one-on-one beginners and group classes to bachelorette parties and corporate team-building events." },
              ].map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">Teaching Style</p>
            <h2 className="section-title">Patient. Clear. <span className="accent-green">Fun.</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              I keep groups small on purpose. For group lessons, I work with 3 to 8 students max, which means everyone gets hands-on time, real feedback, and the chance to actually play rather than just watch.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              My approach is simple: no overwhelming rule dumps, no assuming you&rsquo;ve done any research beforehand, and no making anyone feel dumb for asking the same question twice. Mahjong is a game. Games are supposed to be fun. My job is to make sure it feels that way from the first tile.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Most students are playing their first real hand within the first hour. That&rsquo;s the goal, every time.
            </p>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">Students Say</p>
            <h2 className="section-title">Real <span className="accent-pink">Words</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { name: "Tamar", text: "I was on the verge of giving up on learning to play Mahjong. Then Shauna taught me. I got it straight away, after having tried for months. If it wasn't for Shauna, I wouldn't be playing Mahjong today and LOVING it!" },
                { name: "Sabrina", text: "I had such a great time learning Mahjong with Shauna! She's an amazing teacher, super patient, clear in her explanations, and she makes the whole experience really fun. Highly recommend!" },
                { name: "Molly", text: "If you need a mahjong lesson (or 5) @lasvegasmahjong is your woman. Amazing teacher." },
                { name: "Kristi, Northmarq", text: "We worked with Shauna for a corporate event in early 2026. Shauna was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we've ever received from this event." },
              ].map(t => (
                <div key={t.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontStyle: "italic", marginBottom: "1rem" }}>&ldquo;{t.text}&rdquo;</p>
                  <div style={{ fontFamily: "var(--font-nav)", fontSize: "0.85rem", color: "var(--pink)", fontWeight: 700 }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Ready to <span className="accent-pink">Learn?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Book a group lesson, private session, or private event. Las Vegas, Summerlin, Henderson, and beyond.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/mahjong-lessons-las-vegas" className="btn-primary">Book a Lesson</a>
              <a href="/mahjong-parties-las-vegas" className="btn-outline">Private Events</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
