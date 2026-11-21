# Las Vegas Mahjong website: owner guide (2026-11-13)

**Status:** every change in Section 1 is live. Most of it was proposed as pull request #130
into `main` on 2026-11-15. You approved the release on 2026-11-16; it was merged that evening,
exactly as reviewed, and visitors have seen it since you pressed Promote in Vercel at about
6:48 pm. The photo update of 2026-11-17 followed as pull request #131: merged at 1:48 pm and live
since you pressed Promote at 5:19 pm that day. The checks on the live site after each release
found no failures (handoff, "RELEASE 2026-11-16" and "PHOTO UPDATE 2026-11-17"). The analytics
release followed on 2026-11-20 as pull request #132: merged at 8:34 pm and live since you pressed
Promote at 9:05 pm. Its live checks passed (handoff, "ANALYTICS SETUP 2026-11-18"); the test
events have not yet been confirmed inside GA4 itself. The
working copy is `~/Projects/lvm-seo-invisible`. Full record: `docs/handoffs/lvm-seo-current.md`. Sprint files:
`~/Projects/.lvm-sprint-2026-11-13/`. Pictures: `~/Projects/.lvm-seo-screens-2026-11-13/`.
Keep the pictures folder private: some "before" pictures show details since removed from the
site.

## 1. What changed and where

### What a visitor would see (Rounds 10 to 12)

- **Where lessons happen.** The Summerlin and Henderson pages say there is one studio, inside
  Lucky Hare on West Sahara, and that home or venue lessons are available by request.
- **Fees and credentials.** No page mentions an added or travel fee. Apart from the Ask page
  (open, Section 4), your certification appears in words only in your About biography, and every
  mention of the 18 years is clearly yours. The homepage headshot with the printed badge was
  replaced on 2026-11-15 (see "Your approvals, applied").
- **No corporate client named.** The corporate quote appears once, on the corporate page, word
  for word and with no attribution.
- **Corrections.** About: group lessons are 4 to 8 students. Parties: the second button goes to
  private lessons. Schedule: payment by card, cash, Venmo or Zelle; online checkout is card only.
- **Buttons and links.** Lessons page buttons no longer overlap on phones. The schedule's
  "Private & Parties" card gained a "Plan Something Private" link. The open play button lands
  on the dates. The footer links to the visitor page. Links show a green ring for keyboard users.
- **New.** A privacy page (`/privacy`, linked in the footer). The pink die is the browser-tab
  icon and, since your 2026-11-15 approval, the iPhone home-screen icon too.

### What only Google and link previews see (Round 9, parts of Rounds 10 to 12)

- Complete link-preview pictures on 32 pages, the shorter titles you chose for private lessons
  and scoring, and your payment methods and business Instagram and TikTok in the business details
  Google reads.
- Two titles were reworded to follow your certification decision, and you approved their final
  wording on 2026-11-15. The About title reads "About Shauna | Las Vegas Mahjong". The lessons
  page's share title (the one link previews show) reads "Mahjong Lessons Las Vegas |
  Beginner-Friendly Classes". The lessons page's search title is unchanged.
- Published photos carry no hidden location data, and a test checks it. Analytics: Google
  Analytics 4, switched on with the release of 2026-11-20 (pull request #132).

### Sprint of 2026-11-13 (live since 2026-11-16)

- The "Plan Your Event" pop-up works like a proper dialog: the keyboard stays inside, Escape
  closes it, and selecting text no longer erases what someone typed.
- The contact form's confirmation or error now appears on screen, phones included; field errors
  show beside the field.
- A "Skip to main content" link; Escape closes the mobile menu; the homepage FAQ opens by
  keyboard; each "Book" button names its class and date for screen readers. At large text sizes
  the menu folds up instead of running off the screen.
- Higher contrast for the pink section labels, the "Explore Lessons" words on the homepage studio
  card, footer small print, shop card web addresses and small grey notes. The About experience
  cards center their last row.
- Learn Mahjong mentions MAHJ103; the open play photo label reads "At the Studio" (its room was
  never recorded); the private lessons FAQ explains home or venue lessons by request.
- Smaller image files for large phones and laptops (lab test: homepage photos 611 KB to 488 KB on
  a large phone; any speed difference was too small to separate from test noise), and the
  homepage corporate card no longer says "for any group size".
- Three fixes from the final review, none visible at normal text size: the "Skip to main
  content" link now works on every page even before the page finishes loading (Ask a Rule's
  page is left as it was); a newsletter signup that fails because of a connection or service
  problem no longer marks a correct email address as wrong; and the About cards keep the same
  number of columns as before when a visitor uses a larger browser text size.

### How it was checked (2026-11-13)

- One final build of the whole local copy, with no warnings or errors.
- The automatic tests: 549 rule and code checks pass; the one that fails is a known check that
  needs the Find My Mahj code next to it and is skipped online. In a desktop browser and a
  phone-sized browser, 725 of 726 page checks passed. The one failure came from the local test
  server stalling on two photos; after a restart that check passed six times in a row (details in
  the handoff).
- Two independent reviews sent every finding to three separate checkers: 11 findings were
  confirmed and fixed (some describe the same problem), and 8 were not confirmed, mostly because
  the checkers judged them older than this work or a matter of wording.
- Before and after pictures of nine visible sprint changes: `s-01` to `s-09` in the Pictures
  folder.

### Speed (lab test, 2026-11-13)

- On a large phone the homepage now downloads 488 KB of photos instead of 611 KB, and the studio
  page 424 KB instead of 558 KB. The photos look the same; the phone gets a file closer to its
  screen size. The About page is unchanged. These numbers are file sizes, measured directly.
- Whether pages now appear faster could not be measured reliably. The computer running the test
  was busy with other work, and the differences between repeated runs were larger than any
  difference between the old and new versions. So no speed improvement is claimed. A test on a
  quiet computer, or a check of the live site after release, is a follow-up.
- The accessibility improvements add about 1 to 2 KB to each page.

### Your approvals, applied (2026-11-15, live since 2026-11-16)

- **All nine sprint changes** stay. The parties page's closing line now reads "Mahjong equipment
  and instruction provided · We come to you · No experience needed". It is slightly longer than
  the old line, so on wider screens it now wraps after "We come to you ·" and keeps "No
  experience needed" together.
- **Both edited photos** are the versions you reviewed, unchanged.
- **Homepage photo:** the studio photo of you at the "Let's Mahjong" sign, with no overlay. It is
  also the link-preview picture for About, Contact, the three lessons pages and private lessons,
  and the photo in the business details Google reads.
- **Corporate "At a Glance"** is on the corporate page with your corrections: no friendly
  tournament, "NMJL card arrangements are confirmed in your quote." and "We confirm the venue,
  tables, chairs and setup arrangements when planning your event."
- **Lessons "Find Your Fit"** sits after "What You'll Learn", with green text links. The tier is
  now "Private Lessons", and open play reads "Best for: Players who already know American Mahjong
  and are comfortable playing independently." Bookwhen does not sell the $85 five-pack today, so
  this section shows only "$20 per session" (Section 4 has the follow-up).
- **Buttons** use the darker pink #dd1d85; the menu button's hover now keeps it too, because its
  lighter hover pink failed the contrast guideline. Every pink button passes at 4.58 to 1 at
  rest, on hover, while pressed and when selected by keyboard, on computer and phone. Pink
  headings are unchanged. The small pink labels (the words above each heading, review names and
  "Explore Lessons") are a lighter pink than on the live site: the sprint made them easier to
  read, and they match the gallery pictures you approved.
- **iPhone home-screen icon:** the pink die. Browser tabs keep the pink die; the full logo stays
  everywhere else.
- **About photo size setting (P2):** not used, as you decided.
- **Photos:** the three unused photos are off the website; private copies are in
  `~/Projects/.lvm-private-photo-originals-2026-11-15/`.
- **Checked:** a final build; 558 code checks pass (the known Find My Mahj check still fails
  and is skipped online); 742 page checks pass on computer and phone, and the 2 that fail are
  the same known check, which looks for another test server. Every link and picture on all 34
  pages loads; the removed photos no longer load. Two independent reviews checked everything
  against your text and on screens from 320 to 1440 pixels wide; they found one stray word on
  the parties line (fixed), a weak test (fixed) and the items now in Section 4. The checks also
  found a homepage problem that is older than this work and already on the live site (the
  "Scroll" hint); the consistency pass fixed it.
  Final pictures: `~/Projects/.lvm-approvals-2026-11-15/final-shots/`.

### Consistency pass (2026-11-15, live since 2026-11-16)

- **Five-pack:** off the website for now, since Bookwhen does not sell it. Every page and the
  details Google reads show "$20 per session".
- **Corporate and party pages:** your three sentences replace every promise of NMJL cards, "all
  equipment" or who supplies tables and chairs, in the words that fit each page.
- **Open play:** every page now says it is for players who already know American Mahjong and are
  comfortable playing independently. Finishing Mahj 101 is no longer presented as enough; new
  players are still pointed to Mahj 101. Booking ahead and bringing the current card stay.
- **"See the Calendar":** the "Scroll" hint no longer covers it or blocks clicks in short laptop
  windows or on phones. On tall screens the top of the homepage sits slightly higher.
- **Private lessons:** described as individual or private-group lessons.
- **Your photo:** the homepage and About photo is now a sharper copy made from your original, same
  picture and framing. The old headshot is archived privately and no longer on the website.
- **Checked:** 748 page checks pass on computer and phone with no failures; every link and
  picture loads; the details Google reads match what visitors see.

### Final wording approvals (2026-11-15, live since 2026-11-16)

- **Corporate pages:** tournament wording is gone from the five pages that had it (the main
  corporate page and the team building, meeting planner, corporate events and incentive pages),
  including two FAQ answers. No corporate page mentions a tournament in its own content now
  (the footer on every page still names tournaments at the studio; Section 4).
- **"How long does it take to learn?"** on the homepage now answers "Start with MAHJ101 and
  build your skills through practice and our follow-on classes." The lessons page's opening
  paragraph ends with the same sentence, in place of "Most students are playing confidently
  after just one session."
- **Henderson page:** the open play sentence now uses your requirement: "Henderson residents who
  already know American Mahjong and are comfortable playing independently can also join open
  play at our studio inside Lucky Hare."
- **Titles:** About is "About Shauna | Las Vegas Mahjong". The lessons page's share title is
  "Mahjong Lessons Las Vegas | Beginner-Friendly Classes".
- **Privacy page:** you confirmed that Las Vegas Mahjong does not sell customer information. The
  sentence "We use what you send to reply to you. We do not sell it." stays exactly as written,
  and no other privacy promise was added. The page is still a plain-language notice, not legal
  advice.
- **Learn Mahjong page:** its lessons paragraph now ends with the same sentence, "Start with
  MAHJ101 and build your skills through practice and our follow-on classes.", in place of "Most
  students are playing confidently after their first session."
- **Privacy page, second confirmation:** you confirmed the website is marketed to adults, so
  "This website does not target children under 13." stays as written. It describes the
  website's audience; it is not an age rule for lessons.
- **Small pink labels:** settled. They are the same lighter pink that the gallery's "after"
  pictures showed, and nothing about them changed afterward.
- **Old backup file:** `index.html.bak`, an old copy of the site that nothing used, is removed
  from the website's code. A private copy is in
  `~/Projects/.lvm-private-photo-originals-2026-11-15/`.
- **Five-pack reminder for future work:** the project's rule file now says the five-pack is a
  future offering that is not on sale and must not be advertised; its $85 price stays on record.
- **Tests:** automatic tests now fail if any of this wording or either title changes back. On
  the final build, 576 code checks pass (the known Find My Mahj check still fails on this
  computer only). The page checks for the changed pages pass with none failing (186 on the
  final build; 732 on the build just before it, which covered the earlier wording changes).
- **Required review:** the two reviewers that must pass before anything is published read the
  whole change. Their first two runs found the website itself correct and stopped on one
  thing: notes in the code and documents named two instructors next to a statement about
  certification, and the code is public. With those names removed, the third run passed with
  no blockers, and so did the fourth, made on the final version after the items above. The
  handoff, "FINAL COPY APPROVALS 2026-11-15", has the full results.

### Release candidate (2026-11-15, live since 2026-11-16)

- **Learn Mahjong, the card paragraph:** now reads "It looks intimidating at first, but it gets
  easier with practice." It replaced "... within one lesson, most students are reading it
  confidently." A test fails if the old promise comes back.
- **Online test fix:** the small fix to the online browser tests (PR #129) is merged, and the
  online tests on `main` pass again.
- **Latest `main` brought in:** the Friendsgiving listing and that fix are part of this branch
  now. Nothing you approved changed, and no history was rewritten.
- **Sitemap dates:** each page shows the day its visible content last changed. 17 pages show
  2026-11-15 (their wording or main photo changed under your approvals that day), 7 show
  2026-11-13 (About is one of them: on 2026-11-15 only sharper or retouched copies of the same
  photos went in), and 10 pages with no visible change in their content keep their dates.
  Pushing the branch did not change any date. If the release lands on a later day and you want
  that date instead, it is a separate, checked update.
- **Pull request #130:** you approved the release on 2026-11-16, and it was merged into `main`
  that evening exactly as reviewed. The check results are in its description.
- **Vercel access restored (2026-11-15):** for some weeks after 2026-10-05 Vercel did not
  receive this website's code changes, because the Vercel app on GitHub had lost access to the
  website's code. Access is back, so each pull request now gets a preview link (it
  needs a Vercel login). Restoring access published nothing. Automatic publishing to `www` is
  switched off, by your choice, and it stayed off after the release. The Friendsgiving listing
  went live with the release.
- **Contact form, early Send (your decision of 2026-11-15):** if someone presses Send before
  the page has finished loading, the message now goes straight to the form service, which shows
  its own page. The phone number is still checked. Once the page has loaded, the form works
  exactly as before. Tested on the live site on 2026-11-16 with one labelled message, as you
  asked: the visitor landed straight on the form service's page "Thanks! The form was submitted
  successfully.", and the message reached your inbox within seconds. Whether the form service
  can first ask a visitor to prove they are not a robot depends on a setting in your Formspree
  account that nobody has looked at yet (Section 4).
- **Thank-you messages speak as the team (your decision of 2026-11-15, after the preview):**
  after someone sends the contact form they now read "Thanks for reaching out. We'll be in
  touch soon!" (it said "I'll"). The homepage pop-up form now says "You're on our radar!" and
  "Thanks for reaching out. We'll be in touch soon. Get ready to play!" (they said "my radar"
  and "I'll"). The line above the pop-up form followed on 2026-11-16, by your next
  instruction: it now reads "Fill out the form below and we'll be in touch soon!" (it said
  "I'll"). The "Prefer email?" sentence after it is unchanged. Your own first-person biography
  and page wording are unchanged.
- **Lesson cards are links (same decision):** on the lessons page, under "What You'll Learn",
  the whole MAHJ101, MAHJ102, MAHJ103 and Private Lessons cards can now be clicked or tapped,
  or opened from the keyboard. The three group cards open the schedule calendar; the website
  has one calendar and no separate address for each class level, so none was made up. Private
  Lessons opens the private lessons page. The words and the layout are the same. A card
  brightens and gains a green border under the pointer, and shows a white outline for
  keyboard users.

### Released (2026-11-16)

- **Live:** you approved commit `f18f104` on 2026-11-16. It was merged into `main` as `0a72967`
  at 6:31 pm, and it went live when you pressed Promote in Vercel at about 6:48 pm.
- **Checked:** the release checklist found 37 passes, no failures and 3 things to look at. The
  separate live check passed 49 of 49 on a computer screen and a phone screen, and no page,
  link or file was broken. The 3 things to look at are Bookwhen items (Section 4).
- **One test message:** sent at your request, clearly labelled, through the early Send path.
  It reached your inbox within seconds, and you can delete it.
- **Automatic publishing to `www` is still off,** so the next merge also waits for your Promote.
- **Dates left as they were:** the release kept the sitemap's 2026-11-15 and 2026-11-13 dates
  and the privacy page's "Last updated November 13, 2026", because you approved the release as
  reviewed. For the sitemap dates since the photo update, see below.
- **Paused, as you asked:** research, analytics, Bookwhen and every other change.

### Photo update (2026-11-17, live)

- **Leagues page:** your studio photo of a room with three tables set for play sits under the two
  buttons, with the room unnamed and no caption. Its description says only what is in the photo.
  The page's link preview uses the same photo.
- **FOX5 card "American Mahjong Classes NOW being taught at Las Vegas Mahjong":** on the homepage
  and the Studio page it shows your photo of a studio table set for a lesson. Its link, headline
  and date are unchanged, and so is the other card.
- **Live:** you approved the merge on 2026-11-17. Pull request #131 was merged into `main` as
  `f36af78` at 1:48 pm, and it went live when you pressed Promote in Vercel at 5:19 pm.
- **Checked:** the photo check passed 32 of 32, and the 2026-11-16 live check passed 49 of 49
  again, on a computer screen and a phone screen.
- **Sitemap dates, as agreed (your instruction of 2026-11-18):** the leagues page carries
  2026-11-17; the homepage and the Studio page keep 2026-11-15.
- **Left alone, as you asked on 2026-11-18:** the two optional code tidy-ups, which visitors
  would not see (handoff, "PHOTO UPDATE 2026-11-17").

## 2. Business facts to keep in sync

| Fact | Where it lives | When it changes |
| --- | --- | --- |
| Group lessons: $60 per person, 4-8 people | `CLAUDE.md`; `app/mahjong-lessons-las-vegas/page.tsx` (tiers, FAQ, hidden price); `components/classes.tsx` (homepage); `app/layout.tsx` (hidden price); About ("4 to 8 students max") | Change all of them and Bookwhen; keep the price off non-lesson pages. The pre-push check (`.claude/workflows/pre-push-gate.js`) repeats the price and group size (corrected on 2026-11-15), so change it there too. |
| Open Play price | `lib/pricing.ts` only, plus `CLAUDE.md`, the pre-push check and Bookwhen | Never type the price into a page (a test fails). |
| Open Play is for people who already know the game | The open play, visitor, schedule and studio pages, and `lib/schema.ts` | Change all of them together. |
| Private lessons, parties, corporate; no travel fee | "Contact for pricing" on their pages | Never show an amount, and never mention an added, extra or travel fee (a test fails on that wording). Private lessons: studio first, home or venue by request. |
| League season price | Bookwhen; shows only if the ticket name contains "season" | Keep "season" in that name. |
| Studio: 8687 W. Sahara Ave., Suite 200, inside Lucky Hare, 89117 | 15 files; search the code for "8687" | Also Bookwhen and your Google Business Profile. Never add hours, parking or amenities. |
| Payment: card, cash, Venmo, Zelle; online checkout card only | `app/layout.tsx` and the schedule payment note (`app/schedule/page.tsx`) | Change both. |
| Certification | Your About biography and the hidden founder record (`app/layout.tsx`); the Ask page wording is an open item (Section 4). The old headshot with the printed badge was retired on 2026-11-15 | The certification and the 18 years are yours alone: never imply that whoever teaches a class has them (tests check). |
| Class titles (for example "Mahj 101 with Shauna") | Bookwhen, shown on `/schedule` as written | Update every place that names a level: lessons, schedule, About, Learn Mahjong, the hidden offer list in `app/layout.tsx`, the Ask page nudges (`lib/ask/nudges.ts`, your call), the homepage (stops at 102), and the Mahj 101 mentions on the Summerlin, Henderson, open play, visitor and studio pages and in `lib/schema.ts`. Search the code for "MAHJ10" and "Mahj 10". |
| FAQ answers | On 23 pages one list feeds both the visible FAQ and Google's hidden copy | Edit the list in the page file, never just the text on screen. |
| Privacy page | `app/privacy/page.tsx`: forms, newsletter, Ask a Rule, Bookwhen, analytics, cookies, outside links, hosting | Update it for any new form field, service, tracking tool or Ask logging change; its analytics part follows the Measurement ID on its own; its "Last updated" date and its sitemap date are the day its visible text last changed (November 20, 2026 now), and a release that changes the page's text moves both, plus `tests/privacy-page.logic.spec.ts` and `tests/seo-round12-owner-decisions.spec.ts`, to its go-live day. Switching analytics off later is a checked release too, with a new date. |

## 3. Updating photos and words safely

### Photos

1. **Upright.** A phone photo can store its rotation as a hidden tag, and some photo tools drop
   that tag, which turns a portrait sideways. Before a photo goes in, have your developer (or
   whoever updates the site) save it with the rotation applied (`scripts/fix-orientation.cjs`
   did this for two earlier photos and would need editing for new ones). Then check it on a
   phone and a computer: no test catches it.
2. **No location.** Files in `public/` download with their hidden data, and a test fails on any
   GPS position. On an iPhone: Share, Options, turn Location off.
3. **Only what shows.** Alt text describes what is visible and confirmed. A photo names a studio
   room only if you said so; studio photos go in `lib/studio-photos.ts`.
4. **No identities.** No client logos or company names, readable name stickers or badges, or
   readable business names on props.
5. **Guards:** `tests/seo-round11-followups.*` (GPS, client name, credential wording),
   `tests/studio.spec.ts` and `tests/studio.logic.spec.ts`, `tests/seo-round9-share-schema.*`
   (preview pictures, which must come from `lib/og.ts`), `tests/sprint-content.logic.spec.ts`.

### Words

- The homepage and `/mahjong-lessons-las-vegas` ranked near the top for "mahjong lessons las
  vegas" in the three months of data you supplied on 2026-09-05: surgical edits only. Tests lock
  the lessons page's title, main heading and web address.
- Never: a phone number (hidden data included), bachelorette content, a client's name, invented
  reviews or numbers, em or en dashes, emojis. Every new outside link must load first, affiliate
  links and the LASVEGASMAHJ code included.

### Before anything goes live

You approve the current versus proposed wording or pictures; the typecheck, tests and two
reviewer checks run; then the change is merged to `main`. Since 2026-11-15 automatic publishing
to `www` is switched off in Vercel, so after the merge the new version also has to be promoted
in Vercel with your team's login before visitors see it; the 2026-11-16 release and the
2026-11-17 photo update went live this way. If the release lands on a later day than the
sitemap dates, updating them to that day is a separate, checked update before the merge.

## 4. Waiting for your approval

| Item | Where to look |
| --- | --- |
| Automatic publishing: it is switched off on the project that serves `www`, and it stayed off after the 2026-11-16 release and the 2026-11-17 photo update, so every release waits for your Promote. Keep it that way or turn it back on | Handoff "RELEASE 2026-11-16" |
| Bookwhen items from the release check (new; you paused Bookwhen work): `/schedule` still shows Bookwhen's "Drop in and play" wording, which clashes with open play being booked sessions, and the leagues page shows one sentence twice because the Thursday league's Bookwhen description repeats it. Both change once the listings are edited in Bookwhen. Also, one session dated 2026-11-16 still showed on the schedule after Bookwhen stopped listing it | Step-by-step Bookwhen edits: `~/Documents/LVM Growth Sprint 2026-11-13/release-support/03-BOOKWHEN-CHANGES.md`, sections 1 and 2; handoff "RELEASE 2026-11-16", open items |
| Form spam protection (new): the contact form has no spam trap of its own, so its protection is whatever is switched on in your Formspree account, and nobody has looked at those settings yet. Checking them needs your Formspree login and changes nothing on the website | Handoff "RELEASE 2026-11-16", open items |
| Privacy page date: it says "Last updated November 20, 2026", the day its analytics and Ask a Rule wording changed; any later wording change moves it to that release's go-live day (measurement plan, section 5, item 1). The sitemap dates stay as agreed, by your instruction of 2026-11-18: 2026-11-17 for the leagues page and 2026-11-15 for the homepage and the Studio page. The privacy page's own sitemap date matches its "Last updated" date, by the agreed rule that a page's date is the day its visible content changed; /ask's sitemap date is 2026-11-20, the day its disclaimer changed, by the same rule | Handoff "RELEASE 2026-11-16", "PHOTO UPDATE 2026-11-17" and "ANALYTICS SETUP 2026-11-18" |
| Photo placements: the leagues photo is live since 2026-11-17. The private lessons, Summerlin and Henderson previews still wait for your decisions | `~/Projects/.lvm-approvals-2026-11-15/photo-previews/gallery/` |
| Lesson cards on a phone (new, optional): a phone has no hover, so nothing shows that a card can be tapped. Proposed, not built: a short line at the bottom of each card, such as "See class dates" | Handoff "RELEASE CANDIDATE 2026-11-15", open items |
| Friendsgiving listing wording (new): it says "guests should already know the basics", which is looser than your open play wording. It is your event text, already merged, so it was not changed | Handoff "RELEASE CANDIDATE 2026-11-15", open items |
| Five-pack (future task): set it up in Bookwhen when you are ready. Until then the website shows only "$20 per session" everywhere and no longer mentions the five-pack | Handoff "CONSISTENCY PASS 2026-11-15", item 1 |
| Wide link-preview picture: a wide crop of your neon-sign photo (the sign and your face) is ready for you to approve or skip. Nothing is installed | `~/Projects/.lvm-approvals-2026-11-15/photo-c/share-crop-review.png` |
| Tournament wording elsewhere (new): the parties page and the homepage still offer "Host a mahjong tournament or social to raise funds", and the footer on every page, the homepage's link-preview text and the hidden event page still name tournaments, while the corporate pages no longer do. Keep or reword; one decision can cover them | Handoff "FINAL COPY APPROVALS 2026-11-15", open item 2 |
| Homepage top paragraph (new): it still says "No experience needed. Beginners welcome!" right after listing open play and leagues, which does not fit your open play rule. Proposed, not changed: end it with "Beginner classes need no experience." | Handoff "FINAL COPY APPROVALS 2026-11-15", open item 3 |
| Learn Mahjong page: the card sentence you approved on 2026-11-15 is in. Two older lines are unchanged, because they were not in your instruction. In step 4: "once you know the basics, join Social Open Play". Proposed, not changed: your open play wording, "once you know American Mahjong and are comfortable playing independently". In step 1: "Most students go from zero to playing without an instructor in 2-3 lessons." Keep or reword | Handoff "FINAL COPY APPROVALS 2026-11-15", open item 8 |
| The website's code is public on GitHub, and its history keeps earlier versions of the files this release edits or removes. You can accept that, make the code private, or approve a history rewrite. The specifics are in a private note on your computer, not in the code | `~/Projects/.lvm-approvals-2026-11-15/private-notes/` |
| Nine planner questions for the corporate page (the "At a Glance" section itself is approved and in) | `lane5-corporate-preview/SOURCES.md` section 4 |
| Proposed wording for the private lessons, visitor and corporate pages (P1 to P5, V1 to V4, H1 and H2) | `docs/handoffs/lvm-proposed-content-2026-11-13.md` |
| Content questions (Zoom, party tables and chairs, cards for sale, private lesson length and size, finding Suite 200, cancellations, minimum age); three homepage contradictions; the "Your Instructor" and "Meet Your Mahjong Teacher" labels; corporate venue examples | `lane4-content/PROPOSALS.md` sections A and B, plus C2 if wanted. C1 is already done. The lessons chooser you approved already shows the 4 to 8 class size and the small group you bring yourself, so C3 and C4 would repeat them; only C3's class length is new. Handoff Rounds 10 and 11 |
| Search research: what customers ask, gaps on existing pages, questions for you | `docs/handoffs/lvm-search-opportunities-2026-11-13.md` |
| Ask page: "certified instructor's" wording | `app/ask/page.tsx`; handoff Round 12 |
| Analytics after go-live: switching it on and verifying it | `docs/handoffs/lvm-measurement-plan-2026-11-13.md`, section 2 (checklist) |
| Five Search Console exports | `lane7-analytics-search/SEARCH-EVIDENCE.md` section 5 |

## 5. Next five improvements, ranked

Step zero, done: you approved the finished work, and it went live on 2026-11-16. Every benefit
below is a hypothesis, not a measured result.

1. **Switch on analytics.** Usefulness (hypothesis): inquiries and Bookwhen clicks by page, so
   later changes can be judged. A click is not a booking; Bookwhen counts bookings. Effort: low.
   Done: you created the GA4 property on 2026-11-18, added its Measurement ID in Vercel on
   2026-11-20 and approved the release that day. It has been live since you pressed Promote at
   9:05 pm, and the live checks passed (SEO handoff, "ANALYTICS SETUP 2026-11-18"). Not yet
   confirmed: the test events inside GA4 itself; its standard reports take 24-48 hours to fill.
2. **Pull the Search Console exports.** Usefulness (hypothesis): edits go where people already
   search, and Summerlin and Henderson get a keep-or-fold-in decision on real numbers. Effort: low
   (or add your developer as a read-only user). Evidence: only 2 of 33 pages have page-level
   numbers. In the newest query-level data (three months ending about 2026-09-05), "mahjong las
   vegas" drew 83 clicks from 299 impressions, against 136 from 306 for "las vegas mahjong".
3. **Answer the content questions.** Usefulness (hypothesis): fewer questions before booking and
   less confusion (the homepage still says private lessons can pair you with other students).
   Effort: low. Evidence: lane 4 traced each gap to the pages and the Bookwhen feed.
4. **Review the two previews.** Done: you approved both on 2026-11-15, with your corrections, and
   they are live (Section 1, "Your approvals, applied"). Still worth doing: watch
   the protected lessons page's search position after release.
5. **Approve the button pink.** Done: you approved it on 2026-11-15 and it is live.
   Every pink button now measures 4.58 to 1 against the 4.5 to 1 guideline (Section 1).

Not recommended now: new pages, filler posts or more neighborhood pages (lane 7).

## Review notes

An independent review raised 17 issues. Each was checked against the files it named; all 17 were
real and all are fixed.

1. Button pink row: fixed. The "Explore Lessons" colour is already in the local copy
   (`app/globals.css` line 495), and the menu and shop parts of the optional patch are in too
   (lines 1092, 1930, 1940). The row now covers only the button pink; the cue moved to Section 1.
   Done since: you approved the button pink on 2026-11-15, so the row is gone.
2. Content questions row: fixed. It points to sections A and B plus C2, marks C1 done (private
   lessons page line 26), and ties C3 and C4 to the lane 6 preview. One refinement: C3 also adds
   the class length, which lane 6 does not, so the guide says "decide together" rather than "one
   or the other".
3. Pictures folder warning: fixed in the header, from Round 11's "Keep the folder private".
4. Certification "only in your About biography": fixed. The homepage headshot
   (`components/teacher.tsx` line 41) carried the printed badge. Done since: that headshot was
   retired on 2026-11-15 and is off the website.
5. "The shorter titles you chose": fixed. Round 12 reworded the About title and the lessons page
   share title, and the handoff recorded no approval of the new words, so both were named in
   Section 1 and listed in Section 4. Done since: you approved their final wording on 2026-11-15
   (Section 1), so the Section 4 row is gone.
6. Photo rotation: fixed. Next's image optimizer in this project applies the rotation tag
   (`.rotate()` in `node_modules/next/dist/server/image-optimizer.js`), so the old sentence blamed
   the site without support. The fix script is hard-coded to two files, which the step now says.
7. Lane 5 screenshots: fixed. They were refreshed at 15:21 and show the final wording (lane 5
   `SOURCES.md` section 6).
8. Missing deliverables: fixed. Section 4 adds the proposed wording document, points analytics to
   the measurement plan's checklist instead of a shorter copy, and adds the search research
   document, which also carries questions for you.
9. "Newest data": fixed in Sections 3 and 5. Those figures are three-month totals ending about
   2026-09-05; the newest figure on record is a site-wide total from the 2026-10-05 email.
10. Fee wording: fixed. The test matches added, additional, extra or travel fees or charges, and
    surcharges; it does not forbid every fee.
11. Class levels: fixed. The list now includes the hidden offer list, the Ask nudges, the other
    pages that name Mahj 101, and `lib/schema.ts`.
12. Home-screen icon: fixed. The row gives the reason and flags the picture's unverified line.
    Done since: you approved the pink die for the home screen on 2026-11-15, so the row is gone.
13. Headshot uses: fixed. The row adds the default preview picture and the structured data.
    Done since: the headshot was replaced on 2026-11-15, so the row is gone.
14. Open Play row: fixed. Split in two, because `lib/pricing.ts` holds only the prices.
15. Lane 3 "still being merged": fixed. Both changes are in the local copy (`next.config.ts`
    line 8, `components/private-events.tsx` line 13); "speed gain unmeasured" stays.
16. "Merged" with two meanings: fixed. The header says "published", Section 1 said "added to the
    local copy", and "merging" now means publishing only. Done since: on 2026-11-15 the Section 1
    headings changed to "on the branch, not live", and on 2026-11-16 to "live since 2026-11-16".
17. Privacy sources file: fixed. The row names the Pictures folder. Done since: you confirmed the
    sentence on 2026-11-15, so the row is gone.
