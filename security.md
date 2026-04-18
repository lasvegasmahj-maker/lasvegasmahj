# Security — Las Vegas Mahjong

## Supabase Row Level Security (RLS)

All data access is controlled through PostgreSQL Row Level Security policies. No client can read or write data without passing these rules.

### Rule Principles

1. **Public reads for public content** — events, classes, testimonials, and shop items are viewable by anyone
2. **Admin-only writes** — only authenticated admin users can add/edit/delete content
3. **Open contact form** — anyone can submit an inquiry, but only admins can read them
4. **No client-side deletes** — deletions require admin access

### RLS Policies

```sql
-- EVENTS: public read, admin write
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (is_admin());

-- CLASSES: public read, admin write
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view classes" ON classes FOR SELECT USING (true);
CREATE POLICY "Admins can manage classes" ON classes FOR ALL USING (is_admin());

-- TESTIMONIALS: public read, admin write
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (is_admin());

-- SHOP ITEMS: public read, admin write
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view shop items" ON shop_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage shop items" ON shop_items FOR ALL USING (is_admin());

-- INSTRUCTOR: public read, admin write
ALTER TABLE instructor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view instructor" ON instructor FOR SELECT USING (true);
CREATE POLICY "Admins can manage instructor" ON instructor FOR ALL USING (is_admin());

-- SITE CONFIG: public read, admin write
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Admins can manage config" ON site_config FOR ALL USING (is_admin());

-- INQUIRIES: anyone can insert, only admins can read
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view inquiries" ON inquiries FOR SELECT USING (is_admin());
CREATE POLICY "Admins can manage inquiries" ON inquiries FOR ALL USING (is_admin());

-- ADMIN HELPER FUNCTION
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### Authentication

- **Supabase Auth** handles sign-in (email/password for admins)
- Visitors do not need to sign in to view the site
- Admin users are stored in an `admins` table

### Next.js Security Headers

Configured in `next.config.ts`:
- **Content Security Policy (CSP)** — controls what scripts/styles can load
- **HSTS** — forces HTTPS
- **X-Frame-Options** — blocks iframes (prevents clickjacking)
- **X-Content-Type-Options** — blocks MIME sniffing
- **X-Powered-By** — disabled (hides Next.js)

### Sensitive Data

- **Never commit** `.env.local` — contains Supabase keys
- **Never commit** W9s, contracts, invoices, or financial docs (blocked by `.gitignore`)
- Supabase `anon` key is safe in client code — RLS policies protect the data
- Service role key stays **server-side only** (API routes, never client components)
- Mailchimp API key stays in environment variables
