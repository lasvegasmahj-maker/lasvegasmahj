import { NextResponse } from "next/server";
import { isModelEnabled, modelName } from "@/lib/ask/llm";

// TEMPORARY, added 2026-08-31. The project's log UI returns no request logs, so the gate
// booleans on the ask log event cannot be read. This endpoint reports the same booleans and
// nothing else: no key, no length, no substring or hash, no other variable's value, no prompt,
// no knowledge. Remove it as soon as the model layer is confirmed running in production.

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      key_present: Boolean(process.env.ANTHROPIC_API_KEY),
      model_disabled: process.env.ASK_MODEL_DISABLED === "1",
      model_enabled: isModelEnabled(),
      model: modelName(),
      vercel_env: process.env.VERCEL_ENV ?? null,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
