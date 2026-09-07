import { OPEN_PLAY_ROOM, PLAYERS_AT_TABLE, type StudioPhoto } from "./studio-photos";

/**
 * Local news coverage of the Las Vegas Mahjong Studio.
 *
 * Every entry links to the station's own page. FOX5 exposes no oEmbed endpoint, no embed
 * iframe and no documented embed mechanism for these videos (its /oembed path returns 404
 * and the only iframe on the page is Google Tag Manager), so the segments are linked, never
 * re-hosted. The card artwork is our own verified studio photography rather than the
 * station's social image, which is a signed Gray CDN URL and not ours to reuse.
 *
 * This is news coverage, not an endorsement. Nothing here says FOX5 recommends the business,
 * and no Review or AggregateRating schema is emitted for it.
 */
export interface StudioMediaAppearance {
  /** The station or programme name, spelled the way the outlet brands itself. */
  outlet: string;
  /** The headline exactly as the station published it. */
  headline: string;
  /** Air date, as YYYY-MM-DD. */
  publishedIso: string;
  /** The date as a reader sees it. */
  publishedLabel: string;
  /** The station's own public page for the segment. Always https, never re-hosted. */
  url: string;
  /** One of our own verified studio photographs, used as card artwork. */
  image: StudioPhoto;
}

export const STUDIO_MEDIA: StudioMediaAppearance[] = [
  {
    outlet: "FOX5 Las Vegas",
    headline:
      "LEARN & PLAY American Mahjong at NEW business Las Vegas Mahjong on Sahara",
    publishedIso: "2026-09-02",
    publishedLabel: "September 2, 2026",
    url: "https://www.fox5vegas.com/video/2026/09/02/learn-play-american-mahjong-new-business-las-vegas-mahjong-sahara/",
    image: OPEN_PLAY_ROOM,
  },
  {
    outlet: "FOX5 Las Vegas",
    headline: "American Mahjong Classes NOW being taught at Las Vegas Mahjong",
    publishedIso: "2026-09-02",
    publishedLabel: "September 2, 2026",
    url: "https://www.fox5vegas.com/video/2026/09/02/american-mahjong-classes-now-being-taught-las-vegas-mahjong/",
    image: PLAYERS_AT_TABLE,
  },
];
