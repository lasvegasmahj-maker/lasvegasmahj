// Off-site public events hosted with a partner venue. These do not come from
// Bookwhen; they are booked through the partner (e.g. Honey Salt via OpenTable)
// and are merged into the /schedule calendar so customers see one list.
export interface PartnerEventInput {
  title: string;
  year: number;
  month: number;
  day: number;
  startHour: number;
  startMinute: number;
  endHour?: number;
  endMinute?: number;
  venue: string;
  url: string;
  bookLabel: string;
  description: string;
}

export const PARTNER_EVENTS: PartnerEventInput[] = [
  {
    title: "Mahjong at Honey Salt",
    year: 2026,
    month: 8,
    day: 31,
    startHour: 17,
    startMinute: 30,
    endHour: 19,
    endMinute: 30,
    venue: "Honey Salt",
    url: "https://www.opentable.com/honey-salt?corrid=86267a6b-ed2b-427a-ba16-85ce85009fc8&avt=eyJ2IjozLCJtIjowLCJwIjowLCJzIjoxLCJuIjowfQ&p=2&sd=2026-08-31T23%253A00%253A00&utm_source=ig&utm_medium=social&utm_content=link_in_bio&utm_id=97760_v0_s00_e0_tv3",
    bookLabel: "Reserve at Honey Salt",
    description:
      "A relaxed evening of American Mahjong hosted by Las Vegas Mahjong at Honey Salt. All levels welcome. Reserve your table through Honey Salt.",
  },
];
