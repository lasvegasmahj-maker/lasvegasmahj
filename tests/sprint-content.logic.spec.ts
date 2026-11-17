import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import * as studioPhotos from "../lib/studio-photos";
import type { StudioPhoto } from "../lib/studio-photos";

// Content accuracy sprint, 2026-11-13. Each test pins one correction that the site's own
// confirmed facts already settled, so a later edit cannot quietly bring the old wording back.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const page = (route: string) => `app${route}/page.tsx`;

const OWNED = [
  "/mahjong-open-play-las-vegas",
  "/private-mahjong-lessons-las-vegas",
  "/mahjong-parties-las-vegas",
  "/studio",
  "/mahjong-lessons-summerlin",
  "/mahjong-lessons-henderson",
  "/play-mahjong-las-vegas",
  "/learn-mahjong",
  "/mahjong-lessons-las-vegas",
];

test("the beginner's guide names every class level the business sells", () => {
  // The sitewide offer catalog is where the class ladder is declared; the Bookwhen calendar
  // runs Mahj 101, 102 and 103.
  const levels = [...new Set(read("app/layout.tsx").match(/MAHJ10\d/g) ?? [])];
  expect(levels.length).toBeGreaterThanOrEqual(3);
  const src = read(page("/learn-mahjong"));
  const offer = src.match(/I offer [^.]+\./)?.[0];
  expect(offer, "the guide's list of what is offered").toBeTruthy();
  for (const level of levels) expect(offer, level).toContain(level);
});

test("the open play photo section names a room only when every photo in it was taken there", () => {
  const src = read(page("/mahjong-open-play-las-vegas"));
  const start = src.lastIndexOf("<section", src.indexOf("This Is What"));
  const section = src.slice(start, src.indexOf("</section>", start));
  const used = Object.entries(studioPhotos)
    .filter(([name, value]) => !Array.isArray(value) && section.includes(`${name}.src`))
    .map(([, value]) => value as StudioPhoto);
  expect(used.length).toBeGreaterThan(0);

  const rooms = new Set(used.map((p) => p.room));
  const oneVerifiedRoom = rooms.size === 1 && !rooms.has(undefined);
  const prose = section.replace(/<Image[\s\S]*?\/>/g, "");
  if (!oneVerifiedRoom) {
    expect(prose).not.toMatch(/Lucky (Sevens|Wishbone)|playing room|teaching room/i);
  }
  expect(prose).toContain("at the studio");
});

test("a link that promises the schedule goes to the schedule", () => {
  for (const route of OWNED) {
    const src = read(page(route));
    for (const m of src.matchAll(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const text = m[2].replace(/<[^>]+>/g, " ").replace(/\{" "\}/g, " ").replace(/\s+/g, " ").trim();
      if (/schedule/i.test(text)) expect(m[1], `${route}: "${text}"`).toMatch(/^\/schedule(#|$)/);
    }
  }
  expect(read(page("/private-mahjong-lessons-las-vegas"))).not.toContain("group classes on the schedule</a>");
});
