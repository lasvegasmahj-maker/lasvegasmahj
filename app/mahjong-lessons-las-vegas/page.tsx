import type { Metadata } from "next";
import Image from "next/image";
import { LESSON_TABLE } from "@/lib/studio-photos";
import { ogBase, OG_SHAUNA } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import { OPEN_PLAY_PRICE_LINE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Mahjong Lessons in Las Vegas",
  description:
    "Vegas mahjong lessons for beginners and experienced players. Learn American Mahjong at our Las Vegas studio with small classes and private lessons.",
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Mahjong Lessons Las Vegas | Beginner-Friendly Classes",
    description:
      "Vegas mahjong lessons for beginners and experienced players. Learn American Mahjong at our Las Vegas studio with small classes and private lessons.",
    url: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas",
    images: [OG_SHAUNA],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Mahjong Lessons Las Vegas",
  description:
    "American Mahjong lessons in Las Vegas for all skill levels. MAHJ101 for complete beginners, MAHJ102 for intermediate players, and MAHJ103 for confident, independent play.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://www.lasvegasmahj.com/#business",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
  },
  offers: [
    { "@type": "Offer", name: "Group Lesson", price: "60.00", priceCurrency: "USD" },
    { "@type": "Offer", name: "Private Lesson", description: "Contact for pricing" },
  ],
  courseMode: "onsite",
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "onsite",
    location: { "@type": "Place", name: "Las Vegas, NV" },
  },
  audience: { "@type": "Audience", audienceType: "Beginners and intermediate mahjong players in Las Vegas" },
};

const faqs = [
  { q: "How much do mahjong lessons cost in Las Vegas?", a: "Group lessons are $60 per person. Private lessons and events are available upon request; contact us for pricing." },
  { q: "Do I need experience to take mahjong lessons?", a: "No experience needed at all. MAHJ101 starts completely from scratch: we cover everything from sorting the tiles to playing your first hand." },
  { q: "Where are mahjong lessons held in Las Vegas?", a: "Group lessons and open play are held at our studio inside Lucky Hare at 8687 W. Sahara Ave., Suite 200, Las Vegas. Private lessons are held at the studio, with in-home available by request." },
  { q: "What is the difference between MAHJ101, MAHJ102, and MAHJ103?", a: "MAHJ101 is for complete beginners; we start from zero. MAHJ102 builds on that foundation with more hands, strategy, and game time. MAHJ103 is for confident, independent play: the Charleston, defensive strategy, and knowing the rules cold. We recommend taking them in order, starting with 101." },
  { q: "What version of mahjong do you teach?", a: "We teach American Mahjong using the National Mah Jongg League (NMJL) card, the most popular version played across the US." },
];

// Text links, not btn- buttons: tests/seo-round2.spec.ts fails this page on any button-styled
// link to /contact, and the home or venue choice can only be asked about there.
const lessonChoices = [
  {
    title: "Group Classes",
    accent: "accent-pink",
    border: "rgba(233,30,140,0.25)",
    price: "$60 per person",
    bestFor: "Beginners, and anyone who would rather learn alongside others.",
    howItWorks: "Start with MAHJ101, then move on to MAHJ102 and MAHJ103. Small classes of 4-8 people at our studio inside Lucky Hare.",
    href: "/schedule#calendar",
    cta: "See Class Dates",
  },
  {
    title: "Private Lessons at the Studio",
    accent: "accent-pink",
    border: "rgba(233,30,140,0.25)",
    price: "Contact for pricing",
    bestFor: "Anyone who wants to set the pace, alone or with people they choose.",
    howItWorks: "One on one, or a small group you bring yourself, in a quiet room at the studio, at a time that works for you.",
    href: "/private-mahjong-lessons-las-vegas",
    cta: "View Private Lessons",
  },
  {
    title: "Lessons at Your Home or Venue",
    accent: "accent-pink",
    border: "rgba(233,30,140,0.25)",
    price: "Contact for pricing",
    bestFor: "Friends gathering at home, or a group hosting at its own venue.",
    howItWorks: "Available by request. Tell us where you are, how many people are learning, and a date you have in mind.",
    href: "/contact?source=lessons",
    cta: "Send Us an Inquiry",
  },
  {
    title: "Social Open Play",
    accent: "accent-green",
    border: "rgba(57,230,57,0.25)",
    price: OPEN_PLAY_PRICE_LINE,
    bestFor: "Players who already know American Mahjong and are comfortable playing independently.",
    howItWorks: "Two hours of social play at the studio, not a lesson. Book your seat in advance and bring your current National Mah Jongg League card.",
    href: "/schedule#calendar",
    cta: "See Open Play Dates",
  },
];

export default function MahjongLessonsLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" }, { "@type": "ListItem", position: 2, name: "Mahjong Lessons Las Vegas", item: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas" }] }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main id="main-content" style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Las Vegas · Summerlin · Henderson</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong <span className="accent-pink">Lessons</span> in Las Vegas
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Las Vegas Mahjong offers in-person American Mahjong lessons at our Las Vegas studio. Beginner-friendly, patient, and genuinely fun. Start with MAHJ101 and build your skills through practice and our follow-on classes.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Book a Lesson</a>
              <a href="/schedule" className="btn-outline">See the Class Schedule</a>
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL LEARN */}
        <section className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">The Curriculum</p>
            <h2 className="section-title">What You&rsquo;ll <span className="accent-green">Learn</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2.5rem" }}>
              {/* Each card is one link. The schedule has a single calendar and no address per
                  class, so the three group classes all lead to it. */}
              {[
                { num: "MAHJ101", title: "Absolute Beginners", price: "$60 per lesson", items: ["Sorting and identifying tiles", "Reading the NMJL card", "Understanding how a hand works", "Playing your first full game", "Tips for your first open play event"], href: "/schedule#calendar" },
                { num: "MAHJ102", title: "Beyond the Basics", price: "$60 per lesson", items: ["Quick MAHJ101 recap", "More complex hands and patterns", "Strategy and decision-making", "Speed and confidence at the table", "Preparing for open play and leagues"], href: "/schedule#calendar" },
                { num: "MAHJ103", title: "Confident Play", price: "$60 per lesson", items: ["The Charleston and smart passing", "Defensive play and reading the table", "Using jokers and exchanges wisely", "Knowing all the rules cold", "Playing confidently on your own"], href: "/schedule#calendar" },
                { num: "Private", title: "Private Lessons", price: "Contact for pricing", items: ["Fully customized to your pace", "At the studio, with in-home by request", "Any skill level welcome", "Great for busy schedules", "Zoom option available"], href: "/private-mahjong-lessons-las-vegas" },
              ].map(tier => (
                <a key={tier.num} href={tier.href} className="lesson-card">
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", color: "var(--pink)", marginBottom: "0.3rem" }}>{tier.num}</div>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{tier.title}</h3>
                  <div style={{ fontFamily: "var(--font-nav)", fontSize: "1.2rem", color: "var(--green)", fontWeight: 700, marginBottom: "1rem" }}>{tier.price}</div>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {tier.items.map(item => (
                      <li key={item} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, paddingLeft: "1.2rem", position: "relative" }}>
                        <span style={{ position: "absolute", left: 0, color: "var(--green)" }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="choose-your-lesson" style={{ padding: "5rem 2rem", background: "var(--navy-dark)", borderBottom: "1px solid rgba(233,30,140,0.15)" }}>
          <div className="container">
            <p className="section-label">Find Your Fit</p>
            <h2 className="section-title">Which One Is <span className="accent-pink">Right for You?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: "620px" }}>
              Ways to learn or play with us. Pick the one that sounds like you.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {lessonChoices.map(c => (
                <div key={c.title} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.03)", border: `1px solid ${c.border}`, borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 className="section-title" style={{ fontSize: "1.6rem", marginBottom: "0.4rem" }}>
                    <span className={c.accent}>{c.title}</span>
                  </h3>
                  <div style={{ fontFamily: "var(--font-nav)", fontSize: "1.1rem", color: "var(--green)", fontWeight: 700, marginBottom: "1rem" }}>{c.price}</div>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>
                    <strong style={{ color: "var(--white)" }}>Best for:</strong> {c.bestFor}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1rem" }}>
                    <strong style={{ color: "var(--white)" }}>How it works:</strong> {c.howItWorks}
                  </p>
                  <a href={c.href} style={{ color: "var(--green)", fontWeight: 600, display: "inline-block", alignSelf: "flex-start", marginTop: "auto", padding: "0.6rem 0" }}>{c.cta}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT YOUR INSTRUCTOR */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "900px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "3rem", alignItems: "start" }}>
            <div style={{ display: "grid", gap: "1.25rem" }}>
              <Image
                src={LESSON_TABLE.src}
                alt={LESSON_TABLE.alt}
                width={LESSON_TABLE.width}
                height={LESSON_TABLE.height}
                sizes="(max-width: 760px) 100vw, 400px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
              <Image
                src="/lvm-teaching-action.jpg"
                alt="Shauna teaching American Mahjong to a group at a private lesson in Las Vegas"
                width={1350}
                height={1800}
                sizes="(max-width: 760px) 100vw, 400px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
              <Image
                src="/lvm-community-group.jpg"
                alt="Shauna teaching American Mahjong to a community group around the table in Las Vegas"
                width={1800}
                height={1241}
                sizes="(max-width: 760px) 100vw, 400px"
                style={{ width: "100%", height: "auto", borderRadius: "8px", display: "block" }}
              />
            </div>
            <div>
              <p className="section-label">Your Instructor</p>
              <h2 className="section-title">Patient. <span className="accent-pink">Clear. Fun.</span></h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
                Hi, I&rsquo;m Shauna, the founder of Las Vegas Mahjong. I&rsquo;ve been playing American Mahjong for nearly 18 years, teaching friends and family long before I turned it into a business.
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
                My teaching style is patient, clear, and beginner-obsessed. I break the game into simple, logical steps so you&rsquo;re not overwhelmed, and you&rsquo;ll play a game in your first lesson.
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "2rem" }}>
                My <a href="/studio" style={{ color: "var(--green)", fontWeight: 600 }}>studio inside <strong>Lucky Hare</strong></a> in Las Vegas is home base for group lessons and open play. If you would rather learn on your own or with a small group you bring yourself, at your own pace, I also teach <a href="/private-mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>private mahjong lessons at the studio</a>.
              </p>
              <a href="/#classes" className="btn-primary">Book Your Lesson</a>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">Students Say</p>
            <h2 className="section-title">Real <span className="accent-green">Results</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { name: "Abby G.", text: "I never played before, didn't even own a card, and walked away with my own card and a solid working knowledge of the game. Shauna is patient and makes the process fun." },
                { name: "Tracy M.", text: "Took three lessons from Shauna... She breaks down the game into sections so that you truly understand all of the rules and strategies. Would highly recommend her if you would like to learn how to play American Mahjong." },
                { name: "Brenda C.", text: "Just looking at the tiles made me think it would be impossible to learn. Shauna made it easy! After the first lesson, my brain was hurting, but after the second lesson, it all made sense. Then it turned to fun!" },
                { name: "Sabrina F.", text: "Her mahjong lessons are fun, engaging, and so easy to follow. She has a wonderful way of teaching that makes even the most complicated parts of the game feel approachable. If you've ever wanted to learn mahjong, Shauna is the person to learn from." },
              ].map(t => (
                <div key={t.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, fontStyle: "italic", marginBottom: "1rem" }}>&ldquo;{t.text}&rdquo;</p>
                  <div style={{ fontFamily: "var(--font-nav)", fontSize: "0.85rem", color: "var(--pink)", fontWeight: 700 }}>{t.name}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Lessons</span></h2>
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

        <section style={{ background: "var(--navy-dark)", padding: "0 2rem 4rem" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <div className="ask-callout" style={{ margin: 0 }}>
              <p>
                <strong>Rules question between lessons?</strong>
                Ask about jokers, the Charleston, calling, or dead hands and get a direct answer any time.
              </p>
              <a href="/ask" className="btn-outline">Ask a Mahjong Rule</a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Ready to <span className="accent-pink">Play?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Join hundreds of Las Vegas players who learned to love mahjong at the table. Book your spot today. No experience needed.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Book a Lesson</a>
              <a href="/" className="btn-outline">Back to Homepage</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
