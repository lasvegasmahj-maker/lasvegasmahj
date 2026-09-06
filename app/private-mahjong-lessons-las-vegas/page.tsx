import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Private Mahjong Lessons at Our Las Vegas Studio",
  description:
    "Private mahjong lessons at our Las Vegas studio inside Lucky Hare. One on one instruction at your own pace, on your own schedule. Contact for pricing.",
  alternates: { canonical: "https://www.lasvegasmahj.com/private-mahjong-lessons-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Private Mahjong Lessons at Our Las Vegas Studio | Las Vegas Mahjong",
    description:
      "One on one mahjong instruction at the Las Vegas Mahjong studio inside Lucky Hare. Learn at your own pace with a certified Oh My Mahjong instructor. Contact for pricing.",
    url: "https://www.lasvegasmahj.com/private-mahjong-lessons-las-vegas",
    images: ["https://www.lasvegasmahj.com/shauna.jpg"],
  },
};

const faqs = [
  { q: "Can I book a private lesson for me and a few friends?", a: "Yes. A private lesson can be one person, or a small closed group you bring yourself. Either way the session is yours and the pace is set by the people at the table." },
  { q: "Do I need to bring anything?", a: "No. Tiles, racks, and NMJL cards are set up and waiting when you arrive. Bring your own card if you already have one." },
  { q: "How much does a private lesson cost?", a: "Contact for pricing. Tell me what you are looking for and I will send you the details." },
  { q: "Is a private lesson the same as a mahjong party?", a: "No. A private lesson teaches you the game. A mahjong party is a hosted celebration for a larger group. If you are planning a birthday, a holiday party, or a team outing, start on the mahjong parties page instead." },
  { q: "Can you teach at my home instead?", a: "In home sessions are available by request. The studio inside Lucky Hare is where most private lessons happen, and it is set up for teaching." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Private Mahjong Lessons Las Vegas",
  description:
    "One on one and small closed group American Mahjong instruction at the Las Vegas Mahjong studio inside Lucky Hare, with in home sessions available by request. Contact for pricing.",
  serviceType: "Private mahjong instruction",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://www.lasvegasmahj.com/#business",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
  },
  areaServed: { "@type": "City", name: "Las Vegas" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Mahjong Lessons Las Vegas", item: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Private Lessons", item: "https://www.lasvegasmahj.com/private-mahjong-lessons-las-vegas" },
  ],
};

const whoFor = [
  { title: "You want to set the speed", desc: "Go as slowly as you like on the parts that are hard, and skip ahead on the parts that click. Nothing moves until you are ready." },
  { title: "The class calendar does not fit", desc: "We find a time that works for you instead of the other way around." },
  { title: "You would rather not learn in a group", desc: "Plenty of people want to make their mistakes quietly first. That is a completely normal way to start." },
  { title: "You already play and want to fix something", desc: "Bring the specific thing that trips you up and we will work on that, and only that, for as long as it takes." },
  { title: "You are learning with your own people", desc: "A couple, a few friends, a mother and daughter. Bring your own table and we teach the group you already have." },
  { title: "You want a refresher before open play", desc: "One session to shake off the rust so you can walk into a room of players and sit down without hesitating." },
];

const steps = [
  { num: "01", title: "Tell Me Where You Are Starting", desc: "Complete beginner, lapsed player, or somewhere in between. I ask a few questions before we book so the first session starts in the right place." },
  { num: "02", title: "We Set the Plan Together", desc: "You tell me what you want out of it. Learn the whole game, get ready for a specific game night, or fix the one thing that keeps going wrong." },
  { num: "03", title: "We Sit Down and Play", desc: "The table is already set when you walk in. We talk while we play, because that is how the game actually goes in." },
  { num: "04", title: "You Leave Able to Play", desc: "You will play a real hand in your first session. From there we keep going for as long as you want, and we stop when you feel ready." },
];

export default function PrivateMahjongLessons() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Las Vegas, NV &middot; Inside Lucky Hare</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Private <span className="accent-pink">Mahjong Lessons</span> at Our Studio
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Just you at the table, or you and the people you choose. A certified Oh My Mahjong instructor teaches at your pace, in a quiet room, with no class to keep up with and no one watching.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=private-lessons" className="btn-primary">Ask About a Private Lesson</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">See Group Classes</a>
            </div>
          </div>
        </section>

        {/* WHO IT IS FOR */}
        <section className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">Who It Is For</p>
            <h2 className="section-title">When a <span className="accent-green">Private Lesson</span> Makes Sense</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.2rem", marginTop: "2.5rem" }}>
              {whoFor.map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT RUNS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">The Session</p>
            <h2 className="section-title">How a Private Lesson <span className="accent-pink">Runs</span></h2>
            {steps.map(step => (
              <div key={step.num} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--pink)", opacity: 0.4, flexShrink: 0, lineHeight: 1 }}>{step.num}</div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>{step.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THE DIFFERENCE */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">The Difference</p>
            <h2 className="section-title">What Changes When the Table Is <span className="accent-green">Yours</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              In a class, the pace belongs to the room. Someone always has the question you were about to ask, and someone always wants to move on before you are done. That is a good way to learn and most people love it.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              A private lesson is a different thing. We stay on the Charleston for forty minutes if the Charleston is what is bothering you. We deal the same kind of hand over and over until you see the pattern without looking. You ask the question you did not want to ask in front of anyone, and we answer it properly.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Neither one is better. They are for different people, and sometimes for the same person at different times. If you would rather learn alongside other beginners, the{" "}
              <a href="/mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>group classes on the schedule</a> are a very good place to start.
            </p>
          </div>
        </section>

        {/* WHERE WE MEET */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">The Studio</p>
            <h2 className="section-title"><span className="accent-pink">Where</span> We Meet</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Private lessons are taught at our studio inside Lucky Hare on West Sahara. It is a real table in a quiet room, set up for teaching and nothing else. The tiles are out, the racks are placed, and the cards are on the table before you arrive, so the session starts the moment you sit down.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1.5rem" }}>
              It is also the room where group classes and open play happen, which matters more than it sounds. When you are ready to play with other people, you will already know the table, the room, and the way a session runs. In home sessions are available by request.
            </p>
            <address style={{ fontStyle: "normal", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, borderLeft: "3px solid var(--pink)", paddingLeft: "1.25rem" }}>
              <strong style={{ color: "rgba(255,255,255,0.85)" }}>Las Vegas Mahjong Studio</strong>
              <br />Inside Lucky Hare
              <br />8687 W. Sahara Ave., Suite 200
              <br />Las Vegas, NV 89117
            </address>
          </div>
        </section>

        {/* PRICING */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: "580px" }}>
            <p className="section-label">Pricing</p>
            <h2 className="section-title">Contact for <span className="accent-green">Pricing</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Private lessons are priced per session, and what you need shapes what it costs. Tell me what you are hoping to get out of it and I will send you the details. I answer within 24 hours.
            </p>
            <a href="/contact?source=private-lessons" className="btn-primary">Ask About a Private Lesson</a>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Private Lessons</span></h2>
            <div style={{ marginTop: "2rem" }}>
              {faqs.map(faq => (
                <div key={faq.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>{faq.q}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.7, marginTop: "2rem" }}>
              Planning a celebration rather than a lesson? See{" "}
              <a href="/mahjong-parties-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>mahjong parties</a>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(233,30,140,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Ready When <span className="accent-pink">You Are</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Send a note with what you are looking for and roughly when you are free. No experience needed, and no wrong place to start.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=private-lessons" className="btn-primary">Ask About a Private Lesson</a>
              <a href="/schedule" className="btn-outline">See the Class Schedule</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
