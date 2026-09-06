# Ask a Mahjong Rule: where the rules come from and how this site uses the shared core

Feature: `/ask` on lasvegasmahj.com. Code: `lib/ask-core/*` (vendored shared core), `lib/ask/*`
(this site's overlay), `app/ask/*`, `app/api/ask/route.ts`, `app/api/ask/version/route.ts`.

## One rules truth layer, two sites (2026-09-05)

Since 2026-09-05 the rules corpus, the retrieval engine, the clarification engine, the card
copyright guard, the follow-up context, and the model framing contract are not written in this
repository. They live in the shared package **mahj-ask-core**
(https://github.com/lasvegasmahj-maker/mahj-ask-core), and this site carries a byte-identical
copy under `lib/ask-core/`, pinned by `ask-core.lock.json`. Find My Mahj Game carries the same
copy. A rule the owner approves there is approved here at the next sync; there is nothing to
copy by hand and no manifest to reconcile.

- Read the core's `docs/ARCHITECTURE.md` for the behavioral contract both sites share.
- To change a rule or the engine: `docs/UPDATE-PROCEDURE.md` there. Never edit `lib/ask-core`
  here; `scripts/ask-core/ask-core-check.mjs` fails CI when a vendored file differs from the
  lock or when the sibling site's main is on a newer core version.
- To approve a pending answer: `docs/OWNER-APPROVAL.md` there (one field change; both sites
  inherit it).
- Cross-site parity: `node scripts/ask-core/ask-parity.mjs --probes` compares the two live sites.

## What stays in this repository

| Concern | Where |
|---|---|
| Brand, helper name, studio vocabulary (lessons, open play, booking questions are never rules), Read more map into `/rules`, the owner-recorded payment override | `lib/ask/site.ts` |
| Nudges into lessons and open play (once per conversation, never on the first answer, never on a pending answer) | `lib/ask/nudges.ts` |
| Starter chips (each must equal a canonical question in the core) | `lib/ask/starters.ts` |
| The Anthropic adapter for the shared model contract | `lib/ask/model-client.ts` |
| The `/rules` pages | `content/rules/*.ts`, `app/rules/*` |
| The Ask UI | `app/ask/*` |

## The /rules pages and the corpus

Every `/rules` page renders its Q&A from `content/rules/<slug>.ts`. Entries in the shared corpus
that originate from those pages carry provenance `owner_site_page` naming the page Q&A they
mirror, and `tests/rules-truth.logic.spec.ts` fails if the page text and the corpus text differ
(except the two listed alignment exceptions). Change the page and the core together: the page
here, the entry in mahj-ask-core, then a release and a sync.

## Labels and pending answers

Labels come from the entry: Standard rule, Can vary by house rule, Tournament rule, Etiquette,
Strategy (not a rule), Pending instructor review, Depends on the annual card, Quick check. A
pending entry (approval `research_verified`) is served word for word on both sites with the
review note and no Read more link. The owner's 2026-08-29 pending decisions are canonical ids
joker-discarded, out-of-turn, own-discard, passed-winning-tile, two-dead-hands, self-drawn-win;
players-count is pending on both sites until the owner signs off its three-player sentence.

## The payment override (owner decision conflict)

The owner decided on 2026-08-29 that payment conventions on this site are house matters with
neutral wording and no League attribution. On 2026-08-30 she approved `payments-basics` on Find
My Mahj with League payment-structure wording. Both decisions stand until she reconciles them:
this site excludes `payments-basics` by a recorded override in `lib/ask/site.ts`, answers payment
questions from its neutral money entries, reports the override on `/api/ask/version`, and the
parity check lists it as a known owner-recorded divergence. Details: mahj-ask-core
`docs/OWNER-RULE-ESCALATION.md`, item A1.

## Conversational layer (optional model)

The model layer is the shared contract ("the entry speaks, the model frames") with this site's
persona line. It never rewords a rule; every served sentence is rebuilt from approved strings.
Pending and money entries are served verbatim. See the core's `src/model/compose.ts`.

| Variable | Effect |
|---|---|
| `ANTHROPIC_API_KEY` | Turns on the conversational layer. Absent: fully deterministic. Server only. |
| `ASK_MODEL` | Optional model id override. Default `claude-haiku-4-5`. |
| `ASK_MODEL_DISABLED` | `1` switches the model off while Ask keeps working from approved text. |
| `ASK_DISABLED` | `1` switches the whole helper off: /ask shows a notice and the API returns 503. |

Production env vars for www.lasvegasmahj.com belong to the Vercel project `lasvegasmahj-h1iz`.
Cost fuses: 30 questions per minute and 400 per day per IP; 40 model calls per minute and 1,500
per day per warm instance. Before changing the model or the prompt, run the live battery with a
judge model different from the model under test:
`ANTHROPIC_API_KEY=... ASK_JUDGE_MODEL=claude-sonnet-5 pnpm test:logic -- tests/ask-model-live`.

## What is logged

One JSON line per question in Vercel function logs: topic, kind, entry id, category, label,
clarification id, via (rules or model), turn number, latency. The question text is never logged,
except a scrubbed topic summary (emails and digits removed, 120 characters) on the `ask_escalation`
line when a rules question reached no entry, so gaps can be added to the corpus. Conversations
live only in the visitor's browser tab (`sessionStorage`) and are never stored server side.

## Annual card

`CURRENT_CARD_YEAR` lives in the core (`lib/ask-core/corpus/entries.ts`); update it there each
spring (core `docs/ANNUAL-CARD-MAINTENANCE.md`). No card hands or point values exist anywhere in
either site's code.
