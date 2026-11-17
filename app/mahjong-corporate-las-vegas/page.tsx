import type { Metadata } from "next";
import Image from "next/image";
import { ogBase, OG_HERO } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import RelatedExperiences from "@/components/related-experiences";

export const metadata: Metadata = {
  title: "Corporate Mahjong Events in Las Vegas",
  description:
    "Corporate mahjong events in Las Vegas for company events, meetings and conventions, hosted at your office, hotel or venue. Get a quote.",
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Corporate Mahjong Events in Las Vegas | Las Vegas Mahjong",
    description: "Corporate mahjong events in Las Vegas for company events, meetings and conventions, hosted and facilitated at your office, hotel or venue. Contact for a custom quote.",
    url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas",
    images: [OG_HERO],
  },
  twitter: {
    card: "summary_large_image",
    title: "Corporate Mahjong Events in Las Vegas | Las Vegas Mahjong",
    description: "Corporate mahjong events in Las Vegas for company events, meetings and conventions, hosted and facilitated at your office, hotel or venue. Contact for a quote.",
    images: [OG_HERO],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas#service",
  url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas",
  name: "Corporate Mahjong Events Las Vegas",
  serviceType: "Corporate mahjong event hosting",
  description: "Corporate mahjong events in Las Vegas for company events, employee events, client entertainment and meeting or convention groups, hosted and facilitated at the client's office, hotel or venue, with mahjong equipment and instruction provided. NMJL card arrangements are confirmed in your quote.",
  provider: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    "@id": "https://www.lasvegasmahj.com/#business",
  },
  areaServed: { "@type": "City", name: "Las Vegas" },
  audience: { "@type": "BusinessAudience", name: "Companies planning corporate events, employee events, client entertainment, meeting and convention groups, and incentive trips in Las Vegas" },
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
  { q: "What's included in a corporate mahjong event?", a: "We provide the mahjong equipment (152-tile American Mahjong sets, racks and other game materials), full instruction, and facilitation from start to finish, and we set up and clear the game. NMJL card arrangements are confirmed in your quote. Your venue provides the event space and any food or drink you would like. We confirm the venue, tables, chairs and setup arrangements when planning your event." },
  { q: "How long does a corporate mahjong event run?", a: "Typical events run 2-3 hours. We can customize the duration based on your schedule and what fits your team's energy." },
  { q: "Can you host at our office or hotel meeting room?", a: "Yes. We come to wherever your team is: your office, a hotel conference space, a restaurant private room, or a corporate venue. We bring the mahjong equipment and teach the game." },
  { q: "Can you plan a mahjong experience for an incentive trip or a visiting company group?", a: "Yes. Send us your dates, headcount and where your group is staying, and we will build a mahjong experience around your program. We come to your hotel meeting space or venue and bring the mahjong equipment. Partner and referral arrangements are available for DMCs and event professionals. Contact us to discuss your program." },
  { q: "Do you do charity mahjong events?", a: "We do. Charity mahjong events and cause-based gatherings can be built around your organization's goals. Contact us to discuss your needs." },
  { q: "How do we book a corporate mahjong event?", a: "Send us your date, venue, headcount and the time slot through the contact form. We will suggest a format that fits and follow up with a custom quote." },
];

const glance = [
  {
    title: "What It Involves",
    color: "var(--white)",
    border: "rgba(255,255,255,0.08)",
    items: [
      "We teach the game from the first tile, so no one needs experience.",
      "Guests play four to a table while facilitators matched to your headcount keep every table going.",
      "Typical events run 2-3 hours. Networking sessions and breakouts usually run 60 to 90 minutes. We tailor the length to your agenda.",
    ],
  },
  {
    title: "Who It Suits",
    color: "var(--white)",
    border: "rgba(255,255,255,0.08)",
    items: [
      "Company teams, departments and offsites",
      "Client entertainment and employee appreciation",
      "Meeting, conference and convention groups",
      "Incentive trips and visiting company groups",
      "Holiday parties and charity fundraisers",
      "Mixed rooms of first-timers and experienced players",
    ],
  },
  {
    title: "What We Provide",
    color: "var(--green)",
    border: "rgba(57,230,57,0.25)",
    items: [
      "152-tile American Mahjong sets, racks and other game materials for every table",
      "Instruction from the very first tile",
      "Facilitators matched to your headcount",
      "Setting up and clearing the game",
    ],
    note: "NMJL card arrangements are confirmed in your quote.",
  },
  {
    title: "What Your Venue Provides",
    color: "var(--white)",
    border: "rgba(233,30,140,0.25)",
    items: [
      "The event space, such as your office, a hotel meeting room, a ballroom or a hospitality suite",
      "Any food or drink you would like",
    ],
    note: "We confirm the venue, tables, chairs and setup arrangements when planning your event.",
  },
];

export default function MahjongCorporateLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main id="main-content" style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Corporate Events · Planners · Group Programs</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Corporate Mahjong Events in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              From corporate events and employee events to meeting and convention groups, Las Vegas Mahjong brings a facilitated, portable American Mahjong experience to hotels, conference rooms, ballrooms, corporate venues, hospitality suites, private rooms and offsite events across Las Vegas. We provide the mahjong equipment, game materials and instruction.
            </p>
            <a href="/contact?source=corporate" className="btn-primary">Request a Quote</a>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "1040px" }}>
            <p className="section-label">For Planners</p>
            <h2 className="section-title">Corporate Mahjong <span className="accent-pink">at a Glance</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {glance.map(card => (
                <div key={card.title} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${card.border}`, borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: card.color }}>{card.title}</h3>
                  <ul style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0, paddingLeft: "1.1rem", listStyle: "disc" }}>
                    {card.items.map((item, i) => (
                      <li key={item} style={i > 0 ? { marginTop: "0.4rem" } : undefined}>{item}</li>
                    ))}
                  </ul>
                  {card.note && (
                    <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.9rem", lineHeight: 1.65, margin: "0.9rem 0 0" }}>{card.note}</p>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem", background: "rgba(233,30,140,0.08)", border: "1px solid rgba(233,30,140,0.25)", borderRadius: "8px", padding: "1.8rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ flex: "1 1 420px", minWidth: 0 }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>How to Request a Quote</h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
                  Send your date, venue, headcount and time slot through the contact form. We suggest a format and follow up with a custom quote.
                </p>
                <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.9rem", lineHeight: 1.65, margin: "0.6rem 0 0" }}>
                  Pricing depends on group size, format and length.
                </p>
              </div>
              {/* Narrower side padding on small phones keeps the label on one line inside the padded panel. */}
              <a href="/contact?source=corporate" className="btn-primary" style={{ padding: "1rem clamp(0.75rem, 4vw, 2.2rem)" }}>Request a Quote</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "1040px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "3rem", alignItems: "start" }}>
              <div>
                <p className="section-label">How It Works</p>
                <h2 className="section-title">How a Corporate Mahjong Event <span className="accent-green">Comes Together</span></h2>
                <div style={{ marginTop: "2.5rem" }}>
                  {[
                    { title: "Tell us about the program", desc: "Share the date, venue, headcount and time slot, and what you want the session to do: connect a team, entertain clients or fill a breakout." },
                    { title: "We shape the format", desc: "We suggest the length and format that fit your agenda and follow up with a custom quote." },
                    { title: "We confirm the setup", desc: "We confirm the venue, tables, chairs and setup arrangements when planning your event, then arrive with the sets, racks and game materials and set up the game." },
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
              <Image
                src="/lvm-shauna-facilitating.jpg"
                alt="Shauna standing beside a table of guests, explaining the game mid-session while everyone focuses on the tiles and racks in front of them"
                width={1800}
                height={1391}
                sizes="(max-width: 760px) 100vw, 496px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">Event Types</p>
            <h2 className="section-title">What We Do for <span className="accent-green">Organizations</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "1.5rem", fontSize: "0.95rem" }}>
              These are the corporate group activities and company events we run most often for organizations in Las Vegas.
            </p>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "Corporate Team Building", desc: "Full event facilitation for company teams. Strategy-based, social, and fun. Works for any department, any industry.", links: [{ href: "/corporate-team-building-las-vegas", text: "corporate team building" }] },
                { title: "Client Entertainment", desc: "Impress clients with an experience they haven't done before. A private mahjong session is a conversation starter that lasts.", links: [] },
                { title: "Conference and Convention Groups", desc: "An evening or afternoon session for groups in town for a conference or convention, in a meeting room, ballroom or hospitality suite.", links: [{ href: "/conference-activities-las-vegas", text: "conference activities" }, { href: "/convention-activities-las-vegas", text: "convention activities" }] },
                { title: "Holiday and Quarterly Parties", desc: "Skip the standard holiday dinner. Give your team an event they'll associate with your company in the best possible way.", links: [] },
                { title: "Charity and Fundraiser Events", desc: "We partner with nonprofits to produce mahjong fundraisers and awareness events. Custom format for your organization's goals.", links: [] },
                { title: "Incentive and Visiting Groups", desc: "Hosted sessions for reward trips and company groups visiting Las Vegas, set up at the group's hotel.", links: [{ href: "/incentive-group-activities-las-vegas", text: "incentive group activities" }] },
              ].map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--green)", opacity: 0.35, flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                    {item.links.length > 0 && (
                      <p style={{ margin: "0.6rem 0 0", fontSize: "0.85rem" }}>
                        See{" "}
                        {item.links.map((l, idx) => (
                          <span key={l.href}>
                            <a href={l.href} style={{ color: "var(--green)", fontWeight: 600 }}>{l.text}</a>
                            {idx < item.links.length - 1 ? " or " : ""}
                          </span>
                        ))}
                        .
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "0.95rem" }}>
              Looking for ideas by occasion, from client nights to employee appreciation and holiday parties? See{" "}
              <a href="/corporate-event-activities-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate event activities in Las Vegas</a>.
            </p>
            <p style={{ marginTop: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "0.95rem" }}>
              Filling a single meeting or agenda slot instead of planning a full event? See{" "}
              <a href="/las-vegas-meeting-planner-activities" style={{ color: "var(--green)", fontWeight: 600 }}>Las Vegas meeting planner activities</a>{" "}
              for icebreakers, breakouts and evening socials by time slot.
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
          <div className="container" style={{ maxWidth: "1040px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "3rem", alignItems: "center" }}>
              <div>
                <p className="section-label">Corporate Testimonial</p>
                <blockquote style={{ borderLeft: "3px solid var(--green)", paddingLeft: "1.5rem", margin: "2rem 0 0" }}>
                  <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontStyle: "italic", marginBottom: 0 }}>
                    &ldquo;We worked with Shauna for a mahjong-oriented corporate event in early 2026. Shauna was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we&rsquo;ve ever received from this event, and we hope to work with Shauna again on a future mahjong social!&rdquo;
                  </p>
                </blockquote>
              </div>
              <Image
                src="/lvm-shauna-hosting-table.jpg"
                alt="Shauna standing beside a table, hand on hip, talking with three seated guests as they play mahjong with drinks set out beside the tiles"
                width={1800}
                height={1391}
                sizes="(max-width: 760px) 100vw, 496px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
            </div>
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
