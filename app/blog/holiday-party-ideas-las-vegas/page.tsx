import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Holiday Party Ideas Las Vegas 2026 | Beyond the Open Bar",
  description:
    "Holiday party ideas in Las Vegas for work teams and friend groups. Private mahjong parties, holiday lights, group classes, and get-togethers that actually bring people together.",
  alternates: { canonical: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas" },
  openGraph: {
    title: "Holiday Party Ideas Las Vegas 2026 | Beyond the Open Bar",
    description:
      "Holiday party ideas in Las Vegas for work teams and friend groups. Private mahjong parties, holiday lights, group classes, and get-togethers that actually bring people together.",
    url: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas",
    siteName: "Las Vegas Mahjong",
    locale: "en_US",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Holiday Party Ideas Las Vegas 2026: Beyond the Open Bar",
  description: "Holiday party ideas in Las Vegas for work teams and friend groups, from private mahjong parties to holiday lights and group classes.",
  image: "https://www.lasvegasmahj.com/hero-bg.jpg",
  datePublished: "2026-08-09",
  dateModified: "2026-08-09",
  author: {
    "@type": "Person",
    name: "Shauna",
    url: "https://www.lasvegasmahj.com/about",
  },
  publisher: {
    "@type": "LocalBusiness",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    "@id": "https://www.lasvegasmahj.com/#business",
  },
  mainEntityOfPage: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.lasvegasmahj.com/blog" },
    { "@type": "ListItem", position: 3, name: "Holiday Party Ideas Las Vegas", item: "https://www.lasvegasmahj.com/blog/holiday-party-ideas-las-vegas" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is a good holiday party idea for a work team?", acceptedAnswer: { "@type": "Answer", text: "A private mahjong party is one of the best options. Everyone learns together, it puts quiet and outgoing people on equal footing, and it gives the group something to do besides stand around a bar. A certified instructor brings all the tiles and teaches from scratch, so no experience is needed." } },
    { "@type": "Question", name: "Can you host a holiday get-together for a group of friends too?", acceptedAnswer: { "@type": "Answer", text: "Yes. Holiday mahjong parties work just as well for friend groups, neighbors, and family as they do for offices. Groups of 4 to 20 or more are welcome, and everyone plays a real game during the party." } },
    { "@type": "Question", name: "How much does a holiday mahjong party cost?", acceptedAnswer: { "@type": "Answer", text: "Pricing depends on your group size, location, and what you're looking for. Contact us for a custom quote." } },
    { "@type": "Question", name: "How far in advance should I book a holiday party?", acceptedAnswer: { "@type": "Answer", text: "December fills up fast for both venues and hosts. Book four to six weeks ahead for prime December dates. Earlier weekends and weekday slots have more availability." } },
  ],
};

const ideas = [
  {
    num: "01",
    title: "Host a Mahjong Holiday Party",
    tag: "Most Memorable",
    desc: "This is the one people keep talking about in January. A certified mahjong instructor comes to your office, home, or a private room and teaches the whole group to play from scratch. It works for a work team and for a group of friends the same way: it gets everyone talking, it is friendly-competitive, and it is something you can keep playing long after the holidays. Groups of 4 to 20 or more welcome.",
    link: "/mahjong-parties-las-vegas",
    linkText: "See mahjong party details",
    accent: "pink",
  },
  {
    num: "02",
    title: "Private Room at a Local Restaurant",
    tag: "Classic",
    desc: "Skip the packed Strip steakhouse and look for a private or semi-private room closer to home. The Arts District, Summerlin, and Henderson all have restaurants that do buyouts and set menus for groups. Pair a private room with a hosted activity and the night runs itself.",
    link: null,
    accent: "green",
  },
  {
    num: "03",
    title: "Holiday Lights and Winter Displays",
    tag: "Seasonal",
    desc: "Las Vegas does the holidays well. Walk-through light displays, the Bellagio Conservatory winter scene, and neighborhood light tours make an easy, low-cost group outing. Great as a first stop before dinner or a game night.",
    link: null,
    accent: "pink",
  },
  {
    num: "04",
    title: "Cookie or Cocktail Class",
    tag: "Hands-On",
    desc: "A guided cookie-decorating, gingerbread, or cocktail-making class gives everyone a task and something to take home. It is a solid pick for a work team because it breaks people out of their usual desk cliques. Look for private group options in Summerlin and Henderson for a more local feel.",
    link: null,
    accent: "green",
  },
  {
    num: "05",
    title: "Ugly Sweater Game Night",
    tag: "Casual",
    desc: "Put a theme on it. An ugly-sweater game night, a white-elephant swap, and a hosted mahjong table turn a plain gathering into an event with a running joke. Works for friend groups, families, and small offices alike.",
    link: null,
    accent: "pink",
  },
  {
    num: "06",
    title: "Give Back as a Group",
    tag: "Meaningful",
    desc: "A morning of volunteering, a toy drive, or a group donation makes the season feel like more than a party. Several Las Vegas nonprofits run holiday programs that welcome groups. Pair it with a casual lunch or game afternoon after.",
    link: null,
    accent: "green",
  },
  {
    num: "07",
    title: "See a Show",
    tag: "Night Out",
    desc: "A Cirque du Soleil production or a seasonal holiday show is an easy group win when you want a big night without planning much. Book a block of seats together and add a pre-show dinner nearby.",
    link: null,
    accent: "pink",
  },
  {
    num: "08",
    title: "Wine or Coffee Tasting",
    tag: "Relaxed",
    desc: "A guided tasting is low-key and works for groups that would rather sit and talk than dance. Several local spots do private tastings for groups. Good for a mixed-age crowd or a team that wants something calmer.",
    link: null,
    accent: "green",
  },
  {
    num: "09",
    title: "Group Spa Afternoon",
    tag: "Reset",
    desc: "The holidays are busy, and a half-day spa is a genuine gift for a team or a friend group that needs to slow down. Many Las Vegas spas offer group packages. Book it as a year-end thank-you rather than another late night.",
    link: null,
    accent: "pink",
  },
  {
    num: "10",
    title: "Learn Something Together",
    tag: "New in the New Year",
    desc: "A holiday get-together is a natural time to start a new group habit. Learning mahjong as a team or a friend group gives everyone a reason to keep meeting into the new year, at the studio or on a regular open-play night.",
    link: "/mahjong-lessons-las-vegas",
    linkText: "See lesson options",
    accent: "green",
  },
];

export default function HolidayPartyIdeasLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Las Vegas Holiday Guide · 2026</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 7vw, 4rem)", marginBottom: "1.5rem" }}>
              Holiday Party Ideas <span className="accent-pink">Las Vegas</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.75 }}>
              The holiday happy hour is fine. But the get-togethers people actually remember, whether it is a work team or a group of friends, are the ones where everyone did something together. Here are 10 ideas that go beyond the open bar.
            </p>
          </div>
        </section>

        <section style={{ padding: "4rem 2rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Every December, offices and friend groups run the same playbook: a bar, a dinner, a round of drinks, and a lot of people standing in clusters talking to the same three people they always talk to. It is pleasant, and it is forgotten by New Year.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              This list is written by someone who lives in Las Vegas and hosts group experiences all year. The gatherings people talk about longest are the ones with a shared activity, something that gets the quiet person and the loud person doing the same thing at the same table. That works for a team holiday party and for a friend-group get-together equally well.
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
                { q: "What is a good holiday party idea for a work team?", a: "A private mahjong party is one of the best options. Everyone learns together, it puts quiet and outgoing people on equal footing, and it gives the group something to do besides stand around a bar. A certified instructor brings all the tiles and teaches from scratch, so no experience is needed." },
                { q: "Can you host a holiday get-together for a group of friends too?", a: "Yes. Holiday mahjong parties work just as well for friend groups, neighbors, and family as they do for offices. Groups of 4 to 20 or more are welcome, and everyone plays a real game during the party." },
                { q: "How much does a holiday mahjong party cost?", a: "Pricing depends on your group size, location, and what you're looking for. Contact us for a custom quote." },
                { q: "How far in advance should I book a holiday party?", a: "December fills up fast for both venues and hosts. Book four to six weeks ahead for prime December dates. Earlier weekends and weekday slots have more availability." },
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
            <h2 className="section-title">Book a <span className="accent-pink">Holiday Party</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Private mahjong parties for office teams, friend groups, and family get-togethers. We bring everything you need and teach from scratch. Beginners always welcome. Contact us for a custom quote.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/mahjong-parties-las-vegas" className="btn-primary">See Party Details</a>
              <a href="/mahjong-corporate-las-vegas" className="btn-outline">Corporate Events</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
