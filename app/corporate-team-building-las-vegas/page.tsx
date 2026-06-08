import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Corporate Team Building Las Vegas",
  description:
    "Corporate team building in Las Vegas that teams actually remember. Strategic, social mahjong for any group size. We bring everything to your office, hotel, or venue. Get a quote.",
  keywords: [
    "corporate team building Las Vegas",
    "team building activities Las Vegas",
    "unique team building activities Las Vegas",
    "corporate event entertainment Las Vegas",
    "corporate team building activity Las Vegas",
    "team building Las Vegas mahjong",
    "offsite activities Las Vegas",
    "group activities Las Vegas",
    "fun team building Las Vegas",
  ],
  alternates: { canonical: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Corporate Team Building Las Vegas",
    description: "Mahjong team building in Las Vegas. Strategic, social, and genuinely different from the usual happy hours and escape rooms. Any group size. Contact for a quote.",
    url: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Team Building Las Vegas",
    description: "Mahjong team building in Las Vegas. Strategic, social, and genuinely different from the usual happy hours and escape rooms. Any group size. Contact for a quote.",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Corporate Team Building Las Vegas",
  description: "Mahjong-based corporate team building in Las Vegas. A strategic, social, and genuinely different activity for teams, departments, and offsites of any size. We bring everything to your office, hotel, or venue.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://www.lasvegasmahj.com/#business",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
  },
  areaServed: [
    { "@type": "City", name: "Las Vegas" },
    { "@type": "City", name: "Henderson" },
    { "@type": "City", name: "Summerlin" },
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
    { "@type": "ListItem", position: 2, name: "Corporate Team Building", item: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas" },
  ],
};

const faqs = [
  { q: "What makes mahjong a good corporate team building activity?", a: "Mahjong rewards strategy, reading the table, and quick communication, the same skills that make a strong team. It also levels the playing field: leaders and new hires learn together from zero, which breaks down hierarchy in a way a standard happy hour cannot." },
  { q: "How many people can you accommodate for a team building event?", a: "Any group size. We run small departments and large offsites alike, scaling tables and facilitation so every group gets proper instruction. Tell us your headcount and we will build the right setup." },
  { q: "Do you come to our office, hotel, or event venue?", a: "Yes. We come to your office, a hotel meeting room, a private restaurant room, or a corporate venue, and we bring everything: tiles, racks, NMJL cards, and full facilitation. You provide the space and any food or drink." },
  { q: "How much does a corporate team building event cost?", a: "Pricing depends on group size, length, and location, so we put together a custom plan for each event. Contact us for a quote and we will respond within 24 hours." },
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
            <p className="section-label">Team Building · Offsites · Any Group Size</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Corporate Team Building in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "660px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Your team has done the happy hours and the escape rooms. Give them something genuinely different: a strategic, social mahjong experience that builds communication and real connection. Any group size, and we bring everything to you.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Request a Quote</a>
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
            <p className="section-label">How It Works</p>
            <h2 className="section-title">We Bring the Whole Experience to <span className="accent-green">You</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginTop: "1.5rem" }}>
              From a small department session to a full company offsite, the format flexes to fit your group and your room. Here is how a typical event comes together.
            </p>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "Tell Us About Your Team", desc: "Share your headcount, date, location, and what you want out of the event. We build a plan around your goals, whether that is connection, a reward, or a memorable break from the agenda." },
                { title: "We Set Up Everywhere You Are", desc: "Your office, a hotel meeting room, a restaurant private room, or a corporate venue. We bring all the tiles, racks, and NMJL cards, and we handle setup and breakdown." },
                { title: "Everyone Learns From Zero", desc: "No experience needed. We teach the basics fast, then facilitate every table so beginners and mixed-experience teams stay engaged from the first hand." },
                { title: "Play, Connect, and Compete", desc: "The room comes alive once people are playing. Add a friendly tournament format if your team likes a little competition, or keep it relaxed and social." },
                { title: "Scale to Any Group Size", desc: "Small teams or large offsites, we bring the right number of facilitators so no one is left waiting. Tell us the headcount and we make it work." },
              ].map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              <a href="/conference-activities-las-vegas" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--green)" }}>Conference Activities in Las Vegas</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>A standout break-out or evening session for conference attendees. We slot mahjong into your agenda and bring everything to the room.</p>
              </a>
              <a href="/convention-activities-las-vegas" style={{ display: "block", textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--green)" }}>Convention Activities in Las Vegas</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>A memorable activity for out-of-town convention groups. Perfect for hospitality suites, booth draws, and after-hours gatherings.</p>
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
              Tell us your group size, date, and what you are looking for, and we will send a custom quote within 24 hours.
            </p>
            <a href="/#classes" className="btn-primary">Request a Quote</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
