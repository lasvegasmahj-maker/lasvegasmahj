# Schema — Las Vegas Mahjong

## Database: Supabase (PostgreSQL)

Las Vegas Mahjong is a content-driven site. The schema manages events, classes, testimonials, and shop items that Shauna controls as an admin.

## Tables

### `events`
Upcoming mahjong events — open play, tournaments, socials, corporate events.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `title` | text | Event name |
| `type` | text | `open_play`, `tournament`, `social`, `corporate`, `private` |
| `description` | text | Event details |
| `location` | text | Venue name |
| `address` | text | Full address |
| `area` | text | `summerlin`, `henderson`, `las_vegas`, `other` |
| `date` | timestamptz | Event date/time |
| `end_date` | timestamptz | End time |
| `price` | numeric | Cost (0 for free) |
| `capacity` | integer | Max attendees (null for unlimited) |
| `registration_url` | text | Signup link (Partiful, Eventbrite, etc.) |
| `image_url` | text | Event flyer image |
| `is_recurring` | boolean | Repeating event |
| `recurrence_rule` | text | e.g., `weekly_tuesday`, `monthly_first_saturday` |
| `status` | text | `upcoming`, `full`, `cancelled`, `past` |
| `sort_order` | integer | Display order on the page |
| `created_at` | timestamptz | Auto-set on insert |

### `classes`
Mahjong lesson offerings.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `title` | text | Class name (e.g., "Beginner Lesson") |
| `level` | text | `beginner`, `intermediate`, `advanced`, `all` |
| `type` | text | `group`, `private`, `corporate`, `open_play` |
| `description` | text | What you'll learn |
| `duration` | text | e.g., `2 hours`, `3 hours` |
| `price` | numeric | Cost per person |
| `price_note` | text | e.g., `per person`, `per group` |
| `max_students` | integer | Max class size |
| `includes` | text[] | What's included (e.g., `{instruction, practice tiles, snacks}`) |
| `image_url` | text | Class photo |
| `sort_order` | integer | Display order |
| `is_active` | boolean | Currently offered |
| `created_at` | timestamptz | Auto-set on insert |

### `testimonials`
Player reviews and testimonials.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `name` | text | Player name |
| `quote` | text | Testimonial text |
| `location` | text | e.g., `Summerlin, NV` |
| `image_url` | text | Player photo (optional) |
| `rating` | integer | 1-5 stars (optional) |
| `sort_order` | integer | Display order |
| `is_active` | boolean | Show on site |
| `created_at` | timestamptz | Auto-set on insert |

### `shop_items`
Affiliate product links displayed in the Shop section.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `brand` | text | Brand name (e.g., "Oh My Mahjong") |
| `title` | text | Product/brand display title |
| `description` | text | Short product description |
| `url` | text | Affiliate link |
| `image_url` | text | Product/brand image |
| `discount_code` | text | Promo code (optional) |
| `sort_order` | integer | Display order |
| `is_active` | boolean | Currently showing |
| `created_at` | timestamptz | Auto-set on insert |

### `instructor`
Shauna's profile info (single row).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Single row |
| `name` | text | Full name |
| `title` | text | e.g., `Certified OMM Instructor` |
| `bio` | text | Bio text |
| `photo_url` | text | Headshot photo |
| `instagram` | text | Instagram handle |
| `email` | text | Contact email |
| `certifications` | text[] | e.g., `{Oh My Mahjong Certified}` |

### `site_config`
Global site settings (single row).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Single row |
| `hero_title` | text | Main headline text |
| `hero_subtitle` | text | Subtitle text |
| `hero_cta` | text | CTA button text |
| `announcement_bar` | text | Top banner message (optional) |
| `is_announcement_active` | boolean | Show the banner |
| `social_links` | jsonb | `{ instagram, facebook, tiktok }` |

### `inquiries`
Contact and booking form submissions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `name` | text | Submitter name |
| `email` | text | Submitter email |
| `phone` | text | Phone number (optional) |
| `type` | text | `contact`, `booking`, `corporate`, `private_event` |
| `message` | text | Message body |
| `event_interest` | text | Which class/event they're asking about |
| `group_size` | integer | Number of people (for bookings) |
| `preferred_date` | text | Preferred date (for bookings) |
| `status` | text | `new`, `read`, `replied`, `booked` |
| `created_at` | timestamptz | Auto-set on insert |

### `admins`
Admin user registry (used by RLS policies).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Supabase Auth user ID |
| `role` | text | `admin` |
| `email` | text | Admin email |

## Relationships

```
instructor (single row)
  └── teaches classes, hosts events

events ← displayed on Events section
classes ← displayed on Classes section
testimonials ← displayed on Community section
shop_items ← displayed on Shop section
inquiries ← submitted by visitors via forms
site_config ← controls hero and global settings
admins ← manages everything
```

## Naming Convention

All column names use **snake_case** (PostgreSQL standard), not camelCase.
