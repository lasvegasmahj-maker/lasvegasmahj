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
    "https://www.lasvegasmahj.com/events/cafe-lola-open-play-may-2026",
  ticketUrl: "https://ilovecafelola.com",
  price: "See Eventbrite for tickets",
  tag: "open-play" as EventPageProps["tag"],
  imageUrl: "https://www.lasvegasmahj.com/hero-bg.jpg",
  body: [
    "Whether you've been playing for decades or you learned last month, this is the event for you. Open play means no pressure: just show up, pull up a chair, and start playing.",
    "We had multiple tables running all night at Cafe Lola, one of Las Vegas's most welcoming local spots. Certified Oh My Mahjong instructor Shauna was on hand the whole time for rules questions.",
    "Players of all skill levels joined, from complete beginners to seasoned veterans, which made for a great mix at every table.",
  ],
  whatToKnow: [
    "All skill levels are welcome: complete beginners through experienced players.",
    "Tiles, racks, and NMJL cards provided. Bring your own card if you have one.",
    "Come solo or bring friends. Solo players will be paired at a table.",
    "Arrive a few minutes early to get settled and meet your tablemates.",
    "Tickets must be purchased in advance. No walk-ins guaranteed.",
    "Hosted by Shauna, certified Oh My Mahjong instructor.",
  ],
  recapBody: [
    "This event has passed. Check the events page for upcoming open play sessions.",
  ],
  testimonials: [],
  relatedEventSlugs: [],
  eventStatus: "https://schema.org/EventPast",
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
