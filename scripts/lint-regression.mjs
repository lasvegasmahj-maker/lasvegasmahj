// Fails only when a file changed since the base commit has more ESLint errors than it had at the base.
// Pre-existing errors on main stay visible in the advisory full-lint step; they do not block a PR.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], ...opts }).trim();
const isCommit = (ref) => ref && !/^0+$/.test(ref) && spawnSync("git", ["cat-file", "-e", `${ref}^{commit}`]).status === 0;
const base = sh("git", ["rev-parse", isCommit(process.argv[2]) ? process.argv[2] : "HEAD~1"]);
const changed = sh("git", ["diff", "--name-only", "--diff-filter=ACMR", base, "HEAD", "--", "*.ts", "*.tsx", "*.js", "*.mjs", "*.cjs"])
  .split("\n")
  .filter((f) => f && existsSync(f));

if (changed.length === 0) {
  console.log(`No lintable files changed since ${base.slice(0, 7)}.`);
  process.exit(0);
}

function errorsByFile(cwd, files) {
  const out = new Map();
  if (files.length === 0) return out;
  const r = spawnSync("npx", ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", ...files], { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (!r.stdout) throw new Error(`eslint produced no report in ${cwd}\n${r.stderr}`);
  for (const f of JSON.parse(r.stdout)) out.set(relative(cwd, f.filePath), f.messages.filter((m) => m.severity === 2));
  return out;
}

const head = errorsByFile(process.cwd(), changed);
const baseDir = mkdtempSync(join(tmpdir(), "lint-base-"));
sh("git", ["worktree", "add", "--detach", baseDir, base]);
symlinkSync(join(process.cwd(), "node_modules"), join(baseDir, "node_modules"));
let before;
try {
  before = errorsByFile(baseDir, changed.filter((f) => existsSync(join(baseDir, f))));
} finally {
  spawnSync("git", ["worktree", "remove", "--force", baseDir]);
}

let regressions = 0;
for (const file of changed) {
  const now = head.get(file) ?? [];
  const was = before.get(file)?.length ?? 0;
  if (now.length > was) {
    regressions++;
    console.log(`\n${file}: ${now.length} error(s) now, ${was} at base ${base.slice(0, 7)}`);
    for (const m of now) console.log(`  ${m.line}:${m.column}  ${m.message}  (${m.ruleId})`);
  }
}
if (regressions) {
  console.log(`\nLint regression in ${regressions} file(s). Fix the new errors (pre-existing ones are not counted).`);
  process.exit(1);
}
console.log(`No new lint errors in ${changed.length} changed file(s) compared with ${base.slice(0, 7)}.`);
