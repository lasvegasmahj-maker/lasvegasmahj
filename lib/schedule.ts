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
  course?: CourseSummary;
  // The Event schema is built from these, so a course card leaves the dated sessions that
  // search engines see unchanged.
  sessions?: ScheduleEvent[];
}

export interface CourseSummary {
  dayTime: string;
  span: string;
  price?: string;
}

const FEED_URL =
  "https://feeds.bookwhen.com/ical/3gqc90ysul98/sx0z7q/public.ics";

// Bookwhen serves its feed and pages uncached, so this interval is the whole delay before an
// edit in Bookwhen reaches the site. The tag lets /api/refresh-schedule expire them at once.
export const BOOKWHEN_REVALIDATE_SECONDS = 300;
export const BOOKWHEN_CACHE_TAG = "bookwhen";

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
    const res = await fetch(FEED_URL, {
      next: { revalidate: BOOKWHEN_REVALIDATE_SECONDS, tags: [BOOKWHEN_CACHE_TAG] },
    });
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

  // Anything that cannot be confirmed as a course stays exactly as the feed gave it.
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
   The iCal feed carries no ticket data: every course session has its own unrelated event id,
   just like a drop-in session. Each session's Bookwhen page does mark the course, with a
   "Course dates" list and a ticket labelled "Course ticket - for all N dates" whose id is shared
   by every session (a drop-in entry such as Social Open Play gets a new ticket per date). So
   courses are found from that page, never from words in the title. */

export interface CourseDate {
  y: number;
  mo: number;
  d: number;
  h: number;
  mi: number;
  eh?: number;
  emi?: number;
}

export interface CourseTicket {
  id: string;
  name: string;
  priceCents: number | null;
  availableFrom: string | null;
  availableUntil: string | null;
  unavailable: boolean;
}

export interface CoursePage {
  key: string;
  tickets: CourseTicket[];
  dates: CourseDate[];
}

type Day = { y: number; mo: number; d: number };

const MON_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DOW_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAME = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_PLURAL = DAY_NAME.map((d) => d + "s");
const BOOKWHEN_EVENT_URL = /^https:\/\/bookwhen\.com\/lasvegasmahjong\/e\/ev-[a-z0-9]+-\d{14}$/;
const DAY_MS = 86400000;

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
const monthOf = (abbr: string) => MON_ABBR.findIndex((x) => x.toLowerCase() === abbr.slice(0, 3).toLowerCase()) + 1;
const utcDay = (y: number, mo: number, d: number) => Date.UTC(y, mo - 1, d);
const keyOf = (c: CourseDate) => c.y * 100000000 + c.mo * 1000000 + c.d * 10000 + c.h * 100 + c.mi;

function clock(hour: string, minute: string | undefined, ampm: string): { h: number; mi: number } {
  let h = Number(hour) % 12;
  if (ampm.toLowerCase() === "pm") h += 12;
  return { h, mi: minute ? Number(minute) : 0 };
}

// Bookwhen often prints no year ("Mon 9 Nov 11am"), and a sales window can close before or after
// the first session. The printed weekday settles which year is meant; failing that, the date
// nearest the course wins.
function pickYear(dow: string | undefined, mo: number, d: number, near: Day): number {
  const years = [near.y - 1, near.y, near.y + 1];
  const wd = dow ? DOW_ABBR.findIndex((x) => x.toLowerCase() === dow.slice(0, 3).toLowerCase()) : -1;
  const fits = years.filter((y) => wd < 0 || new Date(utcDay(y, mo, d)).getUTCDay() === wd);
  const target = utcDay(near.y, near.mo, near.d);
  return (fits.length ? fits : years).reduce((best, y) =>
    Math.abs(utcDay(y, mo, d) - target) < Math.abs(utcDay(best, mo, d) - target) ? y : best,
  );
}

const DATE_RE = /(?:([A-Za-z]{3})[a-z]*,?\s+)?(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?(?:\s*'(\d{2})|\s+(\d{4}))?/;

function parseCourseDate(text: string, near: Day): CourseDate | null {
  const m = text.match(DATE_RE);
  const t = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)\s*[\u2013-]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
    ?? text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m || !t) return null;
  const mo = monthOf(m[3]);
  if (mo === 0) return null;
  const d = Number(m[2]);
  const y = m[4] ? 2000 + Number(m[4]) : m[5] ? Number(m[5]) : pickYear(m[1], mo, d, near);
  const start = clock(t[1], t[2], t[3]);
  const out: CourseDate = { y, mo, d, h: start.h, mi: start.mi };
  if (t[4] && t[6]) {
    const end = clock(t[4], t[5], t[6]);
    out.eh = end.h;
    out.emi = end.mi;
  }
  return out;
}

export function bookwhenTimeMs(text: string, near: Day): number | null {
  const m = text.match(/(?:([A-Za-z]{3})[a-z]*,?\s+)?(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?(?:\s*'(\d{2})|\s+(\d{4}))?\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!m) return null;
  const mo = monthOf(m[3]);
  if (mo === 0) return null;
  const d = Number(m[2]);
  const y = m[4] ? 2000 + Number(m[4]) : m[5] ? Number(m[5]) : pickYear(m[1], mo, d, near);
  const { h, mi } = clock(m[6], m[7], m[8]);
  return Date.parse(pacificIso(y, mo, d, h, mi));
}

function parseTicketRow(row: string): CourseTicket | null {
  const id = row.match(/data-item="(ti-[a-z0-9-]+)"/)?.[1];
  if (!id) return null;
  const name = row.match(/ticket-summary-title__title">([\s\S]*?)<\/h4>/);
  const price = row.match(/currency_symbol">\$<\/span>\s*([\d,]+)(?:\.(\d{2}))?/);
  // With both ends set, Bookwhen prints "Available between <span>A</span> and <span>B</span>".
  const between = row.match(/Available between\s*<span[^>]*>([^<]+)<\/span>\s*and\s*<span[^>]*>([^<]+)<\/span>/);
  const from = between?.[1] ?? row.match(/Available from\s*<span[^>]*>([^<]+)<\/span>/)?.[1];
  const until = between?.[2] ?? row.match(/Available until\s*<span[^>]*>([^<]+)<\/span>/)?.[1];
  const attrs = decodeHtml(row.match(/data-attrs="([^"]*)"/)?.[1] ?? "");
  return {
    id,
    name: name ? stripTags(name[1]) : "",
    priceCents: price ? Number(price[1].replace(/,/g, "")) * 100 + Number(price[2] ?? 0) : null,
    availableFrom: from ? decodeHtml(from).trim() : null,
    availableUntil: until ? decodeHtml(until).trim() : null,
    unavailable: /"(unavailable|cancelled)":\s*true/.test(attrs),
  };
}

// An entry that also sells single-date tickets is not grouped: its dates stay bookable one by one.
export function parseBookwhenCoursePage(html: string, near: Day): CoursePage | null {
  const rows = html.match(/<tr class="ticket[^"]*">[\s\S]*?<\/tr>/g) ?? [];
  if (rows.length === 0 || !rows.every((r) => /<strong>\s*Course ticket\s*<\/strong>/i.test(r))) return null;

  const section = html.match(/class="section connected_events"[\s\S]*?<\/ul>/);
  if (!section) return null;
  const dates = (section[0].match(/<li>[\s\S]*?<\/li>/g) ?? [])
    .map((li) => parseCourseDate(stripTags(li), near))
    .filter((d): d is CourseDate => d !== null)
    .sort((a, b) => keyOf(a) - keyOf(b));
  const tickets = rows.map(parseTicketRow).filter((t): t is CourseTicket => t !== null);
  if (dates.length === 0 || tickets.length !== rows.length) return null;
  return { key: tickets.map((t) => t.id).sort().join("+"), tickets, dates };
}

// A ticket not on sale yet still lists the course; one past its close, or unavailable, does not.
function ticketListed(t: CourseTicket, first: CourseDate, nowMs: number): boolean {
  const until = t.availableUntil ? bookwhenTimeMs(t.availableUntil, first) : null;
  if (until !== null && nowMs >= until) return false;
  const from = t.availableFrom ? bookwhenTimeMs(t.availableFrom, first) : null;
  if (from !== null && nowMs < from) return true;
  return !t.unavailable;
}

function courseSummary(page: CoursePage, ticket: CourseTicket): CourseSummary {
  const ds = page.dates;
  const first = ds[0];
  const last = ds[ds.length - 1];
  const dayMs = (c: CourseDate) => utcDay(c.y, c.mo, c.d);
  const weekday = (c: CourseDate) => new Date(dayMs(c)).getUTCDay();
  const n = ds.length;
  const days = new Set(ds.map(dayMs)).size;
  const sameWeekday = ds.every((c) => weekday(c) === weekday(first));
  const weekly = n > 1 && days === n && sameWeekday
    && ds.every((c, i) => i === 0 || ((dayMs(c) - dayMs(ds[i - 1])) / DAY_MS >= 7 && (dayMs(c) - dayMs(ds[i - 1])) / DAY_MS <= 14));
  const sameStart = ds.every((c) => c.h === first.h && c.mi === first.mi);
  const sameHours = sameStart && ds.every((c) => c.eh === first.eh && c.emi === first.emi);

  let hours = fmtClock(first.h, first.mi);
  if (first.eh !== undefined) hours += " - " + fmtClock(first.eh, first.emi ?? 0);
  const time = sameHours ? hours : sameStart ? `from ${fmtClock(first.h, first.mi)}` : "times vary";
  const day = !sameWeekday ? "" : days === 1 ? DAY_NAME[weekday(first)] : DAY_PLURAL[weekday(first)];
  const dayTime = day ? `${day}, ${time}` : time[0].toUpperCase() + time.slice(1);

  const unit = weekly ? "weeks" : n === 1 ? "session" : "sessions";
  const label = (c: CourseDate, withYear: boolean) => `${MON_ABBR[c.mo - 1]} ${c.d}${withYear ? `, ${c.y}` : ""}`;
  const crossYear = first.y !== last.y;
  const span = days === 1
    ? `${n} ${unit}, ${label(first, false)}`
    : `${n} ${unit}, ${label(first, crossYear)} to ${label(last, crossYear)}`;

  let price: string | undefined;
  if (ticket.priceCents !== null) {
    const amount = ticket.priceCents % 100 === 0
      ? `$${(ticket.priceCents / 100).toLocaleString("en-US")}`
      : `$${(ticket.priceCents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    price = /season/i.test(ticket.name) ? `${amount} for the season` : n === 1 ? amount : `${amount} for all ${n} sessions`;
  }
  return { dayTime, span, price };
}

function courseCard(page: CoursePage, ticket: CourseTicket, members: ScheduleEvent[], todayKey: number): ScheduleEvent {
  const lead = members[0];
  const first = page.dates[0];
  // If the first session has gone by while tickets are still on sale, the card moves to the next
  // session so it stays on the list.
  const anchor = Math.floor(keyOf(first) / 10000) >= todayKey ? first : null;
  return {
    ...lead,
    uid: `course-${page.key}`,
    sortKey: anchor ? keyOf(anchor) : lead.sortKey,
    day: anchor ? DOW[new Date(utcDay(anchor.y, anchor.mo, anchor.d)).getUTCDay()] : lead.day,
    num: anchor ? String(anchor.d) : lead.num,
    monthLabel: anchor ? `${MONTHS[anchor.mo - 1]} ${anchor.y}` : lead.monthLabel,
    description: "",
    url: lead.url,
    bookLabel: "Book",
    course: courseSummary(page, ticket),
    sessions: members,
  };
}

export type FetchPage = (url: string) => Promise<string | null>;

// Next drops a fetch's abort signal when it refetches a stale cache entry, so the time limit is
// enforced here instead; a slow page then costs only its own entry.
async function fetchBookwhenPage(url: string): Promise<string | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const read = (async () => {
    try {
      const res = await fetch(url, {
        next: { revalidate: BOOKWHEN_REVALIDATE_SECONDS, tags: [BOOKWHEN_CACHE_TAG] },
        headers: { "user-agent": "LasVegasMahjongSchedule/1.0 (+https://www.lasvegasmahj.com/schedule)" },
      });
      return res.ok ? await res.text() : null;
    } catch {
      return null;
    }
  })();
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), 8000);
  });
  const html = await Promise.race([read, timeout]);
  clearTimeout(timer);
  return html;
}

function pacificDayKey(ms: number): number {
  const p = Object.fromEntries(PACIFIC_PARTS.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return Number(p.year) * 10000 + Number(p.month) * 100 + Number(p.day);
}

const dayOf = (e: ScheduleEvent): Day => ({
  y: Math.floor(e.sortKey / 100000000),
  mo: Math.floor(e.sortKey / 1000000) % 100,
  d: Math.floor(e.sortKey / 10000) % 100,
});

// Sessions of one entry share a title and description, so each bucket costs one or two page
// reads instead of one per session. The earliest session is checked first; if it is not a course,
// the latest is checked too, since a course can follow a one-off session with the same details.
// The course's own date list, not the bucket, decides which sessions join a card.
async function findCourses(bucket: ScheduleEvent[], fetchPage: FetchPage) {
  let remaining = [...bucket].sort((a, b) => a.sortKey - b.sortKey);
  const tried = new Set<ScheduleEvent>();
  const found: { page: CoursePage; members: ScheduleEvent[] }[] = [];
  for (;;) {
    const probe = [remaining[0], remaining[remaining.length - 1]].find((e) => e && !tried.has(e));
    if (!probe) break;
    tried.add(probe);
    const html = await fetchPage(probe.url);
    const page = html ? parseBookwhenCoursePage(html, dayOf(probe)) : null;
    if (!page || !page.dates.some((c) => keyOf(c) === probe.sortKey)) continue;
    const members = remaining.filter((e) => page.dates.some((c) => keyOf(c) === e.sortKey));
    remaining = remaining.filter((e) => !members.includes(e));
    found.push({ page, members });
  }
  return { found, rest: remaining };
}

export async function groupCourses(events: ScheduleEvent[], fetchPage: FetchPage, nowMs: number): Promise<ScheduleEvent[]> {
  const todayKey = pacificDayKey(nowMs);
  const feedOrder = new Map(events.map((e, i) => [e, i]));
  const placed: { e: ScheduleEvent; at: number }[] = [];
  const buckets = new Map<string, ScheduleEvent[]>();
  for (const e of events) {
    if (!BOOKWHEN_EVENT_URL.test(e.url)) {
      placed.push({ e, at: feedOrder.get(e)! });
      continue;
    }
    const key = `${e.title}\n${e.description}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(e);
  }

  const results = await Promise.all([...buckets.values()].map((b) => findCourses(b, fetchPage)));
  // Sessions of one course land in different buckets if one session's title or details are
  // edited on their own; the shared ticket brings them back together.
  const courses = new Map<string, { page: CoursePage; members: ScheduleEvent[] }>();
  for (const { found, rest } of results) {
    for (const e of rest) placed.push({ e, at: feedOrder.get(e)! });
    for (const c of found) {
      const seen = courses.get(c.page.key);
      if (seen) seen.members.push(...c.members);
      else courses.set(c.page.key, { page: c.page, members: [...c.members] });
    }
  }

  for (const { page, members } of courses.values()) {
    members.sort((a, b) => a.sortKey - b.sortKey);
    const listed = page.tickets
      .filter((t) => ticketListed(t, page.dates[0], nowMs))
      .sort((a, b) => (a.priceCents ?? Infinity) - (b.priceCents ?? Infinity));
    // Owner's choice: once sales close the course is hidden, with no stray single sessions.
    if (listed.length === 0) continue;
    placed.push({ e: courseCard(page, listed[0], members, todayKey), at: feedOrder.get(members[0])! });
  }

  // Back in feed order, so sessions that start at the same minute keep the order they had.
  return placed.sort((a, b) => a.at - b.at).map((x) => x.e);
}
