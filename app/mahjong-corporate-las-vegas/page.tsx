import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import RelatedExperiences from "@/components/related-experiences";

export const metadata: Metadata = {
  title: "Corporate Mahjong Events in Las Vegas",
  description:
    "Corporate mahjong events in Las Vegas, hosted and facilitated at your office, hotel or venue. We bring the sets, cards and instruction. Get a quote.",
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Corporate Mahjong Events in Las Vegas | Las Vegas Mahjong",
    description: "Corporate mahjong events in Las Vegas, hosted and facilitated at your office, hotel or venue. We bring the sets, cards and instruction. Contact for a custom quote.",
    url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Mahjong Events in Las Vegas | Las Vegas Mahjong",
    description: "Corporate mahjong events in Las Vegas, hosted and facilitated at your office, hotel or venue. We bring the sets, cards and instruction. Contact for a quote.",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Corporate Mahjong Events Las Vegas",
  serviceType: "Corporate mahjong event hosting",
  description: "Corporate mahjong events in Las Vegas, hosted and facilitated at the client's office, hotel or venue, with all tiles, racks, NMJL cards and instruction provided.",
  provider: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    "@id": "https://www.lasvegasmahj.com/#business",
  },
  areaServed: { "@type": "City", name: "Las Vegas" },
  audience: { "@type": "BusinessAudience", name: "Corporate teams, conference and convention groups, incentive trips, and corporate retreats in Las Vegas" },
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Corporate Events", item: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
  ],
};

const faqs = [
  { q: "How large of a corporate group can you accommodate?", a: "Send your expected headcount with your inquiry, and we will staff the event with enough facilitators for every table." },
  { q: "What's included in a corporate mahjong event?", a: "We provide the mahjong equipment and game materials (tiles, racks and NMJL cards), full instruction, and facilitation from start to finish, and we set up and clear the game. Your venue provides the event space, tables and chairs, and any food or drink you would like." },
  { q: "How long does a corporate mahjong event run?", a: "Typical events run 2-3 hours. We can customize the duration based on your schedule and what fits your team's energy." },
  { q: "Can you host at our office or hotel meeting room?", a: "Yes. We come to wherever your team is: your office, a hotel conference space, a restaurant private room, or a corporate venue. As long as the room is set with tables and chairs for the group, we bring the rest of the game." },
  { q: "Can you plan a mahjong experience for an incentive trip or a visiting company group?", a: "Yes. Send us your dates, headcount and where your group is staying, and we will build a mahjong experience around your program. We come to your hotel meeting space or venue and bring all the mahjong equipment. Partner and referral arrangements are available for DMCs and event professionals. Contact us to discuss your program." },
  { q: "Do you do charity mahjong events?", a: "We do. Charity mahjong events, fundraiser tournaments and cause-based gatherings can be built around your organization's goals. Contact us to discuss your needs." },
  { q: "How do we book a corporate mahjong event?", a: "Send us your date, venue, headcount and the time slot through the contact form. We will suggest a format that fits and follow up with a custom quote." },
];

export default function MahjongCorporateLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Corporate Events · Planners · Group Programs</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Corporate Mahjong in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Las Vegas Mahjong brings facilitated American Mahjong experiences to hotels, conference rooms, ballrooms, corporate venues, hospitality suites, private rooms and offsite events. We provide the mahjong equipment, game materials and instruction; your venue provides the event space, tables and chairs.
            </p>
            <a href="/contact?source=corporate" className="btn-primary">Request a Quote</a>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">What We Provide</p>
            <h2 className="section-title">What We Bring to <span className="accent-pink">Your Event</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🀄", title: "Sets, Racks and Cards", desc: "152-tile American Mahjong sets, racks and current NMJL cards for every table, with the rest of the game materials." },
                { icon: "🎓", title: "Instruction From Zero", desc: "We teach the game from the first tile, so no one needs experience to take part." },
                { icon: "🤝", title: "Facilitation at Every Table", desc: "Facilitators matched to your headcount keep every table playing from the first hand to the last." },
                { icon: "📋", title: "A Format for Your Program", desc: "Length, format and level of competition set around your agenda, from a short session to an evening social." },
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
            <h2 className="section-title">How a Corporate Mahjong Event <span className="accent-green">Comes Together</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "Tell us about the program", desc: "Share the date, venue, headcount and time slot, and what you want the session to do: connect a team, entertain clients or fill a breakout." },
                { title: "We shape the format", desc: "We suggest the length and format that fit your agenda and follow up with a custom quote." },
                { title: "Your venue sets the room", desc: "The hotel or venue provides the event space, tables and chairs. We arrive with the sets, racks, cards and game materials and set up the game." },
                { title: "We teach and facilitate", desc: "We teach from the first tile, facilitate every table until the last hand, and clear the game when you are done." },
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
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">Event Types</p>
            <h2 className="section-title">What We Do for <span className="accent-green">Organizations</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "Corporate Team Building", desc: "Full event facilitation for company teams. Strategy-based, social, and fun. Works for any department, any industry." },
                { title: "Client Entertainment", desc: "Impress clients with an experience they haven't done before. A private mahjong session is a conversation starter that lasts." },
                { title: "Conference and Convention Groups", desc: "An evening or afternoon session for groups in town for a conference or convention, in a meeting room, ballroom or hospitality suite." },
                { title: "Holiday and Quarterly Parties", desc: "Skip the standard holiday dinner. Give your team an event they'll associate with your company in the best possible way." },
                { title: "Charity and Fundraiser Events", desc: "We partner with nonprofits to produce mahjong fundraisers, tournaments, and awareness events. Custom format for your organization's goals." },
                { title: "Incentive and Visiting Groups", desc: "Hosted sessions for reward trips and company groups visiting Las Vegas, set up at the group's hotel." },
              ].map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--green)", opacity: 0.35, flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "0.95rem" }}>
              Looking for ideas by occasion, from client nights to employee appreciation and holiday parties? See{" "}
              <a href="/corporate-event-activities-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate event activities in Las Vegas</a>.
            </p>
          </div>
        </section>

        <RelatedExperiences
          background="var(--navy-dark)"
          label="Corporate and Group Experiences"
          heading="Find the Right"
          accent="Format"
          links={[
            "/corporate-event-activities-las-vegas",
            "/corporate-team-building-las-vegas",
            "/las-vegas-meeting-planner-activities",
            "/conference-activities-las-vegas",
            "/convention-activities-las-vegas",
            "/incentive-group-activities-las-vegas",
          ]}
        />

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">Corporate Testimonial</p>
            <blockquote style={{ borderLeft: "3px solid var(--green)", paddingLeft: "1.5rem", margin: "2rem 0" }}>
              <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1rem" }}>
                &ldquo;We worked with Shauna for a mahjong-oriented corporate event in early 2026. Shauna was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we&rsquo;ve ever received from this event, and we hope to work with Shauna again on a future mahjong social!&rdquo;
              </p>
              <cite style={{ fontFamily: "var(--font-nav)", fontSize: "0.9rem", color: "var(--green)", fontStyle: "normal", fontWeight: 700 }}>Kristi, Northmarq</cite>
            </blockquote>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Corporate Events</span></h2>
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
            <h2 className="section-title">Tell Us About <span className="accent-green">Your Program</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Send your date, venue, headcount and time slot, and we&rsquo;ll follow up with a custom quote.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=corporate" className="btn-primary">Request a Corporate Quote</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
