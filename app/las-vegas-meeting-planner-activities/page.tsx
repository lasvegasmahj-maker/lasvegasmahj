import type { Metadata } from "next";
import Image from "next/image";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import RelatedExperiences from "@/components/related-experiences";
import { buildBreadcrumbSchema } from "@/lib/schema";

const PAGE_URL = "https://www.lasvegasmahj.com/las-vegas-meeting-planner-activities";

/**
 * Organized by agenda slot, because that is the question a meeting planner arrives with:
 * "I have a room and a gap, what fits?". /conference-activities-las-vegas stays the page for
 * conference formats; this one is for the planner of any meeting. Durations, what we bring
 * and what the venue provides are restated from the existing corporate pages, not new claims.
 */

export const metadata: Metadata = {
  title: "Las Vegas Meeting Planner Activities",
  description:
    "Meeting activities for Las Vegas planners: a facilitated mahjong icebreaker, breakout or evening social, set up in your hotel meeting room or ballroom.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    ...ogBase,
    title: "Las Vegas Meeting Planner Activities | Las Vegas Mahjong",
    description:
      "An icebreaker, a breakout between sessions or a hosted evening social, fitted to the slot you need to fill. We bring the mahjong equipment and facilitation to your meeting room.",
    url: PAGE_URL,
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Las Vegas Meeting Planner Activities",
  serviceType: "Facilitated meeting activity",
  description:
    "Facilitated American Mahjong sessions for meetings in Las Vegas: opening icebreakers, breakouts between sessions, team breakouts and evening socials, set up in the meeting room, ballroom or breakout space the planner has booked.",
  url: PAGE_URL,
  provider: { "@id": "https://www.lasvegasmahj.com/#business" },
  areaServed: { "@type": "City", name: "Las Vegas", containedInPlace: { "@type": "State", name: "Nevada" } },
  audience: { "@type": "BusinessAudience", name: "Meeting planners and corporate meeting organizers in Las Vegas" },
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Corporate Events", url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" },
  { name: "Meeting Planner Activities", url: PAGE_URL },
]);

const slots = [
  {
    title: "Opening icebreaker",
    desc: "Seat people who have not met four to a table on the first morning. Learning the same new game together gives them something to talk about from the first tile.",
  },
  {
    title: "Breakout between sessions",
    desc: "Between working sessions, a breakout of 60 to 90 minutes gives attendees a real break from the agenda while keeping them together.",
  },
  {
    title: "Team or department breakout",
    desc: "When one team inside a larger meeting needs its own time, a longer session works as team building, with a friendly tournament at the end if the group likes to compete.",
  },
  {
    title: "Evening hosted social",
    desc: "A session during a reception or after dinner. Guests drop in, learn and play at their own pace, a relaxed change from another cocktail hour.",
  },
  {
    title: "Client or VIP table",
    desc: "A private hosted session for the clients or guests your meeting is looking after.",
  },
];

const roles = [
  { title: "Team building", body: "Colleagues plan a hand, read the table and adapt, side by side, which is the same thinking good teamwork asks for." },
  { title: "Networking", body: "Four people at a small table have a shared reason to talk, which is easier than walking up to a stranger at a reception." },
  { title: "Attendee engagement", body: "Every attendee gets hands-on instruction, so people play rather than watch from the back of the room." },
  { title: "A breakout activity", body: "It fits one room and one time slot, and we shorten or extend it to match your agenda." },
  { title: "Client entertainment", body: "A hosted table gives your team relaxed time with the clients attending your meeting." },
  { title: "A hosted social", body: "We run the game from start to finish, so your staff can join the tables instead of running them." },
  { title: "A group activity", body: "Mixed rooms work: first-timers and experienced players, leaders and new hires, at the same tables." },
];

const faqs = [
  {
    q: "What kinds of meetings is a mahjong activity a good fit for?",
    a: "Corporate meetings, sales meetings, department meetings and conferences held in Las Vegas hotels and venues. It works best when you want the people in the room talking to each other, not only listening.",
  },
  {
    q: "How much time do we need to set aside in the agenda?",
    a: "A networking session or breakout usually runs 60 to 90 minutes, and a team building session 2-3 hours. We can shorten or extend either one to fit the slot you have.",
  },
  {
    q: "Can mahjong work as an icebreaker at the start of a meeting?",
    a: "Yes. Seating people who have not met at the same table and teaching them a new game together gives the group a shared first experience before the working sessions begin.",
  },
  {
    q: "What do you need from the hotel or venue?",
    a: "The event space, set with tables and chairs for your group, and the time slot. The hotel or venue provides the room and furniture; we provide the sets, racks, NMJL cards and other game materials, plus the facilitators, and we set up and clear the game. Any food or drink is yours to arrange.",
  },
  {
    q: "Do our attendees need to know how to play?",
    a: "No. We teach from the first tile, and jokers are wild, which keeps early hands forgiving. Rooms that mix beginners with people who already play work well.",
  },
  {
    q: "How do we get a quote for a meeting activity?",
    a: "Send us your dates, venue, headcount and the time slot you want to fill through the contact form. Every meeting gets its own quote, based on group size, format and length.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function LasVegasMeetingPlannerActivities() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Meeting Planners &middot; Breakouts &middot; Icebreakers</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Meeting Activities for <span className="accent-green">{"Las\u00a0Vegas Planners"}</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "660px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              You have the room, the headcount and a gap in the agenda. Las Vegas Mahjong brings a facilitated American Mahjong session to your hotel meeting room, ballroom or breakout space and fits it to the time you have: an icebreaker to open the meeting, a breakout between sessions, or a hosted social to close the day.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=meeting-planners" className="btn-primary">Request a Quote</a>
              <a href="/conference-activities-las-vegas" className="btn-outline">Conference Formats</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "1040px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "3rem", alignItems: "start" }}>
              <div>
                <p className="section-label">By Agenda Slot</p>
                <h2 className="section-title">Where It Fits in <span className="accent-pink">Your Agenda</span></h2>
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
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "2rem" }}>
                  Running a full conference rather than a single meeting? Our{" "}
                  <a href="/conference-activities-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>conference activities in Las Vegas</a>{" "}
                  page covers networking breaks, receptions and general sessions.
                </p>
              </div>
              <Image
                src="/lvm-hands-on-tiles.jpg"
                alt="Four women playing mahjong around a table, with their tiles, racks and a colorful patterned mat laid out in front of them"
                width={1800}
                height={1440}
                sizes="(max-width: 760px) 100vw, 496px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">One Session, Several Jobs</p>
            <h2 className="section-title">What Mahjong Can Do for <span className="accent-green">Your Meeting</span></h2>
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
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Logistics</p>
            <h2 className="section-title">What We Bring, <span className="accent-pink">What You Provide</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(57,230,57,0.25)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--green)" }}>We bring</h3>
                <ul style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0, paddingLeft: "1.1rem", listStyle: "disc" }}>
                  <li>152-tile American Mahjong sets, racks and current NMJL cards</li>
                  <li>Instruction from the very first tile</li>
                  <li>Facilitators matched to your headcount</li>
                  <li>Setting up and clearing the game at every table</li>
                </ul>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(233,30,140,0.25)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.75rem" }}>You provide</h3>
                <ul style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.8, margin: 0, paddingLeft: "1.1rem", listStyle: "disc" }}>
                  <li>The room: a hotel meeting room, ballroom, breakout space, hospitality suite or private room</li>
                  <li>Tables and chairs for the group, set in the room</li>
                  <li>The time slot in your agenda</li>
                  <li>Any food or drink you would like</li>
                </ul>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "2rem" }}>
              To get started, send us your dates, venue, headcount and time slot. Partner and referral arrangements are available for DMCs and event professionals. Contact us to discuss your program. For a whole company event rather than a meeting, see{" "}
              <a href="/corporate-event-activities-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate event activities</a>, and for how we run events for companies, see{" "}
              <a href="/mahjong-corporate-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>corporate mahjong events</a>.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Meeting Planners</span></h2>
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
          heading="More Formats for"
          accent="Your Program"
          links={[
            "/conference-activities-las-vegas",
            "/corporate-team-building-las-vegas",
            "/convention-activities-las-vegas",
            "/incentive-group-activities-las-vegas",
          ]}
        />

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Tell Us About the <span className="accent-green">Slot You Need to Fill</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Share your dates, venue, headcount and agenda, and we will build a format that fits the time and the room.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=meeting-planners" className="btn-primary">Request a Quote</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
