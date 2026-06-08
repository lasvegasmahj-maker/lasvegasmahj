import type { Metadata } from "next";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Things to Do in Las Vegas Besides Gambling | 2026 Guide",
  description:
    "Las Vegas has way more than casinos. From mahjong parties to live music, hiking, and local food, here are the best non-gambling things to do in Las Vegas.",
  keywords: [
    "things to do in Las Vegas besides gambling",
    "non-gambling Las Vegas activities",
    "Las Vegas activities without gambling",
    "what to do in Las Vegas not gambling",
    "Las Vegas unique experiences",
    "bachelorette party Las Vegas no gambling",
    "team building Las Vegas",
    "fun things Las Vegas",
  ],
  alternates: { canonical: "https://www.lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling" },
  openGraph: {
    title: "Things to Do in Las Vegas Besides Gambling | 2026",
    description: "Las Vegas has way more than casinos. Mahjong parties, hiking, live music, and 20+ activities that have nothing to do with slot machines.",
    url: "https://www.lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling",
    siteName: "Las Vegas Mahjong",
    locale: "en_US",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Things to Do in Las Vegas Besides Gambling: 20+ Ideas for 2026",
  description: "Las Vegas has way more than casinos. From mahjong parties to live music, hiking, and local food, here are the best non-gambling activities in Las Vegas.",
  image: "https://www.lasvegasmahj.com/hero-bg.jpg",
  datePublished: "2026-05-01",
  dateModified: "2026-05-23",
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
  mainEntityOfPage: "https://www.lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling",
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.lasvegasmahj.com/blog" },
    { "@type": "ListItem", position: 3, name: "Things to Do Besides Gambling", item: "https://www.lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling" },
  ],
};

const activities = [
  {
    category: "Social & Games",
    items: [
      {
        title: "Mahjong Party or Lesson",
        desc: "One of the best-kept secrets in Las Vegas: you can book a private mahjong party, bachelorette event, or group lesson with a certified instructor. Strategy, laughs, and something genuinely different from every other group activity in the city. No experience needed.",
        link: "/mahjong-parties-las-vegas",
        linkText: "Book a mahjong party",
        tag: "Local Favorite",
      },
      {
        title: "Escape Rooms",
        desc: "Las Vegas has some of the most elaborate escape rooms in the country. Paradox Project and Escapology are fan favorites. Good for groups of 4-10 and last 60-90 minutes.",
      },
      {
        title: "Pinball Hall of Fame",
        desc: "A nonprofit museum with 200+ vintage pinball machines from the 1950s to 2000s. Totally free to enter, and you can play all the machines. One of the most underrated stops in Las Vegas.",
      },
      {
        title: "Archery or Ax Throwing",
        desc: "Axe Monkeys and similar venues offer walk-in sessions for ax throwing. No experience required, and it's surprisingly fun for groups who want something active and competitive.",
      },
    ],
  },
  {
    category: "Arts & Culture",
    items: [
      {
        title: "The Neon Museum",
        desc: "The Neon Boneyard is a two-acre outdoor museum of retired Las Vegas signs from the 1930s onward. Night tours are especially spectacular. Book in advance -- it sells out.",
      },
      {
        title: "Mob Museum",
        desc: "Three floors of organized crime history, with actual courtroom seating from the Kefauver hearings, artifacts, and a genuine speakeasy in the basement. Downtown, walkable from Fremont Street.",
      },
      {
        title: "Arts District (18b)",
        desc: "The 18b Arts District is Las Vegas's creative neighborhood with galleries, independent restaurants, and murals. First Friday brings out local artists every month for a free outdoor event.",
      },
      {
        title: "Las Vegas Natural History Museum",
        desc: "A genuine natural history museum with dinosaur fossils, Nevada wildlife, and a live shark tank. Affordable and great for families or curious adults.",
      },
    ],
  },
  {
    category: "Outdoors",
    items: [
      {
        title: "Red Rock Canyon",
        desc: "A 13-mile scenic loop through one of the most dramatic desert landscapes in the West. Hiking trails for every fitness level. 20 minutes from the Strip. Free to drive through, $15 timed entry fee for hiking.",
      },
      {
        title: "Valley of Fire State Park",
        desc: "Bright red Aztec sandstone formations that look like a different planet. Petroglyphs, arches, and wide open desert. About an hour from Las Vegas -- worth the drive.",
      },
      {
        title: "Lake Mead & Hoover Dam",
        desc: "Hoover Dam tours run daily and are genuinely impressive. Lake Mead has kayaking and paddleboarding. Both are under 40 minutes from the Strip.",
      },
      {
        title: "Wetlands Park",
        desc: "A 2,900-acre nature preserve in Henderson with hiking, biking, and bird watching. Free. Feels nothing like Las Vegas.",
      },
    ],
  },
  {
    category: "Food & Drink",
    items: [
      {
        title: "Eat Your Way Down Fremont Street",
        desc: "The Downtown Container Park, Fremont East District, and surrounding blocks have some of the best local restaurants in Nevada. Hugo's Cellar, Carson Kitchen, PublicUs -- none of them are in a casino.",
      },
      {
        title: "Las Vegas Farmers Markets",
        desc: "The Summerlin Farmers Market runs Saturday mornings with local produce, vendors, and food trucks. The Downtown 3rd market runs Thursday evenings year-round.",
      },
      {
        title: "Distillery Tours",
        desc: "Nevada Copper (Henderson) and Bently Heritage (Minden, day trip) both offer tasting tours. Closer in, several craft cocktail bars do class-style cocktail experiences.",
      },
    ],
  },
  {
    category: "Entertainment (Non-Casino)",
    items: [
      {
        title: "Cirque du Soleil or Vegas Shows",
        desc: "Three Cirque shows run permanently in Las Vegas. There are also dozens of residencies, comedy shows, and productions that have nothing to do with a casino floor.",
      },
      {
        title: "Las Vegas Raiders or Knights Games",
        desc: "Allegiant Stadium hosts Raiders NFL games and major events year-round. T-Mobile Arena has Vegas Golden Knights (NHL) games and concerts. Both are world-class venues.",
      },
      {
        title: "SpeedVegas or Dig This",
        desc: "Drive exotic cars on a real track (SpeedVegas) or operate heavy construction equipment like excavators and bulldozers (Dig This). Both are genuinely wild experiences.",
      },
    ],
  },
];

export default function ThingsToDoLasVegas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Las Vegas Guide · 2026</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 7vw, 4rem)", marginBottom: "1.5rem" }}>
              Things to Do in Las Vegas <span className="accent-green">Besides Gambling</span>
            </h1>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: "580px", margin: "0 auto", lineHeight: 1.75 }}>
              Las Vegas is one of the most interesting cities in the United States for reasons that have absolutely nothing to do with slot machines. Here are 20+ of the best ones.
            </p>
          </div>
        </section>

        <section style={{ padding: "4rem 2rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              Vegas has a reputation. You show up, you gamble, you leave. But for locals and repeat visitors, that version of Las Vegas gets old fast. The city has world-class museums, 30 minutes of some of the most dramatic desert hiking in the US, a thriving arts scene, and a growing list of genuinely one-of-a-kind group experiences.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85 }}>
              This is a guide written by a Las Vegas local. No fluff, no hotel sponsorships. Just the things that are actually worth your time.
            </p>
          </div>
        </section>

        {activities.map((section) => (
          <section key={section.category} style={{ padding: "3rem 2rem", background: section.category === "Arts & Culture" || section.category === "Food & Drink" ? "var(--navy-dark)" : "var(--navy)" }}>
            <div className="container" style={{ maxWidth: "780px" }}>
              <p className="section-label">{section.category}</p>
              <div style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
                {section.items.map((item) => (
                  <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem", position: "relative" }}>
                    {item.tag && (
                      <span style={{ position: "absolute", top: "1.2rem", right: "1.2rem", background: "var(--pink)", color: "white", fontSize: "0.7rem", fontFamily: "var(--font-nav)", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "4px", letterSpacing: "0.05em" }}>{item.tag}</span>
                    )}
                    <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--white)" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    {item.link && (
                      <a href={item.link} style={{ display: "inline-block", marginTop: "1rem", color: "var(--green)", fontFamily: "var(--font-nav)", fontSize: "0.9rem", fontWeight: 700, textDecoration: "none" }}>{item.linkText} →</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "780px" }}>
            <p className="section-label">Planning a Group Trip?</p>
            <h2 className="section-title">Mahjong Is the <span className="accent-pink">Move</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "1rem" }}>
              If you&rsquo;re planning a bachelorette weekend, girls&rsquo; trip, team outing, or any kind of group experience in Las Vegas, a private mahjong party is one of the most memorable things you can do. You don&rsquo;t need experience. We bring all the equipment. You get to play, laugh, and learn something you&rsquo;ll actually use again after you leave.
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, marginBottom: "2rem" }}>
              Groups of 4 to 40 welcome. <a href="/mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>Mahjong lessons</a> are also available if you want to learn at a slower pace. And if you&rsquo;re local, we run <a href="/mahjong-open-play-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>open play events</a> around the valley.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <a href="/mahjong-parties-las-vegas" className="btn-primary">Book a Private Party</a>
              <a href="/#classes" className="btn-outline">View All Events</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
