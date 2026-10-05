// One decision function, called by both sites.
//
// The routing contract (engine/route.ts) says which surface owns a question; this file joins
// that to the rules engine and produces the single outcome a site must act on. It exists so
// that "the two sites answer the same question the same way" is a property of the shared core
// rather than a promise two separate route handlers make independently. The release gate of
// 2026-09-06 confirmed three cross-site divergences that shipped green precisely because no
// shared code ever evaluated a site's own routing.
//
// A site may still decorate: Find My Mahj runs its directory search, Las Vegas Mahjong adds its
// studio links. Neither may replace a rules answer this function produced.

import { lookup, type LookupResult, type Turn } from "./lookup.ts";
import { route, type RouteDecision } from "./route.ts";
import { siteIntent } from "./site-intent.ts";
import { summarizeForEscalation } from "./normalize.ts";
import type { ClarifyContext } from "./clarify.ts";
import { excludedIds, type SiteConfig } from "../site.ts";

export type SiteSurface = "discovery" | "local";

export type AskDecision =
  // Serve `result` from the shared rules engine. On a "mixed" route the site appends its own
  // material after the rule, never instead of it.
  | { kind: "rules"; route: RouteDecision; result: LookupResult; appendSiteResults: boolean }
  // The site answers: a directory search on Find My Mahj, the studio pointer on Las Vegas
  // Mahjong. Reached only when nothing structural said "rules" and the engine found nothing.
  | { kind: "site"; route: RouteDecision; surface: SiteSurface };

export type AskInput = {
  question: string;
  history?: Turn[];
  clarify?: ClarifyContext | null;
};

const SURFACE: Record<SiteConfig["site"], SiteSurface> = { fmg: "discovery", lvm: "local" };

// The engine reached no entry: a topic clarification offered because nothing matched, an
// unanswerable gap, or an empty question. Distinct from a targeted clarification, which means
// the engine knows exactly which fact it is missing and must be shown.
export function isRulesGap(r: LookupResult): boolean {
  if (r.kind === "gap" || r.kind === "empty") return true;
  return r.kind === "clarify" && r.clarify?.id === "topic";
}

export function askDecision(input: AskInput, site: SiteConfig): AskDecision {
  const decision = route({ question: input.question, history: input.history, clarify: input.clarify ?? null, site });
  const surface = SURFACE[site.site];

  if (!decision.consultsRules) {
    return { kind: "site", route: decision, surface: decision.switchTo ?? surface };
  }

  const result = lookup({ question: input.question, history: input.history, clarify: input.clarify ?? null }, { exclude: excludedIds(site) });

  // Nothing declared this a rules question and the engine found nothing to say. Only here may
  // the site's own answer stand. Every other route keeps the engine's result, which is what
  // stops "who goes first" and "explain the wall" being met with a studio pointer.
  if ((decision.kind === "unknown" || decision.kind === "mixed") && isRulesGap(result)) {
    // ...and only when the question names something this site actually sells or lists. With no
    // site object at all, "what does consecutive run mean" is a rules question we cannot answer
    // yet, and asking which part of the game it is about beats pointing at a lessons page.
    // ...or when the question shares no vocabulary at all with the corpus. "asdfasdf" is not a
    // rules question the corpus is missing, and the site's own guidance is the honest reply.
    // Using the topic classifier's "other" verdict here was tried and reintroduced 56 captures,
    // which is what blocker 15 was made of; the escalation summary is the narrow test.
    if (siteIntent(input.question, site.site).weak || !summarizeForEscalation(input.question).trim()) {
      return { kind: "site", route: decision, surface };
    }
  }

  return { kind: "rules", route: decision, result, appendSiteResults: decision.kind === "mixed" };
}
