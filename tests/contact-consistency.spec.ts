import { test, expect, type Page } from "@playwright/test";

// Real browser behaviour for the contact consistency cleanup, on desktop and on a phone.
// No submission ever leaves the browser: every Formspree call is intercepted and the
// assertions are made against the captured payload.

const ENDPOINT = "https://formspree.io/**";

function parseMultipart(body: string) {
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n--/g)) out[m[1]] = m[2];
  return out;
}

/** Open the homepage inquiry modal the way a visitor does. */
async function openModal(page: Page) {
  await page.goto("/");
  const cta = page.getByRole("button", { name: "Plan Your Event", exact: true }).first();
  await expect(cta).toBeVisible();
  await cta.click();
  await expect(page.locator(".modal-content")).toBeVisible();
}

test.describe("phone is required on /contact", () => {
  test("the field is a real phone control with a mobile keypad", async ({ page }) => {
    await page.goto("/contact");
    const phone = page.locator("#contact-phone");
    await expect(phone).toBeVisible();
    await expect(phone).toHaveAttribute("type", "tel");
    await expect(phone).toHaveAttribute("name", "phone");
    await expect(phone).toHaveAttribute("inputmode", "tel");
    await expect(phone).toHaveAttribute("autocomplete", "tel");
    await expect(page.locator('label[for="contact-phone"]')).toHaveText("Phone Number *");
    expect(await phone.evaluate((el: HTMLInputElement) => el.required)).toBe(true);
  });

  test("submitting with no phone is blocked and sends nothing", async ({ page }) => {
    let posted = false;
    await page.route(ENDPOINT, async (route) => {
      posted = true;
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/contact");
    await page.fill("#contact-name", "No Phone");
    await page.fill("#contact-email", "nophone@example.com");
    await page.selectOption("#contact-inquiry", "Something Else");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Message Sent!")).toHaveCount(0);
    expect(posted, "a submission escaped without a phone number").toBe(false);
  });

  test("the phone number reaches the payload exactly as typed", async ({ page }) => {
    let payload: Record<string, string> | null = null;
    await page.route(ENDPOINT, async (route) => {
      payload = parseMultipart(route.request().postData() ?? "");
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/contact?source=corporate");
    await page.fill("#contact-name", "Phone Test");
    await page.fill("#contact-email", "phone@example.com");
    await page.fill("#contact-phone", "(702) 555-1212");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Message Sent!")).toBeVisible();
    const sent = payload as unknown as Record<string, string>;
    expect(sent.phone).toBe("(702) 555-1212");
    // Round 3 behaviour must survive: attribution and the qualifying fields still ride along.
    expect(sent.source).toBe("Corporate Events page");
    expect(sent.inquiry_type).toBe("Corporate or Team Building");
  });
});

test.describe("phone validation accepts how people actually type", () => {
  const ACCEPTED = ["7025551212", "702-555-1212", "(702) 555-1212", "+1 702 555 1212", "702.555.1212"];
  const REJECTED = ["555", "70255512", "abc", "(702) 555-121"];

  for (const value of ACCEPTED) {
    test(`accepts ${value}`, async ({ page }) => {
      await page.goto("/contact");
      await page.fill("#contact-phone", value);
      const valid = await page.locator("#contact-phone").evaluate((el: HTMLInputElement) => {
        el.dispatchEvent(new Event("blur"));
        return el.checkValidity();
      });
      expect(valid, `${value} should be accepted`).toBe(true);
    });
  }

  for (const value of REJECTED) {
    test(`rejects ${value}`, async ({ page }) => {
      await page.goto("/contact");
      await page.fill("#contact-phone", value);
      const valid = await page.locator("#contact-phone").evaluate((el: HTMLInputElement) => el.checkValidity());
      expect(valid, `${value} should be rejected`).toBe(false);
    });
  }

  test("an empty phone gets the browser's own required message, not a format complaint", async ({ page }) => {
    await page.goto("/contact");
    const msg = await page.locator("#contact-phone").evaluate((el: HTMLInputElement) => {
      el.value = "";
      el.dispatchEvent(new Event("input"));
      return { custom: el.validationMessage, valueMissing: el.validity.valueMissing };
    });
    expect(msg.valueMissing).toBe(true);
    expect(msg.custom.toLowerCase()).not.toContain("area code");
  });
});

test.describe("a blank phone cannot slip through", () => {
  test("a value of only whitespace is rejected", async ({ page }) => {
    // `required` is satisfied by a string of spaces, so if validation trims before deciding,
    // nothing catches it and a lead arrives with no way to phone them back.
    await page.goto("/contact");
    for (const blank of ["   ", "\t ", " \n "]) {
      const res = await page.locator("#contact-phone").evaluate((el: HTMLInputElement, v: string) => {
        el.value = v;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        return { valid: el.checkValidity(), missing: el.validity.valueMissing };
      }, blank);
      expect(res.valid, `${JSON.stringify(blank)} should be rejected`).toBe(false);
    }
  });

  test("a whitespace phone does not submit", async ({ page }) => {
    let posted = 0;
    await page.route(ENDPOINT, async (route) => {
      posted++;
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/contact");
    await page.fill("#contact-name", "Whitespace Test");
    await page.fill("#contact-email", "ws@example.com");
    await page.selectOption("#contact-inquiry", "Something Else");
    await page.locator("#contact-phone").evaluate((el: HTMLInputElement) => {
      el.value = "   ";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.getByRole("button", { name: "Send Message" }).click();
    await page.waitForTimeout(800);
    expect(posted, "a blank phone number reached the inbox").toBe(0);
    await expect(page.getByText("Message Sent!")).toHaveCount(0);
  });

  test("a value set without firing input or blur is still caught at submit", async ({ page }) => {
    // Autofill and back-navigation restore both do this. Without a re-check on submit the
    // custom validity is stale and an unusable number posts.
    let posted = 0;
    await page.route(ENDPOINT, async (route) => {
      posted++;
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/contact");
    await page.fill("#contact-name", "Restored Value");
    await page.fill("#contact-email", "restored@example.com");
    await page.selectOption("#contact-inquiry", "Something Else");
    await page.locator("#contact-phone").evaluate((el: HTMLInputElement) => {
      el.value = "555";
    });
    await page.getByRole("button", { name: "Send Message" }).click();
    await page.waitForTimeout(800);
    expect(posted, "a stale-validity phone number reached the inbox").toBe(0);
  });

  test("a real number still submits after the extra checking", async ({ page }) => {
    let payload: Record<string, string> | null = null;
    await page.route(ENDPOINT, async (route) => {
      payload = parseMultipart(route.request().postData() ?? "");
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await page.goto("/contact");
    await page.fill("#contact-name", "Good Number");
    await page.fill("#contact-email", "good@example.com");
    await page.fill("#contact-phone", "+1 702 555 1212");
    await page.selectOption("#contact-inquiry", "Private Lesson");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Message Sent!")).toBeVisible();
    expect((payload as unknown as Record<string, string>).phone).toBe("+1 702 555 1212");
  });
});

test.describe("the homepage Plan Your Event flow", () => {
  test("the CTA wording and the modal heading are unchanged", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Plan Your Event", exact: true }).first()).toBeVisible();
    await openModal(page);
    await expect(page.locator(".modal-content h3")).toContainText("Book a");
    await expect(page.locator(".modal-label")).toHaveText("Let\u2019s Play");
  });

  test("it still requires a phone number", async ({ page }) => {
    await openModal(page);
    const phone = page.locator("#contact-phone");
    await expect(phone).toBeVisible();
    expect(await phone.evaluate((el: HTMLInputElement) => el.required)).toBe(true);
  });

  test("it asks the same questions as /contact", async ({ page }) => {
    await openModal(page);
    for (const id of ["contact-name", "contact-email", "contact-phone", "contact-inquiry", "contact-group-size", "contact-date", "contact-message"]) {
      await expect(page.locator(`#${id}`), id).toBeVisible();
    }
  });

  test("a homepage lead is attributed and shaped like every other lead", async ({ page }) => {
    let payload: Record<string, string> | null = null;
    await page.route(ENDPOINT, async (route) => {
      payload = parseMultipart(route.request().postData() ?? "");
      await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await openModal(page);
    await page.fill("#contact-name", "Homepage Lead");
    await page.fill("#contact-email", "home@example.com");
    await page.fill("#contact-phone", "702-555-1212");
    await page.selectOption("#contact-inquiry", "Private Party or Celebration");
    await page.selectOption("#contact-group-size", "9-20 people");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("on my radar")).toBeVisible();
    const sent = payload as unknown as Record<string, string>;
    expect(sent.source).toBe("Homepage Plan Your Event");
    expect(sent.phone).toBe("702-555-1212");
    expect(sent.inquiry_type).toBe("Private Party or Celebration");
    expect(sent.group_size).toBe("9-20 people");
    // The retired vocabulary must not come back.
    expect(sent.first_name).toBeUndefined();
    expect(sent.interest).toBeUndefined();
    expect(sent.dates).toBeUndefined();
  });

  test("closing and reopening starts from a clean form", async ({ page }) => {
    await openModal(page);
    await page.fill("#contact-name", "Half Typed");
    await page.locator(".modal-close").click();
    await expect(page.locator(".modal-content")).toHaveCount(0);
    await page.getByRole("button", { name: "Plan Your Event", exact: true }).first().click();
    await expect(page.locator("#contact-name")).toHaveValue("");
  });
});

test.describe("the dropdowns look like dropdowns", () => {
  for (const id of ["contact-inquiry", "contact-group-size"]) {
    test(`${id} shows a caret and does not overflow`, async ({ page }) => {
      await page.goto("/contact");
      const el = page.locator(`#${id}`);
      const style = await el.evaluate((n) => {
        const c = getComputedStyle(n);
        return { image: c.backgroundImage, padRight: parseFloat(c.paddingRight), repeat: c.backgroundRepeat };
      });
      expect(style.image, `${id} has no caret`).toContain("data:image/svg+xml");
      expect(style.repeat).toBe("no-repeat");
      // Room for the caret, so the longest option cannot run underneath it.
      expect(style.padRight).toBeGreaterThan(32);

      const box = await el.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
    });
  }

  test("the page still does not scroll sideways", async ({ page }) => {
    await page.goto("/contact");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });
});

test.describe("public email and no published phone", () => {
  test("hello@ is shown and mailto links point at it", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('a[href="mailto:hello@lasvegasmahj.com"]').first()).toBeVisible();
    const html = await page.content();
    expect(html).not.toContain("lasvegasmahj@gmail.com");
  });

  test("no sitemap page publishes a phone number or the old address", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || "/");
    expect(paths.length).toBeGreaterThan(20);
    for (const p of paths) {
      const html = await (await request.get(p)).text();
      expect(html, `${p} publishes a phone number`).not.toMatch(/847[.\s-]?609[.\s-]?3112|href="tel:/);
      expect(html, `${p} declares a telephone`).not.toContain('"telephone"');
      expect(html, `${p} still shows the gmail address`).not.toContain("lasvegasmahj@gmail.com");
    }
  });
});
