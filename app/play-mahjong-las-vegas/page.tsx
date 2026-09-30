import type { Metadata } from "next";
import Image from "next/image";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import { SEVENS_OPEN_PLAY, OPEN_PLAY_PLAYERS } from "@/lib/studio-photos";
import { getScheduleEvents, type ScheduleEvent } from "@/lib/schedule";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { OPEN_PLAY_PRICE_LINE } from "@/lib/pricing";

const PAGE_URL = "https://www.lasvegasmahj.com/play-mahjong-las-vegas";
const MAP_URL = "https://maps.app.goo.gl/dGeHMfMDjuXjDFPs5";

/**
 * For the visitor who already plays American Mahjong and wants a game while in town.
 * /mahjong-open-play-las-vegas explains what open play is for locals; this page answers
 * "can I play while I'm visiting, and how". Every operational claim here comes from the
 * Bookwhen Open Play listing, /schedule, /studio or the homepage FAQ. Nothing about hours,
 * parking, prices, distances or travel times, because none of those is established.
 */

export const metadata: Metadata = {
  // Absolute, because the template's brand suffix would push this past what a results
  // page shows and put a second pipe in it.
  title: { absolute: "Play Mahjong in Las Vegas | Open Play for Visitors" },
  description:
    "Visiting Las Vegas and already play American Mahjong? Book a seat at Social Open Play during your trip. Come solo or with friends; no table of four needed.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    ...ogBase,
    title: "Play Mahjong in Las Vegas | Open Play for Visitors",
    description:
      "Already play American Mahjong? Book a seat at Social Open Play at the Las Vegas Mahjong studio inside Lucky Hare. Come on your own or bring friends.",
    url: PAGE_URL,
    images: [`https://www.lasvegasmahj.com${SEVENS_OPEN_PLAY.src}`],
  },
};

const faqs = [
  {
    q: "Can visitors play mahjong in Las Vegas?",
    a: "Yes. Visitors are welcome at Social Open Play, held at the Las Vegas Mahjong studio inside Lucky Hare on West Sahara Avenue. Reserve a seat for a session on our schedule, then come and play American Mahjong with players from our local community.",
  },
  {
    q: "Where can I play American Mahjong in Las Vegas?",
    a: "At the Las Vegas Mahjong studio, inside Lucky Hare at 8687 W. Sahara Ave., Suite 200, Las Vegas, NV 89117. Social Open Play meets in the Lucky Sevens room, and every Open Play date is listed on our schedule with a Book button.",
  },
  {
    q: "Can I come to Open Play alone?",
    a: "Yes. You can sign up on your own and meet other mahjong players at the session, or come with friends and book your seats together.",
  },
  {
    q: "Do I need to bring three other players?",
    a: "No. You do not need to find a table of four before you register. Book a seat for yourself, or one for each person you are traveling with. Open Play welcomes players who come on their own as well as groups.",
  },
  {
    q: "What type of mahjong do you play?",
    a: "American Mahjong, also written American Mah Jongg, played with the current National Mah Jongg League (NMJL) card. It is not Riichi (Japanese) mahjong, and it is not Chinese or Hong Kong style mahjong. American Mahjong uses a 152-tile set that includes jokers, opens every hand with the Charleston, and requires a winning hand to match one of the hands on the current year's card.",
  },
  {
    q: "Do I need an NMJL card?",
    a: "Yes. Open Play uses the current year's National Mah Jongg League card, so please bring your own. You do not need to pack tiles: at Open Play you pick a mat, racks and a set of tiles from the studio's collection.",
  },
  {
    q: "How much experience do I need for Open Play?",
    a: "Open Play is for playing, not a class, and it is for players who already know American Mahjong. If you already play, or have completed Mahj 101, you are ready. If you have never played, start with Mahj 101: it teaches the tiles, how to read the NMJL card and how a hand comes together.",
  },
  {
    q: "Do I need to reserve in advance?",
    a: "Yes. Advance registration is required. The studio runs on scheduled classes and events rather than drop-in hours, so book your Open Play seat online before you come. Spots are limited, and a session that fills has an automatic waitlist.",
  },
  {
    q: "Where is the Las Vegas Mahjong Studio?",
    a: "Inside Lucky Hare at 8687 W. Sahara Ave., Suite 200, Las Vegas, NV 89117. The studio has two rooms: Lucky Wishbone for classes and events, and Lucky Sevens for Open Play.",
  },
  {
    q: "What if I am visiting with a group?",
    a: "Friends traveling together can book seats at the same Open Play session while seats remain. If your group would rather have something of its own, such as a private lesson, a mahjong party or an activity for a business, conference or convention group, send us your dates and group size through the contact form and we will plan it with you. Private and corporate events are priced on request.",
  },
  {
    q: "Where can I see upcoming Open Play sessions?",
    a: "On our schedule at lasvegasmahj.com/schedule. It lists every upcoming class, Open Play session and special event with the date and time, and each listing has a Book button. Times are shown in Pacific.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Play Mahjong in Las Vegas", url: PAGE_URL },
]);

const quickFacts = [
  {
    title: "Where you play",
    body: "Our own mahjong studio, inside Lucky Hare at 8687 W. Sahara Ave., Suite 200. Social Open Play meets in the Lucky Sevens room.",
  },
  {
    title: "What we play",
    body: "American Mahjong with the current National Mah Jongg League card. Not Riichi, and not Chinese or Hong Kong style.",
  },
  {
    title: "Who can come",
    body: "Players who already know American Mahjong, visitors and locals alike. Come on your own or bring friends; you do not need a table of four.",
  },
  {
    title: "How to get a seat",
    body: `Advance registration is required. Book a seat for an Open Play session on the schedule before you come: ${OPEN_PLAY_PRICE_LINE}.`,
  },
];

const steps = [
  {
    title: "Check the dates against your trip",
    desc: "Open Play runs on a calendar, not drop-in hours, so start with the schedule and look for Social Open Play sessions that fall while you are in town.",
  },
  {
    title: "Reserve your seat online",
    desc: "Book the session you want and secure your seat with card payment. Spots are limited, and a full session has an automatic waitlist.",
  },
  {
    title: "Come to the studio",
    desc: "Head to Lucky Hare at 8687 W. Sahara Ave., Suite 200. Open Play is in Lucky Sevens, the studio's playing room.",
  },
  {
    title: "Sit down and play",
    desc: "Pick a mat, racks and a set of tiles from the studio's collection, and play for two hours with the rest of the room.",
  },
];

// Regular Social Open Play only: specials (a holiday night in both rooms, a priced promo)
// would contradict the two-hours-in-Lucky-Sevens copy beside the list. The feed only drops
// past days, so a session that ended earlier today is dropped here by its end time.
function nextSocialOpenPlay(events: ScheduleEvent[]) {
  const now = Date.now();
  return events
    .filter((e) => e.venueKind === "studio" && /^social open play\b/i.test(e.title) && !/\$\s?\d/.test(e.title))
    .filter((e) => {
      const end = e.endIso ?? e.startIso;
      return !end || Date.parse(end) > now;
    })
    .slice(0, 4);
}

export default async function PlayMahjongLasVegas() {
  const openPlay = nextSocialOpenPlay(await getScheduleEvents());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "3rem", alignItems: "center" }}>
              <div>
                <p className="section-label">Visiting Las Vegas &middot; American Mahjong &middot; Open Play</p>
                <h1 className="section-title" style={{ fontSize: "clamp(2.2rem, 6.5vw, 4rem)", marginBottom: "1.5rem", textAlign: "left" }}>
                  Looking for a Mahjong Game While Visiting <span className="accent-green">Las Vegas?</span>
                </h1>
                <p style={{ fontSize: "1.12rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "2rem" }}>
                  If you already play American Mahjong, book a seat at Social Open
                  Play during your trip. We run it at our own mahjong studio, inside
                  Lucky Hare on West Sahara Avenue. Come on your own or with friends,
                  and reserve your seat online before you come.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="/schedule" className="btn-primary">See Open Play Dates</a>
                  <a href="/studio" className="btn-outline">Visit the Studio</a>
                </div>
              </div>
              <Image
                src={SEVENS_OPEN_PLAY.src}
                alt={SEVENS_OPEN_PLAY.alt}
                width={SEVENS_OPEN_PLAY.width}
                height={SEVENS_OPEN_PLAY.height}
                priority
                sizes="(max-width: 760px) 100vw, 48vw"
                style={{ width: "100%", height: "auto", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", display: "block" }}
              />
            </div>
          </div>
        </section>

        {/* QUICK FACTS */}
        <section className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">The Short Version</p>
            <h2 className="section-title">Open Play for <span className="accent-pink">Visiting Players</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {quickFacts.map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "680px" }}>
            <p className="section-label">How It Works</p>
            <h2 className="section-title">How to Get <span className="accent-green">a Seat</span></h2>
            <div style={{ marginTop: "2.5rem" }}>
              {steps.map((item, i) => (
                <div key={item.title} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem 0", borderBottom: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", color: "var(--green)", opacity: 0.35, flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.3rem" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginTop: "2rem" }}>
              Curious what the sessions are like for our regulars? Here is how{" "}
              <a href="/mahjong-open-play-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>mahjong open play in Las Vegas</a>{" "}
              works week to week.
            </p>
          </div>
        </section>

        {/* NEXT SESSIONS */}
        <section id="dates" className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">On the Calendar</p>
            <h2 className="section-title">Upcoming <span className="accent-green">Open Play</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "1rem auto 2.5rem", lineHeight: 1.75, textAlign: "center" }}>
              The next Social Open Play sessions at the studio, straight from our booking calendar. Times are shown in Pacific. Special events are on the full schedule.
            </p>

            {openPlay.length === 0 ? (
              <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "2.5rem 1.5rem" }}>
                <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0 }}>
                  There are no Social Open Play sessions on the calendar right now. Check the schedule for the latest dates.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1rem", maxWidth: "760px", margin: "0 auto" }}>
                {openPlay.map((e) => (
                  <div key={e.uid} className="sched-card" style={{ display: "flex", alignItems: "flex-start", gap: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                    <div className="sched-date" style={{ flex: "none", width: "58px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.12)", paddingRight: "1rem" }}>
                      <div style={{ color: "var(--pink)", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.06em" }}>{e.day}</div>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1, color: "#fff" }}>{e.num}</div>
                    </div>
                    <div className="sched-body" style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff" }}>{e.title}</div>
                      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
                        {e.monthLabel} &middot; {e.time}
                      </div>
                    </div>
                    <div className="sched-book" style={{ flex: "none", textAlign: "right" }}>
                      <a href={e.url} target="_blank" rel="noopener" className="btn-primary" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}>{e.bookLabel}</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "2.5rem" }}>
              <a href="/schedule" className="btn-primary">See the Full Schedule</a>
            </div>
          </div>
        </section>

        {/* AMERICAN MAHJONG */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Which Mahjong?</p>
            <h2 className="section-title">We Play <span className="accent-pink">American Mahjong</span></h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "1.5rem 0 1rem" }}>
              Mahjong means different games in different places, so it is worth
              checking before you book. Open Play at our studio is American
              Mahjong, also written American Mah Jongg, played with the current
              National Mah Jongg League (NMJL) card.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1rem" }}>
              A few things set it apart. It uses a 152-tile set that includes
              jokers. Every hand opens with the Charleston, when players pass tiles
              to one another. And a winning hand has to match one of the hands
              printed on the current year&rsquo;s card, which the League releases
              every spring.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
              If you play Riichi (Japanese) mahjong, or Chinese or Hong Kong style
              mahjong, expect a different game at our tables. If American Mahjong
              is new to you, our{" "}
              <a href="/mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>mahjong lessons in Las Vegas</a>{" "}
              start from the very first tile.
            </p>
          </div>
        </section>

        {/* EXPERIENCE LEVEL */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Is It Right for You?</p>
            <h2 className="section-title">What Level Is <span className="accent-green">Open Play?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "1.5rem 0 1rem" }}>
              Open Play is for playing. It is a relaxed, social two hours at the
              table, not a class, and help is there when you want it.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1rem" }}>
              It is for players who already know American Mahjong. If you play
              with the NMJL card at home, or you have completed Mahj 101, you are
              ready. A little rusty? Come anyway.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
              If you have never played American Mahjong, start with Mahj 101
              before Open Play. It teaches the tiles, how to read the NMJL card and
              how a hand comes together, and you play a full game in your first
              lesson. Class dates are on the same schedule as Open Play.
            </p>
          </div>
        </section>

        {/* WHERE */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Where to Play</p>
            <h2 className="section-title">The Las Vegas Mahjong <span className="accent-green">Studio</span></h2>
            <address style={{ fontStyle: "normal", color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", lineHeight: 1.9, margin: "1.75rem 0 1.5rem", textAlign: "center" }}>
              <strong>Las Vegas Mahjong Studio</strong>
              <br />
              Inside Lucky Hare
              <br />
              8687 W. Sahara Ave., Suite 200
              <br />
              Las Vegas, NV 89117
            </address>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1rem" }}>
              The studio has two rooms. Lucky Wishbone holds classes, leagues and
              special events, and Lucky Sevens is the playing room, where Social
              Open Play happens. Most sessions on the schedule name their room.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
              Questions before you book? Email{" "}
              <a href="mailto:hello@lasvegasmahj.com" style={{ color: "var(--green)", fontWeight: 600 }}>hello@lasvegasmahj.com</a>.
            </p>
            <Image
              src={OPEN_PLAY_PLAYERS.src}
              alt={OPEN_PLAY_PLAYERS.alt}
              width={OPEN_PLAY_PLAYERS.width}
              height={OPEN_PLAY_PLAYERS.height}
              sizes="(max-width: 620px) 80vw, 380px"
              style={{ width: "100%", maxWidth: "380px", height: "auto", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", display: "block", margin: "2rem auto 0" }}
            />
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
              <a href="/studio" className="btn-primary">See the Studio</a>
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">Get Directions</a>
            </div>
          </div>
        </section>

        {/* GROUPS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Traveling Together?</p>
            <h2 className="section-title">Visiting With a <span className="accent-pink">Group</span></h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "1.5rem 0 1rem" }}>
              Friends traveling together can book seats at the same Open Play
              session while seats remain. If your group would rather have something of its own,
              we plan private experiences too:
            </p>
            <ul style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.9, margin: "0 0 1.5rem", paddingLeft: "1.25rem", listStyle: "disc" }}>
              <li>
                <a href="/private-mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>Private mahjong lessons</a>{" "}
                at the studio, for one player or a small group
              </li>
              <li>
                <a href="/mahjong-parties-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>Mahjong parties</a>{" "}
                for a celebration or a trip with friends
              </li>
              <li>
                <a href="/mahjong-corporate-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>Corporate mahjong events</a>{" "}
                for a business, conference or convention group
              </li>
              <li>
                <a href="/incentive-group-activities-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>Incentive group activities</a>{" "}
                for a company reward trip, set up at the group&rsquo;s hotel
              </li>
            </ul>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "2rem" }}>
              Tell us your dates and group size and we will plan it with you.
              Private and corporate events are priced on request.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/contact?source=visitors" className="btn-outline">Plan Something Private</a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <p className="section-label">Questions?</p>
            <h2 className="section-title">FAQ: <span className="accent-pink">Playing While You Visit</span></h2>
            <div style={{ marginTop: "2rem" }}>
              {faqs.map((faq) => (
                <div key={faq.q} style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 0" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, color: "var(--white)", marginBottom: "0.6rem" }}>{faq.q}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container">
            <h2 className="section-title">Save Your Seat at the <span className="accent-green">Table</span></h2>
            <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.75 }}>
              Find an Open Play session that fits your trip, book your seat, and
              come play American Mahjong with us in Las Vegas.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/schedule" className="btn-primary">See Open Play Dates</a>
              <a href="/studio" className="btn-outline">Visit the Studio</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
