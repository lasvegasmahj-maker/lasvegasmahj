export interface HomeEvent {
  id: string;
  title: string;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  description: string | null;
  price: string | null;
  ticket_url: string | null;
  tag: string | null;
}

// Reversible hide controls. Set SHOW_PAST_EVENTS to true to list past events
// again; remove a title from HIDDEN_EVENT_TITLES to re-list that event. Supabase
// rows are never deleted.
export const SHOW_PAST_EVENTS = false;
export const HIDDEN_EVENT_TITLES = ["Mahjong Open Play Party at Cafe Lola in Henderson!"];

function pacificTodayStr(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function getHomeEvents(): Promise<{ upcoming: HomeEvent[]; past: HomeEvent[] }> {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return { upcoming: [], past: [] };

  let rows: HomeEvent[];
  try {
    const res = await fetch(`${base}/rest/v1/events?select=*&order=event_date.asc`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return { upcoming: [], past: [] };
    rows = await res.json();
  } catch {
    return { upcoming: [], past: [] };
  }

  if (!Array.isArray(rows)) return { upcoming: [], past: [] };

  const today = pacificTodayStr();
  const visible = rows.filter((e) => !HIDDEN_EVENT_TITLES.includes(e.title));
  const upcoming = visible
    .filter((e) => e.event_date >= today)
    .sort((a, b) => a.event_date.localeCompare(b.event_date));
  const past = visible
    .filter((e) => e.event_date < today)
    .sort((a, b) => b.event_date.localeCompare(a.event_date));

  return { upcoming, past };
}
