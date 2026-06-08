import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Convention Activities Las Vegas",
  description:
    "Mahjong as a convention activity in Las Vegas. A social, hands-on experience for attendee groups, exhibitors, and booth draws, any size. Contact for a quote.",
  keywords: [
    "convention activities Las Vegas",
    "convention entertainment Las Vegas",
    "things to do for convention groups Las Vegas",
    "convention group activities Las Vegas",
    "attendee engagement activities Las Vegas",
    "exhibitor booth activity Las Vegas",
    "trade show entertainment Las Vegas",
    "convention team building Las Vegas",
    "mahjong convention activity Las Vegas",
    "group activities for conventions Las Vegas",
  ],
  alternates: { canonical: "https://www.lasvegasmahj.com/convention-activities-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Convention Activities Las Vegas | Las Vegas Mahjong",
    description: "Mahjong is a unique convention activity in Las Vegas. Social, memorable, and built for large groups. Hosted at your venue, hotel, or nearby space. Contact for a quote.",
    url: "https://www.lasvegasmahj.com/convention-activities-las-vegas",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convention Activities Las Vegas | Las Vegas Mahjong",
    description: "A unique, social mahjong activity for convention groups in Las Vegas. Booth draws, attendee engagement, and group downtime, any size. Contact for a quote.",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Convention Activities Las Vegas",
  description: "Mahjong convention activities and attendee experiences in Las Vegas. A unique, social, hands-on activity for convention groups, exhibitors, and large gatherings of any size.",
  provider: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    "@id": "https://www.lasvegasmahj.com/#business",
  },
  areaServed: [
    { "@type": "City", name: "Las Vegas" },
    { "@type": "City", name: "Henderson" },
    { "@type": "City", name: "Summerlin" },
    { "@type": "Place", name: "Green Valley" },
    { "@type": "Place", name: "Anthem" },
  ],
  audience: { "@type": "BusinessAudience", name: "Convention organizers, exhibitors, and attendee groups in Las Vegas" },
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", url: "https://www.lasvegasmahj.com/convention-activities-las-vegas" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Corporate Team Building", item: "https://www.lasvegasmahj.com/corporate-team-building-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Convention Activities", item: "https://www.lasvegasmahj.com/convention-activities-las-vegas" },
  ],
};

const faqs = [
  { q: "Can you handle large convention groups?", a: "Yes. We accommodate large attendee groups and scale the number of facilitators to the headcount so every table gets proper instruction. Tell us your expected numbers and we will build the right setup. Contact us for a quote." },
  { q: "Where can a convention mahjong activity be hosted?", a: "We come to you. We host at the convention venue, your hotel meeting space, an exhibitor suite, or a nearby room you have booked. We work with the space and schedule you already have. Contact us for a quote." },
  { q: "How does mahjong work as a booth draw or attendee engagement activity?", a: "We can run rotating short sessions to keep traffic moving at your booth, or set up longer hosted tables for group downtime between sessions. It gives attendees a reason to stop, sit down, and connect. Contact us for a quote." },
  { q: "What is included in a convention mahjong activity?", a: "We bring all the equipment (152-tile American Mahjong sets, racks, and NMJL cards) and provide full instruction and facilitation start to finish. You provide the space and any food or drink you would like." },
  { q: "How much does a convention activity cost?", a: "Convention and group pricing depends on your headcount, format, and schedule, so we build a custom quote for each event. Tell us your dates and expected numbers and we will send pricing. Contact us for a quote." },
  { q: "Do attendees need any mahjong experience?", a: "None at all. Mahjong is approachable for complete beginners, and jokers are wild, which makes early hands forgiving and fun. We start from zero and have groups playing quickly." },
];

export default function ConventionActivitiesLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Conventions · Trade Shows · Attendee Engagement</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Convention Activities in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "660px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Las Vegas is the top convention city in the country, which means your attendees have seen every standard activity. Give them something different: a social, hands-on mahjong experience that gets people sitting down, talking, and remembering your event.
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
            <h2 className="section-title">A Convention Activity People <span className="accent-pink">Actually Remember</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🪑", title: "It Gets People to Sit Down", desc: "Conventions are exhausting and most activities keep attendees on their feet. A hosted mahjong table gives people a reason to stop, settle in, and engage for more than a passing glance." },
                { icon: "🧲", title: "A Real Booth Draw", desc: "A live, social game pulls foot traffic to an exhibitor booth in a way a screen or a giveaway bowl cannot. People stop to watch, then stay to play." },
                { icon: "💬", title: "Built for Connection", desc: "Four people at a small table, focused on the same game. It sparks the kind of relaxed conversation that turns strangers at a convention into actual connections." },
                { icon: "📈", title: "Scales to the Crowd", desc: "From a single booth table to a large hosted room, we add facilitators to match your headcount so the experience holds up no matter how big the group is." },
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
            <p className="section-label">Formats</p>
            <h2 className="section-title">Ways We Run It at Your <span className="accent-green">Convention</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "Booth Draw Tables", desc: "Short, rotating sessions right at your exhibitor booth. A live game pulls attendees in and keeps your booth busy and memorable on the show floor." },
                { title: "Attendee Engagement Sessions", desc: "Hosted tables in a meeting room or lounge so attendees can drop in, learn, and play between sessions. A welcoming way to keep your group connected." },
                { title: "Group Downtime and Receptions", desc: "An evening or afternoon mahjong experience for out-of-town groups. A relaxed alternative to another dinner or another cocktail hour." },
                { title: "Hosted at Your Venue", desc: "We come to the convention center, your hotel meeting space, an exhibitor suite, or a nearby room you have booked. We work with the space and schedule you have." },
                { title: "Large-Group Capacity", desc: "We scale facilitators to your headcount so every table gets proper instruction. Tell us your expected numbers and we will build the right setup." },
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
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginTop: "2.5rem" }}>
              Planning a company-wide event around your convention? See our full <a href="/corporate-team-building-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate team building</a> options, or explore <a href="/mahjong-corporate-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate mahjong events</a> for teams, conferences, and incentive trips.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Convention Activities</span></h2>
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
            <h2 className="section-title">Make Your Convention <span className="accent-green">Stand Out</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Tell us your dates, expected headcount, and what you have in mind, whether it is a booth draw, an attendee session, or group downtime. We will send a custom quote within 24 hours.
            </p>
            <a href="/#classes" className="btn-primary">Request a Convention Quote</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
