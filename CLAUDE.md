# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Session Startup

**Before you do anything, read `architecture.md`, `security.md`, and `schema.md`.** These three files define how the app is built, how data is secured, and how the database is structured. Every decision you make should align with these docs.

## Project

Static single-page website for **Las Vegas Mahjong** (lasvegasmahj.com) — a mahjong instruction and community business run by Shauna, a certified Oh My Mahjong (OMM) instructor based in Las Vegas. No backend, no build step, no package manager: the site is a single self-contained HTML file served directly.

## Business Context

### Sister business
Find My Mahj Game (findmymahjgame.com) is a mahjong player directory/platform being built alongside this business. Separate project at `~/Projects/findmymahjgame`.

### Domains
- lasvegasmahj.com — primary business site (hosted on GoDaddy)
- findmymahjgame.com — sister business (separate repo)

### Services offered
- Mahjong lessons (beginner to advanced)
- Open play events
- Leagues and tournaments
- Corporate and private events
- Located across Las Vegas, Summerlin, and Henderson

### Distribution
- Instagram: @lasvegasmahjong
- Mailchimp newsletter integration
- ManyChat auto-DM campaigns

## Commands

There is no build, test, or lint pipeline. To preview:

```bash
open index.html                         # open in default browser
python3 -m http.server 8000             # serve locally
```

## Architecture

**The entire site is a single self-contained `index.html` file.** All styles live in an inline `<style>` block and behavior in inline `<script>` blocks — there are no external CSS, JS, or template files.

### Page sections (in order)
- **Nav** — fixed top nav with logo, section links, and "Contact" CTA
- **Hero** (`#home`) — main headline with CTA buttons
- **Our Why** (`#about`) — "More Than a Game" value props (brain health, friendship, fun, community)
- **Meet Your Teacher** — Shauna's bio with photo
- **Events** (`#events`) — upcoming events list
- **Classes** (`#classes`) — lesson offerings (beginner, intermediate, open play, private, corporate)
- **Inquiry Modal** — booking form overlay
- **Community/Testimonials** (`#community`) — player testimonials
- **Shop** (`#shop`) — affiliate product links (Oh My Mahjong, Bespoke Mahjong, etc.)
- **Newsletter** — Mailchimp signup form
- **Footer** — links, social, copyright
- **Contact Modal** — contact form overlay

### Design system (inline)
- CSS custom properties: `--navy:#1a1b6e`, `--navy-dark:#11124a`, `--pink:#e91e8c`, `--green:#39e639`, `--gold:#ffd700`
- Fonts loaded from Google Fonts: Bebas Neue (logo), Montserrat (headings), DM Sans (body)
- Dark navy theme with pink and green accent colors

### SEO
- Full Open Graph and Twitter Card meta tags
- Local Business Schema.org JSON-LD markup
- Canonical URL set to https://lasvegasmahj.com

## Conventions

- Keep the site as a single self-contained HTML file — do not introduce a bundler, shared stylesheet, or templating layer without discussing first.
- Maintain the `--navy/--pink/--green/--gold` palette and font pairing.
- Images are embedded as base64 data URIs inline in the HTML.
- The site uses smooth scroll anchors for navigation (#home, #about, #events, etc.).
