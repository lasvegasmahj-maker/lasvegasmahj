import { NextRequest, NextResponse } from "next/server";
import {
  CANNOT_VERIFY,
  answerDeterministic,
  buildFollowups,
  askedEntryIds,
  canonicalEntryFor,
  isRulesQuestion,
  normalizeQuestion,
  readMoreUrl,
  summarizeGap,
  MAX_QUESTION_CHARS,
  type Turn,
} from "@/lib/ask/engine";
import { KNOWLEDGE_BY_ID } from "@/lib/ask/knowledge";
import { composeWithModel, isModelEnabled } from "@/lib/ask/llm";
import { pickNudge, type Nudge } from "@/lib/ask/nudges";
import { ipOf, modelPerDay, modelPerMinute, perDay, perMinute } from "@/lib/ask/rate-limit";

// Stateless by design: the browser sends the recent thread with every request and nothing
// is stored server side.

export const maxDuration = 30;

const MAX_HISTORY = 10;
const MAX_TURN_CHARS = 900;

type AskResponse = {
  ok: true;
  answer: string;
  label: string;
  kind: string;
  entry_id?: string;
  category?: string;
  source_url?: string;
  followups: string[];
  nudge?: Nudge;
  year_note?: string;
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
    if (typeof o.entry_id === "string" && KNOWLEDGE_BY_ID.has(o.entry_id)) turn.entry_id = o.entry_id;
    if (typeof o.nudge_key === "string" && /^[a-z-]{1,20}$/.test(o.nudge_key)) turn.nudge_key = o.nudge_key;
    out.push(turn);
  }
  return out;
}

export async function GET() {
  return NextResponse.json({ ok: false, error: "Send a POST with { question }." }, { status: 405, headers: { ...NO_STORE, Allow: "POST" } });
}

export async function POST(req: NextRequest) {
  if (process.env.ASK_DISABLED === "1") {
    return json({ ok: false, error: "The rules helper is switched off for the moment. The rules guide still works.", fallback: "/rules" }, 503);
  }
  const started = Date.now();
  const ip = ipOf(req.headers);
  if (!perMinute.check(ip) || !perDay.check(ip)) {
    return NextResponse.json(
      { ok: false, error: "That is a lot of questions at once. Give it a minute and ask again, or browse the rules guide.", fallback: "/rules" },
      { status: 429, headers: { ...NO_STORE, "Retry-After": "60" } }
    );
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const history = parseHistory(body?.history);
  const nudgedBefore = body?.nudged === true;
  if (!question || question.length > MAX_QUESTION_CHARS || !history) {
    return json({ ok: false, error: `Ask one question at a time, up to ${MAX_QUESTION_CHARS} characters.` }, 400);
  }

  try {
    const det = answerDeterministic(question, history);
    let response: AskResponse = {
      ok: true,
      answer: det.answer,
      label: det.label,
      kind: det.kind,
      entry_id: det.entry?.id,
      category: det.entry?.category,
      source_url: det.source_url,
      followups: det.followups,
      year_note: det.year_note,
      via: "rules",
    };

    const exactChip = Boolean(canonicalEntryFor(question));
    const modelEligible =
      isModelEnabled() &&
      !exactChip &&
      (det.kind === "answer" || (det.kind === "unverified" && isRulesQuestion(normalizeQuestion(question)))) &&
      modelPerMinute.check("global") &&
      modelPerDay.check("global");

    if (modelEligible) {
      const options = det.entry ? buildFollowups(det.entry, askedEntryIds(history), 6) : det.followups;
      const m = await composeWithModel({ question, history, candidates: det.candidates, followupOptions: options });
      if (m?.kind === "answer") {
        response = {
          ...response,
          answer: m.answer,
          label: m.label,
          kind: "answer",
          entry_id: m.entry.id,
          category: m.entry.category,
          source_url: readMoreUrl(m.entry),
          followups: m.followups.length ? m.followups : buildFollowups(m.entry, askedEntryIds(history)),
          via: "model",
        };
      } else if (m?.kind === "clarify") {
        response = { ...response, answer: m.answer, label: "clarify", kind: "clarify", entry_id: undefined, category: undefined, source_url: undefined, followups: m.followups, via: "model" };
      } else if (m?.kind === "unverified" && det.catch_all_only) {
        response = { ...response, answer: CANNOT_VERIFY, label: "unverified", kind: "unverified", entry_id: undefined, category: undefined, source_url: undefined, followups: det.followups, via: "model" };
      }
    }

    if (response.kind === "answer" && response.entry_id) {
      const entry = KNOWLEDGE_BY_ID.get(response.entry_id);
      if (entry) {
        const nudge = nudgedBefore ? null : pickNudge(history, entry, (id) => KNOWLEDGE_BY_ID.get(id));
        if (nudge) response.nudge = nudge;
      }
    }

    console.info(
      JSON.stringify({
        event: "ask",
        kind: response.kind,
        entry: response.entry_id ?? null,
        category: response.category ?? null,
        label: response.label,
        via: response.via,
        turn: Math.floor(history.length / 2) + 1,
        ms: Date.now() - started,
        gap: response.kind === "unverified" ? summarizeGap(question) : undefined,
      })
    );

    return json(response);
  } catch (e) {
    console.error("ask failed:", e instanceof Error ? e.message : e);
    return json({ ok: false, error: "The rules helper is having trouble right now. The rules guide still works.", fallback: "/rules" }, 500);
  }
}
