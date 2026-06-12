import type { Metadata } from "next";
import Image from "next/image";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Lessons in Las Vegas",
  description:
    "Learn mahjong from a certified Oh My Mahjong instructor. MAHJ101 for beginners, MAHJ102 for intermediate players. Lessons are $75 each or $150 for 3.",
  keywords: [
    "mahjong lessons Las Vegas",
    "mahjong classes Las Vegas",
    "learn mahjong Las Vegas",
    "mahjong instructor Las Vegas",
    "mahjong teacher Las Vegas",
    "American mahjong lessons",
    "NMJL mahjong Las Vegas",
    "beginner mahjong Las Vegas",
    "mahjong lessons Summerlin",
    "mahjong lessons Henderson",
    "Oh My Mahjong instructor Las Vegas",
    "mahjong private lessons Las Vegas",
  ],
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas" },
  openGraph: {
    ...ogBase,
    title: "Mahjong Lessons Las Vegas | Certified Instructor | Las Vegas Mahjong",
    description:
      "Book beginner or intermediate mahjong lessons in Las Vegas with a certified Oh My Mahjong instructor. $75 per lesson or $150 for a package of 3, across Summerlin, Henderson & the whole Valley.",
    url: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas",
    images: ["https://www.lasvegasmahj.com/shauna.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Mahjong Lessons Las Vegas",
  description:
    "Certified American Mahjong lessons in Las Vegas for all skill levels. MAHJ101 for complete beginners and MAHJ102 for intermediate players.",
  provider: {
    "@type": "LocalBusiness",
    "@id": "https://www.lasvegasmahj.com/#business",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    address: { "@type": "PostalAddress", addressLocality: "Las Vegas", addressRegion: "NV" },
  },
  offers: [
    { "@type": "Offer", name: "3-Lesson Package", price: "150.00", priceCurrency: "USD" },
    { "@type": "Offer", name: "Single Lesson", price: "75.00", priceCurrency: "USD" },
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
  { q: "How much do mahjong lessons cost in Las Vegas?", a: "A package of 3 lessons is $150 per person, or single lessons are $75 each. Private lessons and events are custom -- contact us for pricing." },
  { q: "Do I need experience to take mahjong lessons?", a: "No experience needed at all. MAHJ101 starts completely from scratch: we cover everything from sorting the tiles to playing your first hand." },
  { q: "Where are mahjong lessons held in Las Vegas?", a: "We host lessons at venues across Las Vegas, Summerlin, and Henderson. We also offer private lessons at your home or preferred location." },
  { q: "What is the difference between MAHJ101 and MAHJ102?", a: "MAHJ101 is for complete beginners; we start from zero. MAHJ102 builds on that foundation with more hands, strategy, and game time. We recommend taking 101 first." },
  { q: "What version of mahjong do you teach?", a: "We teach American Mahjong using the National Mah Jongg League (NMJL) card, the most popular version played across the US." },
];

export default function MahjongLessonsLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" }, { "@type": "ListItem", position: 2, name: "Mahjong Lessons Las Vegas", item: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas" }] }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Las Vegas · Summerlin · Henderson</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong <span className="accent-pink">Lessons</span> in Las Vegas
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Learn American Mahjong from a certified Oh My Mahjong instructor. Beginner-friendly, patient, and genuinely fun. Most students are playing confidently after just one session.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Book a Lesson</a>
              <a href="/" className="btn-outline">Learn More</a>
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL LEARN */}
        <section className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">The Curriculum</p>
            <h2 className="section-title">What You&rsquo;ll <span className="accent-green">Learn</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2.5rem" }}>
              {[
                { num: "MAHJ101", title: "Absolute Beginners", price: "$75/lesson or book 3 lessons for $150", items: ["Sorting and identifying tiles", "Reading the NMJL card", "Understanding how a hand works", "Playing your first full game", "Tips for your first open play event"] },
                { num: "MAHJ102", title: "Beyond the Basics", price: "$75/lesson or book 3 lessons for $150", items: ["Quick MAHJ101 recap", "More complex hands and patterns", "Strategy and decision-making", "Speed and confidence at the table", "Preparing for open play and leagues"] },
                { num: "Private", title: "1-on-1 Lessons", price: "Contact for pricing", items: ["Fully customized to your pace", "Your home or preferred venue", "Any skill level welcome", "Great for busy schedules", "Zoom option available"] },
              ].map(tier => (
                <div key={tier.num} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem" }}>
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
                src="/lvm-lesson-group.jpg"
                alt="Shauna with a group of students around the table at a Las Vegas Mahjong lesson, holding the National Mah Jongg League card"
                width={1415}
                height={1800}
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
              <h2 className="section-title">Certified. <span className="accent-pink">Patient. Fun.</span></h2>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
                Hi, I&rsquo;m Shauna, a <strong>certified Oh My Mahjong instructor</strong> and the founder of Las Vegas Mahjong. I&rsquo;ve been playing American Mahjong for nearly 18 years, teaching friends and family long before I turned it into a business.
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1rem" }}>
                My teaching style is patient, clear, and beginner-obsessed. I break the game into simple, logical steps so you&rsquo;re not overwhelmed, and you&rsquo;re playing your first hand within the first hour, every time.
              </p>
              <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "2rem" }}>
                I offer lessons across <strong>Las Vegas, Summerlin, Henderson</strong>, and the entire Las Vegas Valley. I can also come to your home or host virtually via Zoom.
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
                { name: "Tamar", text: "I was on the verge of giving up on learning to play Mahjong. Then Shauna taught me. I 'got it' straight away, after having tried for months!! If it wasn't for Shauna, I wouldn't be playing Mahjong today and LOVING it!!" },
                { name: "Sabrina", text: "I had such a great time learning Mahjong with Shauna! She's an amazing teacher, super patient, clear in her explanations, and she makes the whole experience really fun. Highly recommend!" },
                { name: "Molly", text: "If you need a mahjong lesson (or 5) @lasvegasmahjong is your woman. Amazing teacher." },
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

        {/* CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Ready to <span className="accent-pink">Play?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Join hundreds of Las Vegas players who learned to love mahjong at the table. Book your spot today. No experience needed.
            </p>
            <a href="/#classes" className="btn-primary" style={{ marginRight: "1rem" }}>Book a Lesson</a>
            <a href="/" className="btn-outline">Back to Homepage</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
