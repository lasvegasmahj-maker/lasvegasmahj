// The rules truth layer. Every /rules page renders its Q&A from one of these modules, and
// every Ask entry that mirrors a page reads the same text, so a rule can only change in one
// place. Evidence tiers follow the owner's hierarchy: the rules panel printed on the League
// card, then the owner's own handouts and approved decisions, then League rule book claims
// we have not been able to verify in our materials, then unverified published copy.

export type RuleKind = "standard" | "house";
export type RuleEvidence = "card" | "owner" | "rulebook" | "unverified";

export type RuleQA = {
  id: string;
  q: string;
  a: string;
  kind: RuleKind;
  evidence: RuleEvidence;
};

export type RulesTopic = {
  slug: string;
  title: string;
  qa: RuleQA[];
};
