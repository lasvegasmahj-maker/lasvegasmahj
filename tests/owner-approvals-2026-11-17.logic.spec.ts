import { test, expect } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { studioOgImage } from "../lib/og";
import { STUDIO_MEDIA } from "../lib/studio-media";
import { LESSON_TABLE, OPEN_PLAY_ROOM, STUDIO_PHOTOS, TABLES_SET_FOR_PLAY } from "../lib/studio-photos";

// The owner's photo decisions of 2026-11-16 and 2026-11-17, approved from a local preview: the
// leagues page photo and its share image, and the picture on one FOX5 card. One test per decision.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const sha256 = (rel: string) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");

const LEAGUES = "app/mahjong-leagues-las-vegas/page.tsx";
const APPROVED_ALT =
  "Three mahjong tables set for play with mats, tiles, racks and drinks, surrounded by navy velvet chairs";

test("the leagues page shows the approved studio photo under its buttons, whole and loaded first", () => {
  const page = read(LEAGUES);
  const buttons = page.indexOf('View the Full Schedule</a>');
  const photo = page.indexOf("src={TABLES_SET_FOR_PLAY.src}");
  const list = page.indexOf('id="leagues"');
  expect(buttons).toBeGreaterThan(-1);
  expect(photo, "the photo sits under the two buttons").toBeGreaterThan(buttons);
  expect(photo, "and above the league list").toBeLessThan(list);
  const image = page.slice(page.lastIndexOf("<Image", photo), page.indexOf("/>", photo));
  expect(image).toContain("alt={TABLES_SET_FOR_PLAY.alt}");
  expect(image).toContain('fetchPriority="high"');
  expect(image).toMatch(/\bpriority\b/);
  // The frame has the photo's own shape, so nothing is cropped.
  expect(TABLES_SET_FOR_PLAY.width / TABLES_SET_FOR_PLAY.height).toBe(4 / 3);
  expect(page.slice(page.lastIndexOf("<div", photo), photo)).toContain('aspectRatio: "4 / 3"');
});

test("the leagues photo's description is the approved wording: no room, no league, no event", () => {
  expect(TABLES_SET_FOR_PLAY.alt).toBe(APPROVED_ALT);
  expect(TABLES_SET_FOR_PLAY.room, "the owner asked that the room not be named").toBeUndefined();
  for (const word of ["league", "lucky", "wishbone", "sevens", "event", "night"]) {
    expect(TABLES_SET_FOR_PLAY.alt.toLowerCase()).not.toContain(word);
  }
  // No caption: the only words the photo adds are its description.
  const page = read(LEAGUES);
  const block = page.slice(page.indexOf("src={TABLES_SET_FOR_PLAY.src}"), page.indexOf('id="leagues"'));
  expect(block).not.toContain("<p");
  expect(block).not.toContain("<figcaption");
});

test("the leagues photo is the exact file the owner approved, and it is in the verified list", () => {
  expect(sha256("public/studio-tables-set-for-play.jpg")).toBe("a3c7587f155bfff91a7f11915f1f737ee993bf136ec8a6c932538fffc3f5b11a");
  expect(STUDIO_PHOTOS).toContain(TABLES_SET_FOR_PLAY);
});

test("the leagues page's share image is the same photo, so the page and its link preview match", () => {
  expect(read(LEAGUES)).toContain("images: [studioOgImage(TABLES_SET_FOR_PLAY)]");
  const og = studioOgImage(TABLES_SET_FOR_PLAY);
  expect(og.url).toBe("https://www.lasvegasmahj.com/studio-tables-set-for-play.jpg");
  expect(og.alt).toBe(APPROVED_ALT);
});

test("the FOX5 classes card shows the lesson table photo and keeps its link, headline and date", () => {
  const card = STUDIO_MEDIA.find((m) => m.headline === "American Mahjong Classes NOW being taught at Las Vegas Mahjong");
  expect(card).toBeDefined();
  expect(card!.image).toBe(LESSON_TABLE);
  expect(card!.url).toBe("https://www.fox5vegas.com/video/2026/09/02/american-mahjong-classes-now-being-taught-las-vegas-mahjong/");
  expect(card!.publishedIso).toBe("2026-09-02");
  expect(card!.outlet).toBe("FOX5 Las Vegas");
});

test("the other FOX5 card is unchanged", () => {
  const card = STUDIO_MEDIA.find((m) => m.headline === "LEARN & PLAY American Mahjong at NEW business Las Vegas Mahjong on Sahara");
  expect(card).toBeDefined();
  expect(card!.image).toBe(OPEN_PLAY_ROOM);
  expect(card!.url).toBe("https://www.fox5vegas.com/video/2026/09/02/learn-play-american-mahjong-new-business-las-vegas-mahjong-sahara/");
  expect(STUDIO_MEDIA).toHaveLength(2);
});

test("every studio photo file in public/ is one the owner identified", () => {
  const listed = new Set(STUDIO_PHOTOS.map((p) => p.src.slice(1)));
  const files = fs.readdirSync(path.join(ROOT, "public")).filter((f) => /^studio-.*\.(jpe?g|png|webp|avif)$/i.test(f));
  for (const file of files) expect(listed, `public/${file} is not in lib/studio-photos.ts`).toContain(file);
  expect(files.length).toBe(STUDIO_PHOTOS.length);
});

test("the leagues page's sitemap date is the day its photo was approved", () => {
  const sitemap = read("app/sitemap.ts");
  const at = sitemap.indexOf('url: "https://www.lasvegasmahj.com/mahjong-leagues-las-vegas"');
  expect(at).toBeGreaterThan(-1);
  expect(sitemap.slice(at, sitemap.indexOf("}", at))).toContain('lastModified: new Date("2026-11-17")');
});
