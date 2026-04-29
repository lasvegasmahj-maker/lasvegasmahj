import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Mahjong Party Las Vegas | Bachelorette, Corporate & Private Events",
  description:
    "Book a private mahjong party in Las Vegas — bachelorette parties, corporate team building, birthdays, charity events, and girls' nights. Fully hosted by a certified instructor. Groups of any size. Starting at $50/person.",
  keywords: [
    "mahjong party Las Vegas",
    "mahjong bachelorette party Las Vegas",
    "mahjong corporate event Las Vegas",
    "mahjong team building Las Vegas",
    "private mahjong event Las Vegas",
    "mahjong birthday party Las Vegas",
    "mahjong girls night Las Vegas",
    "mahjong charity event Las Vegas",
    "things to do Las Vegas bachelorette",
    "unique bachelorette ideas Las Vegas",
    "corporate team building Las Vegas",
    "fun things to do Las Vegas group",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/mahjong-parties-las-vegas" },
  openGraph: {
    title: "Mahjong Party Las Vegas | Bachelorette, Corporate & Private Events",
    description: "Skip the same old party. Book a private mahjong experience in Las Vegas — bachelorette parties, corporate events, birthdays & more. Certified instructor, any size group, starting at $50/person.",
    url: "https://lasvegasmahj.com/mahjong-parties-las-vegas",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Private Mahjong Events Las Vegas",
  description: "Fully hosted private mahjong parties and events in Las Vegas for bachelorette parties, corporate team building, birthdays, charity events, and more.",
  provider: { "@type": "LocalBusiness", name: "Las Vegas Mahjong", url: "https://lasvegasmahj.com" },
  areaServed: [{ "@type": "City", name: "Las Vegas" }, { "@type": "City", name: "Henderson" }, { "@type": "City", name: "Summerlin" }],
  offers: { "@type": "Offer", price: "50.00", priceCurrency: "USD", priceSpecification: { "@type": "UnitPriceSpecification", unitText: "person", description: "Starting price per person" } },
};

const eventTypes = [
  { icon: "🎉", title: "Bachelorette Parties", desc: "Tiles, drinks, and unforgettable fun — a unique Vegas experience your crew will talk about for years. Way more memorable than another club night." },
  { icon: "🏢", title: "Corporate Team Building", desc: "Break the ice and build real connections. Mahjong requires communication, strategy, and teamwork — perfect for any group size." },
  { icon: "🎂", title: "Birthday Celebrations", desc: "Skip the same old dinner. Give the birthday person an afternoon or evening they'll genuinely remember." },
  { icon: "❤️", title: "Charity & Fundraisers", desc: "Host a mahjong tournament or social to raise funds and bring your community together for a great cause." },
  { icon: "🥂", title: "Girls' Night Out", desc: "The ultimate girls' night — tiles, laughter, drinks, and zero screen time. We bring everything. You bring the crew." },
  { icon: "🎰", title: "Vegas Visitor Experiences", desc: "Visiting Las Vegas? Try something you can't do anywhere else. A hands-on mahjong experience you'll take home with you." },
  { icon: "💒", title: "Bridal Showers", desc: "An elegant, interactive activity for the bride-to-be and her closest friends. Something different, something memorable." },
  { icon: "🏫", title: "School & Community Groups", desc: "Community organizations, neighborhood associations, book clubs — we bring mahjong to you wherever you are." },
];

const faqs = [
  { q: "How much does a private mahjong event cost in Las Vegas?", a: "Private events start at $50 per person. Pricing varies based on group size, duration, and location. Contact us for a custom quote — we work with all budgets." },
  { q: "How big can the group be?", a: "We can host groups of all sizes, from intimate gatherings of 4 to large corporate events of 50+. For very large events we bring additional support." },
  { q: "Do guests need to know how to play?", a: "Not at all. We teach everyone from scratch. Most groups are complete beginners — that's half the fun." },
  { q: "Where do you host private events?", a: "We can come to your home, a rented venue, a restaurant, a hotel suite, or your office. We bring all the equipment — tiles, racks, cards, everything." },
  { q: "How far in advance should I book?", a: "We recommend booking at least 2 weeks in advance, especially for weekends. Popular dates fill up fast — reach out early and we'll make it work." },
];

export default function MahjongPartiesLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Bachelorette · Corporate · Birthday · Girls&rsquo; Night</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong <span className="accent-pink">Parties</span> in Las Vegas
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Skip the same old party idea. We bring the tiles, the teaching, and the energy — you bring the crew. Every event is fully hosted and customized for your group.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/#classes" className="btn-primary">Plan Your Event</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">View Lessons Instead</a>
            </div>
          </div>
        </section>

        {/* EVENT TYPES */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">What We Host</p>
            <h2 className="section-title">Every Kind of <span className="accent-green">Celebration</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem", marginTop: "2.5rem" }}>
              {eventTypes.map(e => (
                <div key={e.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{e.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.5rem" }}>{e.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0 }}>{e.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">The Process</p>
            <h2 className="section-title">How It <span className="accent-pink">Works</span></h2>
            {[
              { num: "01", title: "Reach Out", desc: "Tell us about your event — date, group size, location, and what kind of experience you're looking for. We'll get back to you within 24 hours." },
              { num: "02", title: "We Plan Together", desc: "We customize everything to your group — timing, format, venue recommendations, and any special touches you want." },
              { num: "03", title: "We Show Up", desc: "We arrive with all the equipment — tiles, racks, cards, everything. You don't need to provide a thing." },
              { num: "04", title: "Everyone Plays", desc: "We teach your group from scratch in a fun, low-pressure way. Everyone leaves knowing how to play — and wanting to play again." },
            ].map(step => (
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

        {/* PRICING */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: "580px" }}>
            <p className="section-label">Investment</p>
            <h2 className="section-title">Simple <span className="accent-green">Pricing</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "2rem" }}>
              Events start at <strong style={{ color: "var(--green)" }}>$50 per person</strong>. Final pricing depends on group size, duration, and location. We work with all budgets — reach out and we&rsquo;ll find something that works.
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: "2rem" }}>All equipment included · We come to you · No experience needed</p>
            <a href="/#classes" className="btn-primary">Get a Quote</a>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">Corporate Testimonial</p>
            <blockquote style={{ borderLeft: "3px solid var(--pink)", paddingLeft: "1.5rem", margin: "2rem 0" }}>
              <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1rem" }}>
                &ldquo;We worked with Shauna for a mahjong-oriented corporate event in early 2026. Shauna was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we&rsquo;ve ever received from this event, and we hope to work with Shauna again on a future mahjong social!&rdquo;
              </p>
              <cite style={{ fontFamily: "var(--font-nav)", fontSize: "0.9rem", color: "var(--pink)", fontStyle: "normal", fontWeight: 700 }}>— Kristi, Northmarq</cite>
            </blockquote>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ — <span className="accent-pink">Private Events</span></h2>
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
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", textAlign: "center", borderTop: "1px solid rgba(233,30,140,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Let&rsquo;s Plan <span className="accent-pink">Your Event</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Tell us what you&rsquo;re planning and we&rsquo;ll make it happen. Reach out today — popular dates fill up fast.
            </p>
            <a href="/#classes" className="btn-primary">Book Your Event</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
