import { test, expect } from "@playwright/test";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { OG_SHAUNA } from "../lib/og";
import { OPEN_PLAY_PRICES, OPEN_PLAY_PRICE_LINE } from "../lib/pricing";
import { SHAUNA_NEON } from "../lib/studio-photos";

// The owner's approval-gallery decisions of 2026-11-15, one test per decision, so none drifts back
// without her approval.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const sha256 = (rel: string) => crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex");
const code = (rel: string) => read(rel).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const walk = (dir: string, ext: RegExp): string[] =>
  fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(`${dir}/${e.name}`, ext) : ext.test(e.name) ? [`${dir}/${e.name}`] : [],
  );
const SOURCE = [...walk("app", /\.(tsx?|css)$/), ...walk("components", /\.tsx?$/), ...walk("lib", /\.ts$/)];

const between = (src: string, start: string, end: string) => {
  const from = src.indexOf(start);
  expect(from, start).toBeGreaterThan(-1);
  const to = src.indexOf(end, from);
  expect(to, end).toBeGreaterThan(from);
  return src.slice(from, to);
};

test("1. parties page: equipment and instruction provided, not all equipment", () => {
  // Her words; the non-breaking spaces only stop "needed" from wrapping onto a line of its own.
  expect(read("app/mahjong-parties-las-vegas/page.tsx")).toContain(
    "Mahjong equipment and instruction provided&nbsp;· We&nbsp;come&nbsp;to&nbsp;you&nbsp;· No&nbsp;experience&nbsp;needed",
  );
  for (const rel of SOURCE) expect(read(rel), rel).not.toContain("All equipment included");
});

test("2. both edited photos are the versions the owner reviewed", () => {
  expect(sha256("public/lvm-cheers-toast.jpg")).toBe("08416bb2124450ae152bef3ee976f93a09f1a4341c301c257deb69b78cc2ebdf");
  expect(sha256("public/lvm-just-won-mahjong-2.jpg")).toBe("354a956fd8398af78c80518c873a3aaca515a7854a943a5be1037fcc9a79d322");
});

test("3. the homepage photo and the six share previews use the neon-sign studio photo", () => {
  const studio = `https://www.lasvegasmahj.com${SHAUNA_NEON.src}`;
  expect(OG_SHAUNA.url).toBe(studio);
  expect({ width: OG_SHAUNA.width, height: OG_SHAUNA.height, alt: OG_SHAUNA.alt }).toEqual({
    width: SHAUNA_NEON.width,
    height: SHAUNA_NEON.height,
    alt: SHAUNA_NEON.alt,
  });
  for (const route of [
    "about",
    "contact",
    "mahjong-lessons-las-vegas",
    "private-mahjong-lessons-las-vegas",
    "mahjong-lessons-summerlin",
    "mahjong-lessons-henderson",
  ]) {
    expect(read(`app/${route}/page.tsx`), route).toContain("images: [OG_SHAUNA]");
  }
  const teacher = code("components/teacher.tsx");
  expect(teacher).toContain("src={SHAUNA_NEON.src}");
  expect(teacher).toContain("alt={SHAUNA_NEON.alt}");
  // Published code only: app/layout.tsx keeps a commented-out event block that is never served.
  for (const rel of SOURCE) expect(code(rel), rel).not.toContain("shauna.jpg");
  expect(code("app/about/page.tsx")).toContain(`image: "${studio}"`);
});

test("4. corporate At a Glance: no tournament or NMJL card promise, neutral setup wording", () => {
  const glance = between(read("app/mahjong-corporate-las-vegas/page.tsx"), "const glance", "export default function");
  expect(glance).not.toMatch(/tournament/i);
  expect(glance).toContain('"NMJL card arrangements are confirmed in your quote."');
  expect(glance).toContain('"We confirm the venue, tables, chairs and setup arrangements when planning your event."');
  expect(glance.replace("NMJL card arrangements", "")).not.toMatch(/NMJL|cards/);
  expect(glance).not.toMatch(/Tables and chairs/);
});

test("5. lessons Find Your Fit: Private Lessons, independent players, session price only", () => {
  const src = read("app/mahjong-lessons-las-vegas/page.tsx");
  expect(src).not.toContain("1-on-1 Lessons");
  expect(src).toContain('title: "Private Lessons"');
  const learn = src.indexOf("{/* WHAT YOU'LL LEARN */}");
  const instructor = src.indexOf("{/* ABOUT YOUR INSTRUCTOR */}");
  const at = src.indexOf('id="choose-your-lesson"');
  expect(Math.min(learn, instructor, at), "section markers").toBeGreaterThan(-1);
  expect(at).toBeGreaterThan(learn);
  expect(at).toBeLessThan(instructor);
  const choices = between(src, "const lessonChoices", "export default function");
  const openPlay = choices.slice(choices.indexOf('title: "Social Open Play"'));
  expect(openPlay).toContain('bestFor: "Players who already know American Mahjong and are comfortable playing independently."');
  expect(choices).not.toMatch(/completed MAHJ101|completed Mahj 101/i);
  expect(openPlay).toContain("Book your seat in advance and bring your current National Mah Jongg League card.");
  // The 5-pack could not be bought on Bookwhen on 2026-11-15, so the shared line is the session price only.
  expect(openPlay).toContain("price: OPEN_PLAY_PRICE_LINE");
  expect(OPEN_PLAY_PRICE_LINE).toBe(`$${OPEN_PLAY_PRICES.session} per session`);
  expect(choices).toContain('href: "/contact?source=lessons"');
  // The links are drawn in the section, not the data: they stay green text, never btn- buttons.
  const rendered = between(src, "{lessonChoices.map(", "</section>");
  expect(rendered).not.toMatch(/className="btn-/);
  expect(rendered).toContain('<a href={c.href} style={{ color: "var(--green)"');
});

test("6. pink buttons use #dd1d85 in every state; pink headings and accents keep #e91e8c", () => {
  const css = read("app/globals.css");
  expect(css).toMatch(/--pink-button: #dd1d85;/);
  expect(css).toMatch(/--pink: #e91e8c;/);
  const rule = (selector: string) => {
    const m = css.match(new RegExp(`^${selector.replace(/[.:]/g, "\\$&")} \\{[^}]*\\}`, "m"));
    expect(m, selector).not.toBeNull();
    return m![0];
  };
  expect(rule(".btn-primary")).toContain("background: var(--pink-button);");
  expect(rule(".nav-cta")).toContain("background: var(--pink-button);");
  expect(rule(".nav-cta:hover")).toContain("background: var(--pink-button);");
  expect(css).toContain(".section-title .accent-pink  { color: var(--pink); }");
  const lin = (v: number) => (v / 255 <= 0.04045 ? v / 255 / 12.92 : Math.pow((v / 255 + 0.055) / 1.055, 2.4));
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  expect(1.05 / (lum("#dd1d85") + 0.05)).toBeGreaterThanOrEqual(4.5);
});

test("8. the About photo keeps its size setting (the owner declined P2)", () => {
  expect(read("app/about/page.tsx")).toContain('sizes="(max-width: 768px) 100vw, 380px"');
});

test("9. the unused photos and the retired headshot are gone from public/ and nothing serves or rebuilds them", () => {
  const scripts = walk("scripts", /\.(c?js|mjs|ts)$/);
  // shauna.jpg was retired in the consistency pass, after option C replaced it everywhere.
  for (const f of ["lvm-lesson-group.jpg", "lvm-private-game.jpg", "birthday-mat.jpg", "shauna.jpg"]) {
    expect(fs.existsSync(path.join(ROOT, "public", f)), f).toBe(false);
    for (const rel of [...SOURCE, ...scripts, "next.config.ts"]) expect(code(rel), `${rel} names ${f}`).not.toContain(f);
  }
});

// The consistency pass of 2026-11-15, after the gallery decisions.

test("photo C is the sharper copy of the same photo, made from her original", () => {
  expect({ width: SHAUNA_NEON.width, height: SHAUNA_NEON.height }).toEqual({ width: 1500, height: 2000 });
  // Pinned like the other approved photos, so a re-export needs her approval.
  expect(sha256("public/studio-shauna-neon-sign.jpg")).toBe("5b90f48fc773acf680a157f58e3307d0aadd93454561ebe978611dcb5815b8c3");
});

test("private lessons read as individual or private-group lessons, never one on one only", () => {
  const priv = read("app/private-mahjong-lessons-las-vegas/page.tsx");
  const meta = between(priv, "export const metadata", "const faqs");
  expect(meta).not.toMatch(/one on one/i);
  expect(meta).toContain("Individual or private-group");
  const lessons = read("app/mahjong-lessons-las-vegas/page.tsx");
  expect(lessons).not.toContain("learn one on one");
  expect(lessons).toContain("learn on your own or with a small group you bring yourself");
});

test("the hero keeps the calendar button clear of the decorative scroll hint", () => {
  const css = read("app/globals.css");
  const rule = (selector: string) => css.match(new RegExp(`^${selector.replace(/[.]/g, "\\.")} \\{[^}]*\\}`, "m"))![0];
  expect(rule(".scroll-hint")).toContain("pointer-events: none;");
  expect(rule(".hero")).toContain("padding: 6rem 2rem 6.5rem;");
  expect(css).toContain(".hero { padding: 5rem 1.2rem 6.5rem; min-height: 90vh; }");
});

// Final copy adjustments: no unconfirmed tournament format on the corporate pages, and no
// one-lesson readiness promise in the homepage FAQ.
test("no corporate page promises a tournament, and the homepage FAQ makes no one-lesson promise", () => {
  for (const route of [
    "mahjong-corporate-las-vegas",
    "corporate-team-building-las-vegas",
    "conference-activities-las-vegas",
    "convention-activities-las-vegas",
    "las-vegas-meeting-planner-activities",
    "corporate-event-activities-las-vegas",
    "incentive-group-activities-las-vegas",
    "trade-show-booth-activities-las-vegas",
  ]) {
    expect(code(`app/${route}/page.tsx`), route).not.toMatch(/tournament/i);
  }
  const faq = read("components/faq.tsx");
  expect(faq).toContain('"Start with MAHJ101 and build your skills through practice and our follow-on classes."');
  expect(faq).not.toMatch(/after just one|know enough to sit down and play/i);
});

test("the approved titles: About Shauna, and a lessons share title with no second brand", () => {
  // The layout template adds " | Las Vegas Mahjong" to every search title, so page titles leave it out.
  expect(read("app/layout.tsx")).toContain('template: "%s | Las Vegas Mahjong"');
  expect(read("app/about/page.tsx")).toContain('  title: "About Shauna",');
  const lessons = read("app/mahjong-lessons-las-vegas/page.tsx");
  expect(lessons).toContain('  title: "Mahjong Lessons in Las Vegas",');
  expect(lessons).toContain('    title: "Mahjong Lessons Las Vegas | Beginner-Friendly Classes",');
});

test("the privacy page says we do not sell what visitors send, and promises nothing wider", () => {
  // Confirmed by the owner on 2026-11-15. She asked that it not grow into other privacy claims.
  const src = read("app/privacy/page.tsx");
  expect(src).toContain("We use what you send to reply to you. We do not sell it.");
  expect(src.match(/(do|does|will) not sell|never sells?|don't sell/gi) ?? []).toHaveLength(1);
  expect(src).not.toMatch(/(do|does|will) not share|never shares?|not shared? with (anyone|third)/i);
  // Also confirmed by her on 2026-11-15: the site is marketed to adults. The sentence describes
  // the website's audience and must never become a minimum age for lessons.
  expect(src).toContain("This website does not target children under 13.");
  expect(src).not.toMatch(/minimum age|must be (at least )?\d+|\d+ (years? )?or older|adults only/i);
});

test("confirmations after a sent form speak as the team", () => {
  // Approved by the owner in the preview review of 2026-11-15. This is only what a visitor
  // reads after sending a form; her About biography stays in her own first person.
  const form = read("components/contact-form.tsx");
  expect(form).toContain('{successBody ?? "Thanks for reaching out. We\\u2019ll be in touch soon!"}');
  const modal = read("components/inquiry-modal.tsx");
  expect(modal).toContain('successTitle={"You\\u2019re on our radar!"}');
  expect(modal).toContain('successBody={"Thanks for reaching out. We\\u2019ll be in touch soon. Get ready to play!"}');
  const confirmations = ["components/contact-form.tsx", "components/inquiry-modal.tsx"]
    .flatMap((rel) => code(rel).split("\n"))
    .filter((line) => /success(Title|Body)\b.*"/.test(line));
  expect(confirmations).toHaveLength(4);
  for (const line of confirmations) expect(line).not.toMatch(/\bI(?:\\u2019|')(?:ll|m|ve|d)\b|\bmy\b|\bme\b/);
});

test("the four curriculum cards on the lessons page are whole-card links", () => {
  // Approved by the owner in the preview review of 2026-11-15. The schedule has one calendar
  // and no address per class, so the three group classes share it and no booking address is
  // made up. A class address on Bookwhen expires with the class.
  const src = read("app/mahjong-lessons-las-vegas/page.tsx");
  for (const group of ["MAHJ101", "MAHJ102", "MAHJ103"]) {
    expect(src, group).toMatch(new RegExp(`\\{ num: "${group}",[^\\n]*href: "/schedule#calendar" \\},`));
  }
  expect(src).toMatch(/\{ num: "Private",[^\n]*href: "\/private-mahjong-lessons-las-vegas" \},/);
  expect(src).toContain('<a key={tier.num} href={tier.href} className="lesson-card">');
  expect(src).not.toMatch(/bookwhen\.com/);
  expect(read("app/schedule/page.tsx")).toContain('<section id="calendar"');
  const css = read("app/globals.css");
  expect(css).toMatch(/\.lesson-card:hover \{[^}]*border-color/);
  expect(css).toMatch(/\.lesson-card:focus-visible \{[^}]*outline: 3px solid/);
});
