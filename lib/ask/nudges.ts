import type { KnowledgeEntry } from "./knowledge";
import type { Turn } from "./engine";

// Occasional, context-aware next steps into Las Vegas Mahjong. At most one per
// conversation, never on the first answer, never attached to an unverified answer.

export type Nudge = { key: "lessons" | "advanced" | "open-play"; text: string; cta: string; href: string };

const NUDGES: Record<Nudge["key"], Nudge> = {
  lessons: {
    key: "lessons",
    text: "Want to learn this step by step at a real table? MAHJ101 starts from scratch.",
    cta: "See lessons",
    href: "/mahjong-lessons-las-vegas",
  },
  advanced: {
    key: "advanced",
    text: "These are the questions we work through in MAHJ103, Confident Play.",
    cta: "See MAHJ103",
    href: "/mahjong-lessons-las-vegas",
  },
  "open-play": {
    key: "open-play",
    text: "Know the rules and want more table time? Join us for open play.",
    cta: "See open play",
    href: "/mahjong-open-play-las-vegas",
  },
};

export function pickNudge(history: Turn[], current: KnowledgeEntry, lookup: (id: string) => KnowledgeEntry | undefined): Nudge | null {
  if (history.some((t) => t.role === "assistant" && t.nudge_key)) return null;
  const answered = history.filter((t) => t.role === "assistant" && t.entry_id).map((t) => lookup(t.entry_id!)).filter(Boolean) as KnowledgeEntry[];
  const all = [...answered, current];
  if (all.length < 3) return null;
  const foundational = all.filter((e) => e.level === "foundational").length;
  const advanced = all.filter((e) => e.level === "advanced").length;
  if (foundational >= 3) return NUDGES.lessons;
  if (advanced >= 3) return NUDGES.advanced;
  if (all.length >= 5) return NUDGES["open-play"];
  return null;
}
