import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Round 2 is one thing only: high-intent inquiry CTAs on the commercial pages used to
// bounce the visitor back to a homepage anchor. A real /contact page exists now, so a
// "Request a Corporate Quote" button goes to /contact.
//
// The other half of the job is not over-correcting. Booking CTAs, lesson CTAs, /schedule,
// Ask, rules and shop links are deliberately untouched, and these tests fail if a later
// session "tidies" them into /contact too.

const ROOT = path.join(__dirname, "..");

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

/**
 * Every button-styled anchor in a file, as {href, path, query, text}. Round 3 tags the
 * inquiry CTAs with `?source=<slug>`, so `path` is what the destination assertions compare
 * and `query` carries the attribution marker. Comparing raw `href` would fail on every
 * tagged CTA; comparing only `path` would let a malformed query ship, so
 * tests/round3-contact.logic.spec.ts checks `query` against the allowlist. Attribute order is not fixed by
 * anything, so the tag is matched first and href/className are pulled out of it separately;
 * keying on `<a href=` first would make `<a className=... href=...>` invisible and silently
 * void every negative assertion below.
 */
function ctas(rel: string) {
  const src = read(rel);
  const out: { href: string; path: string; query: string; text: string }[] = [];
  for (const m of src.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)) {
    const attrs = m[1];
    if (!/className="[^"]*\bbtn-/.test(attrs)) continue;
    const href = attrs.match(/href="([^"]*)"/);
    if (!href) continue;
    const [hrefPath, query = ""] = href[1].split("?");
    out.push({ href: href[1], path: hrefPath, query, text: m[2].replace(/<[^>]*>/g, "").trim() });
  }
  return out;
}

test("the CTA parser sees a button whichever order its attributes are written in", () => {
  // Guards the helper itself: if this regresses, every assertion built on it goes vacuous.
  const parse = (src: string) => {
    const out: string[] = [];
    for (const m of src.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)) {
      if (!/className="[^"]*\bbtn-/.test(m[1])) continue;
      const h = m[1].match(/href="([^"]*)"/);
      if (h) out.push(h[1]);
    }
    return out;
  };
  expect(parse('<a href="/contact" className="btn-primary">Go</a>')).toEqual(["/contact"]);
  expect(parse('<a className="btn-primary" href="/contact">Go</a>')).toEqual(["/contact"]);
  expect(parse('<a className="btn-primary" style={{}} href="/contact">Go</a>')).toEqual(["/contact"]);
  expect(parse('<a href="/contact">plain link</a>')).toEqual([]);
});

test("the CTA parser splits a source-tagged href into path and query", () => {
  // Round 3 tags inquiry CTAs with ?source=. If this split regresses, every destination
  // assertion below compares the wrong half of the href and stops meaning anything.
  const tagged = ctas("app/mahjong-corporate-las-vegas/page.tsx");
  expect(tagged.length).toBeGreaterThan(0);
  for (const c of tagged) {
    expect(c.path, c.href).not.toContain("?");
    expect(c.query, c.href).not.toContain("?");
    expect(c.href).toBe(c.query ? `${c.path}?${c.query}` : c.path);
  }
  expect(tagged.some((c) => c.query !== "")).toBe(true);
});

// The five commercially important inquiry pages, and the CTA text on each that is a
// genuine "talk to a human about an event" action rather than a booking.
// `count` is how many /contact CTAs the page must have, so a page that loses one fails even
// when its remaining CTA still carries a listed label.
const INQUIRY_PAGES: Record<string, { labels: string[]; count: number }> = {
  "app/mahjong-corporate-las-vegas/page.tsx": { labels: ["Request a Quote", "Request a Corporate Quote"], count: 2 },
  "app/corporate-team-building-las-vegas/page.tsx": { labels: ["Request a Quote"], count: 2 },
  "app/conference-activities-las-vegas/page.tsx": { labels: ["Request a Quote"], count: 2 },
  "app/convention-activities-las-vegas/page.tsx": { labels: ["Request a Quote", "Request a Convention Quote"], count: 2 },
  "app/mahjong-parties-las-vegas/page.tsx": {
    labels: ["Plan Your Event", "Book a Birthday Party", "Get a Quote", "Book Your Event"],
    count: 4,
  },
};

test.describe("inquiry CTAs reach /contact", () => {
  for (const [file, { labels, count }] of Object.entries(INQUIRY_PAGES)) {
    test(`${file}: every quote/event CTA points at /contact`, () => {
      const found = ctas(file);
      for (const label of labels) {
        const matches = found.filter((c) => c.text === label);
        expect(matches.length, `${file} should still have a CTA labelled "${label}"`).toBeGreaterThan(0);
        for (const m of matches) expect(m.path, `"${label}" on ${file}`).toBe("/contact");
      }
      expect(found.filter((c) => c.path === "/contact").length, `${file} CTA count`).toBe(count);
    });

    test(`${file}: no CTA bounces to a homepage anchor`, () => {
      const anchors = ctas(file).filter((c) => c.path === "/" || c.path.startsWith("/#") || c.path === "#");
      expect(anchors, `${file} still sends a CTA back to the homepage`).toEqual([]);
    });
  }

  test("the inquiry pages carry exactly twelve /contact CTAs between them", () => {
    const total = Object.keys(INQUIRY_PAGES)
      .flatMap((f) => ctas(f))
      .filter((c) => c.path === "/contact").length;
    expect(total).toBe(12);
  });
});

test.describe("no over-correction: booking and lesson CTAs are left alone", () => {
  // These pages hand the visitor to the homepage lessons section on purpose. That section
  // states group pricing and its own Book Now goes to /schedule, so it is a real
  // destination for a lessons CTA, not a dead end.
  const LESSON_ANCHOR_PAGES = [
    "app/mahjong-lessons-las-vegas/page.tsx",
    "app/mahjong-lessons-summerlin/page.tsx",
    "app/mahjong-lessons-henderson/page.tsx",
  ];

  for (const file of LESSON_ANCHOR_PAGES) {
    test(`${file} keeps its "Book a Lesson" CTA on /#classes`, () => {
      const booking = ctas(file).filter((c) => /^Book/.test(c.text));
      expect(booking.length, `${file} lost its booking CTA`).toBeGreaterThan(0);
      for (const b of booking) expect(b.href, `${b.text} on ${file}`).toBe("/#classes");
    });

    test(`${file} did not gain a /contact CTA`, () => {
      expect(ctas(file).filter((c) => c.path === "/contact")).toEqual([]);
    });
  }

  test("the homepage lessons section still books through /schedule", () => {
    const src = read("components/classes.tsx");
    expect(src).toContain('href="/schedule"');
    expect(src).not.toMatch(/href="\/contact[?"]/);
  });

  test("the homepage private events section still opens the inquiry modal", () => {
    const src = read("components/private-events.tsx");
    expect(src).toContain("onInquiryOpen");
    expect(src).toContain('id="private-events"');
  });

  test("Bookwhen, Ask, rules and open play CTAs are unchanged", () => {
    expect(read("app/schedule/page.tsx")).toContain('href="https://bookwhen.com/lasvegasmahjong"');
    expect(read("app/schedule/page.tsx")).toContain('href="#calendar"');
    expect(read("components/faq.tsx")).toContain('href="/ask"');
    expect(read("app/rules/etiquette/page.tsx")).toContain('href="/mahjong-open-play-las-vegas"');
    expect(read("app/mahjong-open-play-las-vegas/page.tsx")).toContain('href="/schedule"');
  });

  test("event ticket CTAs still go to the ticket URL, never to /contact", () => {
    const src = read("components/event-page.tsx");
    expect(src).toContain("href={ticketUrl}");
    expect(src).not.toMatch(/href="\/contact[?"]/);
  });
});

test.describe("round 1 behaviour that round 2 must not disturb", () => {
  const SHIPPED_DIRS = ["app", "components", "lib"];

  function walk(dir: string): string[] {
    const out: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) out.push(...walk(full));
      else if (/\.(tsx?|css)$/.test(entry.name)) out.push(full);
    }
    return out;
  }
  const shipped = SHIPPED_DIRS.flatMap((d) => walk(path.join(ROOT, d)));

  // Same definition round 1 settled on: the owner's real number, a `telephone` in
  // structured data, or a tel: link. The `(702) 555-0123` in the inquiry modal is a
  // placeholder in a field asking the VISITOR for their number and is not a business
  // number; it predates this round and is deliberately not caught here.
  // `[^0-9a-z]{0,4}` and not `[.\s-]?`: the single-separator form misses "(847) 609-3112",
  // which is how anyone would actually type it, so it would pass a real leak straight through.
  const BUSINESS_PHONE = /847[^0-9a-z]{0,4}609[^0-9a-z]{0,4}3112/i;

  test("the phone guard matches the number however it is formatted", () => {
    for (const s of ["847-609-3112", "(847) 609-3112", "847.609.3112", "847 609 3112", "8476093112", "+1 (847) 609-3112"]) {
      expect(BUSINESS_PHONE.test(s), s).toBe(true);
    }
    for (const s of ["(702) 555-0123", "8687 W. Sahara Ave", "$60 per person", "152 tiles"]) {
      expect(BUSINESS_PHONE.test(s), s).toBe(false);
    }
  });

  test("no shipped file publishes the business phone number", () => {
    const phone = new RegExp(`${BUSINESS_PHONE.source}|\\btelephone\\b|tel:`, "i");
    const hits = shipped.filter((f) => phone.test(fs.readFileSync(f, "utf8")));
    expect(hits.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  test("bachelorette is still a 301 to the parties page", () => {
    const cfg = read("next.config.ts");
    expect(cfg).toContain('source: "/blog/bachelorette-party-ideas-las-vegas"');
    expect(cfg).toContain('destination: "/mahjong-parties-las-vegas"');
    expect(cfg).toContain("statusCode: 301");
  });

  test("Things To Do is still a 410 route handler, not a page", () => {
    const dir = "app/blog/things-to-do-las-vegas-besides-gambling";
    expect(fs.existsSync(path.join(ROOT, dir, "route.ts"))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, dir, "page.tsx"))).toBe(false);
    expect(read(`${dir}/route.ts`)).toContain("410");
  });

  test("no shipped file marks a commercial page noindex", () => {
    const COMMERCIAL = [
      "app/page.tsx",
      "app/contact/page.tsx",
      "app/mahjong-lessons-las-vegas/page.tsx",
      "app/private-mahjong-lessons-las-vegas/page.tsx",
      ...Object.keys(INQUIRY_PAGES),
    ];
    for (const f of COMMERCIAL) {
      expect(read(f), f).not.toContain("index: false");
      expect(read(f), f).not.toContain("noindex");
    }
  });

  test("no dead href=\"#\" survives anywhere", () => {
    const hits = shipped.filter((f) => /href="#"/.test(fs.readFileSync(f, "utf8")));
    expect(hits.map((f) => path.relative(ROOT, f))).toEqual([]);
  });
});
