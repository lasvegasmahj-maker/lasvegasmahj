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

const MAX_KEYS = 10_000;
const SWEEP_EVERY_MS = 60_000;

export class SlidingWindow {
  private hits = new Map<string, number[]>();
  private lastSweep = 0;
  constructor(private max: number, private windowMs: number) {}

  check(key: string, now = Date.now()): boolean {
    const since = now - this.windowMs;
    const list = (this.hits.get(key) ?? []).filter((t) => t > since);
    if (list.length >= this.max) {
      this.hits.set(key, list);
      return false;
    }
    list.push(now);
    this.hits.delete(key);
    this.hits.set(key, list);
    if (now - this.lastSweep > SWEEP_EVERY_MS) this.sweep(now);
    // Map keeps insertion order, so the first keys are the least recently active.
    while (this.hits.size > MAX_KEYS) this.hits.delete(this.hits.keys().next().value!);
    return true;
  }

  private sweep(now: number) {
    this.lastSweep = now;
    const since = now - this.windowMs;
    for (const [k, list] of this.hits) {
      const kept = list.filter((t) => t > since);
      if (kept.length) this.hits.set(k, kept);
      else this.hits.delete(k);
    }
  }
}

// Above the site's 20/min baseline because a whole table (or a venue) shares one IP.
export const perMinute = new SlidingWindow(30, 60_000);
export const perDay = new SlidingWindow(400, 24 * 60 * 60_000);
export const modelPerMinute = new SlidingWindow(40, 60_000);
export const modelPerDay = new SlidingWindow(1500, 24 * 60 * 60_000);
