import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { OG_HERO, OG_SHAUNA, studioOgImage } from "../lib/og";
import * as studioPhotos from "../lib/studio-photos";

// Round 9, 2026-11-10: head and structured data only, nothing a visitor can see. Each test
// pins one defect found on main at 089a729 so it cannot come back.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const walk = (dir: string): string[] =>
  fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name === "page.tsx" ? [`${dir}/${e.name}`] : [],
  );

// Width and height from the JPEG's own start-of-frame header, so the numbers we publish are
// checked against the file and not against another copy of the same numbers.
const jpegSize = (rel: string) => {
  const b = fs.readFileSync(path.join(ROOT, "public", rel));
  let i = 2;
  while (i < b.length) {
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error(`no frame header in ${rel}`);
};

test("no page publishes a share image as a bare URL, which drops its size and alt text", () => {
  const pages = walk("app");
  expect(pages.length).toBeGreaterThan(30);
  for (const rel of pages) {
    expect(read(rel), rel).not.toMatch(/\bimages:\s*\[\s*["`]/);
  }
});

test("shared share-image sizes match the real files", () => {
  for (const img of [OG_HERO, OG_SHAUNA]) {
    const size = jpegSize(new URL(img.url).pathname);
    expect({ width: img.width, height: img.height }, img.url).toEqual(size);
    expect(img.alt.length, img.url).toBeGreaterThan(10);
  }
  for (const photo of [studioPhotos.WISHBONE_ROOM, studioPhotos.SEVENS_OPEN_PLAY, studioPhotos.PLAYERS_AT_TABLE]) {
    const og = studioOgImage(photo);
    expect({ width: og.width, height: og.height }, photo.src).toEqual(jpegSize(photo.src));
    expect(og.alt).toBe(photo.alt);
    expect(og.url).toBe(`https://www.lasvegasmahj.com${photo.src}`);
  }
});

test("shared share images say what the root layout says about the same files", () => {
  const layout = read("app/layout.tsx");
  for (const img of [OG_HERO, OG_SHAUNA]) {
    const at = layout.indexOf(`url: "${img.url}"`);
    expect(at, img.url).toBeGreaterThan(-1);
    const block = layout.slice(at, layout.indexOf("}", at));
    expect(block).toContain(`width: ${img.width}`);
    expect(block).toContain(`height: ${img.height}`);
    expect(block).toContain(`alt: "${img.alt}"`);
  }
});

const CORPORATE = [
  "mahjong-corporate-las-vegas",
  "corporate-team-building-las-vegas",
  "conference-activities-las-vegas",
  "convention-activities-las-vegas",
  "corporate-event-activities-las-vegas",
  "las-vegas-meeting-planner-activities",
  "trade-show-booth-activities-las-vegas",
  "incentive-group-activities-las-vegas",
];

const OTHER_SERVICE_PAGES = ["mahjong-parties-las-vegas", "private-mahjong-lessons-las-vegas", "mahjong-lessons-summerlin", "mahjong-lessons-henderson"];

test("every page with a Service ties it to its own address, so no two pages describe an anonymous service", () => {
  for (const route of [...CORPORATE, ...OTHER_SERVICE_PAGES]) {
    const src = read(`app/${route}/page.tsx`);
    const url = `https://www.lasvegasmahj.com/${route}`;
    const start = src.indexOf('"@type": "Service"');
    expect(start, route).toBeGreaterThan(-1);
    const head = src.slice(start, start + 2000);
    expect(src, route).toContain(`canonical: ${src.includes("const PAGE_URL") ? "PAGE_URL" : `"${url}"`}`);
    if (src.includes("const PAGE_URL")) {
      expect(src, route).toContain(`const PAGE_URL = "${url}"`);
      expect(head, route).toContain('"@id": `${PAGE_URL}#service`');
      expect(head, route).toMatch(/\burl: PAGE_URL,/);
    } else {
      expect(head, route).toContain(`"@id": "${url}#service"`);
      expect(head, route).toContain(`url: "${url}",`);
    }
  }
});

test("a page that publishes Article schema also shares as an article, not a generic website page", () => {
  // The page's own top-level node, not an Article nested inside a listing such as the blog index.
  const articles = walk("app").filter((rel) => /= \{\n  "@context": "https:\/\/schema\.org",\n  "@type": "Article",/.test(read(rel)));
  expect(articles.sort()).toEqual(["app/learn-mahjong/page.tsx", "app/mahjong-sets-guide/page.tsx"]);
  for (const rel of articles) {
    const src = read(rel);
    const og = src.slice(src.indexOf("openGraph: {"), src.indexOf("},", src.indexOf("openGraph: {")));
    expect(og, rel).toContain("...ogBase,\n    type: \"article\"");
  }
});

test("the leagues page takes its share image from the shared helper, like every other page", () => {
  // Its hand-built descriptor left out the image type, which made leagues the one sitemap
  // route with no og:image:type.
  expect(read("app/mahjong-leagues-las-vegas/page.tsx")).toContain("images: [studioOgImage(PLAYERS_AT_TABLE)]");
});
