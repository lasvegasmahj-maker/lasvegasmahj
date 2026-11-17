import type { Metadata } from "next";
import { ogBase, OG_SHAUNA } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Lessons in Summerlin, NV",
  description:
    "Mahjong lessons in Summerlin, NV. Group and private lessons at our Las Vegas studio, or by request at your home or venue in Summerlin.",
  alternates: { canonical: "https://www.lasvegasmahj.com/mahjong-lessons-summerlin" },
  openGraph: {
    ...ogBase,
    title: "Mahjong Lessons in Summerlin | Las Vegas Mahjong",
    description: "Mahjong lessons for Summerlin, NV. Group and private lessons at our Las Vegas studio, or by request at your home or venue in Summerlin.",
    url: "https://www.lasvegasmahj.com/mahjong-lessons-summerlin",
    images: [OG_SHAUNA],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.lasvegasmahj.com/mahjong-lessons-summerlin#service",
  url: "https://www.lasvegasmahj.com/mahjong-lessons-summerlin",
  name: "Mahjong Lessons Summerlin Las Vegas",
  description: "American Mahjong lessons. Group and private lessons are held at the Las Vegas Mahjong studio inside Lucky Hare, and lessons at your home or venue in Summerlin are available by request.",
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
  { q: "Do you teach mahjong in Summerlin?", a: "Yes. Lessons at your home or venue in Summerlin are available by request. Group lessons and open play are held at our studio inside Lucky Hare at 8687 W. Sahara Ave., Suite 200, Las Vegas, which is our one location." },
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

      <main id="main-content" style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Summerlin, Las Vegas, NV</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong Lessons in <span className="accent-pink">Summerlin</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              We teach group and private lessons at our studio inside Lucky Hare on West Sahara. By request, we also teach at your home or venue in Summerlin. Our founder, Shauna, has played American Mahjong for nearly 18 years. Beginners are our specialty.
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
            <h2 className="section-title">Choose Where You <span className="accent-green">Learn</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              Las Vegas Mahjong has one location:{" "}
              <a href="/studio" style={{ color: "var(--green)", fontWeight: 600 }}>our studio inside Lucky Hare</a> at 8687 W. Sahara Ave., Suite 200, Las Vegas. Group lessons, private lessons, and open play all happen there. We do not have a separate studio in Summerlin. Here is how to choose and book.
            </p>
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>Group class at the studio</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                  New to the game? Start with Mahj 101, the class for absolute beginners. Find upcoming dates on the{" "}
                  <a href="/schedule" style={{ color: "var(--green)", fontWeight: 600 }}>class schedule</a> and book your seat online.
                </p>
              </div>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>Private lesson at the studio</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                  For one person, a couple, or a few friends who want to learn at their own pace. See{" "}
                  <a href="/private-mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>private mahjong lessons at the studio</a>.
                </p>
              </div>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>Lesson at your home or venue in Summerlin</h3>
                <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>
                  Available by request. Gathering friends at home, or hosting at your HOA clubhouse?{" "}
                  <a href="/contact?source=summerlin" style={{ color: "var(--green)", fontWeight: 600 }}>Send us an inquiry</a> with where you are, how many people are learning, and a date you have in mind. Contact for pricing.
                </p>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginTop: "1.5rem" }}>
              We provide the tiles, racks, and NMJL cards for your lesson.
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
              Ready to learn mahjong in Summerlin? Book a class at the studio, or{" "}
              <a href="/contact?source=summerlin" style={{ color: "var(--green)", fontWeight: 600 }}>send us an inquiry</a> about a lesson at your home or venue. We will get back to you.
            </p>
            <a href="/#classes" className="btn-primary">Book Now</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
