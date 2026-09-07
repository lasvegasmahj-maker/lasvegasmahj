import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// The contact consistency cleanup does three things: it collects the visitor's phone number
// on both entry points, it makes the homepage modal and /contact one form rather than two
// schemas, and it moves the public business email to hello@.
//
// The rule that did NOT change is the important one. The owner's own number must still never
// be published: no tel: link, no `telephone` in structured data, no business number in copy.
// Collecting a number and publishing one are opposite things and these tests keep them apart.

const ROOT = path.join(__dirname, "..");
const FORM = "components/contact-form.tsx";
const MODAL = "components/inquiry-modal.tsx";

function read(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function readCode(rel: string) {
  return read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

const SHIPPED_DIRS = ["app", "components", "lib", "content"];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|css|json|md)$/.test(entry.name)) out.push(full);
  }
  return out;
}
const shipped = SHIPPED_DIRS.flatMap((d) => walk(path.join(ROOT, d)));

test.describe("one lead schema, not two", () => {
  test("the homepage modal renders the same form component as /contact", () => {
    const src = readCode(MODAL);
    expect(src).toContain('from "@/components/contact-form"');
    expect(src).toContain("<ContactForm");
    // If the modal ever grows its own form again, the two schemas diverge silently.
    expect(src, "the modal must not declare its own form").not.toContain("<form");
    expect(src, "the modal must not post on its own").not.toContain("formspree.io");
    expect(src, "the modal must not build its own payload").not.toContain("FormData");
  });

  test("the modal carries its own source so homepage leads are attributable", () => {
    expect(readCode(MODAL)).toMatch(/source="Homepage Plan Your Event"/);
  });

  test("the old duplicate field names are gone", () => {
    // first_name/last_name/interest/dates were the modal's private vocabulary. One inbox
    // receiving two shapes was the thing this cleanup existed to end.
    const src = read(MODAL);
    for (const dead of ['name="first_name"', 'name="last_name"', 'name="interest"', 'name="dates"']) {
      expect(src, `${dead} should no longer exist`).not.toContain(dead);
    }
  });

  test("only one file in the repo posts to Formspree", () => {
    const posters = shipped.filter((f) => /formspree\.io/.test(fs.readFileSync(f, "utf8")));
    expect(posters.map((f) => path.relative(ROOT, f))).toEqual([FORM]);
  });
});

test.describe("phone is collected, never published", () => {
  test("the visitor is asked for a phone number on both entry points", () => {
    const src = read(FORM);
    expect(src).toContain('name="phone"');
    expect(src).toMatch(/type="tel"/);
    const field = src.slice(src.indexOf('id="contact-phone"'), src.indexOf('id="contact-phone"') + 320);
    expect(field).toMatch(/\brequired\b/);
    // The modal renders the same component, so it inherits the same required field.
    expect(readCode(MODAL)).toContain("<ContactForm");
  });

  test("no shipped file publishes a number to call", () => {
    // tel: is the giveaway for a click-to-call link; `telephone` is the structured data key.
    const offenders = shipped.filter((f) => /tel:|\btelephone\b/i.test(fs.readFileSync(f, "utf8")));
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  test("no shipped file contains the owner's business number", () => {
    const BUSINESS_PHONE = /847[^0-9a-z]{0,4}609[^0-9a-z]{0,4}3112/i;
    // Guards the guard: this must still match every way the number could be written.
    for (const s of ["847-609-3112", "(847) 609-3112", "847.609.3112", "8476093112"]) {
      expect(BUSINESS_PHONE.test(s), s).toBe(true);
    }
    const offenders = shipped.filter((f) => BUSINESS_PHONE.test(fs.readFileSync(f, "utf8")));
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  test("the only phone-shaped string in the form is the visitor placeholder", () => {
    const numbers = [...readCode(FORM).matchAll(/\d{3}[.\s()-]{0,4}\d{3}[.\s-]\d{4}/g)].map((m) => m[0]);
    expect(numbers).toEqual(["702) 555-0123"]);
  });

  test("validation counts digits rather than enforcing one format", () => {
    const src = readCode(FORM);
    expect(src).toContain("setCustomValidity");
    expect(src).not.toMatch(/pattern="/);
    // Reproduce the shipped rule and check it against the formats the owner listed.
    const accepts = (v: string) => {
      const d = v.replace(/\D/g, "");
      return d.length >= 10 && d.length <= 15;
    };
    for (const good of ["7025551212", "702-555-1212", "(702) 555-1212", "+1 702 555 1212", "702.555.1212"]) {
      expect(accepts(good), good).toBe(true);
    }
    for (const bad of ["", "   ", "555", "abc", "70255512"]) {
      expect(accepts(bad), bad).toBe(false);
    }
  });
});

test.describe("public business email", () => {
  const PUBLIC = "hello@lasvegasmahj.com";

  test("hello@ is the address the site shows", () => {
    const users = shipped.filter((f) => fs.readFileSync(f, "utf8").includes(PUBLIC));
    expect(users.length, "hello@ should appear in the shipped site").toBeGreaterThan(3);
  });

  test("the old gmail address is gone from shipped code", () => {
    const offenders = shipped.filter((f) => /lasvegasmahj@gmail\.com/i.test(fs.readFileSync(f, "utf8")));
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  test("the personal address is never published", () => {
    const offenders = shipped.filter((f) => /shauna@lasvegasmahj\.com/i.test(fs.readFileSync(f, "utf8")));
    expect(offenders.map((f) => path.relative(ROOT, f))).toEqual([]);
  });

  test("structured data and the visible page agree on the address", () => {
    for (const f of ["app/layout.tsx", "lib/schema.ts", "app/contact/page.tsx", FORM, "components/classes.tsx"]) {
      expect(read(f), `${f} should use the public address`).toContain(PUBLIC);
    }
  });

  test("the Formspree endpoint did not move with the email", () => {
    // The public address changing is a copy decision. Delivery is a separate mechanism and
    // the owner has already proven this endpoint works.
    expect(read(FORM)).toContain("https://formspree.io/f/mwvrnjrb");
  });
});

test.describe("the dropdowns show they are dropdowns", () => {
  const css = read("app/globals.css");

  test("a caret is drawn on every select", () => {
    const block = css.slice(css.indexOf(".form-group select {"), css.indexOf(".form-group select option"));
    expect(block).toContain("appearance: none");
    expect(block).toMatch(/background-image:\s*url\("data:image\/svg\+xml/);
    expect(block).toContain("background-repeat: no-repeat");
    expect(block).toMatch(/padding-right:/);
  });

  test("the caret is inline, so it cannot fail to load", () => {
    const block = css.slice(css.indexOf(".form-group select {"), css.indexOf(".form-group select option"));
    expect(block).not.toMatch(/url\("?https?:/);
  });

  test("the caret uses a brand colour already in the palette", () => {
    const block = css.slice(css.indexOf(".form-group select {"), css.indexOf(".form-group select option"));
    // %2339e639 is --green url-encoded. A new colour would be a redesign.
    expect(block.toLowerCase()).toContain("%2339e639");
    expect(css).toContain("--green: #39e639");
  });
});
