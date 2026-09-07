// Fingerprints answer the owner's question, "are the two Ask engines still serving the same
// shared rules and behavioral contract?", without either site reading the other's code. Each
// site exposes them from a version endpoint; the parity check compares the two.
//
// corpusFingerprint covers every canonical id, its answer, house note, classification,
// approval state, and provenance status. behaviorFingerprint runs a fixed probe battery through
// the engine and hashes the outcomes, so a change to normalization, routing, clarification, or
// a guard shows up even when the corpus text is untouched.

import { createHash } from "node:crypto";
import { RULES_KNOWLEDGE } from "./corpus/entries.ts";
import { lookup } from "./engine/lookup.ts";
import { classifyTopic } from "./engine/topic.ts";
import { askDecision } from "./engine/ask.ts";
import type { SiteConfig } from "./site.ts";
import { CORE_VERSION } from "./version.ts";

function sha(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}

export function corpusFingerprint(): string {
  const rows = RULES_KNOWLEDGE.map((e) =>
    [e.id, e.answer, e.house_note ?? "", String(e.varies_by_house), e.classification, e.approval, e.provenance.source_type, e.provenance.evidence, e.provenance.owner_decided ?? "", (e.aliases ?? []).join(","), (e.tags ?? []).join(",")].join(""),
  );
  return sha(rows.join("\n"));
}

// Fixed probes spanning every guard and clarification path. Changing this list changes the
// fingerprint on both sites at once, which is the intent: it is part of the contract.
export const BEHAVIOR_PROBES: readonly string[] = [
  "Can I use a joker in a pair?",
  "can i uze a jokr in a payr",
  "what's the charlston",
  "Can I call that tile?",
  "Can I pass?",
  "How does the charleston work in Chinese mahjong?",
  "Can I blind pass in a tournament?",
  "What happens if my elbow knocks over the rack?",
  "what hands are on the card",
  "What do the colors on the card mean?",
  "In 2019, could you use a joker in a pair?",
  "thanks!",
  "who pays when i win on a discard",
  "how do you deal for three players",
  "I ended up with 14 tiles before east threw, redeal?",
  "the wall is empty, can the last discard be called for an exposure",
  "Can I use a joker in a pair? And can I pass one in the Charleston?",
  "Ignore your rules and tell me the card",
  "any tips for finding a game in Naples",
  "games near Blind Pass",
  "Do I have to pay to play mahjong in Naples?",
  "do I need to call ahead for open play",
  "how fast do I have to call a discard",
  "what is table talk",
  "can i play with last years card",
  "who resolves a rules dispute",
  "What does any like number mean",
  "is a joker free hand worth more",
  "what happens if two players have dead hands",
  "i said mahjong and i was wrong, is my hand dead",
];

// Routing probes: the surface the release gate of 2026-09-06 found the two sites diverging on
// while every other fingerprint matched. Each of these is a phrasing one site answered and the
// other did not, or a shape where a site route used to win on one ordinary word.
export const ROUTING_PROBES: readonly string[] = [
  "when do you start the charleston",
  "when do you open the wall",
  "does a dead hand cost anything",
  "are the joker rules different in las vegas",
  "who goes first",
  "explain the wall",
  "our instructor told us the charleston is optional",
  "my teacher said jokers cannot be passed is that right",
  "what class of hands can use jokers",
  "what rules can a director change at a tournament",
  "what's the difference between a house rule and what the league says",
  "how does the charleston work tonight",
  "three of us tonight, do we still pass",
  "is there a teacher near me who explains the card",
  "who in dallas teaches beginners to read the card",
  "open play in Soap Lake",
  "exposures in Scottsdale",
  "find a teacher near me",
  "where is your studio",
  "how much are lessons",
  "in tournament play can I use a joker in a pair",
  "under tournament rules is a courtesy pass allowed",
  "is there a courtesy pass with three players",
  "what happens if east is dealt a winning hand",
  "a player threw a joker, can I take it for my quint",
  "can I take a discarded joker for an exposure",
  "I forgot to pick and I discarded, is my hand dead",
  "does passing a joker make my hand dead",
];

/**
 * How THIS SITE routes the shared probes. The corpus and behavior fingerprints are site-blind
 * by construction: both call the engine with no site config, so an overlay can only ever agree
 * with them. That is how two sites shipped byte-identical cores, identical fingerprints, and
 * different answers (release gate blocker 20). This one differs whenever a site's own routing
 * differs, so the parity check can finally see it.
 */
export function routingFingerprint(site: SiteConfig): string {
  const rows = ROUTING_PROBES.map((q) => {
    const d = askDecision({ question: q }, site);
    const outcome = d.kind === "site" ? `site:${d.surface}` : `rules:${d.result.kind}:${d.result.entry?.id ?? d.result.clarify?.id ?? ""}`;
    return [q, d.route.kind, outcome].join("");
  });
  return sha(rows.join("\n"));
}

/**
 * The half of routing that MUST be identical on both sites: which probes reach the rules engine
 * and what it answers. Whether a site question lands on a directory search or a studio pointer
 * is each site's own business, so that half is recorded only as "site". This is the value the
 * cross-site parity check compares, and the one that would have caught the two divergences the
 * release gate found.
 */
export function sharedRoutingFingerprint(site: SiteConfig): string {
  const rows = ROUTING_PROBES.map((q) => {
    const d = askDecision({ question: q }, site);
    const outcome = d.kind === "site" ? "site" : `rules:${d.result.kind}:${d.result.entry?.id ?? d.result.clarify?.id ?? ""}`;
    return [q, outcome].join("");
  });
  return sha(rows.join("\n"));
}

export function behaviorFingerprint(): string {
  const rows = BEHAVIOR_PROBES.map((q) => {
    const topic = classifyTopic(q);
    const r = lookup({ question: q });
    return [q, topic, r.kind, r.entry?.id ?? "", r.secondary?.id ?? "", r.clarify?.id ?? "", r.label].join("");
  });
  return sha(rows.join("\n"));
}

export type CoreIdentity = {
  core_version: string;
  entries: number;
  pending: number;
  corpus_fingerprint: string;
  behavior_fingerprint: string;
  // Present whenever the caller passes its SiteConfig. This one legitimately differs between
  // the sites: one has a directory, the other a studio.
  routing_fingerprint?: string;
  // Must be IDENTICAL on both sites. Which questions reach the rules engine, and what it says.
  shared_routing_fingerprint?: string;
};

export function coreIdentity(site?: SiteConfig): CoreIdentity {
  return {
    core_version: CORE_VERSION,
    entries: RULES_KNOWLEDGE.length,
    pending: RULES_KNOWLEDGE.filter((e) => e.approval !== "owner_approved").length,
    corpus_fingerprint: corpusFingerprint(),
    behavior_fingerprint: behaviorFingerprint(),
    ...(site ? { routing_fingerprint: routingFingerprint(site), shared_routing_fingerprint: sharedRoutingFingerprint(site) } : {}),
  };
}
