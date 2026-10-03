import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
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

  revalidateTag(BOOKWHEN_CACHE_TAG, { expire: 0 });
  revalidatePath("/schedule");

  return new Response(
    "Done. The schedule will re-read Bookwhen on its next visit. Open https://www.lasvegasmahj.com/schedule and reload once.\n",
    { headers: { "content-type": "text/plain; charset=utf-8", ...NO_STORE } },
  );
}
