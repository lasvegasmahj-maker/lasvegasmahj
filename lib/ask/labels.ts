// Client-safe re-export of the shared labels. Import only this leaf module from client code;
// the rest of lib/ask-core is server-only.
export { LABEL_TEXT, PENDING_NOTE, type AskLabel } from "@/lib/ask-core/engine/labels.ts";
