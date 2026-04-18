# Schema — Las Vegas Mahjong

## Data Model

Las Vegas Mahjong is a content-driven site. The schema is simpler than Find My Mahj Game — it's primarily about displaying events, classes, testimonials, and shop items that Shauna manages as an admin.

```
EVENTS (what's coming up)
CLASSES (what you can learn)
TESTIMONIALS (what players say)
SHOP ITEMS (what to buy)
INQUIRIES (what visitors ask)
```

## Collections

### `events`
Upcoming mahjong events — open play, tournaments, socials, corporate events.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (auto) | Firestore document ID |
| `title` | string | Event name |
| `type` | string | `"open_play"`, `"tournament"`, `"social"`, `"corporate"`, `"private"` |
| `description` | string | Event details |
| `location` | string | Venue name |
| `address` | string | Full address |
| `area` | string | `"summerlin"`, `"henderson"`, `"las_vegas"`, `"other"` |
| `date` | timestamp | Event date/time |
| `endDate` | timestamp | End time |
| `price` | number | Cost (0 for free) |
| `capacity` | number | Max attendees (null for unlimited) |
| `registrationUrl` | string | Signup link (Partiful, Eventbrite, etc.) |
| `imageUrl` | string | Event flyer image |
| `isRecurring` | boolean | Repeating event |
| `recurrenceRule` | string | e.g., `"weekly_tuesday"`, `"monthly_first_saturday"` |
| `status` | string | `"upcoming"`, `"full"`, `"cancelled"`, `"past"` |
| `sortOrder` | number | Display order on the page |
| `createdAt` | timestamp | Created date |

### `classes`
Mahjong lesson offerings.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (auto) | Firestore document ID |
| `title` | string | Class name (e.g., "Beginner Lesson") |
| `level` | string | `"beginner"`, `"intermediate"`, `"advanced"`, `"all"` |
| `type` | string | `"group"`, `"private"`, `"corporate"`, `"open_play"` |
| `description` | string | What you'll learn |
| `duration` | string | e.g., `"2 hours"`, `"3 hours"` |
| `price` | number | Cost per person |
| `priceNote` | string | e.g., `"per person"`, `"per group"` |
| `maxStudents` | number | Max class size |
| `includes` | array[string] | What's included (e.g., `["instruction", "practice tiles", "snacks"]`) |
| `imageUrl` | string | Class photo |
| `sortOrder` | number | Display order |
| `isActive` | boolean | Currently offered |
| `createdAt` | timestamp | Created date |

### `testimonials`
Player reviews and testimonials.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (auto) | Firestore document ID |
| `name` | string | Player name |
| `quote` | string | Testimonial text |
| `location` | string | e.g., `"Summerlin, NV"` |
| `imageUrl` | string | Player photo (optional) |
| `rating` | number | 1-5 stars (optional) |
| `sortOrder` | number | Display order |
| `isActive` | boolean | Show on site |
| `createdAt` | timestamp | Created date |

### `shop_items`
Affiliate product links displayed in the Shop section.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (auto) | Firestore document ID |
| `brand` | string | Brand name (e.g., "Oh My Mahjong", "Bespoke Mahjong") |
| `title` | string | Product/brand display title |
| `description` | string | Short product description |
| `url` | string | Affiliate link |
| `imageUrl` | string | Product/brand image |
| `discountCode` | string | Promo code (optional, e.g., `"LASVEGAS10"`) |
| `sortOrder` | number | Display order |
| `isActive` | boolean | Currently showing |
| `createdAt` | timestamp | Created date |

### `instructor`
Shauna's profile info (typically a single document).

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `"shauna"` (single doc) |
| `name` | string | Full name |
| `title` | string | e.g., `"Certified OMM Instructor"` |
| `bio` | string | Bio text |
| `photoUrl` | string | Headshot photo |
| `instagram` | string | Instagram handle |
| `email` | string | Contact email |
| `certifications` | array[string] | e.g., `["Oh My Mahjong Certified"]` |

### `site_config`
Global site settings.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | `"main"` (single doc) |
| `heroTitle` | string | Main headline text |
| `heroSubtitle` | string | Subtitle text |
| `heroCta` | string | CTA button text |
| `announcementBar` | string | Top banner message (optional) |
| `isAnnouncementActive` | boolean | Show the banner |
| `socialLinks` | map | `{ instagram, facebook, tiktok }` |

### `inquiries`
Contact and booking form submissions.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (auto) | Firestore document ID |
| `name` | string | Submitter name |
| `email` | string | Submitter email |
| `phone` | string | Phone number (optional) |
| `type` | string | `"contact"`, `"booking"`, `"corporate"`, `"private_event"` |
| `message` | string | Message body |
| `eventInterest` | string | Which class/event they're asking about |
| `groupSize` | number | Number of people (for bookings) |
| `preferredDate` | string | Preferred date (for bookings) |
| `status` | string | `"new"`, `"read"`, `"replied"`, `"booked"` |
| `createdAt` | timestamp | Submission date |

### `admins`
Admin user registry (used by security rules).

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Firebase Auth UID |
| `role` | string | `"admin"` |
| `email` | string | Admin email |

## Relationships

```
instructor (single doc)
  └── teaches classes, hosts events

events ← displayed on Events section
classes ← displayed on Classes section
testimonials ← displayed on Community section
shop_items ← displayed on Shop section
inquiries ← submitted by visitors via forms
site_config ← controls hero and global settings
admins ← manages everything
```
