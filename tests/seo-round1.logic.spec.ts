import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import sitemap from "../app/sitemap";
import { pacificIso, isStudioAddress } from "../lib/schedule";
import { buildScheduleEventSchema, type ScheduleEventInput } from "../lib/schema";

// Round 1 owner decisions, enforced without a browser or a server so they run in the
// CI "checks" job: no bachelorette content anywhere, the studio-first private lesson
// positioning, private pricing stays contact-only, and Event dates carry a real offset.

const ROOT = path.join(__dirname, "..");
const SHIPPED_DIRS = ["app", "components", "lib", "content"];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|css)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const shippedFiles = SHIPPED_DIRS.flatMap((d) => walk(path.join(ROOT, d)));

test.describe("bachelorette content is gone from everything that ships", () => {
  test("no shipped source file mentions bachelorette", () => {
    const hits = shippedFiles.filter((f) => /bachelorette/i.test(fs.readFileSync(f, "utf8")));
    expect(hits.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  test("the blog post directory no longer exists", () => {
    expect(fs.existsSync(path.join(ROOT, "app/blog/bachelorette-party-ideas-las-vegas"))).toBe(false);
  });

  test("next.config.ts redirects the retired URL with a 301", () => {
    const cfg = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
    expect(cfg).toContain('source: "/blog/bachelorette-party-ideas-las-vegas"');
    expect(cfg).toContain('destination: "/mahjong-parties-las-vegas"');
    expect(cfg).toContain("statusCode: 301");
    // permanent:true would emit a 308; the owner asked for a 301.
    expect(cfg).not.toContain("permanent: true");
  });
});

test.describe("sitemap", () => {
  const urls = sitemap().map((e) => e.url);

  test("drops the redirected URL", () => {
    expect(urls).not.toContain("https://www.lasvegasmahj.com/blog/bachelorette-party-ideas-las-vegas");
  });

  test("keeps Things To Do live and indexable", () => {
    expect(urls).toContain("https://www.lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling");
  });

  test("lists the new pages", () => {
    expect(urls).toContain("https://www.lasvegasmahj.com/contact");
    expect(urls).toContain("https://www.lasvegasmahj.com/private-mahjong-lessons-las-vegas");
  });

  test("the private page ranks below the broad lessons page", () => {
    const entry = (u: string) => sitemap().find((e) => e.url === u)!;
    expect(entry("https://www.lasvegasmahj.com/private-mahjong-lessons-las-vegas").priority!)
      .toBeLessThan(entry("https://www.lasvegasmahj.com/mahjong-lessons-las-vegas").priority!);
  });

  test("every URL is unique", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});

test.describe("Things To Do is buried, not orphaned", () => {
  const footer = fs.readFileSync(path.join(ROOT, "components/footer.tsx"), "utf8");
  const nav = fs.readFileSync(path.join(ROOT, "components/nav.tsx"), "utf8");
  const blogIndex = fs.readFileSync(path.join(ROOT, "app/blog/page.tsx"), "utf8");

  test("no footer or nav link points at it", () => {
    expect(footer).not.toContain("things-to-do-las-vegas-besides-gambling");
    expect(nav).not.toContain("things-to-do-las-vegas-besides-gambling");
  });

  test("it stays listed on the blog index so Search Console can measure it", () => {
    expect(blogIndex).toContain("/blog/things-to-do-las-vegas-besides-gambling");
  });

  test("the page itself is not noindexed and was not rewritten away", () => {
    const post = fs.readFileSync(path.join(ROOT, "app/blog/things-to-do-las-vegas-besides-gambling/page.tsx"), "utf8");
    expect(post).not.toMatch(/index:\s*false|noindex/i);
    expect(post).toContain('canonical: "https://www.lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling"');
  });
});

test.describe("no public phone number", () => {
  test("the personal number appears in no visible copy", () => {
    const offenders = shippedFiles.filter((f) => {
      if (f.endsWith("app/layout.tsx")) return false; // schema telephone, pre-existing NAP field
      return /847[.\s-]?609[.\s-]?3112|tel:/i.test(fs.readFileSync(f, "utf8"));
    });
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  test("the new pages carry no phone number at all", () => {
    for (const p of ["app/contact/page.tsx", "app/private-mahjong-lessons-las-vegas/page.tsx"]) {
      const src = fs.readFileSync(path.join(ROOT, p), "utf8");
      expect(src, p).not.toMatch(/tel:|\d{3}[.\s-]\d{3}[.\s-]\d{4}/);
    }
  });
});

test.describe("private lessons: studio first, contact for pricing", () => {
  const priv = fs.readFileSync(path.join(ROOT, "app/private-mahjong-lessons-las-vegas/page.tsx"), "utf8");

  test("no dollar amount, no minimum, no travel fee, no package", () => {
    expect(priv).not.toMatch(/\$\d/);
    expect(priv).not.toMatch(/travel fee|minimum|package/i);
  });

  test("it says contact for pricing", () => {
    expect(priv).toMatch(/Contact for\s*<?[^>]*>?\s*Pricing/i);
  });

  test("in-home is mentioned as an option, and the studio leads", () => {
    const inHome = (priv.match(/in home/gi) ?? []).length;
    expect(inHome).toBeGreaterThan(0);
    expect(inHome).toBeLessThanOrEqual(3);
    expect(priv).toContain("Private lessons are taught at our studio inside Lucky Hare");
  });

  test("it does not restate the group curriculum or price", () => {
    expect(priv).not.toMatch(/MAHJ10[123]/);
  });

  test("the broad page keeps its group pricing and hands off with one link", () => {
    const broad = fs.readFileSync(path.join(ROOT, "app/mahjong-lessons-las-vegas/page.tsx"), "utf8");
    expect(broad).toContain("$60");
    expect((broad.match(/\/private-mahjong-lessons-las-vegas/g) ?? []).length).toBe(1);
    expect(broad).not.toMatch(/travel fee/i);
  });
});

test.describe("contact page", () => {
  const contact = fs.readFileSync(path.join(ROOT, "app/contact/page.tsx"), "utf8");

  test("has a unique canonical, title and description", () => {
    expect(contact).toContain('canonical: "https://www.lasvegasmahj.com/contact"');
    expect(contact).toContain("Contact Las Vegas Mahjong");
  });

  test("reuses the existing Formspree mechanism", () => {
    const form = fs.readFileSync(path.join(ROOT, "components/contact-form.tsx"), "utf8");
    expect(form).toContain("https://formspree.io/f/mwvrnjrb");
    expect(form).toContain('trackEvent("contact_submit")');
  });

  test("carries no group lesson price", () => {
    expect(contact).not.toMatch(/\$\d/);
  });

  test("no dead href=# contact link is left anywhere", () => {
    for (const f of shippedFiles) {
      expect(fs.readFileSync(f, "utf8"), path.relative(ROOT, f)).not.toContain('href="#"');
    }
  });
});

test.describe("404 metadata", () => {
  test("the root layout no longer publishes a canonical every route inherits", () => {
    const layout = fs.readFileSync(path.join(ROOT, "app/layout.tsx"), "utf8");
    expect(layout).not.toMatch(/alternates:\s*\{[^}]*canonical/);
    expect(layout).not.toMatch(/robots:\s*\{[\s\S]*?index:\s*true/);
  });

  test("the homepage now carries its own canonical", () => {
    const home = fs.readFileSync(path.join(ROOT, "app/page.tsx"), "utf8");
    expect(home).toContain('canonical: "https://www.lasvegasmahj.com"');
  });

  test("not-found declares its own title", () => {
    const nf = fs.readFileSync(path.join(ROOT, "app/not-found.tsx"), "utf8");
    expect(nf).toContain("Page Not Found");
  });
});

test.describe("pacific ISO conversion", () => {
  const PACIFIC = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });

  // Every wall clock we emit must read back as the same wall clock in Pacific.
  const cases: Array<[number, number, number, number, number, string]> = [
    [2026, 9, 8, 10, 30, "-07:00"],
    [2026, 10, 31, 23, 0, "-07:00"],
    [2026, 11, 1, 3, 0, "-08:00"],
    [2026, 12, 25, 18, 0, "-08:00"],
    [2027, 3, 13, 23, 0, "-08:00"],
    [2027, 3, 14, 3, 0, "-07:00"],
    [2028, 2, 29, 9, 0, "-08:00"],
  ];

  for (const [y, mo, d, h, mi, offset] of cases) {
    test(`${y}-${mo}-${d} ${h}:${mi} round trips with ${offset}`, () => {
      const iso = pacificIso(y, mo, d, h, mi);
      expect(iso.endsWith(offset), iso).toBe(true);
      const parts = Object.fromEntries(
        PACIFIC.formatToParts(new Date(iso)).map((p) => [p.type, p.value]),
      );
      expect(Number(parts.year)).toBe(y);
      expect(Number(parts.month)).toBe(mo);
      expect(Number(parts.day)).toBe(d);
      expect(Number(parts.hour) % 24).toBe(h);
      expect(Number(parts.minute)).toBe(mi);
    });
  }

  test("the studio address matcher survives abbreviation differences", () => {
    expect(isStudioAddress("Lucky Hare, 8687 West Sahara Avenue, Suite 200, Las Vegas Nevada 89117")).toBe(true);
    expect(isStudioAddress("Inside Lucky Hare, 8687 W. Sahara Ave., Suite 200, Las Vegas, NV 89117")).toBe(true);
    expect(isStudioAddress("Honey Salt, Las Vegas")).toBe(false);
    expect(isStudioAddress("")).toBe(false);
  });
});

test.describe("schedule Event schema", () => {
  const base: ScheduleEventInput = {
    title: "Mahj 101 with Shauna",
    description: "Beginner class.",
    url: "https://bookwhen.com/lasvegasmahjong/e/ev-test",
    startIso: "2026-09-08T10:30:00-07:00",
    endIso: "2026-09-08T13:00:00-07:00",
    venueKind: "studio",
  };

  test("emits one Event per studio session with a real street address", () => {
    const [ev] = buildScheduleEventSchema([base]);
    expect(ev["@type"]).toBe("Event");
    expect(ev.startDate).toBe("2026-09-08T10:30:00-07:00");
    expect(ev.endDate).toBe("2026-09-08T13:00:00-07:00");
    expect(ev.location.address.streetAddress).toBe("8687 W. Sahara Ave., Suite 200");
    expect(ev.location.address.postalCode).toBe("89117");
    expect(ev.eventAttendanceMode).toBe("https://schema.org/OfflineEventAttendanceMode");
  });

  test("invents no price, availability, rating or performer", () => {
    const [ev] = buildScheduleEventSchema([base]) as unknown as Array<Record<string, unknown>>;
    for (const forbidden of ["offers", "performer", "aggregateRating", "review", "maximumAttendeeCapacity"]) {
      expect(ev, forbidden).not.toHaveProperty(forbidden);
    }
  });

  test("skips venues whose street address we cannot source", () => {
    expect(buildScheduleEventSchema([{ ...base, venueKind: "partner" }])).toEqual([]);
    expect(buildScheduleEventSchema([{ ...base, venueKind: "unknown" }])).toEqual([]);
  });

  test("skips anything without a derivable ISO start", () => {
    expect(buildScheduleEventSchema([{ ...base, startIso: undefined }])).toEqual([]);
  });

  test("an empty schedule emits nothing", () => {
    expect(buildScheduleEventSchema([])).toEqual([]);
  });
});
