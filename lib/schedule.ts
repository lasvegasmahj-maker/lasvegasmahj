export type Tone = "pink" | "green" | "gold";

export interface ScheduleEvent {
  uid: string;
  title: string;
  sortKey: number;
  day: string;
  num: string;
  monthLabel: string;
  time: string;
  room: string;
  tone: Tone;
  url: string;
  description: string;
}

const FEED_URL =
  "https://feeds.bookwhen.com/ical/3gqc90ysul98/sx0z7q/public.ics";

const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function unfold(text: string): string {
  return text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
}

function unescapeText(v: string): string {
  return v
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function fmtClock(h: number, mi: number): string {
  const ap = h >= 12 ? "PM" : "AM";
  let hr = h % 12;
  if (hr === 0) hr = 12;
  const mm = mi === 0 ? "" : ":" + String(mi).padStart(2, "0");
  return `${hr}${mm} ${ap}`;
}

function classify(title: string): { tone: Tone; room: string } {
  const t = title.toLowerCase();
  if (t.includes("grand opening") || t.includes("turns 1") || t.includes("anniversary"))
    return { tone: "gold", room: "Both studios" };
  if (t.includes("bling") || t.includes("bedazzle")) return { tone: "gold", room: "Celebration" };
  if (/mahj\s*10[123]/.test(t) || /\b10[123]\b/.test(t) || t.includes("lesson"))
    return { tone: "pink", room: "Lucky Wishbone" };
  if (t.includes("open play") || t.includes("social") || t.includes("guided") || t.includes("play"))
    return { tone: "green", room: "Lucky Sevens" };
  return { tone: "pink", room: "Lucky Hare" };
}

function todayInPacific(): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  return get("year") * 10000 + get("month") * 100 + get("day");
}

export async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  let text: string;
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    text = await res.text();
  } catch {
    return [];
  }

  const lines = unfold(text).split(/\r?\n/);
  const events: ScheduleEvent[] = [];
  const cutoff = todayInPacific();
  let cur: Record<string, string> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      cur = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (cur) {
        const ev = buildEvent(cur);
        if (ev && Math.floor(ev.sortKey / 10000) >= cutoff) events.push(ev);
      }
      cur = null;
      continue;
    }
    if (!cur) continue;
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const rawKey = line.slice(0, colon);
    const key = rawKey.split(";")[0];
    cur[key] = line.slice(colon + 1);
  }

  events.sort((a, b) => a.sortKey - b.sortKey);
  return events;
}

function buildEvent(fields: Record<string, string>): ScheduleEvent | null {
  const start = fields["DTSTART"];
  const summary = fields["SUMMARY"];
  if (!start || !summary) return null;

  const sm = start.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (!sm) return null;
  const y = Number(sm[1]);
  const mo = Number(sm[2]);
  const d = Number(sm[3]);
  const h = Number(sm[4]);
  const mi = Number(sm[5]);

  let timeStr = fmtClock(h, mi);
  const end = fields["DTEND"];
  const em = end?.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (em) timeStr += " - " + fmtClock(Number(em[4]), Number(em[5]));

  const title = unescapeText(summary).trim();
  const { tone, room } = classify(title);
  const weekday = DOW[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()];

  let description = unescapeText(fields["DESCRIPTION"] || "");
  description = description.replace(/\n+https?:\/\/\S+\s*$/i, "");
  description = description.replace(/\s*\n+\s*/g, " ").trim();

  return {
    uid: fields["UID"] || `${start}-${title}`,
    title,
    sortKey: y * 100000000 + mo * 1000000 + d * 10000 + h * 100 + mi,
    day: weekday,
    num: String(d),
    monthLabel: `${MONTHS[mo - 1]} ${y}`,
    time: timeStr,
    room,
    tone,
    url: fields["URL"] || "https://bookwhen.com/lasvegasmahjong",
    description,
  };
}
