import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// /privacy, drafted 2026-11-13 from the code and from pages fetched that day; the owner reviews
// it before it ships. It describes the direct GA4 tag the owner chose. components/analytics.tsx
// can also load a Meta Pixel, which this page must never imply while none is configured.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

const PAGE = read("app/privacy/page.tsx");
const META_START = PAGE.indexOf("export const metadata");
const METADATA = PAGE.slice(META_START, PAGE.indexOf("\n};", META_START));
const HREFS = [...PAGE.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);

// Each answered 200 when fetched on 2026-11-13. A link joins this list only after the same check.
const VERIFIED_EXTERNAL_LINKS = [
  "https://bookwhen.com/privacy",
  "https://policies.google.com/technologies/partner-sites",
  "https://tools.google.com/dlpage/gaoptout",
  "https://vercel.com/legal/privacy-notice",
  "https://www.intuit.com/privacy/statement/",
];

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return sourceFiles(rel);
    return /\.tsx?$/.test(e.name) ? [rel] : [];
  });
}

test("the page is titled Privacy and is canonical at /privacy", () => {
  expect(META_START).toBeGreaterThan(-1);
  expect(METADATA).toMatch(/^ {2}title: "Privacy",$/m);
  expect(METADATA).toContain('alternates: { canonical: "https://www.lasvegasmahj.com/privacy" }');
  // A page-level openGraph replaces the root one, so it must bring the shared fields and an image.
  expect(METADATA).toContain("...ogBase,");
  expect(METADATA).toContain("images: [OG_HERO],");
  expect(METADATA).not.toMatch(/\brobots\s*:/);

  const description = METADATA.match(/description:\s*"([^"]+)"/)?.[1] ?? "";
  expect(description.length).toBeGreaterThanOrEqual(120);
  expect(description.length).toBeLessThanOrEqual(155);

  const h1 = PAGE.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
  expect(h1.replace(/<[^>]+>/g, "").trim()).toBe("Privacy");
  // The date moves when the build that sets the GA4 ID changes what the page says.
  expect(PAGE).toContain('const LAST_UPDATED = ANALYTICS_ON ? "November 20, 2026" : "November 13, 2026";');
  expect(PAGE).toContain("Last updated {LAST_UPDATED}</p>");
  expect(PAGE.match(/Last updated/g)).toHaveLength(1);
  // The sitemap's date for the page moves in the same build, and the two pairs of dates must
  // stay equal when the go-live day changes.
  expect(read("app/sitemap.ts")).toContain('lastModified: new Date(process.env.NEXT_PUBLIC_GA4_ID ? "2026-11-20" : "2026-11-13"),');
  const pageDates = PAGE.match(/const LAST_UPDATED = ANALYTICS_ON \? "([^"]+)" : "([^"]+)";/);
  const mapDates = read("app/sitemap.ts").match(/NEXT_PUBLIC_GA4_ID \? "(\d{4}-\d{2}-\d{2})" : "(\d{4}-\d{2}-\d{2})"/);
  const iso = (d: string) => new Date(`${d} UTC`).toISOString().slice(0, 10);
  expect(pageDates).not.toBeNull();
  expect(mapDates).not.toBeNull();
  expect([iso(pageDates![1]), iso(pageDates![2])]).toEqual([mapDates![1], mapDates![2]]);
});

test("it describes Google Analytics only in a build that loads it, and links Google's opt-out add-on", () => {
  // The owner: never claim analytics is active before it is. The page reads the same build-time
  // variable that decides whether components/analytics.tsx loads the GA4 tag.
  expect(PAGE).toContain("const ANALYTICS_ON = Boolean(process.env.NEXT_PUBLIC_GA4_ID);");
  expect(read("components/analytics.tsx")).toContain("const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;");
  expect(PAGE).toContain("This website does not use an analytics service right now.");
  expect(PAGE).toContain("Google Analytics 4");
  // Google's tag also sends browser and device details with every page view, so the page must
  // never read as if the address, title and IP address were all it receives.
  expect(PAGE).toContain("details about your browser and device");
  expect(HREFS).toContain("https://tools.google.com/dlpage/gaoptout");
  expect(HREFS).toContain("https://policies.google.com/technologies/partner-sites");
});

test("it never mentions a Meta Pixel or Facebook tracking", () => {
  expect(PAGE).not.toMatch(/pixel|fbq|facebook\.net|\bmeta\b/i);
  // Facebook may appear only as one of our social pages, in a sentence that says nothing about tracking.
  const sentences = PAGE.match(/[^.!?<>{}"]+/g) ?? [];
  for (const s of sentences.filter((x) => /facebook/i.test(x))) {
    expect(s).not.toMatch(/track|analytic|cookie|advert|measur|conversion/i);
  }
});

test("it carries no phone number and no em or en dash", () => {
  expect(PAGE).not.toMatch(/tel:|\btelephone\b/i);
  expect(PAGE).not.toMatch(/(?<!\d)(?:\+?1[.\s-]?)?\(?\d{3}\)?[.\s-]?\d{3}[.\s-]?\d{4}(?!\d)/);
  expect(PAGE).not.toMatch(/[\u2013\u2014]|&[mn]dash;|\\u201[34]/);
});

test("every link stays on this site, uses the public email, or is a verified https page", () => {
  for (const href of HREFS) {
    expect(href).toMatch(/^(\/[a-z0-9/-]*|mailto:hello@lasvegasmahj\.com|https:\/\/\S+)$/);
  }
  const external = HREFS.filter((h) => /^[a-z][a-z0-9+.-]*:\/\//i.test(h));
  for (const href of external) expect(href).toMatch(/^https:\/\//);
  expect([...new Set(external)].sort()).toEqual(VERIFIED_EXTERNAL_LINKS);
  // A link whose href came from an expression would slip past every check above.
  expect(PAGE).not.toMatch(/href=\{/);
});

test("what the page says about logs and storage still matches the code", () => {
  // tests/ask-log-privacy.logic.spec.ts runs the route and checks every log call it makes.
  expect(read("app/api/ask/route.ts")).not.toMatch(/summarizeGap|\bgap:/);
  expect(PAGE).toContain("Our server writes a short record of each answer to our hosting logs");

  const files = ["app", "components", "lib"].flatMap(sourceFiles);
  expect(files.length).toBeGreaterThan(50);
  const storing = files.filter((f) => /document\.cookie|\bcookies\(\)|localStorage|indexedDB/.test(read(f)));
  expect(storing).toEqual([]);
  expect(files.filter((f) => read(f).includes("sessionStorage"))).toEqual([path.join("app", "ask", "ask-client.tsx")]);
  expect(PAGE).toContain("This website does not set any cookies of its own.");
});
