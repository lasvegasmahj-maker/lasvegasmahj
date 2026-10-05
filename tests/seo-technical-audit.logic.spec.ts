import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sitemap from "../app/sitemap";

// Technical SEO audit, 2026-10-04. Each test pins one objective defect the audit found on
// main, so it cannot quietly come back. Wording, titles and page architecture are not
// touched here; see docs/handoffs/lvm-seo-technical-audit-2026-10-04.md.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const walk = (dir: string): string[] =>
  fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name === "page.tsx" ? [`${dir}/${e.name}`] : [],
  );
const PAGES = walk("app");

test("the page list covers the site", () => {
  expect(PAGES.length).toBeGreaterThan(30);
  expect(PAGES).toContain("app/mahjong-leagues-las-vegas/page.tsx");
});

test("only noindex pages set a page-level robots object, so the root preview directives survive", () => {
  for (const rel of PAGES) {
    const m = read(rel).match(/\brobots:\s*\{([^}]*)\}/);
    if (m) expect(m[1], rel).toMatch(/index:\s*false/);
  }
});

// The object literal that starts at `key: {`, cut at its matching brace, so a later sibling
// such as twitter.images cannot satisfy a check meant for openGraph.
const objectAt = (src: string, key: string) => {
  const start = src.search(new RegExp(`\\b${key}:\\s*\\{`));
  if (start < 0) return null;
  let depth = 0;
  for (let i = src.indexOf("{", start); i < src.length; i++) {
    if (src[i] === "{") depth++;
    if (src[i] === "}" && --depth === 0) return src.slice(start, i + 1);
  }
  throw new Error(`unbalanced ${key} object`);
};

test("every page that replaces the root openGraph object brings its own share image", () => {
  for (const rel of PAGES) {
    const og = objectAt(read(rel), "openGraph");
    if (og === null || rel === "app/not-found.tsx") continue;
    expect(og, rel).toMatch(/\bimages:\s*\[/);
  }
});

test("the 404 publishes no og:url, since /404 is not a real address", () => {
  const src = read("app/not-found.tsx");
  expect(src).not.toContain("lasvegasmahj.com/404");
  expect(src).not.toMatch(/openGraph:\s*\{[^}]*\burl:/);
});

test("every sitemap date is a real date that is not in the future", () => {
  const now = Date.now();
  for (const entry of sitemap()) {
    const d = entry.lastModified;
    expect(d, entry.url).toBeInstanceOf(Date);
    expect(Number.isNaN((d as Date).getTime()), entry.url).toBe(false);
    expect((d as Date).getTime(), entry.url).toBeLessThanOrEqual(now);
  }
});

test("/learn-mahjong publishes no HowTo describing steps the page does not show", () => {
  const src = read("app/learn-mahjong/page.tsx");
  expect(src).not.toContain('"HowTo"');
  expect(src).not.toContain("$50 to $300");
});

test("article and collection authors are the founder entity from /about, not an anonymous Person", () => {
  for (const rel of ["app/learn-mahjong/page.tsx", "app/mahjong-sets-guide/page.tsx", "app/rules/page.tsx"]) {
    const author = read(rel).match(/author:\s*(\{[^}]*\})/)![1];
    expect(author, rel).toContain('"@id": "https://www.lasvegasmahj.com/about#shauna"');
    expect(author, rel).not.toContain("jobTitle");
  }
});

test("the /about Person uses no property schema.org does not define for a Person", () => {
  const src = read("app/about/page.tsx");
  const person = src.slice(src.indexOf('"@type": "Person"'), src.indexOf("const breadcrumb"));
  expect(person).toContain("about#shauna");
  expect(person).not.toMatch(/\bareaServed:/);
});

test("/schedule carries a BreadcrumbList like every other inner page", () => {
  const src = read("app/schedule/page.tsx");
  expect(src).toMatch(/buildBreadcrumbSchema\(\[\s*\{ name: "Schedule", url: "https:\/\/www\.lasvegasmahj\.com\/schedule" \}/);
});

test("likely LCP images ask for high fetch priority and are never lazy", () => {
  // In Next 16 `priority` only preloads; it does not set fetchpriority on the <img>, and an
  // image without priority, preload or loading="eager" is lazy.
  for (const [rel, src] of [
    ["components/hero.tsx", 'src="/hero-bg.jpg"'],
    ["app/studio/page.tsx", "src={SHAUNA_AT_TABLE.src}"],
    ["app/play-mahjong-las-vegas/page.tsx", "src={SEVENS_OPEN_PLAY.src}"],
    ["app/about/page.tsx", "src={SHAUNA_NEON.src}"],
    ["app/convention-activities-las-vegas/page.tsx", 'src="/lvm-tables-ready.jpg"'],
  ]) {
    const file = read(rel);
    const at = file.indexOf(src);
    expect(at, `${rel} ${src}`).toBeGreaterThan(-1);
    const image = file.slice(file.lastIndexOf("<Image", at), file.indexOf("/>", at));
    expect(image, rel).toContain('fetchPriority="high"');
    expect(image, rel).toMatch(/\bpriority\b|\bpreload\b|loading="eager"/);
    expect(image, rel).not.toContain('loading="lazy"');
  }
});

test("the two fixed two-column sections stack on phones", () => {
  for (const rel of ["app/about/page.tsx", "app/mahjong-parties-las-vegas/page.tsx"]) {
    expect(read(rel), rel).toMatch(/className="container split-stack" style=\{\{[^}]*gridTemplateColumns: "1fr 1fr"/);
  }
  const css = read("app/globals.css");
  const phone = css.slice(css.indexOf("@media (max-width: 768px) {"));
  expect(phone).toMatch(/\.split-stack \{ grid-template-columns: 1fr !important;/);
});

test("no auto-fit grid on a public page demands 300px, which overflows a 320px phone", () => {
  for (const rel of PAGES.filter((p) => !p.startsWith("app/blog/"))) {
    expect(read(rel), rel).not.toMatch(/minmax\(300px,/);
  }
});

test("the shop's partner logo is sized for its 120px slot", () => {
  expect(read("components/shop.tsx")).toContain('logo: "/logos/minimahjer.webp"');
  expect(fs.statSync(path.join(ROOT, "public/logos/minimahjer.webp")).size).toBeLessThan(20_000);
});
