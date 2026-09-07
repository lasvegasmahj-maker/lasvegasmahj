// The Las Vegas Mahjong overlay on the shared Ask core: brand, Read more links into /rules,
// the studio vocabulary that keeps lessons questions out of the rules engine, and the one
// owner-recorded override. Everything about the rules themselves lives in lib/ask-core.

import { isPending, type CanonicalRule, type SiteConfig } from "@/lib/ask-core/index.ts";

const RULES = "https://www.lasvegasmahj.com/rules";

// Which /rules page carries each canonical entry. Pending entries never link: a "Read more"
// under "Pending instructor review" would be a mixed signal.
export const READ_MORE: Record<string, string> = {
  "jokers-basics": "jokers", "joker-in-pair": "jokers", "joker-exchange": "jokers", "joker-substitute": "jokers", "joker-single": "jokers",
  "joker-singles-pairs-hand": "jokers", "joker-free": "jokers", "joker-call-complete": "jokers", "wall-game-jokers": "jokers",
  dealing: "winning", "winning-mahjong": "winning", "wall-game": "winning", "valid-mahjong": "winning", "discard-win": "winning",
  "false-mahjong": "winning", "change-mind-mahjong": "winning",
  charleston: "charleston", "charleston-stop": "charleston", "charleston-jokers": "charleston", "charleston-blind-pass": "charleston",
  "charleston-passes": "charleston", "courtesy-pass": "charleston", "look-before-pass": "charleston", "wrong-pass-count": "charleston",
  "open-vs-closed": "the-card", "closed-hand-final-tile": "the-card", "annual-card": "the-card", "card-numbers": "the-card",
  "any-like-number": "the-card", "consecutive-numbers": "the-card", "last-years-card": "the-card",
  "calling-discard": "calling-tiles", "pung-vs-kong": "calling-tiles", "most-recent-discard": "calling-tiles", "same-tile-two-calls": "calling-tiles",
  "calling-for-mahjong": "calling-tiles", "call-concealed": "calling-tiles", "expose-immediately": "calling-tiles",
  "courtesies-vs-rules": "etiquette", "table-talk": "etiquette", "call-window": "etiquette", "disputes": "etiquette",
  "see-exposed-tiles": "etiquette", "house-vs-nmjl": "etiquette",
  "dead-hand": "dead-hands", "dead-hand-triggers": "dead-hands", "dead-hand-pays": "dead-hands", "dead-hand-draws": "dead-hands",
  "called-dead": "dead-hands", "wrong-exposure": "dead-hands",
  "wall-game-payment": "scoring", "pay-discard-win": "scoring", "game-value": "scoring", "extra-payments": "scoring",
};

export const PAGE_NAMES: Record<string, string> = {
  jokers: "Jokers",
  charleston: "The Charleston",
  "calling-tiles": "Calling Tiles",
  "dead-hands": "Dead Hands",
  "the-card": "The Card",
  winning: "Winning",
  scoring: "Scoring",
  etiquette: "Etiquette",
};

export function readMoreUrl(e: CanonicalRule): string | undefined {
  if (isPending(e)) return undefined;
  const slug = READ_MORE[e.id];
  return slug ? `${RULES}/${slug}` : undefined;
}

export const LVM_SITE: SiteConfig = {
  site: "lvm",
  helperName: "Ask Las Vegas Mahjong",
  siteHost: "lasvegasmahj.com",
  readMoreUrl,
  overrides: [
    {
      canonical_id: "payments-basics",
      action: "exclude",
      owner_decision:
        "LVM 2026-08-29: payment conventions (discarder pays double, self-drawn, wall game) are house matters with neutral wording; nothing cites a League rule book or an NMJL standard",
      reason:
        "FMG 2026-08-30 approved payments-basics with League payment structure wording. Two owner decisions conflict; only the owner can reconcile them (mahj-ask-core docs/OWNER-RULE-ESCALATION.md, A1). Until then this site answers payment questions from its neutral money entries.",
    },
  ],
};

// What a non-rules question gets here: no rule, a plain pointer into the site.
export const LOCAL_ANSWER =
  "I can only help with American Mahjong rules questions. For lessons, open play, private events, or anything about the studio, the links below have it. Try a rules question like: can I use a joker in a pair?";

export const LOCAL_SUGGESTIONS = [
  { label: "See lessons", href: "/mahjong-lessons-las-vegas" },
  { label: "Open play", href: "/mahjong-open-play-las-vegas" },
  { label: "Rules guide", href: "/rules" },
];

export const RULES_FALLBACK = "/rules";
