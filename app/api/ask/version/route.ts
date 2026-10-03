import { NextResponse } from "next/server";
import { coreIdentity, overrideSummary } from "@/lib/ask-core/index.ts";
import { LVM_SITE } from "@/lib/ask/site";

// Which shared Ask core this site is serving, so the parity check can compare the two sites
// without reading either one's code. No secrets, no configuration values, only identity.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      site: LVM_SITE.site,
      ...coreIdentity(LVM_SITE),
      overrides: overrideSummary(LVM_SITE),
      build: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
