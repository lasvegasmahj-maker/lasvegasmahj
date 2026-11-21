# Proposed content: private lessons, visitor and corporate pages (2026-11-13)

**Update, 2026-11-15: read this before approving anything below.** This document describes the
site as it was on 2026-11-13. Since then, with the owner's approval: the corporate "At a Glance"
section and the lessons "Find Your Fit" section are installed; the studio photo replaced the
homepage headshot; the five-pack is off the site, so the open play price line reads "$20 per
session"; the neutral setup sentence ("We confirm the venue, tables, chairs and setup
arrangements when planning your event.") replaced every "the venue provides the tables and
chairs" line, and that older rule is retired; no corporate page mentions a tournament; open play
is for players who "already know American Mahjong and are comfortable playing independently".
Where an item below quotes how a page "reads today", check the page first. The current record is
`docs/handoffs/lvm-seo-current.md`, sections dated 2026-11-15.

**Status: proposals only. Nothing in this document has been installed.** Writing it changed no
page, component, test or setting, and nothing was committed, pushed or deployed. Each item goes
to the owner as current-versus-proposed wording, and only her approval installs it.

**Pages:** `/private-mahjong-lessons-las-vegas`, `/play-mahjong-las-vegas` (visiting players) and
`/mahjong-corporate-las-vegas` (corporate hub). No new page is proposed.

**For:** Shauna, to approve or decline each item, and whoever installs the approved ones. The
owner guide (`docs/handoffs/lvm-owner-guide-2026-11-13.md`, section 4) lists everything else that
is waiting for her.

## How to read each item

- **Place.** The file, and the heading or FAQ entry the item follows. Page line numbers come from
  the working copy `~/Projects/lvm-seo-invisible` as read on the afternoon of 2026-11-13, after
  the sprint's lane 1, 2 and 4 merges. A later merge can shift them.
- **Exact text.** FAQ entries are written as `{ q, a }` for the page's existing `faqs` array. All
  three pages build their FAQ structured data from that same array, so a new entry appears on the
  page and in the markup together.
- **Sources.** The confirmed fact, or the file and line, behind every sentence. "Handoff" means
  `docs/handoffs/lvm-seo-current.md`, cited by round and passage because its line numbers move.
- **Approval.** "Wording": every fact is already confirmed, so she approves the words only.
  "Decision": she also makes the choice named in the item.
- **Guards.** The existing tests each item was checked against, by reading them. A guard cited to
  the handoff instead of a test is an owner rule the item was checked against by reading; no test
  is claimed for it. No build, test or browser ran for this document.
- **Expected benefit.** A hypothesis, not a measured result. The live site runs no analytics yet
  (handoff, Round 12). No search numbers exist for these three pages; the hub has only Round 7's
  note that it drew mostly generic, not corporate, queries
  (`~/Projects/.lvm-sprint-2026-11-13/lane7-analytics-search/SEARCH-EVIDENCE.md`, sections 2 and
  3).

**Checking later.** Nothing is measured today (handoff, Round 10, "Analytics"), and the GA4 code
is ready but not live (handoff, Round 12, "Analytics (lane D)"). Counting starts once the GA4 ID
is set and tracking is verified (Round 12, "Remaining steps, in order", steps 1 to 4). From that
day, `contact_form_success` counts inquiries sent through the contact form,
`schedule_link_click` counts clicks to the schedule, and `booking_link_click` counts clicks out to
Bookwhen. Of these three pages, only the visitor page links straight to Bookwhen, from its Open
Play date cards when the feed lists sessions (`app/play-mahjong-las-vegas/page.tsx:272`). The
private page and the hub have no Bookwhen link; their inquiry buttons lead to the contact form. A
`booking_link_click` is a click out to Bookwhen, never a completed booking; bookings are counted
in Bookwhen (handoff, Round 12).

Splitting inquiries by page also needs step 5 of that list. The form lives on `/contact`, so
`source_label` records which page's inquiry button brought someone to the form, and
`inquiry_type` records the option they chose. Step 5 registers both, with `page_path` and the
three other parameters it names, as custom dimensions in GA4. (Superseded on 2026-11-18: the site
no longer sends `page_path`, and the measurement plan, section 2.B, lists the dimensions to
register, which the owner deferred.) GA4 shows a parameter only from the
day its dimension exists (`docs/handoffs/lvm-measurement-plan-2026-11-13.md`, "Words used below"),
so an inquiry that arrives before step 5 can never be split by page or inquiry type. The
measurement plan's checklist lists them (its section 2, part B); the owner deferred them on
2026-11-18, so inquiries sent before they are registered cannot be split that way in GA4, though
each inquiry email still shows both.

**Timing, if she wants a before-and-after comparison.** GA4 holds nothing from before its ID goes
live. An item that goes live before the ID, or in the same release, starts its counts with the
item already on the page, so there is nothing to compare it with. For a comparison, install an
item only after both of these:

1. Lane 7's Search Console exports are pulled (lane 7, section 3, item 1: "Pull the data before
   any content change"; the exports are listed in its section 5).
2. GA4 has at least 4 full weeks of clean, verified data. That is the measurement plan's minimum,
   and it asks for longer when counts are low (its section 4, "Rules for every experiment", rules
   1 and 4).

Items that go live together on one page can be judged only together (same list, rule 2). She can
also install an item sooner and accept that its result cannot be compared. Sections 1 and 2 repeat
this note, and the hub adds its own Search Console readout (section 3).

## Already proposed elsewhere (referenced here, not repeated)

- **Corporate hub, lane 5 preview** (`~/Projects/.lvm-sprint-2026-11-13/lane5-corporate-preview/`,
  `preview.patch` and `SOURCES.md`). It replaces the "What We Bring to Your Event" cards with
  "Corporate Mahjong at a Glance": what it involves, who it suits, what we provide, what the venue
  provides, and a "How to Request a Quote" panel that names the pricing factors. Not merged; it
  waits for the owner. Its nine planner questions are reused in the final section.
- **Lessons page, lane 6 preview** (`~/Projects/.lvm-sprint-2026-11-13/lane6-lessons-preview/`).
  It adds "Which One Is Right for You?" to `/mahjong-lessons-las-vegas`: group classes, private
  lessons at the studio, lessons at a home or venue, and Social Open Play side by side. The private
  page's "See Group Classes" button (line 94) and "group classes" link (lines 144-145) already lead
  to that page, so no second comparison is proposed for the private page.
- **Lane 4** (`~/Projects/.lvm-sprint-2026-11-13/lane4-content/PROPOSALS.md`). Its C1, the private
  page's "home or venue" answer, is merged locally (line 26). Its questions A1 and A3 to A7 are
  reused in the final section.
- **Corporate examples.** Three owner answers are still needed (handoff, Round 10, "Corporate
  event proof"; the questions are kept privately). Nothing below depends on them.
- **Private page share picture.** The page shares `OG_SHAUNA`, the headshot with "Certified Oh My
  Mahjong instructor" printed on it. Her choice of crop A, B or C is pending (handoff, Round 12,
  "New owner decision found by the review"). Closed on 2026-11-15: `OG_SHAUNA` is now the studio
  photo by the neon sign and the headshot is retired, so that crop choice no longer applies (the
  optional wide crop of the new photo is a separate, deferred item).

---

## 1. Private lessons page

`app/private-mahjong-lessons-las-vegas/page.tsx`. FAQ array: lines 21-27. The FAQ markup is built
from it at line 78.

The FAQ already answers: lessons for a few friends (line 22), what to bring (23), cost (24), a
lesson or a party (25), and home or venue (26). No answer walks through how a lesson gets booked
or how to pay, nothing speaks to someone visiting Las Vegas, and the visible page never says it
teaches American Mahjong (only the structured data at line 36 does).

**Guards for every item in this section** (`tests/seo-round1.logic.spec.ts`): no phone number
(lines 122-127); no "$" followed by a digit, and none of "minimum", "package" or "travel fee"
(133-136); "Contact for Pricing" stays (138-140); "in home" appears one to three times and the
studio sentence stays (142-147); no "MAHJ101", "MAHJ102" or "MAHJ103" (149-151). Also no added or
travel fee wording (`tests/seo-round12-owner-decisions.logic.spec.ts:25-28`) and no reply-time
promise (handoff, Round 5, owner decision 5). Every item below passes all of them on reading.

**Voice.** The new entries say "we", so they stay true whoever teaches (question N1 in the final
section).

**Timing.** For a before-and-after comparison, install these items only after lane 7's Search
Console exports are pulled and GA4 has at least 4 full weeks of verified data (see "Timing, if she
wants a before-and-after comparison" near the top). Installed earlier, or in the same release as
the GA4 ID, their result cannot be compared.

### P1. "How do I book a private lesson?"

Place: after "How much does a private lesson cost?" (line 24).

```tsx
  { q: "How do I book a private lesson?", a: "Send us an inquiry through the contact form. Tell us how many people are learning, where you are starting (complete beginner, lapsed player, or somewhere in between), and roughly when you are free. We will send you the details and find a time that works for you." },
```

Sources:

- "Send us an inquiry through the contact form." Line 26 ("Send us an inquiry with where you
  are, ..."). All three inquiry buttons on the page go to `/contact?source=private-lessons`
  (lines 93, 179, 212), which pre-selects "Private Lesson" (`components/contact-form.tsx:25`).
- "Tell us how many people are learning, where you are starting (...), and roughly when you are
  free." Line 26 ("how many people are learning"); line 67 ("Complete beginner, lapsed player, or
  somewhere in between."); line 209 ("roughly when you are free").
- "We will send you the details and find a time that works for you." Lines 24 and 176 ("I will
  send you the details"); line 59 ("We find a time that works for you").

Approval: wording.
Expected benefit (hypothesis): a visitor who is unsure whether "Ask About a Private Lesson" books a
lesson or only asks sees the next step, and the first message carries what a reply needs.

### P2. "How can I pay for a private lesson?"

Place: after P1.

```tsx
  { q: "How can I pay for a private lesson?", a: "We accept card, cash, Venmo and Zelle." },
```

Sources: owner fact of 2026-11-12 (handoff, Round 10, "Accepted payments are card, cash, Venmo and
Zelle."). The same words are already approved in the schedule's payment note
(`app/schedule/page.tsx:185`), and the sitewide business data lists the same four
(`app/layout.tsx:98`).

Approval: wording. The answer names the methods only, because when payment is due is not on
record (question N2).
Expected benefit (hypothesis): someone who prefers Venmo or Zelle knows before asking that it
works.

### P3. "Can I take a private lesson while I am visiting Las Vegas?"

Place: after "Can you teach at my home or venue instead?" (line 26), as the last entry.

```tsx
  { q: "Can I take a private lesson while I am visiting Las Vegas?", a: "Yes. Send us the dates you are in town and how many people are learning, and we will plan it with you. Private lessons are taught at our studio inside Lucky Hare on West Sahara." },
```

Sources:

- "Yes." The visitor page already offers visitors "Private mahjong lessons at the studio, for one
  player or a small group" (`app/play-mahjong-las-vegas/page.tsx:385-386`).
- "Send us the dates you are in town and how many people are learning, and we will plan it with
  you." Visitor page FAQ, line 78 ("send us your dates and group size through the contact form
  and we will plan it with you"); this page, line 26 ("how many people are learning").
- "Private lessons are taught at our studio inside Lucky Hare on West Sahara." Line 156, word for
  word.

No travel time, hotel or distance is stated: none is on record.
Approval: wording.
Expected benefit (hypothesis): a visitor who reaches this page from a search, not through the
visitor page, learns that being in town for a short trip is no barrier, and what to send.

### P4. "Which kind of mahjong do you teach?"

Place: after "Do I need to bring anything?" (line 23).

```tsx
  { q: "Which kind of mahjong do you teach?", a: "American Mahjong, played with the current National Mah Jongg League (NMJL) card. It is not Riichi (Japanese) mahjong, and it is not Chinese or Hong Kong style mahjong." },
```

Sources: `app/mahjong-lessons-las-vegas/page.tsx:53` ("We teach American Mahjong using the
National Mah Jongg League (NMJL) card"); `app/play-mahjong-las-vegas/page.tsx:58` (the card
wording, and the Riichi, Chinese and Hong Kong sentence word for word). This page names American
Mahjong only in its structured data (line 36).

Approval: wording.
Expected benefit (hypothesis): someone who plays another style knows what a lesson covers before
asking.

### P5. Optional wording fix in "Where We Meet" (line 159)

- Old: `In home sessions are available by request.`
- New: `Lessons at your home or venue are available by request.`

Sources: owner fact of 2026-11-12, lessons happen at the studio, at customers' homes and at
venues (handoff, Round 10, "What changed the rules"). This page's FAQ (line 26) and the About page
(handoff, Round 12, "Done: fees") already say "home or venue".
Guard: "in home" drops from two uses to one (the structured data at line 36 keeps it), still
within `tests/seo-round1.logic.spec.ts:142-147`.
Approval: wording.
Expected benefit (hypothesis): someone planning a lesson at a clubhouse or another venue does not
read this sentence as homes only.

---

## 2. Visitor page

`app/play-mahjong-las-vegas/page.tsx`. FAQ array: lines 39-84. The FAQ markup is built from it at
lines 86-94.

The FAQ already answers whether visitors can play, where, alone or in a group, which mahjong, the
card, the level, booking ahead, the studio and where the dates are. It does not give the cost or
the payment method (the quick facts card and the steps mention them briefly), or say how long a
session lasts. It gives no next step to a visitor who has never played and whose trip misses the
class dates. And its hero button lands above the dates.

**Guards for every item in this section:** no "$" followed by a digit, and no parking, miles,
"minutes from", "the Strip", rides, "open daily", clock times or "guarantee"
(`tests/seo-round4-visitors.logic.spec.ts:95-108`); the ten owner questions stay (lines 55-71); no
FAQ question may repeat one on the open play page or the corporate pages
(`tests/seo-round5-corporate.logic.spec.ts:138-142`); Open Play numbers come only from
`lib/pricing.ts` (`tests/seo-round6-owner-wording.logic.spec.ts:149-158`); nothing may invite
complete beginners to Open Play (same file, lines 132-140).

**Timing.** As in section 1: for a before-and-after comparison, install these items only after
lane 7's Search Console exports are pulled and GA4 has at least 4 full weeks of verified data.
Installed earlier, or in the same release as the GA4 ID, their result cannot be compared.

### V1. "What does Open Play cost, and how do I pay?"

Place: after "Do I need to reserve in advance?" (lines 68-71).

```tsx
  {
    q: "What does Open Play cost, and how do I pay?",
    a: `${OPEN_PLAY_PRICE_LINE}. You pay when you book your seat online, and online checkout takes card only.`,
  },
```

Read on 2026-11-13 as: "$20 per session, or $85 for a 5-pack. You pay when you book your seat
online, and online checkout takes card only." Since 2026-11-15 the five-pack is not on sale and
not shown, so the answer would read: "$20 per session. You pay when you book your seat online, and
online checkout takes card only."

Sources:

- The price: `lib/pricing.ts:13`, through the constant the page already imports (line 9) and
  shows in its quick facts (line 115). `CLAUDE.md` line 42 keeps the numbers in that one file.
- "You pay when you book your seat online, and online checkout takes card only." Owner fact of
  2026-11-12 (handoff, Round 10: "Online booking (Bookwhen checkout) takes card only."); the
  approved payment note, `app/schedule/page.tsx:185` ("online checkout takes card only"); the open
  play page's own answer, `app/mahjong-open-play-las-vegas/page.tsx:60` ("You pay when you book
  your seat."); this page, line 126 ("secure your seat with card payment").

Guards: `${` is not "$" followed by a digit, so the price check passes, as it does for the quick
facts. The question differs from the open play page's "How much does Open Play cost?" (line 59 of
that file).
Installer note: the page's header comment (lines 14-20) still says the page states no prices, yet
its quick facts show the price line (line 115), which
`tests/seo-round6-owner-wording.logic.spec.ts:160-165` requires. The comment could be corrected in
the same change.
Approval: wording.
Expected benefit (hypothesis): a visitor who goes straight to the FAQ finds the price and the
payment method there, not only in the quick facts card.

### V2. "How long is an Open Play session?"

Place: after V1.

```tsx
  {
    q: "How long is an Open Play session?",
    a: "Two hours of play. Each session's date and start time are on our schedule, shown in Pacific time.",
  },
```

Sources: line 134 ("play for two hours with the rest of the room"); lines 318-319 ("a relaxed,
social two hours at the table"); `app/mahjong-open-play-las-vegas/page.tsx:52` ("two hours of
play"); line 82 (the schedule lists each session "with the date and time"; "Times are shown in
Pacific."); line 248.

Guard: no clock time is written; session times come only from the booking feed (visitor test,
lines 105-106).
Approval: wording.
Expected benefit (hypothesis): a visitor can fit a session into a trip day before clicking
through.

### V3. One sentence for visitors who have never played

Place: end of the answer to "How much experience do I need for Open Play?" (lines 64-67). That
answer now ends: "If you have never played, start with Mahj 101: it teaches the tiles, how to read
the NMJL card and how a hand comes together."

Add:

```text
If no class date fits your trip, ask about a private lesson at the studio, for one person or a small group you bring yourself.
```

Sources: `app/private-mahjong-lessons-las-vegas/page.tsx:22` ("A private lesson can be one person,
or a small closed group you bring yourself."); this page, lines 385-386 ("Private mahjong lessons
at the studio, for one player or a small group") and line 78 ("send us your dates and group size
... and we will plan it with you"). "If no class date fits your trip" is a condition, not a claim.

Guard: the sentence sends a non-player to a lesson, not to Open Play
(`tests/seo-round6-owner-wording.logic.spec.ts:132-140`).
Approval: wording. The page stays written for people who already play (handoff, Round 4, "What
shipped on the branch"); this sentence only gives a non-player a next step.
Expected benefit (hypothesis): a visitor whose trip misses every Mahj 101 date has somewhere to go
instead of leaving.

### V4. Hero button: land on the dates (a link change, not copy)

Place: hero, line 184.

- Old: `<a href="/schedule" className="btn-primary">See Open Play Dates</a>`
- New: `<a href="/schedule#calendar" className="btn-primary">See Open Play Dates</a>`

Why: Round 10 made this same change on the open play page, because the same label landed above
the dates (handoff, Round 10, item 13; `app/mahjong-open-play-las-vegas/page.tsx:105`; tested at
`tests/seo-round10-visible.spec.ts:171-173`). Lane 1 walked that version and found the calendar
label just below the nav (`~/Projects/.lvm-sprint-2026-11-13/lane1-journeys/NOTES.md`, lines
23-24). This page's hero still opens `/schedule` at the schedule's own hero, above the calendar
(`app/schedule/page.tsx:108` and `:115`). The closing button (line 436) stays on `/schedule`, as
Round 10 left the open play page's closing button.

Tests to update with it:

- Required: `tests/seo-round4-visitors.logic.spec.ts:113` fails after the change, because it looks
  for `href="/schedule" className="btn-primary"` in the hero. Change it to look for
  `href="/schedule#calendar" className="btn-primary"`.
- Required: `tests/seo-round4-visitors.spec.ts:63` fails after the change, because after the
  click on line 62 it expects the address to end in `/schedule`. Change it to expect
  `/schedule#calendar`.
- Advised: `tests/seo-round4-visitors.logic.spec.ts:115` keeps passing, but only by accident. It
  searches the hero for `href="/schedule"`, which is gone once the link reads
  `/schedule#calendar`. A search that finds nothing gives -1, which is always smaller than the
  studio button's position, so the order check passes without checking anything. Change its
  search text to `href="/schedule#calendar"` so it still checks that the dates button comes
  before the studio button.

Approval: decision (the same kind as Round 10 item 13), plus the two required test edits and the
advised one.
Expected benefit (hypothesis): fewer visitors stop at the schedule's hero before they reach the
dates.

---

## 3. Corporate hub

`app/mahjong-corporate-las-vegas/page.tsx`. FAQ array: lines 56-64. The FAQ markup is built from it
at line 71.

Lane 5's preview already turns the confirmed planner facts into page copy. Two small items remain
that it does not cover.

**Guards for both items:** the venue provides the tables and chairs, and nothing implies we supply
furniture (`tests/seo-round6-owner-wording.logic.spec.ts:34-45`); no commission or insurance wording
(54-60); no capacity, statistic or reply-time phrasing, including any number followed by "+"
(169-173); "How do we book a corporate mahjong event?" stays (78-83); no FAQ question repeats one
elsewhere in the cluster (`tests/seo-round5-corporate.logic.spec.ts:138-142`).

Correction, 2026-11-15: the first guard above is retired. The test now requires the neutral setup
sentence ("We confirm the venue, tables, chairs and setup arrangements when planning your event.")
and fails on wording that says who supplies the tables, chairs or furniture
(`tests/seo-round6-owner-wording.logic.spec.ts:38-65`).

**Round 12 rule with no test on the hub:** no corporate page says a price depends on location.
Round 12 took location out of two corporate FAQ answers' price factors when it carried out the
owner's no-travel-fee decision (handoff, Round 12, "Done: fees"). H1 names only group size,
format and length. The test for this rule, `tests/seo-round12-owner-decisions.logic.spec.ts:34-38`,
reads only the team building and corporate event activities pages, so it would not catch location
wording added to the hub later. When H1 is installed, the installer could add
`app/mahjong-corporate-las-vegas/page.tsx` to that test's list.

**Timing.** Lane 7 records the first Search Console readout for the hub as due 2026-11-30
(`SEARCH-EVIDENCE.md`, section 3, item 4). Installing hub changes after that readout keeps the
Round 7 result readable. For a GA4 comparison as well, the same conditions as sections 1 and 2
apply; installed earlier, the result cannot be compared.

### H1. A cost question in the hub FAQ (a second place for lane 5's pricing sentence)

The hub FAQ has no cost question, while every other corporate page answers cost in its FAQ. Six
ask it directly (`app/corporate-team-building-las-vegas/page.tsx:67`,
`app/conference-activities-las-vegas/page.tsx:68`, `app/convention-activities-las-vegas/page.tsx:68`,
`app/corporate-event-activities-las-vegas/page.tsx:123`,
`app/incentive-group-activities-las-vegas/page.tsx:87`,
`app/trade-show-booth-activities-las-vegas/page.tsx:89`), and the meeting planner page answers it
under "How do we get a quote for a meeting activity?"
(`app/las-vegas-meeting-planner-activities/page.tsx:107-108`). Lane 5 puts "Pricing depends on
group size, format and length." in its quote panel, which shows on the page but is not part of the
FAQ markup.

Place: after "How do we book a corporate mahjong event?" (line 63).

```tsx
  { q: "How much does a corporate mahjong event cost?", a: "Every event gets a custom quote. Pricing depends on group size, format and length." },
```

Sources:

- "Every event gets a custom quote." Hub lines 63, 118 and 250 ("custom quote").
- "Pricing depends on group size, format and length." Lane 5's sentence, from
  `app/las-vegas-meeting-planner-activities/page.tsx:108` ("Every meeting gets its own quote, based
  on group size, format and length.") and `app/conference-activities-las-vegas/page.tsx:68`. No
  amount: `CLAUDE.md` line 41.

Guard: the question is new to the cluster (team building asks "How much does a corporate team
building event cost?").
Approval: decision: lane 5's panel, this FAQ entry, or both. The words are lane 5's; this item adds
only the FAQ placement.
Expected benefit (hypothesis): a planner who scans the FAQ for cost finds the answer and its three
factors there.

### H2. Optional: where the venue and time slot go in the form

Place: end of the answer to "How do we book a corporate mahjong event?" (line 63).

Add:

```text
The form has its own boxes for group size and a preferred date; add the venue and time slot under Tell Us More.
```

Sources: `components/contact-form.tsx:269` ("Group Size"), `:281` ("Preferred Date") and `:295`
("Tell Us More"), all shown for every inquiry; hub line 63 asks for the "date, venue, headcount
and the time slot".
Keep in sync: if the form's labels change, this sentence changes with them.
Approval: wording.
Expected benefit (hypothesis): more first inquiries name the venue and time slot, which the hub
says it needs for a quote. Analytics cannot check this, because nothing a visitor types is sent to
it, by design (handoff, Round 10, "Never sent").

### Considered for the hub, not proposed

- Experience needed, a friendly tournament, mixed rooms, what the venue provides, session
  lengths: lane 5's glance section covers each. Update, 2026-11-15: the section as installed
  carries the owner's corrections. It promises no tournament, and its venue card ends with the
  neutral setup sentence.
- "Can employees and clients attend the same event?" and "Can the activity be competitive?": the
  occasions page owns them (`app/corporate-event-activities-las-vegas/page.tsx:107` and `:111`),
  and Round 5 keeps one buyer question per page (handoff, Round 5, "Architecture").
- Payment methods: the owner's card, cash, Venmo and Zelle fact does not say whether a company can
  pay by invoice (lane 5, question 6).
- A corporate event at the studio: never (handoff, Round 5, "Rules this round held").

---

## 4. Suggested order

No search or analytics data ranks these items (lane 7, section 3). The order is a judgment of how
directly each one answers a question that stands between a visitor and a booking or an inquiry.

| Order | Item | Usefulness (hypothesis) | Effort | Fact basis |
| --- | --- | --- | --- | --- |
| 1 | P1 How to book a private lesson | High: an inquiry is the page's only path, and no answer walks through it | One FAQ entry | The page's own sentences |
| 2 | V1 Open Play cost and payment | High: cost and payment come before every booking | One FAQ entry | `lib/pricing.ts`; owner fact |
| 3 | P2 Private lesson payment methods | Medium to high | One FAQ entry | Owner fact |
| 4 | V4 Hero button lands on the dates | Medium | One link; two required test edits, one advised | Round 10 precedent; lane 1 walk |
| 5 | V2 Open Play length | Medium | One FAQ entry | Page copy |
| 6 | H1 Hub cost question | Medium, if lane 5 is approved | One FAQ entry | Lane 5 sentence |
| 7 | P3 Private lessons for visitors | Medium | One FAQ entry | Visitor page copy |
| 8 | V3 Next step for non-players | Low to medium | One sentence | Private and visitor page copy |
| 9 | P4 Which mahjong | Low | One FAQ entry | Lessons and visitor page copy |
| 10 | P5 Home or venue wording | Low | One sentence | Owner fact |
| 11 | H2 Form boxes | Low | One sentence | Contact form labels |

---

## Files this document draws on

- `CLAUDE.md` (Hard Rules, Pricing); `docs/handoffs/lvm-seo-current.md` (Rounds 12, 11 and 10, and
  Rounds 4, 5 and 7 for the visitor and corporate rules).
- `docs/handoffs/lvm-measurement-plan-2026-11-13.md` ("Words used below"; section 2, part B;
  section 4, "Rules for every experiment"), for the timing and custom dimension notes.
- The three pages; `lib/pricing.ts`; `components/contact-form.tsx`; the cited lines of
  `app/schedule/page.tsx`, `app/mahjong-open-play-las-vegas/page.tsx`,
  `app/mahjong-lessons-las-vegas/page.tsx`, `app/layout.tsx` and the other corporate pages.
- Guards, read and not run: `tests/seo-round1.logic.spec.ts`, `tests/seo-round4-visitors.logic.spec.ts`,
  `tests/seo-round4-visitors.spec.ts`, `tests/seo-round5-corporate.logic.spec.ts`,
  `tests/seo-round6-owner-wording.logic.spec.ts`, `tests/seo-round10-visible.spec.ts`,
  `tests/seo-round12-owner-decisions.logic.spec.ts`.
- `~/Projects/.lvm-sprint-2026-11-13/`: `lane4-content/PROPOSALS.md`,
  `lane5-corporate-preview/SOURCES.md` and `preview.patch`, `lane6-lessons-preview/SOURCES.md` and
  `preview.patch`, `lane7-analytics-search/SEARCH-EVIDENCE.md`, `lane1-journeys/NOTES.md`,
  `lane2-a11y/NOTES.md`, `lane3-perf/NOTES.md`.

---

## Unanswered questions for the owner

Each answer is a new business fact. None of the items in sections 1 to 3 waits on these; each
answer would allow a further, more specific line.

**Already asked elsewhere (the drafts are in those files and are not restated here):**

- **A1, private lessons over Zoom** (lane 4). If yes, lane 4's drafted FAQ entry goes on the
  private page.
- **A3, current cards for sale at the studio** (lane 4). On the visitor page, the place for the
  answer is "Do I need an NMJL card?" (lines 60-63).
- **A4, private lesson length and largest group** (lane 4). The private page's test forbids the
  word "minimum" (`tests/seo-round1.logic.spec.ts:135`), so phrase any limit as "up to".
- **A5, how to reach Suite 200 inside Lucky Hare** (lane 4). The answer also belongs in the
  visitor page's "Come to the studio" step (lines 129-130) and the private page's "Where We Meet".
- **A6, cancellations and refunds** (lane 4). It matters most to visitors whose plans change.
  Please also cover private lessons, which A6 does not ask about.
- **A7, minimum age for classes and Open Play** (lane 4). Please also say whether an age limit
  applies to private lessons (the private page mentions "a mother and daughter", line 62). On that
  page the answer cannot use the word "minimum" (same test).
- **Lane 5 planner questions 1 to 9** (`lane5-corporate-preview/SOURCES.md`, section 4): smallest
  and largest groups and facilitators per table, how far ahead to book, setup time, room layout,
  extras such as prizes, deposit, payment and cancellation terms, an insurance certificate (never
  to be published), who leads, and where events can run.
- **Corporate examples:** three owner answers are still needed (handoff, Round 10, "Corporate
  event proof"; the questions are kept privately).
- **The headshot crop** (handoff, Round 12), which also sets the private page's share picture.

**New questions from this document:**

- **N1. Who teaches private lessons? Does anyone besides Shauna teach them?** Round 11 asked
  ("does anyone but Shauna teach private lessons or host parties?"); Round 12 answered only the
  certification part. The private page speaks in Shauna's voice ("I ask a few questions", line 67;
  "I will send you the details", lines 24 and 176). The new entries above say "we", so they stay
  true either way.
- **N2. When is a private lesson paid for: when it is booked, or at the lesson? Is there a
  deposit?** P2 names only the methods.
- **N3. How far ahead should someone ask for a private lesson?** It matters most to a visitor with
  fixed dates (P3).
- **N4. How far ahead are Open Play dates posted?** The visitor page tells people to check the
  dates against their trip (lines 121-122); someone planning months ahead needs to know when to
  look.
- **N5. If a planner has no room yet, can you suggest one, or does the planner always book the
  space?** Nothing on record says, and no venue relationship may be implied.

---

## Review notes

An independent review raised six issues on 2026-11-13. Each was checked against its source. All
six were real and are fixed; none was rejected.

1. **Fixed: "Checking later" implied a before-and-after comparison.** Nothing is measured today
   (handoff, Round 10) and GA4 is not live (Round 12), so GA4 will have no "before". The paragraph
   now says what the events count from the day tracking is verified. A new timing note near the
   top, repeated in sections 1 and 2 and added to the hub's note, says a comparison needs lane 7's
   exports first and at least 4 full weeks of verified GA4 data, or the result cannot be
   compared. Also corrected while checking: only the visitor page links straight to Bookwhen, so
   "more Bookwhen clicks" never applied to the private page or the hub.
2. **Fixed: splitting by `source_label` and `inquiry_type` also needs step 5.** Handoff Round 12,
   step 5 registers the custom dimensions, and GA4 shows a parameter only from the day its
   dimension exists (measurement plan, "Words used below"). The paragraph now names step 5 and the
   measurement plan's advice to register them before the ID goes live.
3. **Fixed: V4 test edits.** The hero slice holds one schedule link (page line 184). After the
   change, logic test line 113 fails, and line 115 gets -1 and passes without checking the order.
   V4 now lists two required edits (logic test line 113, browser test line 63) and one advised
   edit (line 115); the section 4 table matches.
4. **Fixed: the location guard does not read the hub.**
   `tests/seo-round12-owner-decisions.logic.spec.ts:34-38` reads only two other corporate pages.
   The hub section now cites Round 12, "Done: fees", says no test covers the hub, and suggests
   adding the hub to that test with H1. The other hub guards were rechecked and do read the hub
   (the round 6 `CORPORATE` list and the round 5 `CLUSTER` list).
5. **Fixed: the hub has a qualitative search note.** Lane 7, section 3 counts it. The bullet now
   says no search numbers exist for the three pages and names Round 7's note.
6. **Fixed: "never names the game it teaches".** The page says "mahjong" in its title, heading and
   copy; only the structured data (line 36) says "American Mahjong". The section 1 intro now says
   exactly that.
