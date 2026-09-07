import { PARTNER_EVENTS, type PartnerEventInput } from "./partner-events";

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
  bookLabel: string;
  description: string;
  startIso?: string;
  endIso?: string;
  venueKind: "studio" | "partner" | "unknown";
  venueName: string;
}

const FEED_URL =
  "https://feeds.bookwhen.com/ical/3gqc90ysul98/sx0z7q/public.ics";

const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PACIFIC_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Los_Angeles",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hour12: false,
});

function offsetMinutesAt(instantMs: number): number {
  const p = Object.fromEntries(
    PACIFIC_PARTS.formatToParts(new Date(instantMs)).map((x) => [x.type, x.value]),
  );
  const wallAsUtc = Date.UTC(
    Number(p.year), Number(p.month) - 1, Number(p.day),
    Number(p.hour) % 24, Number(p.minute), Number(p.second),
  );
  return Math.round((wallAsUtc - instantMs) / 60000);
}

const pad = (n: number, w = 2) => String(Math.abs(n)).padStart(w, "0");

// Two passes: the instant implied by the first guess can land on the far side of a DST
// transition, which picks the wrong offset for the wall clock the feed actually gave us.
export function pacificIso(y: number, mo: number, d: number, h: number, mi: number): string {
  const wallAsUtc = Date.UTC(y, mo - 1, d, h, mi);
  const first = offsetMinutesAt(wallAsUtc);
  const off = offsetMinutesAt(wallAsUtc - first * 60000);
  const label = `${off < 0 ? "-" : "+"}${pad(Math.trunc(off / 60))}:${pad(off % 60)}`;
  return `${pad(y, 4)}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(mi)}:00${label}`;
}

// Normalised so "West" vs "W." and "Avenue" vs "Ave." cannot break the match. The suite is
// deliberately not part of the test: street number plus street name already identifies the
// studio, and matching "suite200" too meant a Bookwhen edit to "Ste. 200" would silently
// drop every session from the Event schema with no error.
export function isStudioAddress(location: string): boolean {
  const n = location.toLowerCase().replace(/[^a-z0-9]/g, "");
  return n.includes("8687") && n.includes("sahara");
}

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

// room is null when the title matches no known type, so the caller falls back
// to the venue from the feed rather than guessing a room.
function classify(title: string): { tone: Tone; room: string | null } {
  const t = title.toLowerCase();
  if (t.includes("grand opening") || t.includes("turns 1") || t.includes("anniversary"))
    return { tone: "gold", room: "Both rooms" };
  if (t.includes("bling") || t.includes("bedazzle")) return { tone: "gold", room: "Celebration" };
  if (/mahj\s*10[123]/.test(t) || /\b10[123]\b/.test(t) || t.includes("lesson"))
    return { tone: "pink", room: "in Lucky Wishbone room" };
  if (t.includes("open play") || t.includes("social") || t.includes("guided") || t.includes("play"))
    return { tone: "green", room: "in Lucky Sevens room" };
  return { tone: "pink", room: null };
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
  const events: ScheduleEvent[] = [];
  const cutoff = todayInPacific();

  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 1800 } });
    if (res.ok) {
      const lines = unfold(await res.text()).split(/\r?\n/);
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
        const head = line.slice(0, colon);
        const key = head.split(";")[0];
        cur[key] = line.slice(colon + 1);
        cur[`${key}__params`] = head.slice(key.length);
      }
    }
  } catch {
    // Bookwhen unreachable: still show partner events below.
  }

  for (const p of PARTNER_EVENTS) {
    const ev = buildPartnerEvent(p);
    if (Math.floor(ev.sortKey / 10000) >= cutoff) events.push(ev);
  }

  events.sort((a, b) => a.sortKey - b.sortKey);
  return events;
}

function buildPartnerEvent(p: PartnerEventInput): ScheduleEvent {
  let timeStr = fmtClock(p.startHour, p.startMinute);
  if (p.endHour !== undefined) timeStr += " - " + fmtClock(p.endHour, p.endMinute ?? 0);
  const weekday = DOW[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()];
  return {
    uid: `partner-${p.year}-${p.month}-${p.day}-${p.title}`,
    title: p.title,
    sortKey: p.year * 100000000 + p.month * 1000000 + p.day * 10000 + p.startHour * 100 + p.startMinute,
    day: weekday,
    num: String(p.day),
    monthLabel: `${MONTHS[p.month - 1]} ${p.year}`,
    time: timeStr,
    room: p.venue,
    tone: "gold",
    url: p.url,
    bookLabel: p.bookLabel,
    description: p.description,
    startIso: pacificIso(p.year, p.month, p.day, p.startHour, p.startMinute),
    endIso: p.endHour !== undefined
      ? pacificIso(p.year, p.month, p.day, p.endHour, p.endMinute ?? 0)
      : undefined,
    venueKind: "partner",
    venueName: p.venue,
  };
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
  const locationRaw = unescapeText(fields["LOCATION"] || "");
  const venue = locationRaw.split(",")[0].trim();
  const atStudio = isStudioAddress(locationRaw);

  // Only a TZID-qualified Pacific wall time can be turned into a correct offset here.
  const pacificLocal = (params: string, value: string) =>
    /TZID=America\/Los_Angeles/i.test(params) && !/Z$/.test(value);
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
    room: room ?? (venue || "Lucky Hare"),
    // room label: known type -> its studio; otherwise the venue from the feed
    tone,
    url: fields["URL"] || "https://bookwhen.com/lasvegasmahjong",
    bookLabel: "Book",
    description,
    startIso: pacificLocal(fields["DTSTART__params"] ?? "", start)
      ? pacificIso(y, mo, d, h, mi)
      : undefined,
    endIso: em && pacificLocal(fields["DTEND__params"] ?? "", end ?? "")
      ? pacificIso(Number(em[1]), Number(em[2]), Number(em[3]), Number(em[4]), Number(em[5]))
      : undefined,
    venueKind: atStudio ? "studio" : "unknown",
    venueName: atStudio ? "Lucky Hare" : (venue || "Lucky Hare"),
  };
}
