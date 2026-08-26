// In-memory sliding windows. Vercel functions are ephemeral, so this protects a warm
// instance against bursts and runaway loops rather than promising a global count; the
// site's Supabase project is paused, so there is no shared store to lean on. Token caps
// in lib/ask/llm.ts bound the cost of any single request regardless.

export function ipOf(headers: Headers): string {
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  const fwd = headers.get("x-forwarded-for") || "";
  const first = fwd.split(",").map((v) => v.trim()).filter(Boolean)[0];
  return first || "unknown";
}

export class SlidingWindow {
  private hits = new Map<string, number[]>();
  constructor(private max: number, private windowMs: number) {}

  check(key: string, now = Date.now()): boolean {
    const since = now - this.windowMs;
    const list = (this.hits.get(key) ?? []).filter((t) => t > since);
    if (list.length >= this.max) {
      this.hits.set(key, list);
      return false;
    }
    list.push(now);
    this.hits.set(key, list);
    if (this.hits.size > 5000) this.sweep(now);
    return true;
  }

  private sweep(now: number) {
    const since = now - this.windowMs;
    for (const [k, list] of this.hits) {
      const kept = list.filter((t) => t > since);
      if (kept.length) this.hits.set(k, kept);
      else this.hits.delete(k);
    }
  }
}

export const perMinute = new SlidingWindow(30, 60_000);
export const perDay = new SlidingWindow(400, 24 * 60 * 60_000);
export const modelPerMinute = new SlidingWindow(40, 60_000);
export const modelPerDay = new SlidingWindow(1500, 24 * 60 * 60_000);
