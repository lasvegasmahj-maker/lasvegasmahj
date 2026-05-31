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
const SITE = 'https://lasvegasmahj.com'
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
    `Read-only. Check Vercel deploy health for lasvegasmahj. Source the token first: ~/.claude/tokens.env holds VERCEL_TOKEN. ` +
    `Use \`npx vercel ls\` or the Vercel REST API (https://api.vercel.com/v6/deployments?app=lasvegasmahj) with Authorization: Bearer $VERCEL_TOKEN. ` +
    `Report the latest deployment state (READY/ERROR/BUILDING), its age, and whether the last deploy failed. Do not deploy or change anything.`,
    { label: 'deploy', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only. Fetch ${SITE}/sitemap.xml and ${SITE}/robots.txt. Extract every URL in the sitemap (expect about 15 routes). ` +
    `Fetch each route and confirm it returns 200. Also read ${REPO}/app/sitemap.ts and flag any static route that could collide with a dynamic route. ` +
    `Report any non-200, any sitemap route that 404s, and any static/dynamic conflict.`,
    { label: 'sitemap', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only affiliate integrity check for lasvegasmahj. Read ${REPO}/components/shop.tsx, ${REPO}/app/learn-mahjong/page.tsx, and ${REPO}/app/mahjong-sets-guide/page.tsx and extract every affiliate URL and discount code. ` +
    `The 6 named partners are Oh My Mahjong, Bespoke Mahjong, Mahjong Maven, My Fair Mahjong, Peace Love Mahjong, Bird Bam Boutique. ` +
    `Fetch each affiliate URL and confirm it returns 200 (follow redirects). Confirm the LASVEGASMAHJ code (or the partner-specific ref such as ?ref=Lasvegasmahj or sca_ref) is still present in the link and in the on-page copy. ` +
    `Report any affiliate link that does not resolve and any missing or changed code or ref. A broken link or dropped code costs money, so flag it loudly, never silently drop it.`,
    { label: 'affiliate', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only. Fetch the homepage, /mahjong-lessons-las-vegas, /events/cafe-lola-open-play-may-2026, and one blog post of ${SITE}. Extract each JSON-LD <script type="application/ld+json"> block. ` +
    `Validate the structures present (LocalBusiness, FAQPage, AggregateRating, Event, BreadcrumbList, Article): valid JSON, required fields for the declared @type, no empty or placeholder values. ` +
    `Critically, flag any Event schema or on-page event whose date is in the PAST relative to the run date (for example a past Cafe Lola date) as a stale event that needs updating or removing. ` +
    `Report malformed schema and any stale past-dated event.`,
    { label: 'schema', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only local SEO check for lasvegasmahj. The target queries are: mahjong lessons henderson, mahjong lessons summerlin, mahjong lessons las vegas, bachelorette party las vegas, corporate team building las vegas. ` +
    `Real rank data needs Google Search Console, which is NOT wired in yet (it needs a one-time OAuth setup). Do not invent rank numbers. ` +
    `Instead confirm the page that targets each query exists, returns 200, is indexable (no noindex), and has a correct title and canonical. List which target pages are healthy and which are missing or weak. ` +
    `Note in findings that GSC clicks, impressions, and real rank movement are not available until OAuth is set up. Also note Google Business Profile freshness should be checked manually (last post date).`,
    { label: 'localSeo', phase: 'Probe', schema: PROBE_SCHEMA }
  ),
  () => agent(
    `Read-only content opportunities for lasvegasmahj. The run date is provided by the system. ` +
    `Flag two recurring content opportunities: (1) the NMJL card releases every spring, so near spring flag a content update about the new card; never name a specific month. (2) upcoming seasonal or holiday events (for example summer girls trips, bachelorette season, holiday parties) that could become a blog post or event page. ` +
    `Also scan ${REPO}/app for any event page whose date has passed and suggest refreshing it. ` +
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
  `Return { subject, html } where html is a clean simple HTML email (dark navy #11124a header, white body). Note clearly that Google Search Console data (clicks, impressions, rank) is not wired in yet and needs a one-time OAuth setup.`,
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
    `You are opening a DRAFT pull request for lasvegasmahj with safe, low-risk fixes only. Work in ${REPO}. Style rules: no em dashes, no en dashes, mahjong facts correct, never a dollar amount on parties or corporate.\n` +
    `Apply ONLY these safe fixes (broken link, schema typo, stale past-dated event). Do NOT add new content or features; content stays for Shauna to approve.\n` +
    `Safe fixes to apply:\n${JSON.stringify(safeFixes, null, 2)}\n\n` +
    `Steps, in order:\n` +
    `1. git checkout main && git pull --ff-only\n` +
    `2. git checkout -b weekly-checkin-fixes (add a short date-like suffix from the run context if the branch exists)\n` +
    `3. Apply each safe fix with precise edits. If a fix is not actually safe or you are unsure, skip it and note why.\n` +
    `4. Run \`npx tsc --noEmit\`. If it fails, fix only what your change broke; if you cannot, revert that change.\n` +
    `5. git add the changed files, commit with a WHY-focused message, git push -u origin the branch.\n` +
    `6. Open the PR as a DRAFT: \`gh pr create --draft --title "Weekly check-in: safe fixes" --body "<list each fix and why; note this was generated by the weekly check-in and needs review>"\`.\n` +
    `Return the PR URL, or a clear note if you ended up applying nothing.`,
    { label: 'draft-pr', phase: 'Fixes' }
  )
}

log(`Weekly check-in complete. Overall: ${overall}. Safe fixes: ${safeFixes.length}. Emailed: ${SEND_EMAIL}.`)

return { overall, sections, emailed: SEND_EMAIL, safeFixCount: safeFixes.length, prResult }
