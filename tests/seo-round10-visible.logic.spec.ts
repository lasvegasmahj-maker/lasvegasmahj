import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Round 10, 2026-11-12: visible improvements the owner approved, built on business facts she
// confirmed that day. Each test pins one of those decisions so a later edit cannot quietly
// undo it.
//   - Lessons happen at the studio, at customers' homes and at venues, including in
//     Summerlin and Henderson. The studio is the one business location.
//   - Accepted payments: card, cash, Venmo and Zelle. Online checkout takes card only.
//   - The Instagram and TikTok accounts are the business's accounts.
//   - The logo she supplied is approved for the favicon.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

test("payment methods: the structured data and the visible note name the same four", () => {
  expect(read("app/layout.tsx")).toContain('paymentAccepted: "Cash, Credit Card, Venmo, Zelle"');
  // The second half matters as much as the first: the booking calendar is beside this note,
  // and only card works there.
  expect(read("app/schedule/page.tsx")).toContain("We accept card, cash, Venmo and Zelle; online checkout takes card only.");
});

test("the About page declares Instagram and TikTok as the business's accounts, not Shauna's own", () => {
  const src = read("app/about/page.tsx");
  const person = src.slice(src.indexOf('"@type": "Person"'), src.indexOf("const breadcrumb"));
  const business = person.slice(person.indexOf("worksFor:"), person.indexOf("knowsAbout"));
  for (const url of ["https://www.instagram.com/lasvegasmahjong", "https://www.tiktok.com/@lasvegasmahjong"]) {
    expect(business).toContain(url);
    expect(person.replace(business, "")).not.toContain(url);
  }
});

test("the favicon files are the owner's logo, not the stock framework icon", () => {
  const bytes = (rel: string) => fs.readFileSync(path.join(ROOT, rel));
  const sha256 = (rel: string) => crypto.createHash("sha256").update(bytes(rel)).digest("hex");
  const stockFaviconMd5 = "c30c7d42707a47a3f4591831641e50dc";
  expect(crypto.createHash("md5").update(bytes("app/favicon.ico")).digest("hex")).not.toBe(stockFaviconMd5);
  // An ICO lists its frames after a 6-byte header, 16 bytes per frame, width then height.
  const ico = bytes("app/favicon.ico");
  const frames = Array.from({ length: ico.readUInt16LE(4) }, (_, i) => [ico[6 + i * 16], ico[7 + i * 16]]);
  expect(frames).toEqual([[16, 16], [32, 32], [48, 48]]);
  // Width and height sit at fixed offsets in a PNG header.
  const size = (rel: string) => [bytes(rel).readUInt32BE(16), bytes(rel).readUInt32BE(20)];
  expect(size("app/icon.png")).toEqual([144, 144]);
  expect(size("app/apple-icon.png")).toEqual([180, 180]);
  // Approved by the owner: the pink die from her logo for every small icon (2026-11-13) and for the
  // iPhone home-screen icon (2026-11-15), cut from her logo file the same way as the tab icon.
  // Pinned so a re-export, even one that looks the same, needs her approval.
  expect(sha256("app/favicon.ico")).toBe("ccfc74dbd76c1775c023764fc5ea9e628a905c32dba2497488a56093d8355152");
  expect(sha256("app/icon.png")).toBe("f34de1dae61190005385baf286fb3a86e59a0dd0bb16892409ffb7fc41730489");
  expect(sha256("app/apple-icon.png")).toBe("72e5ca249e12ff4f09e7c64ac16245f23a03075da8d35dc9610f4d92e8d107b0");
});

test("the contact form can never put what a visitor typed into the page address", () => {
  // Without method="post", a submit made before the script loads reloads /contact with the
  // name, email, phone and message in the query string. Any analytics tag records the full
  // address on its own, so this is what keeps personal details out of analytics. The action
  // sends that early submit to Formspree, so the message is delivered instead of being posted
  // to /contact itself, which the live host answers with an error.
  const form = read("components/contact-form.tsx");
  expect(form).toContain('<form method="post" action={FORMSPREE} onSubmit={handleSubmit}>');
  expect(form).toContain('const FORMSPREE = "https://formspree.io/f/mwvrnjrb";');
});

test("analytics receives only values the site defines, through one listener and the form's outcome events", () => {
  const form = read("components/contact-form.tsx");
  // Every call passes nothing or the two-field `lead` object; the FormData never reaches it.
  const calls = [...form.matchAll(/trackEvent\(([^)]*)\)/g)].map((m) => m[1]);
  expect(calls.sort()).toEqual(['"contact_form_attempt", lead', '"contact_form_error", lead', '"contact_form_error", lead', '"contact_form_success", lead', '"contact_submit"']);
  expect(form).toContain("const lead = { source_label: source, inquiry_type: INQUIRY_TYPES.includes(inquiry) ? inquiry : undefined };");
  // No account ID may be written into the code: IDs come from the environment only.
  for (const rel of ["lib/analytics.ts", "components/analytics.tsx", "components/track-clicks.tsx"]) {
    expect(read(rel), rel).not.toMatch(/\bG-[A-Z0-9]{6,}\b|\bGTM-[A-Z0-9]{4,}\b/);
  }
});
