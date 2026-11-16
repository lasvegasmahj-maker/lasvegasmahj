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

// 2026-11-15: the owner replaced the 2026-09-29 rule ("the venue provides the tables and chairs")
// with neutral wording, because who supplies the furniture is not confirmed for every event. Each
// corporate page now says the setup is confirmed in planning and that card arrangements are
// confirmed in the quote, and none of them assigns the furniture or promises NMJL cards.
const SETUP = /We confirm the (venue|booth|suite), tables, chairs and setup arrangements when planning your event/;
const ASSIGNS_FURNITURE = /tables? and chairs|room and furniture|(venue|hotel|suite|booth|you|client)[^.]{0,40}\bprovides?\b[^.]{0,40}(tables?|chairs|furniture|seating)/i;
const PROMISES_CARDS = /NMJL cards|\bcards, everything|racks,? (and )?cards|racks, NMJL|cards? (are |is )?provided/i;

test.describe("the setup and NMJL cards are confirmed per event; we provide the game", () => {
  for (const route of CORPORATE) {
    test(`${route} confirms the setup instead of saying who provides tables and chairs`, () => {
      const code = readCode(page(route));
      expect(code).toMatch(SETUP);
      expect(code).not.toMatch(ASSIGNS_FURNITURE);
    });

    test(`${route} never promises NMJL cards`, () => {
      expect(readCode(page(route))).not.toMatch(PROMISES_CARDS);
    });

    test(`${route} never implies we supply event furniture`, () => {
      const code = readCode(page(route));
      expect(code).not.toMatch(/bring everything|fill the room with tables|setup and breakdown|confirm what (the space|it) needs/i);
    });
  }

  test("the parties page follows the same approach", () => {
    const code = readCode(page("/mahjong-parties-las-vegas"));
    expect(code).toMatch(SETUP);
    expect(code).toContain("NMJL card arrangements are confirmed in your quote.");
    expect(code).not.toMatch(ASSIGNS_FURNITURE);
    expect(code).not.toMatch(PROMISES_CARDS);
    expect(code).not.toMatch(/all (the )?(mahjong )?equipment|everything else|provide a thing|bring everything/i);
  });
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
      // The owner's requirement since 2026-11-15; finishing Mahj 101 is no longer named as enough.
      "comfortable playing independently",
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
    expect(read(VISITORS)).toContain("comfortable playing independently");
  });

  test("no page or markup presents finishing Mahj 101 as enough for Open Play", () => {
    for (const rel of [OPEN_PLAY, VISITORS, page("/schedule"), page("/studio"), "lib/schema.ts", page("/mahjong-lessons-las-vegas")]) {
      expect(readCode(rel), rel).not.toMatch(/completed Mahj ?101|Mahj ?101 graduates|after Mahj ?101|before Open Play/i);
    }
    expect(read("lib/schema.ts")).toContain("comfortable playing independently");
  });
});

test.describe("Open Play prices live in one place", () => {
  test("the owner's prices", () => {
    expect(OPEN_PLAY_PRICES).toEqual({ session: 20, fivePack: 85 });
    // The five-pack is not on sale in Bookwhen (checked 2026-11-15), so the site offers the session
    // price only until it is.
    expect(OPEN_PLAY_PRICE_LINE).toBe("$20 per session");
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
    expect(read("lib/schema.ts")).not.toContain("fivePack");
  });

  test("no page, metadata or markup offers the five-pack while Bookwhen does not sell it", () => {
    const walk = (dir: string): string[] =>
      fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : /\.(tsx?|json|txt)$/.test(e.name) ? [path.join(dir, e.name)] : [],
      );
    const files = [...walk("app"), ...walk("components"), ...walk("lib"), ...walk("public")].filter((f) => f !== path.join("lib", "pricing.ts"));
    for (const f of files) {
      expect(read(f), f).not.toMatch(/5-pack|five-pack|five pack|fivePack/i);
    }
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

test("no lesson page promises confident play or open play after a single lesson", () => {
  expect(read(page("/mahjong-lessons-las-vegas"))).not.toMatch(/after just one session/i);
  expect(read(page("/mahjong-lessons-henderson"))).not.toMatch(/after their first lesson/i);
  expect(read(page("/mahjong-lessons-henderson"))).toContain("comfortable playing independently");
  const learn = read(page("/learn-mahjong"));
  expect(learn).not.toMatch(/playing confidently after|after their first session|within one lesson|reading it confidently/i);
  expect(learn).toContain("Start with MAHJ101 and build your skills through practice and our follow-on classes.");
  expect(learn).toContain("It looks intimidating at first, but it gets easier with practice.");
});
