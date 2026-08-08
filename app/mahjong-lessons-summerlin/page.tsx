import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Lessons in Summerlin, NV",
  description:
    "Certified mahjong lessons in Summerlin, NV. Group and private lessons from a certified Oh My Mahjong instructor. Beginners welcome.",
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-lessons-summerlin" },
  openGraph: {
    ...ogBase,
    title: "Mahjong Lessons in Summerlin | Las Vegas Mahjong",
    description: "Certified mahjong instructor serving Summerlin, NV. Group and private lessons for all skill levels.",
    url: "https://www.lasvegasmahj.com/mahjong-lessons-summerlin",
    images: ["https://www.lasvegasmahj.com/shauna.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mahjong Lessons Summerlin Las Vegas",
  description: "Certified American Mahjong lessons in Summerlin, Nevada for all skill levels.",
  provider: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    "@id": "https://www.lasvegasmahj.com/#business",
  },
  areaServed: { "@type": "Place", name: "Summerlin, Las Vegas, NV" },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Mahjong Lessons Las Vegas", item: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Summerlin", item: "https://www.lasvegasmahj.com/mahjong-lessons-summerlin" },
  ],
};

const faqs = [
  { q: "Do you teach mahjong in Summerlin?", a: "Yes. We teach mahjong lessons throughout Summerlin, including your home, clubhouse, or any venue you choose. We bring all the equipment." },
  { q: "Do I need any experience to take a Summerlin mahjong lesson?", a: "None at all. We start from zero and have you playing your first real hand within the first session." },
  { q: "What version of mahjong do you teach?", a: "We teach American Mahjong using the National Mah Jongg League (NMJL) card, the most popular version across the US." },
];

export default function MahjongLessonsSummerlin() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Summerlin, Las Vegas, NV</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong Lessons in <span className="accent-pink">Summerlin</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              A certified Oh My Mahjong instructor with 18 years of experience teaches group and private lessons throughout Summerlin. We come to you, we bring everything, and beginners are our specialty.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Book a Lesson</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">All Lesson Info</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">For Summerlin Residents</p>
            <h2 className="section-title">Mahjong Comes to <span className="accent-green">You</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Summerlin is one of Las Vegas&rsquo;s most community-oriented neighborhoods, and mahjong fits right in. Whether you&rsquo;re gathering with friends in a private home, hosting at your HOA clubhouse, or organizing a group through your book club or neighborhood association, we bring the lesson to you.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              All tiles, racks, and NMJL cards are provided. You just need a table and four or more people who are curious about mahjong.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Private lessons are also available for individuals or couples who want a personalized, one-on-one learning experience at their own pace.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-green">Summerlin</span></h2>
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

        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(233,30,140,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Book Your <span className="accent-pink">Summerlin Lesson</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Ready to learn mahjong in Summerlin? Reach out to book your group or private lesson. We respond within 24 hours.
            </p>
            <a href="/#classes" className="btn-primary">Book Now</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
