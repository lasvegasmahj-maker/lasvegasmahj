import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import RelatedExperiences from "@/components/related-experiences";
import { buildBreadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://www.lasvegasmahj.com/incentive-group-activities-las-vegas";

/**
 * For incentive planners and DMCs building a reward trip. The buyer, the purpose (a reward,
 * not a work session) and the setting (the group's own hotel) differ from every other
 * corporate page. It names no DMC, hotel or past program, and no capacity or lead time,
 * because none has been supplied; the venues listed are the ones the owner confirmed.
 */

export const metadata: Metadata = {
  title: "Incentive Group Activities in Las Vegas",
  description:
    "Incentive group activities in Las Vegas: a hosted American Mahjong experience for reward trips, DMC programs and VIP groups, set up at your group's hotel.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    ...ogBase,
    title: "Incentive Group Activities in Las Vegas | Las Vegas Mahjong",
    description:
      "A hosted, facilitated American Mahjong experience for incentive trips and DMC programs, brought to the resort, ballroom or suite your group has booked.",
    url: PAGE_URL,
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Incentive Group Activities Las Vegas",
  serviceType: "Incentive group activity",
  description:
    "Hosted, facilitated American Mahjong experiences for incentive trips, DMC programs and VIP groups in Las Vegas, set up at the group's hotel, ballroom, hospitality suite or private room.",
  url: PAGE_URL,
  provider: { "@id": "https://www.lasvegasmahj.com/#business" },
  areaServed: { "@type": "City", name: "Las Vegas", containedInPlace: { "@type": "State", name: "Nevada" } },
  audience: { "@type": "BusinessAudience", name: "Incentive travel planners, destination management companies and incentive groups visiting Las Vegas" },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Corporate Events", url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
  { name: "Incentive Group Activities", url: PAGE_URL },
]);

const reasons = [
  { title: "It feels like a reward", desc: "A hosted, social experience with nothing to prepare. The group is on the trip to be thanked, and this reads as a treat, not another session." },
  { title: "It mixes the group", desc: "Winners from different teams, offices or regions sit four to a table and get to know each other over a shared game." },
  { title: "It comes to the group", desc: "We set up in the hotel, ballroom, hospitality suite or private room your program has booked, so guests do not need to leave the property." },
  { title: "Everyone can take part", desc: "No one needs to have played before. We teach from the first tile, and guests who already play sit alongside first-timers." },
];

const slots = [
  { title: "Welcome reception", desc: "Tables set up during the arrival reception give guests something to do together on the first night besides small talk." },
  { title: "A hosted afternoon", desc: "A relaxed session between free time and the evening program, offered as one of the group's activity choices or to everyone." },
  { title: "A private VIP table", desc: "A private hosted session planned for top performers or another small group within the program." },
  { title: "Closing night", desc: "A hosted mahjong evening as part of the farewell event, with a friendly tournament if the group likes to compete." },
];

const faqs = [
  {
    q: "Can you run a mahjong activity at our group's resort or hotel?",
    a: "Yes. We bring a hosted, facilitated American Mahjong experience to the hotel, ballroom, conference room, hospitality suite or private room your program has booked, and handle setup and breakdown.",
  },
  {
    q: "Can a DMC or incentive planner request this for a client program?",
    a: "Yes. Send us the program dates, the hotel, the headcount and the time slot you have in mind, and we will put together a quote for that event.",
  },
  {
    q: "Do incentive guests need to know how to play?",
    a: "No. First-timers learn at the table, and guests who already play can sit right alongside them.",
  },
  {
    q: "Can you host a smaller VIP group on its own?",
    a: "Yes. A private hosted session can be planned for a small group within the program, such as top performers. Tell us the headcount and we will quote it.",
  },
  {
    q: "Can mahjong be part of a welcome reception or farewell event?",
    a: "Yes. Tables can be set up during a reception so guests drop in, learn and play, or the evening can be built around a hosted game.",
  },
  {
    q: "How is an incentive group activity priced?",
    a: "Each event is quoted individually, based on group size, format and length. Contact us with the program details.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function IncentiveGroupActivitiesLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Incentive Travel &middot; DMC Programs &middot; VIP Groups</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Incentive Group Activities in <span className="accent-green">{"Las\u00a0Vegas"}</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "660px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              An incentive trip is a reward, so the activities should feel like one. Las Vegas Mahjong brings a hosted, facilitated American Mahjong experience to the resort, ballroom, hospitality suite or private room your program has booked. No one needs to have played before, and everyone learns together.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=incentive" className="btn-primary">Request a Quote</a>
              <a href="/corporate-event-activities-las-vegas" className="btn-outline">Event Ideas</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">Why It Works</p>
            <h2 className="section-title">Built for a <span className="accent-pink">Reward Trip</span></h2>
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
            <p className="section-label">In the Program</p>
            <h2 className="section-title">Where It Fits in <span className="accent-green">the Trip</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {slots.map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < slots.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
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
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">For DMCs and Incentive Planners</p>
            <h2 className="section-title">Building a <span className="accent-pink">Client Program?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "1.5rem 0 1rem" }}>
              If you are a destination management company (DMC) or incentive planner putting together a Las Vegas program for a client, send us the program dates, the hotel, the headcount and the time slot. We quote each event individually, bring the 152-tile American Mahjong sets, racks and current NMJL cards, handle setup and breakdown, and facilitate from start to finish. The program provides the room and any food or drink.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
              Planning a meeting inside the trip as well? See{" "}
              <a href="/las-vegas-meeting-planner-activities" style={{ color: "var(--green)", fontWeight: 600 }}>meeting planner activities</a>{" "}
              for icebreakers and breakouts, and{" "}
              <a href="/mahjong-corporate-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate mahjong events</a>{" "}
              for how we run events for companies.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">One Experience, Several Jobs</p>
            <h2 className="section-title">What It Can Do for <span className="accent-green">Your Group</span></h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "1.5rem 0 0" }}>
              On a reward trip, one hosted session does several jobs. It is light team building for colleagues who rarely work together, networking between top performers from different offices, and guest engagement, because everyone learns by playing. It fits the schedule as a breakout block in one room, becomes client entertainment when clients travel with the group, and runs as a hosted social from setup to breakdown: a group activity, with facilitators planned around your headcount.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Guests Who Already Play</p>
            <h2 className="section-title">A Game on a <span className="accent-pink">Free Day</span></h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "1.5rem 0 0" }}>
              Some of your guests may already play American Mahjong. If a Social Open Play session falls on a free day, they can book a seat at our studio inside Lucky Hare while seats remain, on their own or with friends from the trip. Registration is required, spots are limited, and dates are on the schedule. Here is how to{" "}
              <a href="/play-mahjong-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>play mahjong while visiting Las Vegas</a>.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Incentive Groups</span></h2>
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
          heading="Round Out"
          accent="the Program"
          links={[
            "/corporate-event-activities-las-vegas",
            "/las-vegas-meeting-planner-activities",
            "/convention-activities-las-vegas",
            "/play-mahjong-las-vegas",
          ]}
        />

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Send Us the <span className="accent-green">Program Details</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Dates, hotel, headcount and the slot you want to fill. We will build the experience around the program and send a quote.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=incentive" className="btn-primary">Request a Quote</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
