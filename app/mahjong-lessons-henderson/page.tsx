import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Lessons in Henderson, NV | Certified Instructor",
  description:
    "Certified mahjong lessons in Henderson, Nevada. Small groups from $50/person. Las Vegas's only certified Oh My Mahjong instructor serves Green Valley, Anthem, and all of Henderson. Beginners welcome.",
  keywords: [
    "mahjong lessons Henderson NV",
    "mahjong classes Henderson Nevada",
    "learn mahjong Henderson",
    "mahjong instructor Henderson Las Vegas",
    "mahjong Henderson Nevada",
    "mahjong near me Henderson",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/mahjong-lessons-henderson" },
  openGraph: {
    title: "Mahjong Lessons in Henderson, NV | Las Vegas Mahjong",
    description: "Certified mahjong instructor serving Henderson, Nevada. Group lessons from $50/person. We come to you. Green Valley, Anthem, and all of Henderson.",
    url: "https://lasvegasmahj.com/mahjong-lessons-henderson",
    images: ["https://lasvegasmahj.com/shauna.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mahjong Lessons Henderson Nevada",
  description: "Certified American Mahjong lessons in Henderson, Nevada for all skill levels.",
  provider: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://lasvegasmahj.com",
    "@id": "https://lasvegasmahj.com/#business",
  },
  areaServed: { "@type": "City", name: "Henderson", containedInPlace: { "@type": "State", name: "Nevada" } },
  offers: { "@type": "Offer", price: "50.00", priceCurrency: "USD", priceSpecification: { "@type": "UnitPriceSpecification", unitText: "person" } },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Mahjong Lessons Las Vegas", item: "https://lasvegasmahj.com/mahjong-lessons-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Henderson", item: "https://lasvegasmahj.com/mahjong-lessons-henderson" },
  ],
};

const faqs = [
  { q: "Do you teach mahjong lessons in Henderson, Nevada?", a: "Yes. We serve all of Henderson including Green Valley, Anthem, Seven Hills, and MacDonald Ranch. We come to your home, community space, or preferred venue." },
  { q: "How much do mahjong lessons cost in Henderson?", a: "Small group lessons (3-8 people) are $50 per person with a $200 minimum. Contact us for private lesson pricing." },
  { q: "Can I book a mahjong lesson at my Henderson home?", a: "Absolutely. We bring all the equipment and come to you. All you need is a table that seats four people." },
  { q: "What type of mahjong do you teach in Henderson?", a: "We teach American Mahjong using the National Mah Jongg League (NMJL) card, the most widely played version in the United States." },
];

export default function MahjongLessonsHenderson() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Henderson, Nevada</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong Lessons in <span className="accent-pink">Henderson</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Las Vegas&rsquo;s only certified Oh My Mahjong instructor serves all of Henderson, including Green Valley, Anthem, and Seven Hills. We come to you with everything you need. No experience required.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Book a Lesson</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">All Lesson Info</a>
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Serving Henderson</p>
            <h2 className="section-title">We Come to <span className="accent-green">Henderson</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Henderson is a city unto itself, with its own strong community culture, incredible neighborhoods, and a population that loves social activities. We&rsquo;ve taught in Green Valley homes, Anthem clubhouses, and community spaces all across the city.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Whether you&rsquo;re a book club looking for something new, a group of neighbors who have always been curious about mahjong, or a friend group ready to learn together, we&rsquo;ll come to you with all the tiles, racks, and instruction you need.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Henderson residents can also join open play events across the Las Vegas Valley to keep practicing after their first lesson.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Neighborhoods We Serve</p>
            <h2 className="section-title">All of <span className="accent-pink">Henderson</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "2.5rem" }}>
              {["Green Valley", "Anthem", "Seven Hills", "MacDonald Ranch", "Black Mountain", "Water Street District", "Whitney Ranch", "Inspirada", "Cadence"].map(n => (
                <div key={n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "1rem", textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>{n}</div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "1.5rem", textAlign: "center" }}>Don&rsquo;t see your neighborhood? If you&rsquo;re in Henderson, we serve you.</p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-green">Henderson</span></h2>
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
            <h2 className="section-title">Book Your <span className="accent-pink">Henderson Lesson</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Ready to learn mahjong in Henderson? Book a group or private lesson and we&rsquo;ll come to you. We respond within 24 hours.
            </p>
            <a href="/#classes" className="btn-primary">Book Now</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
