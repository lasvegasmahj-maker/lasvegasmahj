# Architecture — Las Vegas Mahjong

## Core Principle

**No hard-coded data.** Event schedules, class info, testimonials, and shop items all come from Firebase. The HTML page is the shell; Firebase is the brain.

## Stack

- **Frontend:** Static HTML/CSS/JavaScript (single-page site)
- **Backend/Database:** Firebase (Firestore)
- **Auth:** Firebase Authentication (for admin access)
- **Hosting:** GoDaddy (domain)
- **Storage:** Firebase Storage (images, photos)
- **Email:** Mailchimp (newsletter signups)

## Data Flow

```
User visits lasvegasmahj.com
  → Browser loads index.html (nav, layout, sections, footer)
  → JavaScript calls Firebase on page load
  → Firestore returns events, classes, testimonials, shop items
  → JS renders data into page sections dynamically
  → Contact/inquiry forms write submissions to Firestore
  → Newsletter form submits to Mailchimp
```

## Page Architecture

The site is a single `index.html` with multiple sections. Each section follows this pattern:

1. **Static shell** — section heading, layout containers (HTML/CSS)
2. **Firebase fetch** — Firestore query populates the section content
3. **Dynamic rendering** — JS builds cards/lists from Firestore data

### Sections and their data sources

| Section | Firestore Collection | Purpose |
|---------|---------------------|---------|
| Hero (`#home`) | `site_config` | Hero text, CTA buttons |
| Our Why (`#about`) | (static) | Value props — mostly static content |
| Meet Your Teacher | `instructor` | Shauna's bio and photo |
| Events (`#events`) | `events` | Upcoming events list |
| Classes (`#classes`) | `classes` | Lesson offerings and pricing |
| Testimonials (`#community`) | `testimonials` | Player testimonials |
| Shop (`#shop`) | `shop_items` | Affiliate product links |
| Newsletter | (Mailchimp) | Email signup |
| Contact Modal | `inquiries` | Form submissions |
| Inquiry Modal | `inquiries` | Booking form submissions |

## Firebase Project Structure

```
lasvegasmahj (Firebase project)
├── Firestore Database
│   ├── events              # Upcoming events with dates, locations, details
│   ├── classes             # Lesson types, pricing, schedules
│   ├── testimonials        # Player testimonials and reviews
│   ├── shop_items          # Affiliate products (links, images, descriptions)
│   ├── instructor          # Shauna's bio, photo, credentials
│   ├── site_config         # Hero text, CTAs, global settings
│   ├── inquiries           # Contact and booking form submissions
│   └── admins              # Admin users
├── Authentication
│   └── Email/password (admin only)
├── Storage
│   └── Photos, event images
└── Hosting (optional migration target)
```

## Rules for Development

1. **Never hard-code data** into HTML — events, classes, testimonials, and shop items belong in Firestore
2. **Always query Firestore** for dynamic content on page load
3. **Keep index.html as a shell** — HTML provides structure, Firebase provides content
4. **Use Firebase SDK** directly in `<script>` tags (no build step)
5. **Mailchimp stays separate** — newsletter signup posts directly to Mailchimp, not through Firebase
6. **Fail gracefully** — show loading states, not broken sections, if Firebase is unreachable
