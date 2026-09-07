/**
 * Local news and press appearances filmed at or about the Las Vegas Mahjong studio.
 *
 * This list is empty on purpose. The studio page renders its "As Seen On" section only when
 * there is at least one entry, so nothing about a broadcast ships until the owner supplies
 * the details for it. The only copy of the segment currently on hand is a phone recording of
 * a television screen, which is the station's footage rather than ours, so it is neither
 * hosted here nor described here.
 *
 * To add an appearance, the owner needs to supply, per segment:
 *   outlet       the station or programme name, spelled the way the outlet brands itself
 *   headline     the segment title as the station published it
 *   publishedIso the air date, as YYYY-MM-DD
 *   url          the station's own page for the segment, which must load and be public
 *   embedUrl     only if the station publishes an embeddable player for it
 *
 * Rules that hold for every entry:
 *   - url must be the outlet's own domain. We link to the station, we do not re-host video.
 *   - No claim of affiliation, sponsorship or endorsement by the station.
 *   - Nothing is inferred. If a field is unknown, the segment waits rather than shipping.
 */
export interface StudioMediaAppearance {
  outlet: string;
  headline: string;
  publishedIso: string;
  url: string;
  embedUrl?: string;
  summary?: string;
}

export const STUDIO_MEDIA: StudioMediaAppearance[] = [];
