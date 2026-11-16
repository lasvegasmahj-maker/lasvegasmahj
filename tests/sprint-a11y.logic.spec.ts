import { test, expect } from "@playwright/test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// The nav's skip link jumps to #main-content. That id must be in each page as served, or the
// link does nothing before the script runs, so every <main> carries it. Ask a Rule's page is
// left untouched; the nav names its <main> once mounted.
const ID = 'id="main-content"';
const EXEMPT = new Set(["app/ask/page.tsx"]);

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return tsxFiles(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}

test("every page's <main> carries the skip link's target id", () => {
  const mains = [...tsxFiles("app"), ...tsxFiles("components")].flatMap((file) =>
    [...readFileSync(file, "utf8").matchAll(/^\s*<main[\s>][^>]*>/gm)].map((m) => ({ file, tag: m[0].trim() })),
  );
  expect(mains.length).toBeGreaterThan(30);
  const missing = mains.filter((m) => !EXEMPT.has(m.file) && !m.tag.includes(ID));
  expect(missing, "pages whose <main> has no skip-link target").toEqual([]);
});
