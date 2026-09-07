# Ask cross-site unification: resume pointer (Las Vegas Mahjong)

Checkpoint 2026-09-05. This branch (`ask-shared-core-parity`, checkpoint 022af58, based on
58b6999, origin/main 55c5d04 at checkpoint) is the Las Vegas Mahjong half of the shared Ask
core work. It is NOT merged and NOT deployed.

The canonical handoff lives in the shared core repository:

* Repository: https://github.com/lasvegasmahj-maker/mahj-ask-core (private), branch
  `ask-shared-core-parity`
* Local path: /Users/shaunabruckman/Projects/mahj-ask-core
* File: `docs/ASK-UNIFICATION-RESUME-HANDOFF.md` (plus `docs/ask-unification-checkpoint.json`)

Read that file first. What the next session must know about this repository:

* The vendored core under `lib/ask-core/` (lock `ask-core.lock.json`) came from a DIRTY local
  sync at core commit f68c5a5 and predates the core's current head. Re-sync from the core's
  tagged release before opening a PR: `cd /Users/shaunabruckman/Projects/lasvegasmahj-ask-parity
  && node scripts/ask-core/ask-core-sync.mjs v1.0.0` (run from this directory, never from the
  core).
* `lib/ask/site.ts` carries the only sanctioned site override (`payments-basics` excluded by
  the owner's 2026-08-29 neutral-payment decision). Do not remove it without an owner record.
* Last targeted run here: `npx playwright test --project=logic` 74 passed, 5 skipped, at an
  earlier core state. Browser suites and the lint regression check have not been run on this
  branch.
* Merging this branch to main auto-deploys www.lasvegasmahj.com. Do not merge until the full
  release gate in the canonical handoff passes.
