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
no "Read more" link until the owner approves them. Two pending entries (`out-of-turn`, `self-drawn-win`) and one approved stitched entry
(`called-dead`) keep their own wording on purpose and are listed in `ALIGNMENT_EXCEPTIONS`
with a reason; the test fails on any other divergence and on a stale exception. Standard-rule
page answers with no source in our materials are listed in `OWNER_REVIEW` in the same test.

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

The optional model layer (`lib/ask/llm.ts`) may rephrase retrieved entries; it cannot add
rule content. Every model answer is validated: cited entry ids must exist, numbers must
already appear in the cited text, no dashes, no month names, no links. Any failure serves
the approved text verbatim.

## How the two sites stay in sync

Find My Mahj and Las Vegas Mahjong do not share code at runtime (no cross-site dependency).
They share content by copy plus a test:

1. `tests/ask-engine.logic.spec.ts` ("shared entries match Find My Mahj verbatim") reads
   `lib/rules/knowledge.ts` from the sister repo's `main` branch (`git show main:`; falls back
   to HEAD, then the working file) when the repo is checked out beside this one, and fails if
   any `shared_approved` entry's answer or `varies_by_house` differs, or if Find My Mahj main
   has approved entries not copied here. Entries on unmerged Find My Mahj branches are not
   shared yet; copy them as `derived` if needed and flip to `shared_approved` after the merge.
2. Rule of thumb: edit a shared rule in Find My Mahj first (it has the owner-approval
   metadata), then copy the new text here in the same sitting. The test catches a miss.
3. New LVM-only entries should be added here first. If they are general enough for Find My
   Mahj, copy them there with the same id and change the source here to `shared_approved`.

## Approving a derived entry (after the 2026-08-26 cleanup)

Most pending entries already carry the corrected page text. To approve one, change its
`source` to `"lvm_rules_page"` and set `source_url` to the page it mirrors (it will then show
"Standard rule" or "Can vary by house rule" and link to the page); then remove it from the
pending list in the owner report. If the wording should change, edit the
page module in `content/rules/` so both surfaces move together.

## Content decisions after the 2026-08-26 cleanup

The `/rules` pages were reconciled with the rules panel printed on the owner's card and the
owner's own handouts on 2026-08-26. Every clear correction was applied in `content/rules/`
(both the page and its Ask mirror change together). The owner-review report filed in the CEO OS
Drive lists each discrepancy with its old and new wording.

Left for the owner (unchanged, marked `unverified` or `house` in the content modules):

| Page Q&A | Why it waits |
|---|---|
| `winning.self-drawn`, `scoring.self-drawn-pays` | Self-drawn payment is not in the card, the handouts, or any approved entry. Ask stays neutral. |
| `scoring.discard-pays`, `scoring.wall-game` | Rule book claims ("discarder pays double", "no payment in a wall game") that our materials do not cover; listed by name in the truth test. |
| `calling-tiles.out-of-turn` | "Typically results in a dead hand" is a house claim; the card supports only "cannot be claimed". |
| `scoring.game-value`, `jokers.wall-game`, `charleston.wrong-count`, `winning.wall-game`, `etiquette.table-talk`, `etiquette.disputes` | House rules; presented as such. |

Find My Mahj entries that sit slightly off the card are documented in the same report and are
never edited from this repo: `calling-discard` (house note on the calling window) and
`courtesies-vs-rules` (courtesy pass used as an example of a table custom).

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
| `ASK_DISABLED`      | Set to `1` to switch the whole helper off: /ask shows a short notice and the API returns 503. Links stay in place. |

Cost fuses: 30 questions per minute and 400 per day per IP (a venue's players share one IP); 40 model calls per minute and
1,500 per day per warm instance (beyond that, answers fall back to approved text, never an
error); 3,000 output tokens per call (this also covers the model's thinking on Opus 5); 300 character questions; last 6 turns of context.
Tapping a starter or follow-up chip never calls the model.

## What is logged

One JSON line per question in Vercel function logs: kind, entry id, category, label,
via (rules or model), turn number, latency. The question text is never logged, except a
scrubbed topic summary (emails and digits removed, 120 characters) when no entry matched,
so gaps in the knowledge base can be found. Conversations are held only in the visitor's
browser tab (`sessionStorage`) and are never stored server side.
