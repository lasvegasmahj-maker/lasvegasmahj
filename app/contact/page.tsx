import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import ContactForm from "@/components/contact-form";

export const metadata: Metadata = {
  title: { absolute: "Contact Las Vegas Mahjong | Lessons, Parties, Events" },
  description:
    "Contact Las Vegas Mahjong about lessons, private parties, and corporate events. Send a message or email us. Our studio is inside Lucky Hare on West Sahara Ave.",
  alternates: { canonical: "https://www.lasvegasmahj.com/contact" },
  openGraph: {
    ...ogBase,
    title: "Contact Las Vegas Mahjong",
    description:
      "Questions about mahjong lessons, a private party, or a corporate event in Las Vegas? Send a message and we will get back to you within 24 hours.",
    url: "https://www.lasvegasmahj.com/contact",
    images: ["https://www.lasvegasmahj.com/shauna.jpg"],
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://www.lasvegasmahj.com/contact" },
  ],
};

const contactPage = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Las Vegas Mahjong",
  url: "https://www.lasvegasmahj.com/contact",
  mainEntity: { "@id": "https://www.lasvegasmahj.com/#business" },
};

const routes = [
  {
    title: "Rules question?",
    body: "Ask it and get an answer straight away, or read the full guide.",
    links: [
      { href: "/ask", label: "Ask a Rule" },
      { href: "/rules", label: "Rules Guide" },
    ],
  },
  {
    title: "Ready to book?",
    body: "Classes and open play on the calendar are bookable right now.",
    links: [{ href: "/schedule", label: "See the Calendar" }],
  },
  {
    title: "Planning an event?",
    body: "See what we host, then send us the details and we will build it around your group.",
    links: [
      { href: "/mahjong-parties-las-vegas", label: "Private Parties" },
      { href: "/mahjong-corporate-las-vegas", label: "Corporate Events" },
    ],
  },
];

export default function Contact() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPage).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Lessons &middot; Private Parties &middot; Corporate Events</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Contact <span className="accent-pink">Las Vegas Mahjong</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>
              Have a question about a lesson, a private party, or a corporate event? Send a message and we will get back to you within 24 hours. Tell us what you are planning, how many people you have, and the dates that work, and we will take it from there.
            </p>
          </div>
        </section>

        {/* FORM */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "580px" }}>
            <p className="section-label">Send a Message</p>
            <h2 className="section-title">Tell Us What You Are <span className="accent-green">Planning</span></h2>
            <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75, margin: "1rem 0 2rem" }}>
              Fill in the form and it comes straight to our inbox. Prefer email? Write to{" "}
              <a href="mailto:hello@lasvegasmahj.com" style={{ color: "var(--green)", fontWeight: 600 }}>
                hello@lasvegasmahj.com
              </a>
              .
            </p>
            <ContactForm />
          </div>
        </section>

        {/* STUDIO AND EMAIL */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            <p className="section-label">Where to Find Us</p>
            <h2 className="section-title">Our <span className="accent-pink">Studio</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.8rem" }}>Studio</h3>
                <address style={{ fontStyle: "normal", color: "rgba(255,255,255,0.65)", lineHeight: 1.8, marginBottom: "1rem" }}>
                  Inside Lucky Hare
                  <br />
                  8687 W. Sahara Ave., Suite 200
                  <br />
                  Las Vegas, NV 89117
                </address>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
                  Group lessons, private lessons, and open play all happen here.
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.8rem" }}>Email</h3>
                <p style={{ marginBottom: "1rem" }}>
                  <a href="mailto:hello@lasvegasmahj.com" style={{ color: "var(--green)", fontWeight: 600 }}>
                    hello@lasvegasmahj.com
                  </a>
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", lineHeight: 1.65, margin: 0 }}>
                  We answer within 24 hours.
                </p>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "2rem" }}>
              We serve Las Vegas, Summerlin, Henderson, Green Valley, Anthem, and the wider Las Vegas Valley. Private lessons, parties, and corporate events are customized to your group, so contact us for pricing. Group lesson pricing is listed on the{" "}
              <a href="/mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>
                mahjong lessons page
              </a>
              .
            </p>
          </div>
        </section>

        {/* FASTER ANSWERS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "900px" }}>
            <p className="section-label">Faster Answers</p>
            <h2 className="section-title">You Might Not Need <span className="accent-green">Us</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.2rem", marginTop: "2.5rem" }}>
              {routes.map(r => (
                <div key={r.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{r.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1rem" }}>{r.body}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                    {r.links.map(l => (
                      <a key={l.href} href={l.href} style={{ color: "var(--green)", fontWeight: 600, fontSize: "0.9rem" }}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">See You at the <span className="accent-pink">Table</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Book a lesson, join an open play, or bring us to your event.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/schedule" className="btn-primary">See the Calendar</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">View Lessons</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
