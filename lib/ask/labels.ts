// Lives outside engine.ts so the client bundle never pulls in the knowledge base.
export type AskLabel = "standard" | "house" | "card" | "pending" | "unverified" | "clarify" | "chat";

export const LABEL_TEXT: Record<AskLabel, string> = {
  standard: "Standard rule",
  house: "Can vary by house rule",
  card: "Depends on the annual card",
  pending: "Pending instructor review",
  unverified: "Not verified",
  clarify: "Quick check",
  chat: "",
};
