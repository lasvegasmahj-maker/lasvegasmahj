import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { trackEvent } from "../lib/analytics";

// Round 12, 2026-11-13: decisions the owner confirmed after reviewing Round 11.
//   - There is no additional travel fee.
//   - The certification is Shauna's alone. It stays in her About
//     biography and does not lead any page (see seo-round11-followups for the page-wide check).
//   - Analytics: the existing direct GA4 tag, with nothing counted twice.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

function pageSources(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...pageSources(rel));
    else if (/\.tsx$/.test(entry.name)) out.push(rel);
  }
  return out;
}

test("no page mentions a travel fee or any added charge", () => {
  const offenders: string[] = [];
  for (const rel of [...pageSources("app"), ...pageSources("components")]) {
    const found = read(rel).match(/\b(added|additional|extra|travel)\s+(fee|charge|surcharge)s?\b|\bsurcharges?\b/gi);
    if (found) offenders.push(`${rel}: ${found.join(", ")}`);
  }
  expect(offenders).toEqual([]);
});

test("no corporate price is said to depend on location", () => {
  for (const rel of ["app/corporate-team-building-las-vegas/page.tsx", "app/corporate-event-activities-las-vegas/page.tsx"]) {
    expect(read(rel), rel).not.toMatch(/location set the price|length,? and location/);
  }
});

test("the About page's experience cards no longer lead with a certification", () => {
  const about = read("app/about/page.tsx");
  const start = about.indexOf("const CREDENTIALS");
  const cards = about.slice(start, about.indexOf("];", start));
  expect(cards).not.toMatch(/certif/i);
  expect(cards).toContain('title: "18 Years Playing"');
  // In-home lessons are offered by request, never as a traveling-instructor business.
  expect(cards).toContain("That is available by request across Summerlin, Henderson, and the greater Valley.");
});

test("every page links to the privacy page, and the sitemap lists it", () => {
  expect(read("components/footer.tsx")).toContain('<li><a href="/privacy">Privacy</a></li>');
  expect(read("app/sitemap.ts")).toContain('url: "https://www.lasvegasmahj.com/privacy"');
  expect(fs.existsSync(path.join(ROOT, "app/privacy/page.tsx"))).toBe(true);
});

test("Tag Manager never loads alongside the GA4 tag", () => {
  expect(read("components/analytics.tsx")).toContain("const GTM_ID = GA4_ID ? undefined : process.env.NEXT_PUBLIC_GTM_ID;");
});

function withWindow(win: Record<string, unknown>, run: () => void) {
  const g = globalThis as unknown as { window?: unknown };
  g.window = win;
  try {
    run();
  } finally {
    delete g.window;
  }
}

test("with the GA4 tag on the page, an event is sent once, through gtag only", () => {
  // The GA4 tag defines gtag and also creates window.dataLayer.
  const calls: unknown[][] = [];
  const dataLayer: unknown[] = [];
  withWindow({ gtag: (...args: unknown[]) => calls.push(args), dataLayer }, () =>
    trackEvent("schedule_link_click", { link_url: "/schedule", page_path: "/studio" }),
  );
  expect(calls).toEqual([["event", "schedule_link_click", { link_url: "/schedule", page_path: "/studio" }]]);
  expect(dataLayer).toEqual([]);
});

test("with only Tag Manager's dataLayer on the page, the event is pushed there once", () => {
  const dataLayer: unknown[] = [];
  withWindow({ dataLayer }, () => trackEvent("contact_form_success", { source_label: "Schedule page" }));
  expect(dataLayer).toEqual([{ event: "contact_form_success", source_label: "Schedule page" }]);
});
