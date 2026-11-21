# Las Vegas Mahjong: conversion and measurement plan (2026-11-13)

**Update, 2026-11-15.** Written before the owner's 2026-11-15 approvals. Since then the
corporate "At a Glance" section and the lessons "Find Your Fit" chooser were approved and
installed, so experiments E1 and E2 shipped with this branch (live since 2026-11-16) and have no
separate "before" period.
The contact form now knows 16 source tags, not 15: the lessons chooser's `lessons` tag (label
"Lessons page") is installed, not proposed. Analytics is still approved but not active: no
Measurement ID exists, and nothing counts as live until delivery is verified.

**Update, 2026-11-18.** The owner decided the GA4 property's settings on 2026-11-18, and setup is
under way; no Measurement ID is live yet. The code on branch `analytics/ga4-setup` changes three
things. Link clicks no longer send `page_path`: gtag.js takes that
parameter as its own page field, so it never arrived, and GA4's built-in "Page path and screen
class" dimension already shows the page of every click. `booking_link_click` now counts only
links to the booking pages on Bookwhen, so the link to Bookwhen's privacy policy on `/privacy` no
longer counts and needs no filter. The privacy page's "Last updated" date now changes in the same
build as its Analytics text (section 5, item 1), and that text now lists what Google's tag sends
with each page. The owner's decisions: property Las Vegas Mahjong under the business Google
account, Los Angeles (Pacific) time, US dollars, every optional data-sharing setting off, Google
signals off, no Google Ads link, event and user data kept 14 months, `contact_form_success` as
the only key event, custom dimensions only for parameters the code sends, nothing a visitor
types ever sent, Bookwhen clicks never counted as bookings, and checks only with clearly labelled
tests, never a real inquiry, newsletter signup or booking. The setup plan keeps Page views on,
turns every other enhanced measurement option off (Outbound clicks included), redacts email
addresses and Mailchimp's `mc_eid`, and registers seven custom dimensions. Section 2 has the
steps.

**Later on 2026-11-18.** The owner created the property and its web stream and set everything in
section 2.B except the last two items, which she deferred: the custom dimensions and the key event
are optional reporting setup and do not block activation. Google's served tag for the Measurement
ID confirms page views as the only enhanced measurement (with history events), email and `mc_eid`
redaction, Google signals off, and user-provided data capabilities off. That last setting was on
by default, with automatic detection of email addresses, phone numbers and street addresses; the
owner switched it off and published the tag change the same day. Google also created three key
events of its own (`purchase`, `qualify_lead`, `close_convert_lead`). The site never sends those
events, so they stay at zero.

**Update, 2026-11-20.** The owner added the Measurement ID in Vercel (Production only) and approved
the finished release, privacy wording included, and asked for the actual release date on the
privacy page. The date moved to November 20, 2026, and the release merged that day as pull request
#132. Tracking counts as live only after her Promote and the live checks in section 2.D.

**Status:** draft for the owner's review, updated 2026-11-18 with the owner's GA4 decisions and
on 2026-11-20 for the release. An earlier version reached `main` with pull request #130, which went
live on 2026-11-16. This update and the code change it describes reached `main` in pull request
#132, the release that switches analytics on (section 2.C). Until the owner promotes that release,
the live site loads no analytics tag (checked on 2026-11-20); the event code ships dormant in any
build without an ID. The E1 and E2 sections and the `lessons` source tag went live with the 2026-11-16
release.

**Today (2026-11-18):** the live site loads no analytics. On 2026-11-13 we found no GA4
Measurement ID anywhere we could see
(`~/Projects/.lvm-sprint-2026-11-13/lane7-analytics-search/SEARCH-EVIDENCE.md`, section 1), and
setup of the GA4 property started on 2026-11-18. Analytics is approved (handoff Round 12) on these
terms: the direct GA4 tag, no duplicate tracking, an accurate privacy page, no invented ID, and no
claim that tracking is live until it is verified.

**Built from:** the code on branch `seo/invisible-technical-fixes` ("this branch" below; live
since 2026-11-16) as read on 2026-11-13 (files in section 6), with section 1.1 re-checked on
2026-11-18 against branch `analytics/ga4-setup`. If those files change before
launch, re-check section 1. The owner guide
(`docs/handoffs/lvm-owner-guide-2026-11-13.md`, section 4) lists switching analytics on among the
things waiting for you after go-live (you approved analytics on 2026-11-13, Round 12); this plan
holds the detail.

## In short

1. Count an inquiry when `contact_form_success` arrives. Mark it as a key event in the deferred
   reporting setup (section 2.B); it is the only one of the site's events to mark. Your inbox stays
   the record of truth for inquiries.
2. Count clicks out to Bookwhen with `booking_link_click`. A click is not a booking. Count
   bookings in Bookwhen, and keep the two numbers side by side, never added together.
3. Switch analytics on only with the owner's release approval, after the labelled local test
   (section 2.E): set the Measurement ID in Vercel, merge, then Promote (section 2.C), and call
   tracking live only after the live checks in section 2.D. The 2026-11-16 release put live the
   privacy page and the fix that stops each event being sent two ways, which would have let GA4
   count it twice. The page's "Last updated" date changes in the same build as its Analytics text.
4. Collect 4 full weeks of clean data before changing any measured page. Then change one page at
   a time.
5. Every benefit named in section 4 is a hypothesis until the numbers show it.

Words used below:

- **Event:** a named signal the site sends to GA4, such as `contact_form_success`.
- **Parameter:** a detail attached to an event, such as the page that sent an inquiry.
- **Key event:** GA4's name for an event you count as a result (GA4 used to call it a conversion).
- **Custom dimension:** a GA4 setting that lets reports show a parameter. GA4 shows a parameter
  only from the day its dimension exists.
- **Page path:** in this plan, GA4's built-in "Page path and screen class" dimension: the page an
  event happened on. GA4 records the page address with every event, so the site sends no page
  parameter of its own.
- **Realtime and DebugView:** two GA4 screens that show events within seconds. Use them to check.

---

## 1. Every event the site can send

### 1.1 Event map

| Event (exact name) | Sent when (from the code) | Parameters | Business goal | GA4 setup |
| --- | --- | --- | --- | --- |
| `contact_form_success` | The form service (Formspree) confirmed it received an inquiry, from `/contact` or the homepage "Plan Your Event" pop-up | `source_label`, `inquiry_type` | Inquiry: the number to count | **Key event, the only one.** Dimensions: `source_label`, `inquiry_type` |
| `contact_submit` | The same moment as `contact_form_success` (older name, still sent) | none | Inquiry: the same one again | Not a key event. Leave it out of reports |
| `contact_form_attempt` | Send Message was pressed and every field passed its checks | `source_label`, `inquiry_type` | Inquiry health | Not a key event |
| `contact_form_error` | Formspree refused the inquiry or the connection failed. The visitor sees "Something went wrong" and the email address | `source_label`, `inquiry_type` | Inquiry health: a lead at risk | Not a key event. Check every week |
| `contact_link_click` | A click on any link to `/contact` | `link_url` (`/contact`), `link_domain`, `source_slug` (the button's `?source=` tag; empty for menu and footer links) | Inquiry intent | Not a key event. Dimensions: `source_slug`, and the built-in page path for the page clicked on |
| `schedule_link_click` | A click on any link to `/schedule`, including the menu's Schedule and Join an Event links on `/schedule` itself (their page path is /schedule). Only the "See the Calendar" jump within `/schedule` is not counted | `link_url` (`/schedule`), `link_domain` | Booking intent, first step | Not a key event. Dimension: the built-in page path |
| `booking_link_click` | A click on a link to the booking pages on Bookwhen (`bookwhen.com/lasvegasmahjong` and the pages under it): the Book buttons on `/schedule` and on the visitor page's dates, and the Bookwhen buttons on `/mahjong-leagues-las-vegas`. Other Bookwhen links, such as its privacy policy on `/privacy`, are not counted | `link_url` (the Bookwhen address, query string removed), `link_domain` | Booking intent, second step. **A click, never a booking** | Not a key event. Dimensions: `link_url`, and the built-in page path |
| `newsletter_signup` | Mailchimp accepted a new address, from the homepage newsletter section or the footer box on every page. Not sent for an address already on the list, or after an error | none | Newsletter growth | Not a key event. Mailchimp's audience count is the record of truth |
| `ask_question` | An Ask a Rule answer arrived, including the "taking a break" message when Ask fails | `origin` (`typed`, `starter`, `followup`), `turn`, `kind`, `label`, `category`, `matched`, `via` | Rules engagement | Not a key event. Dimensions `matched` and `category` (needed for the monthly Ask view, section 3.3, item 7). The other parameters get no dimension: no planned report needs them |
| `ask_unverified` | An answer with no matching written entry (not a failure) | `kind`, `turn` | Rules engagement: topics the guide does not cover yet | Not a key event |
| `ask_nudge_shown`, `ask_nudge_click` | An answer carried a "See lessons", "See MAHJ103" or "See open play" suggestion; the visitor clicked it | `target` (`lessons`, `advanced`, `open-play`) | Rules engagement that leads toward lessons or open play | Not a key event. Dimension `target` (needed for the monthly Ask view) |
| `ask_link_click` | A click on a rules page link inside an answer | `target` (`rules`), plus `reason` (`failed` or `unverified`) or `topic` (the rules page name) | Rules engagement | Not a key event |
| `ask_followup_click`, `ask_starter_click`, `ask_reset` | A suggested follow-up, a starter question, or "Start a new question" | `category` (follow-up only) | Rules engagement | Not a key event |

Notes:

- **Nothing a visitor types is ever sent.** The form sends two values from the site's own lists
  (the page label and the Inquiry Type choice). Click events send a path, a host and a
  shape-checked tag, and no page: GA4 records the page address with every event, so the page path
  shows the page a click happened on, including after a link that changes the page without a full
  reload. Ask events send labels the site sets, never the question (`components/contact-form.tsx`
  `handleSubmit`, `lib/analytics.ts` `linkClickEvent`, `app/ask/ask-client.tsx`).
- **GA4 adds events of its own:** `page_view`, `session_start`, `first_visit` and
  `user_engagement`. Use `page_view` for page counts. Outbound clicks stays off in enhanced
  measurement (section 2.B), so GA4 sends no `click` event of its own, and Bookwhen clicks come
  only from `booking_link_click`.
- **On the live site today**, `contact_submit`, `newsletter_signup` and the Ask events were
  already live, and the other six went live with the release on 2026-11-16 (Round 11). All of
  them stay silent because no ID is set.
- `lesson_inquiry` appears in `lib/analytics.ts` (mapped to a Meta Pixel "Lead") but nothing sends
  it. The Meta Pixel is not approved and `/privacy` does not describe it, so leave
  `NEXT_PUBLIC_META_PIXEL_ID` unset.
- The event names are fixed in the code. Do not rename them or build look-alike events in GA4.

### 1.2 Where inquiries come from

Each tagged button adds `?source=<tag>` to `/contact`. The form turns the tag into a page label.
The label arrives in the inquiry email's `source` field and in GA4 as `source_label`, so the inbox
and GA4 use the same words. The 16 tags and labels come from `components/contact-form.tsx`; the
pages are the ones whose buttons carry each tag.

| Page with the button | Tag (`source_slug`) | Label (`source_label`) | Inquiry Type pre-selected |
| --- | --- | --- | --- |
| `/mahjong-corporate-las-vegas` | `corporate` | Corporate Events page | Corporate or Team Building |
| `/corporate-team-building-las-vegas` | `team-building` | Corporate Team Building page | Corporate or Team Building |
| `/las-vegas-meeting-planner-activities` | `meeting-planners` | Meeting Planner Activities page | Corporate or Team Building |
| `/corporate-event-activities-las-vegas` | `corporate-activities` | Corporate Event Activities page | Corporate or Team Building |
| `/incentive-group-activities-las-vegas` | `incentive` | Incentive Group Activities page | Corporate or Team Building |
| `/conference-activities-las-vegas` | `conference` | Conference Activities page | Conference or Convention |
| `/convention-activities-las-vegas` | `convention` | Convention Activities page | Conference or Convention |
| `/trade-show-booth-activities-las-vegas` | `trade-show` | Trade Show Booth Activities page | Conference or Convention |
| `/mahjong-parties-las-vegas` | `parties` | Private Parties page | Private Party or Celebration |
| `/private-mahjong-lessons-las-vegas` | `private-lessons` | Private Lessons page | Private Lesson |
| `/mahjong-lessons-summerlin` | `summerlin` | Summerlin Lessons page | Private Lesson |
| `/mahjong-lessons-henderson` | `henderson` | Henderson Lessons page | Private Lesson |
| `/mahjong-lessons-las-vegas` | `lessons` | Lessons page | Private Lesson |
| `/studio` | `studio` | Studio Page | none (the visitor picks) |
| `/schedule` | `schedule` | Schedule page | none |
| `/play-mahjong-las-vegas` | `visitors` | Play Mahjong for Visitors page | none |
| Homepage "Plan Your Event" pop-up | no click event | Homepage Plan Your Event | none |
| Menu, footer, search or a typed address; also any inquiry sent before the page has finished loading | empty | General (nav, footer or direct) | none |

Inquiry Type choices (`inquiry_type`): Private Lesson, Group Lesson or Class, Private Party or
Celebration, Corporate or Team Building, Conference or Convention, Charity or Fundraiser,
Something Else.

The `lessons` tag belongs to the lessons page chooser (section 4, E2), approved and installed on
2026-11-15.

### 1.3 What analytics will not see

- **Completed bookings.** They happen on bookwhen.com. Whether Bookwhen can report them to GA4 was
  not verified (Round 11).
- Visitors who block analytics or use Google's opt-out add-on. Their inquiries still reach your
  inbox and their bookings still reach Bookwhen, but GA4 never sees them. So GA4 normally shows
  fewer inquiries than your inbox (section 3.2, warning sign 1, covers the opposite case). GA4 has
  no booking number at all: compare Bookwhen clicks with Bookwhen bookings only as section 3.4
  describes.
- A Send press stopped by a missing or invalid field. The browser shows its message and no event
  is sent, so GA4 cannot show how many people give up at that point.
- An inquiry sent before the page has finished loading (added 2026-11-15). It reaches your inbox
  through the form service, but no event is sent and its source reads "General (nav, footer or
  direct)" whichever button the visitor used.
- Opening the homepage pop-up. Only its result arrives, labelled "Homepage Plan Your Event".
- The "Book a Lesson" and "Book Now" buttons on the lessons, Summerlin and Henderson pages. They go
  to the homepage lessons box (`/#classes`) on purpose (Round 2), so GA4 sees them only as homepage
  page views.
- A link opened with the middle mouse button or with right-click "Open in new tab". The browser
  does not report those as clicks.
- On the homepage, which of the two newsletter boxes (the newsletter section or the footer) was
  used.
- Group size, preferred date and the message. They are never sent; they are in the email only.
- Emails sent straight to `hello@lasvegasmahj.com`, and messages on social media.

---

## 2. Checklist: switching analytics on and verifying it

Do the parts in order and tick each box, with one exception: your developer runs part E, a
labelled test on a local copy of the site, as soon as part B is done and before part C, so a
fault shows up before anything changes on the live site. If a check fails, stop and tell your
developer.

### A. Before you start

- [x] **The 2026-11-16 release is live on <https://www.lasvegasmahj.com>** (done 2026-11-16):
  <https://www.lasvegasmahj.com/privacy> shows the Privacy page. Why the order mattered: the old
  helper sent every event both to the GA4 tag and to `dataLayer`, so GA4 could have counted each
  event twice (fixed in Round 12); Google's Analytics terms require a privacy notice that
  discloses Analytics (`/privacy`, Round 11); and six of the events arrived with that release.
  All three are live now.
- [x] The privacy page items this checklist named from Round 12 ("For the owner before it ships")
  are settled. You confirmed "We do not sell it" on 2026-11-15. The "Last updated" date is the
  day the page's visible text last changed: `LAST_UPDATED` in `app/privacy/page.tsx` shows
  November 20, 2026 in every build (section 5, item 1; part C checks the go-live day).
- [ ] On `/privacy`, the Analytics section reads "This website does not use an analytics service
  right now." and the page reads "Last updated November 20, 2026". The Analytics sentence is
  correct until the ID is set; the date is the same in every build.

### B. Create GA4 and set it up before the ID goes live

Everything here except the last two items was done on 2026-11-18. Those two, the custom dimensions
and the key event, are optional reporting setup that the owner deferred: they do not block
activation. GA4 applies each only from the day it is set, so data collected before then cannot be
split by those parameters or counted as key events; the events themselves are collected from
activation.

- [x] At <https://analytics.google.com>, signed in as the business Google account that holds the
  www Search Console property: Admin > Create > Property. If Google Analytics asks you to create
  an account first, name the account Las Vegas Mahjong and turn off every optional data-sharing
  setting it offers (if the account already exists, check that those settings are off). Name the
  property Las Vegas Mahjong. Choose the Los Angeles (Pacific) reporting time zone, so GA4's days
  match yours, and US dollars. Anyone who helps with the setup steps below needs the Editor role;
  Viewer is enough for checking.
- [x] Data stream: Admin > Data collection and modification > Data streams. Add a **Web** stream
  for `https://www.lasvegasmahj.com` and copy its Measurement ID (it starts with `G-`).
- [x] Enhanced measurement, on that stream's page:
  - **Page views** on, with "page changes based on browser history events" on (some links on the
    rules pages, Ask a Rule, the blog, the privacy page and the not-found page open the next page
    without a full reload; most other links reload the page);
  - **Scrolls, Outbound clicks, Site search, Form interactions, Video engagement and File
    downloads** off. With Outbound clicks on, every Bookwhen click would also send GA4's own
    `click` event (two events for one click), and every shop, Amazon and social link would send
    its full address, which `/privacy` does not describe. The site sends its own form events, and
    GA4's form events cannot tell the contact form from the footer newsletter box (neither form
    has a name or id). `/privacy` does not describe scroll, site search, video or download
    tracking either.
- [x] Redact data, in the Events section of the same stream page: keep **Email** redaction on
  (Google's default for new properties), and redact the query parameter `mc_eid` (Mailchimp's
  per-subscriber id, which links in a newsletter email can carry).
- [x] User-provided data: on the same stream page, Configure tag settings > Allow user-provided data
  capabilities **off**, then publish the tag change (a saved change does nothing until it is
  published). It is on by default for a new tag and detects email addresses, phone numbers and
  street addresses on the page; the site must never send those.
- [x] Data retention: Admin > Data collection and modification > Data retention. Set both event
  data and user data retention to **14 months**. The default, 2 months, is too short for the
  monthly views in section 3.
- [x] Google signals: Admin > Data collection and modification > Data collection. Leave "Enable
  Google signals data collection" **off**, and link no Google Ads account. `/privacy` describes
  neither, and with Google signals on, GA4 can hide small numbers in reports. If you ever want
  either, update `/privacy` first.
- [ ] Deferred (owner, 2026-11-18). Custom dimensions: Admin > Data display > Custom definitions >
  Custom dimensions > Create custom dimension. Create these seven, each with Scope **Event**, and
  with Dimension name and Event parameter both set to exactly the parameter's name (Description is
  free text):
  - `source_label` and `inquiry_type` (the contact form);
  - `source_slug` (contact clicks) and `link_url` (Bookwhen clicks);
  - `category`, `matched` and `target` (the monthly Ask a Rule view, section 3.3, item 7).

  Create all seven as soon as convenient. If GA4 refuses `link_url` because a built-in Link URL
  dimension exists, use the built-in one and write that down. Register nothing else: `page_path`
  never arrives; `link_domain` is always bookwhen.com for Bookwhen clicks and the site's own host
  for the others; and `origin`, `kind`, `label`, `via`, `turn`, `reason` and `topic` are sent, but
  no planned report needs them. The page a click happened on needs no setup: it is the built-in
  page path.
- [ ] Deferred (owner, 2026-11-18). Key event: Admin > Data display > Events > "+ Create event".
  Name it `contact_form_success`, turn on "Mark as key event", and choose "Create with code" if
  Google asks. Add **no** matching conditions: a rule with conditions would copy events. Google's
  own `purchase`, `qualify_lead` and `close_convert_lead` stay as they are (the site never sends
  them). This is the only one of the site's events to mark: not
  `contact_submit` (the same inquiry again), and not `booking_link_click` (a click, not a booking).

### C. Switch it on

- [x] Part E has passed (2026-11-18).
- [x] Done 2026-11-20. In Vercel, project **`lasvegasmahj-h1iz`** (team `lasvegasmahj-6104s-projects`), Settings >
  Environment Variables:
  <https://vercel.com/lasvegasmahj-6104s-projects/lasvegasmahj-h1iz/settings/environment-variables>.
  Add `NEXT_PUBLIC_GA4_ID` with the `G-` ID, for **Production** only, so preview builds send
  nothing. Add it before the merge below: the site reads the ID while it builds.
  - Sign in as the team owner. A Developer cannot change production variables.
  - Do not set `NEXT_PUBLIC_GTM_ID` (you chose the direct GA4 tag) or `NEXT_PUBLIC_META_PIXEL_ID`
    (not approved, not on `/privacy`).
  - Use that project only. The sibling project also named `lasvegasmahj` builds every commit but
    does not serve the domain.
  - Never type the ID into the code. A test checks only the three analytics files for a typed ID.
- [x] The privacy page date matches the go-live day, the day you press Promote (Las Vegas time).
  `LAST_UPDATED` in `app/privacy/page.tsx` shows November 20, 2026 in every build, the release
  day. If Promote slips past that day, your developer changes that date in that file,
  `tests/privacy-page.logic.spec.ts`, `tests/seo-round12-owner-decisions.spec.ts` and the page's
  sitemap date in `app/sitemap.ts`, reruns the checks, and a new build with the new date replaces
  the staged one.
- [x] Done 2026-11-20. With your release approval, your developer merges the pull request for
  branch `analytics/ga4-setup` (pull request #132). Automatic domain assignment is off, so Vercel
  builds a production deployment and holds it as Staged: the live site does not change yet.
- [ ] You press **Promote** on that deployment in Vercel, signed in as the team owner. There is no
  separate Redeploy step: the build from the merge already carries the ID. Do not use the Vercel
  command-line tool.

### D. Check the live site

These checks use only page views and link clicks, and every test event carries a label. Do not
send an inquiry, sign up for the newsletter or book anything to test them; part E covered those
events with a labelled test.

- [ ] Your developer confirms that the live pages load the Google tag once, with your `G-` ID.
- [ ] <https://www.lasvegasmahj.com/privacy>: the Analytics section now names Google Analytics 4 and
  lists, in plain words, schedule links, contact links, clicks to the booking pages on Bookwhen
  ("This counts the click, not a booking"), the contact form, the newsletter and Ask a Rule. The
  page reads "Last updated November 20, 2026" (the go-live day set in part C), and the cookies
  section reads "This website does not set any cookies of its own. Google Analytics sets the
  cookies described above." If the page still says "does not use an analytics service", the
  build did not pick up the ID: stop.
- [ ] Your developer runs the short labelled live check: the same browser script as part E, against
  `https://www.lasvegasmahj.com`, with page views and link clicks only (the homepage, "Book Now"
  in the lessons box, a "Request a Quote" button), debug mode on and a `test_run` label on every
  request. Google must accept the requests, and each action must send its event once. If you
  want to watch, GA4 > Reports > Realtime shows the `page_view` and `schedule_link_click` arrive.
  Only after all three checks pass may anyone say tracking is live (Round 12).

### E. Check each event once, in DebugView

Your developer runs this test on a local copy of the site, before part C. It uses a production
build with the real ID and a browser test script kept outside the repository. The contact form
service and the newsletter service are replaced by stand-ins, and Bookwhen is blocked, so no
inquiry, signup or booking happens. Never test with a real inquiry, a real newsletter signup or a
booking. The test runs twice:

1. **Counting run.** Every hit to Google is answered on your developer's computer, so nothing is
   sent. The script counts the page views and events the site would send, with your property's
   real enhanced measurement settings.
2. **Labelled run.** The script then sends a small set of clearly labelled test events: debug mode
   is on (`debug_mode`), every event carries a `test_run` label, and the pages run on a local host
   name, never `www.lasvegasmahj.com`. You watch Admin > Data display > DebugView (or Reports >
   Realtime) and click each event to read its parameters.

In the table, "the event's page" is the page address GA4 records with the event (`page_location`).

| The test does this | Expect, once each | Check the parameters |
| --- | --- | --- |
| Load the homepage | `page_view` | One page view, not two |
| Click "Book Now" in the homepage lessons box | `schedule_link_click` | `link_url` /schedule; the event's page is the homepage |
| On `/schedule`, click "See the Calendar" | nothing from the site | In-page jumps are not counted |
| On `/schedule`, click one "Book" button (Bookwhen is blocked) | `booking_link_click` | `link_url` starts with `https://bookwhen.com/lasvegasmahjong/`; the event's page is `/schedule`. No GA4 `click` event: Outbound clicks is off |
| On `/privacy`, click the link to Bookwhen's privacy policy | nothing from the site | Only links to the booking pages count |
| On `/mahjong-corporate-las-vegas`, click "Request a Quote" | `contact_link_click` | `source_slug` corporate; the event's page is `/mahjong-corporate-las-vegas` |
| Open `/contact?source=corporate` (where "Request a Quote" leads), fill in test details and send (the stand-in accepts them) | `contact_form_attempt`, then `contact_form_success` and `contact_submit` | `source_label` Corporate Events page, `inquiry_type` Corporate or Team Building; `contact_submit` has none. Nothing typed appears in any parameter |
| On `/studio`, click Contact in the menu | `contact_link_click` | No `source_slug` value (missing or empty); the event's page is `/studio` |
| Subscribe a test address in the footer box (the stand-in accepts it) | `newsletter_signup` | No parameters; the address appears nowhere |
| On `/ask`, tap a starter question | `ask_starter_click`, then `ask_question` | `origin` starter, `turn` 1; the question text appears nowhere |
| Type a question and send it | `ask_question` | `origin` typed; the words typed appear in no parameter |
| Press "Start a new question" | `ask_reset` | none |

- [x] **No duplicates.** In the counting run, each action produced each listed event once, and
  each page load one `page_view`. `contact_form_success` plus `contact_submit` is the designed
  pair, not a duplicate. A GA4 `click`, `scroll`, `view_search_results`, `form_start`,
  `form_submit` or `file_download` event, or any `video_` event, means an enhanced measurement
  option from part B is still on. If anything arrives twice, stop: the usual cause is a second
  Google tag added somewhere else.
- [x] **The labelled run went out** (2026-11-18, desktop): every request carried `_dbg=1` and
  `ep.test_run`, from a local host name, and Google answered the page views, the inquiry, the
  newsletter signup and the Ask a Rule events. Seeing them in DebugView or Realtime is optional.
- [x] **Nothing typed, anywhere.** No request carried a typed value, plain or coded, and no
  user-data parameter. The contact page address carries only `?source=`: the form posts its data
  and never puts it in the address.
- [x] `contact_form_error` cannot be triggered safely by hand (the form service has to fail). The
  counting run covers it with two mocked failures, and so does the automated test
  `tests/analytics-events.spec.ts`. In GA4 it appears only when a real failure happens.

### F. Finish

- [ ] After 24-48 hours, Reports > Engagement > Events lists the events. Standard reports lag;
  Realtime and DebugView do not.
- [ ] Stop counting your own visits, once the checks above are done: install Google's opt-out
  add-on (linked from `/privacy`) in the browsers you use for the site, or define internal traffic
  by IP address in the data stream's tag settings and switch on that filter. The labelled test
  events from parts D and E carry `test_run` (part E's also a local host name); note them in the
  first week's numbers.
- [ ] Send your developer the date, which production deployment you promoted (the current
  Production deployment on Vercel's Deployments page) and the list of checks that passed. Your
  developer records them in the SEO handoff (`docs/handoffs/lvm-seo-current.md`). Until that
  record exists, nobody calls tracking live.

---

## 3. Reporting plan

### 3.1 Four records, four jobs

| Record | The record of truth for |
| --- | --- |
| Your inbox (Formspree emails) | Inquiries. Every form email since 2026-09-06 carries `source` (the page label) and `inquiry_type` (section 3.5) |
| Bookwhen | Bookings |
| Mailchimp | Newsletter subscribers |
| GA4 | How people move through the site and where they stop. It normally undercounts (section 1.3) |

Keep one simple spreadsheet, for example "LVM Measurement Log" in your Las Vegas Mahjong
Dashboards folder in Drive: one row per week, one tab per month.

### 3.2 Weekly check (Monday, covering the previous Monday to Sunday)

| Column | Where it comes from |
| --- | --- |
| Inquiries received | Inbox: website form emails, minus tests and spam |
| Inquiries by type | Inbox: the `inquiry_type` line of each email |
| GA4 inquiries | GA4: `contact_form_success` count |
| Form errors | GA4: `contact_form_error` count |
| Bookwhen clicks | GA4: `booking_link_click` count (it fires only for links to the booking pages, so no filter is needed) |
| Bookwhen bookings | Bookwhen: bookings made that week |
| New subscribers | Mailchimp: audience change, with GA4 `newsletter_signup` beside it |
| Notes | Anything unusual: a social post, press, a holiday, a site change |

Three warning signs to act on the same week:

1. **GA4 inquiries are higher than inbox inquiries.** Something counts twice, or Formspree did not
   deliver. Check Formspree's list of submissions and your spam folder.
2. **Any `contact_form_error`.** Someone saw the error message. Check that the form still sends.
3. **No events at all for the week.** Check that `/privacy` still names Google Analytics and that
   Realtime still shows visits.

### 3.3 Monthly review (first week of the month)

1. **Inquiries by source page and type.** GA4 Free-form exploration: rows `source_label`, columns
   `inquiry_type`, value Event count, filtered to `contact_form_success`. Check the total against
   the inbox.
2. **Contact clicks and inquiries by page.** `contact_link_click` by page path (the built-in "Page
   path and screen class") and `source_slug`, beside `contact_form_success` by `source_label`.
   Call the ratio "inquiries per 100 contact clicks"; a visitor can click today and send later, or
   never.
3. **Bookwhen clicks by page.** `booking_link_click` by page path (`/schedule`,
   `/play-mahjong-las-vegas`, `/mahjong-leagues-las-vegas`), then by `link_url` to see which
   sessions draw clicks. Beside it, Bookwhen bookings by class.
4. **Lessons path.** Funnel exploration, within one visit: a view of `/mahjong-lessons-las-vegas`,
   then a view of `/schedule`, then `booking_link_click`.
5. **Outcomes.** From your own records: how many of the month's inquiries became paid bookings, by
   inquiry type. This is the real result for private lessons, parties and corporate events, which
   do not book through the site.
6. **Newsletter.** Mailchimp's net growth, and `newsletter_signup` by page.
7. **Ask a Rule, read only.** The `ask_question` count, how many had `matched` true, the top
   `category` values, and `ask_nudge_click` against `ask_nudge_shown` by `target`. This view needs
   the `matched`, `category` and `target` dimensions from section 2.B, created before the ID goes
   live. Any change to Ask a Rule stays your decision.
8. **Search.** Search Console clicks and impressions for the same pages, for the month just ended
   (Performance, Search results, Pages tab). Build it like the exports in SEARCH-EVIDENCE.md,
   section 5, but with the month as the date range: those exports use fixed windows around the
   October releases.

Build the saved views once (anyone with GA4 Editor access): three Free-form explorations named
Inquiries, Contact clicks and Bookwhen clicks, and one Funnel exploration named Lessons to
Bookwhen.

### 3.4 Bookwhen clicks versus Bookwhen bookings

These are two different things. Write them side by side; never add them together, and never put
one in place of the other.

- **Bookwhen clicks** (`booking_link_click`): someone on the site clicked a link to one of the
  booking pages on Bookwhen.
- **Bookings** (Bookwhen): someone finished booking on bookwhen.com.

You can watch "bookings per 100 Bookwhen clicks" as a trend, but never call it the site's booking
rate. The two numbers differ for known reasons:

1. Bookings can also come from people who never visit the site, for example through a Bookwhen
   link shared by email or on social media, or a returning player who goes straight to Bookwhen.
2. Visitors who block analytics are missing from GA4, but their bookings count in Bookwhen.
3. A click can lead to a booking days later, or to none.
4. One booking can hold more than one seat. If Bookwhen shows seats, track bookings and seats in
   separate columns.
5. Middle-button and "Open in new tab" clicks are not counted (section 1.3).
6. The leagues page's "View Booking Page" button opens the general Bookwhen page, not one session.

To compare one session: for a single session, `link_url` ends with the Bookwhen event code (`ev-`,
then an id, then the session's start date and time). Match it with that session's bookings in
Bookwhen.

### 3.5 Numbers on record today

These are the only traffic numbers in any source reviewed (SEARCH-EVIDENCE.md, section 2). Each
has its own date range, and the two cannot be compared with each other.

- **Google Search, whole site:** 450 clicks in the 28 days ending 2026-10-03 (Search Console email
  of 2026-10-05).
- **Query table, three months ending about 2026-09-05** (exact dates not recorded):
  "las vegas mahjong" 136 clicks, 306 impressions, 44.4% CTR, position 2.6; "mahjong las vegas"
  83, 299, 27.8%, 1.9; "american mahjong las vegas" 20, 60, 33.3%, 2.8; "mahjong lessons las
  vegas" 10, 35, 28.6%, 1.2. For "mahjong lessons las vegas", the homepage sat at about position
  1.2 and `/mahjong-lessons-las-vegas` at about 2.3.

No analytics, inquiry or booking numbers exist in any source reviewed. Two baselines can be built
now, before GA4:

- **Inquiries:** emails sent since 2026-09-06 (Round 3) carry a source label and an Inquiry Type
  (the homepage pop-up gained both later that same day); older emails carry neither. Some labels
  started later: Studio Page on 2026-09-07, the visitor page and four corporate and group page
  labels in early October (Rounds 4 and 5), and Schedule, Summerlin and Henderson since this
  branch went live on 2026-11-16. Menu, footer and direct inquiries arrive as "General (nav,
  footer or direct)". Count the emails by month, label and type.
- **Bookings:** Bookwhen holds past bookings. Note bookings by class for each month.

---

## 4. Future experiments, in priority order

Ranked by readiness (a sourced patch exists, or one owner answer unlocks it), the evidence behind
each, and effort. Every benefit below is a hypothesis.

### Rules for every experiment

1. Start only after GA4 is verified and 4 full weeks of clean data exist. Until then nothing can
   be compared. The branch launch itself can be judged only in Search Console, because GA4 starts
   after it: run a site-wide compare built like export 1 in SEARCH-EVIDENCE.md, but with the 28
   days after this branch's go-live day against the 28 days before it, skipping the go-live day
   itself as export 1 does. Export 1 as written covers the October releases, not this branch.
2. One change per page, and never two changes on the same path at the same time.
3. Compare equal windows of whole weeks (Monday to Sunday) before and after the change. Note
   holidays and unusual weeks.
4. **Minimum to judge:** at least 4 full weeks on each side, and at least 10 of the outcome events
   in each window. If either window has fewer, extend both to 8 weeks, then to 13. If there are
   still fewer, write "too little data to judge" and decide on judgment, not on the numbers. This
   is a rule of thumb, not a statistical test: at these counts a difference of a few events is
   normal.
5. Every change still needs your approval before it goes live, and the protected pages (the
   homepage and `/mahjong-lessons-las-vegas`) take surgical edits only.
6. Log each experiment: what changed, the date, both windows and the counts.

| # | Change | Main outcome | Effort | Waiting on |
| --- | --- | --- | --- | --- |
| E1 | Corporate hub "at a glance" section | Hub quote clicks per 100 hub views; "Corporate Events page" inquiries | Low | Nothing: approved and installed 2026-11-15, part of this release |
| E2 | Lessons page "Which One Is Right for You?" | Schedule clicks per 100 lessons page views; "Lessons page" inquiries | Low to medium | Nothing: approved and installed 2026-11-15, part of this release |
| E3 | Card answer for open play and visitors | Bookwhen clicks from the visitor page; schedule clicks from the open play page | Low | Your answer to lane 4 question A3 |
| E4 | Private lesson length and group limit | Private lessons quote clicks and inquiries | Low | Your answer to lane 4 question A4 |
| E5 | Summerlin and Henderson: keep or fold in | Search impressions; quote clicks; inquiries | Low to measure | Data |
| E6 | Lessons page booking detour | Share of lessons page visits that reach Bookwhen | None to measure | Data |
| E7 | "mahjong las vegas" search snippet | Search Console CTR for that query | Low | Finding which page Google shows (E7, first step) |

### E1. Corporate hub: "Corporate Mahjong at a Glance"

- **Change:** replace the hub's "What We Bring to Your Event" cards with the at-a-glance section
  (what it involves, who it suits, what we provide, what your venue provides, how to request a
  quote) and a third "Request a Quote" button to `/contact?source=corporate`. Patch:
  `~/Projects/.lvm-sprint-2026-11-13/lane5-corporate-preview/preview.patch`; every sentence is
  traced to a published line in that folder's SOURCES.md.
- **Hypothesis:** planners who see the format, what is included and what the venue supplies in
  one place request a quote more often.
- **Outcome:** `contact_link_click` with `source_slug` corporate and page path
  /mahjong-corporate-las-vegas, per 100 hub page views; and `contact_form_success` with
  `source_label` "Corporate Events page", checked against the inbox. Per window.
- **Minimum:** the standard rule, counting hub quote clicks.
- **Guardrail:** the hub's Search Console clicks and impressions (filtered like export 3, 28 days
  after the change against 28 days before) do not fall.
- **Timing:** after the Round 7 hub readout due 2026-11-30 (gap audit B4), so this change does not
  muddy that readout.
- **Effort:** low. Your approval of the wording; the patch already updates the two button-count
  tests. The planner questions in that SOURCES.md, section 4, can follow later as separate changes.

### E2. Lessons page: "Which One Is Right for You?"

- **Change:** four cards (group classes; private lessons at the studio; lessons at your home or
  venue, by request; Social Open Play for people who already know the game), each with a text
  link, plus the new `lessons` tag. Patch:
  `~/Projects/.lvm-sprint-2026-11-13/lane6-lessons-preview/preview.patch`.
- **Hypothesis:** visitors unsure which option fits pick one sooner, so more of them reach the
  schedule or ask about a private or home lesson.
- **Outcome:** `schedule_link_click` with page path /mahjong-lessons-las-vegas (any link on the
  page, the menu included) per 100 lessons page views; `contact_form_success` with `source_label`
  "Lessons page"; the Lessons to Bookwhen funnel.
- **Minimum:** the standard rule, counting schedule clicks from the page.
- **Guardrail (undo the change if it fails):** the page's Search Console position and clicks for
  "mahjong lessons las vegas" hold, 28 days after against 28 days before. On record: about
  position 2.3 for that query (three months ending about 2026-09-05). Title, H1 and canonical stay
  untouched (CI-locked).
- **Effort:** low to medium. A protected page, so it needs your explicit approval; the patch also
  updates the guard tests. Do not run it at the same time as E6.

### E3. Open play and visitors: can a player buy a current card at the studio?

- **Change:** once you answer lane 4 question A3, add the answer to the open play FAQ (and to the
  visitor page FAQ if you want). Never say cards are provided at Open Play (owner decision,
  2026-09-29), and no dollar figure on the visitor page (test-enforced).
- **Hypothesis:** a visiting player who forgot a card, or has last year's, can tell whether they can
  still come, so fewer stop before booking.
- **Outcome:** `booking_link_click` with page path /play-mahjong-las-vegas per 100 visitor page
  views, and `schedule_link_click` with page path /mahjong-open-play-las-vegas per 100 open play
  page views. Social Open Play bookings in Bookwhen per month, as context only.
- **Minimum:** the standard rule.
- **Effort:** low, after your answer.

### E4. Private lessons: length and group limit

- **Change:** once you answer lane 4 question A4, add how long a private lesson runs and the
  largest group taught as a private lesson to the private lessons FAQ. Studio-first, home or
  venue by request, contact for pricing.
- **Hypothesis:** visitors who know the length and the group limit are readier to ask, and their
  inquiries need less back and forth.
- **Outcome:** `contact_link_click` with `source_slug` private-lessons per 100 private lessons page
  views; `contact_form_success` with `source_label` "Private Lessons page"; from your records, how
  many of those inquiries became a booked private lesson.
- **Minimum:** the standard rule, counting quote clicks.
- **Effort:** low, after your answer.

### E5. Summerlin and Henderson: keep or fold in (a decision, not a page change)

- **Hypothesis:** if both pages draw almost no search impressions and no inquiries, folding them
  into `/mahjong-lessons-las-vegas` (a 301 redirect, with their footer links removed in the same
  change, gap audit B10) loses nothing and fits the rule against repetitive neighborhood pages.
- **Outcome:** Search Console impressions and clicks for each page (export 4, last 16 months); GA4
  page views, `contact_link_click` with `source_slug` summerlin or henderson, and
  `contact_form_success` with `source_label` "Summerlin Lessons page" or "Henderson Lessons page".
- **Minimum:** the 16-month export plus 8 weeks of GA4 data.
- **Effort:** low to measure; medium to fold in (redirects, footer, tests). Your decision.

### E6. Lessons page booking detour (measure only)

- **Today:** the lessons page's "Book a Lesson" buttons go to the homepage lessons box
  (`/#classes`) on purpose (Round 2), and tests pin them.
- **Hypothesis:** the extra stop on the homepage loses some visitors on their way to the schedule.
- **Outcome:** GA4 Path exploration starting at `/mahjong-lessons-las-vegas`: of the visits that go
  next to the homepage, the share that then click to the schedule (`schedule_link_click` with
  page path /) and then to Bookwhen (`booking_link_click`).
- **Minimum:** 8 weeks of data.
- **Effort:** none to measure. Changing the buttons reverses a recorded decision on a protected
  page, so bring the numbers to the decision first.

### E7. "mahjong las vegas" search snippet

- **Evidence (three months ending about 2026-09-05):** about the same impressions as "las vegas
  mahjong" (299 against 306) and a better position (1.9 against 2.6), but a 27.8% CTR against
  44.4%. Which page Google shows for it is not recorded (SEARCH-EVIDENCE.md, section 3, item 2).
- **Hypothesis:** a clearer title or description on that page earns more of those clicks.
- **First step:** find the page. Export 2 in SEARCH-EVIDENCE.md shows whether the homepage or the
  lessons page is the one Google shows for "mahjong las vegas". If it is neither, check export 3
  (the corporate hub, which drew impressions for this query in the Round 7 record), or filter
  Search Console by that exact query and open the Pages tab.
- **Outcome:** Search Console CTR and clicks for the query, 28 days after against 28 days before.
- **Effort:** low. If the page is the homepage or the lessons page, only a surgical, approved
  snippet edit. The search research lane owns the wording; this entry only defines how to measure
  it.

---

## 5. Open items, and what this plan could not source

1. **The "Last updated" date on `/privacy`: settled in the code.** `LAST_UPDATED` in
   `app/privacy/page.tsx` shows November 20, 2026 in every build, the day the Analytics text and
   the Ask a Rule log wording changed. If Promote slips past that day, your developer changes that date, the page's
   sitemap date and the two tests that pin them, and a new build replaces the staged one (section
   2.C).
2. Whether Bookwhen can send completed bookings to GA4: not verified (Round 11).
3. What Bookwhen's own reports show (bookings by the date they were made, seats per booking): not
   checked. Adapt section 3.4 to what Bookwhen shows.
4. GA4 menu names and settings in section 2 come from Google's help pages (read 2026-11-18) and
   from the property itself. If a menu reads differently, follow the intent of the step.
5. No traffic, inquiry, booking or newsletter volume exists in any source reviewed beyond the
   Search Console figures in section 3.5. The minimum-data rules in section 4 are rules of thumb.
6. If anyone adds or tightens a Content-Security-Policy later, it must allow Google's tag, or
   analytics stops with no sign on the page.
7. The lane 5 and lane 6 sections were approved and installed on 2026-11-15. They went live with
   this branch on 2026-11-16, so experiments E1 and E2 have no "before" window and are part of
   the launch.
8. Answers that unlock experiments: lane 4 questions A3 (cards at the studio) and A4 (private
   lesson length and group limit), and the planner questions in lane 5 SOURCES.md, section 4.

---

## 6. Sources

- **Code** (branch `seo/invisible-technical-fixes`, read 2026-11-13): `lib/analytics.ts`,
  `components/analytics.tsx`, `components/track-clicks.tsx`, `components/contact-form.tsx`,
  `components/inquiry-modal.tsx`, `components/newsletter.tsx`, `components/footer.tsx` (newsletter
  box), `lib/use-mailchimp.ts`, `app/ask/ask-client.tsx`, `lib/ask/nudges.ts`, `lib/ask/labels.ts`,
  `app/privacy/page.tsx`, the `?source=` links under `app/`, the Bookwhen links rendered by
  `/schedule`, `/play-mahjong-las-vegas` and `/mahjong-leagues-las-vegas`, and the test names in
  `tests/analytics-events.spec.ts`. Added in review: `components/nav.tsx` (menu links), the 13
  files under `app/` that import Next.js links, `tests/seo-round10-visible.logic.spec.ts` (the ID
  guard), and the Git history of `components/contact-form.tsx` and `components/inquiry-modal.tsx`
  on `origin/main` (when each label started).
- **Code change of 2026-11-18** (branch `analytics/ga4-setup`):
  `lib/analytics.ts` (`linkClickEvent`: no page parameter, Bookwhen booking pages only),
  `app/privacy/page.tsx` (`LAST_UPDATED` and the Analytics text), the tests that commit updates,
  and the new `tests/analytics-ga4-setup.logic.spec.ts`.
- **GA4 setup:** the owner's GA4 decisions of 2026-11-18, and Google's help pages for the menu
  paths in section 2 (read 2026-11-18).
- **Records:** `docs/handoffs/lvm-seo-current.md` (Rounds 12, 11 and 10; Round 2 for `/#classes`;
  Round 3 for source attribution); `CLAUDE.md` (Hard Rules, Pricing).
- **Sprint findings,** `~/Projects/.lvm-sprint-2026-11-13/`: `lane7-analytics-search/SEARCH-EVIDENCE.md`,
  `lane1-journeys/NOTES.md`, `lane4-content/PROPOSALS.md`, `lane5-corporate-preview/SOURCES.md`,
  `lane6-lessons-preview/SOURCES.md`, `lane2-a11y/NOTES.md`, `lane3-perf/NOTES.md`.

---

## Review notes (independent review, 2026-11-13)

Each issue was checked against the code, the handoff and SEARCH-EVIDENCE.md. All twelve were
real, so all twelve are fixed and none was rejected.

1. **Section 1.3 said "GA4 always counts fewer than your inbox and Bookwhen": fixed.** That
   wording mixed clicks with bookings, and "always" contradicted warning sign 1. The bullet now
   says GA4 normally shows fewer inquiries and has no booking number. Section 3.1 changed "always
   undercounts" to "normally undercounts" for the same reason.
2. **Rule 1 and the E1 guardrail used exports 1 and 3 as written: fixed.** Those exports use fixed
   windows (2026-10-06 to 2026-11-02 against 2026-09-07 to 2026-10-04) built to judge the October
   releases. Both now use the same filters over 28 days after against 28 days before. Section
   3.3, item 8 had the same flaw and now uses the month as its date range.
3. **`matched` was not a custom dimension: fixed.** `app/ask/ask-client.tsx` line 201 sends it.
   Section 2.B now lists `matched`, `category` and `target` to create before go-live. The rows in
   section 1.1 and section 3.3, item 7 say the monthly view needs them.
4. **The DebugView order sent the test inquiry from an untagged form: fixed.** The menu's Contact
   link goes to plain `/contact` (`components/nav.tsx` line 129), which falls back to the general
   label (`components/contact-form.tsx` lines 124-127). The test inquiry now comes straight after
   "Request a Quote", with the menu click after it. That row now expects `source_slug` missing or
   empty, because the code leaves it unset.
5. **Section 2.B did not name the Google account or the account step: fixed.** It now points to
   the business Google account that holds the www Search Console property (SEARCH-EVIDENCE.md
   section 1, kept outside this public repository) and covers creating the account first.
6. **E7's first step relied on export 2 alone: fixed.** Export 2 covers only the homepage and the
   lessons page. The step now adds export 3 and a query filter with the Pages tab, and the table
   row matches.
7. **The `schedule_link_click` row excluded clicks on `/schedule`: fixed.** `lib/analytics.ts`
   line 74 skips only a jump within the same page. The menu's Schedule and Join an Event links
   (`components/nav.tsx` lines 99 and 134) count on `/schedule` too.
8. **The reason for history-based page views was wrong: fixed.** Only 13 files import Next.js
   links (39 link tags: Ask a Rule, privacy, blog, not-found, the rules index and 8 rules pages).
   The menu, the footer and the other components use plain links. The setting stays on.
9. **Section 2.C overstated the ID guard: fixed.** `tests/seo-round10-visible.logic.spec.ts`
   lines 69-71 check only three files.
10. **The header contradicted the Round 12 approval: fixed.** You approved analytics in Round 12.
    What still waits is switching it on after go-live.
11. **Section 2.F asked you to edit a file in the code: fixed.** You now send the result to
    your developer, who records it in the handoff.
12. **The inquiry baseline was unclear: fixed.** The Git history of `components/contact-form.tsx`
    shows that before 2026-09-06 the form sent only name, email and message. Round 3 (`fd70083`)
    added 6 labels and Studio Page followed on 2026-09-07 (`e9dca29`). Five more arrived with PR
    #117 (2026-10-03), and Schedule, Summerlin and Henderson arrived with this branch (live since
    2026-11-16). The general label never changed, and the pop-up gained its label later on
    2026-09-06 (`2d0a4dd`).
    Section 3.1 now dates the same claim. The handoff's Round 3 section is at lines 1272-1316,
    not the lines the review cited.
