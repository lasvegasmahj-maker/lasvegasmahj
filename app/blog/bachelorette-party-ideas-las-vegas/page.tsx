import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Bachelorette Party Ideas Las Vegas 2026 | Beyond the Basics",
  description:
    "The best bachelorette party ideas in Las Vegas for 2026. Mahjong parties, pool days, private dinners, and experiences that actually bond the group. No cheesy sashes required.",
  keywords: [
    "bachelorette party ideas Las Vegas",
    "Las Vegas bachelorette party",
    "unique bachelorette Las Vegas",
    "bachelorette activities Las Vegas",
    "fun bachelorette ideas Vegas",
    "mahjong bachelorette party Las Vegas",
    "Las Vegas girls trip ideas",
    "Las Vegas bach party",
  ],
  alternates: { canonical: "https://lasvegasmahj.com/blog/bachelorette-party-ideas-las-vegas" },
  openGraph: {
    title: "Bachelorette Party Ideas Las Vegas 2026 | Beyond the Basics",
    description: "The best bachelorette party ideas in Las Vegas. Mahjong parties, pool days, private dinners, and experiences that actually bond the group.",
    url: "https://lasvegasmahj.com/blog/bachelorette-party-ideas-las-vegas",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Bachelorette Party Ideas Las Vegas 2026: Beyond the Basics",
  description: "The best bachelorette party ideas in Las Vegas for 2026, from mahjong parties to pool days and private dinners.",
  image: "https://lasvegasmahj.com/hero-bg.jpg",
  datePublished: "2026-05-01",
  dateModified: "2026-05-23",
  author: {
    "@type": "Person",
    name: "Shauna",
    url: "https://lasvegasmahj.com/about",
  },
  publisher: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://lasvegasmahj.com",
    "@id": "https://lasvegasmahj.com/#business",
  },
  mainEntityOfPage: "https://lasvegasmahj.com/blog/bachelorette-party-ideas-las-vegas",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://lasvegasmahj.com/blog" },
    { "@type": "ListItem", position: 3, name: "Bachelorette Party Ideas Las Vegas", item: "https://lasvegasmahj.com/blog/bachelorette-party-ideas-las-vegas" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the most unique bachelorette party activity in Las Vegas?", acceptedAnswer: { "@type": "Answer", text: "A private mahjong party is one of the most unique bachelorette activities in Las Vegas. You learn to play together, it's social and strategic, and it gives the group something to do besides drink and shop. A certified instructor brings all the tiles and teaches everyone from scratch." } },
    { "@type": "Question", name: "How much does a bachelorette party mahjong experience cost in Las Vegas?", acceptedAnswer: { "@type": "Answer", text: "Pricing depends on your group size and what you're looking for. Contact Las Vegas Mahjong for a custom quote." } },
    { "@type": "Question", name: "Do you need to know how to play mahjong for a bachelorette party?", acceptedAnswer: { "@type": "Answer", text: "No. The instructor teaches everyone from scratch. Most groups are playing their first real hand within the first hour. No prior experience needed." } },
  ],
};

const ideas = [
  {
    num: "01",
    title: "Private Mahjong Party",
    tag: "Most Unique",
    desc: "This is the activity that always gets texted about after the trip. A certified mahjong instructor comes to your suite, rental, or venue and teaches everyone to play from scratch. Strategy, conversation, laughing when someone accidentally wins, and something you can keep playing long after you get home. Groups of 4 to 20+ welcome.",
    link: "/mahjong-parties-las-vegas",
    linkText: "See mahjong party details",
    accent: "pink",
  },
  {
    num: "02",
    title: "Day Club or Pool Party",
    tag: "Las Vegas Classic",
    desc: "Wet Republic, Marquee Dayclub, and Encore Beach Club are the top tier. Book a daybed or cabana in advance -- summer weekends sell out weeks ahead. Most have DJs, bottle service, and a full food menu. Best for groups that want to dance.",
    link: null,
    accent: "green",
  },
  {
    num: "03",
    title: "Private Dinner at a Chef's Table",
    tag: "Elevated",
    desc: "Las Vegas has some of the best restaurant talent in the world. Estiatorio Milos, Picasso at Bellagio, and é by José Andrés all offer private or semi-private dining. For a more intimate group feel, look for restaurants in the Arts District that offer private room buyouts.",
    link: null,
    accent: "pink",
  },
  {
    num: "04",
    title: "Helicopter Tour to the Grand Canyon",
    tag: "Bucket List",
    desc: "A Grand Canyon helicopter tour with a champagne landing runs 4-5 hours total from Las Vegas. Several operators fly daily. This is the one activity every group member remembers individually, not just as a group. Book early -- these fill up.",
    link: null,
    accent: "green",
  },
  {
    num: "05",
    title: "Spa Day at a Strip Hotel",
    tag: "Relaxation",
    desc: "The Qua Baths at Caesars, Canyon Ranch at The Venetian, and the Wynn Spa are all exceptional. Many offer group packages for bachelorette parties with dedicated staff. A half-day spa before a night out is one of the most popular itinerary combos.",
    link: null,
    accent: "pink",
  },
  {
    num: "06",
    title: "Cooking or Cocktail Class",
    tag: "Interactive",
    desc: "Several Las Vegas venues offer private group cocktail-making classes and cooking experiences. It's a 2-hour activity that produces something you eat or drink, which makes it more satisfying than most group activities. Look for options in Summerlin and Henderson for a more local feel.",
    link: null,
    accent: "green",
  },
  {
    num: "07",
    title: "Neon Museum Night Tour",
    tag: "Cultural",
    desc: "The Neon Boneyard at night, surrounded by lit-up vintage signs from Las Vegas history, is genuinely beautiful. The guided tour runs about 90 minutes and makes for incredible photos. Small groups can book private tours.",
    link: null,
    accent: "pink",
  },
  {
    num: "08",
    title: "Cirque du Soleil",
    tag: "Show",
    desc: "Three permanent Cirque shows run in Las Vegas (O at Bellagio, Ka at MGM Grand, Mystere at Treasure Island). These are world-class productions you cannot see anywhere else. For a bach party, O is the most visually spectacular.",
    link: null,
    accent: "green",
  },
  {
    num: "09",
    title: "Outdoor Adventure Half-Day",
    tag: "Active",
    desc: "Red Rock Canyon is 20 minutes from the Strip and has hiking for every fitness level. A morning hike followed by brunch hits different when you come back and realize you can still do the night out. Rent ebikes through local operators for an easier route.",
    link: null,
    accent: "pink",
  },
  {
    num: "10",
    title: "Escape Room for the Group",
    tag: "Team Activity",
    desc: "Las Vegas escape rooms range from small puzzle rooms to immersive theater-style experiences. Paradox Project has some of the most elaborate setups in the city. Best for groups of 6-10 who want something competitive.",
    link: null,
    accent: "green",
  },
];

export default function BachelorettePartyIdeasLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Las Vegas Bachelorette Guide · 2026</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 7vw, 4rem)", marginBottom: "1.5rem" }}>
              Bachelorette Party Ideas <span className="accent-pink">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.75 }}>
              Vegas bachelorette trips are legendary for a reason. But the best ones have an itinerary beyond &ldquo;club, club, brunch.&rdquo; Here are 10 ideas that actually bond the group.
            </p>
          </div>
        </section>

        <section style={{ padding: "4rem 2rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Las Vegas gets about 40 million visitors a year. A significant portion of them are here for bachelorette parties. Which means: if your group shows up with the standard itinerary, you&rsquo;ll have a fine time surrounded by 800 other groups doing the exact same thing.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              This list is written by someone who lives in Las Vegas, teaches private group experiences, and has seen hundreds of groups come through. The activities that people talk about the longest are the ones that made the group actually interact with each other, not just stand in the same venue.
            </p>
          </div>
        </section>

        <section style={{ padding: "3rem 2rem 5rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            {ideas.map((idea, i) => (
              <div key={idea.num} style={{ display: "flex", gap: "2rem", padding: "2rem 0", borderBottom: i < ideas.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", color: idea.accent === "pink" ? "var(--pink)" : "var(--green)", opacity: 0.3, flexShrink: 0, lineHeight: 1, minWidth: "3rem" }}>{idea.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <h2 style={{ fontFamily: "var(--font-nav)", fontSize: "1.1rem", fontWeight: 700, color: "var(--white)", margin: 0 }}>{idea.title}</h2>
                    {idea.tag && (
                      <span style={{ background: idea.accent === "pink" ? "rgba(233,30,140,0.15)" : "rgba(57,230,57,0.12)", color: idea.accent === "pink" ? "var(--pink)" : "var(--green)", fontSize: "0.7rem", fontFamily: "var(--font-nav)", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "4px", letterSpacing: "0.05em" }}>{idea.tag}</span>
                    )}
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: 0 }}>{idea.desc}</p>
                  {idea.link && (
                    <a href={idea.link} style={{ display: "inline-block", marginTop: "0.9rem", color: "var(--pink)", fontFamily: "var(--font-nav)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>{idea.linkText} →</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Common <span className="accent-pink">Questions</span></h2>
            <div style={{ marginTop: "2rem" }}>
              {[
                { q: "What is the most unique bachelorette party activity in Las Vegas?", a: "A private mahjong party is one of the most unique options in the city. You learn together, it's social and strategic, and it gives the group something to actually do together rather than just be in the same place. A certified instructor brings all the tiles and teaches everyone from scratch. No prior experience needed." },
                { q: "How much does a bachelorette mahjong party cost?", a: "Pricing depends on your group size and what you're looking for. Contact us for a custom quote." },
                { q: "How far in advance should I book Las Vegas bachelorette activities?", a: "For popular activities like pool cabanas, helicopter tours, and dinner reservations, book 4-8 weeks out for summer weekends. For mahjong parties, we can often accommodate 1-2 weeks notice, but earlier is better." },
                { q: "How many activities should we plan per day?", a: "Two structured activities per day is usually ideal. More than that and people get tired or rushed. Leave buffer time between things and don't over-schedule the first night." },
              ].map(faq => (
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
            <h2 className="section-title">Book a <span className="accent-pink">Mahjong Party</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Private mahjong parties for bachelorettes, girls&rsquo; trips, and group celebrations. We come to your venue with everything you need. Beginners always welcome.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/mahjong-parties-las-vegas" className="btn-primary">See Party Details</a>
              <a href="/#classes" className="btn-outline">Book Now</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
