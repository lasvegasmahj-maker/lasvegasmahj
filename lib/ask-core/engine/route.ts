// The deterministic routing contract shared by both sites, as an explicit staged pipeline.
//
// The first version of this file was a list of early returns, and the release gate of 2026-09-07
// showed that the list order did not match the contract the file's own comment claimed. Rule 2
// (a rules answer is never replaced by a site answer) and rule 3 (history is read before any
// fallback) were both evaluated LAST. The documented `mixed` route fired zero times in
// forty-eight compound probes. Fifteen of that gate's twenty-nine blockers came out of the gap
// between the written contract and the code.
//
// So the contract is now the control flow. Five stages run in a fixed order, each producing
// EVIDENCE rather than an answer, and one resolution step decides. Nothing about which surface
// wins is settled before all the evidence exists.
//
//   STAGE A  CONTEXT           continuation, explicit new topic, or standalone
//   STAGE B  PROTECTED CONTENT a genuine request to reproduce the annual card
//   STAGE C  RULES EVIDENCE    is a canonical rule supported, and is it being ASKED about
//   STAGE D  SITE EVIDENCE     structural discovery or business intent, and of which strength
//   STAGE E  RESOLUTION        rules / discovery / local / mixed / clarify / unknown
//
// The invariants this must satisfy are executable, in tests/invariants.test.ts. Read those
// before changing anything here: they are the contract in a form that fails a build.

import { cardDemandedOfAssistant, isCardContentRequest, ELLIPTICAL_RE } from "./guards.ts";
import { needsClarification } from "./clarify.ts";
import { prepare, spellfix, normalizeQuestion } from "./normalize.ts";
import { retrieve } from "./retrieve.ts";
import { looseNamedPlace, placeOnlySearch, SITE_INTENT_INTERNALS, siteIntent, siteObjectIsAdjunct, TOPIC_SWITCH_PHRASE, trailingPlace, type SiteIntentKind } from "./site-intent.ts";
import { explicitRuleAsk, rulesProposition, tournamentForPlay } from "./topic.ts";
import { PERMISSION_FRAME, QUESTION_FRAME } from "../corpus/concepts.ts";
import { AMERICAN_RE, VARIANT_RE } from "../corpus/matchers.ts";
import type { Turn } from "./lookup.ts";
import { excludedIds, type SiteConfig } from "../site.ts";

export type RouteKind =
  // A request to reproduce annual-card content. Refused on every site, every branch.
  | "card_content"
  // An ordinary rules question.
  | "rules"
  // An elliptical turn inside an active rules thread.
  | "rules_followup"
  // A rules question missing one deciding fact.
  | "rules_ambiguous"
  // Asked for tournament play, or in another mahjong style.
  | "tournament_clarify"
  // Find My Mahj: a directory search.
  | "discovery"
  // Las Vegas Mahjong: studio, lessons, open play, booking.
  | "local"
  // The player explicitly abandoned the thread and asked the site for something else.
  | "topic_switch"
  // A genuine rules question AND a genuine search in one sentence. Both halves are served.
  | "mixed"
  // Nothing decided it. The site tries the rules engine, then its own fallback.
  | "unknown";

export type ContextKind = "clarify_reply" | "continuation" | "new_topic" | "standalone";

export type RulesEvidence = {
  // The corpus actually has an entry that matches. Stronger evidence than any vocabulary test,
  // because it is the same test that will choose the answer.
  supported: boolean;
  entry: string | null;
  // The player is ASKING about a rule rather than naming one in passing. "Find a teacher who
  // teaches exposures" names one; "can I exchange a joker in Phoenix" asks one.
  ask: boolean;
  proposition: boolean;
  explicit: boolean;
  tournament: boolean;
  clarification: string | null;
};

export type SiteEvidence = {
  structural: boolean;
  weak: boolean;
  kind: SiteIntentKind | null;
  reason: string;
  // A search for a person, a place or a listing, as against a question about the business
  // itself. Only a search may take a sentence that also asks a rule, and only then when it
  // names both something to find and somewhere to find it.
  strength: "search" | "business" | "none";
};

export type RouteDecision = {
  kind: RouteKind;
  // Which rule fired. Carried into logs and the conformance harness, never shown to a player.
  reason: string;
  // Where a topic switch is going.
  switchTo?: SiteIntentKind;
  // True whenever the site must call lookup() and serve its result.
  consultsRules: boolean;
  // On a mixed route, the CLAUSE the site should act on. A site must search this rather than the
  // whole sentence, or it parses a town out of the rules half (gate 2, blockers 7 and 17).
  siteQuery?: string;
  evidence: { context: ContextKind; rules: RulesEvidence; site: SiteEvidence };
};

const RULES_ROUTES = new Set<RouteKind>(["card_content", "rules", "rules_followup", "rules_ambiguous", "tournament_clarify", "mixed", "unknown"]);

// ---------------------------------------------------------------------------
// STAGE A: context
// ---------------------------------------------------------------------------

/** Is there a rules thread the player could still be following up on? */
export function activeRulesThread(history: readonly Turn[] | undefined): boolean {
  if (!history?.length) return false;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "assistant" && history[i].entry_id) return true;
  }
  return false;
}

// A turn that leans on what came before: short, or carrying a word that points back at it.
// "Is there a seat for it in an exposure" and "what time does that happen" are both follow-ups,
// and both used to be ejected to a site surface by the words they happen to contain.
const BACK_REFERENCE = /\b(?:it|that|those|them|this|there|then|same|either|both)\b/i;

export function isElliptical(q: string): boolean {
  const words = q.split(/\s+/).filter(Boolean).length;
  if (words <= 4) return true;
  if (ELLIPTICAL_RE.test(q)) return true;
  return words <= 12 && BACK_REFERENCE.test(q);
}

// ---------------------------------------------------------------------------
// STAGE C: rules evidence
// ---------------------------------------------------------------------------

function rulesEvidenceFor(q: string, site: SiteConfig): RulesEvidence {
  const fixed = spellfix(q);
  const entry = retrieve(fixed, { exclude: excludedIds(site) });
  const proposition = rulesProposition(q);
  const explicit = explicitRuleAsk(q);
  const supported = entry !== null;
  const clar = needsClarification(fixed, () => true);
  return {
    supported,
    entry: entry?.id ?? null,
    // A rule is asked about when the corpus supports it AND the sentence asks something, or
    // when the player named the rule outright, or when the vocabulary is unmistakably about
    // the table even though no entry covers it yet.
    ask: explicit || (supported && (proposition || PERMISSION_FRAME.test(q) || QUESTION_FRAME.test(q))) || (proposition && !supported),
    proposition,
    explicit,
    tournament: tournamentForPlay(q),
    clarification: clar?.id ?? null,
  };
}

// ---------------------------------------------------------------------------
// STAGE D: site evidence
// ---------------------------------------------------------------------------

const SEARCH_REASON = /teach-search|play-search|meet-players|listing-noun|venue-has|person-named|proper-place-adjacent|shop-frame|find\+place|object\+(?:find|place)/;

function siteEvidenceFor(q: string, site: SiteConfig): SiteEvidence {
  const intent = siteIntent(q, site.site);
  return {
    structural: intent.structural,
    weak: intent.weak,
    kind: intent.kind,
    reason: intent.reason,
    strength: !intent.structural ? "none" : SEARCH_REASON.test(intent.reason) ? "search" : "business",
  };
}

// ---------------------------------------------------------------------------
// Clauses, so a compound question can keep both halves
// ---------------------------------------------------------------------------

const CLAUSE_SPLIT =
  /\s*(?:,\s*and\s+|\s+and\s+|;\s*|\s+plus\s+|\s+also\s+|,\s+(?=(?:can|could|do|does|did|is|are|where|what|when|who|how|why|any|i|we)\b))/i;

export function splitClauses(q: string): string[] {
  const parts = q
    .split(CLAUSE_SPLIT)
    .map((c) => c.trim())
    .filter((c) => c.split(/\s+/).filter(Boolean).length >= 3);
  return parts.length >= 2 ? parts : [];
}

// ---------------------------------------------------------------------------
// STAGE E: resolution
// ---------------------------------------------------------------------------

export type RouteInput = {
  question: string;
  history?: readonly Turn[];
  site: SiteConfig;
  clarify?: { id: string; question: string } | null;
};

// A table noun settles a search-frame collision UNLESS it is part of a proper name: "Any groups
// in Blind Pass?" names a Florida beach; "a courtesy pass with three players" names a rule.
const PROPER_PLACE_PAIR = /\b[A-Z][a-z]+\s+(?:Pass|Lake|Street|City|Gap|Park|Mound|Bay|Point|Falls|Heights|Ridge|Grove|Springs|Valley|Creek|Hill|Beach|Island|River|Harbor|Harbour)\b/;
function tableNounDecides(q: string): boolean {
  return SITE_INTENT_INTERNALS.TABLE_NOUN.test(q) && !PROPER_PLACE_PAIR.test(q);
}

const BLANK_RULES: RulesEvidence = { supported: false, entry: null, ask: false, proposition: false, explicit: false, tournament: false, clarification: null };
const NO_SITE: SiteEvidence = { structural: false, weak: false, kind: null, reason: "empty", strength: "none" };

export function route(input: RouteInput): RouteDecision {
  const q = prepare(normalizeQuestion(input.question));
  const site = input.site;

  const decide = (
    kind: RouteKind,
    reason: string,
    ev: { context: ContextKind; rules: RulesEvidence; siteEv: SiteEvidence; switchTo?: SiteIntentKind; siteQuery?: string },
  ): RouteDecision => ({
    kind,
    reason,
    consultsRules: RULES_ROUTES.has(kind),
    ...(ev.switchTo ? { switchTo: ev.switchTo } : {}),
    ...(ev.siteQuery ? { siteQuery: ev.siteQuery } : {}),
    evidence: { context: ev.context, rules: ev.rules, site: ev.siteEv },
  });

  if (!q) return decide("unknown", "empty", { context: "standalone", rules: BLANK_RULES, siteEv: NO_SITE });

  const fixed = spellfix(q);
  const siteEv = siteEvidenceFor(q, site);

  // ---- STAGE A: context ---------------------------------------------------
  const context: ContextKind = input.clarify?.id
    ? "clarify_reply"
    : TOPIC_SWITCH_PHRASE.test(q) && siteEv.structural
      ? "new_topic"
      : activeRulesThread(input.history) && isElliptical(q)
        ? "continuation"
        : "standalone";

  // ---- STAGE B: protected content -----------------------------------------
  // Ahead of everything, a pending clarification included: a card demand typed as a reply is
  // still a card demand, and one site used to refuse it while the other did not (gate 2,
  // blockers 18 and 20). Invariant 6 keeps this to genuine requests, not word presence.
  const cardRequest = isCardContentRequest(fixed);
  if (cardRequest && cardDemandedOfAssistant(fixed)) {
    return decide("card_content", "annual card content demanded of the assistant", { context, rules: BLANK_RULES, siteEv });
  }

  if (context === "clarify_reply") {
    return decide("rules_ambiguous", "reply to a pending clarification", { context, rules: BLANK_RULES, siteEv });
  }
  if (context === "new_topic") {
    return decide("topic_switch", `explicit new topic: ${siteEv.reason}`, { context, rules: BLANK_RULES, siteEv, switchTo: siteEv.kind ?? undefined });
  }

  // ---- STAGE C: rules evidence --------------------------------------------
  const rules = rulesEvidenceFor(q, site);

  // Invariant 4. A continuation belongs to its thread, and site evidence is not consulted.
  if (context === "continuation") {
    if (rules.tournament) return decide("tournament_clarify", "tournament framing inside a rules thread", { context, rules, siteEv });
    return decide("rules_followup", "follow-up in an active rules thread", { context, rules, siteEv });
  }

  // A search that merely names the card is a search; a request for its contents is not.
  if (cardRequest && !(siteEv.structural && siteEv.strength === "search")) {
    return decide("card_content", "annual card content", { context, rules, siteEv });
  }

  // ---- STAGE E: resolution -------------------------------------------------

  // Tournament framing controls before anything answers it outright, unless the player is
  // plainly searching for a tournament rather than asking how to play in one.
  if (rules.tournament && !(siteEv.strength === "search" && !rules.ask)) {
    return decide("tournament_clarify", "asked for tournament play", { context, rules, siteEv });
  }

  // A named non-American style is the same shape of problem: no single answer can stand, and a
  // search must not swallow the question. "Where can I play riichi mahjong in Austin" is both,
  // so it stays mixed and the site adds its listings after the clarification.
  if (VARIANT_RE.test(q) && !AMERICAN_RE.test(q)) {
    if (siteEv.structural) return decide("mixed", "another mahjong style beside a search", { context, rules, siteEv, siteQuery: q });
    return decide("tournament_clarify", "another mahjong style", { context, rules, siteEv });
  }

  // Invariant 9: a sentence carrying a rules question in one clause and a search in another
  // keeps both. This is the route that never fired before.
  // Only a sentence that asks a rule can be mixed. "I am out of tiles, where can I buy a set in
  // Phoenix" mentions tiles and asks nothing about them.
  const clauses = rules.ask ? splitClauses(q) : [];
  if (clauses.length) {
    const perClause = clauses.map((c) => ({ c, r: rulesEvidenceFor(c, site), s: siteEvidenceFor(c, site) }));
    // The rules half must READ as a question. "I am out of tiles, where can I buy a set in
    // Phoenix" narrates a situation and then asks a shop question; only the second half asks.
    const asksSomething = (c: string) =>
      /\?/.test(c) || /^(?:can|could|may|might|do|does|did|is|are|was|were|what|how|when|why|which|who|whose|should|must|am)\b/i.test(c.trim());
    const rulesClause = perClause.find((p) => p.r.ask && p.r.supported && asksSomething(p.c));
    const siteClause = perClause.find((p) => p.s.structural && p !== rulesClause);
    if (rulesClause && siteClause) {
      return decide("mixed", `rules in one clause, ${siteClause.s.reason} in another`, { context, rules, siteEv, siteQuery: siteClause.c });
    }
  }

  // Invariant 3: a valid rules result is never replaced by a weaker site result. Business
  // framing never beats a rules ask; a search does so only when it names both something to find
  // and somewhere to find it, which is what separates "find a teacher in Phoenix who teaches
  // exposures" from "can I exchange a joker in Phoenix".
  const clarifyKind = (id: string): RouteKind => (id === "tournament" || id === "ruleset" ? "tournament_clarify" : "rules_ambiguous");
  if (rules.ask) {
    // A site frame beats a rules ask only when the thing being asked about IS the site's: a
    // lesson, a teacher, a club, a listing. "When do your charleston lessons start" asks about
    // lessons; "who teaches the blind pass" and "can I exchange a joker in Phoenix" do not name
    // one at all, and a place or a teaching verb alone must never be enough.
    // Invariant 1: the site's noun has to be what the question is ABOUT. "At my club" is where.
    const namesSiteThing = SITE_INTENT_INTERNALS.OBJECT_STRONG.test(q) && !siteObjectIsAdjunct(q);
    const namesPlace = SITE_INTENT_INTERNALS.PLACE_FRAME.test(q) || trailingPlace(q) || looseNamedPlace(q) || /\bnear me\b/i.test(q);
    const siteWins =
      siteEv.strength === "none"
        ? false
        : // Looking for a person or a place to play: naming either is enough.
          (/teach-search|play-search/.test(siteEv.reason) && (namesSiteThing || namesPlace)) ||
          // A strong site noun bound by a possessive, a time or a price has to BE what the
          // question is about: "can I use a joker in a pair at my club" says where, not what.
          (/strong-object\+/.test(siteEv.reason) && namesSiteThing) ||
          // A listing, a venue, a person, a shop, other players: these name the thing on their own.
          /listing-noun|venue-has|person-named|proper-place-adjacent|shop-frame|meet-players/.test(siteEv.reason) ||
          // A search frame beside a place, when what is sought is a listing rather than a rule.
          // "Any games for 2 players in Boca" seeks games; "is there a courtesy pass with three
          // players in Phoenix" seeks a rule and merely says where (invariant 1).
          (/find\+place|weak-object\+(?:find|place)/.test(siteEv.reason) && namesPlace && !tableNounDecides(q)) ||
          // The business answering for itself, when its own noun is the subject and not the
          // setting: "which direction is the club from downtown Sarasota", "your signup form".
          (/offer-self|possessive\+booking|course-syllabus|fit-frame|naming-own-group|contact-sense|where-frame|hours-frame|capacity|correction|weak-object\+(?:book|offer|price)/.test(siteEv.reason) &&
            !siteObjectIsAdjunct(q));
    if (!siteWins) {
      if (rules.clarification) return decide(clarifyKind(rules.clarification), `clarification ${rules.clarification}`, { context, rules, siteEv });
      return decide("rules", rules.supported ? `rules ask, entry ${rules.entry}` : "rules ask, no entry yet", { context, rules, siteEv });
    }
    return decide(siteEv.kind === "discovery" ? "discovery" : "local", `${siteEv.reason} names the thing being asked about`, { context, rules, siteEv });
  }

  // No rules ask. Structural site intent takes it.
  if (siteEv.structural) {
    return decide(siteEv.kind === "discovery" ? "discovery" : "local", siteEv.reason, { context, rules, siteEv });
  }

  // A place named with nothing asked about a rule is a search: "mahjong in wind gap pa".
  if (placeOnlySearch(q, rules.ask) || (trailingPlace(q) && !rules.ask && siteEv.weak)) {
    return decide(siteEv.kind === "discovery" ? "discovery" : "local", "a place named, nothing asked about a rule", { context, rules, siteEv });
  }

  // Rules evidence with no site claim still belongs to the rules engine, even when the corpus
  // has nothing yet: it gets a clarification, never a site pointer. This is what keeps "who goes
  // first" and "explain the wall" out of the studio (gate 1, blocker 15).
  if (rules.proposition || rules.supported) {
    if (rules.clarification) return decide(clarifyKind(rules.clarification), `clarification ${rules.clarification}`, { context, rules, siteEv });
    return decide("rules", "rules evidence without a site claim", { context, rules, siteEv });
  }

  // Undecided. The site tries the rules engine anyway, then its own fallback.
  return decide("unknown", "undecided; rules engine first", { context, rules, siteEv });
}
