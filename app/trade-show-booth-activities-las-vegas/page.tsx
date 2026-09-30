import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import RelatedExperiences from "@/components/related-experiences";
import { buildBreadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://www.lasvegasmahj.com/trade-show-booth-activities-las-vegas";

/**
 * The exhibitor's and sponsor's page. /convention-activities-las-vegas is written for the
 * people running a convention and its attendee groups; this one is for the company paying for
 * a booth, a suite or a sponsored space and wanting people to stop. It makes no traffic,
 * dwell-time or lead claims: the only effects stated are the ones the convention page
 * already made in plain words.
 */

export const metadata: Metadata = {
  title: "Trade Show Booth Activities in Las Vegas",
  description:
    "Trade show booth activities in Las Vegas: a live, hosted mahjong table that gives attendees a reason to stop at your booth or hospitality suite.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    ...ogBase,
    title: "Trade Show Booth Activities in Las Vegas | Las Vegas Mahjong",
    description:
      "A live American Mahjong table for exhibitors and sponsors: short sessions at the booth, hosted play in your hospitality suite, or tables in a sponsored lounge.",
    url: PAGE_URL,
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Trade Show Booth Activities Las Vegas",
  serviceType: "Trade show booth engagement activity",
  description:
    "Live, hosted American Mahjong for exhibitors and sponsors at Las Vegas trade shows and conventions: short rotating sessions at the booth, hosted tables in a hospitality suite or sponsored lounge, and after-hours client events.",
  url: PAGE_URL,
  provider: { "@id": "https://www.lasvegasmahj.com/#business" },
  areaServed: { "@type": "City", name: "Las Vegas" },
  audience: { "@type": "BusinessAudience", name: "Exhibitors, sponsors and marketing teams at Las Vegas trade shows and conventions" },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Corporate Events", url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
  { name: "Convention Activities", url: "https://www.lasvegasmahj.com/convention-activities-las-vegas" },
  { name: "Trade Show Booth Activities", url: PAGE_URL },
]);

const reasons = [
  { title: "People stop to watch", desc: "A live game with real tiles draws a look from the aisle in a way a screen or a giveaway bowl cannot. People stop to watch, then stay to play." },
  { title: "Your team gets an opening", desc: "A demo table gives your staff a natural reason to start a conversation with the person who just sat down." },
  { title: "It gets people off their feet", desc: "Show days are long and most activities keep attendees standing. A seat at a table is a reason to stay a while." },
  { title: "It is something to remember", desc: "Visitors leave having played a game at your booth, not just having picked up a brochure." },
];

const formats = [
  { title: "Booth demo table", desc: "Short, rotating sessions at your booth that teach the basics on the spot and keep the seats turning over through the day." },
  { title: "Hospitality suite tables", desc: "Hosted play in your suite for the clients and prospects you invite, with time for longer games and real conversation." },
  { title: "Sponsored lounge", desc: "Hosted tables in a lounge or meeting room that attendees can drop into between sessions, set up in the space you sponsor." },
  { title: "After-hours client event", desc: "A hosted mahjong evening for the clients you are entertaining while you are in town for the show." },
];

const roles = [
  { title: "Booth engagement", body: "Attendees sit and play instead of glancing and walking on." },
  { title: "Networking", body: "Strangers at the same table start talking, and your staff are part of it." },
  { title: "Attendee engagement", body: "A hands-on activity that attendees choose to join." },
  { title: "A breakout", body: "Longer sessions in a suite or lounge give attendees a break from the show floor." },
  { title: "Client entertainment", body: "A private table in your suite or after hours for the accounts that matter most." },
  { title: "A hosted social", body: "We run the tables and handle setup and breakdown, so your booth staff can focus on visitors." },
  { title: "Team building", body: "Your own booth team can play together after the show closes, before the flight home." },
];

const faqs = [
  {
    q: "Can a mahjong table fit in a trade show booth?",
    a: "We work with the space you have, from a single demo table at the booth to hosted tables in a hospitality suite or lounge. Tell us your booth size and layout, and check your show's exhibitor rules for booth activities, and we will suggest the format that fits.",
  },
  {
    q: "How does a booth session work if visitors have never played?",
    a: "Booth sessions are short and rotating. We teach the basics on the spot, and jokers are wild, which makes early hands forgiving, so a visitor can sit down without having played before.",
  },
  {
    q: "Can you set up in our hospitality suite?",
    a: "Yes. Hospitality suites suit longer, hosted play for the clients and prospects you invite, and we handle setup and breakdown there too.",
  },
  {
    q: "Can mahjong be part of a sponsorship or experiential marketing activation?",
    a: "Yes. As a hosted, hands-on activity in a booth, a sponsored lounge or at a client event, it gives attendees an experience in your space rather than a handout. Tell us what the activation needs to do and we will shape the format around it.",
  },
  {
    q: "What do you bring to the show?",
    a: "The 152-tile American Mahjong sets, racks and current NMJL cards, facilitators matched to the sessions you are running, and setup and breakdown. You provide the space.",
  },
  {
    q: "How is a trade show activity priced?",
    a: "It depends on the format, the schedule and the size of the setup, so we quote each show individually. Send us the show, dates and the space you have.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function TradeShowBoothActivitiesLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Exhibitors &middot; Sponsors &middot; Hospitality Suites</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Trade Show Booth Activities in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "660px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Give attendees a reason to stop. Las Vegas Mahjong runs short, hosted American Mahjong sessions at your booth, longer play in your hospitality suite, and tables in a lounge you sponsor, so people sit down, play and talk with your team.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=trade-show" className="btn-primary">Request a Quote</a>
              <a href="/convention-activities-las-vegas" className="btn-outline">Convention Activities</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">On the Show Floor</p>
            <h2 className="section-title">Why a Live Table <span className="accent-pink">Works</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {reasons.map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
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
            <h2 className="section-title">For Exhibitors and <span className="accent-green">Sponsors</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {formats.map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < formats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--green)", opacity: 0.35, flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "2rem" }}>
              Organizing the convention itself, or bringing an attendee group? See{" "}
              <a href="/convention-activities-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>convention activities in Las Vegas</a>{" "}
              for attendee engagement sessions and group downtime.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Before You Book</p>
            <h2 className="section-title">Planning the <span className="accent-pink">Space</span></h2>
            <ul style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.9, margin: "1.5rem 0 0", paddingLeft: "1.25rem" }}>
              <li>Check your show&rsquo;s exhibitor rules for booth activities and seating.</li>
              <li>Send us your booth size and layout, the show dates, and the hours you want covered.</li>
              <li>Short sessions suit the booth itself; longer, relaxed play suits a suite or lounge.</li>
              <li>Tell us who you want at the table: walk-up attendees, invited clients, or both.</li>
            </ul>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">One Table, Several Jobs</p>
            <h2 className="section-title">What It Can Do at <span className="accent-green">the Show</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {roles.map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Booths and Activations</span></h2>
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
          heading="More for"
          accent="Your Show Week"
          background="var(--navy-dark)"
          links={[
            "/convention-activities-las-vegas",
            "/conference-activities-las-vegas",
            "/corporate-event-activities-las-vegas",
            "/incentive-group-activities-las-vegas",
          ]}
        />

        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Tell Us About <span className="accent-green">Your Show</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Send the show, the dates and the space you have, whether that is a booth, a suite or a lounge, and we will suggest a format and quote it.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=trade-show" className="btn-primary">Request a Quote</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
