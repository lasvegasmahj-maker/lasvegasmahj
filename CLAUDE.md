@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Session Startup

**Before you do anything, read `architecture.md`, `security.md`, and `schema.md`.** These three files define how the app is built, how data is secured, and how the database is structured. Every decision you make should align with these docs.

## Project

Next.js 16 website for **Las Vegas Mahjong** (lasvegasmahj.com) -- a mahjong instruction and community business run by Shauna, a certified Oh My Mahjong (OMM) instructor based in Las Vegas.

## Sister Business

Find My Mahj Game (findmymahjgame.com) is a mahjong player directory/platform. Separate project at `~/Projects/findmymahjgame`.

## Commands

```bash
pnpm dev          # Start dev server at localhost:3000
pnpm build        # Production build
pnpm lint         # Run ESLint
npx tsc --noEmit  # Typecheck
```

## Architecture

See `architecture.md` for full details. Key points:
- Next.js 16 + Tailwind CSS 4 + shadcn/ui + Supabase
- No hard-coded data -- everything dynamic comes from Supabase
- Vercel auto-deploys from GitHub on push to main
- Secrets in `.env.local` (never commit)

## Design System

- Dark navy theme: `--navy: #1a1b6e`, `--navy-dark: #11124a`
- Pink accent: `--pink: #e91e8c`
- Green accent: `--green: #39e639`
- Gold accent: `--gold: #ffd700`
- Fonts: Bebas Neue (logo), Montserrat (headings), DM Sans (body)

## Conventions

- Keep the dark premium Vegas aesthetic
- All database column names use snake_case
- Images stored in Supabase Storage or as base64 inline
- Mailchimp handles newsletter -- separate from Supabase

---

## Posture

- Auto mode by default: execute, don't plan unless asked. Make reasonable assumptions and proceed end-to-end. Don't ask clarifying questions for routine decisions.
- After meaningful code changes, deploy 3 parallel verification agents with non-overlapping lenses (e.g., internal-routes, external-URLs, live-UX). Catches hallucinations and regressions.
- Prefer editing existing files over creating new ones. Don't create README, planning, or summary files unless asked.

## Code Quality

- Typecheck before every commit. `npx tsc --noEmit`
- No premature abstractions. Three similar lines beats a generic helper for two callers.
- No defensive code for impossible cases. Validate at boundaries (user input, external APIs), not at every layer.
- Default to NO comments. Add one only when the WHY is non-obvious. Never explain WHAT the code does.
- No backward-compat shims for code being actively rewritten. Delete unused code; don't rename to `_unused`.

## Testing

Organize Playwright specs by lens, run on every push via GitHub Actions matrix:

- Critical flows (200s, sitemap, robots, 404s)
- Interactive flows (search/filter clicks at desktop AND mobile viewports)
- Forms (validation, submit handlers, success states)
- SEO metadata (title length, description length, canonical, schema markup)
- Auth + protected routes (anon redirects, 401/403 enforcement)
- Dynamic pages (sample first/middle/last entry per data source)
- API contracts (JSON errors not stack traces, security headers)
- Visual regression (bounding-box checks, elementFromPoint() overlay detection, hydration error capture)

Test as a real user (clicks, not just HTTP 200). Multi-viewport. Free-tier tools only by default (Playwright, GitHub Actions, Lighthouse).

## Security

- Service-role secrets are SERVER-ONLY. Never `NEXT_PUBLIC_*` for anything sensitive.
- Admin gating: server-side checks via allowlist email or session role. UI hide-button is convenience, not security.
- HMAC-signed tokens for one-click email actions (approval, unsubscribe). Timing-safe validation, 7-day TTL default.
- Rate limit public endpoints: 20 req/min per IP baseline.
- Secrets in chat = compromised. If a key gets pasted, ROTATE immediately.
- OAuth: keep basic auth (email/profile) in a separate Google Cloud project from sensitive-scope (Gmail, Drive). Sensitive scope drags the whole project into Google's verification queue.
- Security headers: CSP, HSTS, X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy.
- New user-facing surfaces (prompts, banners, OS permissions) ship flag-gated OFF by default until confirmed.

## Process

- Feature branches, PR to main. NEVER push directly to main.
- Commit messages: WHY in the body, not WHAT.
- Auto-deploy on push creates preview URLs; verify the preview before merging.
- 3-agent verification on significant changes: parallel Explore agents, non-overlapping lenses, structured reports.
- Run typecheck + linter + tests before pushing. If any fail, don't push.

## Style

- NO em dashes. NO en dashes. Use commas, periods, semicolons, parentheses.
- Numeric ranges use ASCII hyphen: `5-7 days`.
- Active voice. State decisions directly.
- Plain language over jargon.

## Memory

Persistent memory across Claude sessions:

- Directory: `~/.claude/projects/<encoded-cwd>/memory/`
- Index: `MEMORY.md` (one line per memory, max ~150 chars)
- Per-topic files: `feedback_<topic>.md`, `user_<topic>.md`, `project_<topic>.md`, `reference_<topic>.md`
- Save corrections AND validated approaches. Save why, not just what.
- Don't save credentials, in-progress task state, or anything derivable from the repo.

## Don't Add

- Backwards-compat layers I didn't ask for
- Observability libraries (Sentry, Datadog) unless asked
- Framework migrations
- Refactors adjacent to a bug fix

## When in Doubt

Ask once, briefly. Then proceed with a reasonable default and tell me what you picked.
