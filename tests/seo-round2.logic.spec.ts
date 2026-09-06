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

/** Every `<a href="X" className="btn-...">TEXT</a>` in a file, as {href, text}. */
function ctas(rel: string) {
  const src = read(rel);
  const out: { href: string; text: string }[] = [];
  for (const m of src.matchAll(/<a\s+href="([^"]+)"[^>]*className="(btn-[^"]*)"[^>]*>([^<]*)<\/a>/g)) {
    out.push({ href: m[1], text: m[3].trim() });
  }
  return out;
}

// The five commercially important inquiry pages, and the CTA text on each that is a
// genuine "talk to a human about an event" action rather than a booking.
const INQUIRY_PAGES: Record<string, string[]> = {
  "app/mahjong-corporate-las-vegas/page.tsx": ["Request a Quote", "Request a Corporate Quote"],
  "app/corporate-team-building-las-vegas/page.tsx": ["Request a Quote", "Request a Quote"],
  "app/conference-activities-las-vegas/page.tsx": ["Request a Quote", "Request a Quote"],
  "app/convention-activities-las-vegas/page.tsx": ["Request a Convention Quote", "Request a Quote"],
  "app/mahjong-parties-las-vegas/page.tsx": [
    "Plan Your Event",
    "Book a Birthday Party",
    "Get a Quote",
    "Book Your Event",
  ],
};

test.describe("inquiry CTAs reach /contact", () => {
  for (const [file, labels] of Object.entries(INQUIRY_PAGES)) {
    test(`${file}: every quote/event CTA points at /contact`, () => {
      const found = ctas(file);
      for (const label of labels) {
        const matches = found.filter((c) => c.text === label);
        expect(matches.length, `${file} should still have a CTA labelled "${label}"`).toBeGreaterThan(0);
        for (const m of matches) expect(m.href, `"${label}" on ${file}`).toBe("/contact");
      }
    });

    test(`${file}: no CTA bounces to a homepage anchor`, () => {
      const anchors = ctas(file).filter((c) => c.href === "/" || c.href.startsWith("/#") || c.href === "#");
      expect(anchors, `${file} still sends a CTA back to the homepage`).toEqual([]);
    });
  }

  test("the inquiry pages carry exactly twelve /contact CTAs between them", () => {
    const total = Object.keys(INQUIRY_PAGES)
      .flatMap((f) => ctas(f))
      .filter((c) => c.href === "/contact").length;
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
      expect(ctas(file).filter((c) => c.href === "/contact")).toEqual([]);
    });
  }

  test("the homepage lessons section still books through /schedule", () => {
    const src = read("components/classes.tsx");
    expect(src).toContain('href="/schedule"');
    expect(src).not.toContain('href="/contact"');
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
    expect(src).not.toContain('href="/contact"');
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
  test("no shipped file publishes the business phone number", () => {
    const phone = /847[.\s-]?609[.\s-]?3112|\btelephone\b|tel:/i;
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
