import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { BOOKWHEN_CACHE_TAG } from "@/lib/schedule";
import { ipOf, SlidingWindow } from "@/lib/ask/rate-limit";

export const dynamic = "force-dynamic";

const perMinute = new SlidingWindow(20, 60_000);
const NO_STORE = { "cache-control": "no-store" };

function keyMatches(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// The key lives only in the Vercel environment because this repository is public. A missing
// or wrong key gets a 404 so the route reveals nothing.
export async function GET(request: Request) {
  if (!perMinute.check(ipOf(request.headers))) {
    return new Response("Too many requests", { status: 429, headers: NO_STORE });
  }
  const expected = process.env.SCHEDULE_REFRESH_KEY ?? "";
  const given = new URL(request.url).searchParams.get("key") ?? "";
  if (expected.length < 16 || !keyMatches(given, expected)) {
    return new Response("Not found", { status: 404, headers: NO_STORE });
  }

  // Stale, not expired: the next visit still gets the current page and starts a rebuild, which
  // waits for fresh Bookwhen data. If Bookwhen is down then, the current page simply stays up,
  // where an expired page would leave visitors with an error until Bookwhen answers.
  revalidateTag(BOOKWHEN_CACHE_TAG, "max");

  return new Response(
    "Done. Open https://www.lasvegasmahj.com/schedule (that visit starts the update), wait about 30 seconds, then reload. If it still shows the old version, wait a minute and reload again. For leagues, do the same with https://www.lasvegasmahj.com/mahjong-leagues-las-vegas\n",
    { headers: { "content-type": "text/plain; charset=utf-8", ...NO_STORE } },
  );
}
