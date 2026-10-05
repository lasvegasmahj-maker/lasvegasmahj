# LVM technical SEO audit, 2026-10-04

**Scope:** every route on `main` at `d7a8212` (after PR #124). Technical SEO only: no new pages,
no copy or keyword rewrites, no pricing or business facts, no Bookwhen changes, no photo swaps.
**Fix PR:** branch `seo/technical-audit-2026-10`, PR #126 (open, NOT merged).
**Related, opened in parallel:** PR #125 (Round 8, stale and unsourced claims on the homepage,
footer, Summerlin, Henderson and parties copy) and the analysis-only "LVM SEO Gap Audit"
(Drive, LVM/Marketing), which covers intent mapping, cannibalization and internal-link
proposals. This audit stays on technical defects and does not duplicate either.
**Method:** we crawled a local production build of `d7a8212` with JavaScript off (52 URLs:
every sitemap URL, every app route, legacy redirects, a 404, URL variants and 38 assets). Eight
independent lenses then audited it: head metadata, indexability, sitemap, internal links,
entity schema, page schema, images and Core Web Vitals, and content rendering. For each lens,
an adversarial verifier tried to refute every finding: it reproduced the finding, checked the
handoff and tests for intent, and judged whether the fix was safe. A completeness critic then
checked coverage against the full checklist and ran the missing checks. 18 agents, 0 errors,
94 raw findings, with heavy overlap (six lenses independently caught the leagues robots bug).
A pre-push gate (typecheck, Technical, Brand and an adversarial SEO-regression reviewer) then
reviewed the finished branch.

## Verdict

**No critical issues.** No accidental noindex, no canonical poisoning, no broken internal links,
no orphan pages, no redirect chains on `www`, no duplicate titles or descriptions, no route
missing from the sitemap, and FAQ schema matches the visible FAQ on all 23 pages that carry it.
Every defect we found was low severity. The most consequential one is outside SEO: **CI on
`main` has been red since PR #121** (see below).

## Fixed in the PR

| # | Issue | Routes | Fix |
|---|---|---|---|
| 1 | Page-level `robots: { index: true, follow: true }` replaced the root robots object and dropped `max-image-preview:large`, `max-snippet:-1`, `max-video-preview:-1` (the bug Round 4 fixed on /schedule and /studio; PR #118 introduced it on this new page in parallel, merging a few hours before Round 4) | /mahjong-leagues-las-vegas | Line removed; the page inherits the root directives |
| 2 | Page-level `openGraph` dropped the root share image; the page declared `summary_large_image` with no image | /mahjong-leagues-las-vegas | Owner-verified `PLAYERS_AT_TABLE` studio photo (no room or open-play claim) |
| 3 | 30 of 33 sitemap `lastModified` dates wrong: 16 still `2026-05-23` though changed since; 14 set to the date Round 4/5 was written (09-29), not the date it went live (10-03), and 4 of those changed again 10-04 | 30 URLs | Each set to the last visible content change in git (table below) |
| 4 | 404 published `og:url` `https://www.lasvegasmahj.com/404`, itself a 404, plus a large-image card with no image | every 404 | No `og:url`, `ogBase` spread, `summary` card |
| 5 | HowTo JSON-LD described five steps and a "$50 to $300+" set price that are not on the page (HowTo rich results retired 2023) | /learn-mahjong | HowTo removed; Article and BreadcrumbList kept |
| 6 | Article and CollectionPage authors were anonymous Persons with a third job-title variant, not linked to the founder entity | /learn-mahjong, /mahjong-sets-guide, /rules | `author` references `about#shauna` with its url |
| 7 | `areaServed` on the /about Person (schema.org does not define it for Person; already listed as a nit) | /about | Removed |
| 8 | Parties Service typed Summerlin as a `City`; Round 1 retyped it to `Place` sitewide but the guard only scanned the corporate cluster | /mahjong-parties-las-vegas | `Place`; guard now walks every source file |
| 9 | Only inner page with no BreadcrumbList | /schedule | Added as JSON-LD (rendered in the body like every other page's JSON-LD), no visible change; `lib/schedule.ts` and Bookwhen untouched |
| 10 | In Next 16.2.4 `priority` only preloads; it does not set `fetchpriority` on the image, so the likely LCP images load at default priority | /, /studio, /play-mahjong-las-vegas | `fetchPriority="high"` added |
| 11 | The only above-the-fold image was `loading="lazy"` and the page's LCP | /about, /convention-activities-las-vegas | `priority` + `fetchPriority="high"` |
| 12 | Inline `1fr 1fr` grids never stacked on phones: 131px columns, one or two words per line, "Book a Birthday Party" broken into 3 fragments, and 1200w images fetched for 131px slots | /about story, /mahjong-parties-las-vegas birthday section | Joined the existing 768px single-column rule (`.split-stack`); desktop unchanged |
| 13 | `minmax(300px, 1fr)` auto-fit grids overflowed narrow phones: 44px past their container (12px of sideways page scroll) at 320px, a 4px clip at 360px | parties testimonial, corporate hub (x2), team building, meeting planner | `minmax(min(300px, 100%), 1fr)`; layout identical from about 364px up |
| 14 | Mini Mahjer shop logo was a 102KB 600x777 PNG in a 120px-tall slot | / | 6.7KB WebP at 3x the slot. The old PNG stays in `public/` so pages cached before the deploy still load it; remove it with the other unreferenced public files later |
| 15 | **CI red on `main` since PR #121 (3cb2e43):** the Round 5 "invents nothing" guard read the meeting planner image's `width: "100%"` as a percentage claim | test only | Percentage check now ignores inline style objects; a percentage in copy still fails (mutation-tested) |

Nothing in the PR changes a title, H1, canonical, visible sentence, link, price or photograph.
Visible changes are limited to phone layout (12, 13) and are shown below.

**Current vs proposed, phone (390px):** /about story section: 2 columns of 131px, section
2,197px tall, becomes 1 column of 326px, 1,472px tall (photo, then the story). Parties birthday
section: 2 columns of 131px with a 3-fragment button, becomes 1 column, 989px tall, button on
one line at 360px and up (at 320px it still wraps until the owner decides on `.btn-primary`
display). Desktop layouts are identical: measured against production at 1280px, and the
browser spec pins two columns at desktop for every changed section.

### Sitemap dates applied

| Date | URLs | Source commit |
|---|---|---|
| 2026-10-04 | /, /mahjong-lessons-las-vegas, /about, /mahjong-parties-las-vegas, /corporate-team-building-las-vegas, /convention-activities-las-vegas, /las-vegas-meeting-planner-activities, /mahjong-corporate-las-vegas (unchanged) | #120, #121, #123, #124 |
| 2026-10-03 | /studio, /schedule, /private-mahjong-lessons-las-vegas, /play-mahjong-las-vegas, /mahjong-open-play-las-vegas, /conference-activities-las-vegas, /corporate-event-activities-las-vegas, /trade-show-booth-activities-las-vegas, /incentive-group-activities-las-vegas, /contact, /learn-mahjong, /mahjong-leagues-las-vegas (unchanged) | #117 (merged 10-03 PT), #118 |
| 2026-08-29 | the 8 /rules/* topics | #86, #87 |
| 2026-08-26 | /rules, /ask (unchanged) | #85 |
| 2026-08-07 | /mahjong-lessons-summerlin, /mahjong-lessons-henderson | 9e092ec |
| 2026-07-26 | /mahjong-sets-guide | cb2b75d |

Sitewide nav/footer edits and head-only or schema-only commits were not counted as content
changes. Bookwhen-fed pages use the last template or copy change, never the feed date.

## Documented, not changed

**Owner or external actions (outside the repo)**
- **Favicon is the stock Next.js/Vercel triangle** (`app/favicon.ico`, unchanged since the
  Next.js conversion; no apple-touch-icon). Google shows it beside the site name in results.
  Needs an owner-approved square mark; then replace `app/favicon.ico` and add `app/icon.png`
  and `app/apple-icon.png`. Same blocker for an Organization `logo` in schema. (medium)
- Apex `lasvegasmahj.com` still 307s (temporary) to www; `http://` apex takes 2 hops. Vercel
  domain setting on `lasvegasmahj-h1iz`: make it 308. (low, re-confirmed)
- `lasvegasmahj.vercel.app` now returns **503 DEPLOYMENT_PAUSED** on every path, so the stale
  copy that published her phone number is no longer served. Delete that project or 301 it to
  www to make it permanent.
- `lasvegasmahj-h1iz.vercel.app` (the production project's default alias) serves a full
  indexable mirror. Absolute www canonicals neutralize it; optionally redirect it in Vercel.
- Find My Mahj Game links and `sameAs` point at the apex host (307). FMG follow-up when its
  build freeze lifts: `SISTER_SITE` and five literals to `https://www.lasvegasmahj.com`.
- Bookwhen: the Evening Thursday Fall League description repeats a sentence (shows on
  /mahjong-leagues-las-vegas and in /schedule Event schema).
- Google Business Profile: confirm its address matches the studio address in schema (the
  memory notes a different ZIP; not verifiable from here).

**Strategic or wording decisions (need owner approval or Search Console evidence)**
- /mahjong-leagues-las-vegas has **one** inbound link (/schedule). Lowest-risk option: link the
  existing word "Leagues" in /studio's "Leagues run here, and so do special events".
- No contextual (body) inbound links: /about, /mahjong-lessons-summerlin,
  /mahjong-lessons-henderson, /mahjong-sets-guide (nav/footer only). /rules and the 8 topics are
  reached only via /ask and /contact (topics at depth 3); /learn-mahjong does not link /rules.
- Summerlin (251 words) and Henderson (305) remain thin and templated with an in-home pitch
  (owner-deferred rewrite).
- Titles over 60 characters: private lessons (67), /rules/scoring (65), /about (63). Lessons
  page description is 170 characters (owner-supplied in #120, protected).
- /about Person `sameAs` lists the business's Instagram and TikTok, the same as the business's
  `sameAs`. Drop it unless those accounts also represent Shauna personally.
- `paymentAccepted: "Cash, Credit Card, Venmo"` is still unsourced.
- Hidden /events/cafe-lola-open-play-may-2026: past event, 200 + noindex, copy conflicts with
  current rules. Options: keep hidden, 410, or fix the copy before reuse.
- Date-bound copy: "Best Mahjong Sets 2026" title/H1, footer "2026"; calendar for January 2027.
- Homepage (protected): 80% of body text starts at opacity 0 until a post-hydration observer
  runs; H1 textContent reads "Las VegasMahjong" (CI-pinned); no `<main>`; FAQ toggle is a div.
- Lessons page (protected): hero "Learn More" sends visitors back to the homepage.
- Rules topic H1s start with an emoji; /rules/the-card uses U+1F0CE, which is not an emoji.

**Already-recorded schema items, re-evaluated and left alone**
- Sitewide Course markup (2 nodes on every route, 3 on the lessons page). Google retired Course
  info rich results on 2025-06-12, so it earns nothing, but moving it edits the protected
  homepage and lessons heads and breaks the slice anchors in `seo-round1.logic.spec.ts:304` and
  `seo-round4-visitors.logic.spec.ts:180`. `courseMode` on Course is part of the same item.
- 8 page Services have no `@id`/`url` (valid blank nodes; no conflicting entity).
- `$60` is written in 9 schema locations outside `lib/pricing.ts` (pricing area).
- Footer Facebook link uses the numeric profile URL (302s to the vanity URL in `sameAs`).

**Performance and accessibility hygiene (no SEO defect)**
- `.btn-primary`/`.btn-outline` have no `display`, so long labels split at 320-360px. Reserved
  as an owner decision in the Round 2 record. Item 12 fixes the parties button at 360px and up;
  at 320px it still wraps until that decision.
- `tile-texture-v2.webp` (100KB decorative background) is the LCP element on three pages.
- `logos/birdbam.svg` is a 296KB auto-traced vector (63KB brotli), below the fold.
- Vercel serves /public images with `max-age=0, must-revalidate`.
- /schedule league session Event descriptions are not visible on /schedule (PR #119 kept the
  Event output byte-identical on purpose); time and room text join as "PMin" for extractors.
- Footer uses `<h5>` labels; two press-card photos have empty alt (decorative, intentional).

## Verified clean

One title, one description and one viewport per route, no duplicates; every indexable page
self-canonical on https www with no trailing slash, matching its sitemap `loc`; trailing slash
308s once to the canonical; uppercase paths 404 (no duplicates); `?utm` and `?source` variants
canonicalize; 404s return 404 + noindex + no canonical; the 410 and the three legacy 301s
behave as documented; robots.txt correct; production matches the local build; `og:url` equals
canonical on every indexable page; every `og:image` returns 200; every `<img>` has alt and
dimensions (fill images in sized containers); no JS-only links; 0 broken internal links (JS
off and on); no orphans; max click depth 3; no `@id` conflicts beyond harmless subtype merges;
one PostalAddress sitewide; no phone number or `telephone` anywhere; FAQPage matches visible
text on 23 of 23 pages; no horizontal overflow at 390px on any route.

## Rules going forward

- Any PR that changes a route's visible content sets that route's `lastModified` to the date it
  goes live. Bookwhen-fed pages use the last template or copy change, never `new Date()`.
  Head-only, schema-only and layout-only CSS changes (like this PR's) do not count. Dates are
  the Pacific merge date and Next emits them as UTC midnight, so a value can read up to about
  a day earlier than the merge moment; that precision is fine for lastmod. No test pins the
  dates themselves, only that each one is a real date not in the future.
- Never set a page-level `robots` object on an indexable page; it replaces the root one. Only
  noindex pages may (test-enforced).
- A page-level `openGraph` must bring its own `images` (test-enforced).
- FAQPage, HowTo and Course markup earn no Google rich results here; keep FAQPage for
  consistency, do not add HowTo or Course expecting a rich result.

## Test results (final commit)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `pnpm build` | success, 43 routes |
| `pnpm test:logic` | 494 passed, 7 skipped, 1 failed: the Find My Mahj drift check (local-only, skips in CI). Main before this PR: 480 passed, 2 failed (that check plus the CI-blocking meeting-planner guard) |
| Browser, desktop-chromium + mobile, local production build | 530 passed, 12 skipped, 2 failed: `studio.spec.ts:173` fetches photos from a hardcoded `http://localhost:3000`, which on this Mac is another session's debug server returning 500; the same photos return 200 from this build, and the test passes in CI |
| New `tests/seo-technical-audit.{logic.,}spec.ts` | 13 logic + 16 browser passed (2 skips are the phone-only and desktop-only cases); 7 mutations (each defect reintroduced) all caught |
| `scripts/lint-regression.mjs origin/main` | no new errors in 21 changed files |
| `pnpm lint` (advisory) | 15 errors, 2 warnings, identical to `main` |
| Internal-link crawl of the fixed build vs `main` | 52 URLs, 0 broken links; titles, descriptions, canonicals, H1s and every link identical on all routes; robots, OG, JSON-LD types and image attributes changed only where listed above |

## Route inventory

Inbound = indexable pages linking to the route (all regions / contextual body links only), d =
click depth from the homepage. Every route below returns 200, is indexable and is in the
sitemap.

| URL | Primary intent | Title (chars) | H1 | Canonical | Page schema (plus sitewide LocalBusiness, Course x2, WebSite) | Inbound pages (all / contextual), depth | Sitemap lastmod | Fixed here / still open |
|---|---|---|---|---|---|---|---|---|
| / | Brand + money query 'mahjong lessons las vegas' (ranks ~#1); every service | Las Vegas Mahjong \| Lessons, Events & Open Play (47) | Las VegasMahjong | self | none | 32/3, d0 | 2026-10-04 | FIXED hero fetchpriority, lastmod. OPEN (protected): .reveal text at opacity 0 until JS (CR-4), H1 textContent 'Las VegasMahjong' (CR-5, CI-pinned), no <main> (CR-6), multi-area OG text (HM-8) |
| /studio | Studio location: where we play, Lucky Hare address | Mahjong Studio in Las Vegas \| Las Vegas Mahjong (47) | Our Mahjong Studio in Las Vegas | self | Place, BreadcrumbList | 32/7, d1 | 2026-10-03 | FIXED LCP fetchpriority, lastmod |
| /schedule | Upcoming classes, open play, leagues (Bookwhen feed) | Mahjong Class & Open Play Schedule \| Las Vegas Mahjong (54) | Class & Open Play Schedule | self | BreadcrumbList, Event | 32/8, d1 | 2026-10-03 | FIXED BreadcrumbList (JSON-LD only), lastmod. OPEN: league session Event text not visible (SP-3), Bookwhen duplicate sentence (SP-12), 'PMin' text join (CR-11) |
| /mahjong-lessons-las-vegas | Money page: group lessons, MAHJ ladder, $60 | Mahjong Lessons in Las Vegas \| Las Vegas Mahjong (48) | Mahjong Lessons in Las Vegas | self | Course (its own, a third Course node), FAQPage, BreadcrumbList | 32/23, d1 | 2026-10-04 | FIXED lastmod. OPEN (protected, CI-locked): description 170 chars (HM-7), hero 'Learn More' to / (IL-5), texture is LCP (IMG-7) |
| /private-mahjong-lessons-las-vegas | Private lessons at the studio, contact for pricing | Private Mahjong Lessons at Our Las Vegas Studio \| Las Vegas Mahjong (67) | Private Mahjong Lessons at Our Studio | self | Service, BreadcrumbList, FAQPage | 32/3, d1 | 2026-10-03 | FIXED lastmod. OPEN: title 67 chars (HM-6), 3 contextual inbound |
| /mahjong-parties-las-vegas | Birthday and private parties | Mahjong Parties Las Vegas \| Las Vegas Mahjong (45) | Mahjong Parties in Las Vegas | self | Service, BreadcrumbList, FAQPage | 32/4, d1 | 2026-10-04 | FIXED phone stacking, Summerlin Place, 320px clip, lastmod. OPEN: stale capacity and furniture claims (addressed in PR #125) |
| /play-mahjong-las-vegas | Visitors who already play | Play Mahjong in Las Vegas \| Open Play for Visitors (50) | Looking for a Mahjong Game While Visiting Las Vegas? | self | FAQPage, BreadcrumbList | 4/4, d2 | 2026-10-03 | FIXED LCP fetchpriority, lastmod. OPEN: 4 contextual inbound, not in nav/footer (Round 4 item 4) |
| /mahjong-open-play-las-vegas | Social Open Play (Lucky Sevens) | Mahjong Open Play Las Vegas \| Social American Mahjong (53) | Mahjong Open Play in Las Vegas | self | Service, BreadcrumbList, FAQPage | 32/6, d1 | 2026-10-03 | FIXED lastmod. OPEN: stale Summerlin/Henderson body copy (Round 4 item 3) |
| /mahjong-leagues-las-vegas | Season leagues (Bookwhen feed) | Mahjong Leagues in Las Vegas \| Las Vegas Mahjong (48) | Mahjong Leagues in Las Vegas | self | BreadcrumbList | 1/1, d2 | 2026-10-03 | FIXED robots dropped preview directives, no share image. OPEN: 1 inbound link (IL-1), thin when no season listed (IDX-8) |
| /mahjong-corporate-las-vegas | Corporate hub: how we run corporate events | Corporate Mahjong Events in Las Vegas \| Las Vegas Mahjong (57) | Corporate Mahjong Events in Las Vegas | self | Service, BreadcrumbList, FAQPage | 32/8, d1 | 2026-10-04 | FIXED 320px clip. Architecture intact |
| /corporate-team-building-las-vegas | Spoke: team building, offsites | Corporate Team Building Las Vegas \| Las Vegas Mahjong (53) | Corporate Team Building in Las Vegas | self | Service, BreadcrumbList, FAQPage | 5/5, d2 | 2026-10-04 | FIXED 320px clip, lastmod |
| /conference-activities-las-vegas | Spoke: conferences, networking | Conference Activities Las Vegas \| Las Vegas Mahjong (51) | Conference Activities in Las Vegas | self | Service, BreadcrumbList, FAQPage | 5/5, d2 | 2026-10-03 | FIXED lastmod |
| /convention-activities-las-vegas | Spoke: convention organizers and attendees | Convention Activities Las Vegas \| Las Vegas Mahjong (51) | Convention Activities in Las Vegas | self | Service, BreadcrumbList, FAQPage | 6/6, d2 | 2026-10-04 | FIXED lazy LCP image, lastmod |
| /corporate-event-activities-las-vegas | Spoke: corporate occasions | Corporate Event Activities in Las Vegas \| Las Vegas Mahjong (59) | Corporate Event Activities in Las Vegas | self | Service, BreadcrumbList, FAQPage | 6/6, d2 | 2026-10-03 | FIXED lastmod |
| /las-vegas-meeting-planner-activities | Spoke: meetings by agenda slot | Las Vegas Meeting Planner Activities \| Las Vegas Mahjong (56) | Meeting Activities for Las Vegas Planners | self | Service, BreadcrumbList, FAQPage | 5/5, d2 | 2026-10-04 | FIXED 320px clip, lastmod, CI guard false positive |
| /trade-show-booth-activities-las-vegas | Spoke of convention: exhibitors, sponsors | Trade Show Booth Activities in Las Vegas \| Las Vegas Mahjong (60) | Trade Show Booth Activities in Las Vegas | self | Service, BreadcrumbList, FAQPage | 3/3, d3 | 2026-10-03 | FIXED lastmod. Depth 3 by design (not linked from hub) |
| /incentive-group-activities-las-vegas | Spoke: reward trips, DMC, VIP groups | Incentive Group Activities in Las Vegas \| Las Vegas Mahjong (59) | Incentive Group Activities in Las Vegas | self | Service, BreadcrumbList, FAQPage | 7/7, d2 | 2026-10-03 | FIXED lastmod |
| /about | Founder credibility (E-E-A-T) | About Shauna \| Certified Mahjong Instructor \| Las Vegas Mahjong (63) | Meet Shauna | self | Person, BreadcrumbList | 32/0, d1 | 2026-10-04 | FIXED phone stacking, lazy LCP, Person areaServed, lastmod. OPEN: title 63 chars (HM-6), 0 contextual inbound (IL-4), Person sameAs = business accounts (owner question) |
| /contact | Inquiry form, every buyer | Contact Las Vegas Mahjong \| Lessons, Parties, Events (52) | Contact Las Vegas Mahjong | self | BreadcrumbList, ContactPage | 32/12, d1 | 2026-10-03 | FIXED lastmod |
| /mahjong-lessons-summerlin | Local lessons, Summerlin | Mahjong Lessons in Summerlin, NV \| Las Vegas Mahjong (52) | Mahjong Lessons in Summerlin | self | Service, BreadcrumbList, FAQPage | 32/0, d1 | 2026-08-07 | FIXED lastmod. OPEN (owner-deferred): 251 words, templated with Henderson, in-home pitch, 0 contextual inbound (CR-8); stale claims in PR #125 |
| /mahjong-lessons-henderson | Local lessons, Henderson | Mahjong Lessons in Henderson, NV \| Las Vegas Mahjong (52) | Mahjong Lessons in Henderson | self | Service, BreadcrumbList, FAQPage | 32/0, d1 | 2026-08-07 | FIXED lastmod. OPEN (owner-deferred): 305 words, 'we come to you' OG text (CR-8, HM-8), 0 contextual inbound; stale claims in PR #125 |
| /learn-mahjong | Beginner guide (informational) | How to Learn American Mahjong \| Las Vegas Mahjong (49) | How to Learn American Mahjong | self | Article, BreadcrumbList | 32/1, d1 | 2026-10-03 | FIXED off-page HowTo removed, author entity, lastmod. OPEN: no link to /rules (IL-3), og:type website (HM-11) |
| /ask | Rules Q&A tool | Ask a Mahjong Rule \| Las Vegas Mahjong (38) | Ask Las Vegas Mahjong | self | WebPage, BreadcrumbList | 32/5, d1 | 2026-08-26 | OPEN: thin by design (CR-9), H1 'Ask Las Vegas Mahjong' vs title (CR-13) |
| /mahjong-sets-guide | Buying guide, affiliate | Best Mahjong Sets 2026 \| Buying Guide \| Las Vegas Mahjong (57) | Best Mahjong Sets 2026 | self | Article, BreadcrumbList | 32/0, d1 | 2026-07-26 | FIXED author entity, lastmod. OPEN: '2026' in title/H1 (CR-10), 0 contextual inbound (IL-4), Maven spelling (IL-9) |
| /rules | Rules hub | American Mahjong Rules Guide \| Las Vegas Mahjong (48) | American Mahjong Rules Guide | self | CollectionPage, BreadcrumbList | 10/10, d2 | 2026-08-26 | FIXED author entity, lastmod. OPEN: not in nav/footer/home, reached via /ask and /contact (IL-3) |
| /rules/calling-tiles | Rules topic | Calling Tiles Rules in American Mahjong \| Las Vegas Mahjong (59) | [icon] Calling Tiles | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: emoji in H1 (CR-3), depth 3 |
| /rules/charleston | Rules topic | The Charleston Rules in American Mahjong \| Las Vegas Mahjong (60) | [icon] The Charleston | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: emoji in H1, depth 3 |
| /rules/dead-hands | Rules topic | Dead Hand Rules in American Mahjong \| Las Vegas Mahjong (55) | [icon] Dead Hands | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: emoji in H1, depth 3, thinnest topic (CR-9) |
| /rules/etiquette | Rules topic | Mahjong Table Etiquette and Disputes \| Las Vegas Mahjong (56) | [icon] Etiquette and Disputes | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: emoji in H1, depth 3 |
| /rules/jokers | Rules topic | Joker Rules in American Mahjong \| Las Vegas Mahjong (51) | [icon] Joker Rules | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: emoji in H1, depth 3 |
| /rules/scoring | Rules topic | Scoring and Payment Rules in American Mahjong \| Las Vegas Mahjong (65) | [icon] Scoring and Payment | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: emoji in H1, depth 3, title 65 chars (HM-6) |
| /rules/the-card | Rules topic | Reading the NMJL Mahjong Card \| Las Vegas Mahjong (49) | [icon] Reading the Card | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: H1 starts with U+1F0CE, not an emoji (CR-3), depth 3 |
| /rules/winning | Rules topic | Winning Rules in American Mahjong \| Las Vegas Mahjong (53) | [icon] Winning | self | FAQPage, BreadcrumbList | 8/8, d3 | 2026-08-29 | FIXED lastmod. OPEN: emoji in H1, depth 3 |

**Not indexable, by design**

| URL | Status | Notes |
|---|---|---|
| /blog | 200, noindex, follow | Empty until a post ships; out of sitemap and footer |
| /events/cafe-lola-open-play-may-2026 | 200, noindex, nofollow | Hidden past event; see documented items |
| /blog/things-to-do-las-vegas-besides-gambling | 410 + X-Robots-Tag noindex | Retired Round 1 |
| /blog/bachelorette-party-ideas-las-vegas | 301 to /mahjong-parties-las-vegas | With a trailing slash: 308 then 301 (harmless) |
| /mahjong-studio-las-vegas, /lucky-hare | 301 to /studio | Single hop |
| any unknown path | 404, noindex, no canonical, no og:url | Fixed here |

Raw lens notes, verifier verdicts and the full 94-finding list were working files for this
audit and are not committed; everything actionable is above.
