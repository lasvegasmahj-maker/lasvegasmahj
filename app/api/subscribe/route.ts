// Same-origin proxy to the Mailchimp embedded-form endpoint so the signup
// can submit inline (no off-site redirect, no JSONP, no CORS). The list-manage
// post-json endpoint is public and needs no API key.
const MC_BASE = "https://gmail.us15.list-manage.com/subscribe/post-json";
const MC_U = "85959bbed840b4e31ea78b3f3";
const MC_ID = "6dacbc956d";
const MC_HONEYPOT = "b_85959bbed840b4e31ea78b3f3_6dacbc956d";

export async function POST(req: Request) {
  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    if (typeof body.email === "string") email = body.email.trim();
  } catch {
    // malformed body falls through to validation below
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json(
      { result: "error", msg: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({ u: MC_U, id: MC_ID, EMAIL: email });
  params.set(MC_HONEYPOT, "");
  // post-json returns its HTML form page unless a JSONP callback is requested;
  // with `c` it returns cb({...}), which parseFirstJsonp() below unwraps.
  params.set("c", "cb");

  try {
    const mcRes = await fetch(`${MC_BASE}?${params.toString()}`, {
      headers: { "User-Agent": "lasvegasmahj.com newsletter signup" },
    });
    const text = await mcRes.text();
    const data = parseFirstJsonp(text);
    return Response.json({
      result: data?.result ?? "error",
      msg: data?.msg ?? "The subscription service returned an unexpected response.",
    });
  } catch {
    return Response.json(
      { result: "error", msg: "Could not reach the subscription service. Please try again." },
      { status: 502 }
    );
  }
}

// Mailchimp returns JSONP (cb({...})) and on some errors concatenates two
// calls: cb({...})cb({...}). Extract and parse only the first balanced { }
// object via brace counting, which also ignores ()/# characters in messages.
function parseFirstJsonp(text: string): { result?: string; msg?: string } | null {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1)) as { result?: string; msg?: string };
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}
