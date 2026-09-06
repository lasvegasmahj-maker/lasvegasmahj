# Handoff: Las Vegas Mahjong competitive SEO

Round 2 is the active round. Round 1 is CLOSED and live; its full record is preserved
below and must not be edited or re-litigated.

---

# ROUND 2: conversion CTA cleanup (ACTIVE, PAUSED FOR CREDITS)

**Date paused:** 2026-09-05
**Branch:** `seo/round2-contact-ctas`
**HEAD:** `992773c`
**Base:** `origin/main` at `55c5d04` (unchanged, nothing merged this round)
**PR:** [#100](https://github.com/lasvegasmahj-maker/lasvegasmahj/pull/100), **OPEN**, mergeable
**Working tree:** clean, everything committed and pushed
**Production:** NOT deployed. `www.lasvegasmahj.com` still serves `55c5d04` with the old CTAs.

## Current task

Fix high-intent conversion CTAs on the commercial pages that pointed at homepage anchors
instead of the real `/contact` page that round 1 created.

## Owner goal

A corporate, conference, convention or party buyer who clicks a quote CTA should reach the
inquiry form, not be thrown back to the homepage.

## The audit result (this is the real number, keep it)

The brief said "approximately 22" CTAs. That number is too high. Every CTA-styled element on
the site was enumerated: **83 audited, 12 changed.**

The 22 came from counting all 16 `/#classes` links plus the 4 `/#private-events` links plus
strays. Ten of the `/#classes` links are **"Book a Lesson" / "Book Now" on the lessons pages,
which are booking CTAs and were deliberately left alone.**

### Changed (12), href only

| Page | CTA text | Was | Now |
|---|---|---|---|
| `/mahjong-corporate-las-vegas` | Request a Quote | `/#classes` | `/contact` |
| `/mahjong-corporate-las-vegas` | Request a Corporate Quote | `/#classes` | `/contact` |
| `/corporate-team-building-las-vegas` | Request a Quote (x2) | `/#classes` | `/contact` |
| `/conference-activities-las-vegas` | Request a Quote (x2) | `/#classes` | `/contact` |
| `/convention-activities-las-vegas` | Request a Quote | `/#classes` | `/contact` |
| `/convention-activities-las-vegas` | Request a Convention Quote | `/#classes` | `/contact` |
| `/mahjong-parties-las-vegas` | Plan Your Event | `/#private-events` | `/contact` |
| `/mahjong-parties-las-vegas` | Book a Birthday Party | `/#private-events` | `/contact` |
| `/mahjong-parties-las-vegas` | Get a Quote | `/#private-events` | `/contact` |
| `/mahjong-parties-las-vegas` | Book Your Event | `/#private-events` | `/contact` |

**No visible CTA text was changed. No styling, spacing, placement or layout was changed.**
Only the `href` attribute on those 12 anchors.

### Why those two anchors were wrong

- `/#classes` is the homepage **lessons** section. It quotes $60 per person for a group class
  and its own button goes to `/schedule`. A corporate buyer clicking "Request a Corporate
  Quote" landed on consumer lesson pricing.
- `/#private-events` is a homepage section whose only CTA is a **button** that opens a
  client-side modal. Reaching a form took a second click after the page change.

### Deliberately NOT changed, and why

- **"Book a Lesson" / "Book Now" on `/mahjong-lessons-las-vegas`, `-summerlin`, `-henderson`
  (10 links) stay on `/#classes`.** They are booking CTAs, and `#classes` is a real lessons
  destination whose own Book Now goes to `/schedule`.
- Bookwhen ticket links, `/schedule`, `/ask`, `/rules`, shop, open play, homepage
  informational links, nav and footer: untouched.
- The homepage `#private-events` section still opens the inquiry modal. Nothing links to
  `/#private-events` any more; the section is still reachable by scrolling. Not a bug.
- `components/teacher.tsx` uses relative `#classes`; teacher/classes/private-events render on
  the homepage only, so that anchor is correct.

## Completed in this session

1. **Full CTA audit.** 83 CTA-styled elements enumerated, 12 identified and changed.
2. **The 12 href changes** (commit `228ed97`).
3. **Two new spec files**, `tests/seo-round2.logic.spec.ts` and `tests/seo-round2.spec.ts`,
   covering the 12 CTAs, real clicks through to a working form on desktop and mobile, the
   no-over-correction guards, and the round 1 behaviours underneath.
4. **Focused adversarial review** (6 hostile lenses, 42 agents, all completed). See below.
5. **Test hardening** (commit `992773c`) fixing five ways the new specs passed vacuously,
   each proven by mutation.

## Adversarial review: COMPLETED, not interrupted

Six lenses (cta-correctness, protected-pages, owner-rules, links-and-status, mobile-ux,
test-quality). 12 claims raised, each judged by 3 independent refuters on distinct angles
(does-it-reproduce, is-it-in-scope, is-it-actually-harmful). 42 agents, 0 errors.

**All 5 test-quality findings were real and are FIXED in `992773c`:**

| Defect | Why it mattered |
|---|---|
| CTA parser required `href` to be the first attribute | `<a className="btn-primary" href="/contact">` was invisible, so every no-over-correction assertion passed trivially |
| Phone guard `[.\s-]?` allows one separator | never matched `(847) 609-3112`, the format anyone would type |
| "protected pages keep their title, H1 and canonical" | asserted a title existed, a canonical tag existed, and nothing about the H1 |
| "is reachable from the nav" | contained no assertion about the nav |
| Duplicate label entry | made one per-CTA check a no-op |

The guards now pin the exact production title, canonical and H1 for `/` and
`/mahjong-lessons-las-vegas`, and assert per-page CTA counts.

**Verified by mutation (each fails the intended test):** reverting a CTA to `/#classes`,
renaming a CTA, deleting a CTA, adding a class-first `/contact` CTA to a lessons page,
marking a page noindex, adding `(847) 609-3112`, rewriting the homepage title.

**All 7 site findings were dismissed 3/3** as pre-existing or out of scope. They are real
observations about the site but not caused by this diff. They are listed under "Known issues,
not fixed" below so they are not lost.

## Tests run and results

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `pnpm build` | clean, 36 routes |
| `pnpm test:logic` | **234 passed**, 7 skipped, 1 failed |
| Browser `desktop-chromium` + `mobile` | **168 passed**, 0 failed, 2 skipped |
| `scripts/lint-regression.mjs origin/main` | no new lint errors in 7 changed files |
| Mutation testing | 7 mutations, all caught |

The one logic failure is the **Find My Mahj drift check** in `tests/ask-engine.logic.spec.ts`.
Verified this session by stashing all changes and re-running at clean `origin/main`: it fails
identically there. Pre-existing, skips in CI, **not a regression, do not "fix" it.**

## CI status

`228ed97`: all six checks green (checks, browser, lint, Vercel Preview Comments, Vercel
lasvegasmahj, Vercel lasvegasmahj-h1iz).

`992773c` (test hardening): **all six checks green**, confirmed before this session paused
(run 34002463798: checks 37s, browser 1m14s, lint 24s, both Vercel deploys completed).

**PR #100 is green end to end and mergeable. Nothing is blocking the merge.**

## Production verification: NOT DONE

Nothing merged, so nothing deployed. A baseline of production HTML before the change was
captured and confirms all 12 old hrefs are still live:
`/#classes` on the four corporate pages, `/#private-events` on the parties page.

## Is it safe to merge?

**Yes.** CI is green on both commits, the product change is 12 href attributes, and the
protected pages are not touched by the diff (`git diff origin/main -- app/page.tsx
app/mahjong-lessons-las-vegas/` is empty). The merge was left to the owner only because this
session paused for credits, not because anything is unresolved.

## Next exact step for a fresh session

```bash
cd /Users/shaunabruckman/Projects/lvm-seo-round2
git status                      # expect clean, HEAD 992773c
gh pr checks 100 --repo lasvegasmahj-maker/lasvegasmahj   # was green at pause, re-confirm
gh pr merge 100 --repo lasvegasmahj-maker/lasvegasmahj --squash
# wait ~90s for the lasvegasmahj-h1iz deploy, then verify production:
for p in /mahjong-corporate-las-vegas /corporate-team-building-las-vegas \
         /conference-activities-las-vegas /convention-activities-las-vegas \
         /mahjong-parties-las-vegas; do
  echo "--- $p"
  curl -s "https://www.lasvegasmahj.com$p" | grep -o '<a[^>]*class="btn-primary"[^>]*>[^<]*</a>'
done
curl -s -o /dev/null -w '/contact %{http_code}\n' https://www.lasvegasmahj.com/contact
curl -s -o /dev/null -w 'things-to-do %{http_code}\n' https://www.lasvegasmahj.com/blog/things-to-do-las-vegas-besides-gambling
curl -s -o /dev/null -w 'bachelorette %{http_code} -> %{redirect_url}\n' https://www.lasvegasmahj.com/blog/bachelorette-party-ideas-las-vegas
```

Expect: all 12 CTAs showing `href="/contact"`, `/contact` 200, Things To Do 410,
bachelorette 301 to `/mahjong-parties-las-vegas`.

## Known issues, not fixed (all dismissed as out of scope for round 2)

These are real but were NOT caused by this diff. The brief said not to change the contact
page design unless fixing a functional defect, so they were reported rather than implemented.

1. **The contact form collects less than the old inquiry modal.** `components/inquiry-modal.tsx`
   collects name, email, a required phone, interest, a required group size and dates, and fires
   `trackEvent("lesson_inquiry")`. `components/contact-form.tsx` collects name, email and an
   **optional** message. The corporate and convention pages promise "a custom quote within 24
   hours" and ask for group size and dates in the copy directly above the button, but the form
   does not collect them. **This is the highest-value remaining conversion issue.**
2. **No source or intent marker on the lead.** Both forms post to the same Formspree endpoint
   `mwvrnjrb`. A quote request is now indistinguishable from a rules question in the inbox, and
   there is no way to tell which of the five landing pages converts. One hidden input would fix it.
3. **CTAs land at the top of `/contact`;** on an iPhone viewport the first form field is roughly
   1.5 screens below the fold. A `#send` fragment plus a matching id would close the gap.
4. **`.btn-primary` in `app/globals.css:238` sets no `display`,** so on a 390px viewport the
   three longest labels wrap into overlapping inline fragments. Pre-existing CSS, affects
   several pages, not just these.
5. **The birthday section on `/mahjong-parties-las-vegas:102`** uses an inline
   `gridTemplateColumns: "1fr 1fr"` that no media query can override, so it never stacks on
   mobile. Pre-existing.
6. **`/contact`'s closing CTA** offers "See the Calendar" and "View Lessons" and no event path,
   and its "Planning an event?" card links back to the pages the visitor just came from.

## Parallel sessions: a real hazard, again

Six peer Claude sessions were live during this session. A reviewer observed another session
writing scratch mutations into this worktree mid-review (`app/layout.tsx` title, `components/hero.tsx`
H1, an `example.com` canonical in `app/page.tsx`). **They are gone; the tree was verified clean at
`992773c` and none of it is in the diff.** This round was built in a dedicated worktree at
`~/Projects/lvm-seo-round2` off `origin/main` specifically to avoid the shared-checkout collision.
Keep doing that, and diff the tree before trusting `git status`.

## Recommended next actions (NOT implemented, owner's call)

1. Add group size, event date and event type fields to `/contact`, plus a hidden source field
   so leads are triageable and attributable. Highest conversion value.
2. Give `.btn-primary` `display: inline-block` so long CTA labels stop breaking on phones.
3. Point the quote CTAs at `/contact#send` and give the form section that id, so mobile
   visitors land on the form.

---

# ROUND 1: CLOSED, MERGED AND LIVE

Everything below is the round 1 record, preserved as written. `main` reached `55c5d04` via
PR #97, #98 and #99 and all of it is live on production. Its owner decisions remain in force.
**Do not reopen or re-litigate round 1 unless an objective regression is found.**

## Round 1 production baseline (verified live)

- `/contact` is live and crawlable
- private lesson coverage is live and studio-first; in-home is by request only
- private pricing stays "Contact for Pricing"
- no public phone number anywhere, and no `telephone` in structured data
- the founder surname is not published
- `/blog/bachelorette-party-ideas-las-vegas` 301s to `/mahjong-parties-las-vegas`
- no visible bachelorette content anywhere
- `/blog/things-to-do-las-vegas-besides-gambling` returns 410 Gone with noindex, no Location
- Event structured data is live on `/schedule`
- LocalBusiness / entity cleanup is live
- the 404 SEO fix is live
- tile texture optimization is live
- www canonical consistency verified
- the homepage and `/mahjong-lessons-las-vegas` were deliberately protected from rewriting
- Google Search Console is ALREADY connected and working; never ask to reconnect it
- GSC evidence: "mahjong lessons las vegas" averages roughly position 1.2 sitewide, the
  homepage is the primary ranking page for it, and `/mahjong-lessons-las-vegas` also ranks
  strongly at roughly position 2.3

# Handoff: Las Vegas Mahjong competitive SEO, round 1 (historical record)

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
| `/blog/things-to-do-las-vegas-besides-gambling` | **Retired**: returns **410 Gone** with `x-robots-tag: noindex`, out of the sitemap. Deliberately NOT redirected |
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
- No phone number in `/contact` visible copy. (`telephone` was later removed from the sitewide LocalBusiness JSON-LD as well.)
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

## A parallel Claude session was working in the same worktree

Another session (`shaunabruckman-b6`) was running the same round in parallel and writing to
`~/Projects/lasvegasmahj-seo-round1` at the same time. That, not a misbehaving subagent, is
where the unexplained edits in the working tree came from. It has since stood down and handed
its findings over. Every edit was diffed and judged individually rather than accepted or
discarded wholesale; the diff is preserved at `scratchpad/stray-agent-edits.diff`.

Adopted from that session: the `/about` Person `@id`, the studio Place `@id`, first-party
`Event.url`, dropping `suite200` from `isStudioAddress`, referencing `#business` by `@id`
from `/contact`, removing the redundant `location` Place, the FAQ travel-fee correction,
Open Graph on the 404, and moving the `image-set()` into an `@supports` block so the
minifier stops eating the plain `url()` fallback (verified in the compiled chunk).

**Declined, deliberately:** its request to restore
`address: { "@type": "PostalAddress", addressLocality: "Las Vegas", addressRegion: "NV" }`
to the Course `provider` on `/mahjong-lessons-las-vegas`. That address has no
`streetAddress`, and because the provider shares the `#business` `@id` with the layout node
that DOES have one, the two merge into one entity carrying two different addresses. Round 1
removed it for exactly that reason. The provider keeps `@id`, `name` and `url`, so
`provider.name` that Course rich results require is still present. A test now guards it.

**Lesson for a future session:** if another session may be live in the same worktree, diff
the tree against the branch tip before trusting `git status`, and never commit edits you did
not write without reading every hunk.

## Why Things To Do is a 410 and bachelorette is a 301

These two retirements deliberately differ, and a future session should not "fix" the
inconsistency.

- **Bachelorette: 301** to `/mahjong-parties-las-vegas`. The post was topically about booking
  a private mahjong party, so the destination is a genuine equivalent and the redirect is not
  a soft 404 risk.
- **Things To Do: 410 Gone.** The owner asked for a clean removal here, not a redirect. It
  also happens to be the right technical call: Search Console recorded 0 clicks and 0
  impressions over 90 days, so there is no equity for a redirect to carry, and pointing a
  general "things to do in Las Vegas" guide at a mahjong parties page is exactly the kind of
  irrelevant redirect Google tends to treat as a soft 404. A 410 gets the URL dropped fastest.

Implementation note: a route handler and a page cannot share a route segment, so deleting
`page.tsx` is what frees the segment for
`app/blog/things-to-do-las-vegas-besides-gambling/route.ts`. Next will not prerender a
non-200 route handler, so it stays dynamic; the response is a constant, so that costs nothing.
The 410 body is a small styled page pointing at `/schedule` and `/mahjong-parties-las-vegas`,
so a human who lands there is not staring at a bare error.

## Open owner questions (flagged, not decided)

- **RESOLVED 2026-09-05: the phone number is out.** `telephone` was removed from the sitewide
  `LocalBusiness` JSON-LD at the owner's direction. Her reasoning overrode the NAP argument:
  JSON-LD is not visibly rendered but it is still publicly exposed structured data, and she
  does not want a public number yet. Do not add one back and do not substitute a forwarding
  number. Tests now assert no shipped file declares a `telephone` and no page publishes the
  number in copy or structured data.
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
