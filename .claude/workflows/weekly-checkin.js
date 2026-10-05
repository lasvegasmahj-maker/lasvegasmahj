export const meta = {
  name: 'weekly-checkin',
  description: 'Weekly read-only health check for lasvegasmahj. Emails Shauna a digest via Resend, then opens a DRAFT PR with safe fixes only.',
  phases: [
    { title: 'Probe', detail: 'parallel read-only health probes' },
    { title: 'Digest', detail: 'synthesize into Healthy / Needs attention / Proposed fixes' },
    { title: 'Notify', detail: 'email the digest to Shauna via Resend' },
    { title: 'Fixes', detail: 'open a draft PR with safe fixes only' },
  ],
}

const REPO = '/Users/shaunabruckman/Projects/lasvegasmahj'
// The checkout at REPO is the owner's working copy. It frequently sits on a feature
// branch with unpushed work, so reading its working tree describes drafts, not production.
// Every read-only probe reads PROD_REF instead; the draft-PR step works in its own worktree.
const PROD_REF = 'origin/main'
const PR_WORKTREE = '/private/tmp/lvm-weekly-checkin/pr'
const READ_PROD = `Read repository files ONLY as they exist on ${PROD_REF}, never from the working tree: run \`git -C ${REPO} fetch origin main\` first (safe, it does not touch the working tree), then read files with \`git -C ${REPO} show ${PROD_REF}:<path>\` and list directories with \`git -C ${REPO} ls-tree --name-only ${PROD_REF} <dir>/\`. The checkout at ${REPO} often sits on a feature branch with unpushed work and does NOT reflect production. Never run git checkout, switch, pull, stash, reset or clean in ${REPO}. `
const SITE = 'https://www.lasvegasmahj.com'
const RECIPIENT = 'sbruckma@gmail.com'
const RESEND_ENV = '/Users/shaunabruckman/Projects/findmymahjgame/.env.local'
const RESEND_FROM = 'Las Vegas Mahjong Report <hello@findmymahjgame.com>'

const SEND_EMAIL = true
const OPEN_DRAFT_PR = true

const PROBE_SCHEMA = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['healthy', 'needs_attention', 'broken'] },
    findings: { type: 'array', items: { type: 'string' } },
    proposedFixes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          file: { type: 'string' },
          safe: { type: 'boolean', description: 'true only for low-risk mechanical fixes: broken link, schema typo, stale past-dated event' },
        },
        required: ['summary', 'safe'],
      },
    },
  },
  required: ['status', 'findings', 'proposedFixes'],
}

phase('Probe')

const [deploy, sitemap, affiliate, schema, localSeo, content, cwv] = await parallel([
  () => agent(
    `Read-only. Check production deploy health for lasvegasmahj. Production is ${SITE} and it is served by the Vercel project lasvegasmahj-h1iz under the account lasvegasmahj-6104s-projects, which auto-deploys from GitHub main. ` +
    `Known and expected, never report either as a problem or a mystery: (1) the VERCEL_TOKEN in ~/.claude/tokens.env belongs to a different account (Boldxtalent / BBEXEC) and cannot see the production project, so do not use it for a production verdict, and (2) the old project at lasvegasmahj.vercel.app is intentionally paused and returns 503 on purpose, so do not investigate that 503. ` +
    `Verify production this way instead: (a) fetch ${SITE}/ and confirm 200, (b) run \`gh api repos/lasvegasmahj-maker/lasvegasmahj/deployments --jq '.[0]'\` and \`gh run list --branch main --limit 5\` to get the newest main commit and whether its checks passed, (c) fetch ${SITE}/sitemap.xml and confirm it serves. ` +
    `Report status broken if production does not return 200, or if the newest commit on main failed its checks, or if main has commits that are clearly not live. Report the age of the newest main commit. Do not deploy or change anything.`,
    { label: 'deploy', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only. Fetch ${SITE}/sitemap.xml and ${SITE}/robots.txt. Extract every URL in the sitemap. As of 2026-09-07 the sitemap has 27 routes; treat a count near that as normal and flag it only if the count drops sharply or the sitemap fails to serve. Report the actual count either way. ` +
    `Fetch each route and confirm it returns 200. Two routes are retired ON PURPOSE and are not broken: /blog/things-to-do-las-vegas-besides-gambling returns 410, and /blog/bachelorette-party-ideas-las-vegas returns 301 to /mahjong-parties-las-vegas. Report either one only if its behaviour CHANGES. ` +
    `Also confirm https://lasvegasmahj.com/ still redirects to ${SITE}/ and flag it if that redirect ever stops working. ` +
    `${READ_PROD}Read app/sitemap.ts on ${PROD_REF} and flag any static route that could collide with a dynamic route. ` +
    `Report any non-200, any sitemap route that 404s, and any static/dynamic conflict.`,
    { label: 'sitemap', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only affiliate integrity check for lasvegasmahj. ${READ_PROD}Read components/shop.tsx, app/learn-mahjong/page.tsx and app/mahjong-sets-guide/page.tsx on ${PROD_REF} and extract every affiliate URL and discount code. ` +
    `The 7 named partners are Oh My Mahjong, Bespoke Mahjong, Mahjongg Maven (two g's is the correct brand spelling), My Fair Mahjong, Peace Love Mahjong, Bird Bam Boutique, Mini Mahjer. ` +
    `Fetch each affiliate URL and confirm it returns 200 (follow redirects). Tracking differs by partner and a mismatch is only a defect where the code actually applies: Peace Love Mahjong and My Fair Mahjong carry the literal LASVEGASMAHJ code and a missing code there IS a defect; Mahjongg Maven tracks by ?ref=Lasvegasmahj; Oh My Mahjong, Bespoke Mahjong, Bird Bam Boutique and Mini Mahjer track by sca_ref and correctly carry no LASVEGASMAHJ code, so a missing code on those four is NOT a defect. ` +
    `Report any affiliate link that does not resolve and any missing or changed code or ref. A broken link or dropped code costs money, so flag it loudly, never silently drop it.`,
    { label: 'affiliate', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only. Fetch these pages of ${SITE}: the homepage, /mahjong-lessons-las-vegas, /studio, /contact, and any event page still listed in the sitemap. Extract each JSON-LD <script type="application/ld+json"> block. ` +
    `Do not go looking for a blog post: production currently publishes none, and the two retired blog routes (410 and 301) are intentional, not broken. ` +
    `Validate the structures present (LocalBusiness, FAQPage, AggregateRating, Event, BreadcrumbList, Article): valid JSON, required fields for the declared @type, no empty or placeholder values. ` +
    `Critically, flag any Event schema or on-page event whose date is in the PAST relative to the run date (for example a past Cafe Lola date) as a stale event that needs updating or removing. ` +
    `Report malformed schema and any stale past-dated event.`,
    { label: 'schema', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only local SEO check for lasvegasmahj. The target queries are: mahjong lessons henderson, mahjong lessons summerlin, mahjong lessons las vegas, private mahjong lessons las vegas, mahjong parties las vegas, corporate team building las vegas. ` +
    `Never treat bachelorette as a target query and never propose bachelorette content or a bachelorette landing page: the owner retired it on 2026-09-05 and it is not to return. The absence of a bachelorette page is a decision, not a gap, so do not flag it. ` +
    `Google Search Console IS connected for the property ${SITE}/ . Never say GSC is missing, unverified, or needs OAuth setup. This workflow has no programmatic GSC API access, so it cannot read clicks, impressions or rank itself. Do not invent rank numbers and do not report the absence of API access as a site problem. ` +
    `Confirm the page that targets each query exists, returns 200, is indexable (no noindex), and has a correct title and canonical. List which target pages are healthy and which are missing or weak. ` +
    `Note in findings that clicks, impressions and rank movement live in the connected Search Console property and are reviewed there manually, not pulled by this report. Also note Google Business Profile freshness should be checked manually (last post date).`,
    { label: 'localSeo', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only content opportunities for lasvegasmahj. The run date is provided by the system. ` +
    `Never propose bachelorette content: the owner removed it from the site on 2026-09-05 and it is not to return. Flag two recurring content opportunities: (1) the NMJL card releases every spring, so near spring flag a content update about the new card; never name a specific month. (2) upcoming seasonal or holiday events (for example summer girls trips, corporate offsite season, holiday parties) that could become a blog post or event page. ` +
    `${READ_PROD}Also scan the app directory on ${PROD_REF} for any event page whose date has passed and suggest refreshing it. ` +
    `Return suggestions as findings. Mark proposedFixes safe:false for new content (content stays draft for Shauna to approve), and safe:true only for a stale past-date that should be corrected.`,
    { label: 'content', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only. Assess Core Web Vitals for ${SITE} homepage and /mahjong-lessons-las-vegas. ` +
    `Try \`npx lighthouse ${SITE} --only-categories=performance --output=json --quiet --chrome-flags="--headless"\`. ` +
    `If lighthouse cannot run headless here, say so and instead report obvious perf risks from the HTML (large unoptimized images, render-blocking resources, missing image dimensions). Do not install global tools.`,
    { label: 'cwv', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
])

phase('Digest')

const sections = { deploy, sitemap, affiliate, schema, localSeo, content, cwv }
const overall =
  Object.values(sections).some((s) => s && s.status === 'broken') ? 'Needs attention'
  : Object.values(sections).some((s) => s && s.status === 'needs_attention') ? 'Needs attention'
  : 'Healthy'

const digest = await agent(
  `Write a concise weekly health digest email for Shauna (non-technical) about lasvegasmahj (Las Vegas Mahjong). ` +
  `Overall status is "${overall}". Use plain language, no jargon, no em dashes, no en dashes, no emojis. Never show a dollar amount for parties or corporate events. Keep mahjong facts correct. ` +
  `Structure: (1) one-line overall status, (2) "Healthy" bullets for what is fine, (3) "Needs attention" bullets with plain-English impact, (4) "Proposed fixes" listing the safe fixes that will go into a draft PR, and separately any content ideas that stay as drafts for her to approve. ` +
  `Probe data as JSON:\n${JSON.stringify(sections, null, 2)}\n` +
  `Return { subject, html } where html is a clean simple HTML email (dark navy #11124a header, white body). Do not claim Google Search Console is missing or needs setup: it is connected for ${SITE}/ . Only say that clicks, impressions and rank are reviewed in Search Console directly and are not pulled into this report.`,
  { label: 'digest', phase: 'Digest',
    schema: { type: 'object', properties: { subject: { type: 'string' }, html: { type: 'string' } }, required: ['subject', 'html'] } }
)

phase('Notify')

if (SEND_EMAIL) {
  await agent(
    `Send one email via the Resend API. The API key is RESEND_API_KEY in ${RESEND_ENV} (read that file to get it; it is gitignored and server-side only, do not print it). ` +
    `POST https://api.resend.com/emails with Authorization: Bearer <key> and JSON body: ` +
    `{"from":${JSON.stringify(RESEND_FROM)},"to":"${RECIPIENT}","subject":${JSON.stringify(digest.subject)},"html":<the html below>}. ` +
    `The html to send is:\n${digest.html}\n` +
    `Confirm the send succeeded (200 or 202 with an id). Send exactly one email.`,
    { label: 'send-email', phase: 'Notify' }
  )
}

phase('Fixes')

const safeFixes = Object.values(sections)
  .filter(Boolean)
  .flatMap((s) => (s.proposedFixes || []).filter((f) => f && f.safe))

let prResult = 'No safe fixes this week, no PR opened.'

if (OPEN_DRAFT_PR && safeFixes.length > 0) {
  prResult = await agent(
    `You are opening a DRAFT pull request for lasvegasmahj with safe, low-risk fixes only. Work ONLY in the isolated worktree ${PR_WORKTREE}, never in ${REPO}. Style rules: no em dashes, no en dashes, mahjong facts correct, never a dollar amount on parties or corporate.\n` +
    `Apply ONLY these safe fixes (broken link, schema typo, stale past-dated event). Do NOT add new content or features; content stays for Shauna to approve.\n` +
    `Safe fixes to apply:\n${JSON.stringify(safeFixes, null, 2)}\n\n` +
    `Steps, in order:\n` +
    `1. git -C ${REPO} fetch origin main. Do NOT check out, pull, switch, stash or reset anything in ${REPO}: it holds unpushed work on another branch.\n` +
    `2. Create an isolated worktree off the deployed code and do all work there: \`rm -rf ${PR_WORKTREE} && git -C ${REPO} worktree add ${PR_WORKTREE} -b weekly-checkin-fixes-<YYYY-MM-DD> ${PROD_REF}\` (pick a fresh suffix if that branch exists). Every step below runs inside ${PR_WORKTREE}.\n` +
    `3. Apply each safe fix with precise edits. If a fix is not actually safe or you are unsure, skip it and note why.\n` +
    `4. Run \`npx tsc --noEmit\`. If it fails, fix only what your change broke; if you cannot, revert that change.\n` +
    `5. git add the changed files, commit with a WHY-focused message, git push -u origin the branch.\n` +
    `6. Open the PR as a DRAFT: \`gh pr create --draft --title "Weekly check-in: safe fixes" --body "<list each fix and why; note this was generated by the weekly check-in and needs review>"\`.\n` +
    `7. Clean up: \`git -C ${REPO} worktree remove ${PR_WORKTREE} --force\` once the PR is open.\n` +
    `Return the PR URL, or a clear note if you ended up applying nothing.`,
    { label: 'draft-pr', phase: 'Fixes' }
  )
}

log(`Weekly check-in complete. Overall: ${overall}. Safe fixes: ${safeFixes.length}. Emailed: ${SEND_EMAIL}.`)

return { overall, sections, emailed: SEND_EMAIL, safeFixCount: safeFixes.length, prResult }
