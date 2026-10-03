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
  // Set only on a course card: one card that stands in for every session of a Bookwhen course.
  course?: CourseSummary;
  // The individual Bookwhen sessions a course card stands for. The Event schema is still built
  // from these, so search engines see the same dated sessions they saw before.
  sessions?: ScheduleEvent[];
}

export interface CourseSummary {
  dayTime: string; // "Tuesdays, 11 AM - 1 PM"
  span: string; // "5 weeks, Nov 10 to Dec 15"
  price?: string; // "$150 for the season"
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
  const bookwhen: ScheduleEvent[] = [];
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
            if (ev && Math.floor(ev.sortKey / 10000) >= cutoff) bookwhen.push(ev);
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

  // Bookwhen's feed lists every session of a course separately. Collapse each course into one
  // card; anything that cannot be confirmed as a course stays exactly as the feed gave it.
  events.push(...(await groupCourses(bookwhen, fetchBookwhenPage, Date.now())));

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

/* ── COURSES ──
   Bookwhen's public iCal feed carries no ticket data, so it cannot say which sessions belong to
   a course: every session has its own unrelated event id, exactly like a drop-in session. The
   event's own Bookwhen page does say it. A course session's page has a "Course dates" section
   listing every session, and its ticket is marked "Course ticket - for all N dates". That ticket
   id is shared by every session of the course (ti-euw0-t2d5u for the fall daytime league),
   while a single-ticket entry such as Social Open Play gets a new ticket per date. Grouping is
   driven by that Bookwhen data, never by words in the title. */

export interface CourseDate {
  y: number;
  mo: number;
  d: number;
  h: number;
  mi: number;
  eh?: number;
  emi?: number;
}

export interface CoursePage {
  ticketId: string;
  ticketName: string;
  priceCents: number | null;
  dates: CourseDate[];
  availableUntil: string | null; // as printed, e.g. "Mon 9 Nov 11am"
  unavailable: boolean;
}

const MON_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_PLURAL = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];
const BOOKWHEN_EVENT_URL = /^https:\/\/bookwhen\.com\/lasvegasmahjong\/e\/ev-[a-z0-9]+-\d{14}$/;

function decodeHtml(v: string): string {
  return v
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

const stripTags = (v: string) => decodeHtml(v.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();

function clock(hour: string, minute: string | undefined, ampm: string): { h: number; mi: number } {
  let h = Number(hour) % 12;
  if (ampm.toLowerCase() === "pm") h += 12;
  return { h, mi: minute ? Number(minute) : 0 };
}

// "anchorYear" is the year of the feed session the page belongs to. Bookwhen prints a two-digit
// year on course dates ("Tue, 10 Nov '26"); if it ever drops it, the date nearest the anchor wins.
function parseCourseDate(text: string, anchorYear: number): CourseDate | null {
  const m = text.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s*(?:'(\d{2})|(\d{4}))?/);
  const t = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[–-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
    ?? text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m || !t) return null;
  const mo = MON_ABBR.findIndex((x) => x.toLowerCase() === m[2].toLowerCase()) + 1;
  if (mo === 0) return null;
  const year = m[3] ? 2000 + Number(m[3]) : m[4] ? Number(m[4]) : anchorYear;
  const start = clock(t[1], t[2], t[3]);
  const out: CourseDate = { y: year, mo, d: Number(m[1]), h: start.h, mi: start.mi };
  if (t[4] && t[6]) {
    const end = clock(t[4], t[5], t[6]);
    out.eh = end.h;
    out.emi = end.mi;
  }
  return out;
}

// Returns null unless the page offers a Bookwhen course ticket and lists the course dates.
export function parseBookwhenCoursePage(html: string, anchorYear: number): CoursePage | null {
  const rows = html.match(/<tr class="ticket">[\s\S]*?<\/tr>/g) ?? [];
  const row = rows.find((r) => /<strong>\s*Course ticket\s*<\/strong>/i.test(r));
  if (!row) return null;

  const section = html.match(/class="section connected_events"[\s\S]*?<\/ul>/);
  if (!section) return null;
  const dates = (section[0].match(/<li>[\s\S]*?<\/li>/g) ?? [])
    .map((li) => parseCourseDate(stripTags(li), anchorYear))
    .filter((d): d is CourseDate => d !== null)
    .sort((a, b) => keyOf(a) - keyOf(b));
  if (dates.length === 0) return null;

  const ticketId = row.match(/data-item="(ti-[a-z0-9-]+)"/)?.[1];
  if (!ticketId) return null;
  const name = row.match(/ticket-summary-title__title">([\s\S]*?)<\/h4>/);
  const price = row.match(/currency_symbol">\$<\/span>\s*([\d,]+)(?:\.(\d{2}))?/);
  const until = row.match(/Available until\s*<span[^>]*>([^<]+)<\/span>/);
  const attrs = decodeHtml(row.match(/data-attrs="([^"]*)"/)?.[1] ?? "");

  return {
    ticketId,
    ticketName: name ? stripTags(name[1]) : "",
    priceCents: price ? Number(price[1].replace(/,/g, "")) * 100 + Number(price[2] ?? 0) : null,
    dates,
    availableUntil: until ? decodeHtml(until[1]).trim() : null,
    unavailable: /"(unavailable|cancelled)":\s*true/.test(attrs),
  };
}

const keyOf = (c: CourseDate) => c.y * 100000000 + c.mo * 1000000 + c.d * 10000 + c.h * 100 + c.mi;

// "Mon 9 Nov 11am" carries no year. It is the sales close for a course, so it is the latest
// such date on or before the first session.
export function courseSalesCloseMs(text: string, firstSession: CourseDate): number | null {
  const m = text.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?(?:\s+(\d{4}))?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return null;
  const mo = MON_ABBR.findIndex((x) => x.toLowerCase() === m[2].toLowerCase()) + 1;
  if (mo === 0) return null;
  const { h, mi } = clock(m[4], m[5], m[6]);
  const d = Number(m[1]);
  let y = m[3] ? Number(m[3]) : firstSession.y;
  if (!m[3] && y * 100000000 + mo * 1000000 + d * 10000 + h * 100 + mi > keyOf(firstSession)) y -= 1;
  return Date.parse(pacificIso(y, mo, d, h, mi));
}

function sameStart(c: CourseDate, e: ScheduleEvent): boolean {
  return keyOf(c) === e.sortKey;
}

function courseSummary(page: CoursePage): CourseSummary {
  const ds = page.dates;
  const first = ds[0];
  const last = ds[ds.length - 1];
  const weekday = (c: CourseDate) => new Date(Date.UTC(c.y, c.mo - 1, c.d)).getUTCDay();
  const sameDay = ds.every((c) => weekday(c) === weekday(first));
  const sameTime = ds.every((c) => c.h === first.h && c.mi === first.mi && c.eh === first.eh && c.emi === first.emi);

  let hours = fmtClock(first.h, first.mi);
  if (first.eh !== undefined) hours += " - " + fmtClock(first.eh, first.emi ?? 0);
  const dayTime = sameDay ? `${DAY_PLURAL[weekday(first)]}, ${hours}` : sameTime ? hours : `Starts ${hours}`;

  const n = ds.length;
  const unit = sameDay ? (n === 1 ? "week" : "weeks") : n === 1 ? "session" : "sessions";
  const label = (c: CourseDate, withYear: boolean) => `${MON_ABBR[c.mo - 1]} ${c.d}${withYear ? `, ${c.y}` : ""}`;
  const crossYear = first.y !== last.y;
  const span = n === 1
    ? `1 ${unit}, ${label(first, false)}`
    : `${n} ${unit}, ${label(first, crossYear)} to ${label(last, crossYear)}`;

  let price: string | undefined;
  if (page.priceCents !== null) {
    const dollars = page.priceCents % 100 === 0
      ? `$${(page.priceCents / 100).toLocaleString("en-US")}`
      : `$${(page.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    price = /season/i.test(page.ticketName) ? `${dollars} for the season` : `${dollars} for all ${n} ${n === 1 ? "session" : "sessions"}`;
  }
  return { dayTime, span, price };
}

function courseCard(page: CoursePage, members: ScheduleEvent[], todayKey: number): ScheduleEvent {
  const lead = members[0];
  const first = page.dates[0];
  // The card sits on the date of the first session. If that date has already gone by while
  // tickets are still on sale, it sits on the next session instead, so it stays on the list.
  const anchor = Math.floor(keyOf(first) / 10000) >= todayKey ? first : null;
  return {
    ...lead,
    uid: `course-${page.ticketId}`,
    sortKey: anchor ? keyOf(anchor) : lead.sortKey,
    day: anchor ? DOW[new Date(Date.UTC(anchor.y, anchor.mo - 1, anchor.d)).getUTCDay()] : lead.day,
    num: anchor ? String(anchor.d) : lead.num,
    monthLabel: anchor ? `${MONTHS[anchor.mo - 1]} ${anchor.y}` : lead.monthLabel,
    description: "",
    url: lead.url,
    bookLabel: "Book",
    course: courseSummary(page),
    sessions: members,
  };
}

export type FetchPage = (url: string) => Promise<string | null>;

async function fetchBookwhenPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "user-agent": "LasVegasMahjongSchedule/1.0 (+https://www.lasvegasmahj.com/schedule)" },
      signal: AbortSignal.timeout(8000),
    });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

function pacificDayKey(ms: number): number {
  const p = Object.fromEntries(PACIFIC_PARTS.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return Number(p.year) * 10000 + Number(p.month) * 100 + Number(p.day);
}

// One page fetch per Bookwhen entry, not per session: sessions are bucketed by title and
// description (a course's sessions share both), and only the earliest session in each bucket is
// looked up. If that page is not a course, the bucket is left untouched. If it is, the course's
// own date list decides which sessions join the card; leftovers are checked again in case a
// second run of the same course is on sale. Any failure leaves the sessions as they were.
export async function groupCourses(events: ScheduleEvent[], fetchPage: FetchPage, nowMs: number): Promise<ScheduleEvent[]> {
  const todayKey = pacificDayKey(nowMs);
  const buckets = new Map<string, ScheduleEvent[]>();
  const out: ScheduleEvent[] = [];
  for (const e of events) {
    if (!BOOKWHEN_EVENT_URL.test(e.url)) {
      out.push(e);
      continue;
    }
    const key = `${e.title}\n${e.description}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(e);
  }

  const resolved = await Promise.all(
    [...buckets.values()].map(async (bucket) => {
      const result: ScheduleEvent[] = [];
      let remaining = [...bucket].sort((a, b) => a.sortKey - b.sortKey);
      while (remaining.length > 0) {
        const lead = remaining[0];
        const html = await fetchPage(lead.url);
        const page = html ? parseBookwhenCoursePage(html, Math.floor(lead.sortKey / 100000000)) : null;
        if (!page || !page.dates.some((c) => sameStart(c, lead))) break;
        const members = remaining.filter((e) => page.dates.some((c) => sameStart(c, e)));
        remaining = remaining.filter((e) => !members.includes(e));
        const closeMs = page.availableUntil ? courseSalesCloseMs(page.availableUntil, page.dates[0]) : null;
        const closed = page.unavailable || (closeMs !== null && nowMs >= closeMs);
        // Once ticket sales close the course is hidden: no card, and no stray single sessions.
        if (!closed) result.push(courseCard(page, members, todayKey));
      }
      return [...result, ...remaining];
    }),
  );
  for (const list of resolved) out.push(...list);
  return out;
}
