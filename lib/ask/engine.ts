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
export { LABEL_TEXT, type AskLabel } from "./labels";

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

const SMALL_TALK_RE =
  /^(thanks?|thank you|thx|ty|ok(ay)?|got it|cool|great|perfect|awesome|nice|good|yes|nope?|hi|hello|hey|bye)\b[!. ]*$/i;

const RULES_SIGNAL_RE =
  /\b(mahjong|joker|tile|charleston|kong|pung|quint|sextet|discard|call|pass|hand|dead|wall|card|nmjl|flower|dragon|wind|bam|crak|dot|soap|expose|pay|win|dealer|east|suit|news|courtesy|blind|rack|player|pair|single|concealed|exchange|mahjong)\b/;

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

type Scored = { entry: KnowledgeEntry; score: number; matchLength: number };

function scoreEntries(normalized: string, ctx?: { lastEntry?: KnowledgeEntry; elliptical: boolean }): Scored[] {
  const out: Scored[] = [];
  for (const entry of RULES_KNOWLEDGE) {
    let score = 0;
    let matchLength = 0;
    for (const re of entry.patterns) {
      const m = normalized.match(re);
      if (m) {
        score += 3;
        matchLength += m[0].length;
      }
    }
    for (const re of entry.generic ?? []) {
      const m = normalized.match(re);
      if (m) {
        score += 2;
        matchLength += m[0].length;
      }
    }
    for (const kw of entry.keywords) {
      if (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(normalized)) score += 1;
    }
    if (ctx?.elliptical && ctx.lastEntry) {
      if (entry.category === ctx.lastEntry.category) score += 2;
      if (entry.id === ctx.lastEntry.id) score -= 2;
    }
    if (score <= 0) continue;
    out.push({ entry, score, matchLength });
  }
  out.sort((a, b) => b.score - a.score || b.matchLength - a.matchLength);
  return out;
}

export type Retrieval = { candidates: Scored[]; elliptical: boolean; effectiveQuery: string };

// A pattern hit (3 points) or several keyword hits are needed before an entry counts as a
// candidate; a single stray keyword never does, so "table" alone cannot surface table talk.
const MIN_SCORE = 3;

export function retrieve(raw: string, history: Turn[] = []): Retrieval {
  const normalized = normalizeQuestion(raw);
  const lastEntry = lastAnsweredEntry(history);
  const wordCount = normalized.split(" ").filter(Boolean).length;
  const elliptical = Boolean(lastEntry) && (ELLIPTICAL_RE.test(normalized) || wordCount <= 5);

  const plain = scoreEntries(normalized).filter((s) => s.score >= MIN_SCORE);
  if (!elliptical || !lastEntry) return { candidates: plain, elliptical: false, effectiveQuery: normalized };

  const contextTerm = CATEGORY_CONTEXT[lastEntry.category];
  const effectiveQuery = contextTerm ? `${normalized} ${contextTerm}` : normalized;
  const contextual = scoreEntries(effectiveQuery, { lastEntry, elliptical: true }).filter((s) => s.score >= MIN_SCORE);
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

export function approvedText(entry: KnowledgeEntry): string {
  return entry.house_note ? `${entry.answer} ${entry.house_note}` : entry.answer;
}

export function yearNoteFor(raw: string): string | undefined {
  const year = mentionedYear(raw);
  if (!year || year === CURRENT_CARD_YEAR) return undefined;
  return `General rules do not change from year to year; only the hands printed on the card change. The current card is the ${CURRENT_CARD_YEAR} card.`;
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
    const variant = normalized.match(VARIANT_RE)?.[0] ?? "another";
    return {
      ...base,
      kind: "clarify",
      label: "clarify",
      answer: `That sounds like it may be about ${variant} style mahjong. I can only verify American Mahjong rules, the National Mah Jongg League style. Did you mean American Mahjong?`,
      followups: ["How many tiles are in an American Mahjong set?", "How does the Charleston work?"],
    };
  }

  const { candidates, elliptical } = retrieve(question, history);
  const entries = candidates.map((c) => c.entry);

  if (!entries.length) {
    if (!isRulesQuestion(normalized)) return { ...base, kind: "offtopic", answer: OFF_TOPIC, label: "unverified" };
    const last = lastAnsweredEntry(history);
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
    source_url: entry.source_url,
    year_note: yearNoteFor(question),
    elliptical,
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
