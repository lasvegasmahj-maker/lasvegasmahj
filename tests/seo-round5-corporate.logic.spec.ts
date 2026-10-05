import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sitemap from "../app/sitemap";

// Round 5: four corporate and group landing pages and the related-experiences link system.
// The risks are pages that restate each other (cannibalization), and pages written for buyers
// who have never met us that promise capacities, clients, prices or results nobody sourced.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const readCode = (rel: string) =>
  read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

const NEW_PAGES = {
  "/las-vegas-meeting-planner-activities": { title: "Las Vegas Meeting Planner Activities", slug: "meeting-planners" },
  "/corporate-event-activities-las-vegas": { title: "Corporate Event Activities in Las Vegas", slug: "corporate-activities" },
  "/incentive-group-activities-las-vegas": { title: "Incentive Group Activities in Las Vegas", slug: "incentive" },
  "/trade-show-booth-activities-las-vegas": { title: "Trade Show Booth Activities in Las Vegas", slug: "trade-show" },
} as const;

const CLUSTER = [
  "/mahjong-corporate-las-vegas",
  "/corporate-team-building-las-vegas",
  "/conference-activities-las-vegas",
  "/convention-activities-las-vegas",
  ...Object.keys(NEW_PAGES),
];

const file = (route: string) => `app${route}/page.tsx`;

const metaDescription = (rel: string) => {
  const m = read(rel).match(/^ {2}description:\s*\n?\s*"([^"]+)"/m);
  if (!m) throw new Error(`${rel} has no top-level meta description`);
  return m[1];
};

const faqQuestions = (rel: string) => [...read(rel).matchAll(/\bq: "([^"]+)"/g)].map((m) => m[1]);

test.describe("the four new corporate and group pages", () => {
  for (const [route, { title, slug }] of Object.entries(NEW_PAGES)) {
    const rel = file(route);

    test(`${route} is in the sitemap once, with a self canonical and its own title`, () => {
      const urls = sitemap().map((e) => e.url);
      expect(urls.filter((u) => u === `https://www.lasvegasmahj.com${route}`)).toHaveLength(1);
      const src = read(rel);
      expect(src).toContain(`const PAGE_URL = "https://www.lasvegasmahj.com${route}"`);
      expect(src).toContain("alternates: { canonical: PAGE_URL }");
      expect(src).toContain(`title: "${title}"`);
      expect(src.match(/<h1\b/g) ?? []).toHaveLength(1);
      expect(src).not.toMatch(/robots:/);
    });

    test(`${route} has a results-page length description`, () => {
      const d = metaDescription(rel);
      expect(d.length).toBeGreaterThanOrEqual(110);
      expect(d.length).toBeLessThanOrEqual(155);
    });

    test(`${route} carries breadcrumb, Service and FAQ markup built from the visible FAQ`, () => {
      const src = read(rel);
      expect(src).toContain("buildBreadcrumbSchema([");
      expect(src).toContain('{ name: "Corporate Events", url: "https://www.lasvegasmahj.com/mahjong-corporate-las-vegas" }');
      expect(src).toContain('"@type": "Service"');
      expect(src).toContain('provider: { "@id": "https://www.lasvegasmahj.com/#business" }');
      expect(src).toContain("mainEntity: faqs.map(");
      expect(src).toContain("{faqs.map((faq) => (");
    });

    test(`${route} makes every role clear: team building, networking, engagement, breakout, client, hosted, group`, () => {
      const code = readCode(rel).toLowerCase();
      for (const role of ["team building", "networking", "engagement", "breakout", "client", "hosted", "group"]) {
        expect(code, role).toContain(role);
      }
    });

    test(`${route} sends quote requests with its own attribution`, () => {
      const hrefs = [...read(rel).matchAll(/href="(\/contact[^"]*)"/g)].map((m) => m[1]);
      expect(hrefs.length).toBeGreaterThan(0);
      for (const h of hrefs) expect(h).toBe(`/contact?source=${slug}`);
    });

    test(`${route} invents nothing: no prices, capacities, statistics, clients or testimonials`, () => {
      const code = readCode(rel);
      expect(code).not.toMatch(/\$\s?\d/);
      expect(code).not.toMatch(/\d+\s?\+/);
      // A CSS value in an inline style, such as width: "100%", is layout, not a statistic.
      expect(code.replace(/style=\{\{[^}]*\}\}/g, "")).not.toMatch(/\d+\s?%/);
      expect(code).not.toMatch(/\b(up to|as many as|over) \d/i);
      expect(code).not.toMatch(/<blockquote|testimonial|Northmarq/i);
      expect(code).not.toMatch(/guarantee|increase[sd]? (booth )?traffic|leads? per|\bROI\b/i);
      expect(code).not.toMatch(/telephone|tel:|openingHours/);
    });

    test(`${route} links into the cluster through the related module`, () => {
      const src = read(rel);
      expect(src).toContain('from "@/components/related-experiences"');
      expect(src).toMatch(/<RelatedExperiences[\s\S]*?links=\{\[/);
    });
  }

  test("corporate hosting is never placed at the studio", () => {
    for (const route of Object.keys(NEW_PAGES)) {
      const code = readCode(file(route));
      const mentions = [...code.matchAll(/[^.]*\bstudio\b[^.]*\./gi)].map((m) => m[0]);
      for (const sentence of mentions) {
        // The only studio sentence allowed is the one that sends guests who already play to
        // Social Open Play, which is sourced; private events at the studio are not.
        expect(sentence, `${route}: ${sentence}`).toMatch(/Social Open Play/);
      }
    }
  });

  test("the incentive page hands players on the trip to the visitor page", () => {
    const src = read(file("/incentive-group-activities-las-vegas"));
    expect(src).toContain('href="/play-mahjong-las-vegas"');
    expect(src).toContain("Registration is required");
  });
});

test.describe("the cluster stays distinct", () => {
  test("every title in the cluster is unique", () => {
    const titles = CLUSTER.map((r) => read(file(r)).match(/^ {2}title: "([^"]+)"/m)![1]);
    expect(new Set(titles).size).toBe(CLUSTER.length);
  });

  test("every meta description in the cluster is unique and fits", () => {
    const ds = CLUSTER.map((r) => metaDescription(file(r)));
    expect(new Set(ds).size).toBe(CLUSTER.length);
    for (const d of ds) expect(d.length, d).toBeLessThanOrEqual(155);
  });

  test("no FAQ question is asked twice anywhere in the cluster or on the visitor page", () => {
    const all = [...CLUSTER, "/play-mahjong-las-vegas", "/mahjong-open-play-las-vegas"].flatMap((r) => faqQuestions(file(r)));
    const dupes = all.filter((q, i) => all.indexOf(q) !== i);
    expect(dupes).toEqual([]);
  });

  test("each Service declares a distinct serviceType", () => {
    const types = CLUSTER.map((r) => read(file(r)).match(/serviceType: "([^"]+)"/)![1]);
    expect(new Set(types).size).toBe(CLUSTER.length);
  });

  test("the hub describes the service, and the occasions live on the activities page", () => {
    const hub = metaDescription(file("/mahjong-corporate-las-vegas"));
    expect(hub).not.toMatch(/client entertainment|company parties|incentive/i);
    expect(metaDescription(file("/corporate-event-activities-las-vegas"))).toMatch(/client entertainment/);
  });

  test("the booth page is a child of the convention page, not a second convention page", () => {
    const src = read(file("/trade-show-booth-activities-las-vegas"));
    expect(src).toContain('{ name: "Convention Activities", url: "https://www.lasvegasmahj.com/convention-activities-las-vegas" }');
    expect(read(file("/convention-activities-las-vegas"))).toContain('"/trade-show-booth-activities-las-vegas"');
  });
});

test.describe("the related-experiences link system", () => {
  const moduleSrc = read("components/related-experiences.tsx");

  test("the module only knows real routes", () => {
    const hrefs = [...moduleSrc.matchAll(/^\s{2}"(\/[a-z-]+)": \{/gm)].map((m) => m[1]);
    expect(hrefs.length).toBeGreaterThanOrEqual(9);
    for (const h of hrefs) expect(fs.existsSync(path.join(ROOT, file(h))), h).toBe(true);
  });

  test("every new page is linked from at least three other pages in the cluster", () => {
    const pages = [...CLUSTER, "/play-mahjong-las-vegas"];
    for (const target of Object.keys(NEW_PAGES)) {
      const linkers = pages.filter((p) => p !== target && read(file(p)).includes(`"${target}"`));
      expect(linkers.length, `${target} is linked from ${linkers.join(", ")}`).toBeGreaterThanOrEqual(3);
    }
  });

  test("the primary nav is left alone", () => {
    const nav = read("components/nav.tsx");
    for (const target of Object.keys(NEW_PAGES)) expect(nav).not.toContain(target);
  });

  test("the homepage renders no new module", () => {
    const home = read("components/home-client.tsx") + read("app/page.tsx");
    expect(home).not.toContain("RelatedExperiences");
  });
});
