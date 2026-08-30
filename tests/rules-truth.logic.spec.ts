import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { RULES_TOPICS, getQA, type RuleQA } from "../content/rules";
import { ALIGNMENT_EXCEPTIONS, KNOWLEDGE_BY_ID, PENDING_BY_OWNER_DECISION, RULES_KNOWLEDGE } from "../lib/ask/knowledge";
import { answerDeterministic, labelFor, readMoreUrl } from "../lib/ask/engine";

// The rules truth layer: /rules pages, the Ask knowledge base, and the learn page must never
// disagree on an approved rule, a pending answer must never look verified, and a house rule
// must never be dressed up as a League rule. Pure logic, no browser.

const allQA: Array<RuleQA & { ref: string }> = RULES_TOPICS.flatMap((t) => t.qa.map((qa) => ({ ...qa, ref: `${t.slug}.${qa.id}` })));
const DASH_RE = /[–—]/;
const MONTH_RE =
  /\b(january|february|march|april|june|july|august|september|october|november|december)\b|\b(in|every|each|late|early|mid) may\b/i;
const NMJL_CLAIM_RE = /\b(standard NMJL|NMJL standard|official (NMJL |League )?rule|the League (says|requires|rules)|under the card|the card (says|declares|names|itself))\b/i;

// League rule book claims the site makes that our materials (card panel, owner handouts) do
// not cover. New ones cannot be added silently: list them here with the owner's eyes on them.
const RULEBOOK_CLAIMS: string[] = [];
// Standard-rule answers with no source in our materials, awaiting the owner's confirmation.
// The same rule: a new one must be listed here, not slipped in.
const OWNER_REVIEW: string[] = [];

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
    // An unverified page answer must not reach Ask as a verified rule.
    for (const e of RULES_KNOWLEDGE) {
      if (e.source === "lvm_rules_page" && e.page_ref?.some((r) => OWNER_REVIEW.includes(r))) {
        throw new Error(`${e.id} mirrors an owner-review answer but is served as verified`);
      }
    }
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

test.describe("Ask mirrors the pages", () => {
  test("every page-sourced Ask entry points at a real Q&A and carries its exact text", () => {
    for (const e of RULES_KNOWLEDGE) {
      if (e.source !== "lvm_rules_page") continue;
      expect(e.page_ref?.length, `${e.id} has no page_ref`).toBeGreaterThan(0);
      for (const ref of e.page_ref!) getQA(ref);
      if (e.id in ALIGNMENT_EXCEPTIONS) continue;
      expect(e.page_ref!.length, e.id).toBe(1);
      expect(e.answer, e.id).toBe(getQA(e.page_ref![0]).a);
      expect(e.varies_by_house, `${e.id} house flag disagrees with the page`).toBe(getQA(e.page_ref![0]).kind === "house");
    }
    for (const e of RULES_KNOWLEDGE) {
      if (!e.page_ref || !e.source_url) continue;
      expect(e.source_url, `${e.id} links to a different page than it mirrors`).toBe(`https://www.lasvegasmahj.com/rules/${e.page_ref[0].split(".")[0]}`);
    }
  });

  test("shared Find My Mahj entries that link to a page agree with it", () => {
    const agreement: Array<[string, RegExp]> = [
      ["charleston-blind-pass", /First Left and, if a second Charleston is played, Last Right/],
      ["closed-hand-final-tile", /any tile except a joker may be called for mahjong, even for a concealed hand/],
      ["charleston", /jokers cannot be passed in the charleston/i],
      ["open-vs-closed", /except the tile that completes your mahjong|any tile except a joker may be called for mahjong/i],
      ["jokers-basics", /Jokers can substitute for any tile in a set of three or more/],
    ];
    for (const [id, re] of agreement) {
      const e = KNOWLEDGE_BY_ID.get(id)!;
      expect(e.source_url, id).toBeTruthy();
      const slug = e.source_url!.split("/").pop()!;
      const pageText = RULES_TOPICS.find((t) => t.slug === slug)!.qa.map((q) => q.a).join(" ");
      expect(pageText, `${id}: linked page ${slug} agrees`).toMatch(re);
    }
  });

  test("pending entries that mirror a corrected page carry the page text, or are listed exceptions", () => {
    for (const e of RULES_KNOWLEDGE) {
      if (e.source !== "derived" || !e.page_ref) continue;
      const page = getQA(e.page_ref[0]);
      if (e.id in ALIGNMENT_EXCEPTIONS) {
        expect(e.answer, `${e.id} is an exception but now matches the page; remove it from ALIGNMENT_EXCEPTIONS`).not.toBe(page.a);
        continue;
      }
      expect(e.answer, `${e.id} drifted from ${e.page_ref[0]}`).toBe(page.a);
    }
  });

  test("every alignment exception still exists and has a reason", () => {
    for (const [id, reason] of Object.entries(ALIGNMENT_EXCEPTIONS)) {
      expect(KNOWLEDGE_BY_ID.has(id), id).toBe(true);
      expect(reason.length).toBeGreaterThan(20);
      expect(KNOWLEDGE_BY_ID.get(id)!.page_ref?.length, `${id} exception without a page_ref`).toBeGreaterThan(0);
    }
  });

  test("a stitched entry is traceable sentence by sentence", () => {
    const e = KNOWLEDGE_BY_ID.get("called-dead")!;
    const pool = [...e.page_ref!.map((r) => getQA(r).a), KNOWLEDGE_BY_ID.get("dead-hand")!.answer].join(" ");
    for (const sentence of e.answer.split(/(?<=\.)\s+/)) expect(pool, `untraced sentence: ${sentence}`).toContain(sentence);
  });

  test("exactly the owner's six entries are pending, and owner-approved entries are verified", () => {
    const pending = RULES_KNOWLEDGE.filter((e) => e.source === "derived").map((e) => e.id).sort();
    expect(pending).toEqual([...PENDING_BY_OWNER_DECISION].sort());
    for (const e of RULES_KNOWLEDGE) {
      if (e.source === "owner_approved") {
        expect(labelFor(e), e.id).not.toBe("pending");
        expect(e.source_url, `${e.id} has no page yet, so it must not link`).toBeUndefined();
      }
      if (e.source === "lvm_rules_page") expect(e.source_url, `${e.id} is a verified mirror and should link to its page`).toBeTruthy();
    }
    // A pending answer built on table practice must say so.
    expect(KNOWLEDGE_BY_ID.get("discarded-joker")!.answer).toMatch(/common table practice/);
    expect(KNOWLEDGE_BY_ID.get("discarded-joker")!.answer).toMatch(/not printed on the card/);
  });

  test("Ask text never claims League authority outside a sourced page", () => {
    for (const e of RULES_KNOWLEDGE) {
      if (e.source === "shared_approved") continue;
      expect(e.house_note ?? "", `${e.id} house note`).not.toMatch(NMJL_CLAIM_RE);
      if (!e.page_ref?.length || e.id in ALIGNMENT_EXCEPTIONS) expect(e.answer, `${e.id} own text`).not.toMatch(NMJL_CLAIM_RE);
    }
    const served = [
      "How does payment work in a wall game?",
      "Can I use last year's card?",
      "Who pays when someone wins on a discard?",
      "Who pays on a self drawn win?",
      "Do any hands pay extra beyond joker-free?",
    ];
    for (const q of served) {
      const r = answerDeterministic(q);
      expect(r.answer, q).not.toMatch(/NMJL standard|official play|League rule book|standard NMJL/i);
    }
  });

  test("a pending rule is never presented as verified", () => {
    for (const e of RULES_KNOWLEDGE) {
      if (e.source !== "derived") continue;
      expect(labelFor(e), e.id).toBe("pending");
      expect(readMoreUrl(e), `${e.id} would show a Read more link`).toBeUndefined();
      const served = answerDeterministic(e.question);
      expect(served.entry?.id, e.question).toBe(e.id);
      expect(served.label, e.id).toBe("pending");
    }
  });

  test("an approved page rule never sits behind a pending Ask answer with different substance", () => {
    // Every corrected page Q&A that Ask can reach must be served with the same text.
    for (const qa of allQA) {
      const mirror = RULES_KNOWLEDGE.find((e) => e.page_ref?.[0] === qa.ref && e.source !== "shared_approved" && !(e.id in ALIGNMENT_EXCEPTIONS));
      if (!mirror) continue;
      expect(mirror.answer, qa.ref).toBe(qa.a);
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
    const probes: Array<[string, RegExp]> = [
      ["Can I pass a joker in the Charleston?", /cannot be passed in the charleston/i],
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
    for (const [q, re] of probes) expect(answerDeterministic(q).answer, q).toMatch(re);
  });
});
