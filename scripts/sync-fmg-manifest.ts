// Regenerates lib/ask/fmg-manifest.json from the Find My Mahj repository.
//
// The two sites share approved rule text by copy, never at runtime. This manifest is the
// checked-in record of what Find My Mahj had approved when we last looked, what we did with
// each entry, and a fingerprint of the exact wording. CI compares Las Vegas Mahjong against
// the manifest (no sister repo needed); this script is how a developer refreshes it after
// Find My Mahj approves or changes a rule.
//
//   npx tsx scripts/sync-fmg-manifest.ts                  # read ../findmymahjgame
//   npx tsx scripts/sync-fmg-manifest.ts --path ../elsewhere
//
// New Find My Mahj entries are written with disposition "unreviewed" and the drift test fails
// until a human gives each one a real disposition (copied, mapped, excluded, owner-review).

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fingerprint, parseSister } from "../lib/ask/fmg-parse";

const MANIFEST = "lib/ask/fmg-manifest.json";
const argPath = process.argv.indexOf("--path");
const repo = resolve(argPath > -1 ? process.argv[argPath + 1] : "../findmymahjgame");

type ManifestEntry = { id: string; topic: string | null; classification: string | null; provenance: string | null; fmg_source: string | null; fmg_review_pending: boolean; varies_by_house: boolean; fingerprint: string; disposition: string; note?: string };

function readSisterKnowledge(): string {
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

const previous: { entries: ManifestEntry[] } = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : { entries: [] };
const kept = new Map(previous.entries.map((e) => [e.id, e]));
const sister = parseSister(readSisterKnowledge());

const entries: ManifestEntry[] = sister
  .map((e) => {
    const before = kept.get(e.id);
    return {
      id: e.id,
      topic: e.topic,
      classification: e.classification,
      provenance: e.provenance,
      fmg_source: e.source,
      fmg_review_pending: e.review_pending,
      varies_by_house: e.varies_by_house,
      fingerprint: fingerprint(e),
      disposition: before?.disposition ?? "unreviewed",
      ...(before?.note ? { note: before.note } : {}),
    };
  })
  .sort((a, b) => a.id.localeCompare(b.id));

const gone = previous.entries.filter((e) => !sister.some((s) => s.id === e.id)).map((e) => e.id);
const changed = entries.filter((e) => kept.get(e.id) && kept.get(e.id)!.fingerprint !== e.fingerprint).map((e) => e.id);
const added = entries.filter((e) => !kept.has(e.id)).map((e) => e.id);

writeFileSync(MANIFEST, JSON.stringify({ source: "find my mahj lib/rules/knowledge.ts", generated_from: repo.replace(process.env.HOME ?? "", "~"), entries }, null, 2) + "\n");

console.log(`Wrote ${MANIFEST}: ${entries.length} Find My Mahj entries.`);
if (added.length) console.log(`  new (marked unreviewed): ${added.join(", ")}`);
if (changed.length) console.log(`  wording changed: ${changed.join(", ")}`);
if (gone.length) console.log(`  no longer in Find My Mahj: ${gone.join(", ")}`);
if (!added.length && !changed.length && !gone.length) console.log("  no changes.");
