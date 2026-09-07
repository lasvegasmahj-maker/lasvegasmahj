import type { Metadata } from "next";
import Image from "next/image";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import { buildBreadcrumbSchema, STUDIO_PLACE } from "@/lib/schema";
import { STUDIO_MEDIA } from "@/lib/studio-media";

const MAP_URL = "https://maps.app.goo.gl/dGeHMfMDjuXjDFPs5";

export const metadata: Metadata = {
  title: "Mahjong Studio in Las Vegas",
  description:
    "Our mahjong studio is now open inside Lucky Hare at 8687 W. Sahara Ave. Two rooms: Lucky Wishbone for classes and events, Lucky Sevens for open play.",
  alternates: { canonical: "https://www.lasvegasmahj.com/studio" },
  robots: { index: true, follow: true },
  openGraph: {
    ...ogBase,
    title: "Our Mahjong Studio in Las Vegas | Las Vegas Mahjong",
    description:
      "Two rooms inside Lucky Hare on West Sahara. Lucky Wishbone for classes, leagues and special events, Lucky Sevens for open play. Come sit with us.",
    url: "https://www.lasvegasmahj.com/studio",
    images: ["https://www.lasvegasmahj.com/lvm-openplay-room.jpg"],
  },
};

/**
 * One entity, not a new one. The Place keeps the @id the schedule already emits, so the
 * studio described here and the studio attached to every booked session are the same node,
 * and the LocalBusiness stub carries only the relation: no name, address or hours are
 * restated, so nothing on this page can contradict the sitewide business entity in
 * app/layout.tsx. No number to call and no hours property, because neither is established.
 */
const studioSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      ...STUDIO_PLACE,
      url: "https://www.lasvegasmahj.com/studio",
      hasMap: MAP_URL,
      photo: [
        "https://www.lasvegasmahj.com/lvm-openplay-room.jpg",
        "https://www.lasvegasmahj.com/lvm-openplay-social.jpg",
      ],
      containsPlace: [
        {
          "@type": "Place",
          "@id": "https://www.lasvegasmahj.com/studio#lucky-wishbone",
          name: "Lucky Wishbone",
          description:
            "The teaching room at the Las Vegas Mahjong studio, where classes, leagues and special events meet.",
        },
        {
          "@type": "Place",
          "@id": "https://www.lasvegasmahj.com/studio#lucky-sevens",
          name: "Lucky Sevens",
          description:
            "The open play room at the Las Vegas Mahjong studio, for social American Mahjong at every level.",
        },
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.lasvegasmahj.com/#business",
      name: "Las Vegas Mahjong",
      url: "https://www.lasvegasmahj.com",
      location: { "@id": "https://www.lasvegasmahj.com/#studio" },
    },
  ],
};

const breadcrumbSchema = buildBreadcrumbSchema([
  { name: "Studio", url: "https://www.lasvegasmahj.com/studio" },
]);

const experience = [
  {
    title: "One address, always",
    body: "Everything at the studio happens in the same place, inside Lucky Hare at 8687 W. Sahara Ave., Suite 200, Las Vegas, NV 89117.",
  },
  {
    title: "Two rooms, two moods",
    body: "Lucky Wishbone holds the classes, the leagues and the special events. Lucky Sevens holds open play. Learning and playing each get their own room.",
  },
  {
    title: "Every level is welcome",
    body: "Absolute beginners, players coming back after years away, and people who already know all the hands. There is something on the calendar for each of you, and none of it assumes you did homework first.",
  },
  {
    title: "The calendar is the way in",
    body: "We run on classes and events rather than drop-in hours, so the schedule is the place to look. Every session lists the date and the time, most of them name the room, and you book your seat online.",
  },
];

export default function Studio() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(studioSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", borderBottom: "1px solid rgba(57,230,57,0.2)" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "3rem", alignItems: "center" }}>
              <div>
                <span className="studio-open-badge">Now Open</span>
                <p className="section-label">Inside Lucky Hare &middot; West Sahara</p>
                <h1 className="section-title" style={{ fontSize: "clamp(2.3rem, 7vw, 4.4rem)", marginBottom: "1.5rem", textAlign: "left" }}>
                  Our Mahjong <span className="accent-green">Studio</span> in Las Vegas
                </h1>
                <p style={{ fontSize: "1.12rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.8, marginBottom: "2rem" }}>
                  Las Vegas Mahjong has a studio of its own, inside Lucky Hare at
                  8687 W. Sahara Ave., Suite 200. Two rooms, one community, and a
                  seat at the table for you whether you have played a thousand
                  games or never touched a tile.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <a href="/schedule" className="btn-primary">View the Schedule</a>
                  <a href="#visit" className="btn-outline">How to Visit</a>
                </div>
              </div>
              <Image
                src="/lvm-openplay-room.jpg"
                alt="Players at tables inside the Las Vegas Mahjong studio at Lucky Hare"
                width={1350}
                height={1800}
                priority
                sizes="(max-width: 711px) 100vw, (max-width: 1164px) 46vw, 526px"
                style={{ width: "100%", height: "auto", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", display: "block" }}
              />
            </div>
          </div>
        </section>

        {/* WHAT HAPPENS HERE */}
        <section className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">What Happens Here</p>
            <h2 className="section-title">Two Rooms, One <span className="accent-pink">Community</span></h2>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: "1.5rem 0 1rem" }}>
              There are two rooms here, and each one has its own personality. One
              is where you learn and where the group gathers. The other is where
              you sit down and play. Most people end up in both.
            </p>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
              Classes, open play, leagues and special events all run out of this
              studio, and everything that is currently scheduled sits on one
              calendar. Private lessons and private events are hosted here too,
              and for those I can also come to your home or venue across the
              Valley for an added fee.
            </p>
          </div>
        </section>

        {/* THE TWO ROOMS */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", borderTop: "1px solid rgba(233,30,140,0.15)" }}>
          <div className="container">
            <p className="section-label">The Rooms</p>
            <h2 className="section-title">Lucky Wishbone &amp; Lucky <span className="accent-green">Sevens</span></h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "2rem", marginTop: "2.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(233,30,140,0.25)", borderRadius: "10px", padding: "2rem" }}>
                <h3 className="section-title" style={{ fontSize: "1.6rem", marginBottom: "1rem", textAlign: "left" }}>
                  <span className="accent-pink">Lucky Wishbone</span>
                </h3>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1rem" }}>
                  Lucky Wishbone is the teaching room. Classes meet here, from
                  people who have never touched a tile to players who already know
                  the card and want to get sharper. Leagues run here, and so do
                  special events, so this is the room where the community comes
                  together.
                </p>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
                  If it is the classes that brought you here, everything about our{" "}
                  <a href="/mahjong-lessons-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>
                    mahjong lessons in Las Vegas
                  </a>{" "}
                  lives on its own page.
                </p>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(57,230,57,0.25)", borderRadius: "10px", padding: "2rem" }}>
                <h3 className="section-title" style={{ fontSize: "1.6rem", marginBottom: "1rem", textAlign: "left" }}>
                  <span className="accent-green">Lucky Sevens</span>
                </h3>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1rem" }}>
                  Lucky Sevens is the playing room. This is where Social Open Play
                  happens: you show up, sit down, and play. Nobody is keeping score
                  of how new you are. Come on your own or bring a friend, and
                  expect to leave knowing a few more names than when you walked in.
                </p>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.8, margin: 0 }}>
                  New to it? Here is how{" "}
                  <a href="/mahjong-open-play-las-vegas" style={{ color: "var(--green)", fontWeight: 600 }}>
                    open play
                  </a>{" "}
                  works.
                </p>
              </div>
            </div>

            <figure style={{ margin: "3rem auto 0", maxWidth: "820px" }}>
              <Image
                src="/lvm-openplay-social.jpg"
                alt="Shauna teaching a room of mahjong players at the Las Vegas Mahjong studio"
                width={1800}
                height={1350}
                sizes="(max-width: 900px) 100vw, 820px"
                style={{ width: "100%", height: "auto", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", display: "block" }}
              />
              <figcaption style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.85rem", textAlign: "center", marginTop: "0.85rem" }}>
                A session in progress at the studio.
              </figcaption>
            </figure>
          </div>
        </section>

        {/* STUDIO EXPERIENCE */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">What It Is Like</p>
            <h2 className="section-title">Friendship, Community, <span className="accent-pink">Fun</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginTop: "2.5rem" }}>
              {experience.map((item) => (
                <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "1.8rem" }}>
                  <h3 style={{ fontFamily: "var(--font-nav)", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AS SEEN ON LOCAL NEWS. Renders only when a verified, station-hosted segment
            exists in lib/studio-media.ts, so nothing about a broadcast ships on a guess. */}
        {STUDIO_MEDIA.length > 0 && (
          <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", borderTop: "1px solid rgba(255,215,0,0.2)" }}>
            <div className="container" style={{ maxWidth: "860px" }}>
              <p className="section-label">In the Local Press</p>
              <h2 className="section-title">The Studio on <span className="accent-green">Local News</span></h2>
              <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75, margin: "1rem 0 2.5rem", textAlign: "center" }}>
                Local coverage filmed at the studio. Each segment plays on the
                station&rsquo;s own site.
              </p>
              <div style={{ display: "grid", gap: "1.25rem" }}>
                {STUDIO_MEDIA.map((item) => (
                  <article key={item.url} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "1.5rem" }}>
                    <p style={{ fontFamily: "var(--font-nav)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.5rem" }}>
                      {item.outlet}
                    </p>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>{item.headline}</h3>
                    {item.summary && (
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "0.85rem" }}>{item.summary}</p>
                    )}
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: "inline-block", padding: "0.6rem 1.3rem", fontSize: "0.8rem" }}>
                      Watch on {item.outlet}
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* VISIT THE STUDIO */}
        <section id="visit" style={{ padding: "5rem 2rem", background: "var(--navy-dark)", borderTop: "1px solid rgba(57,230,57,0.15)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Visit the Studio</p>
            <h2 className="section-title">Where to <span className="accent-green">Find Us</span></h2>

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
              We run on classes and events rather than drop-in hours, so pick a
              session on the calendar and book it before you come. If you are not
              sure which one is right for you, email{" "}
              <a href="mailto:hello@lasvegasmahj.com" style={{ color: "var(--green)", fontWeight: 600 }}>
                hello@lasvegasmahj.com
              </a>{" "}
              and I will help you choose.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "2rem" }}>
              <a href="/schedule" className="btn-primary">View the Schedule</a>
              <a href={MAP_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">Get Directions</a>
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy)", textAlign: "center" }}>
          <div className="container">
            <h2 className="section-title">Come Sit <span className="accent-pink">With Us</span></h2>
            <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.75 }}>
              Book a class, join open play, or bring your own group. Whatever gets
              you through the door first, there is a seat at the table for you.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/schedule" className="btn-primary">See What Is On</a>
              {/* Deliberately untagged. The six ?source= slugs and their inquiry prefills are
                  the owner's, and she asked for the contact form left alone in this change,
                  so this falls back to the same General bucket the nav and footer use.
                  Adding a "studio" slug is a one line follow up if she wants the attribution. */}
              <a href="/contact" className="btn-outline">Plan Something Private</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
