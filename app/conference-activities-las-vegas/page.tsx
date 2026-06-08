import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Conference Activities Las Vegas",
  description:
    "Conference activities in Las Vegas built around mahjong. A memorable networking ice-breaker that runs in your hotel meeting room, scales to 100+, no experience needed. Get a quote.",
  keywords: [
    "conference activities Las Vegas",
    "conference entertainment Las Vegas",
    "conference networking activity Las Vegas",
    "convention activities Las Vegas",
    "meeting break-out activity Las Vegas",
    "hotel meeting room activity Las Vegas",
    "networking ice-breaker Las Vegas",
    "group activities Las Vegas conferences",
  ],
  alternates: { canonical: "https://www.lasvegasmahj.com/conference-activities-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Conference Activities in Las Vegas | Mahjong Networking Break",
    description: "A memorable mahjong break-out and networking activity for conferences and large meetings in Las Vegas. Scales from one table to 100+. Contact for a quote.",
    url: "https://www.lasvegasmahj.com/conference-activities-las-vegas",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Conference Activities in Las Vegas | Mahjong Networking Break",
    description: "A memorable mahjong break-out and networking activity for conferences and large meetings in Las Vegas. Scales from one table to 100+. Contact for a quote.",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Conference Activities Las Vegas",
  description: "A mahjong networking and break-out activity for conferences, conventions, and large meetings in Las Vegas. Runs in a hotel meeting room or on-site, scales from one table to 100+, no experience needed.",
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
  audience: { "@type": "BusinessAudience", name: "Conference organizers, meeting planners, and out-of-town groups in Las Vegas" },
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", url: "https://www.lasvegasmahj.com/conference-activities-las-vegas" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Corporate Team Building", item: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Conference Activities", item: "https://www.lasvegasmahj.com/conference-activities-las-vegas" },
  ],
};

const faqs = [
  { q: "Can a mahjong activity work for a large conference group?", a: "Yes. We scale from a single table to 100+ guests. For large groups we bring extra facilitators so every table gets proper instruction and stays engaged. Contact us with your headcount for a quote." },
  { q: "Do our attendees need any mahjong experience?", a: "None at all. We teach the game from zero and have people playing real hands within the first session, so it works for a room of total beginners and mixed skill levels alike." },
  { q: "Can you run this in our hotel meeting room or on-site?", a: "Yes. We come to your hotel meeting room, ballroom, breakout space, or on-site venue. We handle setup, bring all tiles, racks, and NMJL cards, and facilitate the activity from start to finish." },
  { q: "How long does a conference mahjong activity run?", a: "Most run 60 to 90 minutes as a break-out or networking session, and we can shorten or extend to fit your agenda. Tell us your time slot and we will tailor the format." },
  { q: "Why is mahjong a good conference networking activity?", a: "Four people at a small table, learning something new together, naturally start talking. It breaks the ice faster than a reception and gives out-of-town attendees a shared experience to remember." },
  { q: "How much does a conference mahjong activity cost?", a: "Pricing depends on group size, format, and length, so we put together a custom proposal. Contact us for a quote and we will respond within 24 hours." },
];

export default function ConferenceActivitiesLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Conferences · Conventions · Large Meetings</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Conference Activities in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Give your attendees a break that they actually remember. A mahjong break-out is a memorable networking activity that runs right in your hotel meeting room, scales from one table to 100+, and needs zero experience to enjoy.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Request a Quote</a>
              <a href="/corporate-team-building-las-vegas" className="btn-outline">Corporate Team Building</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Why Mahjong</p>
            <h2 className="section-title">The Networking Activity That <span className="accent-pink">Gets People Talking</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🤝", title: "A Real Ice-Breaker", desc: "Four people at one small table, learning a new game together. Attendees who would never strike up a conversation at a reception end up laughing and trading tips within minutes." },
                { icon: "📈", title: "Scales to 100+", desc: "Run a single demo table at a booth or fill a ballroom with dozens of tables. We bring additional facilitators so every group gets hands-on instruction, no matter the headcount." },
                { icon: "🏨", title: "Runs in Your Meeting Room", desc: "No off-site logistics, no buses, no scheduling around a venue. We set up in your hotel meeting room or breakout space and have your group playing in minutes." },
                { icon: "🌟", title: "Genuinely Memorable", desc: "Out-of-town attendees have seen plenty of receptions and panels. A mahjong session is the part of the agenda they talk about on the flight home." },
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
            <h2 className="section-title">Formats That Fit Your <span className="accent-green">Agenda</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "Networking Break-Out", desc: "A 60 to 90 minute session that drops into your agenda between keynotes or sessions. Perfect for getting a room of strangers talking and energized." },
                { title: "Conference Reception Activity", desc: "Set up tables during a welcome reception or evening social. Guests rotate through, learn the game, and connect over something more engaging than small talk." },
                { title: "Exhibit Booth Draw", desc: "A live demo table at your booth pulls attendees in and gives your team a natural reason to start conversations. A standout way to drive booth traffic." },
                { title: "Out-of-Town Group Activity", desc: "Hosting an incoming group in Las Vegas? A guided mahjong session gives visiting attendees a uniquely local, social experience without leaving the property." },
                { title: "Large Meeting or General Session", desc: "For big groups, we fill the room with tables and bring a team of facilitators so every attendee gets hands-on instruction at the same time." },
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
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "2.5rem" }}>
              Every format includes all equipment (152-tile American sets, racks, and current NMJL cards), setup, and full facilitation from start to finish. You provide the room and any food or drink you would like. Want a deeper look at how we run company events? See our{" "}
              <a href="/mahjong-corporate-las-vegas" className="accent-green" style={{ textDecoration: "underline" }}>corporate mahjong events</a> page.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Conference Activities</span></h2>
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

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Make Your Agenda <span className="accent-green">Unforgettable</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Tell us your group size, dates, and the time slot you want to fill. We will send a custom proposal within 24 hours. Planning a broader program? Start with{" "}
              <a href="/corporate-team-building-las-vegas" className="accent-green" style={{ textDecoration: "underline" }}>corporate team building</a>.
            </p>
            <a href="/#classes" className="btn-primary">Request a Quote</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
