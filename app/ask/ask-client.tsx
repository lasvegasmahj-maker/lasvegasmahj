"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { LABEL_TEXT, type AskLabel } from "@/lib/ask/labels";
import { STARTER_QUESTIONS } from "@/lib/ask/starters";

type Nudge = { key: string; text: string; cta: string; href: string };

type AnswerTurn = {
  role: "assistant";
  content: string;
  label: AskLabel;
  kind: string;
  entry_id?: string;
  category?: string;
  source_url?: string;
  followups: string[];
  nudge?: Nudge;
  year_note?: string;
  via?: string;
  failed?: boolean;
};

type UserTurn = { role: "user"; content: string };
type ThreadTurn = UserTurn | AnswerTurn;

type AskApiResponse = {
  ok?: boolean;
  error?: string;
  answer?: string;
  label?: string;
  kind?: string;
  entry_id?: string;
  category?: string;
  source_url?: string;
  followups?: string[];
  nudge?: Nudge;
  year_note?: string;
  via?: string;
};

const STORAGE_KEY = "lvm-ask-thread";
const MAX_CHARS = 300;

const FAILED_MESSAGE =
  "The rules helper is taking a break. The written rules guide still works, and you can try again in a moment.";

function isTurn(x: unknown): x is ThreadTurn {
  if (!x || typeof x !== "object") return false;
  const t = x as Record<string, unknown>;
  if (typeof t.content !== "string") return false;
  if (t.role === "user") return true;
  return t.role === "assistant" && Array.isArray(t.followups) && typeof t.label === "string";
}

function loadThread(): ThreadTurn[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isTurn).slice(-20) : [];
  } catch {
    return [];
  }
}

function saveThread(thread: ThreadTurn[]) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(thread.slice(-20)));
  } catch {
    // Private mode or storage disabled: the thread simply lives in memory.
  }
}

function sourceLabel(url: string): string {
  const slug = url.split("/").pop() || "";
  const names: Record<string, string> = {
    jokers: "Jokers",
    charleston: "The Charleston",
    "calling-tiles": "Calling Tiles",
    "dead-hands": "Dead Hands",
    "the-card": "The Card",
    winning: "Winning",
    scoring: "Scoring",
    etiquette: "Etiquette",
  };
  return names[slug] ?? "Rules";
}

const noop = () => () => {};

// The thread lives in sessionStorage, which the server cannot read. The server renders a
// static shell; the live thread mounts only after hydration, so its lazy initial state can
// read storage with no hydration mismatch and no setState inside an effect.
export default function AskClient() {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  if (!hydrated) return <AskShell />;
  return <AskThread />;
}

function AskShell() {
  return (
    <section className="ask-shell" aria-label="Ask a Mahjong Rule">
      <div className="container ask-container">
        <form className="ask-composer" noValidate>
          <label htmlFor="ask-input" className="sr-only">Your American Mahjong rules question</label>
          <input id="ask-input" type="text" className="ask-input" placeholder="Ask your question..." autoComplete="off" enterKeyHint="send" maxLength={MAX_CHARS} readOnly />
          <button type="submit" className="btn-primary ask-submit" disabled>Ask</button>
        </form>
        <p className="ask-hint">Based on National Mah Jongg League rules. Follow-ups understand context.</p>
        <div className="ask-starters">
          <p className="ask-starters-label">Try one of these</p>
          <div className="ask-followups">
            {STARTER_QUESTIONS.map((q) => (
              <button key={q} type="button" className="ask-chip">{q}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AskThread() {
  const [thread, setThread] = useState<ThreadTurn[]>(loadThread);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastAnswerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveThread(thread);
  }, [thread]);

  async function ask(raw: string, origin: "typed" | "starter" | "followup") {
    const q = raw.trim().slice(0, MAX_CHARS);
    if (!q || busy) return;
    const history = thread.slice(-10).map((t) =>
      t.role === "user"
        ? { role: "user" as const, content: t.content }
        : { role: "assistant" as const, content: t.content, entry_id: t.entry_id, nudge_key: t.nudge?.key }
    );
    const turnNumber = thread.filter((t) => t.role === "user").length + 1;
    setThread((prev) => [...prev, { role: "user", content: q }]);
    setQuestion("");
    setBusy(true);
    if (window.matchMedia?.("(pointer: coarse)").matches) inputRef.current?.blur();

    let answer: AnswerTurn;
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = (await res.json().catch(() => null)) as AskApiResponse | null;
      if (res.ok && data?.ok) {
        answer = {
          role: "assistant",
          content: data.answer ?? "",
          label: (data.label as AskLabel) ?? "unverified",
          kind: data.kind ?? "answer",
          entry_id: data.entry_id,
          category: data.category,
          source_url: data.source_url,
          followups: Array.isArray(data.followups) ? data.followups.slice(0, 3) : [],
          nudge: data.nudge,
          year_note: data.year_note,
          via: data.via,
        };
      } else {
        answer = {
          role: "assistant",
          content: res.status === 429 && data?.error ? data.error : FAILED_MESSAGE,
          label: "unverified",
          kind: "error",
          followups: [],
          failed: true,
        };
      }
    } catch {
      answer = { role: "assistant", content: FAILED_MESSAGE, label: "unverified", kind: "error", followups: [], failed: true };
    }

    setThread((prev) => [...prev, answer]);
    setBusy(false);
    trackEvent("ask_question", {
      origin,
      turn: turnNumber,
      kind: answer.kind,
      label: answer.label,
      category: answer.category ?? "none",
      matched: Boolean(answer.entry_id),
      via: answer.via ?? "none",
    });
    if (!answer.entry_id && !answer.failed) trackEvent("ask_unverified", { kind: answer.kind, turn: turnNumber });
    if (answer.nudge) trackEvent("ask_nudge_shown", { target: answer.nudge.key });
  }

  const restoredRef = useRef(true);
  useEffect(() => {
    if (restoredRef.current) {
      restoredRef.current = false;
      return;
    }
    if (!thread.length) return;
    const last = thread[thread.length - 1];
    if (last.role === "assistant") lastAnswerRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    else endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [thread]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void ask(question, "typed");
  }

  function reset() {
    setThread([]);
    setQuestion("");
    trackEvent("ask_reset");
    inputRef.current?.focus();
  }

  const lastAnswerIndex = thread.map((t) => t.role).lastIndexOf("assistant");

  return (
    <section className="ask-shell" aria-label="Ask a Mahjong Rule">
      <div className="container ask-container">
        <div className="ask-thread" aria-live="polite" aria-busy={busy}>
          {thread.map((t, i) =>
            t.role === "user" ? (
              <div key={i} className="ask-turn ask-turn-user">
                <span className="ask-turn-who">You</span>
                <p>{t.content}</p>
              </div>
            ) : (
              <div key={i} className={`ask-turn ask-turn-answer${t.failed ? " ask-turn-failed" : ""}`} ref={i === lastAnswerIndex ? lastAnswerRef : undefined}>
                <div className="ask-answer-head">
                  <span className="ask-turn-who">Las Vegas Mahjong</span>
                  {t.label !== "chat" && LABEL_TEXT[t.label] ? (
                    <span className={`ask-label ask-label-${t.label}`}>{LABEL_TEXT[t.label]}</span>
                  ) : null}
                </div>
                <p className="ask-answer-text">{t.content}</p>
                {t.year_note ? <p className="ask-note">{t.year_note}</p> : null}
                {t.failed ? (
                  <p className="ask-note">
                    <a href="/rules" onClick={() => trackEvent("ask_link_click", { target: "rules", reason: "failed" })}>Open the rules guide</a>
                  </p>
                ) : null}
                {t.source_url ? (
                  <p className="ask-note">
                    Read more:{" "}
                    <a href={t.source_url.replace("https://www.lasvegasmahj.com", "")} onClick={() => trackEvent("ask_link_click", { target: "rules", topic: sourceLabel(t.source_url!) })}>
                      {sourceLabel(t.source_url)} rules page
                    </a>
                  </p>
                ) : null}
                {t.kind === "unverified" ? (
                  <p className="ask-note">
                    Browse the <a href="/rules" onClick={() => trackEvent("ask_link_click", { target: "rules", reason: "unverified" })}>written rules guide</a> for related topics.
                  </p>
                ) : null}
                {i === lastAnswerIndex && t.followups.length > 0 ? (
                  <div className="ask-followups" aria-label="Suggested follow-up questions">
                    {t.followups.map((f) => (
                      <button key={f} type="button" className="ask-chip" disabled={busy} onClick={() => { trackEvent("ask_followup_click", { category: t.category ?? "none" }); void ask(f, "followup"); }}>
                        {f}
                      </button>
                    ))}
                  </div>
                ) : null}
                {t.nudge ? (
                  <div className="ask-nudge">
                    <p>{t.nudge.text}</p>
                    <a href={t.nudge.href} className="btn-outline ask-nudge-cta" onClick={() => trackEvent("ask_nudge_click", { target: t.nudge!.key })}>
                      {t.nudge.cta}
                    </a>
                  </div>
                ) : null}
              </div>
            )
          )}
          {busy ? (
            <div className="ask-turn ask-turn-answer ask-thinking">
              <span className="ask-turn-who">Las Vegas Mahjong</span>
              <p>Checking the rules...</p>
            </div>
          ) : null}
          <div ref={endRef} />
        </div>

        <form className="ask-composer" onSubmit={onSubmit} noValidate>
          <label htmlFor="ask-input" className="sr-only">Your American Mahjong rules question</label>
          <input
            id="ask-input"
            ref={inputRef}
            type="text"
            className="ask-input"
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, MAX_CHARS))}
            placeholder={thread.length ? "Ask a follow-up or a new question" : "Ask your question..."}
            autoComplete="off"
            autoCapitalize="sentences"
            enterKeyHint="send"
            maxLength={MAX_CHARS}
            disabled={busy}
            aria-describedby="ask-hint"
          />
          <button type="submit" className="btn-primary ask-submit" disabled={busy || !question.trim()}>
            Ask
          </button>
        </form>
        <p id="ask-hint" className="ask-hint">
          {thread.length ? (
            <>
              Follow-ups understand context.{" "}
              <button type="button" className="ask-reset" onClick={reset}>Start a new question</button>
            </>
          ) : (
            "Based on National Mah Jongg League rules. Follow-ups understand context."
          )}
        </p>

        {thread.length === 0 ? (
          <div className="ask-starters">
            <p className="ask-starters-label">Try one of these</p>
            <div className="ask-followups">
              {STARTER_QUESTIONS.map((q) => (
                <button key={q} type="button" className="ask-chip" onClick={() => { trackEvent("ask_starter_click"); void ask(q, "starter"); }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
