import type { Metadata } from "next";
import { ogBase, OG_SHAUNA } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Lessons in Henderson, NV",
  description:
    "Mahjong lessons in Henderson, NV. At our Las Vegas studio, or by request at your home or venue in Henderson, including Green Valley and Anthem.",
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-lessons-henderson" },
  openGraph: {
    ...ogBase,
    title: "Mahjong Lessons in Henderson, NV | Las Vegas Mahjong",
    description: "Mahjong lessons for Henderson, Nevada. Learn at our Las Vegas studio, or by request at your home or venue in Henderson, including Green Valley and Anthem.",
    url: "https://www.lasvegasmahj.com/mahjong-lessons-henderson",
    images: [OG_SHAUNA],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.lasvegasmahj.com/mahjong-lessons-henderson#service",
  url: "https://www.lasvegasmahj.com/mahjong-lessons-henderson",
  name: "Mahjong Lessons Henderson Nevada",
  description: "American Mahjong lessons. Henderson players can learn at the Las Vegas Mahjong studio inside Lucky Hare, or ask for a lesson at their home or venue in Henderson, Nevada.",
  provider: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    "@id": "https://www.lasvegasmahj.com/#business",
  },
  areaServed: { "@type": "City", name: "Henderson", containedInPlace: { "@type": "State", name: "Nevada" } },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Mahjong Lessons Las Vegas", item: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Henderson", item: "https://www.lasvegasmahj.com/mahjong-lessons-henderson" },
  ],
};

const faqs = [
  { q: "Do you teach mahjong lessons in Henderson, Nevada?", a: "Yes, by request, at your home or venue in Henderson. We do not have a studio in Henderson. Our one location is the studio inside Lucky Hare at 8687 W. Sahara Ave., Suite 200, Las Vegas, where group lessons and open play are held." },
  { q: "Can I book a mahjong lesson at my Henderson home?", a: "Yes. In-home lessons are available by request. Send us an inquiry through the contact form and tell us where you are, how many people are learning, and a date you have in mind. Contact for pricing." },
  { q: "What type of mahjong do you teach in Henderson?", a: "We teach American Mahjong using the National Mah Jongg League (NMJL) card, the most widely played version in the United States." },
  { q: "Do I need my own mahjong set for a lesson?", a: "No. We provide the tiles, racks, and NMJL cards." },
];

export default function MahjongLessonsHenderson() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main id="main-content" style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Henderson, Nevada</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong Lessons in <span className="accent-pink">Henderson</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              We teach at our studio inside Lucky Hare on West Sahara in Las Vegas, and by request at your home or venue in Henderson, including Green Valley and Anthem. Our founder, Shauna, has played American Mahjong for nearly 18 years. No experience required.
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
            <h2 className="section-title">Our Table or <span className="accent-green">Yours</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Our one location is{" "}
              <a href="/studio" style={{ color: "var(--green)", fontWeight: 600 }}>the studio inside Lucky Hare</a> at 8687 W. Sahara Ave., Suite 200, Las Vegas. There is no Henderson branch. You can learn at the studio in two ways, or ask for a lesson where you are.
            </p>
            <div style={{ display: "grid", gap: "1rem", margin: "1.5rem 0" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "1.25rem 1.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.4rem" }}>Learn with other beginners</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  We hold group lessons at the studio, and new players start with Mahj 101. The{" "}
                  <a href="/schedule" style={{ color: "var(--green)", fontWeight: 600 }}>class schedule</a> lists the dates, and you book your seat online.
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "1.25rem 1.5rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.4rem" }}>Learn at your own pace</h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                  A private lesson can be one person, or a small closed group you bring yourself. We teach{" "}
                  <a href="/private-mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>private lessons at the studio</a>.
                </p>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Henderson residents who already know American Mahjong and are comfortable playing independently can also join open play at our studio inside Lucky Hare.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Home and Venue Lessons</p>
            <h2 className="section-title">Where in <span className="accent-pink">Henderson</span>?</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Lessons at your home or venue in Henderson are available by request. Whether it is just you, a book club, neighbors, or friends ready to learn together,{" "}
              <a href="/contact?source=henderson" style={{ color: "var(--green)", fontWeight: 600 }}>send us an inquiry</a> and tell us which part of the city you are in. Contact for pricing.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "2rem" }}>
              {["Green Valley", "Anthem", "Seven Hills", "MacDonald Ranch", "Black Mountain", "Water Street District", "Whitney Ranch", "Inspirada", "Cadence"].map(n => (
                <div key={n} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "1rem", textAlign: "center", color: "rgba(255,255,255,0.7)", fontSize: "0.95rem" }}>{n}</div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginTop: "1.5rem", textAlign: "center" }}>These are parts of Henderson, not studio locations.</p>
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
              Ready to learn mahjong in Henderson? Start with a class at the studio, or{" "}
              <a href="/contact?source=henderson" style={{ color: "var(--green)", fontWeight: 600 }}>tell us where you are</a> and ask about a lesson at your home or venue. We will get back to you.
            </p>
            <a href="/#classes" className="btn-primary">Book Now</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
