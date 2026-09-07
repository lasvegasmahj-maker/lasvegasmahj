import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { STUDIO_MEDIA } from "../lib/studio-media";
import { STUDIO_PHOTOS } from "../lib/studio-photos";

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

/**
 * Visible prose only: imports and JSX expressions are stripped, so an identifier like
 * OPEN_PLAY_SNACKS or a file path cannot be mistaken for a claim the page makes. The
 * amenity and hours rules below are about what a reader is told, not what a symbol is
 * called.
 */
const prose = (rel: string) =>
  readCode(rel)
    .replace(/^import[\s\S]*?;$/gm, "")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/\b[A-Z][A-Z0-9_]{2,}\b/g, " ");

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
    expect(readCode(STUDIO_PAGE)).not.toMatch(/openingHours/i);
    const src = prose(STUDIO_PAGE) + prose(BANNER);
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
    const src = (prose(STUDIO_PAGE) + prose(BANNER)).toLowerCase();
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

  test("alt text describes what is in frame without promising an amenity", () => {
    // The snack station photograph is verified, so describing the station is factual. What
    // the alt text must not do is turn a photograph into a standing offer.
    for (const photo of STUDIO_PHOTOS) {
      const alt = photo.alt.toLowerCase();
      for (const phrase of ["complimentary", "free ", "included", "unlimited", "always available"]) {
        expect(alt, `${photo.src} alt promises an amenity: ${phrase}`).not.toContain(phrase);
      }
    }
  });


  test("every image on a studio surface is one the owner identified", () => {
    // The rule that replaced a bad inference. lib/studio-photos.ts records what the owner
    // said each photograph shows; nothing may appear on these pages unless it is in there.
    const manifest = new Set(STUDIO_PHOTOS.map((p) => p.src));
    for (const file of [STUDIO_PAGE, BANNER]) {
      for (const m of readCode(file).matchAll(/src="(\/[^"]+\.(?:jpg|jpeg|png|webp|avif))"/g)) {
        expect(manifest, `${file} hard codes an image outside the manifest: ${m[1]}`).toContain(m[1]);
      }
      // Every photo is referenced through the manifest, so a raw src is the smell.
      expect(readCode(file)).toContain("@/lib/studio-photos");
    }
  });

  test("the photographs that predate the studio are gone from the repo", () => {
    // Committed 2026-06-12 as "real open-play community photos" (#40), two months before the
    // studio existed here. They were once used as pictures of it. They are not on disk now,
    // so the mistake cannot be repeated by reaching for a familiar filename.
    for (const gone of ["lvm-openplay-room.jpg", "lvm-openplay-social.jpg"]) {
      expect(fs.existsSync(path.join(ROOT, "public", gone)), `${gone} is back`).toBe(false);
    }
    const shipped = [STUDIO_PAGE, BANNER, "app/mahjong-open-play-las-vegas/page.tsx",
                     "app/mahjong-lessons-las-vegas/page.tsx", "app/about/page.tsx"];
    for (const file of shipped) {
      expect(readCode(file), `${file} still references a removed photo`).not.toContain("lvm-openplay");
    }
  });

  test("a room is only named in alt text when the owner identified that room", () => {
    for (const photo of STUDIO_PHOTOS) {
      const named = /Lucky (Wishbone|Sevens)/.exec(photo.alt);
      if (!named) continue;
      expect(photo.room, `${photo.src} names ${named[0]} in alt text with no verified room`).toBeTruthy();
      expect(photo.alt, `${photo.src} alt names a different room than its manifest`).toContain(photo.room!);
    }
  });

  test("every manifest entry is a real file, traceable to an owner original", () => {
    for (const photo of STUDIO_PHOTOS) {
      expect(fs.existsSync(path.join(ROOT, "public", photo.src.slice(1))), photo.src).toBe(true);
      expect(photo.source.trim().length, `${photo.src} has no source filename`).toBeGreaterThan(0);
      expect(photo.shows.trim().length, `${photo.src} does not say what it shows`).toBeGreaterThan(0);
      expect(photo.alt.length, `${photo.src} alt is too short to be useful`).toBeGreaterThan(30);
      expect(photo.width).toBeGreaterThan(0);
      expect(photo.height).toBeGreaterThan(0);
    }
  });

  test("declared dimensions match the files, so nothing shifts as they load", () => {
    // Next reserves the box from these numbers. If a re-encode changes a file and the
    // manifest is not updated, every page using it starts shifting on load.
    for (const photo of STUDIO_PHOTOS) {
      const buf = fs.readFileSync(path.join(ROOT, "public", photo.src.slice(1)));
      let i = 2, dims: [number, number] | null = null;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) break;
        const marker = buf[i + 1];
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          dims = [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
          break;
        }
        i += 2 + buf.readUInt16BE(i + 2);
      }
      expect(dims, `${photo.src} is not a readable JPEG`).not.toBeNull();
      expect(dims![0], `${photo.src} width`).toBe(photo.width);
      expect(dims![1], `${photo.src} height`).toBe(photo.height);
    }
  });

  test("no committed photograph is a phone original", () => {
    // 5712px, multi megabyte files must not reach the repo: they go through sharp first.
    for (const photo of STUDIO_PHOTOS) {
      const bytes = fs.statSync(path.join(ROOT, "public", photo.src.slice(1))).size;
      expect(bytes, `${photo.src} is ${Math.round(bytes / 1024)}KB, too big to commit`).toBeLessThan(700 * 1024);
      expect(Math.max(photo.width, photo.height), `${photo.src} is larger than any layout needs`).toBeLessThanOrEqual(2000);
    }
  });

  test("the venue door is never called a studio entrance", () => {
    const door = STUDIO_PHOTOS.find((p) => p.src.includes("lucky-hare-door"))!;
    expect(door.alt.toLowerCase()).not.toContain("entrance");
    expect(door.shows.toLowerCase()).not.toContain("entrance");
    expect(readCode(STUDIO_PAGE).toLowerCase()).not.toContain("studio entrance");
  });

  test("og:image is a verified studio photograph, and schema photo matches the manifest", () => {
    const src = readCode(STUDIO_PAGE);
    const og = src.match(/images:\s*\[([^\]]*)\]/);
    expect(og, "/studio needs a share image: a page-level openGraph replaces the parent's").not.toBeNull();
    expect(og![1], "the share card should come from the manifest").toContain("WISHBONE_ROOM.src");
    // schema.org photo means "this image depicts this Place", so only room photographs qualify.
    const photoBlock = src.match(/photo:\s*\[([\s\S]*?)\]/);
    expect(photoBlock, "the Place should carry its verified photographs").not.toBeNull();
    for (const ref of ["WISHBONE_ROOM.src", "SEVENS_OPEN_PLAY.src"]) {
      expect(photoBlock![1]).toContain(ref);
    }
  });
});

test.describe("the local news section cannot invent a source", () => {
  test("it renders only when there is a verified segment to show", () => {
    expect(read(STUDIO_PAGE)).toContain("STUDIO_MEDIA.length > 0");
  });

  test("a station is only named when it is one the owner verified", () => {
    // FOX5 is named on this page because two of its segments are in STUDIO_MEDIA, each with
    // the station's own URL. Any other station appearing here would be an unsourced claim.
    const verified = new Set(STUDIO_MEDIA.map((m) => m.outlet));
    const src = readCode(STUDIO_PAGE);
    for (const station of ["KVVU", "KTNV", "KSNV", "KLAS", "Channel 3", "Channel 5", "Channel 8", "Channel 13"]) {
      expect(src, `unverified station named: ${station}`).not.toContain(station);
    }
    if (src.includes("FOX5")) {
      expect(verified, "FOX5 is named without a verified segment behind it").toContain("FOX5 Las Vegas");
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

  test("no page links to /studio more than a couple of times", () => {
    // About is allowed one more than the rest: the credentials card plus the single line of
    // FOX5 credit, which points at the coverage on /studio rather than repeating it.
    const ALLOWANCE: Record<string, number> = { "app/about/page.tsx": 4 };
    for (const file of LINKERS) {
      const hits = read(file).match(/\/studio/g) ?? [];
      expect(hits.length, `${file} over-links /studio`).toBeLessThanOrEqual(ALLOWANCE[file] ?? 2);
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
