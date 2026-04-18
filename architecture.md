# Architecture — Las Vegas Mahjong

## Core Principle

**No hard-coded data.** Event schedules, class info, testimonials, and shop items all come from Supabase. The Next.js pages are the shell; Supabase is the brain.

## Stack

- **Framework:** Next.js 16 (React, TypeScript)
- **Styling:** Tailwind CSS 4 + shadcn/ui components
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (for admin access)
- **Hosting:** Vercel (auto-deploys from GitHub)
- **Domain:** GoDaddy (lasvegasmahj.com → points to Vercel)
- **Storage:** Supabase Storage (images, photos)
- **Email:** Mailchimp (newsletter signups)
- **Icons:** lucide-react

## Data Flow

```
User visits lasvegasmahj.com
  → Vercel serves Next.js pages (server-side rendered)
  → Pages query Supabase for events, classes, testimonials, shop items
  → Dynamic content renders on the page
  → Contact/inquiry forms write to Supabase
  → Newsletter form submits to Mailchimp
```

## Deployment Flow

```
You tell Claude → Claude edits code → You say "commit and push"
  → GitHub receives the push
  → Vercel auto-deploys (30–90 seconds)
  → Live at lasvegasmahj.com
```

## Project Structure

```
lasvegasmahj/
├── app/
│   ├── layout.tsx              # Site metadata, head tags, fonts
│   ├── page.tsx                # Homepage
│   ├── about/page.tsx          # About page
│   ├── events/page.tsx         # Events listing
│   ├── classes/page.tsx        # Class offerings
│   ├── contact/page.tsx        # Contact form
│   ├── shop/page.tsx           # Affiliate shop
│   ├── privacy/page.tsx        # Privacy policy
│   └── terms/page.tsx          # Terms of use
├── components/
│   ├── layout/
│   │   ├── header.tsx          # Site navigation
│   │   └── footer.tsx          # Site footer
│   └── home/
│       ├── hero.tsx            # Hero section
│       ├── why-section.tsx     # "Our Why" section
│       ├── teacher.tsx         # Meet Your Teacher
│       ├── events-preview.tsx  # Upcoming events
│       ├── classes-preview.tsx # Class offerings
│       ├── testimonials.tsx    # Player testimonials
│       ├── shop-preview.tsx    # Shop section
│       └── newsletter.tsx      # Newsletter signup
├── lib/
│   ├── supabase.ts             # Supabase client
│   ├── constants.ts            # Site name, URL, socials
│   └── logos.ts                # Logo mappings
├── data/                       # JSON content (seed data)
├── public/
│   └── logos/                  # Local logo files (512px PNGs)
├── next.config.ts              # Image domains, security headers
├── tailwind.config.ts          # Tailwind configuration
└── .env.local                  # Supabase keys (never commit)
```

## Supabase Tables

| Table | Purpose |
|-------|---------|
| `events` | Upcoming events with dates, locations, details |
| `classes` | Lesson types, pricing, schedules |
| `testimonials` | Player testimonials and reviews |
| `shop_items` | Affiliate products (links, images, descriptions) |
| `instructor` | Shauna's bio, photo, credentials |
| `site_config` | Hero text, CTAs, global settings |
| `inquiries` | Contact and booking form submissions |

## Rules for Development

1. **Never hard-code data** — events, classes, testimonials, and shop items belong in Supabase
2. **Always query Supabase** for dynamic content
3. **Keep pages as shells** — Next.js provides structure, Supabase provides content
4. **Mailchimp stays separate** — newsletter signup posts directly to Mailchimp
5. **All secrets in .env.local** — never commit API keys to GitHub
6. **Fail gracefully** — show loading states, not broken sections, if Supabase is unreachable
