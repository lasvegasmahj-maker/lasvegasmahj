import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sitemap from "../app/sitemap";

// Round 4: the visitor page and the corporate cluster tune-up. The risks are an unsourced
// claim on a page written for people who have never met us (hours, distances, prices), a
// second page competing with /mahjong-open-play-las-vegas, and the corporate pages drifting
// back into each other's keywords.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const readCode = (rel: string) =>
  read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

const VISITORS = "app/play-mahjong-las-vegas/page.tsx";
const OPEN_PLAY = "app/mahjong-open-play-las-vegas/page.tsx";
const CLUSTER = {
  hub: "app/mahjong-corporate-las-vegas/page.tsx",
  teamBuilding: "app/corporate-team-building-las-vegas/page.tsx",
  conference: "app/conference-activities-las-vegas/page.tsx",
  convention: "app/convention-activities-las-vegas/page.tsx",
};

const metaDescription = (rel: string) => {
  const m = read(rel).match(/^ {2}description:\s*\n?\s*"([^"]+)"/m);
  if (!m) throw new Error(`${rel} has no top-level meta description`);
  return m[1];
};

test.describe("/play-mahjong-las-vegas", () => {
  test("is in the sitemap exactly once", () => {
    const urls = sitemap().map((e) => e.url);
    expect(urls.filter((u) => u === "https://www.lasvegasmahj.com/play-mahjong-las-vegas")).toHaveLength(1);
  });

  test("uses the owner's title and H1, and a self canonical", () => {
    const src = read(VISITORS);
    expect(src).toContain('title: { absolute: "Play Mahjong in Las Vegas | Open Play for Visitors" }');
    expect(src).toContain("Looking for a Mahjong Game While Visiting");
    expect(src).toContain('const PAGE_URL = "https://www.lasvegasmahj.com/play-mahjong-las-vegas"');
    expect(src).toContain("alternates: { canonical: PAGE_URL }");
    expect(src.match(/<h1\b/g) ?? []).toHaveLength(1);
  });

  test("the meta description fits a results page", () => {
    const d = metaDescription(VISITORS);
    expect(d.length).toBeGreaterThanOrEqual(110);
    expect(d.length).toBeLessThanOrEqual(155);
  });

  test("answers every visitor question the owner listed", () => {
    const src = read(VISITORS);
    for (const q of [
      "Can visitors play mahjong in Las Vegas?",
      "Where can I play American Mahjong in Las Vegas?",
      "Can I come to Open Play alone?",
      "Do I need to bring three other players?",
      "What type of mahjong do you play?",
      "Do I need an NMJL card?",
      "Do I need to reserve in advance?",
      "Where is the Las Vegas Mahjong Studio?",
      "What if I am visiting with a group?",
      "Where can I see upcoming Open Play sessions?",
    ]) {
      expect(src, q).toContain(`q: "${q}"`);
    }
  });

  test("the FAQ schema is generated from the visible FAQ, so the two cannot drift", () => {
    const src = read(VISITORS);
    expect(src).toContain('"@type": "FAQPage"');
    expect(src).toContain("mainEntity: faqs.map(");
    expect(src).toContain("{faqs.map((faq) => (");
  });

  test("states the studio facts the owner gave, and names the room", () => {
    const src = read(VISITORS);
    for (const fact of ["Lucky Hare", "8687 W. Sahara Ave., Suite 200", "Las Vegas, NV 89117", "Lucky Sevens", "Advance registration is required"]) {
      expect(src, fact).toContain(fact);
    }
  });

  test("names American Mahjong and the NMJL card, and sets it apart from Riichi", () => {
    const src = read(VISITORS);
    expect(src).toContain("National Mah Jongg League");
    expect(src).toContain("American Mah Jongg");
    expect(src).toContain("Riichi");
    expect(src).toContain("152-tile");
  });

  test("makes no claim the site cannot source: no hours, distances, transport, parking or prices", () => {
    const code = readCode(VISITORS);
    expect(code).not.toMatch(/\$\s?\d/);
    expect(code).not.toMatch(/parking/i);
    expect(code).not.toMatch(/\bmiles?\b/i);
    expect(code).not.toMatch(/\bminutes?\s+(from|away|to)\b/i);
    expect(code).not.toMatch(/\bthe Strip\b/i);
    expect(code).not.toMatch(/shuttle|uber|lyft|taxi|rideshare|monorail/i);
    expect(code).not.toMatch(/open (daily|every day|seven days)/i);
    expect(code).not.toMatch(/openingHours|telephone|tel:/);
    // Session times only ever come from the booking feed, never from the page's own copy.
    expect(code).not.toMatch(/\b\d{1,2}(:\d{2})?\s?(am|pm)\b/i);
    expect(code).not.toMatch(/guarantee/i);
  });

  test("leads with the schedule and offers the studio second", () => {
    const code = readCode(VISITORS);
    const hero = code.slice(code.indexOf("<h1"), code.indexOf("<Image"));
    expect(hero).toMatch(/href="\/schedule" className="btn-primary"/);
    expect(hero).toMatch(/href="\/studio" className="btn-outline"/);
    expect(hero.indexOf('href="/schedule"')).toBeLessThan(hero.indexOf('href="/studio"'));
  });

  test("sends private groups to the private and corporate paths", () => {
    const src = read(VISITORS);
    for (const href of ["/private-mahjong-lessons-las-vegas", "/mahjong-parties-las-vegas", "/mahjong-corporate-las-vegas", "/contact?source=visitors"]) {
      expect(src, href).toContain(`href="${href}"`);
    }
    expect(src).toContain("priced on request");
  });

  test("lists only studio Open Play sessions and leaves Event markup to /schedule", () => {
    const src = read(VISITORS);
    expect(src).toContain('e.venueKind === "studio"');
    expect(src).toMatch(/\/open play\/i\.test\(e\.title\)/);
    expect(src).not.toContain("buildScheduleEventSchema");
    expect(src).not.toContain('"@type": "Event"');
  });

  test("uses only owner-identified photographs from the manifest", () => {
    const code = readCode(VISITORS);
    expect(code).toContain('from "@/lib/studio-photos"');
    expect(code).not.toMatch(/src="\/[^"]+\.(jpg|jpeg|png|webp|avif)"/);
  });

  test("is reachable from the open play page and the studio page", () => {
    expect(read(OPEN_PLAY)).toContain('href="/play-mahjong-las-vegas"');
    expect(read("app/studio/page.tsx")).toContain('href="/play-mahjong-las-vegas"');
  });

  test("the contact form attributes it without prefilling an inquiry type", () => {
    const form = read("components/contact-form.tsx");
    const line = form.match(/^\s*visitors:\s*\{([^}]*)\}/m);
    expect(line, "the visitors slug is missing").not.toBeNull();
    expect(line![1]).not.toContain("inquiry");
  });
});

test.describe("/mahjong-open-play-las-vegas stops competing with it", () => {
  test("its description is about open play at the studio, not the retired venues", () => {
    const d = metaDescription(OPEN_PLAY);
    expect(d).not.toMatch(/Summerlin|Henderson/);
    expect(d).toContain("Lucky Hare");
    expect(d.startsWith("Play mahjong in Las Vegas")).toBe(false);
  });

  test("describes open play as a service of the one business, not a rival organization", () => {
    const src = readCode(OPEN_PLAY);
    expect(src).not.toContain("SportsOrganization");
    expect(src).toContain('"@type": "Service"');
    expect(src).toContain('provider: { "@id": "https://www.lasvegasmahj.com/#business" }');
  });
});

test.describe("sitewide LocalBusiness", () => {
  const layout = read("app/layout.tsx");
  const biz = layout.slice(layout.indexOf("const localBusinessSchema"), layout.indexOf("const courseSchema"));

  test("names Lucky Hare by reference to the studio Place, without a second address", () => {
    expect(biz).toMatch(/containedInPlace:\s*\{\s*"@type": "Place",\s*"@id": "https:\/\/www\.lasvegasmahj\.com\/#studio",\s*name: "Lucky Hare",\s*\}/);
    expect((biz.match(/"@type": "PostalAddress"/g) ?? []).length).toBe(1);
    expect(read("lib/schema.ts")).toMatch(/"@id": "https:\/\/www\.lasvegasmahj\.com\/#studio",\s*name: "Lucky Hare"/);
  });

  test("describes the real offering in plain terms, with no superlative", () => {
    const desc = biz.match(/description:\s*\n?\s*"([^"]+)"/)![1];
    for (const term of ["American Mahjong", "National Mah Jongg League", "Social Open Play", "corporate", "Lucky Hare", "8687 W. Sahara Ave., Suite 200"]) {
      expect(desc, term).toContain(term);
    }
    expect(desc).not.toMatch(/premier|best|top|#1|leading/i);
  });

  test("offers Social Open Play with no price", () => {
    const offer = biz.slice(biz.indexOf('name: "Social Open Play"'), biz.indexOf('name: "Corporate & Private Event Mahjong"'));
    expect(offer).toContain("Lucky Sevens");
    expect(offer).not.toMatch(/price/i);
  });
});

test.describe("pages that dropped the preview directives get them back", () => {
  for (const rel of ["app/schedule/page.tsx", "app/studio/page.tsx"]) {
    test(`${rel} sets no page-level robots object`, () => {
      // A page-level robots object replaces the root one instead of merging, which silently
      // removed max-image-preview:large and max-snippet:-1 from these pages.
      const meta = read(rel).slice(read(rel).indexOf("export const metadata"), read(rel).indexOf("};", read(rel).indexOf("export const metadata")));
      expect(meta).not.toMatch(/\brobots:/);
    });
  }

  test("the schedule has a descriptive title and a share image", () => {
    const src = read("app/schedule/page.tsx");
    expect(src).toContain('title: "Mahjong Class & Open Play Schedule"');
    expect(src).toContain("images: [`https://www.lasvegasmahj.com${SEVENS_OPEN_PLAY.src}`]");
  });
});

test.describe("the corporate cluster keeps its intents apart", () => {
  test("every page keeps its own exact-match title", () => {
    expect(read(CLUSTER.hub)).toContain('title: "Corporate Mahjong Events in Las Vegas"');
    expect(read(CLUSTER.teamBuilding)).toContain('title: "Corporate Team Building Las Vegas"');
    expect(read(CLUSTER.conference)).toContain('title: "Conference Activities Las Vegas"');
    expect(read(CLUSTER.convention)).toContain('title: "Convention Activities Las Vegas"');
  });

  test("each Service declares a distinct serviceType", () => {
    const types = Object.values(CLUSTER).map((rel) => read(rel).match(/serviceType: "([^"]+)"/)![1]);
    expect(new Set(types).size).toBe(4);
  });

  test("meta descriptions are unique and fit a results page", () => {
    const ds = Object.values(CLUSTER).map(metaDescription);
    expect(new Set(ds).size).toBe(4);
    for (const d of ds) expect(d.length, d).toBeLessThanOrEqual(155);
  });

  test("the hub no longer repeats the team building page's main heading", () => {
    expect(read(CLUSTER.hub)).not.toContain("The Team Building Activity That");
    expect(read(CLUSTER.teamBuilding)).toContain("A Team Building Activity That");
  });

  test("conference and convention link to each other, and both still link up to the hub", () => {
    expect(read(CLUSTER.conference)).toContain('href="/convention-activities-las-vegas"');
    expect(read(CLUSTER.convention)).toContain('href="/conference-activities-las-vegas"');
    for (const rel of [CLUSTER.teamBuilding, CLUSTER.conference, CLUSTER.convention]) {
      expect(read(rel), rel).toContain('href="/mahjong-corporate-las-vegas"');
    }
  });

  test("the conference Service no longer claims conventions", () => {
    const service = read(CLUSTER.conference).match(/"@type": "Service",[\s\S]*?description: "([^"]+)"/)![1];
    expect(service).not.toMatch(/convention/i);
  });

  test("Summerlin is a Place everywhere, matching the sitewide entity", () => {
    for (const rel of [...Object.values(CLUSTER), "app/layout.tsx"]) {
      expect(read(rel), rel).not.toMatch(/"@type": "City", name: "Summerlin"/);
    }
  });

  test("no corporate page names a price", () => {
    for (const rel of Object.values(CLUSTER)) {
      expect(readCode(rel), rel).not.toMatch(/\$\s?\d/);
    }
  });
});
