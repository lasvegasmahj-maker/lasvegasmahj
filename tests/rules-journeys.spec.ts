import { test, expect, type Page } from "@playwright/test";

// The live user journeys the owner asked to see after the 2026-08-26 truth-layer cleanup.
// For each question: the Ask answer must state the corrected rule, a "Read more" link may
// appear only when the linked /rules page states the same rule, and every follow-up chip
// must produce a verified answer (never "cannot verify", never a contradiction of the
// journey's rule). Runs at desktop and phone viewports.

type Journey = {
  name: string;
  question: string;
  answer: RegExp;
  contradiction?: RegExp;
  page?: RegExp;
  expectLink: boolean;
  label: RegExp;
};

const JOURNEYS: Journey[] = [
  { name: "joker in a pair", question: "Can I use a joker in a pair?", answer: /never be used in a pair/i, contradiction: /jokers? (can|may) be used in (a )?pair/i, page: /Jokers cannot be used in pairs/, expectLink: true, label: /Standard rule/ },
  { name: "joker in a pung or kong", question: "Can I use a joker in a kong?", answer: /pung|kong/i, contradiction: /cannot substitute in (a )?(pung|kong)/i, page: /Jokers can substitute for any tile in a set of three or more/, expectLink: true, label: /Standard rule/ },
  { name: "joker during the Charleston", question: "Can I pass a joker in the Charleston?", answer: /never pass a joker|may not be passed/i, contradiction: /choose to pass jokers|jokers? (can|may) be passed/i, page: /Jokers may not be passed in the charleston/, expectLink: true, label: /Standard rule/ },
  { name: "stopping the Charleston", question: "Can I stop the Charleston?", answer: /compulsory/i, contradiction: /before the first across/i, page: /compulsory/, expectLink: false, label: /Pending instructor review/ },
  { name: "blind pass", question: "What is a blind pass?", answer: /First Left/i, contradiction: /across' pass/i, page: /First Left and, if a second Charleston is played, Last Right/, expectLink: true, label: /Standard rule/ },
  { name: "closed hand calling its winning tile", question: "Can a closed hand call the last tile for mahjong?", answer: /completes your mahjong/i, contradiction: /cannot call any discards/i, page: /any tile except a joker may be called for mahjong, even for a concealed hand/, expectLink: true, label: /Standard rule/ },
  { name: "changing an exposure", question: "Can I change my exposure after I call?", answer: /up until you discard/i, contradiction: /cannot call and then decide/i, page: /up until you discard/, expectLink: false, label: /Pending instructor review/ },
  { name: "false mahjong", question: "What happens if I call mahjong by mistake?", answer: /no penalty/i, contradiction: /set by house rules/i, page: /play continues with no penalty/, expectLink: false, label: /Pending instructor review/ },
  { name: "jokerless hand", question: "Does a jokerless hand pay double?", answer: /Singles and Pairs/i, contradiction: /no exception/i, page: /The one exception is Singles and Pairs hands/, expectLink: false, label: /Pending instructor review/ },
  { name: "printed digits", question: "What do the numbers on the card mean?", answer: /tile's number/i, contradiction: /tell you how many identical tiles/i, page: /A digit printed in a hand on the card is usually the tile's number/, expectLink: false, label: /Pending instructor review/ },
  { name: "unknown rule", question: "What happens if my elbow knocks over the rack?", answer: /cannot verify/i, expectLink: false, label: /Not verified/ },
  { name: "house-rule question", question: "How does payment work in a wall game?", answer: /house rule/i, page: /wall game/i, expectLink: true, label: /Can vary by house rule/ },
];

async function askOnPage(page: Page, question: string) {
  const input = page.getByLabel("Your American Mahjong rules question");
  const answers = page.locator(".ask-turn-answer:not(.ask-thinking)");
  const before = await answers.count();
  await input.fill(question);
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  await expect(answers).toHaveCount(before + 1);
  return answers.nth(before);
}

JOURNEYS.forEach((j, index) => {
  test(`journey: ${j.name}`, async ({ page, request, isMobile }) => {
    await page.goto("/ask");
    const card = await askOnPage(page, j.question);
    const text = (await card.locator(".ask-answer-text").textContent()) ?? "";
    expect(text, `${j.name}: answer`).toMatch(j.answer);
    if (j.contradiction) expect(text, `${j.name}: contradiction`).not.toMatch(j.contradiction);
    await expect(card.locator(".ask-label")).toHaveText(j.label);

    const link = card.locator(".ask-note", { hasText: "Read more" }).locator("a[href^='/rules']");
    expect(await link.count(), `${j.name}: Read more link presence`).toBe(j.expectLink ? 1 : 0);
    if (j.expectLink && j.page) {
      const href = (await link.getAttribute("href"))!;
      const html = await (await request.get(href)).text();
      expect(html, `${j.name}: linked page ${href} agrees`).toMatch(j.page);
      if (j.contradiction) expect(html, `${j.name}: linked page still contradicts`).not.toMatch(j.contradiction);
    }

    // Every follow-up chip must lead to a verified answer that does not contradict this rule.
    const chips = card.locator(".ask-followups .ask-chip");
    const chipCount = await chips.count();
    for (let i = 0; i < chipCount && i < 3; i++) {
      const label = (await card.locator(".ask-followups .ask-chip").nth(i).textContent())!.trim();
      const res = await request.post("/api/ask", { data: { question: label }, headers: { "x-forwarded-for": `203.0.113.${(isMobile ? 120 : 60) + index}` } });
      const body = await res.json();
      expect(body.ok, `${j.name}: chip "${label}"`).toBe(true);
      expect(body.kind, `${j.name}: chip "${label}" is verified`).toBe("answer");
      if (j.contradiction) expect(String(body.answer), `${j.name}: chip "${label}" contradicts`).not.toMatch(j.contradiction);
    }

    if (isMobile) {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      const viewport = page.viewportSize()!;
      const composer = (await page.locator(".ask-composer").boundingBox())!;
      expect(composer.y + composer.height).toBeLessThanOrEqual(viewport.height + 1);
    }
  });
});

test("the corrected /rules pages no longer carry the old wording", async ({ request }) => {
  const checks: Array<[string, RegExp[], RegExp[]]> = [
    ["/rules/charleston", [/Jokers may not be passed/, /compulsory/, /First Left and, if a second Charleston is played, Last Right/, /0, 1, 2, or 3 tiles/], [/choose to pass jokers/, /before the first across pass/, /during the 'across' pass/, /After both charlestons are complete/]],
    ["/rules/the-card", [/any tile except a joker may be called for mahjong/, /usually the tile's number/], [/you cannot call any discards/, /tell you how many identical tiles/]],
    ["/rules/jokers", [/The one exception is Singles and Pairs hands/, /called tile itself must be a real tile/], [/at least one real matching tile/]],
    ["/rules/calling-tiles", [/up until you discard/, /except a discarded joker/, /on top of their rack/], [/cannot call and then decide/, /any order of play/, /using the numbers 3, 4, 5, and 6/]],
    ["/rules/dead-hands", [/too few or too many tiles/, /right up until you discard/], [/False mahjong also results in a dead hand/, /group may agree to correct it/]],
    ["/rules/winning", [/play continues with no penalty/, /It depends on whether you exposed/, /other than a joker/], [/set by house rules but typically/, /match what you declared/]],
    ["/rules/scoring", [/4 times the value of the hand/, /The one exception is Singles and Pairs/], [/does not designate specific multipliers/]],
    ["/rules/etiquette", [/picked a tile from the wall and racked it/, /named correctly/], [/Once the next player has drawn/, /The moment a tile is set down/]],
    ["/learn-mahjong", [/key defines a Pair as 2 like tiles/], [/uses numbers to describe the structure/]],
  ];
  for (const [path, must, mustNot] of checks) {
    const html = await (await request.get(path)).text();
    for (const re of must) expect(html, `${path} should say ${re}`).toMatch(re);
    for (const re of mustNot) expect(html, `${path} still says ${re}`).not.toMatch(re);
  }
});
