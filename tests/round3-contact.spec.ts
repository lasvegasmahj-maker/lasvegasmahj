import { test, expect, type Page } from "@playwright/test";

// What a real browser does with the Round 3 contact form, on a desktop and on a phone.
// Nothing here sends a real message: every Formspree call is intercepted, and the assertions
// are made against the intercepted payload, which is the only way to prove the attribution
// marker actually rides along with the submission.

const ENDPOINT = "https://formspree.io/**";

// Every tagged CTA, the slug it carries, and the label that slug must become in the inbox.
const SOURCES = [
  { path: "/mahjong-corporate-las-vegas", slug: "corporate", label: "Corporate Events page", inquiry: "Corporate or Team Building", cta: "Request a Quote" },
  { path: "/corporate-team-building-las-vegas", slug: "team-building", label: "Corporate Team Building page", inquiry: "Corporate or Team Building", cta: "Request a Quote" },
  { path: "/conference-activities-las-vegas", slug: "conference", label: "Conference Activities page", inquiry: "Conference or Convention", cta: "Request a Quote" },
  { path: "/convention-activities-las-vegas", slug: "convention", label: "Convention Activities page", inquiry: "Conference or Convention", cta: "Request a Quote" },
  { path: "/mahjong-parties-las-vegas", slug: "parties", label: "Private Parties page", inquiry: "Private Party or Celebration", cta: "Plan Your Event" },
  { path: "/private-mahjong-lessons-las-vegas", slug: "private-lessons", label: "Private Lessons page", inquiry: "Private Lesson", cta: "Ask About a Private Lesson" },
];

/** Pull the submitted fields out of the intercepted multipart body. */
function parseMultipart(body: string) {
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n--/g)) out[m[1]] = m[2];
  return out;
}

/**
 * Fill and submit the form, returning what would have been sent. The route is installed
 * before navigation so no request can escape to Formspree.
 */
async function submit(page: Page, url: string, fill: (p: Page) => Promise<void> = async () => {}) {
  let payload: Record<string, string> | null = null;
  await page.route(ENDPOINT, async (route) => {
    payload = parseMultipart(route.request().postData() ?? "");
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
  await page.goto(url);
  await page.fill("#contact-name", "Round 3 Test");
  await page.fill("#contact-email", "round3@example.com");
  await fill(page);
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Message Sent!")).toBeVisible();
  expect(payload, "the form never posted").not.toBeNull();
  return payload as unknown as Record<string, string>;
}

test.describe("the form asks the questions that qualify a lead", () => {
  test("all six visible fields render and are labelled", async ({ page }) => {
    await page.goto("/contact");
    const expected: [string, string][] = [
      ["#contact-name", "Your Name *"],
      ["#contact-email", "Email Address *"],
      ["#contact-inquiry", "What Can We Help With? *"],
      ["#contact-group-size", "Group Size"],
      ["#contact-date", "Preferred Date"],
      ["#contact-message", "Tell Us More"],
    ];
    for (const [selector, label] of expected) {
      await expect(page.locator(selector), selector).toBeVisible();
      const id = selector.slice(1);
      await expect(page.locator(`label[for="${id}"]`), `${id} label`).toHaveText(label);
    }
  });

  test("the inquiry types offered are the real service lines", async ({ page }) => {
    await page.goto("/contact");
    const values = await page.locator("#contact-inquiry option").allTextContents();
    expect(values).toEqual([
      "Select one...",
      "Private Lesson",
      "Group Lesson or Class",
      "Private Party or Celebration",
      "Corporate or Team Building",
      "Conference or Convention",
      "Charity or Fundraiser",
      "Something Else",
    ]);
  });

  test("group size offers ranges that fit a lesson through a convention", async ({ page }) => {
    await page.goto("/contact");
    const values = await page.locator("#contact-group-size option").allTextContents();
    expect(values).toEqual(["Not sure yet", "Just me", "2-3 people", "4-8 people", "9-20 people", "21-50 people", "50+ people"]);
  });

  test("no phone field exists and no phone number is published", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('input[type="tel"]')).toHaveCount(0);
    await expect(page.locator('[name="phone"]')).toHaveCount(0);
    await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
    const html = await page.content();
    expect(html).not.toContain('"telephone"');
    expect(html).not.toMatch(/847[.\s-]?609[.\s-]?3112/);
  });
});

test.describe("validation asks for only what is needed", () => {
  test("name, email and inquiry type are required; the rest are not", async ({ page }) => {
    await page.goto("/contact");
    for (const id of ["contact-name", "contact-email", "contact-inquiry"]) {
      expect(await page.locator(`#${id}`).evaluate((el: HTMLInputElement) => el.required), id).toBe(true);
    }
    for (const id of ["contact-group-size", "contact-date", "contact-message"]) {
      expect(await page.locator(`#${id}`).evaluate((el: HTMLInputElement) => el.required), id).toBe(false);
    }
  });

  test("submitting without an inquiry type is blocked and sends nothing", async ({ page }) => {
    let posted = false;
    await page.route(ENDPOINT, async (route) => {
      posted = true;
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/contact");
    await page.fill("#contact-name", "No Type");
    await page.fill("#contact-email", "notype@example.com");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Message Sent!")).toHaveCount(0);
    expect(posted, "a submission escaped without an inquiry type").toBe(false);
  });

  test("a lead with only the required fields still sends", async ({ page }) => {
    const sent = await submit(page, "/contact", async (p) => {
      await p.selectOption("#contact-inquiry", "Something Else");
    });
    expect(sent.inquiry_type).toBe("Something Else");
    expect(sent.name).toBe("Round 3 Test");
    expect(sent.email).toBe("round3@example.com");
  });

  test("every optional field reaches the inbox when filled", async ({ page }) => {
    const sent = await submit(page, "/contact", async (p) => {
      await p.selectOption("#contact-inquiry", "Private Party or Celebration");
      await p.selectOption("#contact-group-size", "9-20 people");
      await p.fill("#contact-date", "2027-03-14");
      await p.fill("#contact-message", "Birthday party for my mother.");
    });
    expect(sent.inquiry_type).toBe("Private Party or Celebration");
    expect(sent.group_size).toBe("9-20 people");
    expect(sent.preferred_date).toBe("2027-03-14");
    expect(sent.message).toBe("Birthday party for my mother.");
  });
});

test.describe("an optional date can never hold the form hostage", () => {
  test("a half typed date does not block the submit", async ({ page }) => {
    // A partially typed date leaves the control in badInput. Constraint validation fails on
    // it, the browser blocks the submit, and onSubmit never fires, so the lead is lost on an
    // OPTIONAL field. This is the regression guard for that.
    const sent = await submit(page, "/contact?source=corporate", async (p) => {
      await p.locator("#contact-date").click();
      await p.keyboard.type("1114");
      expect(await p.locator("#contact-date").evaluate((el: HTMLInputElement) => el.validity.badInput)).toBe(true);
    });
    expect(sent.source).toBe("Corporate Events page");
    expect(sent.preferred_date ?? "").toBe("");
  });

  test("a mistyped year is dropped instead of reaching the inbox", async ({ page }) => {
    // Typing 111426 resolves to 0026-11-14, which the browser considers perfectly valid.
    const sent = await submit(page, "/contact?source=parties", async (p) => {
      await p.locator("#contact-date").click();
      await p.keyboard.type("111426");
      await p.locator("#contact-name").click();
      await expect(p.locator("#contact-date")).toHaveValue("");
    });
    expect(sent.preferred_date ?? "").toBe("");
  });

  test("a real future date still comes through untouched", async ({ page }) => {
    const sent = await submit(page, "/contact", async (p) => {
      await p.selectOption("#contact-inquiry", "Private Lesson");
      await p.fill("#contact-date", "2027-11-14");
      await p.locator("#contact-name").click();
    });
    expect(sent.preferred_date).toBe("2027-11-14");
  });
});

test.describe("source attribution rides along with the submission", () => {
  for (const s of SOURCES) {
    test(`?source=${s.slug} arrives as "${s.label}" and prefills the inquiry type`, async ({ page }) => {
      await page.goto(`/contact?source=${s.slug}`);
      // Prefilled, not locked: the visitor can still change it.
      await expect(page.locator("#contact-inquiry")).toHaveValue(s.inquiry);
      const sent = await submit(page, `/contact?source=${s.slug}`);
      expect(sent.source).toBe(s.label);
      expect(sent.inquiry_type).toBe(s.inquiry);
    });
  }

  test("a bare /contact reports general traffic and prefills nothing", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#contact-inquiry")).toHaveValue("");
    const sent = await submit(page, "/contact", async (p) => {
      await p.selectOption("#contact-inquiry", "Group Lesson or Class");
    });
    expect(sent.source).toBe("General (nav, footer or direct)");
  });

  test("an unknown source falls back rather than being forwarded", async ({ page }) => {
    const sent = await submit(page, "/contact?source=not-a-real-page", async (p) => {
      await p.selectOption("#contact-inquiry", "Something Else");
    });
    expect(sent.source).toBe("General (nav, footer or direct)");
  });

  test("query text cannot be injected into the inbox", async ({ page }) => {
    const hostile = encodeURIComponent('<script>alert(1)</script>https://evil.example');
    const sent = await submit(page, `/contact?source=${hostile}`, async (p) => {
      await p.selectOption("#contact-inquiry", "Something Else");
    });
    expect(sent.source).toBe("General (nav, footer or direct)");
    expect(sent.source).not.toContain("script");
    expect(sent.source).not.toContain("evil.example");
  });

  test("the visitor is never shown the raw attribution value", async ({ page }) => {
    await page.goto("/contact?source=corporate");
    const text = await page.locator("main").innerText();
    expect(text).not.toContain("source=");
    expect(text).not.toContain("Corporate Events page");
    await expect(page.locator('input[name="source"]')).toBeHidden();
  });
});

test.describe("the tagged CTAs land where they claim", () => {
  for (const s of SOURCES) {
    test(`${s.path}: its CTA carries ?source=${s.slug}`, async ({ page }) => {
      await page.goto(s.path);
      const cta = page.getByRole("link", { name: s.cta, exact: true }).first();
      await expect(cta).toBeVisible();
      // The visible label is Round 2's and must not have changed.
      await expect(cta).toHaveText(s.cta);
      await cta.click();
      await page.waitForURL(/\/contact(\?|$)/);
      const url = new URL(page.url());
      expect(url.pathname).toBe("/contact");
      expect(url.searchParams.get("source")).toBe(s.slug);
      await expect(page.locator("#contact-inquiry")).toHaveValue(s.inquiry);
    });
  }

  test("every tagged CTA on every page uses its page's own slug", async ({ request }) => {
    for (const s of SOURCES) {
      const html = await (await request.get(s.path)).text();
      // Button CTAs only. The nav and footer links on the same page are bare on purpose.
      const hrefs = [...html.matchAll(/<a[^>]*href="(\/contact[^"]*)"[^>]*class="btn-/g)].map((m) => m[1]);
      expect(hrefs.length, `${s.path} has no /contact CTA`).toBeGreaterThan(0);
      for (const href of hrefs) expect(href, s.path).toBe(`/contact?source=${s.slug}`);
      // And the shared nav/footer links on this page are still untagged.
      const bare = [...html.matchAll(/<a href="(\/contact[^"]*)"(?![^>]*class="btn-)/g)].map((m) => m[1]);
      expect(bare, `${s.path} nav/footer`).toEqual(["/contact", "/contact"]);
    }
  });

  test("the nav and footer links stay bare", async ({ page }) => {
    await page.goto("/mahjong-corporate-las-vegas");
    await expect(page.locator('nav a[href="/contact"]')).toHaveCount(1);
    await expect(page.locator('footer a[href="/contact"]')).toHaveCount(1);
  });
});

test.describe("the source tagged URL is a normal page", () => {
  test("it returns 200 with no redirect and the clean canonical", async ({ request }) => {
    const res = await request.get("/contact?source=corporate", { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('<link rel="canonical" href="https://www.lasvegasmahj.com/contact"/>');
    expect(html.toLowerCase()).not.toContain("noindex");
  });

  test("the form is in the prerendered HTML, not injected after hydration", async ({ request }) => {
    // A Suspense boundary around useSearchParams would replace the form with a bailout
    // marker here. This is the assertion that catches that regression.
    const html = await (await request.get("/contact")).text();
    expect(html).not.toContain("BAILOUT_TO_CLIENT_SIDE_RENDERING");
    for (const id of ["contact-name", "contact-email", "contact-inquiry", "contact-group-size", "contact-date", "contact-message"]) {
      expect(html, `${id} missing from the static HTML`).toContain(`id="${id}"`);
    }
    expect(html).toContain('name="source"');
  });
});

test.describe("the form works on a phone", () => {
  test("group size and preferred date stack instead of squeezing", async ({ page, isMobile }) => {
    await page.goto("/contact");
    const size = await page.locator("#contact-group-size").boundingBox();
    const date = await page.locator("#contact-date").boundingBox();
    expect(size).not.toBeNull();
    expect(date).not.toBeNull();
    if (isMobile) {
      expect(date!.y, "the two controls should stack on a phone").toBeGreaterThan(size!.y + size!.height - 1);
    } else {
      expect(Math.abs(date!.y - size!.y), "the two controls should sit side by side").toBeLessThan(4);
    }
  });

  test("no control overflows the viewport", async ({ page }) => {
    await page.goto("/contact");
    const width = page.viewportSize()!.width;
    for (const id of ["contact-name", "contact-email", "contact-inquiry", "contact-group-size", "contact-date", "contact-message"]) {
      const box = await page.locator(`#${id}`).boundingBox();
      expect(box, id).not.toBeNull();
      expect(box!.x, `${id} starts off screen`).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width, `${id} runs past the viewport`).toBeLessThanOrEqual(width + 1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });

  test("a full inquiry can be completed end to end", async ({ page }) => {
    const sent = await submit(page, "/contact?source=parties", async (p) => {
      await p.selectOption("#contact-group-size", "21-50 people");
      await p.fill("#contact-message", "Sent from a phone viewport.");
    });
    expect(sent.source).toBe("Private Parties page");
    expect(sent.inquiry_type).toBe("Private Party or Celebration");
    expect(sent.group_size).toBe("21-50 people");
  });
});
