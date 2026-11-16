export const meta = {
  name: 'pre-push-gate',
  description: 'Typecheck + Technical and Brand review of the current diff before pushing lasvegasmahj to main',
  phases: [
    { title: 'Typecheck', detail: 'npx tsc --noEmit must be clean' },
    { title: 'Review', detail: 'Technical and Brand reviewers run in parallel on the diff' },
  ],
}

// The gate reviews the checkout it is run for, never a fixed folder. This used to name the main
// checkout, so a branch built in a worktree was typechecked and reviewed against other code.
// Pass { repo: "/absolute/path" } to name the checkout; without it the session's own checkout is used.
let REPO = args && typeof args === 'object' && typeof args.repo === 'string' ? args.repo : ''

const REVIEW_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['blocker', 'warning', 'nit'] },
          file: { type: 'string' },
          issue: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'file', 'issue', 'fix'],
      },
    },
    summary: { type: 'string' },
  },
  required: ['findings', 'summary'],
}

phase('Typecheck')

if (!REPO) {
  const located = await agent(
    'Run `git rev-parse --show-toplevel` in your current working directory and return the absolute path it prints as path. Do not change directory first and do not guess. Also return the "name" field of the package.json in that folder as packageName (an empty string if there is none). Run nothing else.',
    {
      label: 'locate-checkout',
      schema: {
        type: 'object',
        properties: { path: { type: 'string' }, packageName: { type: 'string' } },
        required: ['path', 'packageName'],
      },
    }
  )
  // A session opened outside the site (the home folder is its own git repository) must stop
  // here with a clear message, not fail later inside the typecheck.
  if (!located || located.packageName !== 'lasvegasmahj-next') {
    throw new Error(`The gate was run from ${located ? located.path : 'an unknown folder'}, which is not a lasvegasmahj checkout. Open the session in the checkout, or pass { repo: "/absolute/path" }.`)
  }
  REPO = located.path
}
log(`Gate checkout: ${REPO}`)

const typecheck = await agent(
  `In ${REPO}, run \`npx tsc --noEmit\` and report the exact result. ` +
  `Return clean=true only if there are zero type errors. Put the raw error output (if any) in errors.`,
  {
    label: 'typecheck',
    schema: {
      type: 'object',
      properties: { clean: { type: 'boolean' }, errors: { type: 'string' } },
      required: ['clean', 'errors'],
    },
  }
)

phase('Review')

const diffInstr =
  `You are reviewing uncommitted and unpushed changes in ${REPO}. ` +
  // The whole branch change: the local main ref can be stale or ahead of the branch's base, and
  // plain git diff never shows untracked files, which are new in full.
  `First find the base with \`git merge-base HEAD origin/main\` (use \`main\` if there is no origin/main). Run \`git diff <base>\` (the working tree against the base, so committed, staged and unstaged changes are all included) and \`git status\`, then read every untracked file listed by \`git ls-files --others --exclude-standard\`: each one is new in full and is part of the change. ` +
  `Review ONLY the changed lines and their direct blast radius, not the whole repo.`

const [technical, brand] = await parallel([
  () =>
    agent(
      `${diffInstr}\n\n` +
      `You are the TECHNICAL reviewer. Check for:\n` +
      `- Type errors, regressions, runtime risk (null derefs, unhandled promise, bad await).\n` +
      `- This is Next.js 16: confirm changed code follows current App Router conventions (read node_modules/next/dist/docs if unsure), no deprecated APIs.\n` +
      `- Contact/inquiry/booking forms: input validation present, basic spam protection (honeypot or rate limit) where a form writes to Supabase.\n` +
      `- Supabase: any new query respects the RLS model in security.md (public read, admin write, inquiries insert-only for anon).\n` +
      `- Secrets: no service-role key or other secret imported into a "use client" file or a NEXT_PUBLIC_ var.\n` +
      `- Hard rules from CLAUDE.md: no code comments unless why is non-obvious, no dead imports.\n` +
      `Mark anything that could break prod or leak data as severity "blocker". Return structured findings.`,
      { label: 'technical', phase: 'Review', schema: REVIEW_SCHEMA }
    ),
  () =>
    agent(
      `${diffInstr}\n\n` +
      `You are the BRAND and CONTENT reviewer. Check for:\n` +
      `- No em dashes or en dashes anywhere in changed copy (use commas, periods, parentheses). This is a blocker.\n` +
      `- Active voice, plain language, no emojis unless the change is explicitly about emojis.\n` +
      `- Design system: dark navy theme (--navy #1a1b6e, --navy-dark #11124a, --pink #e91e8c for headings and heading accents, --pink-button #dd1d85 for button backgrounds only (owner, 2026-11-15), --pink-light #ff4da6 for small pink text such as section labels, review names and the Explore Lessons cue (raised for contrast in the 2026-11-13 sprint and shown in the gallery screenshots the owner approved on 2026-11-15), --green #39e639, --gold #ffd700), Bebas Neue logo, Montserrat headings, DM Sans body. Subpages use SubpageNav + Footer and main has paddingTop 80px.\n` +
      `- Mobile: any new layout works at narrow width.\n` +
      `- Mahjong fact accuracy against CLAUDE.md hard rules (152 tiles, dragons Red=Crak/Green=Bam/White=Soap, flowers interchangeable, card releases every spring, 13 tiles except East=14, set sizes as numbers not letter codes, open vs closed hands).\n` +
      `- PRICING (blocker if wrong): group lessons show $60 per person, group size 4-8, on lesson pages only; private lessons, parties and corporate events say "contact for pricing" with NO dollar amount; Social Open Play shows $20 per session, read from lib/pricing.ts and never hard-coded (the $85 five-pack is not on sale in Bookwhen as of 2026-11-15, so no page, metadata or structured data may show it until the owner says it is on sale); the Bookwhen league season price may show on league cards on /schedule and /mahjong-leagues-las-vegas only.\n` +
      `- Affiliate links: if any of the 6 affiliate links or the LASVEGASMAHJ code changed, the new URL must be verified live (expect 200).\n` +
      `Mark a shipped mahjong factual error, a pricing violation, or an em dash in user-facing copy as severity "blocker". Return structured findings.`,
      { label: 'brand', phase: 'Review', schema: REVIEW_SCHEMA }
    ),
])

const all = [...technical.findings, ...brand.findings]
const blockers = all.filter((f) => f.severity === 'blocker')
const verdict = typecheck.clean && blockers.length === 0 ? 'PASS' : 'FAIL'

log(`Gate verdict: ${verdict} (typecheck ${typecheck.clean ? 'clean' : 'FAILED'}, ${blockers.length} blockers, ${all.length} total findings)`)

return { verdict, typecheck, blockers, technical, brand }
