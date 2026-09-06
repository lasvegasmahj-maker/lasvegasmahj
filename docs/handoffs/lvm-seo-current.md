# Handoff: Las Vegas Mahjong competitive SEO

Rounds 1, 2 and 3 are all CLOSED, MERGED and LIVE. Their records are preserved below and
must not be edited or re-litigated. There is no active round.

---

# ROUND 3: contact form quality and source attribution (CLOSED, MERGED, LIVE)

**Date closed:** 2026-09-06
**Branches:** `conversion/round3-contact-quality`, then `conversion/round3-date-followup` (both merged, deleted)
**Merged as:** squash commits **`fd70083`** ([#102](https://github.com/lasvegasmahj-maker/lasvegasmahj/pull/102)) and **`dcbc17e`** ([#104](https://github.com/lasvegasmahj-maker/lasvegasmahj/pull/104)) on `main`
**Base:** `origin/main` at `044ca5d`
**Production:** **LIVE** on `www.lasvegasmahj.com` via `lasvegasmahj-6104s-projects / lasvegasmahj-h1iz`.
**CI on both PRs:** green (checks, browser, lint).

## What shipped

The form asks six visible questions instead of three. Only Name, Email and Inquiry Type are
required; Group Size, Preferred Date and Message are optional, because most people inquire
before a date is fixed and a guessed date is worse data than a blank one.

| Field | Name attribute | Required |
|---|---|---|
| Your Name | `name` | yes (unchanged) |
| Email Address | `email` | yes (unchanged) |
| What Can We Help With? | `inquiry_type` | **yes** (new) |
| Group Size | `group_size` | no (new) |
| Preferred Date | `preferred_date` | no (new) |
| Tell Us More | `message` | no (relabelled from "Your Question") |
| (hidden) | `source` | n/a (new) |

Inquiry Type options: Private Lesson, Group Lesson or Class, Private Party or Celebration,
Corporate or Team Building, Conference or Convention, Charity or Fundraiser, Something Else.

Group Size options: Not sure yet, Just me, 2-3, 4-8, 9-20, 21-50, 50+ people.

## Source attribution

A first-party query parameter. No analytics, no third party. **15** CTAs across **6** pages
carry `?source=<slug>`; the form maps the slug to a readable label sent as the hidden `source`
field, and pre-selects the Inquiry Type the source implies, which is what lets that field be
required without adding friction to the tagged paths.

| Slug | Page | Arrives in the inbox as | CTAs |
|---|---|---|---|
| `corporate` | `/mahjong-corporate-las-vegas` | Corporate Events page | 2 |
| `team-building` | `/corporate-team-building-las-vegas` | Corporate Team Building page | 2 |
| `conference` | `/conference-activities-las-vegas` | Conference Activities page | 2 |
| `convention` | `/convention-activities-las-vegas` | Convention Activities page | 2 |
| `parties` | `/mahjong-parties-las-vegas` | Private Parties page | 4 |
| `private-lessons` | `/private-mahjong-lessons-las-vegas` | Private Lessons page | 3 |
| (none) | nav, footer, direct, organic | General (nav, footer or direct) | n/a |

**The nav and footer links are bare on purpose.** They are one shared component each, rendered
on every page, so a slug there could only ever be a single sitewide constant. They fall back to
the General bucket, which is also where direct and search traffic lands. Do not "finish" them.

An unrecognised, empty or hostile slug falls back to General rather than forwarding raw query
text into an inbox a human reads. Verified live with a script tag payload.

## Two implementation facts a later session must not undo

1. **The query string is read with `useSyncExternalStore` over `window.location.search`, never
   with `useSearchParams`.** Three real builds settled this. Without a Suspense boundary,
   `useSearchParams` fails `pnpm build` outright. With one, the build passes but the entire
   form is replaced by a `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker in the prerendered
   `/contact` document, so the form disappears from the static HTML. `/contact` is `○` static
   and the form is in the served bytes; a test asserts both.
2. **No underscore-prefixed Formspree field is used.** Formspree consumes `_subject`, `_gotcha`
   and friends as directives instead of forwarding them, and a `_gotcha` honeypot answers 200
   for a submission it discards, which would show "Message Sent!" for a lead that vanished.

## Delivery

Unchanged: the same `https://formspree.io/f/mwvrnjrb`, the same POST, the same `FormData`.
A 200 carrying an `{"errors":[...]}` body is now treated as a failure instead of a success,
because Formspree can answer 200 for a submission it drops.

## The follow-up fix (`dcbc17e`)

Adversarial verification against live production found one defect Round 3 itself introduced: a
**half typed Preferred Date** left the control in `badInput`, which fails constraint validation,
so the browser blocked the submit and `onSubmit` never fired. An optional field was silently
losing the lead. Typing `111426` also resolved to `0026-11-14` and reached the inbox as year 26.
Both are now cleared on blur and on invalid. The two regression specs fail against the build
that preceded the fix, which is how the defect was proven rather than assumed.

Two guards that could never fail were also fixed: the protected-page CTA check matched the
literal `href="/contact"` and so could not see a tagged CTA, and the Round 3 homepage guard read
`app/page.tsx`, an eleven line shell with zero anchors.

## Verification

25-agent independent verification against live production across 6 dimensions, every verdict
attacked by 3 adversarial refuters on distinct lenses, plus a completeness critic. 0 agent
errors. **Critic verdict: GO.** Plus the shipped suites run against production directly:
171 passed, 0 failed, desktop and iPhone viewport.

## Owner actions still open after Round 3

1. **Send one real inquiry** from `/contact?source=corporate` and confirm the email shows
   `source`, `inquiry_type`, `group_size` and `preferred_date` legibly. No automated check is
   allowed to submit the form, so this is the one unproven link in the chain.
2. **The homepage inquiry modal has a REQUIRED phone field.** `components/inquiry-modal.tsx`
   renders `<input id="inquiry-phone" required type="tel" name="phone">` labelled
   "Phone Number *". It is **pre-existing**, predates Round 1, and asks the visitor for their
   number rather than publishing the owner's, which is why the phone guards deliberately allow
   it. But it contradicts the "no phone field" instruction and is a conversion barrier on the
   highest-traffic page. Needs an owner decision, not a silent change.
3. **A no-JS or pre-hydration submit delivers nothing.** The form has no `action`, so
   submission is React-only; before hydration the browser does a GET back to `/contact` with
   the visitor's name and email in the URL. Pre-existing from Round 1. The fix is two
   attributes (`action` and `method`), but it lands the visitor on Formspree's own page, so it
   is an owner call.
4. **The homepage modal posts to the same endpoint with a different schema** (`interest`,
   different group-size buckets, no `source`) and still lacks the `hasErrors` guard. Two
   incompatible lead shapes reach one inbox.
5. **Neither select renders a dropdown arrow.** `globals.css` sets `appearance: none` with no
   caret, so the required Inquiry Type looks like a filled text box. Pre-existing CSS, but
   Round 3 is what put selects on this page. Fixing it is a deliberate CSS change.

---

# ROUND 2: conversion CTA cleanup (CLOSED, MERGED, LIVE)

**Date closed:** 2026-09-06
**Branch:** `seo/round2-contact-ctas` (merged, may be deleted)
**Merged as:** squash commit **`dbd5517`** on `main`
**Base:** `origin/main` at `55c5d04`
**PR:** [#100](https://github.com/lasvegasmahj-maker/lasvegasmahj/pull/100), **MERGED** 2026-09-06 04:53 UTC
**Working tree:** clean
**Production:** **LIVE.** `www.lasvegasmahj.com` serves `dbd5517` via Vercel project
`lasvegasmahj-6104s-projects / lasvegasmahj-h1iz` (GitHub auto-deploy on merge to `main`).
**CI on `main` at `dbd5517`:** green — 234 logic passed, 168 browser passed, lint clean.

## Production verification (DONE, 2026-09-06)

A 74-agent verification ran against live production across 13 dimensions, with every claim
judged by 3 independent refuters on distinct angles (does-it-reproduce, is-it-caused-by-round2,
is-it-harmful-and-in-scope), plus a completeness critic. **0 agent errors. All 13 dimensions
PASS. 20 claims raised, 18 refuted, 2 survived — and both survivors are pre-existing, neither
caused by Round 2. Critic verdict: GO.**

| Verified on live production | Result |
|---|---|
| All 12 quote/event CTAs reach `/contact` | PASS — 2/2/2/2/4 across the five pages, 0 homepage anchors left |
| CTA text, class and layout unchanged | PASS — anchor text byte-identical to the pre-merge baseline |
| 8 preserved booking CTAs still on `/#classes` | PASS — 3 lessons-LV, 2 Summerlin, 2 Henderson, 1 blog index |
| Homepage materially unchanged | PASS — title, H1, canonical identical; byte-for-byte equal after normalizing build fingerprints |
| `/mahjong-lessons-las-vegas` materially unchanged | PASS — same normalization proof |
| `/contact` | PASS — 200, one H1, real server-rendered form, self-canonical, indexable, no phone |
| No public phone, no `telephone` in schema | PASS — swept all 28 routes with a permissive multi-format regex |
| Things To Do | PASS — 410 Gone, no `Location`, absent from sitemap |
| Bachelorette URL | PASS — single-hop **301** to `/mahjong-parties-las-vegas`, destination 200, no bachelorette wording |
| Ask a Rule | PASS — `/ask` unchanged by Round 2 **and** verified answering live (`via: model`) |
| Broken links | PASS — 66 unique internal links, no unexpected non-200 |
| Redirect loops / 5xx | PASS — none; no chain longer than one hop |
| Accidental noindex on commercial pages | PASS — none; every commercial page self-canonical on www |
| Diff scope | PASS — every changed line in `app/` is an href value; 0 lines in `app/page.tsx`, `app/layout.tsx`, `app/mahjong-lessons-las-vegas/`, `components/` |

### The two surviving findings (both PRE-EXISTING, not caused by Round 2)

1. **`lasvegasmahj.vercel.app` serves an indexable, stale duplicate** of the commercial pages
   with `<meta name="robots" content="index, follow">` and no `X-Robots-Tag: noindex`. Its
   `/contact` 404s, so any crawler landing there sees the new funnel broken. Mitigated by
   correct cross-domain canonicals pointing at www. This is the sibling Vercel project, a
   known pre-existing condition — see the Vercel project mapping section below.
2. **`/schedule` loses the `max-image-preview:large` / `max-snippet:-1` grants.** Setting a
   page-level `robots` in Next.js metadata replaces the root object rather than merging, so
   the `googleBot` grants are dropped on that one route. Still fully indexable; cosmetic in
   SERP presentation only.

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

- **The preserved homepage-anchor links are 8, not 10.** An earlier draft of this handoff said
  10; the repo and live production both prove 8. The arithmetic, verified at `55c5d04` and at
  `dbd5517`: 16 `href="/#classes"` + 4 `href="/#private-events"` = 20 before; 12 changed
  (8 `/#classes` on the four corporate pages + all 4 `/#private-events` on the parties page);
  **8 `/#classes` remain.** Those 8 are 3 "Book a Lesson" / "Book Your Lesson" / "Book a Lesson"
  on `/mahjong-lessons-las-vegas`, 2 "Book a Lesson" / "Book Now" on `-summerlin`, 2 on
  `-henderson`, and 1 `btn-outline` "View Classes" on the blog index. They are booking CTAs and
  `#classes` is a real lessons destination whose own Book Now goes to `/schedule`.
  **Do not "finish" them.** Leaving them on `/#classes` is the correct, deliberate outcome.
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

## Production verification: DONE and PASSED

See the verification table at the top of this round 2 record. Merged `dbd5517` is live on
`www.lasvegasmahj.com` and every check passed. The pre-merge production baseline that the
comparison was made against was captured live before the merge and confirmed all 12 old hrefs
were still serving at that point.

## Round 2 is closed

Nothing about round 2 remains to do. Do not reopen it, do not re-audit the CTA counts, and do
not change the 8 preserved booking CTAs.

## Owner actions that verification could NOT cover

These are real and were deliberately left to the owner. None of them blocks round 2, and none
is a defect introduced by it.

1. ~~**Formspree deliverability is unproven.**~~ **RESOLVED before Round 3 opened.** The owner
   manually submitted the live `/contact` form and confirmed the email arrived. The endpoint is
   active and delivering. Round 3 did not change the endpoint, the method or the payload
   mechanism, but it did add fields, so the owner should confirm once more that the NEW fields
   render legibly in the email (see Round 3's owner actions above).
2. **Click one changed CTA in a real browser**, desktop and phone. Every automated check read
   raw HTML; no button was ever actually clicked.
3. **There is no analytics on production.** No GA4, GTM, Plausible, PostHog or Vercel Insights;
   `trackEvent` is a no-op because `window.gtag` / `dataLayer` / `fbq` are never defined. Round 2
   therefore has no baseline and no way to detect a *drop* in inquiries. Note the standing owner
   decision was "do not enable GA4 or GTM", so this is a decision to revisit, not a bug to fix.
4. **The contact form has no `action` attribute.** It is `<form>` with submission only in the
   React `onSubmit`. If that chunk fails to hydrate, the browser does a default GET back to
   `/contact` and the lead is lost silently. Pre-existing from round 1; round 2 widened its
   blast radius.
5. **Google Search Console was not consulted** for a before/after snapshot. It is already
   connected and is the cheapest safety net for the ranking risk this project exists to protect.

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

## Recommended next actions (NOT implemented, OWNER DECISION REQUIRED, do not start)

These are candidate round 3 work. **None of them has been started, and none should be started
until Shauna decides.** Adding fields to `/contact` in particular is explicitly an owner
decision, not an engineering call.

1. Add group size, event date and event type fields to `/contact`, plus a hidden source field
   so leads are triageable and attributable. Highest conversion value. Independently confirmed
   during round 2 production verification: all 12 changed hrefs are bare `/contact` with no
   `?source=`, so "Request a Corporate Quote" and "Book a Birthday Party" now arrive in the
   inbox indistinguishable from each other.
2. Give `.btn-primary` `display: inline-block` so long CTA labels stop breaking on phones.
3. Point the quote CTAs at `/contact#send` and give the form section that id, so mobile
   visitors land on the form.
4. Decide whether to keep the "no analytics" stance. Round 2's value is currently unmeasurable
   and a drop in inquiries would be invisible.
5. Deal with the indexable stale duplicate on `lasvegasmahj.vercel.app` (see surviving finding 1).

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
