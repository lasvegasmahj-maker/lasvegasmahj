import { test, expect } from "@playwright/test";
import { fingerprint } from "../lib/ask/fmg-parse";
import { answerDeterministic } from "../lib/ask/engine";
import { KNOWLEDGE_BY_ID, RULES_KNOWLEDGE } from "../lib/ask/knowledge";
import manifest from "../lib/ask/fmg-manifest.json";

// Approved rule text is shared with Find My Mahj by copy, never at runtime, so the two sites
// stay operationally independent. lib/ask/fmg-manifest.json is the checked-in record of what
// Find My Mahj had approved when we last looked and what we did with each entry. These tests
// need no sister repository, so they run in CI and catch drift on this side. The companion
// check in tests/ask-engine.logic.spec.ts compares the manifest against the real Find My Mahj
// repo when it is checked out beside this one, and that is what catches drift on their side.
//
// To take in a new or changed Find My Mahj rule: npx tsx scripts/sync-fmg-manifest.ts, then give
// each new entry a disposition and copy the ones that belong here.

type Disposition = { id: string; topic: string | null; classification: string | null; provenance: string | null; varies_by_house: boolean; fingerprint: string; disposition: string; note?: string };
const entries = manifest.entries as Disposition[];

test.describe("Find My Mahj approved rules manifest", () => {
  test("the manifest is well formed and every disposition is a real decision", () => {
    expect(entries.length).toBeGreaterThan(0);
    const ids = entries.map((e) => e.id);
    expect(ids, "duplicate ids in the manifest").toEqual([...new Set(ids)]);
    expect([...ids].sort(), "manifest should stay sorted by id").toEqual(ids);
    for (const e of entries) {
      expect(e.fingerprint, e.id).toMatch(/^[0-9a-f]{16}$/);
      expect(
        /^(copied|mapped:[a-z0-9-]+|excluded|owner-review)$/.test(e.disposition),
        `${e.id} has disposition "${e.disposition}". Run npx tsx scripts/sync-fmg-manifest.ts, then decide: copied, mapped:<our-id>, excluded, or owner-review.`
      ).toBe(true);
      if (e.disposition !== "copied") {
        expect(e.note, `${e.id} is ${e.disposition} and needs a note saying why`).toBeTruthy();
      }
      if (e.disposition.startsWith("mapped:")) {
        const target = e.disposition.slice("mapped:".length);
        expect(KNOWLEDGE_BY_ID.get(target), `${e.id} maps to ${target}, which does not exist here`).toBeTruthy();
      }
    }
  });

  test("every entry we copied is present here, word for word, and still marked shared", () => {
    for (const e of entries.filter((x) => x.disposition === "copied")) {
      const ours = KNOWLEDGE_BY_ID.get(e.id);
      expect(ours, `${e.id} is recorded as copied but is missing from lib/ask/knowledge.ts`).toBeTruthy();
      if (!ours) continue;
      expect(ours.source, `${e.id} is copied from Find My Mahj, so it must stay shared_approved`).toBe("shared_approved");
      expect(ours.varies_by_house, `${e.id} varies_by_house drifted from Find My Mahj`).toBe(e.varies_by_house);
      expect(
        fingerprint({ answer: ours.answer, house_note: ours.house_note, varies_by_house: ours.varies_by_house }),
        `${e.id} wording no longer matches the approved Find My Mahj text. Do not edit shared entries here; change them in Find My Mahj, then run npx tsx scripts/sync-fmg-manifest.ts and copy the new wording.`
      ).toBe(e.fingerprint);
    }
  });

  test("nothing here claims to be shared unless the manifest says we copied it", () => {
    const copied = new Set(entries.filter((e) => e.disposition === "copied").map((e) => e.id));
    for (const ours of RULES_KNOWLEDGE.filter((e) => e.source === "shared_approved")) {
      expect(
        copied.has(ours.id),
        `${ours.id} is marked shared_approved here but is not recorded as copied in the manifest. Either copy it from Find My Mahj or give it a different source.`
      ).toBe(true);
    }
  });

  test("entries we did not copy are not silently present under the same id", () => {
    for (const e of entries.filter((x) => x.disposition === "excluded" || x.disposition === "owner-review")) {
      const ours = KNOWLEDGE_BY_ID.get(e.id);
      if (!ours) continue;
      expect(ours.source, `${e.id} is ${e.disposition} in the manifest yet appears here as shared_approved`).not.toBe("shared_approved");
    }
  });

  test("the owner's pending rules are untouched by the sync", () => {
    for (const id of ["discarded-joker", "out-of-turn", "take-back-discard", "passed-winning-tile", "two-dead-hands", "self-drawn-win"]) {
      expect(KNOWLEDGE_BY_ID.get(id)?.source, `${id} must stay pending`).toBe("derived");
    }
    for (const e of entries.filter((x) => x.disposition === "owner-review")) {
      expect(e.note, `${e.id}`).toBeTruthy();
    }
  });

  test("no copied entry introduces League payment attribution or card hand content", () => {
    for (const e of entries.filter((x) => x.disposition === "copied")) {
      const ours = KNOWLEDGE_BY_ID.get(e.id);
      if (!ours) continue;
      const text = `${ours.answer} ${ours.house_note ?? ""}`;
      if (ours.category === "scoring" || /\bpay(s|ment|ments)?\b/i.test(text)) {
        expect(text, `${e.id} attributes a payment convention to the League`).not.toMatch(/\b(league|nmjl)('s)?\s+(rule ?book|standard)/i);
      }
      expect(text, `${e.id} looks like it lists card hands`).not.toMatch(/\bhands? (are|include)\b.*\b(section|category)\b/i);
    }
  });
});

test.describe("routing for the rules brought over from Find My Mahj", () => {
  const COPIED = ["order-of-play", "hand-size", "exposures-basics", "quints-sextets", "joker-in-mixed-groups", "naming-discards", "picking-ahead", "passing-on-a-discard", "card-notation", "tournament-rules", "blank-tiles"];

  test("each new rule answers its own question", () => {
    for (const id of COPIED) {
      const e = KNOWLEDGE_BY_ID.get(id)!;
      expect(answerDeterministic(e.question).entry?.id, `${id}: "${e.question}"`).toBe(id);
    }
  });

  test("natural phrasings, typos and shorthand reach the new rules", () => {
    const probes: Array<[string, string]> = [
      ["whose turn is it after mine", "order-of-play"],
      ["which direction does play go around the table", "order-of-play"],
      ["how many tiles am i supposed to be holding", "hand-size"],
      ["how many tiles do i keep in my hand", "hand-size"],
      ["what exactly is an exposure", "exposures-basics"],
      ["what does exposed mean", "exposures-basics"],
      ["what is a quint", "quints-sextets"],
      ["how many jokers does a sextet need", "quints-sextets"],
      ["can i use a jokr in a run of 1 2 3", "joker-in-mixed-groups"],
      ["do jokers work in a year hand", "joker-in-mixed-groups"],
      ["do i have to say my discard out loud", "naming-discards"],
      ["do i announce the tile i throw", "naming-discards"],
      ["can i draw before the person ahead of me discards", "picking-ahead"],
      ["is picking ahead allowed", "picking-ahead"],
      ["do i have to call a discard i can use", "passing-on-a-discard"],
      ["what do the colors on the card mean", "card-notation"],
      ["what does the c after a hand mean", "card-notation"],
      ["are tournament rules different", "tournament-rules"],
      ["what are blank tiles for", "blank-tiles"],
    ];
    const misses = probes.filter(([q, want]) => answerDeterministic(q).entry?.id !== want).map(([q, want]) => `${q} -> ${answerDeterministic(q).entry?.id} (want ${want})`);
    expect(misses, misses.join("\n")).toEqual([]);
  });

  test("a wrong assumption still lands on the rule that corrects it", () => {
    const premises: Array<[string, string]> = [
      ["my friend says you can put a joker in a run of three", "joker-in-mixed-groups"],
      ["i thought a pair counts as an exposure, right?", "exposures-basics"],
      ["we always draw early to speed things up, that's fine isn't it", "picking-ahead"],
    ];
    for (const [q, want] of premises) expect(answerDeterministic(q).entry?.id, q).toBe(want);
  });

  test("a follow-up after a new rule stays on the topic", () => {
    const first = KNOWLEDGE_BY_ID.get("quints-sextets")!;
    const history = [
      { role: "user" as const, content: first.question },
      { role: "assistant" as const, content: first.answer, entry_id: first.id },
    ];
    const followUp = answerDeterministic("what about flowers?", history);
    expect(["quints-sextets", "flowers", "joker-substitute"], `flowers follow-up -> ${followUp.entry?.id}`).toContain(followUp.entry?.id);
  });

  test("the broader rules these could have swallowed still answer their own questions", () => {
    const guards: Array<[string, string]> = [
      ["how many tiles are in a set", "tile-count"],
      ["how many tiles does each player start with", "dealing"],
      ["what is the difference between a pung and a kong", "pung-vs-kong"],
      ["when can i call a discard", "calling-discard"],
      ["do i have to expose tiles right away when i call", "expose-immediately"],
      ["what happens if i expose the wrong tiles", "wrong-exposure"],
      ["what do the numbers on the card mean", "card-numbers"],
      ["can i use a joker in NEWS", "joker-in-news"],
      ["how does the charleston work", "charleston"],
      ["can i take back a discard", "take-back-discard"],
    ];
    const misses = guards.filter(([q, want]) => answerDeterministic(q).entry?.id !== want).map(([q, want]) => `${q} -> ${answerDeterministic(q).entry?.id} (want ${want})`);
    expect(misses, misses.join("\n")).toEqual([]);
  });

  test("every rule in the knowledge base still answers its own question", () => {
    const broken = RULES_KNOWLEDGE.filter((e) => answerDeterministic(e.question).entry?.id !== e.id).map((e) => `${e.id} -> ${answerDeterministic(e.question).entry?.id}`);
    expect(broken, broken.join("\n")).toEqual([]);
  });
});
