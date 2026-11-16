import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Round 11, 2026-11-13: follow-ups the owner gave after reviewing Round 10.
//   - The site never identifies a corporate client. That covers content that was already
//     published, not only new examples. A testimonial stays only where it can be shown
//     accurately without naming its source.
//   - The 18 years of experience and the certification are Shauna's. Other instructors teach
//     here too, so no sentence may hand either to whoever teaches.
//   - Group lessons seat 4 to 8.
//   - The parties page speaks to a private group, so its second button goes to private
//     lessons.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "test-results", "playwright-report"]);

function walk(dir: string, accept: RegExp): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...walk(rel, accept));
    } else if (accept.test(entry.name) && entry.name !== "pnpm-lock.yaml") {
      out.push(rel);
    }
  }
  return out;
}

const ABOUT = path.join("app", "about", "page.tsx");
const LAYOUT = path.join("app", "layout.tsx");
const pageSources = () => [...walk("app", /\.tsx$/), ...walk("components", /\.tsx$/)];

// Rough sentences: a JSX tag, a brace or a string quote also ends one, so a sentence never
// runs across two strings. The certifying company's name is set aside, because the "My" in
// "Oh My Mahjong" would otherwise read as Shauna speaking for herself.
const sentences = (src: string) => (src.match(/[^.!?<>{}"]+/g) ?? []).map((s) => s.replace(/\bOh My Mahjong\b/gi, "OMM"));

// The About page and the sitewide founder record describe Shauna from top to bottom, so a
// sentence there may state her credentials without repeating her name.
function withoutFounder(src: string) {
  const start = src.indexOf("\n  founder: {");
  const end = src.indexOf("\n  hasMap:", start);
  expect(start).toBeGreaterThan(-1);
  expect(end).toBeGreaterThan(start);
  return src.slice(0, start) + src.slice(end);
}
const outsideShaunasOwnRecords = () =>
  pageSources()
    .filter((rel) => rel !== ABOUT)
    .map((rel) => ({ rel, src: rel === LAYOUT ? withoutFounder(read(rel)) : read(rel) }));

// The client's name is deliberately not written in this file, which is as public as the
// pages are. This is the SHA-256 of the name in lower case; every word in the project is
// hashed and compared with it.
const CLIENT_FINGERPRINT = "d0a93026a075841aed507398ab34bbdc444ab44ce53454d370e9cc3406b3c0c9";
const fingerprint = (word: string) => crypto.createHash("sha256").update(word).digest("hex");

test("no file in the project spells the name of the corporate client", () => {
  const firstSeenIn = new Map<string, string>();
  const files = walk(".", /\.(tsx?|[cm]?js|json|md|css|html|bak|txt|xml|svg|ya?ml|webmanifest)$/);
  for (const rel of files) {
    for (const word of read(rel).toLowerCase().match(/[a-z]{4,}/g) ?? []) {
      if (!firstSeenIn.has(word)) firstSeenIn.set(word, rel);
    }
  }
  expect(firstSeenIn.size).toBeGreaterThan(1000);
  const offenders = [...firstSeenIn].filter(([word]) => fingerprint(word) === CLIENT_FINGERPRINT).map(([, rel]) => rel);
  expect(offenders).toEqual([]);
});

test("the corporate quote appears once, in the client's original words, with no source named", () => {
  const hub = read("app/mahjong-corporate-las-vegas/page.tsx");
  const quote = hub.slice(hub.indexOf("<blockquote"), hub.indexOf("</blockquote>"));
  expect(quote).toContain(
    "We worked with Shauna for a mahjong-oriented corporate event in early 2026. Shauna was easy to work with and her team was engaging with all of our guests. We got some of the best guest feedback we&rsquo;ve ever received from this event, and we hope to work with Shauna again on a future mahjong social!",
  );
  expect(quote).not.toMatch(/<cite/);
  // The quote is shown in one place only, never under the players' or students' review headings.
  const carriers = pageSources().filter((rel) => read(rel).includes("best guest feedback"));
  expect(carriers).toEqual([path.join("app", "mahjong-corporate-las-vegas", "page.tsx")]);
});

test("every review on the homepage and About lists carries a plain reviewer name", () => {
  for (const rel of ["components/testimonials.tsx", "app/about/page.tsx"]) {
    const entries = [...read(rel).matchAll(/\{[^{}]*\btext:\s*"[^"]*"[^{}]*\}/g)].map((m) => m[0]);
    const names = entries.flatMap((e) => [...e.matchAll(/\bname:\s*"([^"]*)"/g)].map((m) => m[1]));
    expect(names.length, rel).toBe(entries.length);
    expect(names.length, rel).toBeGreaterThan(2);
    for (const name of names) expect(name, rel).not.toContain(",");
  }
});

test("every mention of the 18 years names Shauna or is in her own voice", () => {
  let checked = 0;
  for (const { rel, src } of outsideShaunasOwnRecords()) {
    for (const s of sentences(src).filter((x) => /\b(18|eighteen)\s+years\b|two decades/i.test(x))) {
      checked += 1;
      expect(s, rel).toMatch(/\bShauna\b|\bI\b|\b(my|she|her)\b/i);
      expect(s, rel).not.toMatch(/\b(every|all|each|our)\s+(instructors?|teachers?)\b/i);
    }
  }
  expect(checked).toBeGreaterThanOrEqual(4);
  for (const rel of ["app/mahjong-lessons-summerlin/page.tsx", "app/mahjong-lessons-henderson/page.tsx"]) {
    expect(read(rel)).toContain("Our founder, Shauna, has played American Mahjong for nearly 18 years.");
  }
});

test("outside Shauna's own records, no page mentions the certification", () => {
  // Owner, 2026-11-13: the certification is Shauna's alone, and it should
  // not lead the pages or be the main selling point. It stays in her About biography and in
  // the founder's structured-data credential. The Ask page is governed separately; its one
  // mention waits for the owner's decision.
  const mentions = outsideShaunasOwnRecords().flatMap(({ rel, src }) =>
    sentences(src)
      .filter((s) => /certif/i.test(s))
      .map(() => rel),
  );
  expect(mentions).toEqual([path.join("app", "ask", "page.tsx")]);

  const about = read(ABOUT);
  const aboutMentions = sentences(about).filter((s) => /certif/i.test(s));
  expect(aboutMentions).toHaveLength(1);
  expect(aboutMentions[0]).toContain("I became a certified OMM instructor");
  // The owner's own choice of 2026-11-15; the layout template adds " | Las Vegas Mahjong".
  expect(about).toContain('title: "About Shauna"');

  expect(read("app/mahjong-lessons-las-vegas/page.tsx")).toContain(
    "Las Vegas Mahjong offers in-person American Mahjong lessons at our Las Vegas studio.",
  );
  // The homepage has no description of its own, so this sitewide one is its search snippet.
  expect(read("app/layout.tsx")).toContain(
    '"Mahjong lessons, open play, and private parties across Las Vegas, Summerlin, and Henderson. Beginner classes need no experience."',
  );
});

test("the About page states the confirmed group-lesson size, 4 to 8", () => {
  const about = read("app/about/page.tsx");
  expect(about).toContain("For group lessons, I work with 4 to 8 students max");
  expect(about).not.toMatch(/\b3 to 8\b/);
  // The class card on the homepage states the same policy.
  expect(read("components/classes.tsx")).toContain("Group Lesson (4-8 people)");
});

// Every file in public/ is served as is at its own address, metadata included, and phone
// photos record where they were taken. These are the GPS entry of an EXIF block (tag 0x8825,
// held as a LONG or an IFD offset) in both byte orders; every format that carries EXIF stores
// it this way.
const GPS_POINTER = ["2588040001000000", "8825000400000001", "25880d0001000000", "8825000d00000001"].map((hex) =>
  Buffer.from(hex, "hex"),
);

test("no published image carries the GPS position it was taken at", () => {
  const images = walk("public", /\.(jpe?g|png|webp|avif|gif|heic|tiff?)$/i);
  expect(images.length).toBeGreaterThan(30);
  for (const rel of images) {
    const bytes = fs.readFileSync(path.join(ROOT, rel));
    for (const pointer of GPS_POINTER) expect(bytes.includes(pointer), rel).toBe(false);
    expect(bytes.includes("GPSLatitude", 0, "latin1"), rel).toBe(false);
  }
});

test("the parties page offers private lessons, not group classes, as its other path", () => {
  const src = read("app/mahjong-parties-las-vegas/page.tsx");
  expect(src).toContain('<a href="/private-mahjong-lessons-las-vegas" className="btn-outline">View Private Lessons</a>');
  expect(src).not.toContain("View Lessons Instead");
});
