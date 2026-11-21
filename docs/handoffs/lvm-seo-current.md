# Handoff: Las Vegas Mahjong competitive SEO

Rounds 1 through 8 and the contact consistency cleanup are all CLOSED, MERGED and LIVE
(Round 4/5 as PR #117, Round 6 as PR #120, Round 7 as PR #124 on 2026-10-05 01:09 UTC,
Round 8 as PR #125 on 2026-10-05 17:11 UTC; the CI guard fix as PR #127 on 2026-10-05
16:43 UTC). Their records are preserved below and must not be edited or
re-litigated. **The technical SEO audit of 2026-10-04 is MERGED** as PR #126 (branch
`seo/technical-audit-2026-10`, merged 2026-10-05 17:49 UTC; `main` then at `089a729`, its merge
commit). **Rounds 9, 10, 11 and 12, the sprint of 2026-11-13 and the four sections dated
2026-11-15 (owner approvals, consistency pass, final copy approvals, release candidate) are
MERGED, LIVE and VERIFIED:** pull request #130 (branch `seo/invisible-technical-fixes`) was
squash-merged into `main` as `0a72967` on 2026-11-16 (Las Vegas date), the owner promoted it to
`www` that evening, and the checks on the live site found no failures (section "RELEASE
2026-11-16", below). **The photo update of 2026-11-17 (section below) is MERGED, LIVE and
VERIFIED:** pull request #131 was squash-merged into `main` as `f36af78` on 2026-11-17, the owner
promoted it to `www` that evening, and the checks on the live site found no failures. **The
analytics setup of 2026-11-18 (next section) is MERGED:** the owner approved the finished release
on 2026-11-20, pull request #132 was squash-merged into `main` that day, and tracking goes live
when she promotes that build. Sentences
in those sections that say the branch or pull request #130 is
"local", "uncommitted", "not pushed", "not merged", "not live" or a draft, that PR #129 is not
merged, or that sitemap dates were not changed describe the day each section was written.
Proposals those sections mark "not merged" that no later section applied, such as the sprint's
performance proposals P1 and P2, were never part of the release and are not live. Full report:
`docs/handoffs/lvm-seo-technical-audit-2026-10-04.md`. The analysis-only "LVM SEO Gap
Audit" (Drive, LVM/Marketing, 2026-10-04) covers intent, cannibalization and internal-link
proposals; its A1 (red CI guard) shipped as PR #127, this audit carries the leagues robots and
share-image fixes, and its link proposals stay with the owner.

---

# ANALYTICS SETUP 2026-11-18: GA4 property, link-click fixes and privacy date (MERGED 2026-11-20)

**Owner's brief (2026-11-18):** resume analytics setup only. A GA4 property "Las Vegas Mahjong"
under the business Google account, with a web stream for `https://www.lasvegasmahj.com`, Pacific
time and US dollars; optional data sharing and Google signals off; 14-month retention; nothing a
visitor types ever sent; Bookwhen clicks counted as clicks, never as bookings; an accurate privacy
page; checks only with clearly labelled tests, never a real inquiry, signup or booking. Later that
day she deferred the custom dimensions and the key event (optional reporting setup, not activation
blockers) and asked for one finished release to approve. Nothing merges, deploys or activates
tracking before that approval. Bookwhen changes, research, photo work and unrelated tidy-ups stay
paused.

**Before:** on 2026-11-18 the live site loaded no Google tag, `lasvegasmahj-h1iz` held no
analytics setting (names checked, never values), `/privacy` said the site uses no analytics, and
no record we can reach showed a GA4 property.

**The property** (created by the owner on 2026-11-18): account and property "Las Vegas Mahjong",
Los Angeles time zone, US dollars, one web stream for `https://www.lasvegasmahj.com`. Its
Measurement ID goes into Vercel as `NEXT_PUBLIC_GA4_ID` (Production only) and is never typed into
the code.

| Setting | State | Confirmed by |
| --- | --- | --- |
| Enhanced measurement | Page views only, with page changes based on browser history events | Google's served tag for the ID, and the local counting run |
| Redaction | Email addresses, and the `mc_eid` query parameter | Google's served tag |
| Google signals | Off | Google's served tag |
| User-provided data capabilities | Off. It was on by default, with automatic detection of email addresses, phone numbers and street addresses; the owner switched it off and published the tag change | Google's served tag |
| Data retention | 14 months, event and user data | The owner (not visible in the tag) |
| Account data-sharing settings | Unticked at account creation, as instructed | Not independently checked |
| Property setting "User-provided data collection" | Not recorded | Cannot affect this setup: the tag no longer sends such data |
| Custom dimensions and the key event | Deferred by the owner | Steps in the measurement plan, section 2.B |

Google also created three key events of its own (`purchase`, `qualify_lead`,
`close_convert_lead`). The site never sends those events, so they stay at zero.

**Code** (this branch):

- Link clicks send the link's path, its host and a well-formed `?source=` tag, and no page:
  gtag.js takes a `page_path` parameter as its own page field, so it never arrived. GA4 records the
  page address with every event.
- `booking_link_click` fires only for links to this account's booking pages on Bookwhen; Bookwhen's
  privacy policy link on `/privacy` no longer counts. It is a click, never a booking.
- `/privacy`: `LAST_UPDATED` is "November 20, 2026" in every build, the day its visible text last changed
  (the Analytics text and the Ask a Rule log wording), and the page's date in `app/sitemap.ts` matches it. The Analytics text names what Google's tag sends
  with each page: the page address and title, the previous page, the IP address, browser and
  device details such as the browser, the operating system and their versions, the device model,
  the screen size and the language setting, and, when a visitor leaves a page, how long they spent
  on it. Sources: Google's "Automatically collected events"
  and "Data collection" help pages, the requests captured from Google's tag in the counting run,
  and Google's partner-sites policy for the location sentence. The text also says "our booking
  pages on Bookwhen" and adds Ask a Rule's turn number. The pull request lists every wording change
  as current and proposed text for the owner's approval.
- Tests: new `tests/analytics-ga4-setup.logic.spec.ts`; updated `tests/analytics-events.spec.ts`,
  `tests/privacy-page.logic.spec.ts`, `tests/seo-round12-owner-decisions.spec.ts` (an analytics-on
  check that runs only in a build with the ID) and `tests/seo-round12-owner-decisions.logic.spec.ts`.

**Checks (2026-11-18):**

- Typecheck clean. ESLint clean on every changed file. Logic tests: 592 passed and 7 skipped. One
  more fails on this machine only: `tests/ask-engine.logic.spec.ts`, "the Find My Mahj manifest
  still matches the sister repo when it is checked out", compares Ask files with the sister
  repository's local copy, touches nothing on this branch, and skips in CI.
- Browser tests for analytics, the privacy page and accessibility, desktop and phone, in a build
  without an ID: 48 passed, 8 skipped by design (they need an ID or a Bookwhen link).
- A local production build with the real ID, driven by a browser script kept outside this
  repository, with every Google request answered on the machine (nothing sent), against the tag
  Google serves for the property after every setting above: 26 scenario runs (13 scenarios on
  desktop and on iPhone), with identical counts on both.
  - One `page_view` per full page load and one per page change without a reload (13 for 3 loads
    and 10 such changes, back and forward included); the "See the Calendar" jump and the skip link
    add none.
  - Each site event arrived once per action: `contact_form_attempt`, `contact_submit` and
    `contact_form_success` for a mocked inquiry, on `/contact` and in the homepage pop-up;
    `contact_form_attempt` and `contact_form_error`, and no success, for two mocked failures;
    `newsletter_signup`; `schedule_link_click`; `contact_link_click`, with `source_slug` on a
    tagged button only; `booking_link_click`, while the Bookwhen privacy policy link sent
    nothing; `ask_starter_click`, `ask_question`, `ask_unverified` and `ask_reset`.
  - No other GA4 event appeared: no scroll, form, outbound click, site search, video or download
    event.
  - None of the 178 requests to Google (119 to Google Analytics, 59 copies to google.com), nor
    the 3 sent as pages closed and read from inside the page, carried a typed value, plain or
    coded, or a user-data parameter.
- A labelled run from the same build sent a small set of events to the property: desktop, 8
  scenarios, 33 requests, each with `_dbg=1` and `ep.test_run=lvm-ga4-setup-test-2026-11-18`, from
  a local host name. Google answered 204 to the page views, the mocked inquiry, the mocked
  newsletter signup and the Ask a Rule events. Link clicks go out while the page changes, when the
  browser no longer reports the reply. The contact form service and the newsletter were stand-ins
  and Bookwhen was blocked, so no inquiry, signup or booking happened.
- The same build's `/privacy` shows the Analytics section and "Last updated November 18, 2026",
  and every page carries the Google tag once, with the property's ID.
- **Rerun on 2026-11-20,** after the date moved to the release day: typecheck clean; ESLint clean
  on the changed files; logic tests 592 passed and 7 skipped, with the same local-only failure;
  the same browser tests in a build without an ID, desktop and phone: 48 passed, 8 skipped by
  design. A build with the ID, read with plain page requests only (no browser, so nothing reached
  Google): `/privacy` shows the Analytics section and "Last updated November 20, 2026" and no
  longer says the site uses no analytics service; the sitemap gives `/privacy` 2026-11-20; each of
  7 pages carries the Google tag once (a preload hint and one script entry) with the property's ID
  and one `config` call, and no Tag Manager or Meta Pixel.

**Activation (approved by the owner on 2026-11-20, with the privacy wording as proposed):**

1. Done 2026-11-20: the owner added `NEXT_PUBLIC_GA4_ID` in `lasvegasmahj-h1iz`, Production only,
   signed in as the team owner. A read-only check through Vercel's API found one such variable,
   Production only, no Tag Manager or Meta Pixel variable, and no analytics variable on the
   sibling project; that token cannot read the value, so the live pages confirm it.
2. Done 2026-11-20: pull request #132 merged into `main`. Automatic domain assignment is off, so
   Vercel holds the production build as Staged.
3. She presses Promote.
4. Live checks: the pages load the Google tag once, with the ID; `/privacy` shows the Analytics
   section and the new date; a short labelled check sends page views and link clicks only. Only
   then is tracking called live.

The privacy page's date is the day its visible text last changed, which is the day the owner
presses Promote, Las Vegas time: "November 20, 2026" in `app/privacy/page.tsx` (`LAST_UPDATED`)
and `tests/seo-round12-owner-decisions.spec.ts`, and "2026-11-20" in `app/sitemap.ts`, with both
pinned in `tests/privacy-page.logic.spec.ts`. A release that changes the page's text on a later
day changes those four files to that day, reruns the checks, and promotes that build.

---

# PHOTO UPDATE 2026-11-17: leagues photo and FOX5 card picture (MERGED, LIVE AND VERIFIED)

**Source:** the owner chose these photos from a local preview kept outside this repository. On
2026-11-16 she chose a studio photo with no people for the leagues page, asked that its room not
be named and that nothing call it a league, and asked for new pictures for the leagues page's
share image and for one FOX5 card. On 2026-11-17 she approved the previews, confirmed that the
leagues play in the room shown, approved the final wording of the photo's description, and asked
for this update with its checks. Later that day she approved the merge, and that evening she
promoted the release ("Release", below).

**What changes:**
1. Leagues page (`app/mahjong-leagues-las-vegas/page.tsx`): the studio photo
   `TABLES_SET_FOR_PLAY` (`public/studio-tables-set-for-play.jpg`) sits under the two buttons and
   above the league list, shown whole in its 4:3 shape at up to 760 pixels wide. It loads first
   (`priority`, `fetchPriority="high"`) because a laptop shows it on the first screen. Its
   description says only what is in frame and names no room, league or event, and there is no
   caption. The page's share image is the same photo, so the page and its link preview match.
2. `lib/studio-photos.ts`: `TABLES_SET_FOR_PLAY` joins the owner-identified photos, with no room
   claim. The file is a 2000 by 1500 copy of her original, made upright with sharp and carrying
   no metadata, so no location.
3. The FOX5 card "American Mahjong Classes NOW being taught at Las Vegas Mahjong"
   (`lib/studio-media.ts`) shows `LESSON_TABLE`, a studio table set for a lesson. Its link,
   headline and date are unchanged, and so is the other card. Neither the homepage nor the
   Studio page shows `LESSON_TABLE` in its own content, so no card repeats a photo on its page
   (the rule in `tests/press.logic.spec.ts`).
4. Every studio photo file in `public/` is listed in `lib/studio-photos.ts`, and a new test
   checks it. The owner's photo selection rules are recorded privately, outside this repository.
5. Sitemap: the leagues page carries 2026-11-17, the day its main photo changed. The homepage
   and the Studio page keep their dates. Item 4 of the release candidate section records her
   rule: each date is the day that page's visible content last changed. That release counted
   changes to visible wording or a main photo, and a new picture on a press card is neither. On
   2026-11-18 she asked to keep the sitemap dates as agreed, so the leagues page keeps
   2026-11-17 and the homepage and the Studio page keep 2026-11-15.
6. Tests: `tests/owner-approvals-2026-11-17.logic.spec.ts` pins the photo's place, its approved
   description, the exact file, the share image, the FOX5 card's picture, link, headline and
   date, the other card, the studio photo list and the sitemap date.
   `tests/owner-approvals-2026-11-17.spec.ts` checks the rendered pages at desktop and phone
   sizes: the photo's position, early loading and shape, no sideways scroll (also at 320
   pixels), the share image and its file, and both FOX5 cards on the homepage and the Studio
   page. `tests/seo-round9-share-schema.logic.spec.ts` and the first-screen image list in
   `tests/seo-technical-audit.logic.spec.ts` name the new photo.

**Not in this update:** the other photo placements previewed for the owner (the private
lessons, Summerlin and Henderson pages) still wait for her decisions, and any further photo
decisions are recorded privately, outside this repository.

**Optional code tidy-ups, nothing a visitor sees (left alone at the owner's request of
2026-11-18):** Next 16 marks the `priority` image prop as deprecated in favor of `preload`; it
still works the same way. All six first-screen photos use `priority` (the leagues photo follows
that pattern), so if they move, they move together in one separate, checked change. The
reviewers also suggested a closer `sizes` value for the leagues photo,
`(max-width: 824px) calc(100vw - 4rem), 760px`. Do not start either without her word.

**Checks:** typecheck, the logic and browser tests, the lint check and the Technical and Brand
gate ran on the exact tree before each push and passed; the results are in the description of
pull request #131.

**Release:**
- Merge: before the merge, all six checks on the pull request's head commit `46bd4e6` had
  passed (the three GitHub Actions jobs and the three Vercel checks). It was squash-merged on
  2026-11-17 at 21:48 UTC (1:48 pm in Las Vegas) as `f36af78` on `main`, with a guard that its
  head was still `46bd4e6`. The tree of `f36af78` is the reviewed tree (`cd704dd`), and CI on
  `main` passed all three jobs for it.
- Production: on `lasvegasmahj-h1iz` the build of `f36af78` waited unassigned while `www` kept
  serving the 2026-11-16 deployment. The owner promoted it at about 01:19 UTC on 2026-11-18
  (5:19 pm on 2026-11-17 in Las Vegas), and `www.lasvegasmahj.com` has served deployment
  `dpl_7B5ghJsTgj77g1f1u9yTh28vxR4B` since then. Automatic domain assignment on
  `lasvegasmahj-h1iz` is still off after this promotion (read from Vercel, read-only).
- Checks on the live site (2026-11-17 evening, read-only, nothing sent): a photo verification
  script passed all 32 of its checks. The leagues photo is the approved file, byte for byte. At
  desktop and iPhone 13 sizes it sits between the buttons and the league list with no sideways
  scroll. The page's link preview uses it with the approved description, and the leagues page's
  sitemap date is 2026-11-17. Both FOX5 cards on the homepage and the Studio page show the
  expected pictures and keep their links. All 34 sitemap pages answer 200 from the new
  deployment. The pages opened in the browser logged no script error. The 49 checks of the
  2026-11-16 release script passed again against the new deployment.

---

# RELEASE 2026-11-16: merged, live and verified (CLOSED)

**Source:** on 2026-11-16 Shauna approved releasing the reviewed commit `f18f104`: confirm the
final checks, merge pull request #130, help her promote the release in the Vercel project
`lasvegasmahj-h1iz`, and verify the live site. Once she had promoted it, she asked for the
post-release checks and one clearly labelled contact-form test. Research, analytics, Bookwhen
and all other changes stayed paused, by her instruction.

**Merge:**
- Before the merge, all six checks on the pull request's head commit `f18f104` had passed: the
  three GitHub Actions jobs (typecheck, build and logic tests; browser tests on desktop and
  phone; lint) and the three Vercel checks. That commit's tree had passed the Technical and
  Brand gate before it was pushed.
- The pull request was squash-merged on 2026-11-17 at 02:31 UTC (6:31 pm on 2026-11-16 in Las
  Vegas) as `0a72967` on `main`, with a guard that its head was still `f18f104`. The tree of
  `0a72967` is the tree of `f18f104` (`bdece12`), so `main` holds exactly the reviewed release.
- CI on `main` passed all three jobs for `0a72967`.

**Production:**
- The merge started a production build of `0a72967` in both Vercel projects. On
  `lasvegasmahj-h1iz`, where automatic domain assignment is off, the new build waited
  unassigned while `www` kept serving the deployment of 2026-10-05. The owner promoted it in
  Vercel with the team's login at about 02:48 UTC (6:48 pm in Las Vegas), and `www` switched
  within seconds. `www.lasvegasmahj.com` served deployment `dpl_2VxVqLmL4g8MPGH9pnYbj4WM7Kvt`
  from then until the photo update was promoted on 2026-11-17 (section above).
- Automatic domain assignment on `lasvegasmahj-h1iz` is still off after the promotion (read
  from Vercel, read-only, on 2026-11-16). So each later merge to `main` builds a production
  deployment that waits until the owner promotes it. The same-team project `lasvegasmahj`
  assigns automatically and published `0a72967` at its own `vercel.app` address at the merge.

**Checks on the live site (2026-11-16 evening; all read-only except the one test message):**
- The release checklist from the release-support lane (kept outside this repository)
  recognized the new release: 37 pass, 0 fail, 3 to look at. The three are Bookwhen schedule
  items, listed under the open items below.
- A verification script (plain page requests, plus Chromium at desktop size and at iPhone 13
  size, with requests to the form service, the newsletter and Ask a Rule blocked) passed all 49
  of its checks. All 34 sitemap pages answer 200 from the new deployment and name a `www`
  canonical. No page carries the owner's phone number or a `telephone` field. The homepage
  pop-up's intro line and the four lesson-card links work as approved. The contact form names
  Formspree as its `action` and carries the phone rule until its script loads. The schedule
  shows the Friendsgiving listing and the calendar section the lesson cards open. The privacy
  page is live. The old backup page and the four retired photos answer 404. `robots.txt` names
  the sitemap, the HSTS and `nosniff` headers are present, and the pages opened in the browser
  logged no script error.
- A crawl of the 34 sitemap pages checked 50 links and 267 files with no failure.
  `lasvegasmahj.com` redirects to `www`. The search and share titles of all 34 pages are the
  ones the release candidate was checked with, and none repeats the brand. On the 23 pages with
  FAQ structured data, all 143 questions and answers match the visible page.
- The early contact path on the real service (remaining step 2 of the release candidate): one
  clearly labelled test message, which the owner asked for, was sent from the live contact page
  with the page's script held back, so the browser sent the form by itself. The visitor landed
  straight on Formspree's own page, "Thanks! The form was submitted successfully.", and the
  message reached the owner's inbox within seconds with every field and the source "General
  (nav, footer or direct)". The Formspree account's settings were not read, so whether a visitor
  can be shown a robot check first is not known (open item below). No other message was sent:
  the loaded form and the pop-up were checked with nothing sent.

**The release candidate's remaining steps:** steps 1 and 4 are done (above). Step 2 is half
done: the test message went from the live site, but its first part, reading the spam-protection
setting in the Formspree account, is still open. Step 3 was not done: she approved the release
as reviewed, so the sitemap keeps the dates recorded in item 4 of the release candidate section,
and the privacy page still says "Last updated November 13, 2026". Step 5 stands: analytics stays
off until a GA4 Measurement ID is set in Vercel and event delivery is verified; the release
checklist confirmed that no page loads an analytics tag.

**Open after the release (the owner's decisions; on 2026-11-16 she paused further site changes
and deployments):**
- From the release checklist, all on pages fed by Bookwhen: one session dated 2026-11-16 still
  showed on the site with its Book link after Bookwhen had stopped listing it (the link still
  opened); `/schedule` still shows Bookwhen's "Drop in and play" wording; and the leagues page
  still repeats the Thursday league sentence. The two wording items change only after the
  listings are edited in Bookwhen.
- Formspree spam protection (the open half of step 2): the contact form has no spam trap of its
  own (Round 3's rule against underscore fields), so its protection is whatever is switched on in
  the Formspree account. Nobody has read those settings. Checking them needs her Formspree login
  and changes nothing on the site.
- Dates: moving the sitemap dates and the privacy page's "Last updated" line to the release date
  is optional and would be its own checked update (step 3).
- Automatic domain assignment stays off, so every release waits for her Promote. Keeping it off
  or turning it back on is her call.
- `CLAUDE.md` still says that Vercel deploys a push to `main` straight to `www`. Until the owner
  approves correcting it, follow the Vercel mapping below: `www` changes only after her Promote,
  so smoke-check `www` after the Promote, not 90 seconds after the merge.
- The open items in the release candidate section below still stand, among them the tap cue
  for the lesson cards on phones and the invisible fixes queued for the next checked update.
- Photo placements: the leagues page's photo went live with the photo update of 2026-11-17
  (section above). The private lessons, Summerlin and Henderson previews, prepared outside this
  repository, still wait for her decisions; none of them is installed.
- This section changed documents only. It reached `main` with pull request #131, the photo
  update above.

---

# RELEASE CANDIDATE 2026-11-15: pull request #130 into main (MERGED AND LIVE 2026-11-16)

**Source:** Shauna authorized these steps on 2026-11-15, after the final readiness summary: apply
one more Learn Mahjong sentence; check PR #129's scope and checks again and, if unchanged, merge
it; bring `main` into this branch without rewriting history; prepare the commit; run the required
checks and the Technical and Brand gate on the complete release candidate, documents included;
then commit, push this branch only and open a draft pull request into `main`. She did not
authorize merging that pull request or any production release: both need her separate approval.
This section's steps replace the release steps in the section below.

**What changed in this step:**
1. Learn Mahjong (`app/learn-mahjong/page.tsx`), the NMJL card paragraph: "It looks intimidating
   at first, but within one lesson, most students are reading it confidently." is now her
   approved sentence, "It looks intimidating at first, but it gets easier with practice." The
   one-lesson guard (`tests/seo-round6-owner-wording.logic.spec.ts`) now fails on "within one
   lesson" or "reading it confidently" on this page and pins the new sentence, and a browser test
   (`tests/owner-approvals-2026-11-15.spec.ts`) checks both approved sentences on the rendered
   page. The two softer lines in the page's steps are unchanged and still hers to decide (owner
   items, below).
2. PR #129 ("Pin browser test job to Ubuntu 24.04") is merged. Before merging it was checked
   again: still one commit (`3da383e`), one file (`.github/workflows/ci.yml`) and one line (the
   browser job's `runs-on`, from `ubuntu-latest` to `ubuntu-24.04`), with all three of the
   repository's checks passing. It was squash-merged like earlier pull requests, as `2d27d0e`
   (2026-11-16 01:47 UTC). The CI run on `main` for that commit passed all three jobs: the
   browser job passes on `main` again, where it had failed since 2026-11-14.
3. `main` is merged into this branch as merge commit `5bf1a1e`, with no conflicts and no history
   rewrite. It brings two changes: the Honey Salt Friendsgiving Mahjong Social in
   `lib/partner-events.ts` (#128) and the CI line above (#129). All 109 changed or new files in
   the working copy were byte-identical before and after the merge.
4. Sitemap dates (`app/sitemap.ts`), by her instruction: no date is reset because the branch is
   pushed; each date is the day that page's visible content last changed; and a release-date
   adjustment, if one is needed, is a separately checked update before the production merge. The
   evidence is a comparison of what a visitor sees on every page between the build as it stood
   at the end of the sprint (2026-11-13) and this release candidate.
   - 17 pages whose visible wording or main photo changed under her approvals of 2026-11-15
     carry 2026-11-15: `/`, `/studio`, `/schedule`, `/mahjong-lessons-las-vegas`,
     `/mahjong-parties-las-vegas`, `/play-mahjong-las-vegas`, `/mahjong-open-play-las-vegas`,
     `/mahjong-corporate-las-vegas`, `/corporate-team-building-las-vegas`,
     `/conference-activities-las-vegas`, `/convention-activities-las-vegas`,
     `/corporate-event-activities-las-vegas`, `/las-vegas-meeting-planner-activities`,
     `/trade-show-booth-activities-las-vegas`, `/incentive-group-activities-las-vegas`,
     `/mahjong-lessons-henderson` and `/learn-mahjong`. Seven of them still carried their October
     dates and ten carried 2026-11-12 or 2026-11-13.
   - 7 pages whose visible content has not changed since the sprint keep 2026-11-13:
     `/private-mahjong-lessons-las-vegas`, `/about` (since then only its search title changed
     and two photos were replaced by retouched or sharper copies of the same pictures),
     `/privacy`, `/mahjong-lessons-summerlin`, `/mahjong-sets-guide`, `/rules` and
     `/rules/calling-tiles`.
   - 10 pages whose main content this branch does not change keep their production dates (the
     same ten as in the section below).

   The privacy page's "Last updated November 13, 2026" line is unchanged for the same reason:
   its text last changed that day. The release-day helper
   (`~/Projects/.lvm-approvals-2026-11-15/release/set-sitemap-dates.mjs`) still applies if she
   wants the go-live date on the 24 changed pages.
5. Documents: this section, the owner guide and corrections in the measurement plan. Section
   headings below that said "not pushed" now say "not merged". Before this first push, passages
   in the sections below, and a few test comments and titles, were reworded to describe the
   current files only, because the repository is public. The specifics they held are recorded
   privately, outside this repository (`~/Projects/.lvm-approvals-2026-11-15/private-notes/`).
6. Contact form (`components/contact-form.tsx`), by her instruction of 2026-11-15 after the
   first push: a message sent before the page's script has loaded must still arrive, through
   the existing Formspree service. The form now carries Formspree's address as its `action`,
   so the browser's own submit goes straight there. Before this change that early submit was
   posted to `/contact` itself, which the live host answers with "405 Method Not Allowed" and
   an empty page, so the message was lost. Once the script has loaded nothing changes:
   `handleSubmit` still sends the message and the visitor stays on the page.
   - On the early path the visitor leaves this site for Formspree's own page. That should be
     its confirmation page; if a spam check is switched on in the Formspree account, a "not a
     robot" page comes first. Neither has been seen on the live service yet, because every
     test intercepts the post (remaining steps, below). The message reports general traffic,
     because the page as served cannot read `?source=` yet, and no analytics event is sent.
   - The phone field carries the scripted rule (ten to fifteen digits) as a `pattern`, but
     only until the script has loaded. So the early path cannot send a blank or unusable
     number, and the loaded form checks a number exactly as before, with the site's own
     message. The pattern counts digits and never matches a format.
   - No underscore field was added. Round 3's rule stands: Formspree reads such fields as
     directives and can discard a message while answering as if it had arrived. So the form
     has no spam trap of its own, and its address can now be read in the page as served. The
     protection is whatever is switched on in the Formspree account.
   - Tests: `tests/round3-contact.spec.ts` sends the form with scripts off (intercepted, so
     nothing reaches Formspree) and checks the address, the fields and the phone rule;
     `tests/contact-consistency.spec.ts` checks that the loaded form carries no pattern and
     still shows the site's own message; `tests/round3-contact.logic.spec.ts`,
     `tests/contact-consistency.logic.spec.ts` and `tests/seo-round10-visible.logic.spec.ts`
     pin the form tag, the single address and the one pattern.
7. Confirmations after a sent form, by her instruction of 2026-11-15 after she reviewed the
   preview: what a visitor reads once a form is sent speaks as the team. The shared default in
   `components/contact-form.tsx`, which `/contact` shows, was "Thanks for reaching out. I'll be
   in touch soon!" and is now her sentence, "Thanks for reaching out. We'll be in touch soon!"
   The homepage pop-up (`components/inquiry-modal.tsx`) passes its own two lines: "You're on my
   radar!" is now "You're on our radar!", and "Thanks for reaching out. I'll be in touch soon.
   Get ready to play!" is now "Thanks for reaching out. We'll be in touch soon. Get ready to
   play!" No other confirmation spoke as "I": the newsletter confirmations
   (`lib/use-mailchimp.ts`) never did. Her first-person biography and her first-person page
   copy are unchanged.
   - The pop-up's intro line followed on 2026-11-16, by her next instruction. It stays on
     screen above the confirmation once a message is sent, so the pop-up would otherwise have
     said "I'll" and "We'll" together. "Fill out the form below and I'll be in touch soon!" is
     now "Fill out the form below and we'll be in touch soon!" The rest of the line ("Prefer
     email? Write to hello@lasvegasmahj.com.") and everything else in the pop-up are
     unchanged.
   - Tests: `tests/owner-approvals-2026-11-15.logic.spec.ts` pins the three confirmation lines
     and the intro line, and fails if a confirmation says "I", "my" or "me" or the pop-up
     says "I'll"; `tests/owner-approvals-2026-11-15.spec.ts` sends both forms (intercepted)
     and reads the intro and the confirmation on the page.
8. Lessons page (`app/mahjong-lessons-las-vegas/page.tsx`), "What You'll Learn", by the same
   instruction: each of the four cards is now one link (`a.lesson-card`). MAHJ101, MAHJ102 and
   MAHJ103 lead to `/schedule#calendar`, and Private Lessons leads to
   `/private-mahjong-lessons-las-vegas`.
   - Why the three group cards share one address: she asked for each to lead to its own
     current class dates where the existing booking functionality supports it, and otherwise
     to the schedule calendar, with no invented booking address and no event that expires.
     The schedule page has one calendar and no address per class level, and a class's own
     Bookwhen address ends with that class. So all three use the calendar address that the
     page's other schedule links already use.
   - The words, their order and the layout are unchanged. Measured before and after on a
     desktop and a phone screen, the four cards and the 32 elements inside them keep the same
     position, size, text and style. The card's look moved from inline styles to
     `.lesson-card` in `app/globals.css`, which adds a brighter background, a green border and
     a 2px lift on hover, a white 3px outline for keyboard focus, and no movement for visitors
     who ask for reduced motion. No card holds another link, button or field.
   - This is a surgical edit on a protected page: no title, heading, paragraph or structured
     data changed, and the page's sitemap date was already 2026-11-15. Once analytics is on, a
     click on a group card counts as `schedule_link_click` from this page, like any other link
     to the schedule; the Private Lessons card sends no event.
   - Tests: `tests/owner-approvals-2026-11-15.logic.spec.ts` pins the four addresses and the
     hover and focus rules, and fails on a Bookwhen address in the page;
     `tests/owner-approvals-2026-11-15.spec.ts` checks each card on desktop and phone (address,
     unchanged title, price and five bullets, nothing interactive inside, no sideways scroll),
     reaches a card with Tab, checks the outline, follows it with Enter, follows the fourth
     with a press on its text, and on desktop checks the hover change.
     `tests/seo-round1.logic.spec.ts` now counts three links to the private lessons page.

**Vercel: access was lost after 2026-10-05 and restored on 2026-11-15.**
- What happened: on `main`'s own line of commits, all 127 from 2026-05-23 through 2026-10-05
  have a Vercel check on GitHub; the commits of 2026-11-14 (#128) and 2026-11-15 (#129), Las
  Vegas dates, ran GitHub Actions but have none. The Vercel app on the repository owner's
  GitHub account was limited to selected repositories, without this one.
- Restored on the evening of 2026-11-15, with the owner's approval and for a preview only: the
  app reaches this repository again. Restoring it deployed nothing and did not replay the
  missed commits.
- State read from Vercel on 2026-11-15, after the restore (read-only; the record is kept
  outside this repository): production is still the deployment of `089a729` from 2026-10-05.
  On the project that serves `www` (`lasvegasmahj-h1iz`) automatic domain assignment is
  switched off, by the owner's choice. With it off, Vercel's documented behavior is that a
  production build from `main` waits, unassigned, until someone with the team's login
  promotes it in Vercel; this project has not built one since, so that is not yet observed
  here. The same-team project `lasvegasmahj` still assigns automatically, so a push to `main`
  updates its own `vercel.app` address at once.
- Effect today: the Friendsgiving listing, merged into `main` on 2026-11-14, is still not on
  the live site, and the event is on 2026-11-18. Earlier notes that said it had gone live were
  wrong. `main` does not contain this branch, so publishing `main` publishes that listing and
  the CI line, nothing else. It needs a deployment of `main` (none exists yet for its current
  commit) and then the promotion, and it is the owner's separate decision.
- Previews: each push to this branch builds a preview in both projects, and the link is in
  the pull request. Previews need a Vercel login. Do not use a CLI deploy (see "Vercel project
  mapping" below).

**Commit scope:** the first commit of this step, `fd5522a`, holds everything the branch then
changed against `main`, 116 files: 82 changed, 29 new (27 of them uncommitted until then, 2 from
commit `dc1d628`) and 5 removed. The second commit, `c630369`, changes the contact form, its
tests and these documents. The third, `c931f5a`, carries items 7 and 8 with their tests and
brings this section's Vercel paragraphs up to date. A fourth changes the pop-up's intro line
(item 7); the pull request shows the current totals. The scope is the site, the
tests, the gate file, `CLAUDE.md` and these documents (the build needs
`components/track-clicks.tsx`, `app/privacy/` and the two icon files). The five removed files
are the old backup page and four retired photos. Not in the commit and not in the repository: the
private photo originals, the approval screenshots and galleries, test and build output, and
`.env.local`, which git ignores.

**Checks and gate for this release candidate:** they run on exactly the tree that is committed,
after this section was written, so their results are recorded in the description of draft pull
request #130, not here. Nothing is pushed unless they pass. The first commit of this step,
`fd5522a`, was pushed on 2026-11-15 after they passed. The second, `c630369`, carries the
contact form change (item 6), corrects small points in these documents and widens one test,
and was pushed the same evening under the same checks, and so was the third, `c931f5a` (items
7 and 8). The fourth (the pop-up's intro line) is pushed only if the same checks and the gate
pass on it.

**Open items for the owner:** the list in the section below stands, with these changes.
- Item 8: the card sentence is approved and applied (item 1 above). Still open on that page:
  step 4 ("once you know the basics, join Social Open Play") and step 1 ("in 2-3 lessons"). The
  gate's Brand reviewer found three more lines of the same kind, all unchanged in this branch
  and hers to keep or reword: `app/rules/page.tsx` line 194 ("Most rule confusion disappears
  after one lesson."), the homepage's `components/what-to-expect.tsx` line 24 ("By the end,
  you'll know the game, ...") and the lessons page's MAHJ101 card, line 135 ("Tips for your
  first open play event").
- Item 2, one more line for the same decision: the sitewide search description and the share
  description (`app/layout.tsx`, lines 36 and 41) still say "across Las Vegas, Summerlin, and
  Henderson" and "from Summerlin to Henderson", while the Summerlin and Henderson pages now say
  the studio is the one location.
- Item 6, two updates. The contact form's early submit is settled and fixed (item 6 of "What
  changed in this step", above); what remains of that follow-up is the form's spam protection,
  which is Formspree's own and unchanged here. And the separate read-only check of the Vercel
  settings found no analytics, Tag Manager or Pixel ID among the settings of the project that
  serves the site (2026-11-15), which matches the live pages.
- New: the Friendsgiving listing (`lib/partner-events.ts`, from `main`, unchanged here) says
  "guests should already know the basics", which is looser than her open play wording. It is
  her approved event text, already merged into `main`, so it was not edited.
- Vercel: access is restored (above). Hers to decide: when to publish `main`'s Friendsgiving
  listing, which is not live, and whether automatic domain assignment goes back on after this
  release.
- New, the lesson cards on a phone: a phone has no hover, so nothing shows that a card can be
  tapped. Proposed, not built: a short cue line at the bottom of each card, like the cue on
  the studio room cards.
- For the next checked update, from the gate, with nothing a visitor sees: hide the check
  marks inside the lesson cards from screen readers (`aria-hidden`), and shorten the comment
  above `.lesson-card` in `app/globals.css` and the one above the cards in the lessons page.
- For a later session: first-person page copy elsewhere is hers and was not touched (the
  instructor sections, the private lessons page, and single lines on the studio, Learn
  Mahjong, rules and sets guide pages). Do not "fix" it to match the confirmations.

**Remaining steps before production (as written before the release; what happened to each is in
"RELEASE 2026-11-16" above):**
1. The owner reviews the draft pull request and the preview (the link is in the pull request;
   it needs a Vercel login). On a preview the contact form sends to the real form service, so
   a test message there reaches the inbox.
2. Check the early contact form path on the real service: look at the form's spam protection
   setting in the Formspree account, then send one message from a preview with scripts turned
   off. Record that it arrived and what the visitor saw.
3. If the release date calls for it, set the go-live date on the 24 changed pages and on the
   privacy page's "Last updated" line as a separate update, with its own checks and gate run.
4. Only on her approval: mark the pull request ready and merge it. While automatic domain
   assignment is off, the production build then has to be promoted in Vercel with the team's
   login. Confirm that `www` serves the new deployment, and smoke-check the key pages.
5. After release: analytics stays off until a GA4 Measurement ID is set in Vercel and event
   delivery is verified. Before that, confirm Vercel has no Tag Manager or Meta Pixel setting
   (owner item 6 below).

---

# FINAL COPY APPROVALS 2026-11-15: approved wording, titles and gate inputs (MERGED AND LIVE 2026-11-16)

**Source:** Shauna approved the final copy adjustments on 2026-11-15, after the consistency pass
below. They are applied in this working copy on top of that pass, uncommitted, on `dc1d628`;
nothing is committed, pushed, merged or deployed. Exact before and after text for items 1 and 2:
the two `-before-after.json` files in `~/Projects/.lvm-approvals-2026-11-15/final-copy/`. This
section closes the consistency pass's "optional wording" item, the two titles Round 12 reworded
and Round 12's "We do not sell it" question. Her closeout instructions of the same day are
recorded here too (items 6 to 10). Its release steps replace the shorter release notes in the two
sections below.

**What changed (approved by Shauna, applied):**
1. Proposal A, all nine edits: eight take unconfirmed tournament wording off five corporate
   pages, and one replaces a homepage FAQ answer. Two of the eight are FAQ answers that feed
   their pages' FAQPage markup, so the markup follows the visible text. None of the eight
   corporate pages mentions a tournament in its own content or markup now (the shared footer
   still names tournaments at the studio; owner item 2).
   - Hub (`app/mahjong-corporate-las-vegas/page.tsx`): the FAQ "Do you do charity mahjong
     events?" (now "Charity mahjong events and cause-based gatherings can be built around your
     organization's goals.") and the "Charity and Fundraiser Events" card ("... mahjong
     fundraisers and awareness events.").
   - Team building: the "Play, Connect, and Compete" card ("The room comes alive once people are
     playing, whether your team likes a little competition or keeps it relaxed and social.").
   - Meeting planner: the "Team or department breakout" format ("... a longer session works as
     team building.").
   - Corporate events: the "Sales meetings" card (its tournament sentence is cut), the "Charity
     and fundraiser events" card ("A mahjong fundraiser or awareness event built around your
     organization's goals.") and the FAQ "Can the activity be competitive?" ("... others like a
     little competition. Tell us which your group prefers and we will plan the session around
     it.").
   - Incentive: the "Closing night" card ("A hosted mahjong evening as part of the farewell
     event.").
   - Homepage FAQ (`components/faq.tsx`), "How long does it take to learn?": the answer is now
     "Start with MAHJ101 and build your skills through practice and our follow-on classes." It
     was "Most people feel comfortable playing after just one 2-3 hour lesson. ..." The homepage
     publishes no FAQ markup.
2. Proposal B, both edits. Lessons page (`app/mahjong-lessons-las-vegas/page.tsx`, protected, one
   sentence): the opening paragraph ends with the same MAHJ101 sentence instead of "Most students
   are playing confidently after just one session." Henderson
   (`app/mahjong-lessons-henderson/page.tsx`): the open play sentence uses her requirement,
   "Henderson residents who already know American Mahjong and are comfortable playing
   independently can also join open play at our studio inside Lucky Hare." (it ended "to keep
   practicing after their first lesson").
3. About search title: "About Shauna | Las Vegas Mahjong". In code the page title is "About
   Shauna" (`app/about/page.tsx`) and the layout's shared template (`app/layout.tsx`,
   `%s | Las Vegas Mahjong`) adds the brand, so the brand appears once. It replaces the interim
   "Shauna | 18 Years at the Mahjong Table | Las Vegas Mahjong" (Round 12). The About share title
   was already "About Shauna | Las Vegas Mahjong" (Round 9) and is unchanged.
4. Lessons share title: "Mahjong Lessons Las Vegas | Beginner-Friendly Classes". The trailing
   " | Las Vegas Mahjong" (Round 12) is dropped; share titles do not use the template. The
   lessons search title "Mahjong Lessons in Las Vegas | Las Vegas Mahjong" is unchanged and still
   test-locked.
5. Privacy: Shauna confirmed that Las Vegas Mahjong does not sell customer information. The
   privacy page's sentence "We use what you send to reply to you. We do not sell it." stays as
   written; nothing was broadened into other privacy claims.

6. Learn Mahjong (`app/learn-mahjong/page.tsx`): the lessons paragraph ended "Most students are
   playing confidently after their first session." It now ends with her approved sentence,
   "Start with MAHJ101 and build your skills through practice and our follow-on classes." (her
   closeout instruction, 2026-11-15). The one-lesson guard test covers that sentence on this
   page. Three older lines on the page are unchanged, are live today and were not part of the
   instruction (owner item 8): "within one lesson, most students are reading it confidently"
   (the NMJL card paragraph; the guard test does not cover it), "in 2-3 lessons" (step 1) and
   "once you know the basics, join Social Open Play" (step 4).
7. Privacy, second confirmation: Shauna confirmed the website is marketed to adults and approved
   "This website does not target children under 13." It describes the website's audience; it is
   not a minimum age for lessons and must not become one. The sentence stays as written, a test
   pins it and fails on any age rule, and her confirmation is recorded as its source
   (`~/Projects/.lvm-seo-screens-2026-11-13/privacy-page-sources-2026-11-13.md`).
8. Lighter small pink labels: settled, not reopened. They match the gallery screenshots she
   approved: the label color rules are identical in the copy the gallery was made from and in
   this working copy (`--pink-light`, #ff4da6, on section labels, review names and the "Explore
   Lessons" cue), and in the gallery's before and after pictures that pink appears only in the
   "after" halves. The gate's design input now says so.
9. `index.html.bak` (the tracked backup of the old site, never served) is removed. Nothing
   depended on it: no code, configuration, CI step or script names it, and the one test that
   read it only scans every file's words. Private copies, outside the repository, with
   checksums: `~/Projects/.lvm-private-photo-originals-2026-11-15/index.html.bak` (the working
   version) and `index.html.bak.as-committed` (the version in git). Round 12 below cites the
   file as its source for original wording; that is now the private copy.
10. `CLAUDE.md`, Pricing: the five-pack is now described as a future offering that is not on
    sale in Bookwhen as of 2026-11-15 and must not be advertised; its $85 price stays recorded.
    Nothing else in `CLAUDE.md` changed (its Design System section still lists only `--pink`).

**Tests changed:** the three tests that pinned the old About title
(`tests/seo-round11-followups.logic.spec.ts`, `tests/seo-round9-links-titles.spec.ts`,
`tests/seo-round12-owner-decisions.spec.ts`) now expect the approved one. New guards in
`tests/owner-approvals-2026-11-15.*` and `tests/seo-round6-owner-wording.logic.spec.ts`: no
tournament wording on the corporate pages (the source of all eight; the rendered text and markup
of the five edited ones); the homepage FAQ sentence; no one-lesson promise in the homepage FAQ,
on the lessons page or on the Henderson page; the two approved titles, with the brand never
repeated in a search or share title on any sitemap page; the privacy sentence, with no wider
promise; the Learn Mahjong sentence; the children sentence, with no age rule.

**Pre-push gate inputs corrected** (`.claude/workflows/pre-push-gate.js`). The reviewer gate's
inputs were stale. Every check, every severity and the PASS or FAIL rule are unchanged. This
closes Round 11's note that the gate's pricing line would raise a false blocker.
- Checkout: it reviewed a fixed folder, the main checkout. It now reviews the checkout it is run
  from, or one named explicitly (`{ repo: "/absolute/path" }`).
- Diff: its instruction now covers the complete branch change: the diff against the merge base
  with `origin/main`, plus every untracked new file.
- Pricing: its input now matches the owner's rules: $60 per person for group lessons, group size
  4-8, lesson pages only; "contact for pricing" for private lessons, parties and corporate;
  Social Open Play $20 per session, read from `lib/pricing.ts`; the five-pack not shown until it
  is on sale in Bookwhen; the league season price rule.
- Design system: its input now includes the approved button pink (`--pink-button` #dd1d85, for
  button backgrounds) and names `--pink-light` for small pink text (the sprint's contrast
  change), so neither reads as off-system.
- Folder detection: when no checkout is named, the gate confirms the folder is a site checkout
  (the `package.json` name) and stops with a clear message otherwise.

**Verification and gate result:**
- Final build `cBTQgq7i6Hm-xg8AwkO4-` (no warnings), made after the closeout edits. Since the
  previous build (`xPO1orQ_m9q5vjlqfSkDr`) one site file changed, `app/learn-mahjong/page.tsx`;
  the other changes are the gate file, `CLAUDE.md`, test comments and assertions, and the
  removed backup file (`~/Projects/.lvm-approvals-2026-11-15/logs/source-at-build-p6.sha256`).
- Typecheck clean. Lint on the files changed in these passes: no new errors (the 6 existing
  link-rule errors on the lessons and Henderson pages are unchanged).
- Logic tests: 576 passed, 7 skipped, 1 failed: the known Find My Mahj drift check (skipped in
  CI).
- Browser tests, desktop and phone. On the final build, the 8 specs that read the Learn Mahjong
  and privacy pages, the owner approvals and the site regression set: 186 passed, 10 skipped, 0
  failed. On the previous build, the 25 specs that read the pages changed by the final copy:
  732 passed, 22 skipped, 0 failed. The full suite last ran on the consistency-pass build (748
  passed, 0 failed).
- Rendered titles on all 34 sitemap pages (final build): one title tag each; About renders
  "About Shauna | Las Vegas Mahjong"; the lessons share title renders "Mahjong Lessons Las
  Vegas | Beginner-Friendly Classes"; no search or share title carries the brand twice.
- FAQ markup (final build): 23 pages publish it; all 143 questions and answers match the visible
  text word for word; no tournament wording in the content or markup of any corporate page.
- Pre-push gate (the corrected script, on this worktree, against the merge base, new files
  included). Run 1: FAIL on one blocker, text not code: new test comments and handoff lines
  named two instructors beside a statement about certification, in a public repository. Run 2
  (after rewording the direct sentences): FAIL on the same class of blocker, because the two
  names were still in class-title examples beside the statement. Fix: no new document, test
  comment or gate line names an instructor other than Shauna, and the rule reads "the
  certification is Shauna's alone". Run 3 (after that fix): **PASS**, typecheck clean, 0
  blockers (Technical reviewer 3 warnings and 5 nits, Brand reviewer 6 warnings and 6 nits, all
  either resolved by the closeout items above or listed below). All three runs confirmed the
  site code, the approved edits word for word, the titles, the FAQ markup, pricing, the privacy
  wording and that the gate's checks, severities and PASS or FAIL rule are unchanged.
- Pre-push gate, run 4, on the final tree after the closeout edits (final build
  `cBTQgq7i6Hm-xg8AwkO4-`; `dc1d628` plus 114 uncommitted entries, against merge base `089a729`,
  all 27 new files included): **PASS**, typecheck clean, 0 blockers. Technical reviewer: 1
  warning and 7 nits. Brand reviewer: 1 warning and 8 nits. Both confirmed the approved children
  sentence word for word and that no page states a minimum age for lessons. The Brand reviewer
  confirmed pricing, no five-pack in the source or the built pages, no dash in any added line or
  built page, and that no added document, test or gate line names an instructor other than
  Shauna. The Technical reviewer found nothing that could break production or leak data. Every
  warning and nit is in the owner items or the release steps below; none changes a page without
  her. After run 4 only documents changed (this handoff, the owner guide and dated notes in the
  proposals document); no site, test or gate file changed. The gate must also PASS on the
  release tree before any push (release step 4).

**Deliberately not done:** sitemap dates were not changed (no speculative dates; they are set on
the actual release day, step 2 below); the wide share-image crop, the non-corporate tournament
wording and other optional content additions are deferred; git history is not rewritten; PR #129
is not merged; the five-pack stays off the site; analytics stays approved but NOT active.

**Open items for the owner (none blocks the local work; each is her decision):**
1. The repository is public, and its history keeps earlier versions of the files this release
   edits or removes. Her choice: accept that, make the repository private, or approve a history
   rewrite (never done without her say). The specifics, and the follow-ups that belong with a
   history rewrite, are recorded privately, outside this repository
   (`~/Projects/.lvm-approvals-2026-11-15/private-notes/`).
2. Tournament wording outside the corporate pages, left out of this closeout on her instruction:
   the charity cards on the parties page (`app/mahjong-parties-las-vegas/page.tsx`, line 44) and
   the homepage (`components/private-events.tsx`, line 23), the shared footer
   (`components/footer.tsx`, line 167, on every page), the homepage share description
   (`app/layout.tsx`, line 41) and the hidden event page (`components/event-page.tsx`, line
   467).
3. Homepage hero (`components/hero.tsx`, lines 25-27, protected page, unchanged): "... lessons,
   open play, leagues, and special events, with a warm welcome for every skill level. No
   experience needed. Beginners welcome!" still extends "no experience needed" to open play and
   leagues, against her open play rule. Proposed, not applied: end with "Beginner classes need
   no experience.", the sentence she approved for the search description.
4. Settled 2026-11-20 with the owner's approval: the Ask a Rule log record holds codes, ids and
   numbers only, and `/ask` and `/privacy` both say it never includes the words of a question.
5. Small wording and color notes from the gate, for a later pass: the homepage FAQ question "How
   long does it take to learn?" now has an answer with no time in it (retitle the question?); the
   lessons page says "$60 per lesson" on three tier cards and "$60 per person" elsewhere; "Mahj
   101" and "MAHJ101" are both in use; four older spots of small pink text still use `--pink`
   (about 3.5:1 on navy) and did not change in this branch: the review names on the lessons
   page, the weekday labels on the date cards of `/schedule` and `/play-mahjong-las-vegas`, and
   the shop card buttons (`.btn-card`); `CLAUDE.md`'s Design System list still names only
   `--pink` (with her OK, add `--pink-button` and `--pink-light` there, so a later session does
   not undo them).
6. Technical follow-ups from the gate, none blocking: `/privacy` says the site uses no analytics
   and sets no cookies unless `NEXT_PUBLIC_GA4_ID` is set, but `components/analytics.tsx` would
   also load Tag Manager (`NEXT_PUBLIC_GTM_ID`) or the Meta Pixel (`NEXT_PUBLIC_META_PIXEL_ID`)
   if either were ever set. The live site's code already reads all three settings, and on
   2026-11-15 its homepage, contact, schedule and Learn Mahjong pages loaded no analytics, Tag
   Manager or Pixel script and set no cookie, so the page's wording is true at release. The
   Vercel settings themselves could not be read from here: confirm there that neither exists at
   release and again before `NEXT_PUBLIC_GA4_ID` is set, and keep both unset until the privacy
   page describes them (a build-time guard is proposed, not added). A contact form sent before
   its script loads dropped the message when this was written (fixed on 2026-11-15: release
   candidate section, item 6), and the form's spam protection is unchanged here. The form's new `onInvalid` handler uses a React type marked deprecated
   (type only). The Ask page's `<main>` gets its skip-link target from a script, because the
   page is off-limits (one attribute would fix it, with her OK). Tidy-ups that can ride with the
   release-day edits, before the release-tree gate: delete the section comment above "Find Your
   Fit" on the lessons page (it says what, not why); derive the share image type in `lib/og.ts`
   from the file name, or test that every studio photo is a .jpg; run the no-age-rule test over
   the lesson and open play pages as well as `/privacy`.
7. Deferred on her instruction: the wide share-image crop (prepared, not installed) and cleanup
   of scratch folders in `~/Projects/.lvm-approvals-2026-11-15/`.
8. Learn Mahjong (`app/learn-mahjong/page.tsx`), raised by the gate's Brand reviewer in run 4.
   Three lines are live today and unchanged in this branch. They need her wording, current
   versus proposed; nothing was edited:
   - The NMJL card paragraph (line 90), a one-lesson promise: "It looks intimidating at first,
     but within one lesson, most students are reading it confidently." Proposed: "It looks
     intimidating at first, but it gets easier with practice." Approved by Shauna on 2026-11-15
     and applied; see the release candidate section above.
   - Step 4 (line 111), looser than her open play rule: "... once you know the basics, join
     Social Open Play at our Las Vegas studio." Proposed: "... once you know American Mahjong
     and are comfortable playing independently, join Social Open Play at our Las Vegas studio."
   - Step 1 (line 108): "Most students go from zero to playing without an instructor in 2-3
     lessons." No proposal; keep or reword.

   If she approves a change, add the page to the two guards in
   `tests/seo-round6-owner-wording.logic.spec.ts`: the one-lesson test and the list that keeps
   Mahj 101 from reading as enough for open play.

**Release steps as planned before the owner's authorization of 2026-11-15 (superseded by the
release candidate section above; kept as the record of that plan):**
1. First, with the owner's go, merge PR #129 ("Pin browser test job to Ubuntu 24.04"). Checked
   2026-11-15: open, not a draft, mergeable with a clean merge state, all three checks green; one
   commit (`3da383e`) changing one line of `.github/workflows/ci.yml`, the browser job's
   `runs-on`, from `ubuntu-latest` to `ubuntu-24.04`. The dependency: on `main` that job has
   failed since 2026-11-14 (run 43642859217, on #128) at
   `pnpm exec playwright install --with-deps chromium`, because `ubuntu-latest` is now Ubuntu
   26.04 and Playwright 1.60.0 does not support it, so the job stops before any spec runs. This
   branch does not touch `.github/`, so its PR gets the fix only from `main`: without #129 the
   PR would show the same red job and no browser spec would run in CI. Not merged here; do not
   skip or weaken that job.
2. On the release day, set the sitemap dates by the standing rule (technical audit, "Rules going
   forward"): a route whose visible content changed gets the go-live date; head-only,
   schema-only and layout-only CSS changes do not count. From the comparison with the live site
   on 2026-11-15, 24 pages get the release date: `/`, `/studio`, `/schedule`,
   `/mahjong-lessons-las-vegas`, `/private-mahjong-lessons-las-vegas`,
   `/mahjong-parties-las-vegas`, `/play-mahjong-las-vegas`, `/mahjong-open-play-las-vegas`,
   `/mahjong-corporate-las-vegas`, `/corporate-team-building-las-vegas`,
   `/conference-activities-las-vegas`, `/convention-activities-las-vegas`,
   `/corporate-event-activities-las-vegas`, `/las-vegas-meeting-planner-activities`,
   `/trade-show-booth-activities-las-vegas`, `/incentive-group-activities-las-vegas`, `/about`,
   `/privacy` (new), `/mahjong-lessons-summerlin`, `/mahjong-lessons-henderson`,
   `/learn-mahjong`, `/mahjong-sets-guide`, `/rules` and `/rules/calling-tiles`. Ten keep their
   production dates: `/mahjong-leagues-las-vegas` and `/contact` (2026-10-03), `/ask`
   (2026-08-26), and `/rules/charleston`, `/rules/dead-hands`, `/rules/etiquette`,
   `/rules/jokers`, `/rules/scoring`, `/rules/the-card` and `/rules/winning` (2026-08-29; seven
   are identical to the live site, and dead-hands, scoring and winning changed only a title or
   description). A helper applies exactly this, with a dry run first:
   `~/Projects/.lvm-approvals-2026-11-15/release/set-sitemap-dates.mjs` (give it the release
   date; add `--write` to apply). No date was set in this pass, and a test fails any sitemap date
   in the future. Same day, carried over from Round 12: the privacy page's "Last updated November
   13, 2026" line goes to the go-live date, together with its pin in
   `tests/privacy-page.logic.spec.ts`.
3. Commit locally (the site and tests, the gate file, the docs). Stage by explicit path and
   include all 27 untracked files: tracked code imports `components/track-clicks.tsx` and links
   to `app/privacy/`, and tests pin the two icon files, so `git commit -a` would break the
   build. Then merge `origin/main` into
   the branch (`eefa2cf`, #128, `lib/partner-events.ts` only, plus #129 once merged; no
   conflicts, and a scratch merge passed typecheck and all logic tests): a merge commit, not a
   history rewrite.
4. On that exact tree: typecheck, the logic tests, the production build, both browser suites and
   `node scripts/lint-regression.mjs origin/main`, then the pre-push gate. Push only on PASS.
5. Push by name: `git push -u origin seo/invisible-technical-fixes`. Never
   `git push origin HEAD:main`: git suggests it because the branch's upstream is `origin/main`,
   and it would deploy straight to production. Pushing publishes the branch on the public
   repository and, by Vercel's default, starts a preview deployment.
6. Open the PR to `main` (CI runs its checks, browser and lint jobs), verify the preview, merge
   only on the owner's go, then smoke-check the key pages about 90 seconds after the deploy.
7. After release: analytics needs a GA4 Measurement ID in Vercel (`NEXT_PUBLIC_GA4_ID`, project
   `lasvegasmahj-h1iz`) and verified delivery before it counts as active (steps: Round 12,
   "Analytics (lane D)"). The five-pack returns to the site only after Shauna sets it up in
   Bookwhen; restoring it then also means updating the gate's pricing input, besides the files
   named in the consistency pass, item 1.

---

# CONSISTENCY PASS 2026-11-15: final pass before release review (MERGED AND LIVE 2026-11-16)

**Source:** Shauna's consistency-pass instruction of 2026-11-15 (seven items). It applies her
approved wording across the site and closes open items 1 to 7 of the approvals section below.
Everything is in this working copy, uncommitted, on `dc1d628`; nothing is pushed, merged or
deployed, and Bookwhen was not changed. Copy of the tree before this pass:
`~/Projects/.lvm-approvals-2026-11-15/before-pass2/`. Four agents edited separate files in
parallel (corporate hub and parties; four corporate pages; three corporate pages; open play,
five-pack and lessons); the lead did the rest and all checks.

**What changed:**
1. Five-pack, removed for now: `OPEN_PLAY_PRICE_LINE` is "$20 per session" (`lib/pricing.ts`; the
   owner's $85 price stays recorded there with a note that it is not on sale), and the five-pack
   Offer is gone from `OPEN_PLAY_SERVICE` (`lib/schema.ts`), so it leaves the open play page's
   markup and the sitewide business markup too. The open play page (price card and FAQ), the
   visitor page and the lessons chooser all read the one line. No page, metadata or markup
   mentions a 5-pack, $85 or 85.00 (test-guarded). `OPEN_PLAY_SESSION_LINE` is retired.
   Future task, hers: set up the five-pack in Bookwhen; then restore it in `lib/pricing.ts` and
   `lib/schema.ts` and in `tests/seo-round6-owner-wording.*`.
2. Corporate and parties wording: her three sentences, used where each topic comes up, replace
   every promise that we bring NMJL cards, every "all equipment"/"everything" promise and every
   statement of who supplies tables, chairs or furniture, in visible copy, FAQs (and their
   FAQPage markup), Service descriptions and metadata. Hub: hero, How It Works (step retitled
   "We confirm the setup"), two FAQs, Service markup. Team building, conference, convention,
   meeting planner, corporate events, incentive and trade show pages: their FAQs and paragraphs
   (trade show uses "We confirm the booth ..." and "We confirm the suite ..."); the meeting
   planner's "We bring" and "You provide" lists lost the card and furniture items and gained a
   short note each; convention's "we will build the right setup" now reads "plan". Parties:
   meta description ("mahjong equipment and instruction provided"), the hosting FAQ, the
   birthday line, How It Works 02 (setup sentence) and 03 (card sentence). Food and drink stay
   the client's or venue's where already stated. Not part of this instruction, so unchanged:
   tournament mentions; lesson-context card wording (homepage FAQ and "What to Expect", private
   lessons FAQ, Summerlin and Henderson, the hidden Cafe Lola page), where the studio supplies
   cards for lessons.
3. Open play eligibility: "already know American Mahjong and are comfortable playing
   independently" now on the open play page (who can play, FAQ, body), the visitor page (FAQ,
   "Who can come", body), the open play markup used sitewide, the studio's Lucky Sevens text and
   the schedule's Open Play card. Finishing Mahj 101 is no longer presented as enough anywhere;
   new players are still pointed to Mahj 101. Advance registration and the current NMJL card
   requirement are kept. Judgment call: the visitor page's "A little rusty? Come anyway." was
   removed as conflicting with the requirement. Metadata stated no conflicting rule and is
   unchanged.
4. Calendar button: the hero's bottom padding is now 6.5rem (desktop and phone rules) so its
   buttons never reach the decorative scroll hint, and the hint no longer takes clicks
   (`pointer-events: none`). Before, the hint covered part of "See the Calendar" at most laptop
   sizes up to about 800px tall and on common phones. Now: no overlap at any width from 320 to
   2560 and any height from 480 to 1100 (8px margin); at 1280x720 and on iPhone 13 a click at the
   centre and bottom lands on the button, and keyboard focus plus Enter opens /schedule.
   Visible effect: on tall screens the hero content sits about 20px higher (about 28px on phones);
   in short windows the hero grows instead.
5. Private lessons: the private lessons page's search and share descriptions say "Individual or
   private-group instruction", and the lessons page says "learn on your own or with a small group
   you bring yourself". Already group-inclusive, so unchanged: its Service markup, the sitewide
   offer and the chooser's private card.
6. Photos: her original file (4032x3024) is
   the same photo as option C: same 3:4 full frame, and scaled down it differs from the site's
   copy by 0.95/255 on average after light blurring, against 38.7 for a 2% crop. A 1500x2000 copy
   from it (no camera or location data, identical colour means) replaces
   `public/studio-shauna-neon-sign.jpg`; `SHAUNA_NEON` and the root share image now say
   1500x2000; the file is pinned by hash. Served bytes for this photo (local optimizer, fresh
   cache): phones and the homepage on a 2x laptop 342 KB (was 288 KB, then capped at 1050px);
   About on a 2x laptop 223 KB (was 216 KB). Caches may serve the old copy for a while after
   release; it is the same photo. The retired headshot `shauna.jpg` is archived (with checksum)
   in `~/Projects/.lvm-private-photo-originals-2026-11-15/` and removed from `public/` (404). No
   code or maintenance script referred to it; the commented-out Cafe Lola block now names the
   studio photo. A wide share crop (1200x630,
   sign and face) is prepared for review only, not installed:
   `~/Projects/.lvm-approvals-2026-11-15/photo-c/share-crop-proposed-1200x630.jpg`, with a
   comparison sheet `share-crop-review.png`.
7. `tests/studio.spec.ts` "the Place carries its two verified room photographs" now fetches the
   photos from the run's configured server (`request` with the baseURL), not port 3000; its
   assertions are kept and it also checks that each URL is on www.lasvegasmahj.com.

**Tests changed:** `tests/seo-round6-owner-wording.*` (the 2026-09-29 "venue provides the tables
and chairs" rule is replaced by the neutral-setup rule, plus no-card-promise, parties and
no-five-pack checks; the eligibility facts now expect "comfortable playing independently");
`tests/owner-approvals-2026-11-15.*` (price line, retired headshot, sharper photo pin, private
lessons wording, hero CSS, calendar click and keyboard test, eligibility on both pages);
`tests/studio.spec.ts` (item 7).

**Verification (final build `3AasTF3Hpd6NJyBH5YeTp`; source fingerprints in
`logs/source-at-build-p2.sha256`, unchanged since the build):**
- Typecheck clean. Lint on the 24 changed code and test files: 4 errors before, 4 after (the
  lessons page's existing link rule); no file got worse. No em or en dashes.
- Logic tests: 572 passed, 7 skipped, 1 failed: the known Find My Mahj drift check.
- Production build passed with no warnings. Browser suites, desktop and phone: 748 passed,
  22 skipped, 0 failed (the repaired studio test passes on both).
- Structured-data parity on 16 routes: every FAQPage answer matches the visible FAQ word for
  word; no furniture assignment, card promise, blanket equipment promise, five-pack, Mahj 101
  sufficiency or one-on-one-only wording in visible text, markup or metadata of the corporate,
  parties, open play, visitor, schedule or studio pages (`logs/parity-p2.txt`; the only hits are
  the lesson-context lines noted in item 2).
- Crawl: 34 routes 200, 50 internal links, 264 image references all images; `/shauna.jpg` 404
  (400 through the optimizer).
- Pictures (only what looks different): `~/Projects/.lvm-approvals-2026-11-15/final-shots-p2/`.

**Release review packet (what is left):**
1. Owner decisions: approve or skip the wide share crop; the repository's history keeps earlier
   versions of the edited and removed files (accept, make the repository private, or approve a
   history rewrite). Optional wording she may want to see:
   tournament mentions on corporate pages; the homepage FAQ line "Most people feel comfortable
   playing after just one 2-3 hour lesson". APPROVED AND APPLIED later on 2026-11-15: she
   approved new wording for both, and it is in the working copy (FINAL COPY APPROVALS above,
   items 1 and 2).
2. Future task: five-pack setup in Bookwhen (item 1).
3. Analytics: approved, NOT active; needs a GA4 Measurement ID set in Vercel
   (`NEXT_PUBLIC_GA4_ID`, project `lasvegasmahj-h1iz`) after release and verified delivery in GA4
   Realtime or DebugView. Steps: Round 12, "Analytics (lane D)".
4. Release: pre-push gate (Brand prompt stale on pricing), sitemap dates of the changed pages set
   to the release date, smoke check after deploy. Superseded later on 2026-11-15: the gate's
   inputs are corrected, and the release steps, with the sitemap date rule, are in FINAL COPY
   APPROVALS above.

---

# OWNER APPROVALS 2026-11-15: gallery decisions applied (MERGED AND LIVE 2026-11-16)

**Source:** Shauna approved the recommendations in the local approval gallery on 2026-11-15. Her
text is saved word for word in `~/Projects/.lvm-approvals-2026-11-15/OWNER-APPROVAL-2026-11-15.md`.
It covers the nine listed selections only. Everything is in this working copy, uncommitted; nothing
is pushed, merged or deployed. Work folder `~/Projects/.lvm-approvals-2026-11-15/`: a copy of the
tree from just before this work (`before-tree/`), the diff (`approvals-2026-11-15.diff`), logs,
final screenshots (`final-shots/`) and the Bookwhen evidence. Three agents edited separate files in
parallel (corporate; lessons; homepage photo) and the lead did the rest and all verification. This
section supersedes the sprint's "not merged, owner's call" notes for button pink and the lane 5
and 6 previews.

**Applied, item by item:**
1. Website changes: the nine sprint changes stay. Parties page closing line
   (`app/mahjong-parties-las-vegas/page.tsx`) now reads "Mahjong equipment and instruction
   provided · We come to you · No experience needed" (was "All equipment included · ..."). Her
   phrase is used without its closing period, which would break the dotted line. The new line is
   1.8px wider than its 580px column, so on tablets and desktops "needed" fell onto a line of its
   own (found by the rendered review). Non-breaking spaces inside "We come to you" and "No
   experience needed", and before each dot, now let it wrap only after a dot; the words and the
   layout are unchanged.
2. Two edited photos: `public/lvm-cheers-toast.jpg` (team building page) and
   `public/lvm-just-won-mahjong-2.jpg` (About) are the reviewed edits, copied byte for byte from
   `~/Projects/.lvm-seo-screens-2026-11-13/photo-*-PROPOSED.jpg`. Same pixel sizes (1800x1201,
   1800x1440), no metadata, no further edits. The originals are kept privately (below).
3. Homepage photo, option C: `public/studio-shauna-neon-sign.jpg` (`SHAUNA_NEON`, 1050x1400 then;
   the file is 1500x2000 since CONSISTENCY PASS item 6), used as is with no overlay. It is now
   the homepage "Meet Your Mahjong Teacher" photo (`components/teacher.tsx`, same `sizes`),
   `OG_SHAUNA` in `lib/og.ts` (the share picture of `/about`, `/contact`,
   `/mahjong-lessons-las-vegas`, `/private-mahjong-lessons-las-vegas`,
   `/mahjong-lessons-summerlin` and `/mahjong-lessons-henderson`), the second default share
   picture in `app/layout.tsx` (homepage), the LocalBusiness `image`, the founder `image`, and the
   About page's Person `image`. Not changed: the commented-out Cafe Lola event block in
   `app/layout.tsx` (never published) still names `shauna.jpg`, and `public/shauna.jpg` is still
   served at its address because removing it was not part of the approval.
4. Corporate "At a Glance" (`app/mahjong-corporate-las-vegas/page.tsx`): the reviewed lane 5
   layout replaces "What We Bring to Your Event", with her corrections: the friendly tournament
   bullet is gone; the sets bullet no longer names NMJL cards ("152-tile American Mahjong sets,
   racks and other game materials for every table") and the card ends with her sentence "NMJL
   card arrangements are confirmed in your quote."; the bullet "Tables and chairs for the group,
   set in the room" is gone and the venue card ends with her sentence "We confirm the venue,
   tables, chairs and setup arrangements when planning your event." The other bullets, the quote
   panel and its "Request a Quote" button (`/contact?source=corporate`) are as reviewed; no
   client names or event examples. The hub now has three quote buttons, so the two counter tests
   moved with the reviewed patch (`round3-contact` 2 to 3; `seo-round2` 2 to 3 and 12 to 13).
5. Lessons "Find Your Fit" (`app/mahjong-lessons-las-vegas/page.tsx`): the reviewed lane 6
   section sits right after "What You'll Learn", with its four green text links and the new
   `lessons` contact slug (`components/contact-form.tsx`). Her corrections: the tier "1-on-1
   Lessons" is now "Private Lessons"; the open play card reads "Best for: Players who already know
   American Mahjong and are comfortable playing independently." (her sentence; the card's existing
   "Best for:" label supplies its opening "For"); the advance booking and current NMJL card
   instruction stays. Price: the five-pack cannot be bought in Bookwhen, so the card shows only
   "$20 per session" through a new `OPEN_PLAY_SESSION_LINE` in `lib/pricing.ts` (prices
   unchanged). Evidence, read-only, 2026-11-15: each Social Open Play session sells one ticket,
   "Social Open Play $20.00"; the only membership ("Founding Membership") has no price options;
   the booking site has no passes (`~/Projects/.lvm-approvals-2026-11-15/bookwhen-five-pack-check.txt`).
   Bookwhen was not changed.
6. Button pink (`app/globals.css`): `--pink-button: #dd1d85` is the background of `.btn-primary`
   and `.nav-cta`. The menu button's hover also uses it: its old hover, `--pink-light` (#ff4da6),
   put white text at 3.06:1. The button still lifts on hover. This step changed no heading, label
   or accent color (small pink text had already moved to `--pink-light` in the sprint; see the
   final approvals section, owner item 5). Measured in the browser on 7 pages at desktop and
   phone, every visible pink button (35 per device) at rest, hovered, pressed and focused: all
   #dd1d85, white text 4.58:1 (`logs/contrast.txt`). Only Ask a Rule's send button has a
   disabled style (it fades); the guideline exempts disabled controls.
7. iPhone icon: `app/apple-icon.png` is the reviewed 180x180 pink die cut from her logo file
   (sha256 `72e5ca24...`), pinned in `tests/seo-round10-visible.logic.spec.ts`. `favicon.ico` and
   `icon.png` are unchanged, and the full logo stays everywhere else.
8. P2 is not implemented: the About photo keeps `sizes="(max-width: 768px) 100vw, 380px"` and
   its quality, now pinned by a test.
9. Other photos: `lvm-lesson-group.jpg`, `lvm-private-game.jpg` and `birthday-mat.jpg` are
   removed from
   `public/` after being copied, with checksums, to `~/Projects/.lvm-private-photo-originals-2026-11-15/`
   (outside the site and the repository; the originals of the two edited photos are there too). No
   page used them. The one reference was `scripts/fix-orientation.cjs`, which would have written
   `lvm-private-game.jpg` back into `public/` from a file in the owner's Downloads folder; it no
   longer lists the two files.

**Tests:** new `tests/owner-approvals-2026-11-15.logic.spec.ts` (one test per decision) and
`tests/owner-approvals-2026-11-15.spec.ts` (what the browser gets: button colors and contrast in
four states, the homepage photo, the six share pictures and the business details, the iPhone
icon's served bytes, the removed photos, the lessons and corporate sections, the parties line).
`tests/studio.logic.spec.ts` now counts `/studio` only as the page path: the new About image URL
`/studio-shauna-neon-sign.jpg` is a photo, not a link. About's allowance went from 4 to 3 with
it, so About keeps no spare room, as before (its two links plus one comment).

**Verification (final build `y4TlFNfpnFN_OlnIi6Q3D`, source fingerprints in
`logs/source-at-build2.sha256`; the first build `rTfZQkgUG_fjF6xWbogCq` differed only by the
parties line fix and that line's tests):**
- Typecheck clean. Lint on the 18 changed code and test files: 7 errors before, 7 after, all
  pre-existing (4 on the lessons page, 3 in the orientation script); no file got worse.
- Logic tests: 558 passed, 7 skipped, 1 failed: the known Find My Mahj drift check (the sister
  repository has 5 approved Ask entries not yet triaged here; skipped in CI).
- Production builds passed with no warnings. Browser suites, desktop and phone, on the final
  build: 742 passed, 22 skipped, 2 failed: `tests/studio.spec.ts:173` on each project, which
  fetches photos from another session's server on port 3000 and was excluded the same way in the
  sprint. On the first build the new button test had also failed on desktop: at 1280x720 the
  homepage hero's scroll hint covers the middle of "See the Calendar" and caught the pointer
  (open item 7). That test now uses an 800px-tall window. The new parties line test failed on
  the first build, as it should (the stray "needed"), and passes on the final one.
- Crawl of all 34 sitemap routes on the final build: every page 200; 50 internal links resolve;
  264 image references (img, srcset sizes, icons, share pictures, JSON-LD) all return images;
  nothing references `shauna.jpg`; the three removed photos return 404 (400 through the image
  optimizer). The iPhone icon link says `sizes="180x180"` and serves exactly the pinned file.
- Button contrast on the final build: 70 buttons (35 per device), 4 states each, all #dd1d85 at
  4.58:1 (`logs/contrast2.txt`).
- Independent review, read-only, two skeptics per finding (18 agents): compliance with her text,
  content and house rules, technical correctness, and rendering at 320, 390, 768, 1024, 1280
  and 1440px plus iPhone 13. No defect in the approved items themselves. Fixed after review:
  the parties line's stray "needed" (confirmed by both skeptics); the lessons test's "not a
  button" check, which could never fail (it now reads the rendered links, and the section
  markers must exist); About's `/studio` allowance (4 to 3). Added to the open items below: the
  corporate Service markup's NMJL card promise, the parties page's other "all equipment" and
  "cards" promises, the sitewide "Mahj 101 graduates" description, the repository's history
  (earlier versions of edited files), and the homepage photo's share crop and sharpness. Not
  confirmed (2 of 2 skeptics): the "Private" label above "Private Lessons" (approved wording).
  Measured: no horizontal overflow at any width; the homepage photo keeps its 3:4 shape,
  uncropped (about 570px wide on desktop; the phone section is about 66px taller than with the
  old headshot); the corporate notes read at 6.12:1 and the lessons links at 9.7:1; nothing
  clipped. Scripts and results: `~/Projects/.lvm-approvals-2026-11-15/review-rendered/`.

**Open items for the owner (setup tasks and decisions):** items 1 to 7 were resolved by the
CONSISTENCY PASS above (except the Bookwhen setup itself, the share crop review and the
repository history); items 8 and 9 continue in its release review packet.
1. Five-pack: set it up in Bookwhen (a separate task; the pack rules are hers) or take it off
   the site. Today it still shows on the open play page (price card and FAQ, which also feeds
   that page's FAQ markup) and the visitor page, and every page publishes an $85.00 "Social
   Open Play 5-pack" Offer inside the sitewide business markup (`lib/schema.ts`, read by
   `app/layout.tsx`). `tests/seo-round6-owner-wording` pins those. Once the pack is on sale,
   the lessons chooser can switch back to `OPEN_PLAY_PRICE_LINE`.
2. Furniture, NMJL cards and tournaments outside the new section. On the corporate hub: the hero
   (directly above the new section, line 130) says the venue provides the tables and chairs; the
   FAQ (line 58, also in its FAQ markup) and How It Works (line 181) say that and that we bring
   NMJL cards; the Service markup Google reads (line 35) says "NMJL cards and instruction
   provided", which now contradicts the new note on the same page. The seven other corporate pages
   say the same, and several mention a friendly tournament. `tests/seo-round6-owner-wording`
   requires the phrase "tables and chairs" on all eight corporate pages. The parties page makes
   the broad promise too: its search description (line 10, "all equipment provided"), How It
   Works step 3 (line 137, "tiles, racks, cards, everything. You don't need to provide a thing.")
   and an FAQ answer (line 55, also in its FAQ markup); its tables-and-chairs part is the open
   content question A2. Her neutral wording can replace all of these once she decides; nothing
   outside the new section and the parties closing line was changed.
3. "Completed Mahj 101" as the open play entry rule remains on the open play page (3 places), the
   visitor page (2), and in the open play description inside the sitewide business markup
   (`lib/schema.ts` line 132, "including Mahj 101 graduates"), pinned by tests; her new
   "comfortable playing independently" wording is only in the lessons chooser.
4. "One on one" remains in the private lessons page's description, share description and Service
   markup, in the sitewide offer, and in the chooser's private card (the reviewed wording).
5. `public/shauna.jpg` (the old headshot) is still reachable at its address. Likewise, the
   repository is public and its history keeps earlier versions of edited and removed files after
   a merge. Options: accept that, make the repository private, or explicitly approve a history
   rewrite (never done without her say).
6. Homepage photo quality, two choices for her (nothing changed): (a) share cards on Facebook, X
   and LinkedIn are wide (about 1.91:1) and usually show the middle band of a portrait, so this
   3:4 photo will probably lose the "Let's Mahjong" sign and the top of her head in large link
   cards; a separate wide crop of the same photo, used only as the share picture, would fix it.
   (b) The site's copy is 1050 pixels wide, and the homepage shows it about 570 pixels wide on a
   desktop (up to about 700 on a tablet), so on sharp screens it is slightly enlarged and may look
   a little soft. Her original file (4032x3024, still carrying camera data) could give a
   sharper copy with the camera data removed. Both are image changes, so they wait for her approval. Also worth knowing: on a
   1280x800 laptop the photo is about 760px tall, a little taller than the screen below the
   menu, so it never shows whole at once (the old headshot was about 650px).
7. Homepage hero: in a 720px-tall window the decorative scroll hint covers the middle of "See
   the Calendar" and swallows clicks there; on an iPhone 13 it overlaps the button's bottom edge.
   Not caused by this work: the hero's markup and layout are unchanged since `089a729` apart from
   the sprint's reduced-motion rules, so the live site has it too. Proposed one-line fix for her
   approval: `.scroll-hint { pointer-events: none; }`.
8. Analytics stays approved and is NOT active: no Measurement ID exists, and no event delivery to
   Google has been verified. Steps after release are in Round 12, "Analytics (lane D)".
9. Release: run the pre-push gate (its Brand prompt is stale on pricing), set the sitemap dates of
   the changed pages to the release date, then smoke-check. The earlier open questions (content
   questions, Ask page wording, privacy "We do not sell it", Search Console exports, the
   repository history) are unchanged. (Later on 2026-11-15 she confirmed the privacy
   sentence, and the gate's inputs were corrected: FINAL COPY APPROVALS at the top.)

---

# SPRINT 2026-11-13: journeys, accessibility, performance, content, previews (MERGED AND LIVE 2026-11-16)

**How it ran:** after Round 12, eight lanes worked in parallel, each in its own copy of the site
(`~/Projects/.lvm-sprint-2026-11-13/<lane>/`), each owning a fixed set of files and handing back a
patch that was dry-run and then merged into this working copy by the lead. Previews (lanes 5 and
6) are NOT merged: they wait for the owner. Snapshot of the sources after the first merges:
`~/Projects/.lvm-sprint-2026-11-13/snapshots/S1-after-lane1-lane4/`.

**Merged locally (in this working copy):**
- Lane 4, content accuracy: `/learn-mahjong` lists MAHJ103 (Bookwhen runs it); the open play
  photo is no longer placed in a named room (no room is on record for it); the private lessons
  page's link wording matches where it goes; its FAQ now reads "Can you teach at my home or venue
  instead? Yes, by request. Send us an inquiry with where you are, how many people are learning,
  and a date you have in mind. ..."; the parties page's two double-hyphen dashes are gone.
  Test: `tests/sprint-content.logic.spec.ts`.
- Lane 1, booking and inquiry journeys (all five journeys pass at desktop and phone; 24 Bookwhen
  cards match their class and return 200; 39 internal links 200): the homepage "Plan Your Event"
  modal is now a real dialog (focus moves in and stays in, Escape closes, focus returns, a text
  selection that ends on the backdrop no longer closes it); every Book link on `/schedule` and
  `/play-mahjong-las-vegas` now has a descriptive accessible name ("Book: Mahj 101 with <instructor>,
  Mon, November 16, ...") with no visible change. Test: `tests/sprint-journeys.spec.ts`.
- Lane 2, mobile and accessibility (axe failures 424 to 182 over 14 pages at two widths, the rest
  contrast only): homepage FAQ reachable by keyboard (buttons with aria-expanded, pixel-identical);
  phone menu closes on Escape and when focus leaves; a skip link and a `<main>` on the homepage;
  contact form errors under each field (aria-invalid, aria-describedby), success or error message
  focused and scrolled into view after a send; newsletter messages announced; reduced-motion
  respected; small-text contrast raised by the smallest passing steps (labels to `--pink-light`,
  footer, About, parties and rules small text); the About cards' empty slot centered
  (`.about-experience-grid`); footer column headings `h2` (were `h5`, visually identical); shop
  card web addresses readable (were white on white); the nav collapses to the menu button at a
  larger browser text size. Tests: `tests/sprint-a11y.spec.ts`, `tests/sprint-a11y-optional.spec.ts`.
- Not merged, owner's call: a slightly darker button pink (`#dd1d85`, white text 4.17 to 4.57:1),
  in `~/Projects/.lvm-sprint-2026-11-13/lane2-a11y/proposals-lane2-optional.patch`.

- Lane 3, performance (local lab measurements, not field data; see "Performance" below):
  `next.config.ts` `images.deviceSizes` gains 1280 and 1440 (the default list jumped from 1200
  to 1920, so big phones and laptops downloaded 1920px files); `components/private-events.tsx`
  loses the unsupported "for any group size". Tests: `tests/sprint-perf.logic.spec.ts`,
  `tests/sprint-perf.spec.ts`. Dropped after measuring: `experimental.inlineCss` (worse on every
  page in Lighthouse, new layout shift).
- Lane 2 items in files the other lanes owned, merged after them: shop card affiliate note and
  "Use code" label contrast (`components/shop.tsx`), the "Explore Lessons" cue on the homepage
  studio card (`app/globals.css`, with `tests/room-cards.spec.ts` updated), and the "Custom quote
  for your group size" line under the private events cards (`components/private-events.tsx`).
- Review fixes (lane 8, confirmed by three of three skeptics each): the homepage share
  description now ends "Beginner classes need no experience." (it said "No experience needed!"
  after open play and leagues); the hidden Cafe Lola event page's title and time range no longer
  use long dashes (`components/event-page.tsx`), nor does its commented schema in
  `app/layout.tsx`; the homepage pop-up keeps focus inside in Safari too (a `focusin` guard) and
  returns focus to "Plan Your Event" in Safari (the button now focuses itself when pressed); the
  open play page's sitemap date. Tests added to `tests/sprint-journeys.spec.ts`.
- Review fixes (incremental review of the lane 2 and 3 merges, 4 findings confirmed by three of
  three skeptics each, 1 refuted; the four came down to three defects, all fixed, no visible
  change at the default text size):
  - The skip link had no target in the HTML as served (only the homepage's `<main>` had the id;
    a script added it elsewhere after loading). Every `<main>` behind the skip link now carries
    `id="main-content"` (35 files; in the sprint, 25 of them changed only by this attribute). The
    retired blog post's 410 page has no nav or skip link and is unchanged. Ask a Rule's page is
    off-limits and untouched; the nav's script still names its `<main>`.
    The protected lessons page gained only this invisible attribute. Tests: no-JavaScript check
    in `tests/sprint-a11y.spec.ts`, source guard `tests/sprint-a11y.logic.spec.ts`.
  - Both newsletter fields were marked invalid (and the homepage one turned red) on a network or
    service failure, when the address was fine. `lib/use-mailchimp.ts` now reports
    `invalidEmail` only for an empty field or the subscribe route's own 400 format check; the
    message is still read out on every error. Test: `tests/sprint-a11y.spec.ts`.
  - The About experience cards switched columns at fixed widths, which matched the old grid only
    at the default text size. The switch points are now `calc(480px + 1.5rem)` and
    `calc(720px + 3rem)` (the old grid's own rule), and `min-width: 0` keeps a long word from
    widening a card. The parity test now also runs at browser text sizes 24 and 32.
  - Refuted: a missing test guard for "for any group size" on the homepage card (the phrase is
    gone; the gap predates the sprint).
- Not merged, owner's call: the button pink (above), and the two performance proposals P1 and P2.

**Previews awaiting the owner (not merged; screenshots in each lane's `shots/` folder):**
1. Corporate "At a Glance" section for `/mahjong-corporate-las-vegas`, replacing the "What We
   Bring to Your Event" cards: `~/Projects/.lvm-sprint-2026-11-13/lane5-corporate-preview/`
   (`preview.patch`, `SOURCES.md` with a source for every sentence). Fact-checked; its three
   test counts are updated inside the patch. Planner questions it could not answer: group size
   limits and facilitators per table, lead time, setup time, payment and cancellation terms,
   insurance certificate, whether planners can request Shauna, service area.
2. Lesson "Find Your Fit" section for `/mahjong-lessons-las-vegas` (protected page; first screen
   byte-identical; placed after "What You'll Learn"):
   `~/Projects/.lvm-sprint-2026-11-13/lane6-lessons-preview/`. Adds a `lessons` source slug so home
   or venue inquiries arrive labelled "Lessons page". Questions: placement, text links versus
   buttons, retitling the "1-on-1 Lessons" tier.

**Documents added in this sprint (`docs/handoffs/`):**
- `lvm-search-opportunities-2026-11-13.md`: what searchers ask for beginner lessons, private
  lessons, visiting players and corporate events, with sources, and the gaps on existing pages
  (several already fixed locally, mapped at the top).
- `lvm-proposed-content-2026-11-13.md`: exact proposed additions for the corporate, private
  lessons and visitor pages, sourced, plus the unanswered questions. Nothing installed.
- `lvm-measurement-plan-2026-11-13.md`: every analytics event mapped to a business goal, the
  GA4 verification checklist for when the Measurement ID exists, a reporting plan for inquiries
  and booking-link clicks, and prioritized experiments with hypotheses.
- `lvm-owner-guide-2026-11-13.md`: a plain guide for the owner.
- Evidence: `~/Projects/.lvm-sprint-2026-11-13/lane7-analytics-search/SEARCH-EVIDENCE.md` (the
  only Search Console data on record and the exact exports to request).

**Final verification (2026-11-13).** One production build after integration, build ID
`H57ivSzbzkM1UxbuDfD5-`, made in `~/Projects/.lvm-sprint-2026-11-13/final-build/site` (its code
an exact copy of this working tree, checked with `diff -rq` before the build) and served there on
port 3441: 46
pages generated, no warnings or errors. The earlier combined build `BtUQMFZFXEkwUgSZy9dX7`
predates the lane 8 and incremental review fixes and is superseded.
- Typecheck: clean.
- Lint: 83 changed or new lintable files hold 11 errors; no file has more errors than it had at
  `089a729`. `scripts/lint-regression.mjs` compares commits only, so the check
  used the same per-file rule against a complete base tree (the repository at `089a729` minus
  `public/`).
- Logic tests: 549 passed, 7 skipped, 1 failed: the known Find My Mahj drift check, which needs
  the sister repository and is skipped in CI.
- Browser tests, both full suites on the final build (4 workers; the test "the Place carries its
  two verified room photographs", `tests/studio.spec.ts:173`, excluded as before: it fetches
  photos from another session's server on port 3000): desktop 366 passed,
  7 skipped; phone 359 passed, 15 skipped; 1 failed. The failure was the new no-JavaScript
  skip-link test on desktop: the page's load event never came because two image requests
  (`lvm-teaching-action.jpg` and `lvm-community-group.jpg` at width 640) stalled inside Next's
  local image optimizer during the four-worker run and stayed stuck until the local server was
  restarted. Other sizes of the same photos and freshly made images returned normally; after the
  restart the two came back in about 0.2 s, the same sizes (87,557 and 44,744 bytes) as the
  pre-sprint server's copies. The live site on Vercel does not run this local server. After the
  restart the unchanged test passed 6 of 6 runs (3 per project). It now waits for the HTML only
  (what it checks); with that change the whole `tests/sprint-a11y.spec.ts` passed on both
  projects (29 passed, 5 skipped by design).
- Reviews: lane 8 (48 agents) confirmed 7 findings, all fixed, and refuted 7; the incremental
  review of the lane 2 and 3 merges (19 agents) confirmed 4 findings (three defects), all fixed,
  and refuted 1. Every finding went to three skeptics; two of three had to confirm it.

**Performance (lab only, 2026-11-13, 16:20 to 16:48).** Lighthouse 12.6.1, mobile preset with
simulated throttling, run against the pre-sprint build (`LVJpWC61E69PVAQ0YOHqf`, port 3442) and the
final build (port 3441), both local `next start` servers. One discarded warm-up round, then 5
measured rounds over 7 pages (70 runs, none failed); each round alternated which build went first.
Harness and raw reports: `~/Projects/.lvm-sprint-2026-11-13/lane3-perf/` (`tools/lh-batch.mjs`,
`lh/final-quiet/`, `lh/final-bigphone/`, `lh-final.log`).
- Conditions: the machine was not quiet. Other sessions' test runs could not be stopped; the
  1-minute load average on 8 cores was 6.2 to 22.4 during the measured runs (median 10.2), and the
  wait for a load under 3 timed out after 10 minutes. Alternating the order reduces ordering bias
  but does not make conditions equal: load differed within a before/after pair by up to 3.9.
- Timing: inconclusive. On every page the five paired LCP differences (after minus before) point
  both ways: homepage -16 to +143 ms, lessons -18 to +14, schedule -161 to +148, studio -67 to +75,
  About -374 to +10, corporate -23 to +18, parties -34 to +14; the final build was faster in 1 to 3
  of 5 pairs per page. On the schedule, studio and About pages one build's own five runs spread
  over 79 to 382 ms, more than any median difference between the builds (0 to +9 ms there). No
  speed change, better or worse, can be claimed from these runs, and no percentage is given.
  Layout shift was 0.000 on every run of both builds; total blocking time medians were 22 to 47 ms
  for both.
- Verified by transfer size (does not depend on machine load): at the Lighthouse phone size (412
  px wide at 1.75x) both builds download the same images and fonts; the sprint adds 1.3 to 2.4 KB
  per page (scripts 0.7 to 1.6 KB, styles 0.4 KB, HTML 0.1 to 0.6 KB), the accessibility code. On a
  large phone (430 x 932 at 3x, one round): homepage images 611 to 488 KB (page total 902 to 782
  KB), studio 558 to 424 KB (835 to 703 KB), About unchanged at 387 KB (its photo's original is
  only 1050 px wide). Desktop was not re-measured; lane 3 measured homepage images 454 to 431 KB at
  1350 x 940 earlier (one run, same `next.config.ts` change, its own copy of the site).
- Not measured: real visitors' Core Web Vitals (field data) and the production CDN.
- Follow-up, not blocking: rerun `node tools/lh-batch.mjs <phase> 5 A=<before port>,B=<after
  port>` from the lane 3 folder when no other sessions are running, or measure the live site
  after release (PageSpeed Insights; Search Console's Core Web Vitals report once there is enough
  traffic).
- Proposals P1 and P2 (not merged): their byte savings are verified (P1: homepage total 562 to
  465 KB, the tile texture no longer fetched; P2: the About LCP image 195 to 156 KB); their timing
  results came from a busier machine and are not confirmed.

**Sprint screenshots** (`~/Projects/.lvm-seo-screens-2026-11-13/`, private: some Round 11
"before" pictures in the same folder show details since removed from the site). Before = the
pre-sprint build (Rounds 9 to 12 included), after = the final build. Close-ups hide the fixed
menu bar and the skip link (visitors see the link only after pressing Tab; a close-up taller
than the window would otherwise draw it).
- `s-01-about-cards-desktop.png`: About experience cards, last row centered.
- `s-02-footer-desktop.png`, `s-02-footer-phone.png`: footer, h2 headings (same look) and small
  print contrast.
- `s-03-home-shop-cards-desktop.png`: shop card web addresses readable.
- `s-04-home-corporate-card-desktop.png`: homepage corporate card without "for any group size".
- `s-05-private-lessons-faq-desktop.png`: the home or venue FAQ answer.
- `s-06-open-play-photo-desktop.png`: open play photo label "At the Studio" and caption.
- `s-07-learn-paragraph-desktop.png`: Learn Mahjong lists MAHJ103.
- `s-08-parties-tagline-desktop.png`: parties tagline contrast.
- `s-09-home-faq-desktop.png`: homepage FAQ, same look, now reachable by keyboard.

**Changed-file inventory.** Computed by comparing every file in three snapshots: commit
`dc1d628`; the pre-sprint copy that lane 3 measured as "before"
(`~/Projects/.lvm-sprint-2026-11-13/lane3-perf/before`); and this working tree. Against `089a729`
the branch changes 97 files (70 modified, 27 new); 94 of them hold uncommitted changes (69
modified and 25 new on top of `dc1d628`). Tags: C = changed in commit `dc1d628` (Round 9's
committed part); P = changed after that commit and before the sprint (Rounds 9 to 12, uncommitted;
each round's section describes its own changes); S = changed in the sprint, described here. "id"
= `id="main-content"` on `<main>`.

Phases of the 64 files the sprint touched:
- C+P+S (23): `app/` `about`, `blog`, `corporate-event-activities-las-vegas`,
  `corporate-team-building-las-vegas`, `learn-mahjong`, `mahjong-corporate-las-vegas`,
  `mahjong-lessons-henderson`, `mahjong-lessons-las-vegas`, `mahjong-lessons-summerlin`,
  `mahjong-open-play-las-vegas`, `mahjong-parties-las-vegas`, `mahjong-sets-guide`,
  `private-mahjong-lessons-las-vegas`, `rules`, `rules/calling-tiles`, `rules/charleston`,
  `rules/dead-hands`, `rules/scoring`, `rules/the-card`, `rules/winning`, `schedule`, `studio`
  (each `page.tsx`); `docs/handoffs/lvm-seo-current.md`.
- C+S (9): `app/` `conference-activities-las-vegas`, `contact`, `convention-activities-las-vegas`,
  `incentive-group-activities-las-vegas`, `las-vegas-meeting-planner-activities`,
  `play-mahjong-las-vegas`, `rules/etiquette`, `rules/jokers`,
  `trade-show-booth-activities-las-vegas` (each `page.tsx`).
- P+S (8): `app/globals.css`, `app/layout.tsx`, `app/mahjong-leagues-las-vegas/page.tsx`,
  `app/privacy/page.tsx` (new), `app/sitemap.ts`, `components/contact-form.tsx`,
  `components/faq.tsx`, `components/footer.tsx`.
- S only (24): `app/not-found.tsx`, `components/` `event-page`, `home-client`, `inquiry-modal`,
  `nav`, `newsletter`, `private-events`, `shop`, `why-section` (`.tsx`), `lib/use-mailchimp.ts`,
  `next.config.ts`, `tests/room-cards.spec.ts`, `tests/seo-round1.spec.ts`, the 7 new `sprint-*`
  tests, and the 4 new `-2026-11-13` documents in `docs/handoffs/`.

What the sprint changed in them:
- id only (25): `app/not-found.tsx` and the `page.tsx` of `blog`, `contact`,
  `conference-activities-las-vegas`, `convention-activities-las-vegas`,
  `corporate-event-activities-las-vegas`, `corporate-team-building-las-vegas`,
  `incentive-group-activities-las-vegas`, `las-vegas-meeting-planner-activities`,
  `mahjong-corporate-las-vegas`, `mahjong-leagues-las-vegas`, `mahjong-lessons-henderson`,
  `mahjong-lessons-las-vegas` (protected), `mahjong-lessons-summerlin`, `mahjong-sets-guide`,
  `studio`, `trade-show-booth-activities-las-vegas`, and `rules/` `calling-tiles`, `charleston`,
  `dead-hands`, `etiquette`, `jokers`, `scoring`, `the-card`, `winning`.
- Pages, beyond the id: `about` (experience cards use `.about-experience-grid`; reviewer names in
  the lighter pink), `learn-mahjong` (MAHJ103), `mahjong-open-play-las-vegas` (photo label "At the
  Studio" and caption), `mahjong-parties-las-vegas` (two double hyphens replaced; the tagline and
  an italic line in higher-contrast colors), `play-mahjong-las-vegas` and `schedule` (each Book
  link names its session), `private-mahjong-lessons-las-vegas` (home or venue FAQ answer, link
  wording), `privacy` ("Last updated" contrast), `rules` (two small-text contrasts).
- Site-wide: `app/layout.tsx` (homepage share description; the Cafe Lola schema without a double
  hyphen), `app/sitemap.ts` (the open play page's date), `app/globals.css` (keyboard ring on
  buttons, skip link, reduced motion, nav collapse at larger text sizes, About experience grid
  with the review's text-size fix, footer h2 styling, homepage FAQ question text, contact-form
  error and success styling, newsletter focus and refused-address borders, "Explore Lessons" cue
  color, shop card web addresses), `next.config.ts` (image widths 1280 and 1440).
- Components and code: `nav.tsx` (skip link; Escape and moving focus away close the phone menu),
  `home-client.tsx` (one `<main id="main-content">` around the homepage content),
  `inquiry-modal.tsx` (a real dialog: focus kept inside, Escape, focus returned, backdrop press
  guard; Safari fixes), `contact-form.tsx` (errors under each field; the result focused and
  scrolled into view), `faq.tsx` (questions are buttons, same look), `footer.tsx` (column
  headings h2, same look; announced newsletter messages; contrast; `aria-invalid` from
  `invalidEmail`), `newsletter.tsx` (announced messages; `aria-invalid` from `invalidEmail`),
  `lib/use-mailchimp.ts` (`invalidEmail`), `private-events.tsx` ("for any group size" removed;
  "Custom quote" line contrast; Safari focus on "Plan Your Event"), `shop.tsx` (affiliate note and
  "Use code" contrast), `why-section.tsx` (decorative icons hidden from screen readers),
  `event-page.tsx` (no long dashes; id).
- Tests and docs: `tests/room-cards.spec.ts` (cue color), `tests/seo-round1.spec.ts` (private
  lessons FAQ wording), the new `sprint-journeys`, `sprint-a11y` (spec and logic),
  `sprint-a11y-optional`, `sprint-content.logic`, `sprint-perf` (spec and logic) tests; this
  file and the four new documents.

Changed only before the sprint (33):
- C (3): `app/ask/page.tsx` (share image; left out of the sprint on purpose),
  `tests/seo-round4-visitors.logic.spec.ts`, `tests/studio.logic.spec.ts`.
- C+P (3): `lib/og.ts`, `tests/seo-round9-share-schema.logic.spec.ts` and `.spec.ts` (new).
- P (27): `app/apple-icon.png` (new), `app/icon.png` (new), `app/favicon.ico`,
  `app/events/cafe-lola-open-play-may-2026/page.tsx`, `components/analytics.tsx`,
  `components/teacher.tsx`, `components/testimonials.tsx`, `components/track-clicks.tsx` (new),
  `lib/analytics.ts`, three photo files under `public/`, `index.html.bak`,
  `docs/handoffs/lvm-seo-technical-audit-2026-10-04.md`, and tests `analytics-events.spec.ts`
  (new), `privacy-page.logic.spec.ts` (new), `round3-contact.logic.spec.ts`,
  `seo-round4-visitors.spec.ts`, `seo-round5-corporate.logic.spec.ts`, and the new pairs
  `seo-round9-links-titles`, `seo-round10-visible`, `seo-round11-followups`,
  `seo-round12-owner-decisions` (spec and logic each).

---

# ROUND 12: owner decisions on fees, credentials, favicon, analytics and privacy (2026-11-13; MERGED AND LIVE 2026-11-16)

**Branch:** `seo/invisible-technical-fixes`, worktree `~/Projects/lvm-seo-invisible`, on top of
Rounds 9 to 11 below. Still one commit (`dc1d628`); everything else is uncommitted. Nothing
is pushed, merged or deployed, and no Git history was rewritten.

**Owner decisions of 2026-11-13 (afternoon). Standing rules:**
- There is NO additional travel fee for lessons at a home or venue.
- The Oh My Mahjong certification is Shauna's alone. It must not lead any
  page or be the main selling point. It may stay in her detailed About biography. Lead with
  the offering and the experience instead. Bookwhen listings are not changed.
- The pink-die favicon crop is approved for small icons; the full logo stays elsewhere.
- Analytics is approved (this overrides the earlier "Do not enable GA4 or GTM" decision):
  the existing direct GA4 implementation, no duplicate tracking, an accurate privacy page,
  no invented ID, and no claim that tracking is live until it is verified.
- The two photo edits wait for her separate approval.

**Done: fees (lane A).**
- `/about`, "A Home for the Game" card: "Prefer a private lesson at your home or venue? I can
  travel across Summerlin, Henderson, and the greater Valley for an added fee." now reads
  "Prefer a private lesson at your home or venue? That is available by request across
  Summerlin, Henderson, and the greater Valley." (no fee, and no traveling-instructor framing:
  in-home is by request, per the studio-first rule).
- Two corporate FAQ answers no longer name location as a price factor:
  `/corporate-team-building-las-vegas` ("Pricing depends on group size and length, ...") and
  `/corporate-event-activities-las-vegas` ("... group size and length set the price.").
- No page now mentions an added, extra or travel fee or charge (test-enforced).

**Done: credentials (lane B).** The certification now appears in exactly one visible place,
Shauna's About biography ("Eventually I made it official: I became a certified Oh My Mahjong
instructor"), plus the founder's structured-data credential (`hasCredential` in
`app/layout.tsx`, not shown to visitors, pinned by `tests/seo-round1.spec.ts`). Changed:
- `/about`: title "Shauna | 18 Years at the Mahjong Table" (was "Shauna | Certified Mahjong
  Instructor"); description "Meet Shauna, who has played American Mahjong for nearly 18 years.
  Her teaching style, her story, and why she started Las Vegas Mahjong."; share description
  "18 years at the mahjong table, a passion for teaching, and a community built one tile at a
  time."; hero label "Mahjong Teacher · Hundreds of Students Taught"; hero
  line "Founder of Las Vegas Mahjong. 18 years at the table, and counting."; the "Certified
  Instructor" card is gone (five cards remain) and the cards' label reads "Experience";
  Person structured data `jobTitle` "Founder and Mahjong Instructor".
- `/mahjong-lessons-las-vegas` (protected; four surgical edits): the hero opens "Las Vegas
  Mahjong offers in-person American Mahjong lessons at our Las Vegas studio."; the instructor
  section heading reads "Patient. Clear. Fun." (was "Certified. Patient. Fun."); Shauna's intro
  reads "Hi, I'm Shauna, the founder of Las Vegas Mahjong."; the share title reads "Mahjong
  Lessons Las Vegas | Beginner-Friendly Classes | Las Vegas Mahjong". Title, H1 and canonical
  unchanged (CI-locked).
- `/mahjong-lessons-summerlin` and `/mahjong-lessons-henderson`: the hero leads with what is
  taught and where, then "Our founder, Shauna, has played American Mahjong for nearly 18
  years."
- Homepage (protected): the "Meet Your Mahjong Teacher" bio sentence is back to the owner's own
  original wording, "Over the years I started teaching friends, and in 2025 I turned that
  passion into Las Vegas Mahjong." (`index.html.bak`); the sitewide search description now
  ends "Beginner classes need no experience." (not "no experience needed" for everything:
  `/mahjong-open-play-las-vegas` says Open Play is for players who already know the game).
  The homepage FAQ's lesson-length range ("2-3 hour lesson") was written with an en dash;
  it now uses an ASCII hyphen, per the house rule, and a stray space before a comma in the
  same answer is gone.
- Badges and labels: `/learn-mahjong` "Start Here" (was "Written by a Certified Oh My Mahjong
  Instructor"); `/rules` "Every Common Question, Answered" (was "From a Certified Oh My Mahjong
  Instructor"); `/mahjong-sets-guide` "An honest guide from an instructor who has used them
  all."; the sitewide footer small print no longer says "Certified Oh My Mahjong instructor."
- Metadata: descriptions and share text of `/learn-mahjong`, `/mahjong-sets-guide` (share
  title and Article headline "Best American Mahjong Sets 2026: An Honest Buying Guide"),
  `/rules` and five rules pages, `/blog`, the hidden Cafe Lola event page, the sitewide share
  description, the default share-image alt ("Shauna, founder of Las Vegas Mahjong"), the
  sitewide business description (now ends "Founded by Shauna in 2025.", from `foundingDate`
  and her bio) and the founder's `jobTitle`.
- Left for the owner: `/ask` still says answers are "checked against ... our certified
  instructor's written guide" (`app/ask/page.tsx`). Ask a Rule is off-limits without her.

**Done: favicon (lane C).** Cut from the owner's logo file
(md5 `2247d4ba8ce044403b2ba32e202246c9`), source rectangle left 552, top 300, 149 x 149, then one
Lanczos resize; nothing redrawn or recolored.
- `app/favicon.ico`: the pink die, frames 16, 32 and 48 (6,533 bytes, SHA-256 `ccfc74db...`).
- `app/icon.png`: the pink die, 144 x 144 (19,361 bytes, SHA-256 `f34de1da...`). Every
  `rel="icon"` the site declares is now the die, so a browser cannot pick the full logo for a
  tab, bookmark or history entry.
- `app/apple-icon.png`: unchanged, the full logo at 180 x 180 (the iPhone and iPad home
  screen). The nav logo and share images are untouched.
- Both icon tests pin the approved files' SHA-256. Old files: scratchpad `followups/favicon/previous/`.
- Not knowable in advance: Google's favicon documentation accepts `apple-touch-icon` as a
  site icon and does not say how it chooses, so search results may show either the die or
  the full logo. Making the home-screen icon the die too would settle it; that is her call.
- Picture: `~/Projects/.lvm-seo-screens-2026-11-13/favicon-installed-tab-size.png` (its intro
  line says search results use the die; per the point above, that part is not verified).

**Analytics (lane D): ready in code, NOT live.**
- No Measurement ID exists anywhere we can see: not in the code, the env files, the live site
  (no tag on `/`, `/contact` or `/schedule`, checked 2026-11-13), the repository docs, Drive or
  her Gmail (no Google Analytics or Tag Manager email for Las Vegas Mahjong). Our Vercel token
  cannot reach the project that serves `www` (`lasvegasmahj-h1iz`, her own account), so the ID
  must be set there by her or with her access.
- Code changes: `components/analytics.tsx` loads Tag Manager only when no GA4 ID is set, so the
  two can never both count a visit. `lib/analytics.ts` now sends each event through `gtag`
  when the GA4 tag is present and pushes to `dataLayer` only when it is not. Before this,
  every event went both ways, and the GA4 tag creates `dataLayer` itself, so events could have
  been counted twice once GA4 was switched on.
- Verified without an ID: with a stand-in `gtag` and `dataLayer` planted in the page (exactly
  what the GA4 tag creates), a real click on a schedule link and a real contact-form success
  each reach `gtag` once, nothing reaches `dataLayer`, and nothing a visitor typed is sent
  (`tests/analytics-events.spec.ts`). Delivery to Google itself cannot be verified until the
  ID is set: check GA4 Realtime or DebugView after the first deploy with the ID.
- Remaining steps, in order, once this branch is live: (1) create a GA4 property for
  `www.lasvegasmahj.com` and a web data stream, and copy its Measurement ID (`G-...`);
  (2) in Vercel, project `lasvegasmahj-h1iz`, Settings, Environment Variables, add
  `NEXT_PUBLIC_GA4_ID` for Production; do not set `NEXT_PUBLIC_GTM_ID`; (3) redeploy (the
  value is read at build time; the same deploy switches on the privacy page's analytics
  section); (4) open the site, then GA4 Realtime, and confirm a page view and a
  `schedule_link_click`: only then is tracking verified; (5) register `source_slug`,
  `source_label`, `inquiry_type`, `link_url`, `link_domain` and `page_path` as event-scoped
  custom dimensions, and mark `contact_form_success` as the one key event for inquiries.
- Two GA4 behaviors to know (from the review): one inquiry sends both `contact_submit` (older)
  and `contact_form_success`, so mark only the second as a key event; and GA4's enhanced
  measurement sends its own outbound `click` event beside `booking_link_click`, so report
  Bookwhen clicks from `booking_link_click` (or turn off outbound clicks in the data stream).
- `booking_link_click` is a click out to Bookwhen, never a booking; completed bookings are
  counted in Bookwhen.

**Done: privacy page (lane E), `/privacy`, linked from the footer's "More" column and listed
in the sitemap.** Written from the code, not from a template; every statement's source (file
and line, or a page fetched on 2026-11-13) is in
`~/Projects/.lvm-seo-screens-2026-11-13/privacy-page-sources-2026-11-13.md`. It covers the
contact form (fields, sent by the browser to Formspree, which emails it), the newsletter
(only the email address goes to Mailchimp), Ask a Rule, Bookwhen bookings and payments,
analytics, cookies and browser storage, links to other sites (affiliate shops, Amazon,
Instagram, TikTok, Facebook), Vercel hosting, children, and changes.
- **It matches the analytics setup automatically.** The analytics section and the cookie
  sentence read the same build-time variable that loads the GA4 tag
  (`NEXT_PUBLIC_GA4_ID`). In a build without the ID (today) the page says "This website does
  not use an analytics service right now." and "This website does not set any cookies." In a
  build with the ID it describes GA4: page views, the `_ga` cookies, each event in plain
  words, that clicking out to Bookwhen is a click and not a booking, that nothing a visitor
  types is sent, Google's partner-sites page and the opt-out add-on. So the page is never
  ahead of, or behind, what the site loads. Tested both ways.
- **Ask a Rule, said exactly as the code does it:** questions go to our server with the last
  few turns; when the AI helper is switched on some go to Anthropic (question and turns only);
  IP addresses are used only for in-memory rate limits; each answer leaves a short record in
  the hosting logs that never includes the words of the question or the conversation
  (`app/api/ask/route.ts`, enforced by `tests/ask-log-privacy.logic.spec.ts`).
- Linked only after each returned 200 on 2026-11-13: Google partner-sites, Google opt-out
  add-on, Intuit (Mailchimp) privacy statement, Bookwhen privacy policy, Vercel privacy
  notice. Formspree is named but not linked (a contact-consistency test allows its address
  only in the contact form); Anthropic is named but not linked (its consumer policy says it
  does not cover business customers' content).
- **For the owner before it ships:** (1) "We do not sell it" (about contact-form details) is
  a business commitment, not something the code can prove: confirm it (she confirmed it on
  2026-11-15: FINAL COPY APPROVALS at the top); (2) update "Last
  updated November 13, 2026" to the go-live date; (3) it is a plain-language notice drafted
  from the code, not legal advice; (4) settled 2026-11-20: the `/ask` disclaimer and `/privacy`
  both say the Ask log never holds the question's words, and the code matches.

**Reviews (lane G) and what changed because of them.**
- Wording and analytics review: fixed the homepage description (open play is not for new
  players), the About description ("nearly 18 years", as in her biography), the About card's
  traveling-instructor framing, and the privacy page's present-tense GA4 claim (now
  conditional on the ID); noted the duplicate GA4 events to configure around (above).
- Visual, booking and accessibility review (comparing the Round 11 build with this one, 15
  pages, desktop and phone): no unintended visual change; every booking and Bookwhen link
  unchanged (20 Bookwhen links on `/schedule`), all internal links 200; icons correct;
  `/privacy` headings, links, contrast (body 6.93:1, links 7.96:1) and 320 px reflow pass.
  Fixed: the "Last updated" line on `/privacy` (4.34:1, now 5.07:1). Passed to the sprint's
  accessibility lane: the About cards' empty slot after the card removal (3 + 2 at desktop),
  the sitewide pink `.section-label` contrast (4.16:1, older than today), and the footer
  column headings being `h5` (older than today).
- **New owner decision found by the review: the homepage headshot (`public/shauna.jpg`)
  carries a "Certified Oh My Mahjong instructor" badge printed onto the photo's bottom-right
  corner.** It shows in the homepage "Meet Your Mahjong Teacher" section and is the share
  image (`OG_SHAUNA`) for `/about`, `/contact`, the three lessons pages and private lessons.
  Options, proposal only (`~/Projects/.lvm-seo-screens-2026-11-13/headshot-badge-options.png`):
  A, a narrower crop (cuts the "MAHJ & MARTINIS" sign); B, a shorter crop (cuts at the knee);
  C, the approved studio photo of her at the "Let's Mahjong" neon sign (already on `/about`).
  Nothing installed.

**Verification (2026-11-13, Round 12):**
- Builds: `UAUcZCWWeETdn3XDyNLu3` (all lanes integrated, reviewed), then
  `oGIIzu4IKNc9F4F9pztaQ` after the review fixes. Before-state for pictures: the Round 11
  build `MlUqTtl0lFc8KqrAHuhNA`.
- `npx tsc --noEmit` clean. Lint: no changed file gained an error (lessons page 5 to 4).
- Logic tests: 543 passed, 7 skipped, 1 failed (the known Find My Mahj drift check).
- Browser, first build: desktop, all 25 browser test files, 337 passed, 5 skipped (phone-only),
  0 failed; phone, the 9 files that cover the changed pages, 119 passed, 7 skipped, 0 failed.
  Second build (after the review fixes), both widths, the 8 affected files: 206 passed, 4
  skipped, 0 failed. Excluded by name, as before: the `/studio` test that fetches a hard-coded
  `localhost:3000` belonging to another session.
- Pictures: `r12-01` to `r12-13` in `~/Projects/.lvm-seo-screens-2026-11-13/` (before and after
  at desktop and phone), `favicon-installed-tab-size.png`, `review-cheers-before-after.png`,
  `review-just-won-before-after.png`, `headshot-badge-options.png`, and the privacy page as it
  reads with analytics on (`r12-13-privacy-*-WHEN-ANALYTICS-IS-ON.png`).

---

# ROUND 11: owner follow-ups on privacy, instructor accuracy and policies (2026-11-13; MERGED AND LIVE 2026-11-16)

**Branch:** `seo/invisible-technical-fixes`, worktree `~/Projects/lvm-seo-invisible`, on top of
Rounds 9 and 10 below. Still one commit (`dc1d628`); everything else is uncommitted. Nothing
is pushed, merged or deployed.

**Owner instructions of 2026-11-13. These are standing rules, not one-off edits:**
- The rule against identifying corporate clients covers content that is already published,
  not only new examples. A testimonial stays only if it can be shown accurately without
  identifying its source. Never invent an attribution and never reword a quote.
- The 18 years of experience are Shauna's. No sentence may imply that every instructor has
  her experience or her certification. Accurate descriptions of the other instructors stay.
- Group lessons are for 4 to 8. That range belongs to group lessons only.
- The parties page speaks to a private group, so its second path is private lessons.
- The full-logo favicon stays installed until she decides on the pink-die crop.

**Done (visible):**
1. **No corporate client is named anywhere, and the quote shows only where it is accurate.**
   The corporate testimonial appears in one place only, the "Corporate Testimonial" block on
   `/mahjong-corporate-las-vegas`, in the client's original words and with no attribution. It
   is not shown under the players' or students' review headings, where it would not be
   accurate. The homepage shows five named reviews, `/about` three. What changed is recorded
   privately, outside this repository.
2. **The 18 years and the certification are stated as Shauna's.** These sentences told a
   visitor that whoever teaches is certified, two of them with 18 years:

   | Where | Before | After |
   | --- | --- | --- |
   | `/mahjong-lessons-summerlin` hero | "A certified Oh My Mahjong instructor with 18 years of experience teaches group and private lessons at our studio ..." | "Shauna, our founder, is a certified Oh My Mahjong instructor with 18 years of experience. We teach group and private lessons at our studio ..." |
   | `/mahjong-lessons-henderson` hero | "A certified Oh My Mahjong instructor with 18 years of experience teaches at our studio ..." | "Shauna, our founder, is a certified Oh My Mahjong instructor with 18 years of experience. We teach at our studio ..." |
   | `/mahjong-lessons-las-vegas` hero (protected page, one sentence) | "Las Vegas Mahjong offers in-person American Mahjong lessons at our Las Vegas studio, taught by a certified Oh My Mahjong instructor." | "Las Vegas Mahjong, founded by certified Oh My Mahjong instructor Shauna, offers in-person American Mahjong lessons at our Las Vegas studio." |
   | `/private-mahjong-lessons-las-vegas` hero | "A certified Oh My Mahjong instructor teaches at your pace, in a quiet room, ..." | "We teach at your pace, in a quiet room, ..." |
   | `/rules/calling-tiles`, lesson box | "Learn from a certified instructor and never second-guess a call again." | "Learn with us and never second-guess a call again." |

   Not visible on the pages, same reason:

   | Where | Before | After |
   | --- | --- | --- |
   | Sitewide meta description (`app/layout.tsx`), the homepage's search snippet | "Certified mahjong lessons, ... Taught by a certified Oh My Mahjong instructor." | "Mahjong lessons, ... Founded by a certified Oh My Mahjong instructor." |
   | Private lessons share description | "Learn at your own pace with a certified Oh My Mahjong instructor." | "Learn at your own pace, in a quiet room." |
   | Parties meta, share and X descriptions | "Certified instructor, all equipment provided." / "Certified instructor, custom quote for your group." | "Fully hosted, all equipment provided." / "Fully hosted, custom quote for your group." ("fully hosted" is the page's own claim) |
   | Summerlin and Henderson meta, share and Service descriptions | "Certified mahjong lessons in ..." / "Certified mahjong instructor serving ..." / "Certified American Mahjong lessons." | "Mahjong lessons in ..." / "Mahjong lessons for ..." / "American Mahjong lessons." |
   | Lessons page meta, share and Course descriptions (protected page) | "... with certified instruction, small classes and private lessons." / "Certified American Mahjong lessons in Las Vegas ..." | "... with small classes and private lessons." / "American Mahjong lessons in Las Vegas ..." |

   Why: the Bookwhen feed lists Mahj 101, 102 and 103 sessions led by more than one instructor
   (49 sessions in the feed read on 2026-11-13), and the record holds credentials and
   experience for Shauna only; nothing says who teaches
   private lessons and hosts parties. Those class titles are the only description of the other
   instructors on the site. They come straight from Bookwhen onto `/schedule`
   (`lib/schedule.ts` `buildEvent`) and nothing about them was changed. Sentences that state
   Shauna's own credentials (in her voice, by name, or as the author of the rules pages, the
   guides and the blog) were kept.
3. **/about: the group-lesson size reads "4 to 8 students max"** (it said 3 to 8, a leftover
   from the pricing in force before June 2026). No other offering gained a minimum: private
   lessons still say one person is fine, open play still says no table of four is needed,
   and the contact form keeps "Just me" and "2-3 people".
4. **/mahjong-parties-las-vegas: the second hero button is "View Private Lessons"** and goes
   to `/private-mahjong-lessons-las-vegas` (it was "View Lessons Instead", to the group
   lessons page).
5. **Sitemap `lastModified` is 2026-11-13** for the nine pages whose visible content changed
   in this round: `/`, `/about`, `/mahjong-corporate-las-vegas`, `/mahjong-parties-las-vegas`,
   `/mahjong-lessons-las-vegas`, `/mahjong-lessons-summerlin`, `/mahjong-lessons-henderson`,
   `/private-mahjong-lessons-las-vegas`, `/rules/calling-tiles`. As with Round 10, re-set
   these to the real go-live date at merge.

**Done (not visible):**
- The client-name guard is now project-wide and does not spell the name: see the tests below.
  No file in the working tree spells the client's name.

**Tests added:** `tests/seo-round11-followups.logic.spec.ts` (8) and
`tests/seo-round11-followups.spec.ts` (10 per browser project).
- No file in the project spells the client's name. The test hashes every word in the project
  and compares it with a SHA-256 fingerprint, so the name is not written in the test either.
  The browser test does the same on the served HTML of `/`, `/about` and the corporate hub.
- The quote appears in one source file only, the hub, in the client's original words, with no
  attribution. Every review on the homepage and About lists has a plain reviewer name. Every
  homepage review card shows its author line.
- On every page except `/about` and the sitewide founder record, a sentence that mentions the
  18 years must name Shauna or be in her voice, and may not credit "every", "all" or "our"
  instructors.
- On the same pages, a sentence that puts "certified" next to teaching, lessons, parties or
  what a booking includes must name Shauna, be in her voice, or be an authorship line
  ("written", "explained", "answered" by, or "founded" by). Titles are left out on purpose:
  they are the owner's wording. The brand name "Oh My Mahjong" is set aside first; its "My"
  had let three of the old sentences through in a first draft of the test. Checked against all
  eleven old wordings: every one fails it.
- Published images: no GPS entry in any image under `public/`, subfolders included.
- The About class size and the parties button (clicked, at both widths, and checked to fit
  the screen).

**Checked, no change needed:**
- **"Black Mountain" stays on the Henderson list.** The City of Henderson's own GIS
  "Planning Areas" layer lists BLACK MOUNTAIN (about 1,276 acres) beside ANTHEM, CADENCE,
  INSPIRADA, MACDONALD RANCH and WHITNEY RANCH:
  `https://maps.cityofhenderson.com/arcgis/rest/services/public/OpenDataDevelopment/MapServer/4`
  (queried 2026-11-13). The federal names database knows the name only as the summit, so
  describe it as a part of Henderson, never as a master-planned community.

**Left for the owner (nothing below was changed):**
- **About page, "for an added fee".** Not supported by any record. No amount or policy is
  documented anywhere (repository, saved notes, Drive), and the standing decision of
  2026-09-05 is "no travel fees" in copy. The sentence dates from 2026-08-10, before that
  decision; the September test forbids "travel fee" and so never caught "added fee". Hers to
  decide: keep it (if a fee is real), drop the four words, or use the approved lessons-page
  wording ("If you would rather learn one on one, at your own pace, I also teach private
  mahjong lessons at the studio.").
- **Where the corporate quote shows.** It stays in the one corporate block. If she ever wants
  it shown anywhere else, it must be in the client's exact original words, and where it would
  sit is hers to decide.
- **Instructor wording kept, for her decision.** (a) The lessons page's share title, "Mahjong
  Lessons Las Vegas | Certified Instructor | Las Vegas Mahjong" (share titles are hers; she
  asked on 2026-11-12 that they not be changed without reason). (b) Shauna's own first-person
  introductions are labelled "Your Instructor" on the lessons page and "Meet Your Mahjong
  Teacher" on the homepage; both pages are protected. A label such as "Our Founder" would stop
  implying she teaches every class. (c) The tagline "Certified Oh My Mahjong instructor." in
  the footer and the sitewide share description describes the business, which has one. One
  answer settles all three: is the certification Shauna's alone, and does anyone but Shauna teach
  private lessons or host parties?
- **"18 years of experience".** Every source describes the 18 years as years of playing
  (certified and in business since 2025). The bare phrase is the owner's own (PR #20) and
  was kept.
- **Favicon.** The full logo is still installed. A tab-size comparison with the pink-die crop
  (source rectangle left 552, top 300, 149 x 149) is in the screenshots folder.

**Analytics: exact setup, nothing enabled.** No analytics is connected and none is
documented: the repository, the main checkout's notes, the saved notes and the Drive records
all describe analytics as absent, and the older standing decision in this file is "Do not
enable GA4 or GTM". The owner asked on 2026-11-13 for the remaining steps only.
- Supported setup, from `components/analytics.tsx`: set exactly one of `NEXT_PUBLIC_GA4_ID`
  (a GA4 Measurement ID, starts with `G-`; the direct tag) or `NEXT_PUBLIC_GTM_ID` (a Tag
  Manager container ID, starts with `GTM-`). `NEXT_PUBLIC_META_PIXEL_ID` is optional and
  separate. Setting both GA4 and GTM double-counts.
- Where: the Vercel project that serves `www` (`lasvegasmahj-h1iz`), Production environment.
  The value is read at build time, so it takes effect on the next deployment, not before.
  Never write an ID into the code (test-enforced).
- GA4 direct is the shorter path: the events arrive in GA4 with no further configuration.
  With GTM each event also needs a trigger and a tag in the container.
- Events: `schedule_link_click`, `booking_link_click`, `contact_link_click`,
  `contact_form_attempt`, `contact_form_success`, `contact_form_error`, plus the older
  `contact_submit`, `newsletter_signup` and Ask events. The six new ones exist only on this
  branch, so they report only after it is merged and deployed.
- `booking_link_click` is a click that leaves for Bookwhen. It is not a booking. Completed
  bookings happen on bookwhen.com, where this site cannot see them; count them in Bookwhen.
  Whether Bookwhen can report bookings to Google Analytics was not verified.
- To see `source_slug`, `source_label` and `inquiry_type` in GA4 reports, register each as an
  event-scoped custom dimension. Mark `contact_form_success` as the key event.
- The site's response headers (`next.config.ts`) do not block the tag.
- The site has no privacy page. Google's terms for Analytics require a privacy notice that
  discloses its use, so that page is a prerequisite, and its wording is the owner's.

**Notes for whoever pushes this branch:**
- The Brand reviewer's instructions in `.claude/workflows/pre-push-gate.js` (line 78) still
  say "$50/person with $200 minimum". That is stale against the $60, 4-8 policy and will
  raise a false blocker. Not edited in this round.
- `components/private-events.tsx:13` still says "for any group size" on the homepage's
  Corporate Team Building card; Round 8 removed that claim elsewhere and its test missed
  this line. Not edited in this round.
- Repository history: a history rewrite is the owner's call (FINAL COPY APPROVALS, owner
  item 1).
- A web search for the corporate quote's exact sentence (her own site excluded) found no other
  page that carries it.

**Photos.**
- **Two photos: edited copies proposed, not installed.** For two published photos, an edited
  copy with one small detail removed is in the private pictures folder
  (`~/Projects/.lvm-seo-screens-2026-11-13/`), each beside a before-and-after sheet. Same pixel
  size as the published file. On approval, copy each over its file in `public/` and run the
  Round 11 logic tests. (Approved and installed on 2026-11-15; see OWNER APPROVALS.)
- **Published photos carry no hidden location data (invisible).** Every file in `public/` is
  served as is at its own address, metadata included, so a test fails if any image there
  carries a GPS position.
- **Photo decisions for the owner:** made on 2026-11-15 and applied. They are recorded
  privately, outside this repository (`~/Projects/.lvm-approvals-2026-11-15/private-notes/`).

**Verification (2026-11-13, one build, focused checks):**
- Production build `MlUqTtl0lFc8KqrAHuhNA` succeeded and was served on port 3417 beside the
  Round 10 build on port 3419 for before and after pictures. Both servers were stopped
  afterwards.
- `npx tsc --noEmit`: clean.
- Lint, every file changed in this round compared with `origin/main`: no file gained an
  error. `/mahjong-lessons-las-vegas` went from 5 errors to 4, and Summerlin and Henderson
  keep their 2 each (all `no-html-link-for-pages`, all older than this round).
- Logic tests, all of them: 530 passed, 7 skipped, 1 failed. The failure is the Find My Mahj
  drift check in `tests/ask-engine.logic.spec.ts`, which fails locally because the sister
  repository has five approved entries this one has not triaged; it is not related to this
  round and skips in CI.
- Browser tests against the new build: the 19 of 21 browser test files that visit a page
  changed today, at desktop width: 324 passed, 5 skipped (phone-only tests), 0 failed. At
  phone width, the five files that check the changed pages' layout and wording: 64 passed,
  4 skipped, 0 failed. Excluded by name: `tests/studio.spec.ts` "the Place carries its two
  verified room photographs", which fetches from a hard-coded `localhost:3000` that belongs to
  another session; `/studio` did not change in this round.
- Pictures for the owner, all in `~/Projects/.lvm-seo-screens-2026-11-13/`: `01-` to `10-`
  before and after pairs of every visible change at desktop and phone width, the favicon
  tab-size comparison, and the two photo proposals with their before-and-after sheets.
  Keep the folder private: the "before" panels show details since removed from the site.

---

# ROUND 10: owner-approved visible improvements (2026-11-12; MERGED AND LIVE 2026-11-16)

**Branch:** `seo/invisible-technical-fixes`, worktree `~/Projects/lvm-seo-invisible`, on top of
the Round 9 work below. Nothing is committed beyond `dc1d628`, nothing is pushed.

**What changed the rules:** on 2026-11-12 the owner approved a specific list of visible
improvements and confirmed these business facts. They are the source for the copy and the
structured data in this round; do not re-derive or soften them.
- Lessons are available at the studio, at customers' homes and at venues, including in
  Summerlin and Henderson. The studio is the one business location: there is no Summerlin or
  Henderson branch.
- Accepted payments are card, cash, Venmo and Zelle. Online booking (Bookwhen checkout) takes
  card only.
- The Instagram and TikTok accounts are business accounts.
- The logo file she supplied (1254x1254, navy background) is approved for favicon assets.
- Corporate examples may name verified venues and use approved real photos, but must never
  identify the client or company that booked.

**Done (visible):**
1. **/studio: the "Leagues" link takes the standard green in-text style**
   (`style={{ color: "var(--green)", fontWeight: 600 }}`), replacing the unstyled anchor of
   Round 9 item 4.
2. **Footer: a "Visiting Las Vegas?" link to `/play-mahjong-las-vegas`**, first in the Events
   column, directly above "Open Play Events" and not beside the private or corporate links.
   The visitor page is open play for people who already play; the label does not sell a
   private experience. Untagged, like every footer link. The visitor page goes from four
   linking pages to every page.
3. **Keyboard focus and contrast.** One zero-specificity rule,
   `:where(a:focus-visible)`, gives every link a 2px green ring (the Ask chips already had
   the same ring; elements with their own focus style keep it). The footer link colour went
   from white at 0.45 to white at 0.49, the lowest step that holds 4.5:1 over the lightest
   parts of the footer's tile texture (it was 4.34:1 on flat navy). Still below 4.5:1 and
   NOT changed, because they are not links: `.footer-brand p` (4.34), `.footer-bottom`
   (2.62) and the footer's small-print paragraph (1.83).
4. **Summerlin and Henderson lesson pages rewritten for accuracy.** Both now say the studio
   inside Lucky Hare on West Sahara is the one location, that there is no local branch, and
   that a lesson at a home or venue is available by request. Each explains the three ways to
   learn with its own link: a group class (`/schedule`), a private lesson at the studio
   (`/private-mahjong-lessons-las-vegas`), or a home or venue lesson
   (`/contact?source=summerlin` / `?source=henderson`, new attribution slugs that prefill
   "Private Lesson"). Every "we come to you" sentence, the unconfirmed "we've taught in..."
   claim and the "we serve you" promise are gone. Titles, H1s, URLs and the "Book" buttons to
   `/#classes` are unchanged. Henderson keeps its neighbourhood names, now framed as parts of
   the city ("These are parts of Henderson, not studio locations"). Both pages' meta
   descriptions and share text now name the studio and "by request" (Henderson's share text
   used to say "We come to you"); both `Service` nodes gained `@id`/`url` and a description
   that matches the page. No travel time, fee, capacity, price or venue
   partnership is stated anywhere.
5. **Payment methods.** The sitewide `paymentAccepted` is now "Cash, Credit Card, Venmo,
   Zelle". The schedule's payment note reads: "Secure your seat with card payment when you
   book online. ... We accept card, cash, Venmo and Zelle; online checkout takes card only."
   The second half is deliberate: that note sits beside the booking calendar.
6. **Favicon.** `app/favicon.ico` (16, 32, 48), `app/icon.png` (512) and
   `app/apple-icon.png` (180) are the owner's logo, the whole square, resized only (Lanczos,
   no crop, recolour or redraw). The stock create-next-app icon is gone. The full logo cannot
   be read at 16 or 32 pixels; a crop of the pink die from the same artwork (source rectangle
   left 552, top 300, 149x149) reads clearly and was shown to the owner as a proposal. It is
   NOT installed: she asked to see a crop before it is used.

**Done (not visible):**
7. **About page structured data.** Instagram and TikTok moved from the `Person`'s `sameAs` to
   the business node inside `worksFor`. The destinations are unchanged.
8. **Private lessons `Service`** gained `@id`/`url`, so every page-level `Service` on the site
   is now tied to its page (test covers all twelve).
9. **Measurement, wired but dormant.** See "Analytics" below.

**Corporate event proof: NOT published, by the owner's own rule.** She asked for two or three
venue-based examples only where venue, event details and photo are all supported by project
evidence, and for proposed copy plus a list of missing assets otherwise. The evidence falls
short: what is on record does not support a venue example without identifying a client, the
approved shoot photos come from one event whose venue and type are recorded nowhere, and the
partner-venue evenings on record were public open play, not company bookings. Three answers
from her would unlock a section; the questions and the evidence behind them are recorded
privately, outside this repository. Proposed copy is in the session report of 2026-11-12;
nothing was added to `app/mahjong-corporate-las-vegas/page.tsx`.

**Analytics: what exists, what was added, what is still off.**
- **No analytics account is connected.** The live site loads no analytics script at all
  (checked on /, /contact and /schedule on 2026-11-12): `NEXT_PUBLIC_GA4_ID`,
  `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_META_PIXEL_ID` are unset, so `components/analytics.tsx`
  renders nothing and every `trackEvent` call is a no-op. Nothing is measured today, and
  nothing in this round changes that until the owner sets an ID in Vercel and redeploys. No
  ID may be written into the code (test-enforced).
- **Before this round** the code tracked `contact_submit` (only after the form service
  confirmed success, no parameters), `newsletter_signup` and the Ask events. Schedule clicks,
  Bookwhen clicks, inquiry-button clicks, form attempts and form failures were not tracked,
  and a corporate inquiry could not be told apart from any other.
- **Added:** `contact_form_attempt`, `contact_form_success` and `contact_form_error`, each
  with `source_label` (the attribution label) and `inquiry_type` (the chosen option), so a
  corporate inquiry is a success whose inquiry type or source is corporate; and, through one
  delegated listener (`components/track-clicks.tsx`), `schedule_link_click`,
  `booking_link_click` and `contact_link_click` with the destination, the `source` slug and
  the page path. `contact_submit` is unchanged and fires together with
  `contact_form_success`: mark only one of them as a key event.
- **Never sent:** anything a visitor typed. The form passes only the two site-defined values
  to analytics, and the click events carry only a path, a host and a shape-checked slug.
  The contact form is now `method="post"`, because a submit made before the script loads
  used to reload `/contact` with the name, email, phone and message in the address, which
  any analytics tag would record on its own.
- **Not measurable from this site:** a completed Bookwhen booking. `booking_link_click` is
  the click that leaves for bookwhen.com, nothing more.

**Booking paths (small fixes only, each measured on the running site first):**
10. **Lessons page, closing buttons.** On phones "Back to Homepage" wrapped onto "Book a
    Lesson" and took 25 to 32 percent of its tap area. The two anchors now sit in the same
    flex wrapper the page's own hero uses. Labels and hrefs unchanged.
11. **Lessons page, hero.** The secondary button "Learn More" led to the homepage, like every
    other button on the page. It is now "See the Class Schedule" to `/schedule`, a label the
    private lessons page already uses for that destination. The eight class-booking buttons
    that point to `/#classes` on purpose (Round 2) are untouched.
12. **Schedule, "Private & Parties" card.** It said "contact for pricing" and had no link.
    It now ends with "Plan Something Private" to `/contact?source=schedule` (new attribution
    slug, label "Schedule page", no inquiry prefill because the card covers lessons and
    parties).
13. **Open play page, hero button.** "See Open Play Dates" landed above the dates; it now
    goes to `/schedule#calendar`. The page's closing button still goes to `/schedule`.

Reviewed and left alone: the corporate path (two taps, clear); the parties page's "View
Lessons Instead" button, which sends a private group to the group lessons page (changing it
to private lessons is a judgment about intent, so it is the owner's); and everything a
recorded decision explains (the `/#classes` buttons, the untagged nav and footer, the
homepage pop-up form, quote buttons landing at the top of `/contact`).

**Verification (2026-11-12, one production build, 45 routes):**
- Typecheck clean. Lint: no new problem in any changed file. The three lesson pages keep
  their known `no-html-link-for-pages` errors on the `/#classes` and `/` anchors (2, 2 and
  4; the lessons page has one fewer than before).
- Source-level tests: 522 passed, 1 failed. The failure is the Find My Mahj drift check,
  which is unrelated and skips in CI.
- Browser tests at desktop and phone, every spec: 644 passed, 14 skipped, 0 failed. One test
  was excluded by name (`studio.spec.ts`, "the Place carries its two verified room
  photographs") because it fetches from a hardcoded `localhost:3000`, which on this Mac is
  another session's server; its condition was checked directly instead, and both studio
  photos return 200 from this build.
- Route crawl, the build before against the build after, 36 routes: the differences are
  exactly the ones listed in this round. No title and no canonical changed. FAQ markup equals
  the visible FAQ on 23 of 23 pages, and all 13 page-level `Service` nodes are tied to their
  page.
- Keyboard: the four new links are reachable with Tab, show the 2px green ring and follow on
  Enter. Icons: the three link tags are generated and each file returns 200 as an image.
- Before and after pictures at desktop and phone sizes are in
  `~/Projects/.lvm-seo-screens-2026-11-12/` (outside the repository).
- Two independent read-only reviews ran before the build (copy and facts; code and
  privacy). Fixed from their findings: the Summerlin search snippet and share text, which
  had been left reading as lessons located in Summerlin; Henderson's snippet listing Green
  Valley and Anthem beside Henderson instead of inside it; two passive sentences; the
  inquiry-source lookup, which matched built-in object keys such as `?source=constructor`
  and left the lead unattributed; and the page path sent with click events, now limited to
  site-shaped paths.

**Tests:** `tests/seo-round10-visible.logic.spec.ts` and `tests/seo-round10-visible.spec.ts`
(payment note and structured data, About accounts, favicon files and link tags, both local
pages, keyboard focus, the four booking-path fixes, the form's privacy safeguard);
`tests/analytics-events.spec.ts` (each event against a planted dataLayer and a mocked form
service; asserts nothing a visitor typed is sent, and that nothing is recorded when no
analytics is loaded); `tests/seo-round9-links-titles.*` (the Leagues link, the footer link,
the three titles). Updated: `tests/round3-contact.logic.spec.ts` (fifteen attribution slugs,
twelve prefills, three new tagged pages, and the link counter now also reads links declared
as data) and `tests/seo-round4-visitors.spec.ts` (one click scoped to `main`, because the
footer now carries a second link to the visitor page).

**Sitemap dates** for /schedule, /mahjong-lessons-las-vegas, /mahjong-lessons-summerlin and
/mahjong-lessons-henderson are set to 2026-11-12, the day the visible copy changed locally.
Per the standing rule they must be re-set to the merge date when this ships.

**Left for the owner:**
- **Favicon crop.** Approve the pink-die crop for the small icon sizes, or keep the full
  logo, which cannot be read at tab size.
- **Corporate examples.** Three answers from her (see "Corporate event proof" above; the
  questions are recorded privately).
- **Analytics.** Create or locate a GA4 property or GTM container and set its ID in Vercel
  (`NEXT_PUBLIC_GA4_ID` or `NEXT_PUBLIC_GTM_ID`), then redeploy. Until then nothing is
  measured. With GTM, each event also needs a trigger and tag in the container.
- **About page, travel line.** `app/about/page.tsx` still says "I can travel across
  Summerlin, Henderson, and the greater Valley for an added fee." The owner's standing
  decision is no travel fees in copy; whether a fee exists is hers to say. Proposed
  replacement, already approved wording from the lessons page: "If you would rather learn
  one on one, at your own pace, I also teach private mahjong lessons at the studio."
- **Who teaches.** Both local pages (and the protected lessons page) say a certified
  instructor with 18 years of experience teaches the lessons, while the schedule lists other
  instructors for some classes. Existing wording, kept; hers to confirm or reword.
- **Henderson neighbourhood list.** Kept as geography. "Black Mountain" could not be
  confirmed as a neighbourhood name from a public source; confirm, rename or drop.
- **Parties page.** Whether "View Lessons Instead" should point to private lessons.
- **A small detail in two published photos.** Not client branding, but worth her eye
  (recorded privately; settled on 2026-11-15).
- **Footer text contrast** below 4.5:1 for three non-link items (see item 3).
- **Sitemap dates** on merge day, as above.

---

# ROUND 9: invisible head, schema, link and title fixes (2026-11-10 to 2026-11-12; MERGED AND LIVE 2026-11-16)

**Branch:** `seo/invisible-technical-fixes`, worktree `~/Projects/lvm-seo-invisible`, built on
`main` at `089a729`, the merge commit of PR #126 (the technical audit below).

**Owner rule for this round:** nothing may visibly change. No copy, layout, page, price or
claim. In the first pass (2026-11-10, items 1 to 3) no link or title changed either: a before
and after crawl of a production build showed the body HTML of all 36 crawled routes identical
and every title, description, canonical, robots directive, `og:url`, H1 and FAQ unchanged.
Later passes on 2026-11-12 (items 4 to 8) added one link, set three owner-chosen titles and
made two more invisible fixes. The owner then approved visible changes: those are Round 10.

**Search data:** the repository holds no Search Console export or SEO report file. The only
performance data is the owner-supplied three-month query table in the Round 1 record below.
This round makes no ranking or traffic claim.

**Re-verified clean on `089a729`:** sitemap (33 URLs, all 200, all self-canonical), robots.txt,
the 410, the three 301s, the trailing-slash 308, 404 handling, FAQ markup against visible text
on 23 of 23 pages, breadcrumb targets, one title and one H1 per page.

**Fixed (3 defects):**
1. **Share images lost their size and alt text on 32 routes.** The root layout publishes
   `og:image:width`, `height`, `alt` and `type`, but a page-level `openGraph` replaces the root
   object, and those pages passed a bare URL. Every page except the homepage and leagues
   shipped a share image with no dimensions and no alt text, on both card formats. Pages now
   use `OG_HERO`, `OG_SHAUNA` or `studioOgImage(photo)` from `lib/og.ts`. Sizes are checked
   against the JPEG files; alt text is the wording the root layout and `lib/studio-photos.ts`
   already publish.
2. **Four corporate Service nodes were anonymous.** The hub, team building, conference and
   convention pages published a `Service` with no `@id` or `url`, while the four newer
   corporate pages tie theirs to the page. All eight now carry `@id` `<canonical>#service`
   and `url` `<canonical>`. No description, area or audience changed.
3. **Two article pages shared as "website".** /learn-mahjong and /mahjong-sets-guide carry
   Article schema with a headline and author, a visible instructor byline and long-form
   editorial copy, but inherited `og:type` website from the `ogBase` spread. The site's own
   blog posts declared `type: "article"` beside their Article schema. Both pages now do the
   same. No dates or author tags were added, because neither page shows a publish date.

**Added 2026-11-12, still invisible on the page:**

4. **/studio links the word "Leagues" to `/mahjong-leagues-las-vegas`.** The leagues page had
   one inbound link (/schedule); it now has two. The link was first built as an unstyled
   anchor, because the owner's rule at that point was that the page must look the same. Later
   the same day she approved the site's standard green in-text style for it (Round 10, item
   1), so the unstyled form no longer exists. One finding from the unstyled build is worth
   keeping: wrapping a word in a link is never pixel-exact in Chromium. The linked word
   becomes its own text fragment, snapped to 1/64 px, and three to five nearby letters shift
   their smoothing by a quarter pixel (272 of 9.3 million pixels at desktop). Report such a
   change as "identical to the eye, layout and style identical", never as "pixel-identical".
5. **Three title tags shortened, in wording the owner chose and approved on 2026-11-12.**

   | Route | Before | After (owner-approved) |
   |---|---|---|
   | /private-mahjong-lessons-las-vegas | Private Mahjong Lessons at Our Las Vegas Studio \| Las Vegas Mahjong (67) | Private Mahjong Lessons in Las Vegas \| Las Vegas Mahjong (56) |
   | /rules/scoring | Scoring and Payment Rules in American Mahjong \| Las Vegas Mahjong (65) | American Mahjong Scoring Rules \| Las Vegas Mahjong (50) |
   | /about | About Shauna \| Certified Mahjong Instructor \| Las Vegas Mahjong (63) | Shauna \| Certified Mahjong Instructor \| Las Vegas Mahjong (57) |

   Only the `<title>` changed. H1s, descriptions, canonicals and JSON-LD are untouched. **The
   share titles stay as they were, by owner instruction** (`openGraph.title`, which
   `twitter:title` copies): private lessons and scoring keep the longer wording, and /about
   keeps "About Shauna | Las Vegas Mahjong". A test pins each H1 and share title beside its
   title, so neither follows the title in a later tidy-up. Do not reword these titles without
   the owner. **There is no site-wide title length rule:** the owner asked on 2026-11-12 that
   tests not enforce a 60-character limit across the site, and the test that did was removed.
6. **Visitor page (`/play-mahjong-las-vegas`): no in-text link added.** Two independent
   searches of every page and component found no existing phrase that clearly refers to
   visiting players (the "Vegas Visitor Experiences" card sells a private experience to
   newcomers; "visitors" in the homepage pillar is one generic word on a protected page;
   corporate wording about visiting groups belongs to the corporate pages). The owner then
   approved a footer link instead (Round 10, item 2).
7. **The parties page ties its Service to its page.** `app/mahjong-parties-las-vegas/page.tsx`
   had the same anonymous `Service` node item 2 fixed on the corporate pages. It now carries
   `@id` `<canonical>#service` and `url` `<canonical>`. Nothing else in the node changed.
8. **The leagues page takes its share image from the shared helper.** Its hand-built
   descriptor left out the image type, which made leagues the one sitemap route with no
   `og:image:type`. It now uses `studioOgImage(PLAYERS_AT_TABLE)`; URL, size and alt are the
   same, and the two type tags are added. Every sitemap route now publishes type, width,
   height and alt for its share image (browser-tested across the sitemap).

**Backlog reviewed on 2026-11-12 and deliberately left:** everything else in the technical
audit's "Documented, not changed" list either needs a visible change, an owner decision, or a
setting outside the repository (Vercel, Bookwhen, Google). Two entries in older records are
stale and should not be acted on: Round 4's "open play page body copy is stale" (rewritten in
PR #117) and the Round 1 note that `components/faq.tsx` contradicts studio-first (fixed in
`dfe2981`, 2026-09-05).

**Verification of the Round 9 passes** (same capture method on the build before and the build
after; two captures of the same build differ by 0 pixels):
- Route crawl, 36 routes, last invisible pass: the only differences were the three titles,
  the parties `Service` fields and the two leagues image-type tags. Visible text and body
  markup identical on all 36.
- Screenshots at 1280px and at iPhone 13 size, 280 viewport tiles across 13 pages (the three
  title pages, /studio, the homepage, parties, open play, contact, ask, learn-mahjong, the
  sets guide, /rules and /rules/jokers): 0 differing pixels.

**Tests:** `tests/seo-round9-share-schema.logic.spec.ts` and
`tests/seo-round9-share-schema.spec.ts` cover items 1 to 3, 7 and 8, including a
sitemap-wide check that every share image carries type, size and alt.
`tests/seo-round9-links-titles.logic.spec.ts` and `tests/seo-round9-links-titles.spec.ts`
cover the Leagues link, the footer link and the three titles with their unchanged H1s and
share titles.

**Rule going forward:** a page-level share image is a descriptor from `lib/og.ts`, never a
bare URL string or a hand-built object (test-enforced).

**Left for the owner:** see Round 10 above; the four items Round 9 held back (payment
methods, Summerlin and Henderson wording, the favicon, the About page's social accounts)
were all decided on 2026-11-12 and are recorded there.

---

# TECHNICAL SEO AUDIT, 2026-10-04 (MERGED as PR #126, 2026-10-05 UTC)

**Scope:** every route on `main` at `d7a8212`, technical SEO only. No new pages, no copy or
keyword rewrites, no pricing, Bookwhen or photo changes. Built in the worktree
`~/Projects/lvm-seo-tech-audit`. Report with the route-by-route inventory:
`docs/handoffs/lvm-seo-technical-audit-2026-10-04.md`.

**Verdict:** no critical issues. No accidental noindex, canonical poisoning, broken internal
link, orphan, redirect chain on www, duplicate title or description, or missing sitemap route.
FAQ schema matches visible text on all 23 FAQ pages.

**Fixed in the PR (objective defects only):** the leagues page's page-level `robots` (dropped
the root preview directives; regression of the Round 4 fix) and its missing share image; 30
of 33 wrong sitemap `lastModified` dates; the 404's `og:url` of `/404`; an off-page HowTo on
/learn-mahjong; anonymous Article/CollectionPage authors (now `about#shauna`); `areaServed` on
the /about Person; Summerlin typed `City` on the parties page; no BreadcrumbList on
/schedule; missing `fetchpriority="high"` on LCP images (Next 16's `priority` only
preloads); lazy LCP images on /about and convention; two two-column sections that never stacked on
phones; 300px grid minimums clipping at 320px; a 102KB partner logo. The audit also found
that **CI on `main` was red from PR #121 on**, because a Round 5 guard read `width: "100%"` as
a statistic. That test-only fix shipped on its own as PR #127; after the rebase it is no
longer part of this PR. Rebasing onto Round 8 also moved the sitemap dates of the four routes
whose copy #125 changed (/, parties, Summerlin, Henderson) to 2026-10-05.

**Status changes to items recorded in earlier rounds (as of 2026-10-04):**
- `lasvegasmahj.vercel.app` (Contact consistency "LIVE AND UNFIXED", Round 2 surviving finding
  1) now returns **503 DEPLOYMENT_PAUSED** on every path. The phone-number exposure is no
  longer served. Deleting that project, or a 301 to www, would make it permanent.
- `/schedule` and `/studio` robots (Round 2 surviving finding 2): fixed in Round 4, and the
  same bug on `/mahjong-leagues-las-vegas` is fixed in this PR. A test now forbids a
  page-level robots object on any indexable page.
- Round 4 schema nits (item 7): `areaServed` on the /about Person is fixed. Sitewide Course,
  `courseMode`, `paymentAccepted` and the footer Facebook URL remain open (see the report).
- Parties birthday grid that never stacks (Round 2 known issue 5): fixed in this PR.
  `.btn-primary` display (Round 2 next action 2) is still reserved for the owner.
- Apex 307 (Round 4 item 6): still 307 on 2026-10-04.
- The Round 5 "Still open" claim list (homepage, Summerlin, Henderson, parties, footer): fixed
  by Round 8 (PR #125). This PR adds no copy and reintroduces none of that wording.

**New owner items:** the favicon is the stock Next.js/Vercel triangle (needs an approved
square mark; same blocker for a schema `logo`); `lasvegasmahj-h1iz.vercel.app` serves an
indexable mirror (canonicals neutralize it); FMG links to the apex host; the Thursday league's
Bookwhen description repeats a sentence; the /about Person `sameAs` lists the business's
accounts (keep only if they also represent Shauna); /mahjong-leagues-las-vegas has a single
inbound link.

**Rules going forward:** any PR that changes a route's visible content sets its sitemap
`lastModified` to the go-live date (Bookwhen-fed pages use the last template or copy change;
head-only, schema-only and layout-only CSS changes do not count);
no page-level `robots` object on an indexable page; a page-level `openGraph` brings its own
`images`; FAQPage, HowTo and Course markup earn no Google rich results here.

---

# ROUND 8: stale claim cleanup (MERGED as PR #125, 2026-10-05 UTC)

**Date:** 2026-10-04. **Branch:** `seo/accuracy-sweep` off `origin/main`, built in the
worktree `~/Projects/lvm-seo-accuracy-sweep`.

## Why

This closes out the items the Round 5 handoff listed under "Still open (outside this PR's
scope, owner's call)" below: six claims on the homepage, Summerlin, Henderson and the
parties page, plus one on the sitewide footer, that were either unsourced (an invented
response time or capacity number) or had already been superseded by a standing rule fixed
elsewhere on the site (who supplies furniture vs. equipment; Open Play requires a current
NMJL card and is studio-only, not sitewide).

## What changed (one sentence or phrase per claim, nothing else on each page touched)

| Page | Was | Now |
|---|---|---|
| Homepage FAQ (`components/faq.tsx`) | "otherwise we'll have extras" (NMJL cards, unscoped) | Scoped: lessons get extra cards; Open Play requires your own current card |
| Homepage studio banner (`components/studio-banner.tsx`) | "every level at the same tables" (Lucky Sevens/Open Play) | "for players who already know the game," matching `/studio`, `/mahjong-open-play-las-vegas` and `/play-mahjong-las-vegas` |
| Homepage private events teaser (`components/private-events.tsx`) | "Groups of any size" | "Custom quote for your group size" |
| Homepage inquiry pop-up (`components/inquiry-modal.tsx`) | "I'll be in touch within 24 hours" (x2) | "I'll be in touch soon" |
| Sitewide footer (`components/footer.tsx`) | One sentence attached open play/leagues/tournaments to "the entire Las Vegas Valley" | Re-scoped: open play/leagues/tournaments are at the studio; lessons and private events serve the Valley |
| Summerlin (`app/mahjong-lessons-summerlin/page.tsx`) | "we bring everything"; "We respond within 24 hours" | "bring the mahjong equipment"; "We will get back to you" |
| Henderson (`app/mahjong-lessons-henderson/page.tsx`) | "open play events across the Las Vegas Valley"; "We respond within 24 hours" | "open play at our studio inside Lucky Hare"; "We will get back to you" |
| Parties page (`app/mahjong-parties-las-vegas/page.tsx`) | "any size group" (meta x2); "We bring everything" (Girls' Night); "large corporate events of 50+" (FAQ) | "custom quote for your group" (meta x2); "bring the mahjong equipment"; "large corporate events" with the invented number dropped |

Not changed on the parties page: "we bring all the equipment: tiles, racks, cards,
everything" (the "where do you host" FAQ, which correctly scopes "everything" to mahjong
equipment, not furniture) was not in the owner's named list and is not objectively false, so
it was left alone.

## Follow-up (2026-10-05, same PR): two more capacity claims on the parties page

Before approving, the owner flagged that "perfect for any group size" (Corporate Team
Building card) and "We can host groups of all sizes" (the "how big can the group be?" FAQ)
are the same unsupported-capacity-claim category as the ones this round already removed, and
asked for them revised too, with no numeric capacity invented.

| Was | Now |
|---|---|
| "...communication, strategy, and teamwork, perfect for any group size." | "...communication, strategy, and teamwork." (capacity phrase dropped, nothing invented in its place) |
| "We can host groups of all sizes, from intimate gatherings of 4 to large corporate events. For larger groups, we bring additional support to match your headcount." | "Group sizes vary widely, from intimate gatherings of 4 to large corporate events. Tell us your headcount and we'll bring additional support to match." |

`tests/seo-round8-stale-claims.logic.spec.ts` gained a test guarding against "groups of all
sizes" and "any group size" on this page, alongside the eight original guards.

## Tests

New file `tests/seo-round8-stale-claims.logic.spec.ts` pins all eight fixes so a future
session does not reintroduce any of them.

## Verification

`npx tsc --noEmit` clean. `node scripts/lint-regression.mjs origin/main`: no new errors in
the 9 changed files (2 pre-existing `no-html-link-for-pages` errors on untouched lines in the
Summerlin/Henderson files, unrelated). `pnpm build` succeeds, still 43 routes, no new pages.
Logic suite: all passing except the two pre-existing failures already on `origin/main`
(the Find My Mahj drift check, and the `/las-vegas-meeting-planner-activities` width:100%
false positive the Round 7 handoff already documented), both confirmed to reproduce
identically on a clean `origin/main` checkout in an isolated worktree. Browser suites
(room-cards, seo-round2, round3-contact, contact-consistency, seo-round5-corporate,
site-regression) against a local production build: all passing on desktop-chromium and
mobile. `seo-round4-visitors.spec.ts` and the one studio photo-fetch check in
`studio.spec.ts` were flaky under heavy concurrent load from other sessions on this machine
(Playwright navigation timeouts on a page this PR does not touch); confirmed not a
regression by re-running against a freshly built, idle `origin/main` worktree, where they
passed immediately.

Merged as PR #125 (`599e5f7`, 2026-10-05 17:11 UTC) and live on www.

---

# ROUND 7: corporate hub strengthening (MERGED as PR #124, 2026-10-05 UTC)

**Date:** 2026-10-04. **Branch:** `seo/corporate-hub-strengthen` off `origin/main`, built in
the worktree `~/Projects/lvm-seo-corporate-hub`.

## Why

Search Console shows `/mahjong-corporate-las-vegas` getting impressions mostly for generic
terms (las vegas mahjong, mahjong lessons las vegas, mahjong casino las vegas, mahjong las
vegas, vegas mahjong lessons), not corporate-intent queries. The owner asked for the page to
read more clearly as the corporate service hub without cannibalizing the Round 5 cluster.

## What changed (hub page only; the six supporting pages already linked back to the hub
## with descriptive anchor text, so none of them needed edits)

- **Title kept** (no ranking data yet to justify changing an exact-match title, per the
  Round 4 decision already on record).
- **H1**: "Corporate Mahjong in Las Vegas" -> "Corporate Mahjong Events in Las Vegas", now
  matching the title.
- **Meta/OG/Twitter descriptions** and the **Service schema** description/audience now name
  company events, employee events, client entertainment and meeting/convention groups. The
  visible meta description still avoids "client entertainment", "company parties" and
  "incentive", which `tests/seo-round5-corporate.logic.spec.ts` reserves for the occasions
  page's description.
- **Hero paragraph** leads with the corporate-intent phrasing instead of starting mid-service
  description.
- **Internal links added**: the Corporate Team Building, Conference and Convention Groups,
  and Incentive and Visiting Groups cards in the "What We Do for Organizations" section each
  gained an inline, descriptive link to their dedicated page (mirroring the pattern the
  Client Entertainment/occasions card already used). One new bridge sentence links to the
  meeting-planner page, which previously had no contextual link from the hub's body copy
  (only the generic related-experiences card grid).
- Trade show booth activities is deliberately still not linked directly from the hub
  (unchanged architecture: reached via convention, conference and the occasions page).
- Sitemap `lastModified` bumped for the hub only.

## Cannibalization map (unchanged from Round 5, restated for this audit)

Hub = how we run corporate events (what we provide, how it works, the programs, how to
book). Occasions page = which occasion. Team building = why mahjong works for a team, what
happens at the table. Conference/convention = conference vs. convention buyer. Meeting
planner = any meeting, by agenda slot. Incentive = reward trips, DMC/VIP. Trade show booth =
exhibitors/sponsors, reached through convention/conference/occasions, not the hub.

## Verification

`npx tsc --noEmit` clean. `node scripts/lint-regression.mjs`: no new errors in either changed
file. `pnpm build` succeeds. Logic suite (seo-round5-corporate, seo-round6-owner-wording,
seo-round4-visitors, seo-round2, round3-contact, studio): 210 passed, 1 pre-existing failure
on `/las-vegas-meeting-planner-activities` (a `width: "100%"` inline style misread as a
percentage claim by a regex guard) that reproduces identically on `origin/main` and is
unrelated to this PR. Browser suite (seo-round5-corporate, seo-round2, round3-contact) on
desktop-chromium and mobile against a local production build: 168 passed, including every
internal link on the page resolving and the hub still linking to all five pages Round 5
required.

Merged as PR #124 (`d7a8212`, 2026-10-05 01:09 UTC) and live on www.

---

# ROUND 5: corporate and group landing pages (MERGED as part of PR #117)

**Date:** 2026-09-29. Same branch and worktree as round 4.

## Architecture (one buyer question per page)

| Page | Owns | Parent |
|---|---|---|
| `/mahjong-corporate-las-vegas` | how we run corporate events (the service) | root, nav "Corporate" |
| `/corporate-event-activities-las-vegas` (new) | occasions: appreciation, client entertainment, sales meetings, executive retreats, holiday parties, offsites, charity | hub |
| `/corporate-team-building-las-vegas` | team building, offsites | hub |
| `/las-vegas-meeting-planner-activities` (new) | any meeting, by agenda slot | hub |
| `/conference-activities-las-vegas` | conferences and conference networking | hub |
| `/convention-activities-las-vegas` | convention organizers and attendee groups | hub |
| `/trade-show-booth-activities-las-vegas` (new) | exhibitors and sponsors: booth, hospitality suite, sponsored lounge, experiential | convention |
| `/incentive-group-activities-las-vegas` (new) | reward trips, DMC programs, VIP groups | hub |
| `/play-mahjong-las-vegas` (round 4) | visitors who already play | studio |

**Not built, on purpose:** `/conference-networking-activities-las-vegas` (the conference page
already is it), and standalone offsite, client entertainment, employee appreciation, executive
retreat, sales meeting, hospitality suite, DMC and experiential marketing pages (each is a
section of a page above). Do not add them without Search Console evidence of separate demand.

`components/related-experiences.tsx` is the contextual link system: each corporate page picks
its next-step cards. The primary nav, footer and homepage are untouched. The hub shows six
cards; the booth page is reached through convention, conference and the occasions page.

## Rules this round held (tests in `tests/seo-round5-corporate.*`)

- Venues named come only from the owner's list: hotels, conference rooms, ballrooms, corporate
  venues, convention settings, hospitality suites, private rooms, offsite events.
- No capacity, client, price, statistic, testimonial, result or response time on the new pages.
  Corporate hosting is never placed at the studio (only Social Open Play and private lessons are).
- Every new page conveys the seven roles (team building, networking, engagement, breakout,
  client entertainment, hosted social, group activity) without identical copy across pages.
- Titles, descriptions (155 max), serviceTypes and FAQ questions are unique across the cluster.

## Owner decisions made in the final pass (2026-09-29), now standing rules

1. **Furniture:** the client, hotel or venue provides the event space, tables and chairs. Las
   Vegas Mahjong provides the mahjong equipment, game materials and facilitation. Never write
   "we bring everything", "we fill the room with tables" or anything implying we supply
   furniture. Tests enforce it on all eight corporate pages.
2. **DMC terms:** only "Partner and referral arrangements are available for DMCs and event
   professionals. Contact us to discuss your program." No commission rate, no insurance or
   COI claim.
3. **Hub vs team building:** the hub answers what we provide, how an event comes together,
   which programs we support and how to book. Team building answers why mahjong works for a
   team and what happens at the table. Different openings, cards and closing sections.
4. **Open Play** (`/mahjong-open-play-las-vegas`): primarily Lucky Sevens; social play, not a
   lesson; for players who already know the game, including Mahj 101 graduates; solo or with
   friends; advance registration; bring your current NMJL card (never say cards are
   provided); $20 a session, $85 for a 5-pack. **Prices live only in `lib/pricing.ts`.** The
   visitor page, schedule card, studio Lucky Sevens copy and schema no longer invite complete
   beginners to Open Play.
5. **Legacy claims removed:** "thousands of conventions", "top convention city", "Scales to
   100+", "10 to 100+", "any size" / "no matter how big", and reply-time promises on the
   corporate pages, contact, parties and private lessons.

## Still open (outside this PR's scope, owner's call)

- **Homepage, Summerlin, Henderson, parties page and footer claims: FIXED in Round 8** (see
  that section above). The six-bullet list that used to live here (homepage FAQ/studio
  banner/private events/inquiry pop-up, Summerlin, Henderson, the parties page, and the
  footer) is now the "What changed" table in Round 8. Do not re-add any of the old wording.
- Bookwhen listings (owner-side): Social Open Play says "Drop in and play"; the Halloween
  special says "All levels welcome"; booking pages show her phone and gmail.

Architecture record in Drive: LVM/Marketing, "LVM SEO Content Architecture - Corporate, Group
and Visitor Clusters (2026-09-29)".

---

# ROUND 4: visiting players page and corporate cluster (MERGED as part of PR #117)

**Date:** 2026-09-29. **Branch:** `seo/play-mahjong-visitors` off `origin/main` at `cb28ed6`,
built in the worktree `~/Projects/lvm-seo-visitors`.

## What shipped on the branch

- **New page `/play-mahjong-las-vegas`** for visitors who ALREADY play American Mahjong. Owner's
  title (absolute, no brand suffix) and H1. Studio inside Lucky Hare, Social Open Play in Lucky
  Sevens, solo or with friends, no table of four needed, advance registration, American Mahjong
  with the NMJL card and not Riichi, honest level guidance (all levels welcome, Mahj 101 is the
  better first step for someone who has never played). 11-question FAQ with FAQPage JSON-LD
  generated from the same array as the visible FAQ. Breadcrumb. No Event markup (that stays on
  `/schedule`). Private groups go to private lessons, parties, corporate, or
  `/contact?source=visitors` (new attribution slug, no inquiry prefill).
- **The page lists the next four regular Social Open Play sessions from the Bookwhen feed.**
  Filter: studio venue, title starts with "Social Open Play", no price in the title, and the
  session has not already ended today (the feed only drops past DAYS; `/schedule` still shows a
  session that ended earlier today with a Book button, pre-existing).
- **`/mahjong-open-play-las-vegas`** no longer competes with it: description rewritten (it still
  said "across Summerlin and Henderson"), title made absolute (was 68 characters and cut off),
  OG title and image fixed, and the SportsOrganization node (a rival organization with a
  city-only address) replaced by a Service. One link sentence to the new page.
- **Sitewide LocalBusiness:** `containedInPlace` names Lucky Hare by the `#studio` @id (no second
  address, tests enforce one PostalAddress); description now states the real offering, no
  "premier"; `knowsAbout` adds American Mah Jongg, NMJL card, open play; Social Open Play offer
  added. **`OPEN_PLAY_SERVICE` in `lib/schema.ts` is the single node** used by both the offer
  catalog and the open play page (`#service` @id). WebSite description also lost "premier".
- **`/schedule` and `/studio` no longer set a page-level `robots` object.** In Next it replaces
  the root object, which silently dropped `max-image-preview:large` and `max-snippet:-1`.
  `/schedule` also got a real title ("Mahjong Class & Open Play Schedule"), a description and its
  first share image, plus one link sentence in the Open Play card.
- **Corporate cluster:** titles deliberately KEPT (exact match, within length, no ranking data to
  justify a change). Descriptions trimmed under 155 and differentiated. `serviceType` on each
  Service. Summerlin City to Place. Hub H2 no longer duplicates the team building H2. Conference
  and convention link to each other. One FAQ on the hub (incentive trip / visiting company
  group) and one on team building (corporate offsite), each sourced from claims already on
  those pages.
- **Sitemap:** new URL at 0.85; lastmod updated only on pages whose content changed.

## Visible changes on existing pages (everything else verified identical to production)

Open play page: one sentence. Studio: one sentence in the Lucky Sevens card. Schedule: one
sentence in the Open Play card. Corporate hub: H2 wording and one FAQ. Team building: one FAQ.
Conference and convention: one cross-link sentence each. Homepage: NONE (head JSON-LD only).

## Verification

Three independent reviewers (facts against Bookwhen and site copy; technical SEO and schema;
visual diff against production at 1280 and 390, plus 320/360). Fixed from their findings: the
NMJL card answer (Bookwhen says "Bring your 2026 NMJL card"; the homepage FAQ's "we'll have
extras" does NOT apply to open play), a past session showing a Book button, specials leaking
into a list whose copy says two hours in Lucky Sevens, an unconditional "you can play" promise,
buttons breaking apart at 360px, a third inbound link, and the duplicate open play service.
Tests: `tests/seo-round4-visitors.logic.spec.ts` and `tests/seo-round4-visitors.spec.ts`.

## Owner decisions left open (not done, on purpose)

1. **Bookwhen pages publish her phone number and gmail** in their footer, and every Book button
   leads there. Bookwhen account settings, not site code.
2. **Homepage FAQ says "we'll have extras" for NMJL cards**, Bookwhen says bring your own for
   open play. Homepage is protected; owner wording.
3. **Open play page body copy is stale:** hero label "Summerlin · Henderson · The Whole Valley",
   "great venues across the Valley", "restaurants, wine bars". Every feed event is at Lucky Hare.
4. **Footer link to `/play-mahjong-las-vegas`** would take it from 3 to ~30 inbound links, but it
   changes the footer on every page including the homepage.
5. **Corporate hub and team building still share copy** (opening lines, the four "why mahjong"
   cards). Conference still has a booth-draw format and "Conventions" in its label.
6. **Apex domain redirects with a 307** (temporary) to www. Vercel domain setting on
   `lasvegasmahj-h1iz`, should be 308.
7. Pre-existing schema nits: `courseMode` on Course (schema.org allows it on CourseInstance),
   `areaServed` on the /about Person, sitewide Course markup on every page, unsourced
   `paymentAccepted`, footer Facebook uses the numeric profile URL while `sameAs` uses the vanity URL.

## Proposed pages (recommendation, NOT built)

`/conference-networking-activities-las-vegas` SKIP (the conference page already is that page).
`/corporate-offsite-las-vegas` MERGE into team building (done via FAQ and description).
`/meeting-planner-las-vegas-activities` MERGE into conference and the hub.
`/incentive-travel-las-vegas-activities` BUILD LATER, only once the owner supplies real
incentive or DMC facts (a program run, capacity, lead time). Without them it would be thin.

---

# CONTACT CONSISTENCY CLEANUP (CLOSED, MERGED, LIVE)

**Date closed:** 2026-09-06
**Merged as:** **`2d0a4dd`** (PR #106), **`a7eda81`** (PR #107), **`7aff7ef`** (PR #108)
**Base:** `origin/main` at `8986ae4`
**Production:** LIVE on `www.lasvegasmahj.com` via `lasvegasmahj-6104s-projects / lasvegasmahj-h1iz`.

## The owner reversed an instruction. Read this before "fixing" a phone field.

She now wants a phone number **REQUIRED** on inquiry forms. She still will **not** publish her
own number. These are opposite things and the codebase does the first and not the second:

- **COLLECT the visitor's number: required.** `/contact` has a required `type="tel"`
  `name="phone"`. The homepage modal inherits it.
- **PUBLISH her number: still forbidden.** No `tel:` link, no `telephone` in structured data,
  no business number in copy. Every guard from rounds 1 and 2 still passes untouched.

A `type="tel"` input trips none of the guards, because they all need the colon in `tel:`.

## Phone validation, and two traps already hit

Digit counting (10 to 15) via `setCustomValidity`, with **no `pattern` attribute** on purpose: a
regex rejects formats the owner explicitly asked to accept. Accepts `7025551212`,
`702-555-1212`, `(702) 555-1212`, `+1 702 555 1212`, `702.555.1212`.

Update, 2026-11-15: the field now carries one `pattern`, only until the script has loaded, for
a submit made before then (release candidate section, item 6). It counts digits the same way and
accepts the same five ways of writing a number. The rule above still holds for any format
pattern, and the pattern must come off once the script is running.

Both of these shipped broken in #106 and were fixed in #107. Do not reintroduce either:

1. `el.value.trim() === ""` handed a whitespace-only value back to `required`, which any
   non-empty string satisfies, so a blank phone number submitted. Test `el.value === ""`.
2. Validating only on `input` and `blur` is bypassed by back-navigation restore and by
   autofill, neither of which fires them. `handleSubmit` re-runs validation and calls
   `reportValidity()` before posting.

## One lead schema, by construction

`components/inquiry-modal.tsx` has no form of its own. It renders the same `<ContactForm>` that
`/contact` renders, passing `source="Homepage Plan Your Event"` plus its own success wording.
This retired the modal's private vocabulary (`first_name`, `last_name`, `interest`, `dates`).

**Exactly one file in the repo posts to Formspree, and a test enforces that.**

Routing the homepage button to `/contact` was the alternative and was deliberately rejected: it
changes what the top-ranking page does on click, and trips the guard that keeps button CTAs off
that page, to solve a problem sharing the component already solves.

## Select carets

`app/globals.css` `.form-group select` gained an inline SVG caret in `--green`. `appearance:
none` plus the shared `background` shorthand had left every select pixel-identical to a text
input, so the required Inquiry Type looked already filled in.

## Public email

`hello@lasvegasmahj.com` in copy, `mailto:` links and both JSON-LD blocks (11 references).
`shauna@lasvegasmahj.com` appears nowhere. **The Formspree endpoint deliberately did not
change**: which address the site displays and where the form delivers are separate mechanisms.

## LIVE AND UNFIXED: the stale Vercel host publishes her phone number

`https://lasvegasmahj.vercel.app` returns 200 with `"telephone":"+1-847-609-3112"` and
`lasvegasmahj@gmail.com` in LocalBusiness JSON-LD, `<meta name="robots" content="index,
follow">`, and a robots.txt allowing everything. It is a build from before 2026-09-05
(`/contact` 404s there; cache age about 7 days). `www` is clean.

This is **pre-existing**, not caused by this work, but it breaks the owner's hard rule on an
indexable page. **No code change in this repo can fix it**: that project does not rebuild from
`main`. The owner has to redeploy or delete that Vercel project.

## Guard hardening (#108)

Every published-number guard keyed on the one literal `847-609-3112`, so a different number
would have passed all of them. The new guard is shape based. Two details it needs: the final
separator must be optional (or a bare `7024621180` slips through), and the digit lookarounds are
load bearing (without them a ten digit window inside the footer's fourteen digit Facebook
profile id `61581027728474` reads as a phone number).

## Verification

25 agents, 6 dimensions, 3 adversarial refuters each, plus a completeness critic. 0 agent
errors. Shipped suites run against live production: 227 passed, 0 failed, desktop and iPhone.

**One verification agent sent two REAL submissions to Formspree** through a route-handler
ordering bug in its own script ("Verify Test" and "Verify Two"). They are junk and need deleting
from the Formspree submissions and the notification inbox.

## Owner actions still open

1. Confirm `hello@lasvegasmahj.com` actually receives mail. The domain has Google Workspace MX
   and real mailboxes (`shauna@lasvegasmahj.com` exists), but that does not prove a `hello`
   mailbox or alias does. Nothing automated may send mail to check.
2. Redeploy or delete the `lasvegasmahj.vercel.app` project. See above.
3. Delete the two junk verification submissions.
4. The modal heading still says "Book a Lesson" while the button that opens it says "Plan Your
   Event". Pre-existing mismatch, wording deliberately untouched, now worth a decision because
   the modal handles every inquiry type.

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
the domain, and a third `lasvegasmahj` under a different account is stale. Deployment starts
by **merging to `main`**: Vercel's GitHub integration starts a production build in both
projects. On `lasvegasmahj-h1iz` automatic domain assignment is off (the owner's choice, still
off after the 2026-11-16 release and the 2026-11-17 photo update), so a new build reaches `www`
only when the owner promotes it in Vercel with the team's login. Do not run a CLI deploy, and do
not create a `.vercel/project.json` in a worktree: that has previously produced a stray project.

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
