import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Corporate Mahjong Team Building Las Vegas | Las Vegas Mahjong",
  description:
    "Unique corporate team building in Las Vegas built around mahjong. Strategy, communication, real connection. Custom events for any size group. Contact for a quote.",
  keywords: [
    "corporate team building Las Vegas mahjong",
    "mahjong corporate event Las Vegas",
    "unique team building Las Vegas",
    "Las Vegas corporate event ideas",
    "mahjong charity event Las Vegas",
    "team building activity Las Vegas",
    "corporate mahjong experience",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/mahjong-corporate-las-vegas" },
  openGraph: {
    title: "Corporate Mahjong Events & Team Building | Las Vegas",
    description: "Strategic, social, and genuinely fun. Corporate mahjong events in Las Vegas for teams of any size. Contact for a custom quote.",
    url: "https://lasvegasmahj.com/mahjong-corporate-las-vegas",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Corporate Mahjong Team Building Las Vegas",
  description: "Custom corporate mahjong events and team building experiences in Las Vegas. Strategy-based, social, and fun for any group size.",
  provider: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://lasvegasmahj.com",
    "@id": "https://lasvegasmahj.com/#business",
  },
  areaServed: { "@type": "City", name: "Las Vegas" },
  offers: { "@type": "Offer", priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", description: "Custom pricing based on group size. Contact for a quote." } },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Private Events", item: "https://lasvegasmahj.com/mahjong-parties-las-vegas" },
    { "@type": "ListItem", position: 3, name: "Corporate Events", item: "https://lasvegasmahj.com/mahjong-corporate-las-vegas" },
  ],
};

const faqs = [
  { q: "How large of a corporate group can you accommodate?", a: "We can accommodate groups from 10 to 100+. For very large events we bring additional support to make sure every table gets proper instruction and facilitation." },
  { q: "What's included in a corporate mahjong event?", a: "We provide all tiles, racks, NMJL cards, and full instruction. We also handle setup and facilitate the event from start to finish. You provide the venue and any food or drink you'd like." },
  { q: "How long does a corporate mahjong event run?", a: "Typical events run 2-3 hours. We can customize the duration based on your schedule and what fits your team's energy." },
  { q: "Can you host at our office or hotel meeting room?", a: "Yes. We come to wherever your team is: your office, a hotel conference space, a restaurant private room, or a corporate venue. We accommodate the space you have." },
  { q: "Do you do charity mahjong events?", a: "We do. Charity mahjong events, fundraiser tournaments, and cause-based gatherings are a specialty. Contact us to discuss your organization's needs." },
];

export default function MahjongCorporateLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <p className="section-label">Team Building · Corporate Events · Charity</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Corporate Mahjong in <span className="accent-green">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Your team has done happy hours and escape rooms. Give them something that actually builds real connections, a strategic, social, genuinely memorable mahjong experience.
            </p>
            <a href="/#classes" className="btn-primary">Request a Quote</a>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Why Mahjong</p>
            <h2 className="section-title">The Team Building Activity That <span className="accent-pink">Actually Works</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {[
                { icon: "🧠", title: "Strategy Makes People Think", desc: "Mahjong requires real strategic thinking, reading other players, and adapting quickly. The skills that make a great mahjong player are the same ones that make a great teammate." },
                { icon: "🤝", title: "Levels the Playing Field", desc: "The boss and the newest hire are both beginners at the table. That shared learning moment breaks down hierarchy in a way no icebreaker exercise can." },
                { icon: "💬", title: "Forces Real Conversation", desc: "Four people at a small table, focused on the same game. Side-by-side learning creates a different kind of conversation than a presentation or workshop ever could." },
                { icon: "🎯", title: "Actually Memorable", desc: "Your team will talk about this event. Not \"that was a nice dinner\" talk. \"We should do that again\" talk. That's the difference between a team event and a team experience." },
              ].map(item => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{item.icon}</div>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">Event Types</p>
            <h2 className="section-title">What We Do for <span className="accent-green">Organizations</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {[
                { title: "Corporate Team Building", desc: "Full event facilitation for company teams. Strategy-based, social, and fun. Works for any department, any industry." },
                { title: "Client Entertainment", desc: "Impress clients with an experience they haven't done before. A private mahjong session is a conversation starter that lasts." },
                { title: "Conference and Convention Groups", desc: "Las Vegas hosts thousands of conventions per year. A mahjong experience is the perfect evening or afternoon activity for out-of-town groups." },
                { title: "Holiday and Quarterly Parties", desc: "Skip the standard holiday dinner. Give your team an event they'll associate with your company in the best possible way." },
                { title: "Charity and Fundraiser Events", desc: "We partner with nonprofits to produce mahjong fundraisers, tournaments, and awareness events. Custom format for your organization's goals." },
              ].map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--green)", opacity: 0.35, flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">Corporate Testimonial</p>
            <blockquote style={{ borderLeft: "3px solid var(--green)", paddingLeft: "1.5rem", margin: "2rem 0" }}>
              <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.8, fontStyle: "italic", marginBottom: "1rem" }}>
                &ldquo;We worked with Shauna for a mahjong-oriented corporate event in early 2026. Shauna was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we&rsquo;ve ever received from this event, and we hope to work with Shauna again on a future mahjong social!&rdquo;
              </p>
              <cite style={{ fontFamily: "var(--font-nav)", fontSize: "0.9rem", color: "var(--green)", fontStyle: "normal", fontWeight: 700 }}>Kristi, Northmarq</cite>
            </blockquote>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ — <span className="accent-pink">Corporate Events</span></h2>
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

        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Let&rsquo;s Build Something <span className="accent-green">Your Team Remembers</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Tell us your group size, date, and what you&rsquo;re looking for. We&rsquo;ll send you a custom quote within 24 hours.
            </p>
            <a href="/#classes" className="btn-primary">Request a Corporate Quote</a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
