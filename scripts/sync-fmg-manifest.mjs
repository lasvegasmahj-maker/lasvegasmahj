// Regenerates lib/ask/fmg-manifest.json from the Find My Mahj repository.
//
// The two sites share approved rule text by copy, never at runtime. This manifest is the
// checked-in record of what Find My Mahj had approved when we last looked, what we did with
// each entry, and a fingerprint of the exact wording. CI compares Las Vegas Mahjong against
// the manifest (no sister repo needed); this script is how a developer refreshes it after
// Find My Mahj approves or changes a rule.
//
//   node scripts/sync-fmg-manifest.mjs            # read ../findmymahjgame, keep dispositions
//   node scripts/sync-fmg-manifest.mjs --path ../elsewhere
//
// New Find My Mahj entries are written with disposition "unreviewed" and the drift test fails
// until a human gives each one a real disposition (copied, mapped, excluded, owner-review).

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MANIFEST = "lib/ask/fmg-manifest.json";
const argPath = process.argv.indexOf("--path");
const repo = resolve(argPath > -1 ? process.argv[argPath + 1] : "../findmymahjgame");

function readSisterKnowledge() {
  if (!existsSync(repo)) throw new Error(`Find My Mahj repo not found at ${repo}. Clone it beside this one or pass --path.`);
  for (const ref of ["origin/main", "main", "HEAD"]) {
    try {
      return execFileSync("git", ["show", `${ref}:lib/rules/knowledge.ts`], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      // try the next ref
    }
  }
  return readFileSync(resolve(repo, "lib/rules/knowledge.ts"), "utf8");
}

// Their file defines a few shared string constants and then one object per entry.
export function parseSister(src) {
  const consts = Object.fromEntries([...src.matchAll(/^const (\w+)\s*=\s*"([^"]*)"/gm)].map((m) => [m[1], m[2]]));
  const field = (block, name) => {
    const quoted = block.match(new RegExp(`${name}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`));
    if (quoted) return JSON.parse(`"${quoted[1]}"`);
    const bare = block.match(new RegExp(`${name}:\\s*(\\w+),`));
    return bare ? consts[bare[1]] ?? bare[1] : null;
  };
  const entries = [];
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

export function fingerprint(entry) {
  return createHash("sha256").update(JSON.stringify([entry.answer, entry.house_note ?? "", entry.varies_by_house])).digest("hex").slice(0, 16);
}

const previous = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { entries: [] };
const kept = new Map(previous.entries.map((e) => [e.id, e]));
const sister = parseSister(readSisterKnowledge());

const entries = sister
  .map((e) => {
    const before = kept.get(e.id);
    return {
      id: e.id,
      topic: e.topic,
      classification: e.classification,
      provenance: e.provenance,
      varies_by_house: e.varies_by_house,
      fingerprint: fingerprint(e),
      disposition: before?.disposition ?? "unreviewed",
      ...(before?.note ? { note: before.note } : {}),
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

const gone = previous.entries.filter((e) => !sister.some((s) => s.id === e.id)).map((e) => e.id);
const changed = entries.filter((e) => kept.get(e.id) && kept.get(e.id).fingerprint !== e.fingerprint).map((e) => e.id);
const added = entries.filter((e) => !kept.has(e.id)).map((e) => e.id);

writeFileSync(MANIFEST, JSON.stringify({ source: "find my mahj lib/rules/knowledge.ts", generated_from: repo.replace(process.env.HOME ?? "", "~"), entries }, null, 2) + "\n");

console.log(`Wrote ${MANIFEST}: ${entries.length} Find My Mahj entries.`);
if (added.length) console.log(`  new (marked unreviewed): ${added.join(", ")}`);
if (changed.length) console.log(`  wording changed: ${changed.join(", ")}`);
if (gone.length) console.log(`  no longer in Find My Mahj: ${gone.join(", ")}`);
if (!added.length && !changed.length && !gone.length) console.log("  no changes.");
