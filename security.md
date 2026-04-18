# Security — Las Vegas Mahjong

## Firebase Security Rules (Firestore)

All data access is controlled through Firestore Security Rules.

### Rule Principles

1. **Public reads for public content** — events, classes, testimonials, and shop items are viewable by anyone
2. **Admin-only writes** — only authenticated admin users can add/edit/delete content
3. **Open contact form** — anyone can submit an inquiry, but only admins can read them
4. **No client-side deletes** — deletions require admin access

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // --- EVENTS ---
    match /events/{eventId} {
      // Anyone can view events
      allow read: if true;
      // Only admins can create/edit/delete events
      allow write: if isAdmin();
    }

    // --- CLASSES ---
    match /classes/{classId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // --- TESTIMONIALS ---
    match /testimonials/{testimonialId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // --- SHOP ITEMS ---
    match /shop_items/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // --- INSTRUCTOR ---
    match /instructor/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // --- SITE CONFIG ---
    match /site_config/{configId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // --- INQUIRIES (contact/booking forms) ---
    match /inquiries/{inquiryId} {
      // Anyone can submit a form
      allow create: if true;
      // Only admins can read/manage submissions
      allow read, update, delete: if isAdmin();
    }

    // --- ADMINS ---
    match /admins/{adminId} {
      // Only admins can read the admin list
      allow read: if isAdmin();
      // No client-side writes to admin list
      allow write: if false;
    }

    // --- ADMIN HELPER ---
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/admins/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Authentication

- **Firebase Authentication** for admin access only
- Visitors do not need to sign in to view the site
- Admin login is used to manage events, classes, testimonials, and shop items

### Sensitive Data

- **Never commit** W9s, contracts, invoices, or financial docs to GitHub
- Keep Firebase config keys in the client (safe — security rules protect data)
- Store third-party API keys in Firebase environment config, not in code
- Mailchimp API key stays server-side or in environment config
