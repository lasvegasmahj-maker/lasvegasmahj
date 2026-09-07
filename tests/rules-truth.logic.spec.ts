import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { RULES_TOPICS, getQA, type RuleQA } from "../content/rules";
import { RULES_KNOWLEDGE, KNOWLEDGE_BY_ID, isPending, lookup, labelFor, approvedText } from "../lib/ask-core/index.ts";
import { READ_MORE, readMoreUrl, LVM_SITE } from "../lib/ask/site";

// The rules truth layer on this site: the /rules pages, the shared Ask corpus, and the learn
// page must never disagree on an approved rule; a pending answer must never look verified; and
// a house rule must never be dressed up as a League rule. The corpus itself lives in the shared
// core (lib/ask-core); this file checks that this site's pages agree with it. Pure logic.

const allQA: Array<RuleQA & { ref: string }> = RULES_TOPICS.flatMap((t) => t.qa.map((qa) => ({ ...qa, ref: `${t.slug}.${qa.id}` })));
const DASH_RE = /[–—]/;
const MONTH_RE =
  /\b(january|february|march|april|june|july|august|september|october|november|december)\b|\b(in|every|each|late|early|mid) may\b/i;
const NMJL_CLAIM_RE = /\b(standard NMJL|NMJL standard|official (NMJL |League )?rule|the League (says|requires|rules)|under the card|the card (says|declares|names|itself))\b/i;

// League rule book claims the site makes that our materials (card panel, owner handouts) do
// not cover. New ones cannot be added silently: list them here with the owner's eyes on them.
const RULEBOOK_CLAIMS: string[] = [];
// Standard-rule answers with no source in our materials, awaiting the owner's confirmation.
const OWNER_REVIEW: string[] = [];

// Canonical entries that mirror a /rules Q&A but deliberately keep their own wording. Each
// needs a reason; the test fails on any other divergence.
const ALIGNMENT_EXCEPTIONS: Record<string, string> = {
  "self-drawn-win": "Same facts as winning.self-drawn, but that page answer opens with 'Yes', which reads wrong for the payment question this entry also answers.",
  "called-dead": "Stitched from one Find My Mahj sentence and two page sentences; every sentence is traced by the test below.",
};

// Entries whose canonical text comes from a lasvegasmahj.com/rules page: provenance names the
// page Q&A it mirrors. The core is the source of truth for Ask; the page must agree with it.
function pageRef(e: (typeof RULES_KNOWLEDGE)[number]): string | null {
  if (e.provenance.approved_via !== "lvm") return null;
  const m = e.provenance.source_ref?.match(/^([a-z-]+\.[a-z-]+)/);
  return m ? m[1] : null;
}

test.describe("rules content modules", () => {
  test("every topic has unique ids, kinds, evidence, and clean copy", () => {
    const seen = new Set<string>();
    for (const qa of allQA) {
      expect(qa.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(seen.has(qa.ref), qa.ref).toBe(false);
      seen.add(qa.ref);
      expect(["standard", "house"]).toContain(qa.kind);
      expect(["card", "owner", "rulebook", "unverified"]).toContain(qa.evidence);
      expect(qa.q.endsWith("?"), qa.ref).toBe(true);
      expect(qa.a, qa.ref).not.toMatch(DASH_RE);
      expect(qa.a, qa.ref).not.toMatch(MONTH_RE);
      expect(qa.a, qa.ref).not.toMatch(/\b[PKN]\b/);
    }
  });

  test("a house rule or unverified claim is never presented as a League rule", () => {
    for (const qa of allQA) {
      const claimsLeague = NMJL_CLAIM_RE.test(qa.a);
      const listed = RULEBOOK_CLAIMS.includes(qa.ref);
      if (qa.kind === "standard" && claimsLeague) {
        expect(["card", "owner", "rulebook"], `${qa.ref} claims a League rule without evidence`).toContain(qa.evidence);
      }
      if (qa.kind === "house" && !listed) {
        expect(qa.a, `${qa.ref} is a house rule but reads as a League standard`).not.toMatch(/\bthe (standard|official) NMJL (rule|payment structure)\b/i);
        if (qa.evidence === "unverified") expect(qa.a, `${qa.ref} is unverified yet claims League authority`).not.toMatch(NMJL_CLAIM_RE);
      }
      if (qa.kind === "standard" && qa.evidence === "unverified") {
        expect(OWNER_REVIEW, `${qa.ref} is an unverified standard claim not on the owner's review list`).toContain(qa.ref);
        expect(qa.a, `${qa.ref} is unverified yet claims League authority`).not.toMatch(NMJL_CLAIM_RE);
      }
      if (qa.evidence === "rulebook") expect(RULEBOOK_CLAIMS, `${qa.ref} cites the rule book but is not on the owner's list`).toContain(qa.ref);
    }
    for (const ref of RULEBOOK_CLAIMS) expect(getQA(ref).evidence, `${ref} no longer cites the rule book; drop it from the list`).toBe("rulebook");
    for (const ref of OWNER_REVIEW) expect(getQA(ref).evidence, `${ref} is now sourced; drop it from OWNER_REVIEW`).toBe("unverified");
  });

  test("the /rules index counts match the content", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "../app/rules/page.tsx"), "utf8");
    for (const t of RULES_TOPICS) {
      const m = src.match(new RegExp(`slug: "${t.slug}",[\\s\\S]*?count: (\\d+),`));
      expect(m, t.slug).toBeTruthy();
      expect(Number(m![1]), `${t.slug} count on the index page`).toBe(t.qa.length);
    }
  });
});

test.describe("the pages agree with the shared corpus", () => {
  test("every page-sourced canonical entry carries the page's exact text, or is a listed exception", () => {
    let mirrored = 0;
    for (const e of RULES_KNOWLEDGE) {
      const ref = pageRef(e);
      if (!ref) continue;
      const page = getQA(ref);
      if (e.id in ALIGNMENT_EXCEPTIONS) {
        expect(e.answer, `${e.id} is an exception but now matches the page; remove it from ALIGNMENT_EXCEPTIONS`).not.toBe(page.a);
        continue;
      }
      mirrored++;
      expect(e.answer, `${e.id} drifted from ${ref}. Change the page and the core together.`).toBe(page.a);
      expect(e.varies_by_house, `${e.id} house flag disagrees with the page`).toBe(page.kind === "house");
    }
    expect(mirrored).toBeGreaterThanOrEqual(35);
  });

  test("every alignment exception still exists and has a reason", () => {
    for (const [id, reason] of Object.entries(ALIGNMENT_EXCEPTIONS)) {
      expect(KNOWLEDGE_BY_ID.has(id), id).toBe(true);
      expect(reason.length).toBeGreaterThan(20);
    }
  });

  test("a stitched entry is traceable sentence by sentence", () => {
    const e = KNOWLEDGE_BY_ID.get("called-dead")!;
    const pool = [getQA("dead-hands.draws").a, getQA("dead-hands.pays").a, KNOWLEDGE_BY_ID.get("dead-hand")!.answer].join(" ");
    for (const sentence of e.answer.split(/(?<=\.)\s+/)) expect(pool, `untraced sentence: ${sentence}`).toContain(sentence);
  });

  test("shared owner-approved entries that link to a page agree with it", () => {
    const agreement: Array<[string, RegExp]> = [
      ["charleston-blind-pass", /First Left and, if a second Charleston is played, Last Right/],
      ["closed-hand-final-tile", /any tile except a joker may be called for mahjong, even for a concealed hand/],
      ["charleston", /jokers cannot be passed in the charleston/i],
      ["open-vs-closed", /except the tile that completes your mahjong|any tile except a joker may be called for mahjong/i],
      ["jokers-basics", /Jokers can substitute for any tile in a set of three or more/],
    ];
    for (const [id, re] of agreement) {
      const url = readMoreUrl(KNOWLEDGE_BY_ID.get(id)!);
      expect(url, id).toBeTruthy();
      const slug = url!.split("/").pop()!;
      const pageText = RULES_TOPICS.find((t) => t.slug === slug)!.qa.map((q) => q.a).join(" ");
      expect(pageText, `${id}: linked page ${slug} agrees`).toMatch(re);
    }
  });

  test("Read more links point only at real pages and never at a pending entry", () => {
    const slugs = new Set(RULES_TOPICS.map((t) => t.slug));
    for (const [id, slug] of Object.entries(READ_MORE)) {
      expect(KNOWLEDGE_BY_ID.has(id), `READ_MORE names ${id}, which is not a canonical entry`).toBe(true);
      expect(slugs.has(slug), `${id} links to /rules/${slug}, which does not exist`).toBe(true);
    }
    for (const e of RULES_KNOWLEDGE) {
      if (isPending(e)) expect(readMoreUrl(e), `${e.id} is pending and must not link`).toBeUndefined();
      const url = readMoreUrl(e);
      if (url) expect(url).toMatch(/^https:\/\/www\.lasvegasmahj\.com\/rules\/[a-z-]+$/);
    }
  });

  test("the owner's pending entries stay pending and are served that way", () => {
    for (const id of ["joker-discarded", "out-of-turn", "own-discard", "passed-winning-tile", "two-dead-hands", "self-drawn-win", "players-count"]) {
      const e = KNOWLEDGE_BY_ID.get(id)!;
      expect(isPending(e), `${id} must stay pending until the owner rules`).toBe(true);
      expect(labelFor(e), id).toBe("pending");
      const served = lookup({ question: e.questions[0] });
      expect(served.entry?.id, e.questions[0]).toBe(id);
      expect(served.label, id).toBe("pending");
      expect(served.answer, id).toBe(approvedText(e));
    }
    expect(KNOWLEDGE_BY_ID.get("joker-discarded")!.answer).toMatch(/common table practice/);
    expect(KNOWLEDGE_BY_ID.get("joker-discarded")!.answer).toMatch(/not printed on the card/);
  });

  test("payment wording on this site stays neutral: the owner's 2026-08-29 decision is a recorded override", () => {
    expect(LVM_SITE.overrides.map((o) => o.canonical_id)).toContain("payments-basics");
    const exclude = new Set(LVM_SITE.overrides.map((o) => o.canonical_id));
    const served = [
      "How does payment work in a wall game?",
      "Can I use last year's card?",
      "Who pays when someone wins on a discard?",
      "Who pays on a self drawn win?",
      "Do any hands pay extra beyond joker-free?",
      "who pays when i win on a discard",
      "is a jokerless hand worth double",
    ];
    for (const q of served) {
      const r = lookup({ question: q }, { exclude });
      expect(r.entry?.id, q).not.toBe("payments-basics");
      expect(r.answer, q).not.toMatch(/NMJL standard|official play|League rule book|standard NMJL|The League sets who pays/i);
    }
    for (const e of RULES_KNOWLEDGE) {
      if (exclude.has(e.id) || e.provenance.approved_via === "fmg") continue;
      expect(e.house_note ?? "", `${e.id} house note`).not.toMatch(NMJL_CLAIM_RE);
    }
  });
});

test.describe("card-verified corrections stay corrected", () => {
  const cases: Array<[string, RegExp[], RegExp[]]> = [
    ["charleston.pass-jokers", [/cannot be passed/i], [/choose to pass jokers/i, /never required/i]],
    ["charleston.stop", [/compulsory/i, /first left/i], [/before the first across/i]],
    ["charleston.blind-pass", [/first left/i, /last right/i, /one, two, or all three|1, 2, or all 3/i], [/across' pass/i, /during the 'across'/i]],
    ["charleston.courtesy-pass", [/0, 1, 2, or 3/, /stopped after the first left/i], [/after both charlestons/i]],
    ["charleston.look", [/yes, always/i], [/yes, except/i]],
    ["the-card.open-closed", [/completes your mahjong/i, /except a joker/i, /marked C/], [/cannot call any discards/i, /confirm with your group which hands/i]],
    ["jokers.call-with-joker", [/called tile itself must be a real tile/i], [/at least one real matching tile/i]],
    ["jokers.joker-free", [/singles and pairs/i], []],
    ["scoring.joker-free", [/singles and pairs/i], []],
    ["calling-tiles.expose", [/up until you discard/i, /locked in/i], [/cannot call and then decide/i]],
    ["winning.false-mahjong", [/no penalty/i, /double the value of the incorrect hand/i], [/set by house rules/i]],
    ["winning.change-mind", [/no penalty/i], [/^No\./]],
    ["the-card.numbers", [/tile's number/i, /key/i], [/tell you how many identical tiles/i]],
    ["calling-tiles.pung-vs-kong", [/repeating the tile/i, /flowers/i], [/using the numbers 3, 4, 5, and 6/i]],
    ["etiquette.call-window", [/picked/i, /racked/i], [/once the next player has drawn/i]],
    ["calling-tiles.call-for-mahjong", [/except a discarded joker/i, /picked and racked/i], [/any order of play/i]],
    ["calling-tiles.two-callers", [/on top of their rack/i, /mahjong/i], []],
    ["dead-hands.triggers", [/too few or too many tiles/i, /no penalty/i], [/false mahjong also results/i, /house rules vary/i]],
    ["dead-hands.saved", [/up until you discard/i], [/group may agree/i]],
    ["calling-tiles.concealed", [/completes your mahjong/i], []],
    ["scoring.extra", [/4 times/i, /mahjong in error/i, /not printed on the card/i, /Payment conventions can vary by group/], [/does not designate specific multipliers/i, /League rule book/i]],
    ["etiquette.take-back", [/correctly named/i], [/the moment a tile is set down/i]],
    ["winning.valid", [/anything you exposed must be part of it/i], [/match what you declared/i]],
    ["winning.discard-win", [/other than a joker/i], []],
    ["calling-tiles.out-of-turn", [/may not be claimed, so the call does not stand/i, /names no penalty/i, /cannot be claimed until it has been correctly named/i], [/typically results in the hand being declared dead/i, /varies by house rules/i, /calling a tile before it has been correctly named/i]],
    ["scoring.discard-pays", [/Payment conventions can vary by group/], [/standard NMJL payment structure/i, /League rule book describes/i]],
    ["scoring.self-drawn-pays", [/Payment conventions can vary by group/], [/each pay the full amount/i]],
    ["winning.self-drawn", [/settled by your group/i], [/still pay the standard amount/i]],
    ["scoring.wall-game", [/Confirm your table/i], [/NMJL standard/i]],
    ["dead-hands.two-dead", [/stops play for dead hands only when three are dead/i], []],
    ["the-card.new-card", [/every spring/i], [/only valid card/i, /small annual fee/i, /retired/i]],
    ["the-card.last-year", [/current year's card/i], [/official or competitive/i]],
    ["winning.passed-winning-tile", [/Nothing on the card penalizes/i], [/There is no penalty/i]],
  ];
  for (const [ref, must, mustNot] of cases) {
    test(ref, () => {
      const a = getQA(ref).a;
      for (const re of must) expect(a, `${ref} should say ${re}`).toMatch(re);
      for (const re of mustNot) expect(a, `${ref} still says ${re}`).not.toMatch(re);
    });
  }

  test("the learn page no longer calls printed digits group sizes", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "../app/learn-mahjong/page.tsx"), "utf8");
    expect(src).not.toMatch(/uses numbers to describe the structure/);
    expect(src).toMatch(/key defines a Pair as 2 like tiles/);
  });

  test("CLAUDE.md states the closed-hand exception", () => {
    const src = fs.readFileSync(path.resolve(__dirname, "../CLAUDE.md"), "utf8");
    expect(src).toMatch(/single discard that completes mahjong/);
  });

  test("Ask serves the corrected rule for each discrepancy question", () => {
    const exclude = new Set(LVM_SITE.overrides.map((o) => o.canonical_id));
    const probes: Array<[string, RegExp]> = [
      ["Can I pass a joker in the Charleston?", /cannot be passed in the charleston|never pass a joker in the Charleston/i],
      ["Can I stop the Charleston?", /compulsory/i],
      ["What is a blind pass?", /first left/i],
      ["Can a closed hand call the last tile for mahjong?", /completes your mahjong/i],
      ["Can I call a discard and use a joker to complete the set?", /called tile itself must be a real tile/i],
      ["What is a joker-free hand and what does it pay?", /singles and pairs/i],
      ["Do I have to expose tiles right away when I call?", /up until you discard/i],
      ["What is a false mahjong?", /no penalty/i],
      ["What do the numbers on the card mean?", /tile's number/i],
      ["How fast do I have to call a discard?", /racked/i],
      ["What is calling out of turn?", /names no penalty/i],
      ["Who pays when someone wins on a discard?", /Payment conventions can vary by group/],
      ["How does payment work in a wall game?", /Confirm your table/i],
    ];
    for (const [q, re] of probes) expect(lookup({ question: q }, { exclude }).answer, q).toMatch(re);
  });
});
