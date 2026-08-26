// Confidence labels shown on answers. Shared by the server engine and the client.
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
