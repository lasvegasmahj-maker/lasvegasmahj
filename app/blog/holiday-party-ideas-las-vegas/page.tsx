import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Holiday Party Las Vegas | A Party People Remember",
  description:
    "Why a mahjong party is the memorable holiday get-together for Las Vegas friend groups, families, and work teams. Beginners taught from scratch, or a hosted open play for groups that already play.",
  alternates: { canonical: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas" },
  openGraph: {
    title: "Mahjong Holiday Party Las Vegas | A Party People Remember",
    description:
      "Why a mahjong party is the memorable holiday get-together for Las Vegas friend groups, families, and work teams. Beginners taught from scratch, or a hosted open play for groups that already play.",
    url: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas",
    siteName: "Las Vegas Mahjong",
    locale: "en_US",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Mahjong Holiday Party Las Vegas: A Party People Remember",
  description: "Why a mahjong party is the memorable holiday get-together for Las Vegas friend groups, families, and work teams, whether they are learning from scratch or playing a hosted open play.",
  image: "https://www.lasvegasmahj.com/hero-bg.jpg",
  datePublished: "2026-08-09",
  dateModified: "2026-08-09",
  author: {
    "@type": "Person",
    name: "Shauna",
    url: "https://www.lasvegasmahj.com/about",
  },
  publisher: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    "@id": "https://www.lasvegasmahj.com/#business",
  },
  mainEntityOfPage: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.lasvegasmahj.com/blog" },
    { "@type": "ListItem", position: 3, name: "Mahjong Holiday Party Las Vegas", item: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Who is a holiday mahjong party good for?", acceptedAnswer: { "@type": "Answer", text: "Friend groups, families, neighbors, and work teams all fit. Everyone learns or plays together, which puts quiet and outgoing people on equal footing and gives the group something to do besides stand around a bar. Groups of 4 to 20 or more are welcome." } },
    { "@type": "Question", name: "What if our group already knows how to play?", acceptedAnswer: { "@type": "Answer", text: "Then we set it up as a hosted open play. Tables are ready when you arrive, so your crew just sits down and plays. No lesson needed." } },
    { "@type": "Question", name: "What if nobody has played before?", acceptedAnswer: { "@type": "Answer", text: "That is the most common setup. A certified instructor brings all the tiles and teaches the whole group from scratch, then everyone plays a real game together. No experience needed." } },
    { "@type": "Question", name: "How much does a holiday mahjong party cost?", acceptedAnswer: { "@type": "Answer", text: "Pricing depends on your group size, location, and what you're looking for. Contact us for a custom quote." } },
    { "@type": "Question", name: "How far in advance should I book a holiday mahjong party?", acceptedAnswer: { "@type": "Answer", text: "December fills up fast. Book four to six weeks ahead for prime December dates. Earlier weekends and weekday slots have more availability." } },
  ],
};

const reasons = [
  {
    num: "01",
    title: "Everyone Is Included",
    tag: "No One Sits Out",
    desc: "The usual holiday party leaves people clustered with the same few faces they always talk to. Around a mahjong table, the quiet person and the outgoing person are doing the exact same thing at the same moment. It levels the room in a way a bar never does, whether it is friends, family, or coworkers.",
    accent: "pink",
  },
  {
    num: "02",
    title: "It Gives People Something to Do",
    tag: "Not Just Drinks",
    desc: "A shared activity beats standing around holding a glass. Mahjong is social and lightly competitive, so the conversation happens naturally over the tiles instead of stalling out. People relax faster when their hands are busy and there is a game to focus on.",
    accent: "green",
  },
  {
    num: "03",
    title: "Beginners Are Welcome",
    tag: "Taught From Scratch",
    desc: "Nobody has to know how to play. A certified instructor brings every tile and rack and teaches the whole group from the ground up, then everyone plays a real game together. Beginners are the point, not a problem.",
    accent: "pink",
  },
  {
    num: "04",
    title: "Or Make It an Open Play",
    tag: "Already Know How",
    desc: "If your friend group or team already plays, skip the lesson. We set the party up as a hosted open play with tables ready to go, so everyone just sits down and plays. It is a festive reason for a regular crew to get together over the holidays.",
    accent: "green",
  },
  {
    num: "05",
    title: "It Fits Any Group",
    tag: "Friends or Work",
    desc: "Friend group, family, neighbors, or an office team, the party scales the same way. Groups of 4 to 20 or more are welcome, and the format works for a mixed-age crowd just as well as a room full of coworkers.",
    accent: "pink",
  },
  {
    num: "06",
    title: "It Is Actually Memorable",
    tag: "The Part People Talk About",
    desc: "This is the holiday party people bring up again in January. It is different from every other happy hour on the calendar, and plenty of groups keep playing long after the season ends. That is the whole goal: a get-together that sticks.",
    accent: "green",
  },
];

export default function MahjongHolidayPartyLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Las Vegas Holiday Parties · 2026</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 7vw, 4rem)", marginBottom: "1.5rem" }}>
              The Holiday Party <span className="accent-pink">People Remember</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.75 }}>
              The holiday happy hour is fine. But if you want a get-together your friends, family, or team actually talk about afterward, host a mahjong party. Beginners learn from scratch, and groups who already play just play.
            </p>
          </div>
        </section>

        <section style={{ padding: "4rem 2rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Every December runs the same playbook: a bar, a dinner, a round of drinks, and a lot of people standing in clusters talking to the same faces they always talk to. It is pleasant, and it is forgotten by New Year.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              A mahjong party is the opposite. Everyone sits down and spends the night actually interacting instead of just sharing a room. If nobody has played, a certified instructor teaches the whole group from scratch. If your crew already knows the game, book it as a hosted open play and just play. It works for a friend group, a family get-together, or an office team the same way. Here is why it lands.
            </p>
          </div>
        </section>

        <section style={{ padding: "3rem 2rem 5rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            {reasons.map((reason, i) => (
              <div key={reason.num} style={{ display: "flex", gap: "2rem", padding: "2rem 0", borderBottom: i < reasons.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: reason.accent === "pink" ? "var(--pink)" : "var(--green)", opacity: 0.3, flexShrink: 0, lineHeight: 1, minWidth: "3rem" }}>{reason.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontFamily: "var(--font-nav)", fontSize: "1.1rem", fontWeight: 700, color: "var(--white)", margin: 0 }}>{reason.title}</h2>
                    {reason.tag && (
                      <span style={{ background: reason.accent === "pink" ? "rgba(233,30,140,0.15)" : "rgba(57,230,57,0.12)", color: reason.accent === "pink" ? "var(--pink)" : "var(--green)", fontSize: "0.7rem", fontFamily: "var(--font-nav)", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "4px", letterSpacing: "0.05em" }}>{reason.tag}</span>
                    )}
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>{reason.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "0 2rem 5rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <h2 className="section-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", marginBottom: "1.25rem" }}>
              How the <span className="accent-pink">Party Runs</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              You pick the date and the place. The studio inside Lucky Hare is home base, or we can come to your home, venue, or office for private events. Everything you need comes with us: tiles, racks, and a certified instructor.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              A typical party runs a couple of hours. For a group of beginners, that is a friendly walk-through of the basics and then a real game. For a group that already plays, it is a hosted open play, so everyone just shows up and plays. Add food and drinks if you like, or keep it simple. Every event is customized to your group. Contact us for a custom quote.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Common <span className="accent-pink">Questions</span></h2>
            <div style={{ marginTop: "2rem" }}>
              {[
                { q: "Who is a holiday mahjong party good for?", a: "Friend groups, families, neighbors, and work teams all fit. Everyone learns or plays together, which puts quiet and outgoing people on equal footing and gives the group something to do besides stand around a bar. Groups of 4 to 20 or more are welcome." },
                { q: "What if our group already knows how to play?", a: "Then we set it up as a hosted open play. Tables are ready when you arrive, so your crew just sits down and plays. No lesson needed." },
                { q: "What if nobody has played before?", a: "That is the most common setup. A certified instructor brings all the tiles and teaches the whole group from scratch, then everyone plays a real game together. No experience needed." },
                { q: "How much does a holiday mahjong party cost?", a: "Pricing depends on your group size, location, and what you're looking for. Contact us for a custom quote." },
                { q: "How far in advance should I book a holiday mahjong party?", a: "December fills up fast. Book four to six weeks ahead for prime December dates. Earlier weekends and weekday slots have more availability." },
              ].map(faq => (
                <div key={faq.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>{faq.q}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(233,30,140,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Book a <span className="accent-pink">Holiday Party</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Private mahjong parties for friend groups, family get-togethers, and office teams. Beginners learn from scratch, or we set up a hosted open play for groups that already play. We bring everything you need. Contact us for a custom quote.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/mahjong-parties-las-vegas" className="btn-primary">See Party Details</a>
              <a href="/mahjong-corporate-las-vegas" className="btn-outline">Corporate Events</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
