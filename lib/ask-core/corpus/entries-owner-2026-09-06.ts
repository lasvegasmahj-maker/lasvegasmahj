// Owner decisions of 2026-09-06, made in response to the release gate that stopped v1.0.2.
//
// Each of these scenarios previously had no entry, or had one whose text answered a different
// question and inverted the ruling for this one. The owner (a certified American mahjong
// instructor, and the owner of both sites) decided them directly, so they carry an explicit
// decision date and outrank approval by publication wherever both would fit.
//
// Two further decisions of the same date are recorded in code rather than as entries:
//   * Explicit tournament language must reach the tournament clarification (engine/topic.ts,
//     engine/clarify.ts). Directors set their own procedures, so no single answer can stand.
//   * The exposure-only claim on the deal's very final discard stays UNRESOLVED. last-tile-of-wall
//     already says so in the owner's own words, and the matcher now reaches it from the plainer
//     phrasings too.

import type { CanonicalRule, Provenance } from "./types.ts";
import { COURTESY, DEALT_HAND_SCENE, MAHJONG_CUE, THREE_PLAYER_SEATS } from "./matchers.ts";

const DECIDED = "2026-09-06" as const;

function ownerDecided(ref: string): Provenance {
  return {
    source_type: "owner_approved",
    source_title: "Owner decision 2026-09-06, made on the release gate's open questions (certified American mahjong instructor, owner of both sites)",
    source_ref: ref,
    owner_review_required: false,
    evidence: "verified",
    owner_decided: DECIDED,
    approved_via: "shared",
  };
}

// The courtesy pass belongs to the four-handed Charleston. A three-handed table has no
// Charleston at all under League rules, so it has no courtesy pass either.
const THREE_PLAYER_COURTESY = new RegExp(`${COURTESY.source}|\\bacross (pass|swap|exchange|trade)\\b|\\bpass across\\b`, "i");

// East holding a complete hand as dealt, before anybody discards.
const HEAVENLY_SCENE = new RegExp(
  `${DEALT_HAND_SCENE.source}|\\bheavenly hands?\\b|\\bon the dealt hand\\b|\\bdealt hand\\b[^.?!]{0,24}\\b(mahjong|maj|win|wins|winning|complete)\\b|\\b(east|the dealer)\\b[^.?!]{0,40}\\b(dealt|deal)\\b[^.?!]{0,30}\\b(complete|winning|mahjong|maj)\\b|\\b(dealt|deal)\\b[^.?!]{0,30}\\b(a )?(complete|winning) hand\\b|\\b(mahjong|maj)\\b[^.?!]{0,30}\\b(straight (off|from) the deal|right off the deal|on the deal|as dealt|before the charleston)\\b`,
  "i",
);
// What is being asked about that dealt hand: a win, or the Heavenly Hand by name.
const HEAVENLY_ASK = new RegExp(`${MAHJONG_CUE.source}|\\bheavenly\\b|\\b(winning|complete|valid) hands?\\b|\\bdeclares?\\b`, "i");

export const OWNER_2026_09_06_ENTRIES: CanonicalRule[] = [
  {
    id: "three-player-courtesy-pass",
    category: "charleston",
    level: "core",
    questions: ["Is there a courtesy pass with three players?"],
    related: ["three-player-procedure", "courtesy-pass", "charleston"],
    topic: "The courtesy pass with three players",
    question_patterns: [THREE_PLAYER_SEATS, THREE_PLAYER_COURTESY],
    keywords: ["three player", "three handed", "courtesy pass", "3 players"],
    requires: [THREE_PLAYER_SEATS, THREE_PLAYER_COURTESY],
    answer:
      "No. League three-handed play leaves the Charleston out altogether, and the courtesy pass belongs to the end of the Charleston, so standard three-handed play has no courtesy pass either. If your table likes to pass anyway with three, that is a house variation, not a League procedure, and everyone should agree on it before the first hand.",
    varies_by_house: true,
    house_note: "Any passing at a three-handed table is a house variation. Say so out loud before you start, so nobody thinks it is the League rule.",
    confidence: "high",
    approval: "owner_approved",
    classification: "standard_nmjl_rule",
    provenance: ownerDecided("Owner decision on the release gate's question 1: standard NMJL three-player play has no courtesy pass, and any Charleston-style passing with three is a house variation"),
    last_verified: DECIDED,
  },
  {
    id: "heavenly-hand",
    category: "winning",
    level: "advanced",
    questions: ["What happens if East is dealt a winning hand?"],
    related: ["dealing", "winning-mahjong", "charleston"],
    tags: ["money"],
    topic: "East dealt a winning hand",
    question_patterns: [HEAVENLY_SCENE, HEAVENLY_ASK],
    keywords: ["heavenly hand", "dealt", "east", "mahjong", "deal"],
    requires: [HEAVENLY_SCENE, HEAVENLY_ASK],
    answer:
      "That is the Heavenly Hand. If East holds a valid mahjong in the 14 tiles as dealt, the Charleston is waived and East declares immediately. It settles as a self-picked hand, and each of the other three players pays double.",
    varies_by_house: false,
    confidence: "high",
    approval: "owner_approved",
    classification: "standard_nmjl_rule",
    provenance: ownerDecided("Owner decision on the release gate's question 4A: East dealt a valid mahjong is the Heavenly Hand, Charleston waived, declared immediately, settled as self-picked with each other player paying double"),
    last_verified: DECIDED,
  },
];
