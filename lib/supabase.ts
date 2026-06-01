import { createClient } from "@supabase/supabase-js";

// Fall back to a harmless placeholder so the build never fails when the
// Supabase env vars are absent. With real env vars set, the real client is
// used; without them, data fetches just no-op rather than crashing the build.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
