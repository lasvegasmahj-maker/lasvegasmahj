import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import {
  groupCourses,
  parseBookwhenCoursePage,
  courseSalesCloseMs,
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
function fakeBookwhen(opts: { fail?: boolean } = {}) {
  const asked: string[] = [];
  const fetchPage = async (url: string) => {
    asked.push(url);
    if (opts.fail) return null;
    return LEAGUE.some(([id]) => url.includes(id)) ? COURSE_HTML : SINGLE_HTML;
  };
  return { fetchPage, asked };
}

const OCT_3 = Date.parse("2026-10-03T12:00:00-07:00");

test.describe("reading a Bookwhen event page", () => {
  test("the league page is a course: shared ticket, five dates, price and sales close", () => {
    const page = parseBookwhenCoursePage(COURSE_HTML, 2026);
    expect(page).not.toBeNull();
    expect(page!.ticketId).toBe("ti-euw0-t2d5u");
    expect(page!.ticketName).toBe("Full season (5 weeks)");
    expect(page!.priceCents).toBe(15000);
    expect(page!.availableUntil).toBe("Mon 9 Nov 11am");
    expect(page!.unavailable).toBe(false);
    expect(page!.dates.map((c) => [c.y, c.mo, c.d, c.h, c.mi, c.eh])).toEqual([
      [2026, 11, 10, 11, 0, 13],
      [2026, 11, 17, 11, 0, 13],
      [2026, 12, 1, 11, 0, 13],
      [2026, 12, 8, 11, 0, 13],
      [2026, 12, 15, 11, 0, 13],
    ]);
  });

  test("a Social Open Play page is not a course", () => {
    expect(parseBookwhenCoursePage(SINGLE_HTML, 2026)).toBeNull();
  });

  test("sales close resolves to Pacific standard time on the right year", () => {
    const page = parseBookwhenCoursePage(COURSE_HTML, 2026)!;
    expect(courseSalesCloseMs("Mon 9 Nov 11am", page.dates[0])).toBe(Date.parse("2026-11-09T11:00:00-08:00"));
    // A January course whose sales close in December belongs to the year before.
    expect(courseSalesCloseMs("Tue 29 Dec 6:30pm", { y: 2027, mo: 1, d: 12, h: 18, mi: 0 })).toBe(
      Date.parse("2026-12-29T18:30:00-08:00"),
    );
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
    const rest = out.filter((e) => !e.course).sort((a, b) => a.sortKey - b.sortKey);
    expect(rest).toEqual(before.sort((a, b) => a.sortKey - b.sortKey));
    expect(rest.filter((e) => e.title === "Social Open Play")).toHaveLength(3);
  });

  test("one Bookwhen page is read per entry, not per session", async () => {
    const { fetchPage, asked } = fakeBookwhen();
    await groupCourses([...openPlay(), ...league(), ...mahj101()], fetchPage, OCT_3);
    expect(asked).toHaveLength(3);
    expect(asked).toContain("https://bookwhen.com/lasvegasmahjong/e/ev-sh6fg-20261110110000");
  });

  test("after ticket sales close the course is hidden, and nothing else changes", async () => {
    const { fetchPage } = fakeBookwhen();
    const justAfterClose = Date.parse("2026-11-09T11:00:01-08:00");
    const out = await groupCourses([...league(), ...mahj101()], fetchPage, justAfterClose);
    expect(out.some((e) => e.title === "Tuesday Fall Daytime League")).toBe(false);
    expect(out).toEqual(mahj101());
    const justBefore = Date.parse("2026-11-09T10:59:00-08:00");
    expect((await groupCourses(league(), fetchPage, justBefore)).filter((e) => e.course)).toHaveLength(1);
  });

  test("Bookwhen marking the ticket unavailable also hides the course", async () => {
    const closedHtml = COURSE_HTML.replace(/&quot;unavailable&quot;:false/, "&quot;unavailable&quot;:true");
    const out = await groupCourses(league(), async () => closedHtml, OCT_3);
    expect(out).toEqual([]);
  });

  test("if Bookwhen pages cannot be read, every session keeps its own row", async () => {
    const { fetchPage } = fakeBookwhen({ fail: true });
    const input = [...openPlay(), ...league(), ...mahj101()];
    const out = await groupCourses(input, fetchPage, OCT_3);
    expect(out.sort((a, b) => a.sortKey - b.sortKey)).toEqual(input.sort((a, b) => a.sortKey - b.sortKey));
  });

  test("a course page that does not list this session's date groups nothing", async () => {
    const other = [session("ev-zzzzz", "Tuesday Fall Daytime League", LEAGUE_DESC, 2027, 1, 5, 11, 0, 13)];
    const out = await groupCourses(other, async () => COURSE_HTML, OCT_3);
    expect(out).toEqual(other);
  });

  test("grouping does not depend on the word League in the title", async () => {
    const renamed = league().map((e) => ({ ...e, title: "Winter Strategy Series" }));
    const out = await groupCourses(renamed, async () => COURSE_HTML, OCT_3);
    expect(out).toHaveLength(1);
    expect(out[0].course?.span).toBe("5 weeks, Nov 10 to Dec 15");
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
    // Both Bookwhen reads (the feed and the course pages) use the shared interval and tag.
    expect(src.match(/next: \{ revalidate: BOOKWHEN_REVALIDATE_SECONDS, tags: \[BOOKWHEN_CACHE_TAG\] \}/g)).toHaveLength(2);
    expect(src).not.toMatch(/revalidate: 1800/);
  });
});
