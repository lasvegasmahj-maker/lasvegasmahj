import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  groupCourses,
  parseBookwhenCoursePage,
  bookwhenTimeMs,
  pacificIso,
  type ScheduleEvent,
} from "../lib/schedule";
import { buildScheduleEventSchema } from "../lib/schema";

// Course grouping on /schedule. Bookwhen's iCal feed lists every session of a course on its own,
// with nothing tying them together. The fixtures are trimmed copies of the real Bookwhen pages
// (fetched 2026-10-03): the fall daytime league, which sells one course ticket for five dates,
// and Social Open Play, which sells a single ticket per date and must keep one row per date.

const FIX = path.join(__dirname, "fixtures");
const COURSE_HTML = fs.readFileSync(path.join(FIX, "bookwhen-course-event.html"), "utf8");
const SINGLE_HTML = fs.readFileSync(path.join(FIX, "bookwhen-single-event.html"), "utf8");
const NOV_10 = { y: 2026, mo: 11, d: 10 };

const LEAGUE_DESC = "Five weeks of real games with the same group.";
const LEAGUE = [
  ["ev-sh6fg", 2026, 11, 10],
  ["ev-seb5o", 2026, 11, 17],
  ["ev-sdg37", 2026, 12, 1],
  ["ev-sr1pm", 2026, 12, 8],
  ["ev-s25qj", 2026, 12, 15],
] as const;

function session(id: string, title: string, desc: string, y: number, mo: number, d: number, h: number, mi: number, eh: number): ScheduleEvent {
  const stamp = `${y}${String(mo).padStart(2, "0")}${String(d).padStart(2, "0")}${String(h).padStart(2, "0")}${String(mi).padStart(2, "0")}00`;
  return {
    uid: `bwnp-3gqc90ysul98-${id}-${stamp}`,
    title,
    sortKey: y * 100000000 + mo * 1000000 + d * 10000 + h * 100 + mi,
    day: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date(Date.UTC(y, mo - 1, d)).getUTCDay()],
    num: String(d),
    monthLabel: `${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][mo - 1]} ${y}`,
    time: "x",
    room: "Lucky Hare",
    tone: "pink",
    url: `https://bookwhen.com/lasvegasmahjong/e/${id}-${stamp}`,
    bookLabel: "Book",
    description: desc,
    startIso: pacificIso(y, mo, d, h, mi),
    endIso: pacificIso(y, mo, d, eh, mi),
    venueKind: "studio",
    venueName: "Lucky Hare",
  };
}

const league = () => LEAGUE.map(([id, y, mo, d]) => session(id, "Tuesday Fall Daytime League", LEAGUE_DESC, y, mo, d, 11, 0, 13));
const openPlay = () => [
  session("ev-sg7wi", "Social Open Play", "Drop in and play for two hours.", 2026, 10, 13, 17, 30, 19),
  session("ev-sd1yj", "Social Open Play", "Drop in and play for two hours.", 2026, 10, 14, 9, 0, 11),
  session("ev-sgqdq", "Social Open Play", "Drop in and play for two hours.", 2026, 10, 15, 18, 30, 20),
];
const mahj101 = () => [session("ev-sirns", "Mahj 101 with Shauna", "Your first lesson.", 2026, 11, 10, 10, 30, 12)];

// Answers like Bookwhen does: the league sessions' pages carry the course ticket, everything
// else is a single-ticket page. Records which pages were requested.
function fakeBookwhen(opts: { fail?: boolean; course?: string } = {}) {
  const asked: string[] = [];
  const fetchPage = async (url: string) => {
    asked.push(url);
    if (opts.fail) return null;
    return LEAGUE.some(([id]) => url.includes(id)) ? (opts.course ?? COURSE_HTML) : SINGLE_HTML;
  };
  return { fetchPage, asked };
}

const withUntil = (text: string) => COURSE_HTML.replace("Mon 9 Nov 11am", text);
const OCT_3 = Date.parse("2026-10-03T12:00:00-07:00");
const byKey = (a: ScheduleEvent, b: ScheduleEvent) => a.sortKey - b.sortKey;

test.describe("reading a Bookwhen event page", () => {
  test("the league page is a course: shared ticket, five dates, price and sales close", () => {
    const page = parseBookwhenCoursePage(COURSE_HTML, NOV_10);
    expect(page).not.toBeNull();
    expect(page!.key).toBe("ti-euw0-t2d5u");
    expect(page!.tickets).toEqual([
      { id: "ti-euw0-t2d5u", name: "Full season (5 weeks)", priceCents: 15000, availableFrom: null, availableUntil: "Mon 9 Nov 11am", unavailable: false },
    ]);
    expect(page!.dates.map((c) => [c.y, c.mo, c.d, c.h, c.mi, c.eh])).toEqual([
      [2026, 11, 10, 11, 0, 13],
      [2026, 11, 17, 11, 0, 13],
      [2026, 12, 1, 11, 0, 13],
      [2026, 12, 8, 11, 0, 13],
      [2026, 12, 15, 11, 0, 13],
    ]);
  });

  test("a Social Open Play page is not a course", () => {
    expect(parseBookwhenCoursePage(SINGLE_HTML, NOV_10)).toBeNull();
  });

  test("an entry that also sells single-date tickets is not grouped", () => {
    const singleRow = SINGLE_HTML.match(/<tr class="ticket">[\s\S]*?<\/tr>/)![0];
    const mixed = COURSE_HTML.replace("</tbody>", singleRow + "</tbody>");
    expect(parseBookwhenCoursePage(mixed, NOV_10)).toBeNull();
  });

  test("dates with no year use the printed weekday, before or after the first session", () => {
    const first = { y: 2026, mo: 11, d: 10 };
    expect(bookwhenTimeMs("Mon 9 Nov 11am", first)).toBe(Date.parse("2026-11-09T11:00:00-08:00"));
    expect(bookwhenTimeMs("Mon 16 Nov 11am", first)).toBe(Date.parse("2026-11-16T11:00:00-08:00"));
    expect(bookwhenTimeMs("Tue 10 Nov 1pm", first)).toBe(Date.parse("2026-11-10T13:00:00-08:00"));
    expect(bookwhenTimeMs("Tue 29 Dec 6:30pm", { y: 2027, mo: 1, d: 12 })).toBe(Date.parse("2026-12-29T18:30:00-08:00"));
    expect(bookwhenTimeMs("Fri 1 Jan 9am", { y: 2027, mo: 1, d: 12 })).toBe(Date.parse("2027-01-01T09:00:00-08:00"));
    expect(bookwhenTimeMs("Thu 1 Jan 9am", { y: 2027, mo: 1, d: 12 })).toBe(Date.parse("2026-01-01T09:00:00-08:00"));
  });
});

test.describe("grouping on the schedule", () => {
  test("the five league sessions become one card on the first session's date", async () => {
    const { fetchPage } = fakeBookwhen();
    const out = await groupCourses([...openPlay(), ...league(), ...mahj101()], fetchPage, OCT_3);
    const cards = out.filter((e) => e.course);
    expect(cards).toHaveLength(1);
    const card = cards[0];
    expect(card.title).toBe("Tuesday Fall Daytime League");
    expect(card.course).toEqual({
      dayTime: "Tuesdays, 11 AM - 1 PM",
      span: "5 weeks, Nov 10 to Dec 15",
      price: "$150 for the season",
    });
    expect(card.url).toBe("https://bookwhen.com/lasvegasmahjong/e/ev-sh6fg-20261110110000");
    expect(card.bookLabel).toBe("Book");
    expect([card.day, card.num, card.monthLabel]).toEqual(["TUE", "10", "November 2026"]);
    expect(card.sortKey).toBe(202611101100);
    expect(out.filter((e) => e.title === "Tuesday Fall Daytime League")).toHaveLength(1);
  });

  test("Social Open Play and classes come back exactly as they went in", async () => {
    const { fetchPage } = fakeBookwhen();
    const before = [...openPlay(), ...mahj101()];
    const out = await groupCourses([...openPlay(), ...league(), ...mahj101()], fetchPage, OCT_3);
    expect(out.filter((e) => !e.course)).toEqual(before);
    expect(out.filter((e) => e.title === "Social Open Play")).toHaveLength(3);
  });

  test("items that start at the same minute keep their feed order", async () => {
    const { fetchPage } = fakeBookwhen();
    const a = session("ev-aaaaa", "Social Open Play (6:30pm-8:30pm)", "Drop in.", 2026, 10, 15, 18, 30, 20);
    const b = session("ev-bbbbb", "Mahj 101 with Shauna", "Your first lesson.", 2026, 10, 15, 18, 30, 21);
    const c = session("ev-ccccc", "Mahj 101 with Shauna", "Your first lesson.", 2026, 10, 8, 18, 30, 21);
    const input = [a, c, b];
    const out = await groupCourses(input, fetchPage, OCT_3);
    expect(out).toEqual(input);
  });

  test("Bookwhen pages are read once or twice per entry, not once per session", async () => {
    const { fetchPage, asked } = fakeBookwhen();
    await groupCourses([...openPlay(), ...league(), ...mahj101()], fetchPage, OCT_3);
    // League: 1. Open play: first and last session. Class: 1.
    expect(asked).toHaveLength(4);
    expect(asked).toContain("https://bookwhen.com/lasvegasmahjong/e/ev-sh6fg-20261110110000");
  });

  test("after ticket sales close the course is hidden, and nothing else changes", async () => {
    const { fetchPage } = fakeBookwhen();
    const justAfterClose = Date.parse("2026-11-09T11:00:01-08:00");
    const out = await groupCourses([...league(), ...mahj101()], fetchPage, justAfterClose);
    expect(out).toEqual(mahj101());
    const justBefore = Date.parse("2026-11-09T10:59:00-08:00");
    expect((await groupCourses(league(), fetchPage, justBefore)).filter((e) => e.course)).toHaveLength(1);
  });

  test("a sales close after the first session keeps the card until that close", async () => {
    const { fetchPage } = fakeBookwhen({ course: withUntil("Mon 16 Nov 11am") });
    expect((await groupCourses(league(), fetchPage, OCT_3)).filter((e) => e.course)).toHaveLength(1);
    // After the first session, the card moves to the next session still ahead.
    const nov12 = Date.parse("2026-11-12T09:00:00-08:00");
    const later = league().filter((e) => e.sortKey > 202611120000);
    const card = (await groupCourses(later, fetchPage, nov12))[0];
    expect([card.day, card.num, card.course?.span]).toEqual(["TUE", "17", "5 weeks, Nov 10 to Dec 15"]);
    expect(await groupCourses(later, fetchPage, Date.parse("2026-11-16T11:00:00-08:00"))).toEqual([]);
  });

  test("a course not on sale yet stays listed", async () => {
    const notYet = withUntil("Mon 9 Nov 11am")
      .replace('<div class="fact">Available until', '<div class="fact">Available from <span class="">Thu 1 Oct 9am</span></div><div class="fact">Available until')
      .replace("&quot;unavailable&quot;:false", "&quot;unavailable&quot;:true");
    const sept = Date.parse("2026-09-20T12:00:00-07:00");
    expect((await groupCourses(league(), async () => notYet, sept)).filter((e) => e.course)).toHaveLength(1);
  });

  test("Bookwhen marking the ticket unavailable hides the course", async () => {
    const closedHtml = COURSE_HTML.replace("&quot;unavailable&quot;:false", "&quot;unavailable&quot;:true");
    expect(await groupCourses(league(), async () => closedHtml, OCT_3)).toEqual([]);
  });

  test("if Bookwhen pages cannot be read, every session keeps its own row", async () => {
    const { fetchPage } = fakeBookwhen({ fail: true });
    const input = [...openPlay(), ...league(), ...mahj101()];
    expect(await groupCourses(input, fetchPage, OCT_3)).toEqual(input);
  });

  test("a course page that does not list this session's date groups nothing", async () => {
    const other = [session("ev-zzzzz", "Tuesday Fall Daytime League", LEAGUE_DESC, 2027, 1, 5, 11, 0, 13)];
    expect(await groupCourses(other, async () => COURSE_HTML, OCT_3)).toEqual(other);
  });

  test("grouping does not depend on the word League in the title", async () => {
    const renamed = league().map((e) => ({ ...e, title: "Winter Strategy Series" }));
    const out = await groupCourses(renamed, async () => COURSE_HTML, OCT_3);
    expect(out).toHaveLength(1);
    expect(out[0].course?.span).toBe("5 weeks, Nov 10 to Dec 15");
  });

  test("one session edited on its own still joins the same single card", async () => {
    const edited = league();
    edited[4] = { ...edited[4], title: "Tuesday Fall Daytime League: Finals Night", description: "Prizes tonight." };
    const { fetchPage } = fakeBookwhen();
    const out = await groupCourses(edited, fetchPage, OCT_3);
    expect(out).toHaveLength(1);
    expect(out[0].sessions).toHaveLength(5);
    expect(out[0].uid).toBe("course-ti-euw0-t2d5u");
  });

  test("a one-off session with the same details does not hide a course after it", async () => {
    const oneOff = session("ev-oneof", "Tuesday Fall Daytime League", LEAGUE_DESC, 2026, 11, 3, 11, 0, 13);
    const { fetchPage } = fakeBookwhen();
    const out = await groupCourses([oneOff, ...league()], fetchPage, OCT_3);
    expect(out.map((e) => (e.course ? "card" : e.uid))).toEqual([oneOff.uid, "card"]);
  });

  test("labels say weeks only for a weekly run, and flag a session with different hours", async () => {
    const monthly = COURSE_HTML.replace("Tue, 17 Nov &#39;26", "Tue, 5 Jan &#39;27").replace("Tue, 1 Dec &#39;26", "Tue, 2 Feb &#39;27")
      .replace("Tue, 8 Dec &#39;26", "Tue, 2 Mar &#39;27").replace("Tue, 15 Dec &#39;26", "Tue, 6 Apr &#39;27");
    const first = league().slice(0, 1);
    expect((await groupCourses(first, async () => monthly, OCT_3))[0].course?.span).toBe("5 sessions, Nov 10, 2026 to Apr 6, 2027");
    const finals = COURSE_HTML.replace(/(Tue, 15 Dec &#39;26 &nbsp; <span class="time_span">)11am – 1pm/, "$111am – 3pm");
    expect((await groupCourses(league(), async () => finals, OCT_3))[0].course?.dayTime).toBe("Tuesdays, from 11 AM");
  });

  test("the Event schema still lists each league session, unchanged", async () => {
    const { fetchPage } = fakeBookwhen();
    const input = [...openPlay(), ...league(), ...mahj101()];
    const out = await groupCourses(input, fetchPage, OCT_3);
    const sortByStart = (a: { startDate?: string }, b: { startDate?: string }) => String(a.startDate).localeCompare(String(b.startDate));
    const before = buildScheduleEventSchema(input).sort(sortByStart);
    const after = buildScheduleEventSchema(out.flatMap((e) => e.sessions ?? [e])).sort(sortByStart);
    expect(after).toEqual(before);
  });
});

test.describe("how fresh the schedule is", () => {
  test("Bookwhen is re-read every 5 minutes, with one tag for the refresh link", () => {
    const src = fs.readFileSync(path.join(__dirname, "..", "lib", "schedule.ts"), "utf8");
    expect(src).toContain("export const BOOKWHEN_REVALIDATE_SECONDS = 300;");
    expect(src.match(/next: \{ revalidate: BOOKWHEN_REVALIDATE_SECONDS, tags: \[BOOKWHEN_CACHE_TAG\] \}/g)).toHaveLength(2);
    expect(src).not.toMatch(/revalidate: 1800/);
  });
});
