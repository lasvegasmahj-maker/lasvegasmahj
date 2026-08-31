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
  source: string | null;
  review_pending: boolean;
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
  const provenanceName = (block: string): string | null => block.match(/provenance:\s*(\w+)/)?.[1] ?? null;
  const entries: SisterEntry[] = [];
  for (const m of src.matchAll(/\n {2}\{\n([\s\S]*?)\n {2}\},/g)) {
    const block = m[1];
    const id = field(block, "id");
    if (!id) continue;
    if (!field(block, "approved_answer")) throw new Error(`Could not read approved_answer for ${id}. Find My Mahj's file format changed; update parseSister before trusting the manifest.`);
    entries.push({
      id,
      topic: field(block, "topic"),
      answer: field(block, "approved_answer"),
      house_note: field(block, "house_note"),
      varies_by_house: /varies_by_house:\s*true/.test(block),
      classification: field(block, "classification"),
      provenance: provenanceName(block),
      source: field(block, "source"),
      // Their researched() and ownerQuestion() helpers both set owner_review_required, and
      // OWNER does not. Anything they have not signed off stays out of our approved corpus.
      review_pending: provenanceName(block) !== "OWNER",
    });
  }
  return entries;
}

export function fingerprint(entry: { answer: string | null; house_note?: string | null; varies_by_house: boolean }): string {
  return createHash("sha256").update(JSON.stringify([entry.answer, entry.house_note ?? "", entry.varies_by_house])).digest("hex").slice(0, 16);
}
