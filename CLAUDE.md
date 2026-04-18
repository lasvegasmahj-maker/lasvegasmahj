@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Session Startup

**Before you do anything, read `architecture.md`, `security.md`, and `schema.md`.** These three files define how the app is built, how data is secured, and how the database is structured. Every decision you make should align with these docs.

## Project

Next.js 16 website for **Las Vegas Mahjong** (lasvegasmahj.com) — a mahjong instruction and community business run by Shauna, a certified Oh My Mahjong (OMM) instructor based in Las Vegas.

## Sister Business

Find My Mahj Game (findmymahjgame.com) is a mahjong player directory/platform. Separate project at `~/Projects/findmymahjgame`.

## Commands

```bash
pnpm dev          # Start dev server at localhost:3000
pnpm build        # Production build
pnpm lint         # Run ESLint
```

## Architecture

See `architecture.md` for full details. Key points:
- Next.js 16 + Tailwind CSS 4 + shadcn/ui + Supabase
- No hard-coded data — everything dynamic comes from Supabase
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
- Mailchimp handles newsletter — separate from Supabase
