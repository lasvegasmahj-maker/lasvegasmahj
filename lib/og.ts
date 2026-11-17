import { SHAUNA_NEON, type StudioPhoto } from "./studio-photos";

export const ogBase = {
  siteName: "Las Vegas Mahjong",
  locale: "en_US",
  type: "website",
} as const;

export const studioOgImage = (photo: StudioPhoto) => ({
  url: `https://www.lasvegasmahj.com${photo.src}`,
  width: photo.width,
  height: photo.height,
  alt: photo.alt,
  type: "image/jpeg",
});

// A page-level openGraph object replaces the root one. A bare image URL there drops the
// size and alt text the root layout publishes for the same file, so share cards lose their
// description and platforms must download the image to learn its shape. These carry the
// same values as app/layout.tsx; a test keeps the two in step.
export const OG_HERO = {
  url: "https://www.lasvegasmahj.com/hero-bg.jpg",
  width: 1599,
  height: 2000,
  alt: "Mahjong tiles at a Las Vegas Mahjong event",
  type: "image/jpeg",
} as const;

export const OG_SHAUNA = studioOgImage(SHAUNA_NEON);
