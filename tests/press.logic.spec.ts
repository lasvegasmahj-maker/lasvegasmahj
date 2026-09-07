import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { STUDIO_MEDIA } from "../lib/studio-media";
import { STUDIO_PHOTOS } from "../lib/studio-photos";

// News coverage is credibility only if it stays accurate and stays coverage. These tests
// hold three lines: the links are the station's own, the wording never becomes an
// endorsement, and no FOX5 footage or artwork is copied onto our own servers.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const readCode = (rel: string) =>
  read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

/** Constant name to src, read out of the manifest so the two cannot drift apart. */
const MANIFEST_NAMES: Record<string, string> = Object.fromEntries(
  [...read("lib/studio-photos.ts").matchAll(/export const (\w+): StudioPhoto = \{\s*\n\s*src: "([^"]+)"/g)].map(
    (m) => [m[1], m[2]],
  ),
);

const SURFACES = [
  "components/press-cards.tsx",
  "components/press-section.tsx",
  "app/studio/page.tsx",
  "app/about/page.tsx",
  "lib/studio-media.ts",
];

test.describe("the coverage is real and points at the station", () => {
  test("both segments are present, on fox5vegas.com over https", () => {
    expect(STUDIO_MEDIA).toHaveLength(2);
    for (const item of STUDIO_MEDIA) {
      expect(item.url).toMatch(/^https:\/\/www\.fox5vegas\.com\/video\//);
      expect(item.outlet).toBe("FOX5 Las Vegas");
      expect(item.publishedIso).toBe("2026-09-02");
      expect(item.publishedLabel).toBe("September 2, 2026");
      expect(item.headline.trim().length).toBeGreaterThan(20);
    }
    expect(new Set(STUDIO_MEDIA.map((m) => m.url)).size, "the two cards must be two stories").toBe(2);
  });

  test("each headline is the one the station published for that exact URL", () => {
    // Checked against the live <title> and og:title on 2026-09-07.
    const OFFICIAL: Record<string, string> = {
      "https://www.fox5vegas.com/video/2026/09/02/learn-play-american-mahjong-new-business-las-vegas-mahjong-sahara/":
        "LEARN & PLAY American Mahjong at NEW business Las Vegas Mahjong on Sahara",
      "https://www.fox5vegas.com/video/2026/09/02/american-mahjong-classes-now-being-taught-las-vegas-mahjong/":
        "American Mahjong Classes NOW being taught at Las Vegas Mahjong",
    };
    for (const item of STUDIO_MEDIA) {
      expect(OFFICIAL[item.url], `${item.url} is not one of the verified stories`).toBeTruthy();
      expect(item.headline, "headline does not match the story it links to").toBe(OFFICIAL[item.url]);
    }
  });
});

test.describe("coverage, not endorsement", () => {
  test("no shipped surface claims FOX5 recommends or endorses the business", () => {
    for (const file of SURFACES) {
      const src = readCode(file).toLowerCase();
      for (const phrase of [
        "fox5 recommends",
        "recommended by fox5",
        "endorsed",
        "endorsement",
        "fox5 loves",
        "voted best",
        "award-winning",
        "as trusted by",
      ]) {
        expect(src, `${file} implies endorsement: ${phrase}`).not.toContain(phrase);
      }
    }
  });

  test("no Review or rating schema is invented from press coverage", () => {
    for (const file of SURFACES) {
      const src = readCode(file);
      expect(src, `${file} emits review schema`).not.toContain("AggregateRating");
      expect(src, `${file} emits review schema`).not.toContain('"@type": "Review"');
      expect(src, `${file} emits a rating`).not.toMatch(/ratingValue/);
    }
  });
});

test.describe("nothing of the station's is copied here", () => {
  test("no FOX5 media, artwork or logo is committed to public/", () => {
    const files = fs.readdirSync(path.join(ROOT, "public"));
    for (const f of files) {
      expect(f.toLowerCase(), `public/${f} looks like station artwork`).not.toMatch(/fox|kvvu|gray/);
      expect(f.toLowerCase(), "no video is hosted here").not.toMatch(/\.(mp4|mov|m4v|webm)$/);
    }
  });

  test("no station CDN or stream URL is referenced", () => {
    for (const file of SURFACES) {
      const src = read(file);
      for (const host of ["gtv-cdn.com", "cloudfront.net", "anvato", "gray-kvvu"]) {
        expect(src, `${file} references station infrastructure: ${host}`).not.toContain(host);
      }
      // Linked, never framed: FOX5 publishes no embed mechanism for these videos.
      expect(readCode(file), `${file} frames a third party player`).not.toMatch(/<iframe/);
    }
  });

  test("no FOX5 card reuses a photograph shown elsewhere on the same page", () => {
    // The whole point of this refinement. The press art used to repeat the photo already
    // sitting higher up the homepage and /studio.
    const cardArt = STUDIO_MEDIA.map((m) => m.image.src);
    const SURFACE_FILES: Record<string, string[]> = {
      homepage: ["components/studio-banner.tsx"],
      "/studio": ["app/studio/page.tsx"],
    };
    for (const [page, files] of Object.entries(SURFACE_FILES)) {
      const src = files.map(readCode).join("\n");
      for (const photo of STUDIO_PHOTOS) {
        if (!cardArt.includes(photo.src)) continue;
        const constName = Object.entries({ ...MANIFEST_NAMES }).find(([, v]) => v === photo.src)?.[0];
        if (!constName) continue;
        expect(
          new RegExp(`\\b${constName}\\b`).test(src),
          `${page} shows ${photo.src} in its own content and again as FOX5 card art`,
        ).toBe(false);
      }
    }
  });

  test("the two cards use two different photographs", () => {
    expect(new Set(STUDIO_MEDIA.map((m) => m.image.src)).size).toBe(STUDIO_MEDIA.length);
  });

  test("the cards say whose photographs they are", () => {
    const src = readCode("components/press-cards.tsx");
    expect(src, "a viewer could read our photo as a still from the segment").toContain(
      "Photographs by Las Vegas Mahjong",
    );
  });

  test("card artwork is our own verified studio photography", () => {
    const manifest = new Set(STUDIO_PHOTOS.map((p) => p.src));
    for (const item of STUDIO_MEDIA) {
      expect(manifest, `card art is outside our own manifest: ${item.image.src}`).toContain(item.image.src);
    }
    expect(
      new Set(STUDIO_MEDIA.map((m) => m.image.src)).size,
      "the two cards should not use the same picture",
    ).toBe(2);
  });
});

test.describe("placement", () => {
  test("the homepage runs hero, then the studio, then the press", () => {
    const home = read("components/home-client.tsx");
    const hero = home.indexOf("<Hero />");
    const studio = home.indexOf("<StudioBanner />");
    const press = home.indexOf("<PressSection />");
    const why = home.indexOf("<WhySection />");
    expect(hero).toBeGreaterThan(-1);
    expect(studio, "studio sits under the hero").toBeGreaterThan(hero);
    expect(press, "press sits under the studio").toBeGreaterThan(studio);
    expect(press, "press sits above the remaining brand content").toBeLessThan(why);
  });

  test("every card opens the station in a new tab, safely", () => {
    const src = read("components/press-cards.tsx");
    expect(src).toContain('target="_blank"');
    expect(src).toContain('rel="noopener noreferrer"');
  });

  test("the About page carries one small mention, not a second media section", () => {
    const about = read("app/about/page.tsx");
    expect(about).toContain("Featured on");
    expect(about).toContain('href="/studio#press"');
    expect(about, "About should not import the cards").not.toContain("PressCards");
    expect((about.match(/FOX5/g) ?? []).length, "one mention is enough").toBeLessThanOrEqual(2);
  });
});
