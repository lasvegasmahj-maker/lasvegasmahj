import {
  CURRENT_CARD_YEAR,
  KNOWLEDGE_BY_ID,
  RULES_KNOWLEDGE,
  type AskCategory,
  type KnowledgeEntry,
} from "./knowledge";

// Deterministic core of Ask a Mahjong Rule. Every answer path here works with no model
// at all, and the model layer (lib/ask/llm.ts) may only rephrase what this file retrieves.
// Order of guards matters: card content is refused before any retrieval so no phrasing can
// pull hand listings out of the knowledge base; other variants get a clarification; an
// unmatched question returns an honest "cannot verify", never a guessed rule.

import { type AskLabel } from "./labels";
export { type AskLabel } from "./labels";

export type Turn = {
  role: "user" | "assistant";
  content: string;
  entry_id?: string;
  nudge_key?: string;
};

export type EngineResult = {
  kind: "answer" | "card_refusal" | "clarify" | "unverified" | "offtopic" | "smalltalk";
  answer: string;
  label: AskLabel;
  entry?: KnowledgeEntry;
  candidates: KnowledgeEntry[];
  followups: string[];
  source_url?: string;
  year_note?: string;
  elliptical: boolean;
  // True when the top entry was reached only through a catch-all word, so the model layer
  // (when enabled) may overrule it with "cannot verify".
  catch_all_only?: boolean;
};

export const MAX_QUESTION_CHARS = 300;

export const CARD_REFUSAL =
  `I cannot share the hands, categories, or values printed on the annual card. The card is copyrighted material sold by the National Mah Jongg League, and buying the current card supports the League. With your ${CURRENT_CARD_YEAR} card in hand, I am happy to explain how any of the general rules work.`;

export const CANNOT_VERIFY =
  "I cannot verify that rule from the approved American Mahjong rules I work from, so I will not guess. Check with your table or the official National Mah Jongg League rules, and we will work on adding a verified answer.";

export const OFF_TOPIC =
  "I can only help with American Mahjong rules questions. Try something like: can I use a joker in a pair? Or: what happens when two players call the same tile?";

export const SMALL_TALK = "Happy to help. Ask another rule any time, or start a new question below.";

const CARD_CONTENT_RES: RegExp[] = [
  /(which|what|list|all|show|tell|read|give|name|every|how many|any|new|different)\b.{0,25}\b(hand|line|category|section|value|point)\b.{0,50}\bcard\b/,
  /\bcard\b.{0,40}\b(hand|line|category|section|value|point)\b/,
  /what('s| is| are) on (the|this year'?s?|the current|the new|the \d{4}) card/,
  /(read|list|tell|show|give|send|text|type|write|scan|photo)( me)?( all)? (the|this year'?s?|the current|the \d{4}) card/,
  /\bcard\b.{0,25}(pdf|copy|image|photo|scan|picture|download)/,
  /(pdf|copy|image|photo|scan|picture|download).{0,25}\bcard\b/,
  /\bhand\b (on|for|from|in) (this|the|last|next|the current|the \d{4}) year/,
  /(is|are) (there|a|an|any) .{0,40}\bhand\b.{0,20}(on|in) (the|this|the \d{4}|this year'?s?) card/,
  /(how many|what|which).{0,10}(point|value)\b.{0,40}\b(hand|line|card)\b/,
  /\b(\d{4}|this year'?s?|current|new) card\b.{0,30}\b(hand|line|category|section)\b/,
];

const VARIANT_RE =
  /\b(riichi|japanese|chinese|hong ?kong|cantonese|sichuan|taiwanese|korean|filipino|singapor(e|ean)|mcr|zung ?jung|shanghai)\b/;
const AMERICAN_RE = /\b(american|nmjl)\b/;
const VARIANT_NAMES: Record<string, string> = {
  riichi: "Riichi", japanese: "Japanese", chinese: "Chinese", "hong kong": "Hong Kong", hongkong: "Hong Kong",
  cantonese: "Cantonese", sichuan: "Sichuan", taiwanese: "Taiwanese", korean: "Korean", filipino: "Filipino",
  singapore: "Singapore", singaporean: "Singaporean", mcr: "Chinese Official", "zung jung": "Zung Jung", zungjung: "Zung Jung", shanghai: "Shanghai",
};

const SMALL_TALK_RE =
  /^(thanks?|thank you|thx|ty|ok(ay)?|got it|cool|great|perfect|awesome|nice|good|yes|nope?|hi|hello|hey|bye)\b[!. ]*$/i;

const RULES_SIGNAL_RE =
  /\b(mahjong|joker|tile|charleston|kong|pung|quint|sextet|discard|call|pass|hand|dead|wall|card|nmjl|flower|dragon|wind|bam|crak|dot|soap|expose|pay|win|dealer|east|suit|news|courtesy|blind|rack|player|pair|single|concealed|exchange|mahjong)\b/;

// Bare "why?" style follow-ups carry no topic words at all; the honest deterministic reply
// is the last rule again, and the model layer (when enabled) explains the reason from it.
const WHY_RE = /^(why|why not|really|are you sure|explain|explain that|how come|what does that mean|say more|tell me more|huh|what)\??$/;

const ELLIPTICAL_RE =
  /^(what about|how about|and\b|also\b|same (for|with|thing)|does (that|this|it) (also )?(apply|work|count|go)|is (that|it) (the )?same|what if\b|can i do that|even (in|for|with|during)|what (about )?(in|for|with|during) (a|an|the)|during (a|an|the)|in (a|an|the)|for (a|an|the)|with (a|an|the)|or (a|an|the)|why\b|how come|really\??$|are you sure|what does that mean|explain|and if|but if|but what)/;

const CATEGORY_CONTEXT: Record<AskCategory, string> = {
  jokers: "joker",
  charleston: "charleston",
  calling: "call discard",
  winning: "win mahjong",
  scoring: "pay",
  "dead-hands": "dead hand",
  card: "card",
  tiles: "tile",
  etiquette: "",
  basics: "",
};

// Typos and synonyms players actually type. Applied before punctuation is stripped so the
// dotted N.E.W.S. form still resolves. Verb stems and plural nouns collapse after, so every
// pattern in the knowledge base is written against this normalized vocabulary.
const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bmah[\s-]?jong+g?\b|\bmahj\b|\bma[hj]+ong+g?\b|\bmajong\b|\bmahjhong\b/g, "mahjong"],
  [/\bjo+c?k+e?r+s?\b/g, "joker"],
  [/\bwild\s?(tile|card)s?\b/g, "joker wild"],
  [/\bchar+l?[eai]?s+t[oa]w?n+e?s?\b/g, "charleston"],
  [/\bkongs?\b|\bkung\b|\bkongg\b/g, "kong"],
  [/\bpungs?\b|\bpongs?\b|\bpoong\b/g, "pung"],
  [/\bquints?\b|\bquintets?\b/g, "quint"],
  [/\bsextets?\b|\bsextettes?\b/g, "sextet"],
  [/\bn\.?\s?e\.?\s?w\.?\s?s\.?\b/g, "news"],
  [/\bcra[ck]k?s?\b|\bcharacters?\b/g, "crak"],
  [/\bbams?\b|\bbamboos?\b/g, "bam"],
  [/\bdots?\b|\bcircles?\b/g, "dot"],
  [/\bwhite dragons?\b|\bsoaps?\b/g, "soap dragon"],
  [/\bnational mah\s?jongg?\s?league\b|\bthe league\b|\bnmjl\b/g, "nmjl"],
  [/\bcurtesy\b|\bcourtesey\b|\bcourtesies\b/g, "courtesy"],
  [/\bjoker[\s-]?less\b|\bjoker[\s-]?free\b/g, "joker free"],
  [/\bpare\b|\bpear\b|\bpaire\b/g, "pair"],
  [/\bself[\s-]?(drawn|draw|pick(ed)?)\b/g, "self draw"],
  [/\bpeople\b|\bpersons?\b|\bplayers?\b/g, "player"],
  [/\bclaim(s|ed|ing)?\b|\bcall(s|ed|ing)?\b/g, "call"],
  [/\bdiscard(s|ed|ing)?\b|\bthrow(n|s|ing)?(\s(out|away))?\b|\bthrew\b|\btoss(ed|es|ing)?\b/g, "discard"],
  [/\bpass(es|ed|ing)?\b/g, "pass"],
  [/\bexpos(e|ed|es|ing|ure|ures)\b/g, "expose"],
  [/\b(swap|swaps|swapped|swapping|exchange|exchanges|exchanged|exchanging|redeem|redeems|redeemed|trade|trades|traded|trading)\b/g, "exchange"],
  [/\bdraw(s|n|ing)?\b|\bdrew\b/g, "draw"],
  [/\bwin(s|ning)?\b|\bwon\b/g, "win"],
  [/\bpay(s|ing|ment|ments)?\b|\bpaid\b|\bowe(s|d)?\b/g, "pay"],
  [/\bplay(s|ed|ing)?\b/g, "play"],
  [/\bstop(s|ped|ping)?\b/g, "stop"],
  [/\brefuse(s|d)?\b|\bdecline(s|d)?\b/g, "refuse"],
  [/\bskip(s|ped|ping)?\b/g, "skip"],
  [/\blook(s|ed|ing)?\b|\bpeek(s|ed)?\b/g, "look"],
  [/\bsee(s|ing)?\b|\bsaw\b/g, "see"],
  [/\bshow(s|ed|n|ing)?\b/g, "show"],
  [/\btake(s|n)?\b|\btook\b|\btaking\b/g, "take"],
  [/\bpick(s|ed|ing)?\b/g, "pick"],
  [/\bget(s|ting)?\b|\bgot\b/g, "get"],
  [/\bmake(s)?\b|\bmade\b|\bmaking\b/g, "make"],
  [/\bstart(s|ed|ing)?\b/g, "start"],
  [/\bdeal(s|t|ing)?\b/g, "deal"],
  [/\bmean(s|t|ing)?\b/g, "mean"],
  [/\bcount(s|ed|ing)?\b/g, "count"],
  [/\bgive(s|n)?\b|\bgave\b|\bgiving\b/g, "give"],
  [/\buse(s|d)?\b|\busing\b/g, "use"],
  [/\bneed(s|ed)?\b/g, "need"],
  [/\bchange(s|d)?\b|\bchanging\b/g, "change"],
  [/\bagree(s|d)?\b/g, "agree"],
  [/\bhold(s|ing)?\b|\bheld\b/g, "hold"],
  [/\bkeep(s|ing)?\b|\bkept\b/g, "keep"],
  [/\bsave(s|d)?\b|\bsaving\b/g, "save"],
  [/\bexpire(s|d)?\b/g, "expire"],
  [/\bsubstitute(s|d)?\b|\bsubstituting\b|\bsub\b|\bsubs\b/g, "substitute"],
  [/\bfinish(es|ed|ing)?\b|\bcomplete(s|d)?\b|\bcompleting\b/g, "complete"],
  [/\bput(s|ting)?\b|\blay(s|ing)?\b|\blaid\b|\bplace(s|d)?\b|\bplacing\b/g, "put"],
];

const PLURAL_NOUNS = [
  "joker", "tile", "pair", "single", "kong", "pung", "quint", "sextet", "flower", "dragon",
  "wind", "hand", "discard", "wall", "card", "suit", "bam", "crak", "dot", "rule", "dealer",
  "group", "set", "number", "point", "turn", "game", "year", "charleston", "penalty", "line",
  "category", "section", "value", "mistake", "error", "exposure", "rack", "bet", "mahjong",
];
const PLURAL_RE = new RegExp(`\\b(${PLURAL_NOUNS.join("|")})(s|es)\\b`, "g");

export function normalizeQuestion(raw: string): string {
  let q = String(raw || "").toLowerCase().slice(0, MAX_QUESTION_CHARS);
  q = q.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
  for (const [re, to] of REPLACEMENTS) q = q.replace(re, to);
  q = q.replace(/[^a-z0-9'\s]/g, " ");
  q = q.replace(PLURAL_RE, "$1").replace(/\bcategories\b/g, "category").replace(/\bpenalties\b/g, "penalty");
  return q.replace(/\s+/g, " ").trim();
}

export function isRulesQuestion(normalized: string): boolean {
  return RULES_SIGNAL_RE.test(normalized);
}

export function isCardContentQuestion(normalized: string): boolean {
  return CARD_CONTENT_RES.some((re) => re.test(normalized));
}

export function mentionedYear(raw: string): number | null {
  const m = String(raw || "").match(/\b((?:19|20)\d{2})\b/);
  return m ? Number(m[1]) : null;
}

type Scored = { entry: KnowledgeEntry; score: number; matchLength: number; patternHit: boolean };

// Question words, plus the elliptical starters a follow-up uses ("in the charleston?").
const FRAME_RE = /^(what|what's|whats|how|when|why|can|could|may|is|are|do|does|did|should|explain|tell me|which|who|about|rule|and|also|or)\b|^(in|for|during|with|on|at|what about|how about|what if|same for) (a|an|the|my|your)?\b|\brule\b/;

// Patterns and keywords run against the effective query, so a follow-up's context term can
// complete a pattern ("what about a kong" plus "joker"). Catch-all regexes run against the
// bare question only, so the context term can never create a catch-all match by itself.
function scoreEntries(bare: string, effective: string, ctx?: { lastEntry?: KnowledgeEntry; elliptical: boolean }): Scored[] {
  const out: Scored[] = [];
  const normalized = effective;
  for (const entry of RULES_KNOWLEDGE) {
    let score = 0;
    let matchLength = 0;
    for (const re of entry.patterns) {
      const m = normalized.match(re);
      // A match must begin inside the player's own words; the appended context term may
      // finish a pattern but never supply all of it.
      if (m && (m.index ?? 0) < bare.length) {
        score += 3;
        matchLength += m[0].length;
      }
    }
    const genericMatches: string[] = [];
    for (const re of entry.generic ?? []) {
      const m = bare.match(re);
      if (m) {
        score += 2;
        matchLength += m[0].length;
        genericMatches.push(m[0]);
      }
    }
    const patternHit = score > genericMatches.length * 2;
    let keywordHits = 0;
    for (const kw of entry.keywords) {
      const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      // A word the generic regex already matched earns nothing extra; otherwise one common
      // word ("wall", "call") would reach the candidate threshold on its own.
      if (re.test(effective) && !genericMatches.some((g) => re.test(g))) keywordHits += 1;
    }
    score += keywordHits;
    // Candidacy: a real pattern hit; or a catch-all word plus another keyword; or a catch-all
    // word in a short direct question ("charleston rules?", "how does the wall work"); or three
    // independent keywords. A lone catch-all word in a long sentence or a non-question phrase
    // ("is there a wall between the rooms", "dragon boat") is not enough.
    const wordCount = bare.split(" ").filter(Boolean).length;
    const shortDirect = wordCount === 1 || (wordCount <= 5 && FRAME_RE.test(bare));
    const catchAll = genericMatches.length > 0 && (keywordHits >= 1 || shortDirect);
    if (!patternHit && !catchAll && keywordHits < 3) continue;
    // Context may only amplify an entry the question already reached through a pattern;
    // otherwise a stray keyword plus the topic bonus would answer an unrelated question.
    if (ctx?.elliptical && ctx.lastEntry && (patternHit || genericMatches.length > 0)) {
      if (entry.category === ctx.lastEntry.category) score += 2;
      if (entry.id === ctx.lastEntry.id) score -= 2;
    }
    if (score <= 0) continue;
    out.push({ entry, score, matchLength, patternHit });
  }
  out.sort((a, b) => b.score - a.score || b.matchLength - a.matchLength);
  return out;
}

export type Retrieval = { candidates: Scored[]; elliptical: boolean; effectiveQuery: string };

// Candidacy is decided inside scoreEntries; this floor only drops keyword-only stragglers.
const MIN_SCORE = 2;

export function retrieve(raw: string, history: Turn[] = []): Retrieval {
  const normalized = normalizeQuestion(raw);
  const lastEntry = lastAnsweredEntry(history);
  const wordCount = normalized.split(" ").filter(Boolean).length;
  const elliptical = Boolean(lastEntry) && (ELLIPTICAL_RE.test(normalized) || wordCount <= 5);

  const plain = scoreEntries(normalized, normalized).filter((s) => s.score >= MIN_SCORE);
  if (!elliptical || !lastEntry) return { candidates: plain, elliptical: false, effectiveQuery: normalized };

  const contextTerm = CATEGORY_CONTEXT[lastEntry.category];
  const effectiveQuery = contextTerm ? `${normalized} ${contextTerm}` : normalized;
  const contextual = scoreEntries(normalized, effectiveQuery, { lastEntry, elliptical: true }).filter((s) => s.score >= MIN_SCORE);
  // A strong direct hit on a new topic beats context carry-over ("what about the Charleston?"
  // after a joker question should switch topics, not stay on jokers).
  const plainTop = plain[0];
  const strongSwitch = plainTop && plainTop.score >= 6 && plainTop.entry.id !== lastEntry.id && !ELLIPTICAL_RE.test(normalized);
  if (strongSwitch) return { candidates: plain, elliptical: false, effectiveQuery: normalized };
  if (contextual.length) return { candidates: contextual, elliptical: true, effectiveQuery };
  return { candidates: plain, elliptical: true, effectiveQuery };
}

export function lastAnsweredEntry(history: Turn[]): KnowledgeEntry | undefined {
  for (let i = history.length - 1; i >= 0; i--) {
    const t = history[i];
    if (t.role === "assistant" && t.entry_id) {
      const e = KNOWLEDGE_BY_ID.get(t.entry_id);
      if (e) return e;
    }
  }
  return undefined;
}

export function askedEntryIds(history: Turn[]): Set<string> {
  const ids = new Set<string>();
  for (const t of history) if (t.role === "assistant" && t.entry_id) ids.add(t.entry_id);
  return ids;
}

export function canonicalEntryFor(raw: string): KnowledgeEntry | undefined {
  const key = normalizeQuestion(raw);
  if (!key) return undefined;
  return RULES_KNOWLEDGE.find((e) => normalizeQuestion(e.question) === key);
}

export function buildFollowups(entry: KnowledgeEntry, asked: Set<string>, max = 3): string[] {
  const picked: string[] = [];
  const seen = new Set<string>([entry.id, ...asked]);
  const push = (e: KnowledgeEntry | undefined) => {
    if (!e || seen.has(e.id) || picked.length >= max) return;
    seen.add(e.id);
    picked.push(e.question);
  };
  for (const id of entry.related) push(KNOWLEDGE_BY_ID.get(id));
  if (picked.length < max) {
    for (const e of RULES_KNOWLEDGE) {
      if (picked.length >= max) break;
      if (e.category === entry.category) push(e);
    }
  }
  return picked;
}

export function labelFor(entry: KnowledgeEntry): AskLabel {
  if (entry.source === "derived") return "pending";
  return entry.varies_by_house ? "house" : "standard";
}

// A "Read more" link under a "Pending instructor review" label would be a mixed signal, so
// derived entries never link back; their source_url is kept for the owner's reference.
export function readMoreUrl(entry: KnowledgeEntry): string | undefined {
  return entry.source === "derived" ? undefined : entry.source_url;
}

export function approvedText(entry: KnowledgeEntry): string {
  return entry.house_note ? `${entry.answer} ${entry.house_note}` : entry.answer;
}

export function yearNoteFor(raw: string): string | undefined {
  const year = mentionedYear(raw);
  if (!year || year === CURRENT_CARD_YEAR) return undefined;
  return `General rules rarely change from year to year; the hands printed on the card are what changes. The current card is the ${CURRENT_CARD_YEAR} card.`;
}

export function answerDeterministic(raw: string, history: Turn[] = []): EngineResult {
  const question = String(raw || "").trim().slice(0, MAX_QUESTION_CHARS);
  const normalized = normalizeQuestion(question);
  const base = { candidates: [] as KnowledgeEntry[], followups: [] as string[], elliptical: false };

  if (!normalized) return { ...base, kind: "offtopic", answer: OFF_TOPIC, label: "unverified" };
  if (SMALL_TALK_RE.test(question)) return { ...base, kind: "smalltalk", answer: SMALL_TALK, label: "chat" };

  if (isCardContentQuestion(normalized)) {
    return {
      ...base,
      kind: "card_refusal",
      answer: CARD_REFUSAL,
      label: "card",
      followups: ["When does the new card come out?", "What do the numbers on the card mean?", "Can I play with last year's card?"],
    };
  }

  if (VARIANT_RE.test(normalized) && !AMERICAN_RE.test(normalized)) {
    const variant = VARIANT_NAMES[normalized.match(VARIANT_RE)?.[0] ?? ""] ?? "a different";
    return {
      ...base,
      kind: "clarify",
      label: "clarify",
      answer: `That sounds like it may be about ${variant} style mahjong. I can only verify American Mahjong rules, the National Mah Jongg League style. Did you mean American Mahjong?`,
      followups: ["How many tiles are in an American Mahjong set?", "How does the Charleston work?"],
    };
  }

  const last = lastAnsweredEntry(history);
  if (last && WHY_RE.test(normalized)) {
    return {
      kind: "answer",
      answer: approvedText(last),
      label: labelFor(last),
      entry: last,
      candidates: [last],
      followups: buildFollowups(last, askedEntryIds(history)),
      source_url: readMoreUrl(last),
      elliptical: true,
    };
  }

  const { candidates, elliptical } = retrieve(question, history);
  const entries = candidates.map((c) => c.entry);

  if (!entries.length) {
    if (!isRulesQuestion(normalized)) return { ...base, kind: "offtopic", answer: OFF_TOPIC, label: "unverified" };
    return {
      ...base,
      kind: "unverified",
      answer: CANNOT_VERIFY,
      label: "unverified",
      followups: last ? buildFollowups(last, askedEntryIds(history)) : ["Can I use a joker in a pair?", "How does the Charleston work?", "What makes a hand dead?"],
      elliptical,
    };
  }

  const entry = entries[0];
  return {
    kind: "answer",
    answer: approvedText(entry),
    label: labelFor(entry),
    entry,
    candidates: entries.slice(0, 4),
    followups: buildFollowups(entry, askedEntryIds(history)),
    source_url: readMoreUrl(entry),
    year_note: yearNoteFor(question),
    elliptical,
    catch_all_only: !candidates[0].patternHit,
  };
}

// Synthesis guard (shared with Find My Mahj): a model may only rephrase approved text, so any
// whole number in its output must already exist in the approved input. A new number means
// new rule content, and the caller ships the approved text verbatim instead.
export function synthesisDigitGuard(input: string, output: string): boolean {
  const allowed = new Set(input.match(/\d+/g) ?? []);
  for (const n of output.match(/\d+/g) ?? []) if (!allowed.has(n)) return false;
  return true;
}

// Gap telemetry summary: topic only, never a transcript. Emails then digits are stripped
// before anything is logged, so no contact info can leak into server logs.
export function summarizeGap(question: string): string {
  return String(question || "")
    .replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "")
    .replace(/\d+/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
