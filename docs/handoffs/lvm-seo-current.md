# Handoff: Las Vegas Mahjong competitive SEO, round 1

**Date:** 2026-09-05
**Branch:** `seo/retire-things-to-do`
**PR #97 (round 1 core): MERGED and LIVE on production.** Squashed to `02b36eb` on `main`.
**PR #98 (Things To Do retirement): open on `seo/retire-things-to-do`.**
**Production:** `https://www.lasvegasmahj.com` is serving PR #97 and was verified live
(see "Production verification" below). PR #98 is not deployed yet.
**Working tree:** clean, everything committed.

---

## Vercel project mapping (do not get this wrong)

The real public production project is:

```
team:    lasvegasmahj-6104s-projects
project: lasvegasmahj-h1iz
```

`lasvegasmahj-h1iz` serves `www.lasvegasmahj.com`. There are two other similarly named
projects; a sibling `lasvegasmahj` in the same team also builds every commit but does NOT hold
the domain, and a third `lasvegasmahj` under a different account is stale. Deployment happens
by **merging to `main`** (GitHub auto-deploy). Do not run a CLI deploy, and do not create a
`.vercel/project.json` in a worktree: that has previously produced a stray project.

## Google Search Console

**GSC is already connected and working. Do NOT ask the owner to reconnect it or redo DNS or
HTML-tag verification.** The verification token already ships in `app/layout.tsx` under
`metadata.verification.google` and is live on production.

### Three-month query data (owner-supplied, established this session)

| Query | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|
| las vegas mahjong | 136 | 306 | 44.4% | 2.6 |
| mahjong las vegas | 83 | 299 | 27.8% | 1.9 |
| american mahjong las vegas | 20 | 60 | 33.3% | 2.8 |
| mahjong lessons las vegas | 10 | 35 | 28.6% | 1.2 |

For the exact query **"mahjong lessons las vegas"**:
- `https://www.lasvegasmahj.com/` was the primary ranking page at approximately **position 1.2**
- `https://www.lasvegasmahj.com/mahjong-lessons-las-vegas` also ranked strongly at approximately **position 2.3**

**Consequence, and this is load-bearing: do NOT substantially rewrite the homepage, and do NOT
substantially rewrite `/mahjong-lessons-las-vegas`.** Both already rank near the top for the
money query. Rewrites risk real traffic for no gain.

### Things To Do article

`/blog/things-to-do-las-vegas-besides-gambling` was checked in Search Console and had
**0 clicks and 0 impressions over 3 months**. On that evidence **the owner approved removal of
the Things To Do content.** See "What remains" below: this is approved but NOT yet implemented.

---

## Owner decisions (standing, do not reverse)

1. **No public phone number yet.** Nothing on the site displays one.
2. **`/contact` must be a real crawlable page with no phone number.** Done.
3. **Private lessons are studio-first.** The studio is the primary and default experience.
4. **In-home lessons are an option, available by request only.** Never positioned as a mobile
   or traveling-instructor business.
5. **Private pricing stays "Contact for Pricing".** No starting prices, no minimums, no travel
   fees, no packages.
6. **No visible bachelorette content anywhere on the site.**
7. **The old bachelorette blog URL 301s to `/mahjong-parties-las-vegas`.**
8. **Do not substantially rewrite the homepage.**
9. **Do not substantially rewrite `/mahjong-lessons-las-vegas`** (rankings are already strong).
10. **Owner approved removal of the Things To Do content** (0 clicks / 0 impressions in 3 months).

## Explicitly out of scope (owner said do NOT)

- Do not publish a phone number, and do not create a 702 forwarding number.
- Do not publish private pricing.
- Do not add bachelorette wording anywhere visible.
- Do not enable GA4 or GTM.
- Do not change Ask a Rule.
- Do not change rules content or pending statuses.
- Do not change the Anthropic / model setup.
- Do not modify Find My Mahj.
- Do not consolidate the corporate pages yet.
- Do not rewrite the Summerlin or Henderson pages yet.
- Do not invent a Search Console verification token (one already exists and works).

---

## What was completed (all on PR #97, open, not merged)

### Bachelorette retired
- Deleted `app/blog/bachelorette-party-ideas-las-vegas/`.
- **301** redirect (explicit `statusCode: 301`, not `permanent: true` which emits 308) in
  `next.config.ts` to `/mahjong-parties-las-vegas`.
- Word purged from: parties page title/description/OG/Twitter/JSON-LD/hero label, the sitewide
  `LocalBusiness` offer catalog in `app/layout.tsx`, `components/private-events.tsx`, the blog
  index and its meta description, `components/footer.tsx`, and `app/sitemap.ts`.
- Two surgical word swaps in the Things To Do post (that page was otherwise untouched).
- `.claude/workflows/weekly-checkin.js` updated: it used to name "bachelorette party las vegas"
  as a target query and would have re-proposed the content every Monday.
- The destination parties page gained **no** bachelorette-specific wording.

### `/contact` (new page)
Contact used to be a client-side modal behind `href="#"`, invisible to crawlers, and **dead on
28 of 29 pages** because `onContactOpen` was optional and only the homepage passed it. Now a
real server-rendered page reusing the same Formspree endpoint, with unique title, meta
description, self-canonical, one H1, breadcrumb + ContactPage JSON-LD, studio address, and no
phone number. `components/contact-modal.tsx` deleted; `components/contact-form.tsx` added; nav
and footer point at `/contact`. No `href="#"` remains anywhere.

### `/private-mahjong-lessons-las-vegas` (new page)
Studio-first, in-home by request, Contact for Pricing, no dollar amounts. Three-level
`BreadcrumbList` declaring it a child of the broad lessons page, `Service` schema with no
priced Offer, no MAHJ curriculum restated. The broad page keeps its $60 group pricing, MAHJ
ladder, testimonials, Course schema, title and H1, and hands off with **one** contextual link.

### 404 metadata
Live production shipped **two contradicting robots tags** plus a homepage canonical on every
404. Root layout no longer sets `alternates.canonical` or a blanket `robots`; the homepage
carries its own canonical; `not-found.tsx` declares its own title; `robots.googleBot` keeps
preview directives only, so no `index`/`noindex` word can leak onto a 404. Visible 404 page
was not redesigned.

### Event schema on `/schedule`
One `Event` per future studio session from the existing Bookwhen feed. ISO offsets derived per
date (DST-correct through both 2026 and 2027 transitions and a leap day). Events at venues
whose street address is not verifiable are skipped rather than given an invented address. No
price, availability, performer, or rating. **Rendered schedule output verified byte-identical
to production.**

### LocalBusiness / entity schema
Added studio `streetAddress` (was missing from the one field Google reads for NAP) and a
`location` Place; moved the Maps link from `sameAs` to `hasMap`; added `hasCredential` to the
founder; added the published MAHJ103 offer; `foundingDate` narrowed to the published year;
Summerlin retyped `City` to `Place`; removed `priceRange: "$60+"` (it attached a dollar figure
to the parties and corporate pages); removed legacy `geo.position`/`ICBM` tags that pointed at
the downtown centroid roughly 8 miles from the studio.

### Performance
`public/tile-texture.jpg` was a **byte-identical 431KB duplicate** of `hero-bg.jpg`, served at
8% opacity behind nearly every section including the footer, with `max-age=0`.

| | Before | After |
|---|---|---|
| Bytes | 441,566 | 100,270 (WebP) |
| Cache-Control | `public, max-age=0, must-revalidate` | `public, max-age=31536000, immutable` |

77.3% smaller and no revalidation after first load. Measured at 8% opacity over `--navy`: mean
per-pixel delta 0.5/255, so not visibly different. A real Chromium browser was verified to
fetch only the WebP, never the jpg.

---

## Exact URLs affected

| URL | What happened |
|---|---|
| `/blog/bachelorette-party-ideas-las-vegas` | **Deleted, 301 to `/mahjong-parties-las-vegas`**, removed from sitemap and footer |
| `/mahjong-parties-las-vegas` | Redirect destination. Bachelorette wording removed, stays a general parties page |
| `/blog/things-to-do-las-vegas-besides-gambling` | **Retired in PR #98**: deleted, 301 to `/mahjong-parties-las-vegas`, out of the sitemap |
| `/blog` | Now empty: route kept, `noindex` while empty, out of the sitemap, off the footer |
| `/contact` | **New**, in sitemap at priority 0.7 |
| `/private-mahjong-lessons-las-vegas` | **New**, in sitemap at priority 0.85 |
| `/mahjong-lessons-las-vegas` | Minimal edits only: one handoff link, travel-fee wording removed from copy and FAQ schema. **Do not rewrite** |
| `/` | Gained its own canonical. **Do not rewrite** |
| `/schedule` | Event JSON-LD added, visible output unchanged |
| `/tile-texture.jpg` | **Deleted**, replaced by `/tile-texture-v2.webp` and `/tile-texture-v2.jpg` |

---

## Tests run

- `npx tsc --noEmit`: clean.
- `pnpm build`: clean.
- Browser suites (desktop-chromium + mobile): **124 passed, 0 failed, 2 skipped**.
- `pnpm test:logic`: 196 passed. One failure, the Find My Mahj cross-repo drift check in
  `tests/ask-engine.logic.spec.ts`, **reproduces identically at `origin/main`** in a clean
  worktree and skips in CI. Pre-existing, not a regression.
- `node scripts/lint-regression.mjs origin/main`: no new lint errors in 29 changed files.
  (`pnpm lint` fails on `main` already; that is the documented condition.)
- New specs: `tests/seo-round1.logic.spec.ts` (38 tests) and `tests/seo-round1.spec.ts`
  (24 tests) covering the redirect, no-bachelorette-anywhere, 404 head, `/contact`,
  private-lesson positioning, Event schema validity, DST correctness, cache headers, the
  phone-number boundary, and a full internal-link crawl.
- Ask a Rule verified working end to end against a local production build (`/ask` 200,
  `/api/ask` returns a correct answer).
- Vercel preview could not be checked anonymously: previews are behind Vercel SSO.

---

## Production verification of PR #97 (done, 2026-09-05)

Checked against `https://www.lasvegasmahj.com` after the merge deployed:

- `/contact` 200, `/private-mahjong-lessons-las-vegas` 200, `/schedule` 200, `/` 200.
- `/blog/bachelorette-party-ideas-las-vegas` returns **301** to `/mahjong-parties-las-vegas`.
- **Zero** occurrences of "bachelorette" across all 28 sitemap URLs.
- `/tile-texture-v2.webp` serves 100,270 bytes with `public, max-age=31536000, immutable`.
- 404 head: distinct title `Page Not Found | Las Vegas Mahjong`, single `noindex`, **no canonical**.
- `/schedule` emits **37** Event objects, first `startDate` `2026-09-08T10:30:00-07:00`,
  `streetAddress` correct, and no `offers` / `performer` / `aggregateRating`.
- No phone number in `/contact` visible copy.
- Ask a Rule verified working (`/api/ask` returns correct answers, 152 tiles etc.).

## What remains

1. **Merge PR #98** (this branch) once CI is green, then re-verify on production: the
   Things To Do 301, `/blog` noindexed and out of the sitemap, and no `things-to-do` links.
2. **`/blog` is empty and noindexed on purpose.** Shauna has an unmerged
   `blog-corporate-holiday` branch in the main checkout (`~/Projects/lasvegasmahj`) with a
   holiday party post. When a post lands, delete the `robots: { index: false }` line in
   `app/blog/page.tsx`, put `/blog` back in `app/sitemap.ts`, restore the footer link, and
   update the assertions in `tests/seo-round1.logic.spec.ts`.
3. **Adversarial verification never completed.** A six-lens review workflow was started and
   stopped for credits. See the warning immediately below, which came out of that.

## WARNING: stopped review agents edited this worktree

The review workflow was told not to edit files and edited them anyway, and writes kept
landing after the workflow was stopped. Those edits were caught, saved to
`/tmp/.../scratchpad/stray-agent-edits.diff`, and then judged individually rather than
accepted or discarded wholesale. Adopted deliberately: the `/about` Person `@id`, the
studio Place `@id`, first-party `Event.url`, dropping `suite200` from `isStudioAddress`,
referencing `#business` by `@id` from `/contact`, removing the redundant `location` Place,
the FAQ travel-fee correction, and Open Graph on the 404. **Rejected:** an edit that
re-added a street-less `PostalAddress` onto the `#business` `@id` on
`/mahjong-lessons-las-vegas`, which is the exact NAP dilution round 1 removed, along with
the test that had been written to enforce it.

**Lesson for a future session:** if you run review subagents against a live worktree, diff
the tree against the branch tip before trusting `git status`, and never commit their edits
without reading every hunk.

## Open owner questions (flagged, not decided)

- **The personal phone number 847-609-3112 is still in the sitewide `LocalBusiness`
  `telephone` field** in `app/layout.tsx`. It predates this work and matches the Google
  Business Profile NAP, so removing it breaks NAP consistency. Nothing new exposes it and a
  test pins it to that one field. One-line removal whenever the owner decides.
- **The founder's surname was deliberately NOT added** to structured data: it appears nowhere
  in visible copy, so it did not meet the "already verified" bar. Owner call.
- `paymentAccepted: "Cash, Credit Card, Venmo"` in the LocalBusiness schema is unsourced; only
  card payment is stated anywhere on the site. Left alone, flagged.
- **Studio-first is contradicted elsewhere.** Travel-fee and come-to-you wording was removed
  from `/mahjong-lessons-las-vegas`, but still exists in `app/mahjong-lessons-summerlin`,
  `app/mahjong-lessons-henderson`, `components/faq.tsx` and `app/about/page.tsx`. The owner
  explicitly deferred rewriting Summerlin and Henderson, so this was left alone on purpose.

## Things a fresh session could accidentally redo or reverse

- **Re-adding bachelorette content.** It is removed by explicit owner decision, permanently.
  A test fails the build if the word returns to shipped source.
- **Rewriting the homepage or `/mahjong-lessons-las-vegas`.** Both rank near position 1-2 for
  the money query. Explicitly forbidden.
- **Asking the owner to connect or re-verify Google Search Console.** It is already connected
  and working, and the token already ships.
- **Deploying via the Vercel CLI, or to the wrong `lasvegasmahj` project.** Merge to `main`
  instead; the domain lives on `lasvegasmahj-h1iz`.
- **"Fixing" the Find My Mahj drift test failure.** It fails identically at `origin/main` and
  skips in CI.
- **"Fixing" `pnpm lint`.** `main` carries known pre-existing errors; only
  `scripts/lint-regression.mjs` is the gate.
- **Re-adding a canonical to the root layout.** That is what poisoned every 404 with the
  homepage canonical in the first place.
- **Restoring `robots: { index: true }` to the root layout.** It contradicted the `noindex`
  Next injects on 404s.
- **Treating the missing `/tile-texture.jpg` as a bug.** It was a byte-identical duplicate and
  was deliberately deleted; the CSS points at the versioned v2 files.
- **Keeping the Things To Do page because this branch's tests say to.** Those assertions were
  written before the owner approved removal and must be updated as part of that work.
