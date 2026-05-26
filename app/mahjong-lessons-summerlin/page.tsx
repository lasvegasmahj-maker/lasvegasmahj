import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Lessons in Summerlin, Las Vegas | Certified Instructor",
  description:
    "Certified mahjong lessons in Summerlin, NV. Small groups from $50/person. Las Vegas's only Oh My Mahjong certified instructor comes to you. Beginners welcome.",
  keywords: [
    "mahjong lessons Summerlin",
    "mahjong classes Summerlin NV",
    "learn mahjong Summerlin Las Vegas",
    "mahjong instructor Summerlin",
    "mahjong Summerlin Nevada",
    "mahjong lessons near me Summerlin",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/mahjong-lessons-summerlin" },
  openGraph: {
    title: "Mahjong Lessons in Summerlin | Las Vegas Mahjong",
    description: "Certified mahjong instructor serving Summerlin, NV. Small group lessons from $50/person. We come to you. All skill levels welcome.",
    url: "https://lasvegasmahj.com/mahjong-lessons-summerlin",
    images: ["https://lasvegasmahj.com/shauna.jpg"],
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
    url: "https://lasvegasmahj.com",
    "@id": "https://lasvegasmahj.com/#business",
  },
  areaServed: { "@type": "Place", name: "Summerlin, Las Vegas, NV" },
  offers: { "@type": "Offer", price: "50.00", priceCurrency: "USD", priceSpecification: { "@type": "UnitPriceSpecification", unitText: "person" } },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Mahjong Lessons Las Vegas", item: "https://lasvegasmahj.com/mahjong-lessons-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Summerlin", item: "https://lasvegasmahj.com/mahjong-lessons-summerlin" },
  ],
};

const faqs = [
  { q: "Do you teach mahjong in Summerlin?", a: "Yes. We teach mahjong lessons throughout Summerlin, including your home, clubhouse, or any venue you choose. We bring all the equipment." },
  { q: "How much do mahjong lessons cost in Summerlin?", a: "Small group lessons (3-8 people) are $50 per person with a $200 minimum. Private and corporate lessons are available, contact us for pricing." },
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
              Las Vegas&rsquo;s only certified Oh My Mahjong instructor teaches group and private lessons throughout Summerlin. We come to you, we bring everything, and beginners are our specialty.
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
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Pricing</p>
            <h2 className="section-title">Simple, Clear <span className="accent-pink">Pricing</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.2rem", marginTop: "2.5rem" }}>
              {[
                { type: "Small Group", detail: "3-8 people", price: "$50/person", note: "$200 minimum" },
                { type: "Private Lesson", detail: "1-2 people", price: "Contact for pricing", note: "Fully customized" },
                { type: "Large Group / HOA", detail: "9+ people", price: "Contact for pricing", note: "Custom quote" },
              ].map(tier => (
                <div key={tier.type} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.3rem" }}>{tier.type}</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>{tier.detail}</p>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--green)", marginBottom: "0.3rem" }}>{tier.price}</div>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: 0 }}>{tier.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
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

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", textAlign: "center", borderTop: "1px solid rgba(233,30,140,0.15)" }}>
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
