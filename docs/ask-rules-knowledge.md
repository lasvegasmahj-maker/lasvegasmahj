# Ask a Mahjong Rule: rules knowledge, sync policy, and open content decisions

Feature: `/ask` on lasvegasmahj.com. Code: `lib/ask/*`, `app/ask/*`, `app/api/ask/route.ts`.

## Where rule text comes from

All rule text lives in one file, `lib/ask/knowledge.ts`. Nothing else on the site may
answer a rules question with text that is not in that file. Each entry carries a `source`:

| source            | Meaning                                                                                  | UI label                     |
|-------------------|------------------------------------------------------------------------------------------|------------------------------|
| `shared_approved` | Verbatim copy of an owner-approved entry from Find My Mahj (`lib/rules/knowledge.ts`), same id, same text. | Standard rule / Can vary by house rule |
| `lvm_rules_page`  | Verbatim text from a `/rules/*` page on this site (`source_url`). A few entries stitch two verbatim sentences together (`called-dead`, `wrong-exposure`). | Standard rule / Can vary by house rule |
| `derived`         | Composed only from approved statements, but the exact wording has not been reviewed by the instructor. | Pending instructor review    |

The optional model layer (`lib/ask/llm.ts`) may rephrase retrieved entries; it cannot add
rule content. Every model answer is validated: cited entry ids must exist, numbers must
already appear in the cited text, no dashes, no month names, no links. Any failure serves
the approved text verbatim.

## How the two sites stay in sync

Find My Mahj and Las Vegas Mahjong do not share code at runtime (no cross-site dependency).
They share content by copy plus a test:

1. `tests/ask-engine.logic.spec.ts` ("shared entries match Find My Mahj verbatim") reads
   `../findmymahjgame/lib/rules/knowledge.ts` when the sister repo is checked out beside
   this one and fails if any `shared_approved` entry's answer or `varies_by_house` differs.
2. Rule of thumb: edit a shared rule in Find My Mahj first (it has the owner-approval
   metadata), then copy the new text here in the same sitting. The test catches a miss.
3. New LVM-only entries should be added here first. If they are general enough for Find My
   Mahj, copy them there with the same id and change the source here to `shared_approved`.

## Approving a derived entry

Read the entry, edit the wording if needed, change `source: "derived"` to
`source: "lvm_rules_page"` (and set `source_url` to the page that should carry the same
text, then add the Q&A to that page) or to `shared_approved` after copying it into Find My
Mahj. The "Pending instructor review" label disappears on the next deploy.

Derived entries at launch: `call-during-charleston`, `joker-in-news`, `discarded-joker`,
`call-for-pair`, `self-drawn-win`, `joker-call-complete`, `joker-free`, `pung-vs-kong`,
`card-numbers`, `false-mahjong`, `expose-immediately`, `wrong-exposure`. All but
`self-drawn-win` and `discarded-joker` (exposure half) were checked against the rules printed on
the owner's 2025 card (see below); the wording still awaits the instructor's eye.

## Open content decisions (owner must resolve; nothing was changed silently)

The Find My Mahj knowledge base (owner approved 2026-08-22, two more entries owner
reviewed 2026-08-26) and this site's `/rules` pages (written 2026-05-23) disagree on four
points. The Ask tool serves the Find My Mahj text and does not include the conflicting
`/rules` Q&As. The `/rules` pages were not edited. Until the pages are fixed, `/ask` and
the pages can give different answers on these items.

| # | Topic | Find My Mahj (served by /ask) | /rules page (unchanged) | Status |
|---|-------|-------------------------------|--------------------------|--------|
| 1 | Blind pass timing | `charleston-blind-pass`: "allowed only on the last pass of each Charleston: First Left and, if a second Charleston is played, Last Right" | `/rules/charleston`: "A blind pass occurs during the 'across' pass in either charleston" | Owner reviewed the FMG text 2026-08-26. Page still needs the fix. |
| 2 | Passing jokers | "You may never pass a joker in the Charleston" | `/rules/charleston`: "You may choose to pass jokers if you wish" | Open: owner decision, then fix the losing text. |
| 3 | Stopping the first Charleston | "this first round is required" | `/rules/charleston`: "After the first right pass is complete, any player can call 'stop' before the first across pass" | Open: owner decision, then fix the losing text. |
| 4 | Closed hands calling the last tile | `closed-hand-final-tile`: "you may claim a discard when it is the single tile that completes your mahjong" | `/rules/the-card`: "A closed hand must be built entirely from your own draws; you cannot call any discards" | Owner reviewed the FMG text 2026-08-26. Page still needs the fix. |

The NMJL FAQ page was "Under Construction" on 2026-08-26. The rules printed on the owner's own
2025 card (repo folder `mahjcard/`, gitignored, photos of the rules panel only) settle all four:
jokers may not be passed in the Charleston; the first Charleston is compulsory and may be stopped
only after first left; the blind pass is permitted on first left and/or last right; any tile
except a joker may be called for mahjong, including concealed and Singles and Pairs hands.
The served text is right on all four. The two pages still need the owner's edit.

## Page statements corrected in the tool (card-verified, pages unchanged)

| /rules page statement | Card rule | Tool entry |
|---|---|---|
| `/rules/winning`, `/rules/scoring`: self-drawn wins pay the standard amount, all three pay the full amount | Not printed on the card. Treated as unverified: the tool says the payment is under instructor review. | `self-drawn-win` (pay-self-drawn removed) |
| `/rules/jokers`: calling with jokers needs "at least one real matching tile" from your hand | Jokers may be used in place of any tile(s) in any Pung, Kong or Quint; no natural-tile requirement | `joker-call-complete` |
| `/rules/jokers`, `/rules/scoring`: joker-free pays double, no exception | Double the value is paid by all; exception: Singles and Pairs | `joker-free` |
| `/rules/the-card`, `/rules/calling-tiles`: "the numbers on the card tell you how many tiles are in a group" | A printed digit is the tile number; the card's key defines Pair 2, Pung 3, Kong 4, Quint 5, Sextet 6 | `card-numbers`, `pung-vs-kong` |
| `/rules/winning`: false mahjong "typically" pays each player a full win | Not exposed and all hands intact: no penalty. Exposed: hand is dead. One other player exposed: pay double the value of the incorrect hand to the intact player. | `false-mahjong` |
| `/rules/calling-tiles`: "you cannot call and then decide what to do" | A player may change the number and type of tiles in an exposure up until the player has discarded | `expose-immediately` |
| `/rules/dead-hands`: an error may be corrected before the next player draws if the group agrees | Same rule as above; after the discard an incorrect exposure makes the hand dead, and a dead player still pays the winner | `wrong-exposure` (dead-hand-saved removed) |

Once the owner approves, fix the page text and flip these entries to `lvm_rules_page`.

## Annual card

`CURRENT_CARD_YEAR` in `lib/ask/knowledge.ts` names the card in refusals and year notes.
Update it each spring when the new card releases; a logic test fails if it falls more than
a year behind the calendar. No card hands or point values exist anywhere in the code; generic
teaching terms such as "Singles and Pairs" and "Quint" appear because the live /rules pages use them.

## Model configuration (Vercel environment variables)

| Variable            | Effect |
|---------------------|--------|
| `ANTHROPIC_API_KEY` | Turns on the conversational layer. Absent: fully deterministic, approved text only. |
| `ASK_MODEL`         | Optional model id override (default `claude-opus-5`). |
| `ASK_MODEL_DISABLED`| Set to `1` to switch the model off without removing the key. |

Cost fuses: 30 questions per minute and 400 per day per IP (a venue's players share one IP); 40 model calls per minute and
1,500 per day per warm instance (beyond that, answers fall back to approved text, never an
error); 400 output tokens per call; 300 character questions; last 6 turns of context.
Tapping a starter or follow-up chip never calls the model.

## What is logged

One JSON line per question in Vercel function logs: kind, entry id, category, label,
via (rules or model), turn number, latency. The question text is never logged, except a
scrubbed topic summary (emails and digits removed, 120 characters) when no entry matched,
so gaps in the knowledge base can be found. Conversations are held only in the visitor's
browser tab (`sessionStorage`) and are never stored server side.
