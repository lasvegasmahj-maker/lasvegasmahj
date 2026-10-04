import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { OPEN_PLAY_PRICES, OPEN_PLAY_PRICE_LINE } from "../lib/pricing";

// The owner's final wording pass before PR #117 (2026-09-29): who supplies the furniture,
// DMC terms, the hub and team building split, the Open Play operating facts and prices, and
// the legacy claims that had no source. Each block pins one of those decisions.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const readCode = (rel: string) =>
  read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
const page = (route: string) => `app${route}/page.tsx`;

const CORPORATE = [
  "/mahjong-corporate-las-vegas",
  "/corporate-team-building-las-vegas",
  "/conference-activities-las-vegas",
  "/convention-activities-las-vegas",
  "/las-vegas-meeting-planner-activities",
  "/corporate-event-activities-las-vegas",
  "/incentive-group-activities-las-vegas",
  "/trade-show-booth-activities-las-vegas",
];
const OPEN_PLAY = page("/mahjong-open-play-las-vegas");
const VISITORS = page("/play-mahjong-las-vegas");
const HUB = page("/mahjong-corporate-las-vegas");
const TEAM = page("/corporate-team-building-las-vegas");

test.describe("the venue provides the furniture, we provide the game", () => {
  for (const route of CORPORATE) {
    test(`${route} says who provides tables and chairs`, () => {
      expect(readCode(page(route))).toMatch(/tables? and chairs/i);
    });

    test(`${route} never implies we supply event furniture`, () => {
      const code = readCode(page(route));
      expect(code).not.toMatch(/bring everything|fill the room with tables|setup and breakdown|confirm what (the space|it) needs/i);
    });
  }
});

test.describe("DMC and event professional terms", () => {
  const PARTNER = "Partner and referral arrangements are available for DMCs and event professionals. Contact us to discuss your program.";

  test("the incentive page offers partner arrangements in the owner's words", () => {
    expect(read(page("/incentive-group-activities-las-vegas"))).toContain(PARTNER);
  });

  test("no page publishes a commission rate or an insurance claim", () => {
    for (const route of CORPORATE) {
      const code = readCode(page(route));
      // Inline styles legitimately contain percentages (100%), so a rate is caught by the word.
      expect(code, route).not.toMatch(/commission|insurance|\bCOI\b|certificate of insurance/i);
    }
  });
});

test.describe("the corporate hub and team building answer different questions", () => {
  const heroParagraph = (rel: string) => {
    const src = readCode(rel);
    const h1 = src.indexOf("</h1>");
    const open = src.indexOf(">", src.indexOf("<p", h1)) + 1;
    return src.slice(open, src.indexOf("</p>", open)).trim();
  };

  test("the two pages open differently", () => {
    const hub = heroParagraph(HUB);
    const team = heroParagraph(TEAM);
    expect(hub).not.toContain("happy hours");
    expect(hub.slice(0, 60)).not.toBe(team.slice(0, 60));
  });

  test("the hub covers what we provide, how it works, the programs and how to book", () => {
    const src = read(HUB);
    for (const s of ["What We Provide", "How It Works", "Event Types", "How do we book a corporate mahjong event?"]) {
      expect(src, s).toContain(s);
    }
  });

  test("the hub no longer carries the team building benefit cards", () => {
    const src = read(HUB);
    for (const card of ["Strategy Makes People Think", "Levels the Playing Field", "Forces Real Conversation", "Actually Memorable"]) {
      expect(src, card).not.toContain(card);
    }
  });

  test("team building covers the team experience, and leaves logistics to the hub", () => {
    const src = read(TEAM);
    expect(src).toContain("The Team Experience");
    expect(src).toContain("What Happens at");
    expect(src).not.toContain("We Set Up Everywhere You Are");
    expect(src).not.toContain("Scale to Any Group Size");
    expect(src).toContain('href="/mahjong-corporate-las-vegas"');
  });
});

test.describe("Open Play states the current operating facts", () => {
  test("it owns open play and social American Mahjong, not the visitor search", () => {
    const src = read(OPEN_PLAY);
    expect(src).toContain('title: { absolute: "Mahjong Open Play Las Vegas | Social American Mahjong" }');
    expect(src).toContain('href="/play-mahjong-las-vegas"');
    expect(read(VISITORS)).toContain('title: { absolute: "Play Mahjong in Las Vegas | Open Play for Visitors" }');
  });

  test("it names the room, the address, the level, registration and the card", () => {
    const src = read(OPEN_PLAY);
    for (const fact of [
      "Lucky Sevens",
      "8687 W. Sahara Avenue, Suite 200",
      "not a lesson",
      "already know",
      "completed Mahj 101",
      "you do not need a full table",
      "Advance registration is required",
      "current National Mah Jongg League card",
    ]) {
      expect(src, fact).toContain(fact);
    }
  });

  test("it drops the outdated claims", () => {
    const code = readCode(OPEN_PLAY);
    expect(code).not.toMatch(/all (skill )?levels welcome|just learning|come anyway|restaurants|wine bars|across the valley|tournaments/i);
    expect(code).not.toMatch(/cards (are )?provided|we'll have extras|we will have extras/i);
  });

  test("the visitor page and the schedule no longer invite complete beginners to Open Play", () => {
    for (const rel of [VISITORS, page("/schedule"), "lib/schema.ts"]) {
      expect(readCode(rel), rel).not.toMatch(/brand-new players|every level is welcome|every skill level welcome/i);
    }
    // The studio's own "Every level is welcome" card is about the whole calendar, Mahj 101
    // included, and stays. Its Lucky Sevens copy and schema are about Open Play and must not.
    expect(readCode(page("/studio"))).not.toMatch(/at every level|how new you are/i);
    expect(read(VISITORS)).toContain("completed Mahj 101");
  });
});

test.describe("Open Play prices live in one place", () => {
  test("the owner's prices", () => {
    expect(OPEN_PLAY_PRICES).toEqual({ session: 20, fivePack: 85 });
    expect(OPEN_PLAY_PRICE_LINE).toBe("$20 per session, or $85 for a 5-pack");
  });

  test("no other file writes the numbers", () => {
    const walk = (dir: string): string[] =>
      fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : /\.(tsx?|json)$/.test(e.name) ? [path.join(dir, e.name)] : [],
      );
    const files = [...walk("app"), ...walk("components"), ...walk("lib")].filter((f) => f !== path.join("lib", "pricing.ts") && !f.startsWith(path.join("lib", "ask")));
    for (const f of files) {
      expect(read(f), f).not.toMatch(/\$\s?(20|85)\b|["'](20|85)\.00["']/);
    }
  });

  test("the pages and the Social Open Play schema read the shared values", () => {
    expect(read(OPEN_PLAY)).toContain("OPEN_PLAY_PRICE_LINE");
    expect(read(VISITORS)).toContain("OPEN_PLAY_PRICE_LINE");
    expect(read("lib/schema.ts")).toContain("OPEN_PLAY_PRICES.session.toFixed(2)");
    expect(read("lib/schema.ts")).toContain("OPEN_PLAY_PRICES.fivePack.toFixed(2)");
  });
});

test.describe("legacy claims with no source are gone", () => {
  test("no statistic, superlative, capacity or reply-time promise in the corporate cluster", () => {
    for (const route of CORPORATE) {
      const code = readCode(page(route));
      expect(code, route).not.toMatch(/thousands of conventions|top convention city|\d+\s?\+|within 24 hours|dozens of tables|no matter how big|of any size|any group size/i);
    }
  });

  test("the contact page, where every corporate CTA lands, promises no reply time", () => {
    expect(readCode(page("/contact"))).not.toMatch(/24 hours/);
  });
});
