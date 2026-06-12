// Root-cause diagnosis + permanent fix for sideways image bug.
// Uses sharp (the SAME library Next's image optimizer uses) so the diagnosis
// reflects exactly what the production optimizer sees.
const path = require("path");
const sharp = require(path.join(
  __dirname,
  "..",
  "node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"
));

const PUB = path.join(__dirname, "..", "public");
const DL = path.join(process.env.HOME, "Downloads");

// public file  <-  original source in Downloads
const FIX = [
  { pub: "lvm-teaching-action.jpg", src: path.join(DL, "IMG_5418.jpeg") },
  { pub: "lvm-private-game.jpg", src: path.join(DL, "IMG_4930.jpeg") },
];
const ALL_PUB = [
  "lvm-lesson-group.jpg",
  "lvm-teaching-action.jpg",
  "lvm-community-group.jpg",
  "lvm-private-game.jpg",
  "lvm-social-toast.jpg",
];

async function meta(label, file) {
  try {
    const m = await sharp(file).metadata();
    // width/height = stored pixel dims (NOT auto-rotated).
    // orientation = EXIF tag (1 = upright/none; 6/8 = needs 90° rotation).
    const oriented = m.orientation && m.orientation >= 5
      ? `${m.height}x${m.width} (after orient)`
      : `${m.width}x${m.height}`;
    console.log(
      `${label.padEnd(26)} stored=${m.width}x${m.height} orientation=${m.orientation ?? "none"} -> displays ${oriented}`
    );
    return m;
  } catch (e) {
    console.log(`${label.padEnd(26)} ERROR ${e.message}`);
  }
}

(async () => {
  console.log("=== DIAGNOSIS: current public/ files (what optimizer ingests) ===");
  for (const f of ALL_PUB) await meta(f, path.join(PUB, f));

  console.log("\n=== DIAGNOSIS: original source files in ~/Downloads ===");
  for (const f of FIX) await meta(path.basename(f.src), f.src);

  console.log("\n=== APPLYING FIX: bake orientation into pixels, normalize tag ===");
  for (const f of FIX) {
    const out = path.join(PUB, f.pub);
    // .rotate() with NO args = auto-orient from EXIF, then the orientation tag
    // is reset to 1 and pixels are physically upright. Resize longest side to
    // 1800 (portrait target ~1350x1800). Strip metadata so nothing downstream
    // can re-misinterpret it.
    const info = await sharp(f.src)
      .rotate()
      .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out + ".tmp");
    require("fs").renameSync(out + ".tmp", out);
    const after = await sharp(out).metadata();
    console.log(
      `FIXED ${f.pub.padEnd(24)} now stored=${after.width}x${after.height} orientation=${after.orientation ?? "none"}`
    );
  }
  console.log("\nDONE");
})();
