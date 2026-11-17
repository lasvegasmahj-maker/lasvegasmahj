import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Internal links the owner decided on 2026-11-12. The Studio link was first built to look
// like plain text; she then approved the site's standard green in-text treatment, and a
// footer link to the visitor page. The rendered look and where each link leads are checked
// in the browser spec; the source form is pinned here.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

test("the Studio page links the word Leagues to the leagues page, once, in the standard green in-text style", () => {
  const src = read("app/studio/page.tsx");
  expect(src.match(/href="\/mahjong-leagues-las-vegas"/g)).toHaveLength(1);
  expect(src).toMatch(/<a\s+href="\/mahjong-leagues-las-vegas"\s+style=\{\{ color: "var\(--green\)", fontWeight: 600 \}\}>\s*Leagues\s*<\/a>/);
});

test("the footer links to the visitor page once, untagged, as a plain question", () => {
  const src = read("components/footer.tsx");
  // Untagged like every other footer link: nav, footer and direct traffic share one
  // attribution bucket by owner decision.
  expect(src.match(/href="\/play-mahjong-las-vegas[^"]*"/g)).toEqual(['href="/play-mahjong-las-vegas"']);
  expect(src).toMatch(/<a href="\/play-mahjong-las-vegas">\s*Visiting Las Vegas\?\s*<\/a>/);
});
