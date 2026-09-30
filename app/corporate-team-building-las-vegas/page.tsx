import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Corporate Team Building Las Vegas",
  description:
    "Corporate team building in Las Vegas: mahjong puts colleagues at one table to learn, talk and compete together. For teams, departments and offsites.",
  alternates: { canonical: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Corporate Team Building Las Vegas",
    description: "Mahjong team building in Las Vegas: colleagues learn a new game side by side, then read the table and compete. For teams, departments and offsites.",
    url: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Team Building Las Vegas",
    description: "Mahjong team building in Las Vegas: colleagues learn a new game side by side, then read the table and compete. For teams, departments and offsites.",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Corporate Team Building Las Vegas",
  serviceType: "Corporate team building",
  description: "Mahjong-based corporate team building in Las Vegas. A strategic, social, and genuinely different activity for teams, departments, and offsites of any size. We bring the mahjong equipment and facilitation to your office, hotel, or venue.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://www.lasvegasmahj.com/#business",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
  },
  areaServed: [
    { "@type": "City", name: "Las Vegas" },
    { "@type": "City", name: "Henderson" },
    { "@type": "Place", name: "Summerlin" },
    { "@type": "Place", name: "Green Valley" },
    { "@type": "Place", name: "Anthem" },
  ],
  audience: { "@type": "BusinessAudience", name: "Corporate teams, departments, and offsites in Las Vegas" },
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", url: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Corporate Events", item: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Corporate Team Building", item: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas" },
  ],
};

const faqs = [
  { q: "What makes mahjong a good corporate team building activity?", a: "Mahjong rewards strategy, reading the table, and quick communication, the same skills that make a strong team. It also levels the playing field: leaders and new hires learn together from zero, which breaks down hierarchy in a way a standard happy hour cannot." },
  { q: "How many people can you accommodate for a team building event?", a: "We run sessions for small departments and larger offsites, adding facilitators to match the headcount so every table gets proper instruction. Tell us your numbers and we will plan the setup." },
  { q: "Do you come to our office, hotel, or event venue?", a: "Yes. We come to your office, a hotel meeting room, a private restaurant room, or a corporate venue, and we bring the mahjong equipment: tiles, racks, NMJL cards, and full facilitation. Your venue provides the space, tables and chairs, and any food or drink." },
  { q: "Can mahjong be part of a corporate offsite in Las Vegas?", a: "Yes. A 2-3 hour mahjong session fits into an offsite agenda, whether it opens the day, breaks up a long afternoon of meetings, or closes the evening. We come to your offsite venue, hotel or office and bring the game. Contact us for a quote." },
  { q: "How much does a corporate team building event cost?", a: "Pricing depends on group size, length, and location, so we put together a custom plan for each event. Contact us for a quote and we will follow up with a custom plan." },
  { q: "Does anyone need to know how to play mahjong beforehand?", a: "No experience required. We start from zero, and most groups are playing real hands within the first session. Beginners are our specialty, so mixed-experience teams are welcome." },
  { q: "How long does a typical team building event run?", a: "Most events run 2-3 hours, and we tailor the length to your agenda. Tell us your schedule and we will fit the experience to it. Contact us for a quote." },
];

export default function CorporateTeamBuildingLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Team Building · Offsites · Departments</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Corporate Team Building in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "660px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Your team has done the happy hours and the escape rooms. Give them something genuinely different: a strategic, social mahjong experience that builds communication and real connection. Everyone learns together, from the very first tile.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=team-building" className="btn-primary">Request a Quote</a>
              <a href="/mahjong-corporate-las-vegas" className="btn-outline">See Corporate Details</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Why Mahjong</p>
            <h2 className="section-title">A Team Building Activity That <span className="accent-pink">Actually Works</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginTop: "1.5rem", marginBottom: "0.5rem", maxWidth: "640px" }}>
              Most team building lands somewhere between forgettable and forced. Mahjong is different because the game itself does the work: four people at a table, focused on the same goal, learning to read each other and adapt in real time.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🧠", title: "Strategy Sharpens Thinking", desc: "Mahjong demands planning, reading the table, and adapting fast. The instincts that make a strong player are the same ones that make a strong teammate." },
                { icon: "🤝", title: "Levels the Hierarchy", desc: "The VP and the new hire start as beginners together. That shared learning moment dissolves rank in a way no icebreaker can manufacture." },
                { icon: "💬", title: "Builds Real Communication", desc: "Side-by-side, low-pressure, and genuinely engaging. The table sparks the kind of conversation a presentation or workshop never will." },
                { icon: "🎯", title: "Genuinely Memorable", desc: "Teams leave saying \"we should do that again,\" not \"that was a nice dinner.\" That is the difference between a team event and a team experience." },
              ].map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">The Team Experience</p>
            <h2 className="section-title">What Happens at <span className="accent-green">the Table</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginTop: "1.5rem" }}>
              Here is how a session unfolds for a team, from the first tile to the final hand.
            </p>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "First Tiles, Together", desc: "We teach the whole group at once, so the opening minutes are a shared puzzle rather than a presentation. Nobody has a head start." },
                { title: "Learning Side by Side", desc: "The tiles, the card and how a hand comes together. Tablemates ask questions out loud and help each other through the first hands." },
                { title: "Reading the Table", desc: "Once play gets going, everyone watches discards, plans a hand and changes course when the tiles do not cooperate, with mistakes that cost nothing." },
                { title: "Play, Connect, and Compete", desc: "The room comes alive once people are playing. Add a friendly tournament format if your team likes a little competition, or keep it relaxed and social." },
              ].map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--green)", opacity: 0.35, flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Related Corporate Experiences</p>
            <h2 className="section-title">More Ways to <span className="accent-pink">Bring Mahjong to Work</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginTop: "1.5rem", marginBottom: "0.5rem" }}>
              Team building is one part of what we do for organizations in Las Vegas. If you are planning around a larger program, these formats fit naturally into a busy week.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              <a href="/conference-activities-las-vegas" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--green)" }}>Conference Activities in Las Vegas</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>A standout break-out or evening session for conference attendees. We slot mahjong into your agenda and bring the game to the room.</p>
              </a>
              <a href="/convention-activities-las-vegas" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--green)" }}>Convention Activities in Las Vegas</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>A memorable activity for out-of-town convention groups. Perfect for hospitality suites, booth draws, and after-hours gatherings.</p>
              </a>
              <a href="/las-vegas-meeting-planner-activities" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--green)" }}>Meeting Planner Activities in Las Vegas</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>An icebreaker, a breakout between sessions or an evening social, fitted to the slot in your meeting agenda.</p>
              </a>
              <a href="/corporate-event-activities-las-vegas" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--green)" }}>Corporate Event Activities in Las Vegas</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>Employee appreciation, client nights, sales meetings and holiday parties, with the format that suits each.</p>
              </a>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginTop: "2rem" }}>
              Want the full rundown on how we run events for companies? See our <a href="/mahjong-corporate-las-vegas" style={{ color: "var(--green)", textDecoration: "underline" }}>corporate mahjong events page</a> for formats, logistics, and what is included.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-green">Team Building</span></h2>
            <div style={{ marginTop: "2rem" }}>
              {faqs.map(faq => (
                <div key={faq.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>{faq.q}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Build Something <span className="accent-green">Your Team Remembers</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Tell us your group size, date, and what you are looking for, and we will follow up with a custom quote.
            </p>
            <a href="/contact?source=team-building" className="btn-primary">Request a Quote</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
