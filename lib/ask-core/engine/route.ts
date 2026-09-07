// The deterministic routing contract shared by both sites.
//
// Before this file existed, each site made its own decision about whether a question belonged
// to the rules engine, using its own regex, in its own repository, with no history and no way
// for anything to compare the two. The release gate of 2026-09-06 confirmed nineteen routing
// blockers that came out of that arrangement, including two divergences that shipped green
// behind byte-identical cores and identical fingerprints.
//
// So the decision moves here, and every site asks the same function. Three rules govern it:
//
//   1. A site may take a question away from the rules engine only on STRUCTURAL site intent
//      (engine/site-intent.ts). One generic noun or verb never decides.
//   2. A correct shared-rule result is never replaced by a site answer. When a question carries
//      both a rules proposition and structural site intent, the rule is answered first and the
//      site's own material follows it.
//   3. Conversation history is consulted BEFORE any site fallback, so a follow-up inside an
//      active rules thread cannot be ejected by the words it happens to contain.
//
// Every route except `discovery`, `local` and `topic_switch` obliges the site to call lookup()
// and serve what it returns. A site may fall back to its own answer only when the rules engine
// reaches no entry.

import { cardDemandedOfAssistant, isCardContentRequest } from "./guards.ts";
import { needsClarification } from "./clarify.ts";
import { prepare, spellfix, normalizeQuestion } from "./normalize.ts";
import { placeOnlySearch, siteIntent, TOPIC_SWITCH_PHRASE, type SiteIntentKind } from "./site-intent.ts";
import { explicitRuleAsk, rulesProposition, tournamentForPlay } from "./topic.ts";
import type { Turn } from "./lookup.ts";
import type { SiteConfig } from "../site.ts";

export type RouteKind =
  // 1. A request to reproduce annual-card content. Refused on every site, every branch.
  | "card_content"
  // 2. A rules question. The rules engine answers it.
  | "rules"
  // 3. An elliptical turn inside an active rules thread ("what about a pair though").
  | "rules_followup"
  // 4. A rules question missing one deciding fact. The engine asks rather than guesses.
  | "rules_ambiguous"
  // 5. A rules question asked for tournament play, or for another mahjong style.
  | "tournament_clarify"
  // 6. Find My Mahj: a directory search.
  | "discovery"
  // 7. Las Vegas Mahjong: the studio, lessons, open play, booking.
  | "local"
  // 8. The player explicitly abandoned the thread and asked the site for something else.
  | "topic_switch"
  // A genuine rules question AND a genuine search in one sentence. The rule is served first.
  | "mixed"
  // 9. Nothing decided it. The site still tries the rules engine, then its own fallback.
  | "unknown";

export type RouteDecision = {
  kind: RouteKind;
  // Which rule fired. Carried into logs and the conformance harness, never shown to a player.
  reason: string;
  // Where a topic switch is going.
  switchTo?: SiteIntentKind;
  // True whenever the site must call lookup() and serve its result.
  consultsRules: boolean;
};

const RULES_ROUTES = new Set<RouteKind>(["card_content", "rules", "rules_followup", "rules_ambiguous", "tournament_clarify", "mixed", "unknown"]);

function decide(kind: RouteKind, reason: string, switchTo?: SiteIntentKind): RouteDecision {
  return { kind, reason, consultsRules: RULES_ROUTES.has(kind), ...(switchTo ? { switchTo } : {}) };
}

/** Is there a rules thread the player could still be following up on? */
export function activeRulesThread(history: readonly Turn[] | undefined): boolean {
  if (!history?.length) return false;
  for (let i = history.length - 1; i >= 0; i--) {
    const t = history[i];
    if (t.role === "assistant" && t.entry_id) return true;
  }
  return false;
}

export type RouteInput = {
  question: string;
  history?: readonly Turn[];
  site: SiteConfig;
  // A clarification the player is answering. A reply is always part of the rules thread it
  // belongs to, whatever words it contains.
  clarify?: { id: string; question: string } | null;
};

export function route(input: RouteInput): RouteDecision {
  const raw = normalizeQuestion(input.question);
  const q = prepare(raw);
  if (!q) return decide("unknown", "empty");

  // A reply to a pending clarification belongs to that clarification. This is what kept
  // "when do you start it" from being read as studio hours mid-thread (gate blocker 8).
  if (input.clarify?.id) return decide("rules_ambiguous", "clarification reply");

  const intent = siteIntent(q, input.site.site);
  const props = rulesProposition(q);

  // 8. Only an explicit abandonment, and only towards something the site can actually serve.
  if (TOPIC_SWITCH_PHRASE.test(q) && intent.structural) return decide("topic_switch", `topic switch: ${intent.reason}`, intent.kind!);

  // A demand for the card aimed at the assistant is refused before anything else can excuse it.
  // "Print me the card so I can bring it to your Las Vegas class" is not a booking enquiry, and
  // "can you show me the singles and pairs section" is not a lesson.
  const fixed = spellfix(q);
  if (cardDemandedOfAssistant(fixed) && isCardContentRequest(fixed)) return decide("card_content", "annual card content demanded outright");

  // Looking for a person or a place to play is a search even when it names tournament play:
  // "looking for a teacher who can get me ready for tournament play" wants a teacher.
  if (intent.structural && /teach-search/.test(intent.reason)) {
    return decide(intent.kind === "discovery" ? "discovery" : "local", intent.reason);
  }

  // 5. Asked FOR tournament play. Ahead of the rest of site intent because "how much is the
  // payout at a tournament" is a rules question wearing a price frame, and "at the Henderson
  // tournament next week, can we still call for an exposure" names a place beside a listing
  // noun. "Any tournaments in Florida" never matches: this test needs the tournament to sit
  // behind a preposition, not to be the thing being searched for.
  if (tournamentForPlay(q)) return decide("tournament_clarify", "asked for tournament play");

  // Shapes the site owns outright, whatever else the sentence carries: asking the business
  // about itself, a course syllabus, the room's capacity, buying equipment, correcting a
  // listing, what to name your own group. "What should I call my new mahjong group" is not a
  // question about calling mahjong. A weak object plus a search frame is site-owned only when
  // nobody explicitly asked whether a rule allows something.
  const siteOwned =
    intent.structural &&
    (/offer-self|where-frame|hours-frame|course-syllabus|naming-own-group|shop-frame|proper-place-adjacent|fit-frame|contact-sense|listing-noun|venue-has|person-named|find\+place|strong-object\+(?:find|place|capacity|correction|book|price)/.test(intent.reason) ||
      (!props && /play-search/.test(intent.reason)) ||
      (!explicitRuleAsk(q) && /weak-object\+(?:find|place|book|price)/.test(intent.reason)));
  if (siteOwned) return decide(intent.kind === "discovery" ? "discovery" : "local", intent.reason);

  // 1. Card content. A structural search for a person who teaches the card is a search, not a
  // request for the card, so the guard is asked only once nothing structural wants the question.
  // Refusing to reproduce the card is right; refusing to look for a teacher is the release
  // gate's blockers 7 and 17.
  if (!intent.structural && isCardContentRequest(fixed)) return decide("card_content", "annual card content");

  // 6/7. Structural site intent, and rule 2: a rules proposition is never replaced by it.
  if (intent.structural) {
    if (isCardContentRequest(fixed)) return decide(intent.kind === "discovery" ? "discovery" : "local", `${intent.reason}, card named inside a search`);
    if (props) return decide("mixed", `rules proposition beside ${intent.reason}`);
    return decide(intent.kind === "discovery" ? "discovery" : "local", intent.reason);
  }

  // A rule noun beside a real place, with nobody explicitly asking about a rule, is a search:
  // "exposures in Scottsdale" wants listings, "in Phoenix we play that you can pass a joker in
  // the courtesy, is that legal" wants the rule (release gate, root problem B).
  if (placeOnlySearch(q, explicitRuleAsk(q))) return decide(intent.kind === "discovery" ? "discovery" : "local", "place named, nobody asked about a rule");

  // 2. An ordinary rules question.
  if (props) {
    const clar = needsClarification(spellfix(q), () => true);
    if (clar) return decide(clar.id === "tournament" || clar.id === "ruleset" ? "tournament_clarify" : "rules_ambiguous", `clarification ${clar.id}`);
    return decide("rules", "rules proposition");
  }

  // 3. Rule 3: history before any fallback.
  if (activeRulesThread(input.history)) return decide("rules_followup", "follow-up in an active rules thread");

  // 9. Undecided. The site tries the rules engine anyway, then its own fallback. This is what
  // stops "who goes first" and "explain the wall" being answered with a studio pointer.
  return decide("unknown", "undecided; rules engine first");
}
