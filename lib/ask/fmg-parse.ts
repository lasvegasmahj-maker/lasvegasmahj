// Reads Find My Mahj's approved rules file. Kept as a module with no side effects so the
// drift test can import it in CI, where the sister repo is not present.

import { createHash } from "node:crypto";

export type SisterEntry = {
  id: string;
  topic: string | null;
  answer: string | null;
  house_note: string | null;
  varies_by_house: boolean;
  classification: string | null;
  provenance: string | null;
};

// Their file defines a few shared string constants and then one object per entry.
export function parseSister(src: string): SisterEntry[] {
  const consts = Object.fromEntries([...src.matchAll(/^const (\w+)\s*=\s*"([^"]*)"/gm)].map((m) => [m[1], m[2]]));
  const field = (block: string, name: string): string | null => {
    const quoted = block.match(new RegExp(`${name}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
    if (quoted) return JSON.parse(`"${quoted[1]}"`) as string;
    const bare = block.match(new RegExp(`${name}:\\s*(\\w+),`));
    return bare ? consts[bare[1]] ?? bare[1] : null;
  };
  const entries: SisterEntry[] = [];
  for (const m of src.matchAll(/\n {2}\{\n([\s\S]*?)\n {2}\},/g)) {
    const block = m[1];
    const id = field(block, "id");
    if (!id) continue;
    entries.push({
      id,
      topic: field(block, "topic"),
      answer: field(block, "approved_answer"),
      house_note: field(block, "house_note"),
      varies_by_house: /varies_by_house:\s*true/.test(block),
      classification: field(block, "classification"),
      provenance: field(block, "provenance"),
    });
  }
  return entries;
}

export function fingerprint(entry: { answer: string | null; house_note?: string | null; varies_by_house: boolean }): string {
  return createHash("sha256").update(JSON.stringify([entry.answer, entry.house_note ?? "", entry.varies_by_house])).digest("hex").slice(0, 16);
}
