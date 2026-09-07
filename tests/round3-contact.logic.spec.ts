import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Round 3 is about lead quality, not routing. Round 2 pointed the commercial CTAs at
// /contact; this round makes the form ask enough to answer an inquiry properly, and tags
// each CTA with ?source= so a corporate quote request and a birthday inquiry stop arriving
// indistinguishable.
//
// The load-bearing invariant is that two lists agree: the slugs written into the CTA hrefs
// and the slugs the form is willing to honour. If they drift, attribution silently degrades
// to "General" on a live page and nothing else in the suite would notice.

const ROOT = path.join(__dirname, "..");
const FORM = "components/contact-form.tsx";

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

// Several assertions below count or forbid identifiers that also appear in prose. Counting
// them against the raw file makes an explanatory comment fail the build, so strip comments
// first and assert against the code alone.
function readCode(rel: string) {
  return read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

// Every page that tags its /contact CTAs, and the slug each one must use.
const TAGGED_PAGES: Record<string, { slug: string; count: number }> = {
  "app/mahjong-corporate-las-vegas/page.tsx": { slug: "corporate", count: 2 },
  "app/corporate-team-building-las-vegas/page.tsx": { slug: "team-building", count: 2 },
  "app/conference-activities-las-vegas/page.tsx": { slug: "conference", count: 2 },
  "app/convention-activities-las-vegas/page.tsx": { slug: "convention", count: 2 },
  "app/mahjong-parties-las-vegas/page.tsx": { slug: "parties", count: 4 },
  "app/private-mahjong-lessons-las-vegas/page.tsx": { slug: "private-lessons", count: 3 },
};

// The nav and the footer are deliberately left bare. They are one shared component each,
// rendered on every page, so a slug there could only ever be a single sitewide constant,
// and the owner grouped nav, footer and direct traffic into one bucket. Bare means the form
// falls back to GENERAL_SOURCE, which is that bucket.
const UNTAGGED = ["components/nav.tsx", "components/footer.tsx"];

function sourceSlugsInForm() {
  const src = read(FORM);
  const block = src.slice(src.indexOf("const SOURCES"), src.indexOf("const GENERAL_SOURCE"));
  return [...block.matchAll(/^\s*"?([a-z-]+)"?:\s*\{\s*label:/gm)].map((m) => m[1]);
}

/** Button-styled anchors pointing at /contact, tagged or not. Plain text links do not count. */
function contactButtonCtas(rel: string) {
  const out: string[] = [];
  for (const m of read(rel).matchAll(/<a\s([^>]*)>/g)) {
    if (!/className="[^"]*\bbtn-/.test(m[1])) continue;
    const href = m[1].match(/href="(\/contact[^"]*)"/);
    if (href) out.push(href[1]);
  }
  return out;
}

/** The components the homepage actually renders, from home-client's own import list. */
function homeClientImports() {
  const src = read("components/home-client.tsx");
  return [...src.matchAll(/from "@\/(components\/[a-z-]+)"/g)].map((m) => `${m[1]}.tsx`);
}

function contactHrefs(rel: string) {
  return [...read(rel).matchAll(/href="(\/contact[^"]*)"/g)].map((m) => m[1]);
}

test.describe("source attribution vocabulary", () => {
  test("the form honours exactly the slugs the CTAs use, in both directions", () => {
    const inForm = sourceSlugsInForm().sort();
    const inCtas = [...new Set(Object.values(TAGGED_PAGES).map((p) => p.slug))].sort();
    // Bidirectional: a slug the CTAs never use is dead code, and a slug the form does not
    // know silently degrades that page's leads to "General".
    expect(inForm).toEqual(inCtas);
    expect(inForm).toHaveLength(6);
  });

  test("every honoured slug is lowercase, hyphenated and URL safe", () => {
    for (const slug of sourceSlugsInForm()) {
      expect(slug, slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(encodeURIComponent(slug), slug).toBe(slug);
    }
  });

  test("each slug maps to a human readable label and a real inquiry type", () => {
    const src = read(FORM);
    const block = src.slice(src.indexOf("const SOURCES"), src.indexOf("const GENERAL_SOURCE"));
    const entries = [...block.matchAll(/label:\s*"([^"]+)",\s*inquiry:\s*"([^"]+)"/g)];
    expect(entries).toHaveLength(6);

    const types = inquiryTypes();
    for (const [, label, inquiry] of entries) {
      // The label is what lands in the inbox, so it must read as a phrase, not a slug.
      expect(label, label).toMatch(/^[A-Z]/);
      expect(label, label).not.toMatch(/[-_]/);
      // A prefill that is not an option would render the required select as blank.
      expect(types, `${label} prefills an inquiry type that does not exist`).toContain(inquiry);
    }
  });

  test("the fallback covers nav, footer and direct traffic", () => {
    const fallback = read(FORM).match(/const GENERAL_SOURCE = "([^"]+)"/);
    expect(fallback).not.toBeNull();
    expect(fallback![1]).toMatch(/general/i);
    // A slug outside the allowlist must resolve to the fallback, never reach the inbox
    // verbatim. GENERAL_SOURCE is therefore both declared and used as the default.
    const src = readCode(FORM);
    expect((src.match(/GENERAL_SOURCE/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(src).toMatch(/match \? match\.label : GENERAL_SOURCE/);
  });
});

test.describe("CTA tagging", () => {
  for (const [file, { slug, count }] of Object.entries(TAGGED_PAGES)) {
    test(`${file} tags all ${count} of its /contact CTAs with ?source=${slug}`, () => {
      const hrefs = contactHrefs(file);
      expect(hrefs, `${file} lost a /contact CTA`).toHaveLength(count);
      for (const href of hrefs) expect(href, file).toBe(`/contact?source=${slug}`);
    });
  }

  test("no page carries a bare or malformed /contact CTA", () => {
    for (const file of Object.keys(TAGGED_PAGES)) {
      for (const href of contactHrefs(file)) {
        expect(href, `${file} has an untagged CTA`).not.toBe("/contact");
        expect(href, `${file} has a malformed query`).toMatch(/^\/contact\?source=[a-z-]+$/);
      }
    }
  });

  test("the nav and the footer stay bare so they fall back to General", () => {
    for (const file of UNTAGGED) {
      const hrefs = contactHrefs(file);
      expect(hrefs, `${file} should link to /contact once`).toEqual(["/contact"]);
    }
  });

  test("fifteen CTAs carry attribution in total", () => {
    const total = Object.keys(TAGGED_PAGES).reduce((n, f) => n + contactHrefs(f).length, 0);
    expect(total).toBe(15);
  });
});

function inquiryTypes() {
  const src = read(FORM);
  const start = src.indexOf("const INQUIRY_TYPES");
  // Bounded by the array's own closing bracket: anything looser picks up unrelated string
  // literals declared below it and silently inflates the list.
  const block = src.slice(start, src.indexOf("];", start));
  return [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
}

test.describe("form fields", () => {
  test("the seven visible fields are present, and nothing else asks a question", () => {
    const src = read(FORM);
    for (const name of ["name", "email", "phone", "inquiry_type", "group_size", "preferred_date", "message"]) {
      expect(src, `${name} field missing`).toContain(`name="${name}"`);
    }
    expect(src).toContain('name="source"');
    expect(src).toContain('type="hidden"');
  });

  test("name, email, phone and inquiry type are required, and nothing else is", () => {
    const src = readCode(FORM);
    // Group size and preferred date stay optional on purpose: an inquiry that arrives
    // without them is still a lead, and forcing a guessed date produces worse data than a
    // blank one. Phone became required on owner instruction (contact consistency cleanup).
    const optional = ["contact-group-size", "contact-date", "contact-message"];
    for (const id of optional) {
      const field = src.slice(src.indexOf(`id="${id}"`), src.indexOf(`id="${id}"`) + 260);
      expect(field, `${id} must not be required`).not.toMatch(/\brequired\b/);
    }
    expect((src.match(/\brequired\b/g) ?? []).length, "exactly four required controls").toBe(4);
  });

  test("the inquiry types are concise and match real Las Vegas Mahjong services", () => {
    const types = inquiryTypes();
    expect(types.length).toBeGreaterThanOrEqual(4);
    expect(types.length).toBeLessThanOrEqual(8);
    for (const t of types) {
      expect(t, t).toMatch(/^[A-Z]/);
      expect(t.length, `${t} is too long for a dropdown`).toBeLessThanOrEqual(32);
    }
    // Every service line the site actually sells a contact form for.
    for (const required of ["Private Lesson", "Corporate or Team Building", "Something Else"]) {
      expect(types).toContain(required);
    }
  });

  test("group size ranges use ASCII hyphens, not dashes", () => {
    // Repo style rule: no en dashes anywhere. The pre-existing inquiry modal uses &ndash;
    // and is out of scope for this round, but new copy must not.
    const src = read(FORM);
    expect(src).not.toContain("&ndash;");
    expect(src).not.toContain("&mdash;");
    expect(src).not.toMatch(/[–—]/);
  });

  test("the phone field collects the visitor's number and is required", () => {
    const src = read(FORM);
    expect(src).toMatch(/type="tel"/);
    expect(src).toContain('name="phone"');
    expect(src).toContain('autoComplete="tel"');
    expect(src).toContain('inputMode="tel"');
    const field = src.slice(src.indexOf('id="contact-phone"'), src.indexOf('id="contact-phone"') + 320);
    expect(field, "the phone field must be required").toMatch(/\brequired\b/);
    expect(src).toContain('htmlFor="contact-phone"');
  });

  test("collecting a phone number did not publish one", () => {
    // The owner's own number must still never appear. A tel: link would make the site
    // publish a number to call, and a `telephone` key would put one in structured data.
    // Comments are stripped: the validation comment lists example formats on purpose, and
    // those are documentation, not published numbers.
    const src = readCode(FORM);
    expect(src).not.toMatch(/tel:/);
    expect(src).not.toMatch(/\btelephone\b/i);
    expect(src).not.toMatch(/847[^0-9a-z]{0,4}609[^0-9a-z]{0,4}3112/i);
    // The one number in the file is the placeholder inside the field asking the VISITOR for
    // theirs, which is the same 702 555 pattern the homepage modal has always used.
    const numbers = [...src.matchAll(/\d{3}[.\s()-]{0,4}\d{3}[.\s-]\d{4}/g)].map((m) => m[0]);
    expect(numbers).toEqual(["702) 555-0123"]);
  });

  test("phone validation counts digits instead of matching one format", () => {
    const src = readCode(FORM);
    expect(src).toContain("validatePhone");
    expect(src).toContain("setCustomValidity");
    // A brittle pattern attribute would reject formats the owner explicitly wants accepted.
    expect(src).not.toMatch(/pattern="/);
  });

  test("autocomplete helps with name, email and phone only", () => {
    const src = read(FORM);
    for (const a of ["name", "email", "tel"]) expect(src).toContain(`autoComplete="${a}"`);
    expect((src.match(/autoComplete=/g) ?? []).length).toBe(3);
  });

  test("every visible control is labelled", () => {
    const src = read(FORM);
    const ids = [...src.matchAll(/\sid="(contact-[a-z-]+)"/g)].map((m) => m[1]);
    expect(ids.length).toBe(7);
    for (const id of ids) expect(src, `${id} has no label`).toContain(`htmlFor="${id}"`);
  });
});

test.describe("delivery path is unchanged", () => {
  test("the same Formspree endpoint, posted the same way", () => {
    const src = read(FORM);
    expect(src).toContain("https://formspree.io/f/mwvrnjrb");
    expect(src).toContain('headers: { Accept: "application/json" }');
    expect(src).toContain('method: "POST"');
    expect(src).toContain("new FormData(form)");
    // Round 1 pins this literal; keep the call shape exactly.
    expect(src).toContain('trackEvent("contact_submit")');
  });

  test("no underscore prefixed field is sent", () => {
    // Formspree consumes _subject, _gotcha and friends as directives rather than
    // forwarding them. A _gotcha honeypot in particular answers 200 for a discarded
    // submission, which would show the visitor "Message Sent!" for a lead that vanished.
    expect(read(FORM)).not.toMatch(/name="_/);
  });

  test("a 200 carrying an errors body is treated as a failure", () => {
    const src = read(FORM);
    expect(src).toContain("hasErrors");
    expect(src).toContain("body?.errors");
    // A non-JSON 2xx is a normal success shape and must not be reported as an error.
    expect(src).toMatch(/catch\s*\{\s*return false;/);
  });

  test("reading the query string cannot break the static prerender of /contact", () => {
    const src = readCode(FORM);
    // useSearchParams would force a Suspense boundary, and that boundary replaces the form
    // with a BAILOUT_TO_CLIENT_SIDE_RENDERING marker in the prerendered HTML.
    expect(src).not.toContain("useSearchParams");
    expect(src).not.toContain("next/navigation");
    expect(src).toContain("window.location.search");
    // The page itself must stay untouched: no Suspense, no searchParams, no dynamic export.
    const page = readCode("app/contact/page.tsx");
    expect(page).not.toContain("Suspense");
    expect(page).not.toContain("searchParams");
    expect(page).not.toContain("export const dynamic");
  });
});

test.describe("protected pages and SEO are untouched", () => {
  test("the contact canonical stays free of a query string", () => {
    const page = read("app/contact/page.tsx");
    expect(page).toContain('canonical: "https://www.lasvegasmahj.com/contact"');
    expect(page).not.toMatch(/canonical:.*\?/);
  });

  test("no source tagged URL reaches the sitemap", () => {
    const sitemap = read("app/sitemap.ts");
    expect(sitemap).toContain("https://www.lasvegasmahj.com/contact");
    expect(sitemap).not.toContain("?source=");
  });

  test("structured data links to the clean contact URL only", () => {
    for (const file of [...Object.keys(TAGGED_PAGES), "app/contact/page.tsx"]) {
      const src = read(file);
      for (const m of src.matchAll(/"(https:\/\/www\.lasvegasmahj\.com[^"]*)"/g)) {
        expect(m[1], `${file} puts a query string in structured data`).not.toContain("?source=");
      }
    }
  });

  test("the homepage and the main lessons page gained no /contact CTA", () => {
    // app/page.tsx is an eleven line shell that renders <HomeClient />, so asserting against
    // it would pass no matter what shipped. Walk what the homepage actually renders instead.
    // Nav and footer are shared chrome and link to /contact on every page by design, so the
    // question here is whether a BUTTON CTA appeared, which is what round 3 actually adds.
    const homepage = ["components/home-client.tsx", ...homeClientImports()];
    for (const file of [...homepage, "app/mahjong-lessons-las-vegas/page.tsx"]) {
      expect(contactButtonCtas(file), `${file} must stay out of this round`).toEqual([]);
    }
    // Guards the guard: if the import scrape ever returns nothing, the loop above goes empty.
    expect(homepage.length).toBeGreaterThan(10);
    expect(homepage).toContain("components/private-events.tsx");
  });
});
