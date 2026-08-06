import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import { getScheduleEvents } from "@/lib/schedule";

export const metadata: Metadata = {
  title: "Schedule & Booking",
  description:
    "See the upcoming Las Vegas Mahjong schedule of classes, open play, and special events, and book your spot online.",
  alternates: { canonical: "https://www.lasvegasmahj.com/schedule" },
  robots: { index: false, follow: false },
  openGraph: {
    ...ogBase,
    title: "Schedule & Booking | Las Vegas Mahjong",
    description:
      "Upcoming classes, open play, and special events at the Las Vegas Mahjong studio. Reserve your seat online.",
    url: "https://www.lasvegasmahj.com/schedule",
  },
};

const bookOptions = [
  {
    title: "Classes",
    accent: "accent-pink" as const,
    body: "Small-group lessons that build from your very first tiles to confident play. The Mahj 101 and 102 package is where beginners start, and Mahj 103 Strategies and Play is where you put it all together at the table.",
  },
  {
    title: "Open Play",
    accent: "accent-green" as const,
    body: "Come play in a friendly, no-pressure room. Guided Beginner sessions for brand-new players, and Social, Beginner, and Advanced open play for everyone building their game. Two hours at the table with help when you want it.",
  },
  {
    title: "Private & Parties",
    accent: "accent-pink" as const,
    body: "Private lessons, birthday celebrations, and group parties, hosted for your people. Available upon request, contact for pricing and we will build the event around your group.",
  },
];

const toneColor = (tone: string) => (tone === "green" ? "var(--green)" : tone === "gold" ? "var(--gold)" : "var(--pink)");

export default async function Schedule() {
  const events = await getScheduleEvents();
  const months = events.reduce<Record<string, typeof events>>((acc, e) => {
    (acc[e.monthLabel] ||= []).push(e);
    return acc;
  }, {});

  return (
    <>
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        {/* HERO */}
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container">
            <p className="section-label">Book with Las Vegas Mahjong</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              Class &amp; Open Play <span className="accent-pink">Schedule</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", maxWidth: "640px", margin: "0 auto 2rem", lineHeight: 1.75 }}>
              See what is coming up at the studio and reserve your seat in a few taps. Classes, open play, and special events, all in one place. Spots are limited, with an automatic waitlist when a session fills.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#calendar" className="btn-primary">See the Calendar</a>
              <a href="/mahjong-lessons-las-vegas" className="btn-outline">About the Lessons</a>
            </div>
          </div>
        </section>

        {/* CALENDAR */}
        <section id="calendar" className="tile-bg" style={{ padding: "5rem 2rem", background: "var(--navy)" }}>
          <div className="container">
            <p className="section-label">Upcoming</p>
            <h2 className="section-title">This Week &amp; <span className="accent-green">This Month</span></h2>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "1rem auto 2.5rem", lineHeight: 1.75, textAlign: "center" }}>
              Pick a session below to see the details and book. Each listing shows the class or open play, the time, and which studio it is in.
            </p>

            {events.length === 0 ? (
              <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "2.5rem 1.5rem" }}>
                <p style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                  New sessions are being added right now. Check back soon, or visit our booking page to see the latest openings.
                </p>
                <a href="https://bookwhen.com/lasvegasmahjong" target="_blank" rel="noopener" className="btn-primary">View Booking Page</a>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "2rem", maxWidth: "760px", margin: "0 auto" }}>
                {Object.entries(months).map(([month, list]) => (
                  <div key={month}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "1rem" }}>{month}</h3>
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {list.map((e) => {
                        const c = toneColor(e.tone);
                        return (
                          <div key={e.uid} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "1rem 1.25rem" }}>
                            <div style={{ flex: "none", width: "58px", textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.12)", paddingRight: "1rem" }}>
                              <div style={{ color: "var(--pink)", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.06em" }}>{e.day}</div>
                              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1, color: "#fff" }}>{e.num}</div>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff" }}>{e.title}</div>
                              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", marginTop: "0.15rem" }}>
                                {e.time}
                                <span style={{ display: "inline-block", fontSize: "0.68rem", fontWeight: 700, padding: "1px 8px", borderRadius: "999px", marginLeft: "8px", color: c, border: "1px solid " + c }}>{e.room}</span>
                              </div>
                              {e.description && (
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.6, marginTop: "0.6rem", marginBottom: 0 }}>{e.description}</p>
                              )}
                            </div>
                            <div style={{ flex: "none", textAlign: "right" }}>
                              <a href={e.url} target="_blank" rel="noopener" className="btn-primary" style={{ padding: "0.5rem 1.1rem", fontSize: "0.85rem" }}>Book</a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textAlign: "center", marginTop: "2rem" }}>
              Times shown in Pacific. Pay by card, Venmo, Zelle, or cash at checkout. Spots are limited, with an automatic waitlist when a session fills.
            </p>
          </div>
        </section>

        {/* WHAT YOU CAN BOOK */}
        <section style={{ padding: "5rem 2rem", background: "var(--navy-dark)" }}>
          <div className="container">
            <p className="section-label">What You Can Book</p>
            <h2 className="section-title">Ways to <span className="accent-pink">Play</span></h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2.5rem" }}>
              {bookOptions.map(opt => (
                <div key={opt.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "2rem" }}>
                  <h3 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <span className={opt.accent}>{opt.title}</span>
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.75 }}>{opt.body}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "3rem" }}>
              <a href="/mahjong-lessons-las-vegas" className="btn-primary">About the Lessons</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
