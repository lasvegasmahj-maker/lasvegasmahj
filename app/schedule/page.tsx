import type { Metadata } from "next";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

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

export default function Schedule() {
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
              See what is coming up at the studio and reserve your seat in a few taps. Classes, open play, and special events, all in one place. Spots are limited to 8 per session, with an automatic waitlist when a session fills.
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
              Pick a date below to see the details and book. Each listing shows the class or open play, the time, and how many seats are left.
            </p>

            {/*
              BOOKWHEN EMBED: once the Bookwhen account and events are live, replace the
              placeholder block below with the embed, for example:

              <iframe
                title="Las Vegas Mahjong schedule"
                src="https://bookwhen.com/lasvegasmahj/embed"
                style={{ width: "100%", minHeight: "820px", border: 0, borderRadius: "8px" }}
                loading="lazy"
              />
            */}
            <div
              style={{
                border: "2px dashed rgba(233,30,140,0.4)",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.03)",
                padding: "4rem 2rem",
                textAlign: "center",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <div style={{ fontFamily: "var(--font-heading)", fontSize: "1.6rem", color: "var(--pink)", marginBottom: "0.75rem" }}>
                Live booking calendar
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
                The weekly and monthly schedule loads here once online booking is connected. You will be able to see every session and reserve a seat right on this page.
              </p>
            </div>
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
