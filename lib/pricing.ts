/**
 * Social Open Play prices, set by the owner on 2026-09-29. This is the only place they are
 * written: pages and structured data read them from here, so a price change is one edit.
 * Private lessons, parties and corporate events stay "contact for pricing" and never appear here.
 */
export const OPEN_PLAY_PRICES = {
  session: 20,
  fivePack: 85,
} as const;

export const usd = (amount: number) => `$${amount}`;

export const OPEN_PLAY_PRICE_LINE = `${usd(OPEN_PLAY_PRICES.session)} per session, or ${usd(OPEN_PLAY_PRICES.fivePack)} for a 5-pack`;
