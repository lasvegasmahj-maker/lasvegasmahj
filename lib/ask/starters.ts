// Chips shown before the first question. Each must match an entry's canonical question in
// lib/ask/knowledge.ts (a logic test checks), so tapping one is answered instantly from
// approved text with no model call. Kept separate so the client bundle never imports the
// knowledge base itself.
export const STARTER_QUESTIONS: string[] = [
  "Can I use a joker in a pair?",
  "When can I exchange a joker?",
  "Can I call a tile during the Charleston?",
  "What happens when two players call the same tile?",
];
