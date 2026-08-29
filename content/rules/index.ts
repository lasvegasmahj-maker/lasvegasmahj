import { JOKERS } from "./jokers";
import { CHARLESTON } from "./charleston";
import { CALLING_TILES } from "./calling-tiles";
import { DEAD_HANDS } from "./dead-hands";
import { THE_CARD } from "./the-card";
import { WINNING } from "./winning";
import { SCORING } from "./scoring";
import { ETIQUETTE } from "./etiquette";
import type { RuleQA, RulesTopic } from "./types";

export type { RuleQA, RulesTopic, RuleKind, RuleEvidence } from "./types";

export const RULES_TOPICS: RulesTopic[] = [JOKERS, CHARLESTON, CALLING_TILES, DEAD_HANDS, THE_CARD, WINNING, SCORING, ETIQUETTE];

export function getTopic(slug: string): RulesTopic {
  const topic = RULES_TOPICS.find((t) => t.slug === slug);
  if (!topic) throw new Error(`Unknown rules topic: ${slug}`);
  return topic;
}

export function getQA(ref: string): RuleQA {
  const [slug, id] = ref.split(".");
  const qa = getTopic(slug).qa.find((x) => x.id === id);
  if (!qa) throw new Error(`Unknown rules Q&A: ${ref}`);
  return qa;
}

// The page text is the single source for any Ask entry that mirrors a /rules page.
export function pageAnswer(ref: string): string {
  return getQA(ref).a;
}
