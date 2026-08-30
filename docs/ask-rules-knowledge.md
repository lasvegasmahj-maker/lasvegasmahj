# Ask a Mahjong Rule: rules knowledge, sync policy, and open content decisions

Feature: `/ask` on lasvegasmahj.com. Code: `lib/ask/*`, `app/ask/*`, `app/api/ask/route.ts`.

## The truth layer (2026-08-26 cleanup)

Every `/rules` page renders its Q&A from a content module in `content/rules/<slug>.ts`. Each
Q&A carries `kind` (`standard` or `house`) and `evidence`:

| evidence     | Meaning |
|--------------|---------|
| `card`       | Stated on the rules panel printed on the League card (photos in the gitignored `mahjcard/` folder; rules panel only). |
| `owner`      | Stated in the owner's own handouts (`LasVegasMahjong_HowToPlay_3.pdf`, the NMHC booklet) or approved by the owner. |
| `rulebook`   | Attributed to the League rule book ("Mah Jongg Made Easy"), which our materials do not include. Each such claim is listed by name in `tests/rules-truth.logic.spec.ts` so a new one cannot appear silently. |
| `unverified` | Published copy with no source in our materials. Allowed only when the answer does not claim League authority, or is a house rule. |

Ask entries that mirror a page read their answer from the module (`page_ref`), so the two
cannot drift: change the page and Ask changes with it. Pending (`derived`) entries that mirror
a corrected page also read the page text, but keep the "Pending instructor review" label and
no "Read more" link until the owner approves them. One pending entry (`self-drawn-win`) and one
approved stitched entry (`called-dead`) keep their own wording on purpose and are listed in
`ALIGNMENT_EXCEPTIONS` with a reason; the test fails on any other divergence and on a stale
exception. Standard-rule page answers with no source in our materials are listed in
`OWNER_REVIEW` in the same test (empty since 2026-08-29). The six entries the owner keeps
pending are locked in `PENDING_BY_OWNER_DECISION`; the test fails if any other entry is
`derived` or if one of the six is promoted without changing that list.

`tests/rules-truth.logic.spec.ts` fails when: an Ask mirror differs from its page; a house rule
is written as a League rule; a rule book claim is not on the owner's list; a pending entry is
served as verified or with a link; the `/rules` index counts drift; any card-verified
correction from the 2026-08-26 audit regresses; the learn page or CLAUDE.md regresses.

## Where rule text comes from

Page rule text lives in `content/rules/*.ts`; Ask entries either mirror a page Q&A through
`pageAnswer()` or carry their own text in `lib/ask/knowledge.ts`. Nothing else on the site may
answer a rules question with text outside those files. Each Ask entry carries a `source`:

| source            | Meaning                                                                                  | UI label                     |
|-------------------|------------------------------------------------------------------------------------------|------------------------------|
| `shared_approved` | Verbatim copy of an owner-approved entry from Find My Mahj (`lib/rules/knowledge.ts`), same id, same text. | Standard rule / Can vary by house rule |
| `lvm_rules_page`  | Verbatim text from a `/rules/*` page on this site (`source_url`). One entry, `called-dead`, stitches one Find My Mahj sentence with two page sentences. | Standard rule / Can vary by house rule |
| `owner_approved`  | Approved by the owner (2026-08-29) with no matching `/rules` Q&A yet: `call-during-charleston`, `joker-in-news`, `call-for-pair`. No "Read more" link until a page carries the rule. | Standard rule / Can vary by house rule |
| `derived`         | Composed only from approved statements, but the exact wording has not been reviewed by the instructor. | Pending instructor review    |

The optional model layer (`lib/ask/llm.ts`) may frame a retrieved entry with a fixed opener,
resolve a follow-up, ask one clarifying question, or route to another approved entry. It never
decides or rewords a rule: see "Conversational layer" below.

## How the two sites stay in sync

Find My Mahj and Las Vegas Mahjong do not share code at runtime (no cross-site dependency).
They share content by copy plus a test:

1. `tests/ask-engine.logic.spec.ts` ("shared entries match Find My Mahj verbatim") reads
   `lib/rules/knowledge.ts` from the sister repo's `origin/main` (then `main`, then HEAD, then
   the working file) when the repo is checked out beside this one, and fails if any
   `shared_approved` entry's answer, `varies_by_house`, or `house_note` differs, or if Find My
   Mahj main has approved entries not copied here. Entries on unmerged Find My Mahj branches are not
   shared yet; copy them as `derived` if needed and flip to `shared_approved` after the merge.
2. Rule of thumb: edit a shared rule in Find My Mahj first (it has the owner-approval
   metadata), then copy the new text here in the same sitting. The test catches a miss.
3. New LVM-only entries should be added here first. If they are general enough for Find My
   Mahj, copy them there with the same id and change the source here to `shared_approved`.

## Approving a pending entry

Only the owner approves. To approve one of the six pending entries: if it mirrors a page
Q&A, change its `source` to `"lvm_rules_page"` and set `source_url` to that page (it then shows
"Standard rule" or "Can vary by house rule" and links to the page); if no page carries the
rule yet, use `"owner_approved"` with no `source_url` (verified label, no link) and add the
page Q&A when ready. In both cases remove the id from `PENDING_BY_OWNER_DECISION` in
`lib/ask/knowledge.ts`, or the truth test fails. If the wording should change, edit the page
module in `content/rules/` so both surfaces move together.

## Content decisions

The `/rules` pages were reconciled with the rules panel printed on the owner's card and the
owner's own handouts on 2026-08-26, and the owner ruled on every remaining item on
2026-08-29 (both reports are filed in the CEO OS Drive, LVM / Operations). Every correction
was applied in `content/rules/`, so the page and its Ask mirror changed together.

Payment conventions (discarder pays double, self-drawn payment, wall game payment) are not
in the card, the handouts, or any approved entry. They are presented as house matters with
neutral wording ("Payment conventions can vary by group. Confirm your table's payment rules
before play.") and never as a League rule book or NMJL standard. The card's own multipliers
(jokerless double, misnamed tile times four, mahjong in error) stay as card facts.

Still pending (Ask serves them with "Pending instructor review" and no link):

| Ask entry | Page Q&A | Status |
|---|---|---|
| `discarded-joker` | none | Card rule (never callable for mahjong) stated first; claiming for an exposure is labelled common table practice. |
| `out-of-turn` | `calling-tiles.out-of-turn` | Page now states only the card's rule (claim not allowed, void, play continues; dead only for wrong tile count or incorrect exposure). Any penalty is the owner's call. |
| `take-back-discard` | `etiquette.take-back` | Page wording is card-supported (a tile cannot be claimed until correctly named); the owner has not ruled on the Ask entry. |
| `passed-winning-tile` | `winning.passed-winning-tile` | "Nothing on the card penalizes it" was checked against the panel on 2026-08-29 (claim of absence). |
| `two-dead-hands` | `dead-hands.two-dead` | Sit out and still pay: printed under Misnamed Tile. Remaining two continue: the panel only ends play at three dead hands (Mah Jongg in Error 3), stated on the page as that inference. |
| `self-drawn-win` | `winning.self-drawn`, `scoring.self-drawn-pays` | Payment unresolved; both surfaces send players to their table. |

`the-card.last-year` stays `house` / `unverified`: the sentence about casual groups using an
older card has no source in our materials and makes no League claim.

Find My Mahj shared entries `calling-discard` (house note) and `courtesies-vs-rules` were
corrected in Find My Mahj on 2026-08-29 (FMG PR #13) and copied here verbatim; the drift test
holds them together.

## Annual card

`CURRENT_CARD_YEAR` in `lib/ask/knowledge.ts` names the card in refusals and year notes.
Update it each spring when the new card releases; a logic test fails if it falls more than
a year behind the calendar. No card hands or point values exist anywhere in the code; generic
teaching terms such as "Singles and Pairs" and "Quint" appear because the live /rules pages use them.

## Conversational layer (optional model)

How a typed question is answered when a model key is present:

1. The site's own engine (`lib/ask/engine.ts`) reads the question, picks the approved entry
   that answers it, and prepares the plain approved answer. This happens before any model call
   and is what visitors get when the model is off, slow, or wrong.
2. The model is shown the approved entries the engine picked, the list of all entry questions
   (so it can point at a better entry), the recent conversation (rebuilt from approved answers,
   never from the browser's text), and the follow-up questions the engine allows. It may do
   five things: choose one neutral opener from a fixed list ("Good question.", "Two parts to
   that.", "Here is the rule.", and so on; the full list is `OPENERS` in `lib/ask/llm.ts`),
   keep or drop an entry's bare "Yes." or "No.", add a second approved entry in full when the
   player asked two things (introduced by that entry's own question), pick the follow-up chips,
   or ask one clarifying question that quotes two entries' own questions ("Are you asking
   about A or B?"). It may also say "this is not covered" or, when the engine found nothing,
   point at an approved entry, which is then served word for word. It never adds a Yes or No of
   its own.
3. Everything the model returns is checked in `validateModelOutput` (pure, tested without a
   network in `tests/ask-model.logic.spec.ts`). The approved sentences must appear word for
   word, complete, and in order; the opener must be on the neutral list; the entry's own bare
   "Yes." or "No." is kept only on a plain question (one that starts with can, is, do, what,
   when, how and carries no opinion, report, negation, or inversion) about the entry the engine
   chose, and is dropped everywhere else ("so I can't...", "my friend says...", "is a joker
   prohibited...", "I thought..."); pointing at an entry the engine did not retrieve is allowed
   only when it retrieved nothing; an entry other than the engine's pick is introduced by its
   own question; a second entry must be whole, carry the same label as the first, and is the
   only case where "Two parts to that." is allowed; a clarification must quote two retrieved
   entries' own questions, one of them the engine's pick (never a pending or money entry). The text shown to the visitor is rebuilt from the approved strings, so nothing
   the model typed reaches the page. Anything else, and the plain approved answer is served
   instead. A visitor never sees an internal error.

Why the model may not paraphrase or add a verdict: five independent review rounds showed that
any model-chosen wording, even a bare "Not quite.", can contradict the player's phrasing ("Is a
joker prohibited in a pair?") or reverse a rule, drop an exception, or hedge a League rule into
table practice, and no word-level check can catch that. So the entry speaks and the model
frames. The live battery
(`tests/ask-model-live.logic.spec.ts`) confirms the behaviour with the real provider and a
separate judge model whenever a key is present.

The model is never consulted for: starter and follow-up chips (they match an entry's own
wording and are served verbatim), card-content requests (refused before retrieval), off-topic
and small-talk messages, other mahjong variants, or when the per-instance fuses are spent.

Entries that are always served word for word, never framed, combined, or swapped for a
neighbour: the six pending entries (`PENDING_BY_OWNER_DECISION`) and every `scoring` (money)
entry. The model never returns a rule status, a source, a Read more destination, a payment
rule, a card-year note, or a nudge; `labelFor()` and `readMoreUrl()` decide those from the
entries actually used.

Limits: 6 seconds per model call with no retries (the plain answer is already prepared, so a
slow provider only costs the wait), 700 output tokens (1,500 on models that think first),
300 character questions, the last 6 turns of context.

| Variable            | Effect |
|---------------------|--------|
| `ANTHROPIC_API_KEY` | Turns on the conversational layer. Absent: fully deterministic, approved text only. Server only; never `NEXT_PUBLIC_`. |
| `ASK_MODEL`         | Optional model id override. Default: `claude-haiku-4-5` (`DEFAULT_MODEL` in `lib/ask/llm.ts`). |
| `ASK_MODEL_DISABLED`| Set to `1` to switch the model off while Ask keeps working from approved text. |
| `ASK_DISABLED`      | Set to `1` to switch the whole helper off: /ask shows a short notice and the API returns 503. Links stay in place. |

Cost fuses: 30 questions per minute and 400 per day per IP (a venue's players share one IP);
40 model calls per minute and 1,500 per day per warm instance (beyond that, answers fall back
to approved text, never an error). The system prompt is about 1,600 tokens and, on the default
model, below the size the provider caches, so every call pays for it. Before changing the
model or the prompt, run the live battery with a key:
`ANTHROPIC_API_KEY=... ASK_MODEL=<id> pnpm test:logic -- tests/ask-model-live`. It prints
calls, latency and token counts for the cost estimate.

## What is logged

One JSON line per question in Vercel function logs: kind, entry id, category, label,
via (rules or model), turn number, latency. The question text is never logged, except a
scrubbed topic summary (emails and digits removed, 120 characters) when no entry matched,
so gaps in the knowledge base can be found. Conversations are held only in the visitor's
browser tab (`sessionStorage`) and are never stored server side.
