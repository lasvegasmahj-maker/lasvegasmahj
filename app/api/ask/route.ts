import { NextRequest, NextResponse } from "next/server";
import {
  MAX_QUESTION_CHARS,
  replyStaysReply,
  askedEntryIds,
  buildFollowups,
  cancelPhrase,
  classifyTopic,
  composeWithModel,
  entryById,
  excludedIds,
  ipOf,
  isSmallTalk,
  lookup,
  makeLimiters,
  modelEligible,
  summarizeForEscalation,
  type ClarifyPayload,
  type LookupResult,
  type Turn,
} from "@/lib/ask-core/index.ts";
import { anthropicClient, isModelEnabled, modelName } from "@/lib/ask/model-client";
import { LOCAL_ANSWER, LOCAL_BUSINESS_RE, LOCAL_SUGGESTIONS, LVM_SITE, RULES_FALLBACK } from "@/lib/ask/site";
import { pickNudge, type Nudge } from "@/lib/ask/nudges";

// Stateless by design: the browser sends the recent thread with every request and nothing is
// stored server side. The shared core (lib/ask-core) decides every rule outcome; this route
// adds the Las Vegas Mahjong overlay: the studio vocabulary, Read more links, nudges, and the
// owner-recorded payment override.

export const maxDuration = 30;

const MAX_HISTORY = 10;
const MAX_TURN_CHARS = 900;

const limits = makeLimiters();
const EXCLUDE = excludedIds(LVM_SITE);

type AskResponse = {
  ok: true;
  answer: string;
  label: string;
  kind: string;
  entry_id?: string;
  secondary_id?: string;
  category?: string;
  classification?: string;
  evidence?: string;
  source_url?: string;
  followups: string[];
  clarify?: ClarifyPayload;
  nudge?: Nudge;
  year_note?: string;
  suggestions?: Array<{ label: string; href: string }>;
  via: "rules" | "model";
};

const NO_STORE = { "Cache-Control": "no-store" };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

function parseHistory(raw: unknown): Turn[] | null {
  if (raw == null) return [];
  if (!Array.isArray(raw) || raw.length > MAX_HISTORY) return null;
  const out: Turn[] = [];
  for (const t of raw) {
    if (!t || typeof t !== "object") return null;
    const o = t as Record<string, unknown>;
    if (o.role !== "user" && o.role !== "assistant") return null;
    if (typeof o.content !== "string") return null;
    const turn: Turn = { role: o.role, content: o.content.slice(0, MAX_TURN_CHARS) };
    if (typeof o.entry_id === "string") {
      const e = entryById(o.entry_id);
      if (e) turn.entry_id = e.id;
    }
    if (typeof o.nudge_key === "string" && /^[a-z-]{1,20}$/.test(o.nudge_key)) turn.nudge_key = o.nudge_key;
    out.push(turn);
  }
  return out;
}

function parseClarify(raw: unknown): { id: string; question: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.question !== "string") return null;
  return { id: o.id.slice(0, 40), question: o.question.slice(0, MAX_QUESTION_CHARS) };
}

function fromLookup(det: LookupResult, via: "rules" | "model"): AskResponse {
  return {
    ok: true,
    answer: det.answer,
    label: det.label,
    kind: det.kind,
    entry_id: det.entry?.id,
    secondary_id: det.secondary?.id,
    category: det.entry?.category,
    classification: det.entry?.classification,
    evidence: det.entry?.provenance.evidence,
    source_url: det.entry ? LVM_SITE.readMoreUrl?.(det.entry) : undefined,
    followups: det.followups,
    clarify: det.clarify,
    year_note: det.year_note,
    via,
  };
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Send a POST with { question }." }, { status: 405, headers: { ...NO_STORE, Allow: "POST" } });
}

export async function POST(req: NextRequest) {
  if (process.env.ASK_DISABLED === "1") {
    return json({ ok: false, error: "The rules helper is switched off for the moment. The rules guide still works.", fallback: RULES_FALLBACK }, 503);
  }
  const started = Date.now();
  const ip = ipOf(req.headers);
  if (!limits.perMinute.check(ip) || !limits.perDay.check(ip)) {
    return NextResponse.json(
      { ok: false, error: "That is a lot of questions at once. Give it a minute and ask again, or browse the rules guide.", fallback: RULES_FALLBACK },
      { status: 429, headers: { ...NO_STORE, "Retry-After": "60" } },
    );
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const history = parseHistory(body?.history);
  const clarify = parseClarify(body?.clarify);
  const nudgedBefore = body?.nudged === true;
  if (!question || question.length > MAX_QUESTION_CHARS || !history) {
    return json({ ok: false, error: `Ask one question at a time, up to ${MAX_QUESTION_CHARS} characters.` }, 400);
  }

  try {
    const opts = { exclude: EXCLUDE };
    let live = clarify;
    if (live && question) {
      const keep = replyStaysReply(live, question, (q) => LOCAL_BUSINESS_RE.test(q), EXCLUDE);
      if (!keep && classifyTopic(question, { discoverySignal: LVM_SITE.discoverySignal }) === "other") live = null;
    }
    const topic = live ? "rules" : classifyTopic(question, { discoverySignal: LVM_SITE.discoverySignal });
    let response: AskResponse;
    let det: LookupResult | null = null;

    if (topic === "other" && !isSmallTalk(question) && !cancelPhrase(question).cancelled) {
      // Lessons, open play, the studio: never a rule, always a pointer into the site.
      response = { ok: true, answer: LOCAL_ANSWER, label: "chat", kind: "offtopic", followups: [], suggestions: LOCAL_SUGGESTIONS, via: "rules" };
    } else {
      det = lookup({ question, history, clarify: live }, opts);
      response = fromLookup(det, "rules");

      const consultModel = isModelEnabled() && modelEligible(det, question) && limits.modelPerMinute.check("global") && limits.modelPerDay.check("global");
      if (consultModel) {
        const options = det.entry ? buildFollowups(det.entry, askedEntryIds(history), 6, opts) : det.followups;
        const m = await composeWithModel(
          { question, history, candidates: det.candidates, followupOptions: options, preferred: det.entry?.id, exclude: EXCLUDE },
          { client: anthropicClient, site: { helperName: LVM_SITE.helperName, siteHost: LVM_SITE.siteHost }, model: modelName(), log: (e) => console.info(JSON.stringify(e)) },
        );
        if (m?.kind === "answer") {
          response = {
            ...response,
            answer: m.answer,
            label: m.label,
            kind: "answer",
            entry_id: m.entry.id,
            secondary_id: m.secondary?.id,
            category: m.entry.category,
            classification: m.entry.classification,
            evidence: m.entry.provenance.evidence,
            source_url: LVM_SITE.readMoreUrl?.(m.entry),
            followups: m.followups.length ? m.followups : buildFollowups(m.entry, askedEntryIds(history), 3, opts),
            clarify: undefined,
            via: "model",
          };
        } else if (m?.kind === "clarify") {
          response = { ...response, answer: m.answer, label: "clarify", kind: "clarify", entry_id: undefined, category: undefined, classification: undefined, evidence: undefined, source_url: undefined, followups: m.followups, clarify: undefined, via: "model" };
        }
      }

      if (topic === "mixed") response.suggestions = LOCAL_SUGGESTIONS.slice(0, 2);
      if (det.escalation) console.info(JSON.stringify({ event: "ask_escalation", reason: det.escalation.reason, summary: det.escalation.summary }));
    }

    if (response.kind === "answer" && response.entry_id) {
      const entry = entryById(response.entry_id);
      if (entry) {
        const nudge = nudgedBefore ? null : pickNudge(history, entry, (id) => entryById(id));
        if (nudge) response.nudge = nudge;
      }
    }

    console.info(
      JSON.stringify({
        event: "ask",
        topic,
        kind: response.kind,
        entry: response.entry_id ?? null,
        category: response.category ?? null,
        label: response.label,
        clarify: response.clarify?.id ?? null,
        via: response.via,
        turn: Math.floor(history.length / 2) + 1,
        ms: Date.now() - started,
        gap: response.kind === "gap" ? (det?.escalation?.summary ?? summarizeForEscalation(live?.question ?? question)) : undefined,
      }),
    );

    return json(response);
  } catch (e) {
    console.error("ask failed:", e instanceof Error ? e.message : e);
    return json({ ok: false, error: "The rules helper is having trouble right now. The rules guide still works.", fallback: RULES_FALLBACK }, 500);
  }
}
