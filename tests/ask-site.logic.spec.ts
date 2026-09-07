import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";
import { askDecision, canonicalEntryFor, classifyTopic, coreIdentity, entryById, lookup, KNOWLEDGE_BY_ID, CORE_VERSION, type Turn } from "../lib/ask-core/index.ts";
import { STARTER_QUESTIONS } from "../lib/ask/starters";
import { LVM_SITE } from "../lib/ask/site";
import { pickNudge } from "../lib/ask/nudges";

// The Las Vegas Mahjong overlay on the shared core. The core has its own tests (mahj-ask-core);
// these prove this site's use of it: starters, the studio vocabulary, nudges, the client
// boundary, and the vendored copy's identity.

test.describe("vendored core", () => {
  test("the lock and the vendored version agree", () => {
    const lock = JSON.parse(readFileSync(path.resolve(__dirname, "../ask-core.lock.json"), "utf8"));
    expect(lock.version).toBe(CORE_VERSION);
    expect(Object.keys(lock.files).length).toBeGreaterThan(10);
  });

  test("identity is stable and secret free", () => {
    const id = coreIdentity();
    expect(id.core_version).toBe(CORE_VERSION);
    expect(id.corpus_fingerprint).toMatch(/^[0-9a-f]{16}$/);
    expect(id.behavior_fingerprint).toMatch(/^[0-9a-f]{16}$/);
    expect(id.entries).toBeGreaterThan(80);
    expect(JSON.stringify(id)).not.toMatch(/sk-ant|ANTHROPIC|key/i);
  });
});

test.describe("starters and chips", () => {
  test("starter chips map to canonical questions and are answered verbatim with no model", () => {
    for (const q of STARTER_QUESTIONS) {
      const e = canonicalEntryFor(q);
      expect(e, q).toBeTruthy();
      const r = lookup({ question: q });
      expect(r.kind, q).toBe("answer");
      expect(r.entry?.id, q).toBe(e!.id);
    }
  });
});

test.describe("studio questions never become rules", () => {
  const local = [
    "do I need to call ahead for open play",
    "how much are lessons",
    "can I book a private lesson for my birthday party",
    "what time does open play start on Tuesday",
    "do you teach in Henderson",
    "where is the studio",
    "can we hold a corporate event at your studio",
    "is there parking",
    "do you sell gift cards",
    "is there a wall between the two rooms at the venue",
    "do you run a tournament at your studio",
    "the form has a blank field",
    "what should I call my new mahjong group",
    "my phone is dead",
    // Only a phase noun beside lessons wording: the lessons pointer answers, not the rule.
    "do you teach the charleston in your lessons",
    "What does MAHJ101 cover, the charleston and jokers?",
    "How many people can the studio hold for a party?",
  ];
  // The studio vocabulary moved into the shared core on 2026-09-06 (mahj-ask-core
  // engine/site-intent.ts), so what is asserted here is the routing DECISION for this site,
  // not a regex this repository owns. The release gate's twentieth blocker was that nothing
  // anywhere could compare the two sites' own matchers.
  for (const q of local) {
    test(`studio: ${q}`, () => {
      expect(askDecision({ question: q }, LVM_SITE).kind, q).toBe("site");
    });
  }

  test("a rules question with a studio word answers the rule and offers the studio after it", () => {
    for (const q of ["can I use a joker in a pair at open play", "at open play can I call a discard to make a pung"]) {
      const d = askDecision({ question: q }, LVM_SITE);
      expect(d.kind, q).toBe("rules");
      if (d.kind === "rules") expect(d.result.kind, q).toBe("answer");
    }
  });

  test("the studio never takes a genuine rules question (release gate blockers 8, 9, 10, 15)", () => {
    for (const q of [
      "when do you start the charleston",
      "when do you open the wall",
      "does a dead hand cost anything",
      "are the joker rules different in las vegas",
      "who goes first",
      "explain the wall",
      "our instructor told us the charleston is optional",
    ]) {
      expect(askDecision({ question: q }, LVM_SITE).kind, q).toBe("rules");
    }
  });
});

test.describe("nudges", () => {
  const answered = (question: string, history: Turn[] = []): Turn[] => {
    const r = lookup({ question, history });
    return [...history, { role: "user", content: question }, { role: "assistant", content: r.answer, entry_id: r.entry?.id }];
  };
  const get = (id: string) => KNOWLEDGE_BY_ID.get(id)!;

  test("never on the first two answers", () => {
    const history = answered("How many tiles are in a set?");
    expect(pickNudge(history, get("suits"), entryById)).toBeNull();
  });
  test("three foundational questions suggest lessons, once", () => {
    let history = answered("How many tiles are in a set?");
    history = answered("What are the three suits?", history);
    const nudge = pickNudge(history, get("dragons"), entryById);
    expect(nudge?.key).toBe("lessons");
    expect(nudge?.href).toBe("/mahjong-lessons-las-vegas");
    const withNudge: Turn[] = [...history, { role: "user", content: "x" }, { role: "assistant", content: "y", entry_id: "dragons", nudge_key: "lessons" }];
    expect(pickNudge(withNudge, get("flowers"), entryById)).toBeNull();
  });
  test("advanced questions suggest MAHJ103 and long threads suggest open play", () => {
    let history = answered("What makes a hand dead?");
    history = answered("Does a dead hand still pay the winner?", history);
    expect(pickNudge(history, get("false-mahjong"), entryById)?.key).toBe("advanced");
    let mixed: Turn[] = [];
    for (const q of ["Can I use a joker in a pair?", "When can I exchange a joker?", "How does the Charleston work?", "What is a courtesy pass?"]) mixed = answered(q, mixed);
    expect(pickNudge(mixed, get("call-window"), entryById)?.key).toBe("open-play");
  });
});

test.describe("server-only boundary", () => {
  test("client components import only the labels leaf of the core", () => {
    const roots = ["app", "components"].map((d) => path.resolve(__dirname, "..", d));
    const offenders: string[] = [];
    const walk = (dir: string) => {
      for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(name)) {
          const src = fs.readFileSync(p, "utf8");
          const client = /^\s*["']use client["']/m.test(src);
          if (client && /lib\/ask-core\/(?!engine\/labels)/.test(src)) offenders.push(p);
          if (client && /lib\/ask\/(site|model-client|nudges)/.test(src)) offenders.push(p);
        }
      }
    };
    roots.forEach(walk);
    expect(offenders).toEqual([]);
  });
});

test.describe("owner override on payments", () => {
  // payments-basics carries the Find My Mahj owner decision of 2026-08-30; this site's owner
  // decision of 2026-08-29 keeps payment wording neutral, so the override excludes it and the
  // site's own money entries answer, including the pending self-drawn-win entry that yields to
  // the decision everywhere else.
  const exclude = new Set(LVM_SITE.overrides.map((o) => o.canonical_id));
  const expectations: Array<[string, string]> = [
    ["who pays when i win on a discard", "pay-discard-win"],
    ["does the discarder pay double", "pay-discard-win"],
    ["does anyone pay in a wall game", "wall-game-payment"],
    ["does self pick pay more", "self-drawn-win"],
    ["what do you get for self pick", "self-drawn-win"],
    ["is a jokerless hand worth double", "joker-free"],
  ];
  for (const [q, id] of expectations) {
    test(`${q} -> ${id}`, () => {
      const r = lookup({ question: q }, { exclude });
      expect(r.kind, q).toBe("answer");
      expect(r.entry?.id, q).toBe(id);
      expect(r.answer, q).not.toMatch(/League|NMJL|National Mah Jongg/);
    });
  }
});
