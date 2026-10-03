import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import { getLeagues } from "@/lib/schedule";

const PAGE_URL = "https://www.lasvegasmahj.com/mahjong-leagues-las-vegas";

export const metadata: Metadata = {
  title: "Mahjong Leagues in Las Vegas",
  description:
    "Join a mahjong league in Las Vegas. Play weekly games with the same group for a full season at our studio inside Lucky Hare. See open leagues and book.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    ...ogBase,
    title: "Mahjong Leagues in Las Vegas | Las Vegas Mahjong",
    description:
      "Weekly league play for a full season with the same group. See the leagues open for sign-up and book your seat.",
    url: PAGE_URL,
  },
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Mahjong Leagues in Las Vegas", item: PAGE_URL },
  ],
};

export default async function MahjongLeaguesLasVegas() {
  const leagues = await getLeagues();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Weekly Season Play</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Mahjong <span className="accent-pink">Leagues</span> in Las Vegas
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              Play a full season of weekly games with the same group of players. Pick the league that fits your week, book once, and your seat is held for every session.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#leagues" className="btn-primary">See the Leagues</a>
              <a href="/schedule" className="btn-outline">View the Full Schedule</a>
            </div>
          </div>
        </section>

        <section id="leagues" className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">This Season</p>
            <h2 className="section-title">Choose Your <span className="accent-green">League</span></h2>

            {leagues.length === 0 ? (
              <div style={{ marginTop: "2.5rem", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "2.5rem 1.5rem" }}>
                <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                  No league is listed here right now. New seasons go on the schedule as soon as they open, and everything open for booking is on our booking page.
                </p>
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="/schedule" className="btn-primary">See the Schedule</a>
                  <a href="https://bookwhen.com/lasvegasmahjong" target="_blank" rel="noopener" className="btn-outline">View Booking Page</a>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "1.5rem", marginTop: "2.5rem" }}>
                {leagues.map((e) => {
                  const details = e.sessions?.[0]?.description ?? "";
                  return (
                    <article key={e.uid} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "1.5rem 1.5rem 1.75rem" }}>
                      <h3 style={{ fontWeight: 700, fontSize: "1.3rem", color: "#fff", margin: 0 }}>{e.title}</h3>
                      <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.95rem", margin: "0.35rem 0 0" }}>{e.course!.dayTime}</p>
                      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.95rem", margin: "0.5rem 0 0" }}>{e.course!.span}</p>
                      {e.course!.price && (
                        <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", margin: "0.15rem 0 0" }}>{e.course!.price}</p>
                      )}
                      {details && (
                        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.92rem", lineHeight: 1.7, margin: "1rem 0 0" }}>{details}</p>
                      )}
                      {e.course!.salesClosed ? (
                        <p style={{ color: "var(--gold)", fontWeight: 700, fontSize: "0.95rem", margin: "1.25rem 0 0" }}>
                          {e.course!.started ? "Season in progress. Sign-ups for this season are closed." : "Sign-ups for this season are closed."}
                        </p>
                      ) : (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener"
                          className="btn-primary"
                          aria-label={`Book This League: ${e.title}, on Bookwhen (opens in a new tab)`}
                          style={{ display: "inline-block", marginTop: "1.25rem" }}
                        >
                          Book This League
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textAlign: "center", marginTop: "2rem" }}>
              Times shown in Pacific. One booking covers every session in the season.
            </p>
          </div>
        </section>

        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)", textAlign: "center" }}>
          <div className="container">
            <h2 className="section-title">Still <span className="accent-pink">Learning?</span></h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "520px", margin: "1rem auto 2rem", lineHeight: 1.7 }}>
              Lessons get you ready for a full game, and open play is the easiest way to practice before a season starts.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/mahjong-lessons-las-vegas" className="btn-primary">Take a Lesson</a>
              <a href="/mahjong-open-play-las-vegas" className="btn-outline">Try Open Play</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
