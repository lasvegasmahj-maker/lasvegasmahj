import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import RelatedExperiences from "@/components/related-experiences";
import { buildBreadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://www.lasvegasmahj.com/corporate-event-activities-las-vegas";

/**
 * Written for the person who has an occasion and no activity yet ("what do we do for client
 * night?"), which is a different search from /mahjong-corporate-las-vegas, where the reader
 * already wants mahjong and needs to know how we run it. Organized by occasion so that client
 * entertainment, employee appreciation, sales meetings, retreats and holiday parties each get
 * a real answer here instead of a thin page of their own.
 */

export const metadata: Metadata = {
  title: "Corporate Event Activities in Las Vegas",
  description:
    "Corporate event activities in Las Vegas for employee appreciation, client entertainment, sales meetings, retreats and holiday parties. Hosted mahjong.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    ...ogBase,
    title: "Corporate Event Activities in Las Vegas | Las Vegas Mahjong",
    description:
      "Thanking employees, hosting clients, rewarding a sales team or celebrating the season: a hosted American Mahjong activity that fits the occasion.",
    url: PAGE_URL,
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Corporate Event Activities Las Vegas",
  serviceType: "Corporate event activity",
  description:
    "Hosted, facilitated American Mahjong activities for company occasions in Las Vegas: employee appreciation, client entertainment, sales meetings, leadership retreats, holiday and quarterly parties, offsites and charity events.",
  url: PAGE_URL,
  provider: { "@id": "https://www.lasvegasmahj.com/#business" },
  areaServed: { "@type": "City", name: "Las Vegas", containedInPlace: { "@type": "State", name: "Nevada" } },
  audience: { "@type": "BusinessAudience", name: "Companies planning employee, client and leadership events in Las Vegas" },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Corporate Events", url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
  { name: "Corporate Event Activities", url: PAGE_URL },
]);

const occasions = [
  {
    title: "Employee appreciation",
    desc: "A hosted afternoon or evening that feels like a thank-you rather than another meeting. Everyone learns together, so no one needs a skill to enjoy it.",
  },
  {
    title: "Client entertainment",
    desc: "A private hosted table gives your team relaxed time with clients and something to talk about besides business. In town for a show? Booths and hospitality suites have their own formats.",
    link: { href: "/trade-show-booth-activities-las-vegas", text: "See trade show booth activities" },
  },
  {
    title: "Sales meetings",
    desc: "Break up a day of numbers with a game that rewards reading the table and adapting fast. Add a friendly tournament if the team likes to compete.",
    link: { href: "/las-vegas-meeting-planner-activities", text: "Fit it into a meeting agenda" },
  },
  {
    title: "Executive retreats",
    desc: "A small group and a game of strategy and judgment. It gives leaders unstructured time together, away from the slides.",
  },
  {
    title: "Holiday and quarterly parties",
    desc: "Skip the standard dinner. Tables of mixed players and first-timers give the whole team something to do together.",
  },
  {
    title: "Offsites",
    desc: "A longer team session that works as team building for a department or a whole company away from the office.",
    link: { href: "/corporate-team-building-las-vegas", text: "See corporate team building" },
  },
  {
    title: "Charity and fundraiser events",
    desc: "A mahjong fundraiser, tournament or awareness event built around your organization's goals.",
  },
  {
    title: "Visiting teams and reward trips",
    desc: "Bringing a group to Las Vegas as a reward? A hosted session set up at the group's hotel.",
    link: { href: "/incentive-group-activities-las-vegas", text: "See incentive group activities" },
  },
];

const roles = [
  { title: "Team building", body: "The skills that make a good player, planning, reading the table and adapting, are the ones that make a good teammate." },
  { title: "Networking", body: "Mixing departments, offices or companies at each table gets people talking who would not otherwise meet." },
  { title: "Guest engagement", body: "Guests play instead of watching, which is what separates an activity from entertainment on a stage." },
  { title: "A breakout", body: "It can be one segment of a longer event, such as a session after dinner, rather than the whole program." },
  { title: "Hosting clients", body: "Hosts and clients share a table and a game, not only a conversation about the account." },
  { title: "A hosted social", body: "We run it start to finish, including setup and breakdown, so the host team can relax too." },
  { title: "A group activity", body: "A bigger event still gets proper instruction at every table, because the facilitator team grows with the guest list." },
];

const faqs = [
  {
    q: "What company events is a mahjong activity a good fit for?",
    a: "Employee appreciation events, client entertainment, sales meetings, leadership retreats, holiday and quarterly parties, offsites and charity events. It suits occasions where you want people doing something together rather than sitting through a program.",
  },
  {
    q: "Can employees and clients attend the same event?",
    a: "Yes. Colleagues and guests, beginners and people who already play, can all sit at the same tables. We teach from zero and facilitate every table.",
  },
  {
    q: "Can the activity be competitive?",
    a: "It can. Some groups keep it relaxed and social; others finish with a friendly tournament. Tell us which your group prefers and we will set it up that way.",
  },
  {
    q: "Where can a corporate mahjong activity take place?",
    a: "We bring it to you: a hotel meeting room or ballroom, a conference room, your office, a corporate venue, a hospitality suite, a private room or an offsite location.",
  },
  {
    q: "Can mahjong be one part of a larger event?",
    a: "Yes. It can be the main activity, or one segment of a bigger event, such as a session after dinner or tables during a reception.",
  },
  {
    q: "How is a corporate event activity priced?",
    a: "Each event is quoted on its own: group size, length and location set the price. Contact us with your date, headcount and venue.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function CorporateEventActivitiesLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Company Events &middot; Client Nights &middot; Appreciation</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Corporate Event Activities in <span className="accent-green">{"Las\u00a0Vegas"}</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "660px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Looking for something your people will do together, not just attend? A hosted American Mahjong activity fits the occasions companies plan: thanking employees, hosting clients, rewarding a sales team, bringing leaders together, or celebrating the season. We bring it to your hotel, office, venue or private room.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=corporate-activities" className="btn-primary">Request a Quote</a>
              <a href="/mahjong-corporate-las-vegas" className="btn-outline">How We Run Events</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">By Occasion</p>
            <h2 className="section-title">Pick the <span className="accent-pink">Occasion</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {occasions.map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                  {item.link && (
                    <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem" }}>
                      <a href={item.link.href} style={{ color: "var(--green)", fontWeight: 600 }}>{item.link.text}</a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">One Activity, Several Jobs</p>
            <h2 className="section-title">What It Can Be at <span className="accent-green">Your Event</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {roles.map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "2.5rem", maxWidth: "720px" }}>
              Every event includes the 152-tile American Mahjong sets, racks and current NMJL cards, instruction from zero and facilitation from start to finish. The space, and any food or drink, come from you. For timing and what is included, see how we run{" "}
              <a href="/mahjong-corporate-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate mahjong events</a>.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Company Events</span></h2>
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

        <RelatedExperiences
          heading="Plan Around"
          accent="Your Group"
          background="var(--navy-dark)"
          links={[
            "/corporate-team-building-las-vegas",
            "/las-vegas-meeting-planner-activities",
            "/incentive-group-activities-las-vegas",
            "/trade-show-booth-activities-las-vegas",
          ]}
        />

        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Tell Us the <span className="accent-green">Occasion</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Share the occasion, date, headcount and venue, and we will suggest the format that fits and send a quote.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=corporate-activities" className="btn-primary">Request a Quote</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
