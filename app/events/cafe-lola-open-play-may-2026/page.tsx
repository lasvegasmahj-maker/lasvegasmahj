import type { Metadata } from "next";
import EventPage, { buildEventMetadata, type EventPageProps } from "@/components/event-page";

const EVENT = {
  name: "Cafe Lola Open Play Mahjong Party",
  startDate: "2026-05-31T18:00:00-07:00",
  endDate: "2026-05-31T20:00:00-07:00",
  venueName: "Cafe Lola",
  venueCity: "Las Vegas",
  venueState: "NV",
  description:
    "Join Las Vegas Mahjong for a fun open play mahjong party at Cafe Lola! All skill levels welcome. Come solo, bring a friend, and play a few hands with the Valley's best mahjong community.",
  canonicalUrl:
    "https://lasvegasmahj.com/events/cafe-lola-open-play-may-2026",
  ticketUrl: "https://ilovecafelola.com",
  price: "See Eventbrite for tickets",
  tag: "open-play" as EventPageProps["tag"],
  imageUrl: "https://lasvegasmahj.com/hero-bg.jpg",
  body: [
    "Whether you've been playing for decades or you learned last month, this is the event for you. Open play means no pressure: just show up, pull up a chair, and start playing.",
    "We'll have multiple tables running all night at Cafe Lola, one of Las Vegas's most welcoming local spots. Certified Oh My Mahjong instructor Shauna will be on hand the whole time, so if you have a rules question, she's got you.",
    "This is a great opportunity to meet other Las Vegas mahjong players, practice hands you've been working on, or just enjoy a fun Saturday night out. Skill levels range from complete beginner to seasoned player, so there's always someone good to play with.",
    "Tickets are limited. Cafe Lola fills up fast. Grab yours early and we'll see you at the table on May 31.",
  ],
  whatToKnow: [
    "All skill levels are welcome: complete beginners through experienced players.",
    "Tiles, racks, and NMJL cards provided. Bring your own card if you have one.",
    "Come solo or bring friends. Solo players will be paired at a table.",
    "Arrive a few minutes early to get settled and meet your tablemates.",
    "Tickets must be purchased in advance. No walk-ins guaranteed.",
    "Hosted by Shauna, certified Oh My Mahjong instructor.",
  ],
  recapBody: [],
  testimonials: [],
  relatedEventSlugs: [],
};

export const metadata: Metadata = {
  ...buildEventMetadata({
    name: EVENT.name,
    description: EVENT.description,
    canonicalUrl: EVENT.canonicalUrl,
    startDate: EVENT.startDate,
    imageUrl: EVENT.imageUrl,
  }),
  // Hidden until the next live event: keep the page but out of search.
  robots: { index: false, follow: false },
};

export default function CafeLolaOpenPlayMay2026() {
  return <EventPage {...EVENT} />;
}
