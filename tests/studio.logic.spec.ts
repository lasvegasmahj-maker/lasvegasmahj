import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { STUDIO_MEDIA } from "../lib/studio-media";

// The studio is a physical place, so the risk here is not a broken build, it is shipping a
// claim nobody can source. These tests hold the honesty line: no hours, no phone, no price,
// no invented amenity, no station attribution, and no photo captioned as a room we cannot
// identify. They also guard the two pages that already rank, which must come through this
// change untouched.

const ROOT = path.join(__dirname, "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");

// Comments explain why a claim is absent, so they must not be searched for the claim itself.
// The line form is anchored to the start of a line so an https:// inside a string survives.
const readCode = (rel: string) =>
  read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

const STUDIO_PAGE = "app/studio/page.tsx";
const BANNER = "components/studio-banner.tsx";
const NEW_COPY = [STUDIO_PAGE, BANNER, "lib/studio-media.ts"];

test.describe("the studio route", () => {
  test("there is exactly one studio page, at /studio", () => {
    expect(fs.existsSync(path.join(ROOT, STUDIO_PAGE))).toBe(true);
    const rivals = fs
      .readdirSync(path.join(ROOT, "app"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && /studio/.test(d.name))
      .map((d) => d.name);
    expect(rivals, "a second studio route would split the destination").toEqual(["studio"]);
  });

  test("the descriptive slug is reserved by a 301, not by a second page", () => {
    const cfg = read("next.config.ts");
    expect(cfg).toContain('source: "/mahjong-studio-las-vegas"');
    expect(cfg).toContain('destination: "/studio"');
    const block = cfg.slice(cfg.indexOf('"/mahjong-studio-las-vegas"'));
    expect(block.slice(0, 200)).toContain("statusCode: 301");
  });

  test("the sitemap lists /studio once", () => {
    const sitemap = read("app/sitemap.ts");
    const hits = sitemap.match(/https:\/\/www\.lasvegasmahj\.com\/studio"/g) ?? [];
    expect(hits).toHaveLength(1);
  });

  test("it declares its own canonical, because the root layout sets none", () => {
    expect(read(STUDIO_PAGE)).toContain('canonical: "https://www.lasvegasmahj.com/studio"');
  });
});

test.describe("metadata sits inside the limits that matter", () => {
  test("the rendered title stays under 60 characters", () => {
    const title = read(STUDIO_PAGE).match(/^\s*title: "([^"]+)"/m)![1];
    // app/layout.tsx appends this via metadata.title.template.
    const rendered = `${title} | Las Vegas Mahjong`;
    expect(rendered.length, rendered).toBeLessThan(60);
    expect(title.toLowerCase()).toContain("studio");
  });

  test("the meta description is a usable length", () => {
    const desc = read(STUDIO_PAGE).match(/description:\s*\n?\s*"([^"]+)"/)![1];
    expect(desc.length).toBeGreaterThanOrEqual(120);
    expect(desc.length).toBeLessThanOrEqual(160);
  });
});

test.describe("nothing unsourceable ships", () => {
  test("no phone number appears on the studio page or in its schema", () => {
    for (const file of NEW_COPY) {
      const src = readCode(file);
      expect(src, `${file} names a telephone property`).not.toMatch(/telephone/i);
      expect(src, `${file} contains a phone number`).not.toMatch(/\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/);
    }
  });

  test("no price appears: the studio page is not a lesson page", () => {
    for (const file of NEW_COPY) {
      expect(readCode(file), `${file} states a price`).not.toMatch(/\$\s?\d/);
    }
  });

  test("no operating hours are implied", () => {
    const src = readCode(STUDIO_PAGE) + readCode(BANNER);
    expect(src).not.toMatch(/openingHours/i);
    for (const phrase of [
      "walk in",
      "walk-in",
      "drop in anytime",
      "open daily",
      "seven days",
      "stop by anytime",
    ]) {
      expect(src.toLowerCase(), `implies retail hours: ${phrase}`).not.toContain(phrase);
    }
  });

  test("no amenity, capacity or superlative is claimed", () => {
    const src = (readCode(STUDIO_PAGE) + readCode(BANNER)).toLowerCase();
    for (const phrase of [
      "free parking",
      "ample parking",
      "plenty of parking",
      "snacks",
      "complimentary",
      "wifi",
      "wi-fi",
      "the only mahjong studio",
      "first mahjong studio",
      "largest mahjong",
      "premier mahjong studio",
    ]) {
      expect(src, `unsourceable claim: ${phrase}`).not.toContain(phrase);
    }
  });

  test("no photo is captioned as a named room, now or when one arrives", () => {
    // No image on disk is identifiably Lucky Wishbone or Lucky Sevens, so no alt text or
    // caption may assert which room a picture shows.
    for (const file of [STUDIO_PAGE, BANNER]) {
      for (const m of read(file).matchAll(/alt="([^"]*)"/g)) {
        expect(m[1], `alt text names a room: ${m[1]}`).not.toMatch(/Lucky (Wishbone|Sevens)/);
      }
      for (const m of read(file).matchAll(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/g)) {
        expect(m[1], "caption names a room").not.toMatch(/Lucky (Wishbone|Sevens)/);
      }
    }
  });

  test("no image on the studio surfaces claims to show the studio", () => {
    // public/lvm-openplay-room.jpg and lvm-openplay-social.jpg were committed on 2026-06-12
    // as "real open-play community photos" (#40), two months before the studio appears in
    // this repo, and their EXIF is stripped. Nothing here shows either was taken inside the
    // studio, so the studio surfaces carry no photography until the owner supplies one that
    // is verified. This fails the moment any image is put back without that evidence.
    for (const file of [STUDIO_PAGE, BANNER]) {
      const imgs = [...readCode(file).matchAll(/src="(\/[^"]+\.(?:jpg|jpeg|png|webp|avif))"/g)].map((m) => m[1]);
      expect(imgs, `${file} presents an unverified image as the studio`).toEqual([]);
      expect(readCode(file), `${file} still imports next/image`).not.toContain("next/image");
    }
  });

  test("the open play photos are not claimed as the studio anywhere else either", () => {
    const OPEN_PLAY_PHOTOS = ["/lvm-openplay-room.jpg", "/lvm-openplay-social.jpg"];
    const src = readCode(STUDIO_PAGE) + readCode(BANNER);
    for (const photo of OPEN_PLAY_PHOTOS) {
      expect(src, `an open play photo is used as studio imagery: ${photo}`).not.toContain(photo);
    }
    // They keep their home on the open play page, which is what they actually show.
    const openPlay = readCode("app/mahjong-open-play-las-vegas/page.tsx");
    for (const photo of OPEN_PLAY_PHOTOS) {
      expect(openPlay, `${photo} should still be on the open play page`).toContain(photo);
    }
  });

  test("neither og:image nor schema.org photo asserts a picture of the studio", () => {
    const src = readCode(STUDIO_PAGE);
    expect(src, "schema.org photo asserts an image depicts the Place").not.toMatch(/\bphoto:/);
    expect(src, "og:image points at an unverified studio picture").not.toMatch(/images:\s*\[/);
  });
});

test.describe("the local news section cannot invent a source", () => {
  test("it renders only when there is a verified segment to show", () => {
    expect(read(STUDIO_PAGE)).toContain("STUDIO_MEDIA.length > 0");
  });

  test("no station name is hard coded into the page", () => {
    const src = readCode(STUDIO_PAGE);
    for (const station of ["FOX", "KVVU", "KTNV", "KSNV", "KLAS", "Channel 3", "Channel 5", "Channel 8", "Channel 13"]) {
      expect(src, `hard coded station: ${station}`).not.toContain(station);
    }
  });

  test("every entry that does ship carries a station hosted link", () => {
    for (const item of STUDIO_MEDIA) {
      expect(item.outlet.trim().length, "outlet is required").toBeGreaterThan(0);
      expect(item.headline.trim().length, "headline is required").toBeGreaterThan(0);
      expect(item.publishedIso, "air date must be YYYY-MM-DD").toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(item.url, "the segment must live on the outlet's own https page").toMatch(/^https:\/\//);
      expect(item.url, "we link to the station, we do not re-host video")
        .not.toMatch(/lasvegasmahj\.com/);
    }
  });
});

test.describe("house style", () => {
  test("no em dash, en dash or emoji in the new copy", () => {
    for (const file of NEW_COPY) {
      const src = readCode(file);
      expect(src, `${file} contains an em dash`).not.toMatch(/—/);
      expect(src, `${file} contains an en dash`).not.toMatch(/–/);
      expect(src, `${file} contains an emoji`).not.toMatch(/\p{Extended_Pictographic}/u);
    }
  });

  test("the public email is the only one published", () => {
    for (const file of NEW_COPY) {
      const src = read(file);
      expect(src).not.toContain("shauna@lasvegasmahj.com");
      expect(src).not.toContain("lasvegasmahj@gmail.com");
    }
    expect(read(STUDIO_PAGE)).toContain("hello@lasvegasmahj.com");
  });
});

test.describe("schema reuses the entities that already exist", () => {
  test("the page imports the shared Place instead of writing a new address", () => {
    const src = read(STUDIO_PAGE);
    expect(src).toContain("STUDIO_PLACE");
    expect(src, "a second address block would create a rival entity")
      .not.toContain('streetAddress: "8687');
  });

  test("it points at the sitewide business id rather than redefining it", () => {
    const src = read(STUDIO_PAGE);
    expect(src).toContain('"@id": "https://www.lasvegasmahj.com/#business"');
    expect(src).toContain('location: { "@id": "https://www.lasvegasmahj.com/#studio" }');
    // Redefining the business address or founder here is what creates conflicting duplicates.
    expect(src).not.toContain("hasOfferCatalog");
    expect(src).not.toContain("founder:");
  });

  test("no Course entity: that belongs to the lessons page", () => {
    expect(read(STUDIO_PAGE)).not.toContain('"@type": "Course"');
  });
});

test.describe("the pages that already rank are untouched", () => {
  test("the homepage hero keeps its H1, and the studio section sits below it", () => {
    const hero = read("components/hero.tsx");
    expect(hero).toContain('<span className="line1">Las Vegas</span>');
    expect(hero).toContain('<span className="line2">Mahjong</span>');
    expect(hero).toContain("Our studio inside Lucky Hare on West Sahara is home base for the Las");

    const home = read("components/home-client.tsx");
    const hIdx = home.indexOf("<Hero />");
    const sIdx = home.indexOf("<StudioBanner />");
    const wIdx = home.indexOf("<WhySection />");
    expect(hIdx).toBeGreaterThan(-1);
    expect(sIdx, "the studio section goes directly under the hero").toBeGreaterThan(hIdx);
    expect(sIdx, "and before Our Why").toBeLessThan(wIdx);
  });

  test("the homepage title and canonical are unchanged", () => {
    expect(read("app/page.tsx")).toContain('canonical: "https://www.lasvegasmahj.com"');
    expect(read("app/layout.tsx")).toContain('"Las Vegas Mahjong | Lessons, Events & Open Play"');
  });

  test("the lessons page keeps its H1, title and canonical", () => {
    const src = read("app/mahjong-lessons-las-vegas/page.tsx");
    expect(src).toContain('title: "Mahjong Lessons in Las Vegas"');
    expect(src).toContain('canonical: "https://www.lasvegasmahj.com/mahjong-lessons-las-vegas"');
    expect(src).toContain('Mahjong <span className="accent-pink">Lessons</span> in Las Vegas');
  });

  test("the studio page does not restate the lessons page's course catalogue", () => {
    const src = read(STUDIO_PAGE);
    // One handoff link is the point. Repeating the course breakdown is cannibalisation.
    expect(src).not.toContain("MAHJ102");
    expect(src).not.toContain("MAHJ103");
    const lessonLinks = [...src.matchAll(/href="\/mahjong-lessons-las-vegas"/g)];
    expect(lessonLinks, "link out to lessons exactly once").toHaveLength(1);
  });
});

test.describe("internal linking is deliberate, not stuffed", () => {
  const LINKERS = [
    "components/nav.tsx",
    "components/footer.tsx",
    "components/studio-banner.tsx",
    "app/schedule/page.tsx",
    "app/about/page.tsx",
    "app/contact/page.tsx",
    "app/mahjong-lessons-las-vegas/page.tsx",
    "app/mahjong-open-play-las-vegas/page.tsx",
  ];

  for (const file of LINKERS) {
    test(`${file} links to /studio`, () => {
      expect(read(file)).toMatch(/["{]\/studio["}]|href="\/studio"/);
    });
  }

  test("no page links to /studio more than twice", () => {
    for (const file of LINKERS) {
      const hits = read(file).match(/\/studio/g) ?? [];
      expect(hits.length, `${file} over-links /studio`).toBeLessThanOrEqual(2);
    }
  });

  test("the nav gives Studio a top level slot, above About", () => {
    const nav = read("components/nav.tsx");
    expect(nav.indexOf('href="/studio"')).toBeLessThan(nav.indexOf('href="/about"'));
    // The existing items all survive.
    for (const href of ["/about", "/schedule", "/mahjong-lessons-las-vegas", "/ask", "/#shop", "/mahjong-parties-las-vegas", "/mahjong-corporate-las-vegas", "/contact"]) {
      expect(nav, `nav lost ${href}`).toContain(`href="${href}"`);
    }
  });
});

test("the homepage inquiry modal carries the owner's new heading", () => {
  const modal = read("components/inquiry-modal.tsx");
  expect(modal).toContain("Plan Your Mahjong");
  expect(modal).not.toContain("Book a <span");
  // Everything else about the shared form is untouched.
  expect(modal).toContain('source="Homepage Plan Your Event"');
  expect(modal).toContain("<ContactForm");
});
