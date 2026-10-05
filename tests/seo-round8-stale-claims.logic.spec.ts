import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Round 8: cleaned up the stale/unsourced claims the Round 5 handoff listed under
// "Still open (outside this PR's scope, owner's call)" on the homepage, Summerlin,
// Henderson, the parties page and the sitewide footer. Each block pins one fix so a
// future session does not reintroduce the claim it replaced.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const page = (route: string) => `app${route}/page.tsx`;

test.describe("homepage: NMJL card answer distinguishes lessons from Open Play", () => {
  test("faq.tsx no longer offers a blanket card promise", () => {
    const src = read("components/faq.tsx");
    expect(src).not.toMatch(/otherwise we.?ll have extras/i);
    expect(src).toMatch(/Social Open Play.*bring your own current NMJL card/i);
  });
});

test.describe("homepage: Open Play room card matches the operating facts", () => {
  test("studio-banner.tsx no longer invites every level to Open Play", () => {
    const src = read("components/studio-banner.tsx");
    expect(src).not.toMatch(/every level/i);
    expect(src).toMatch(/already\s+know the game/i);
  });
});

test.describe("homepage: private events teaser drops the invented capacity claim", () => {
  test("private-events.tsx no longer promises any size", () => {
    const src = read("components/private-events.tsx");
    expect(src).not.toMatch(/groups of any size/i);
    expect(src).toContain("Venues across the Valley or your location");
  });
});

test.describe("homepage: inquiry pop-up drops the unsourced response time", () => {
  test("inquiry-modal.tsx no longer promises 24 hours", () => {
    expect(read("components/inquiry-modal.tsx")).not.toMatch(/24 hours/);
  });
});

test.describe("sitewide footer: open play, leagues and tournaments are studio-only", () => {
  test("footer.tsx scopes them to the studio, not the whole Valley", () => {
    const src = read("components/footer.tsx");
    expect(src).toContain("open play events, leagues, and tournaments at");
    expect(src).toMatch(/open play events, leagues, and tournaments at[\s\S]*?our studio/);
    expect(src).toMatch(/mahjong lessons[\s\S]*?and private events serving/);
  });
});

test.describe("Summerlin and Henderson lesson pages", () => {
  test("neither promises a 24-hour reply", () => {
    expect(read(page("/mahjong-lessons-summerlin"))).not.toMatch(/24 hours/);
    expect(read(page("/mahjong-lessons-henderson"))).not.toMatch(/24 hours/);
  });

  test("Summerlin no longer claims we bring everything", () => {
    expect(read(page("/mahjong-lessons-summerlin"))).not.toMatch(/we bring everything/i);
  });

  test("Henderson Open Play is at the studio, not across the Valley", () => {
    const src = read(page("/mahjong-lessons-henderson"));
    expect(src).not.toMatch(/open play events across the Las Vegas Valley/i);
    expect(src).toMatch(/open play at our studio/i);
  });
});

test.describe("parties page drops the unsourced capacity and furniture claims", () => {
  test("no invented size ceiling or floor in metadata", () => {
    const src = read(page("/mahjong-parties-las-vegas"));
    expect(src).not.toMatch(/any size group/i);
  });

  test("no invented 50-person threshold in the group-size FAQ", () => {
    const src = read(page("/mahjong-parties-las-vegas"));
    expect(src).not.toMatch(/50\+/);
  });

  test("Girls' Night Out no longer claims we bring everything", () => {
    expect(read(page("/mahjong-parties-las-vegas"))).not.toMatch(/we bring everything/i);
  });
});
