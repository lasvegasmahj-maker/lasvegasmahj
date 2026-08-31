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

type Disposition = { id: string; topic: string | null; classification: string | null; provenance: string | null; fmg_source: string | null; fmg_review_pending: boolean; varies_by_house: boolean; fingerprint: string; disposition: string; note?: string };
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
        /^(copied|awaiting-approval|mapped:[a-z0-9-]+|excluded|owner-review)$/.test(e.disposition),
        `${e.id} has disposition "${e.disposition}". Run npx tsx scripts/sync-fmg-manifest.ts, then decide: copied, awaiting-approval, mapped:<our-id>, excluded, or owner-review.`
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

  test("we only copy what Find My Mahj's owner has approved", () => {
    for (const e of entries) {
      if (e.disposition !== "copied") continue;
      expect(
        e.fmg_review_pending,
        `${e.id} is recorded as copied, but Find My Mahj still has it under owner review (source ${e.fmg_source}). Approved-sounding text that their instructor has not signed off must not become a Standard rule here. Leave it awaiting-approval until their review clears.`
      ).toBe(false);
      expect(e.fmg_source, `${e.id} is copied but its Find My Mahj source is ${e.fmg_source}`).toBe("owner_approved");
    }
  });

  test("nothing awaiting Find My Mahj approval has leaked into the corpus", () => {
    for (const e of entries.filter((x) => x.disposition === "awaiting-approval" || x.disposition === "owner-review" || x.disposition === "excluded")) {
      const ours = KNOWLEDGE_BY_ID.get(e.id);
      if (!ours) continue;
      expect(ours.source, `${e.id} is ${e.disposition} yet appears here as shared_approved`).not.toBe("shared_approved");
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

test.describe("routing is unchanged by the sync", () => {
  test("every rule in the knowledge base still answers its own question", () => {
    const broken = RULES_KNOWLEDGE.filter((e) => answerDeterministic(e.question).entry?.id !== e.id).map((e) => `${e.id} -> ${answerDeterministic(e.question).entry?.id}`);
    expect(broken, broken.join("\n")).toEqual([]);
  });

  test("the questions these rules would have answered still behave as they do today", () => {
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
      ["can i pick up a discarded joker", "discarded-joker"],
    ];
    const misses = guards.filter(([q, want]) => answerDeterministic(q).entry?.id !== want).map(([q, want]) => `${q} -> ${answerDeterministic(q).entry?.id} (want ${want})`);
    expect(misses, misses.join("\n")).toEqual([]);
  });

  test("questions that are not about rules still get no confident rule answer", () => {
    for (const q of ["do I need to call ahead for open play", "is there a wall between the two rooms at the venue", "do you run a tournament at your studio", "the form has a blank field"]) {
      expect(answerDeterministic(q).kind, q).not.toBe("answer");
    }
  });
});
