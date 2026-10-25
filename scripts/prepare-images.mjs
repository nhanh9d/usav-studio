// Builds the optimized images in public/images from the source files kept in the parent folder.
// Run with: node scripts/prepare-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.resolve(root, "..");
const out = path.join(root, "public", "images");

const photos = [
  ["1790999784608_3613982287463112965_3613982287463112965_e6f07f1cc508687c79ce601e6ced96d2.jpg", "heat-poster.jpg", 1080],
  ["619242481_1943006909629118_1352863441197146791_n.jpg", "breakout-poster.jpg", 1080],
  ["1791001250683_1773655972436308415_3613982287463112965_051ba21a8fed3f2bbac01d8b332ebd37.jpg", "event-invite.jpg", 908],
  ["616319250_728093703487616_6243634774770388212_n.jpg", "control-room.jpg", 1920],
  ["620640131_865615439564171_6715009125288657000_n.jpg", "control-room-wide.jpg", 1600],
  ["619340830_1508159183601906_1550882271756118439_n.jpg", "production-crew.jpg", 1200],
  ["617506970_888710213860665_5120415342125440905_n.jpg", "scoreboard-desk.jpg", 1200],
  ["618720866_1278801310737489_9068419631671225837_n.jpg", "community-event.jpg", 1600],
  ["605516367_855942450622533_3266730225477404213_n.jpg", "recap-card.jpg", 1600],
];

await mkdir(out, { recursive: true });

for (const [file, name, width] of photos) {
  await sharp(path.join(src, file))
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, name));
  console.log("wrote", name);
}

// The logo is navy on white; turn it into a white mark on transparent for the dark theme.
const trimmed = await sharp(path.join(src, "z7593000894148_09857e3f8c7c756891c2108c6f5420b9.jpg"))
  .trim({ threshold: 20 })
  .toBuffer();
const { width, height } = await sharp(trimmed).metadata();
// Two passes: sharp applies linear() before negate() within a single pipeline, which would leave the mark translucent.
const inverted = await sharp(trimmed).greyscale().negate().png().toBuffer();
const alpha = await sharp(inverted).linear(1.5, -12).extractChannel(0).raw().toBuffer();
if (alpha.length !== width * height) throw new Error(`logo alpha is ${alpha.length} bytes, expected ${width * height}`);
const logo = await sharp({
  create: { width, height, channels: 3, background: "#ffffff" },
})
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png()
  .toBuffer();
await sharp(logo).resize({ width: 800 }).toFile(path.join(out, "logo-white.png"));
console.log("wrote logo-white.png");

// Same mark in the brand navy for the light theme.
const logoNavy = await sharp({ create: { width, height, channels: 3, background: "#22387c" } })
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png()
  .toBuffer();
await sharp(logoNavy).resize({ width: 800 }).toFile(path.join(out, "logo-navy.png"));
console.log("wrote logo-navy.png");

// Link-preview image (Facebook, Zalo, etc.). Some placements crop to a centered square,
// so the logo and tagline stay inside the middle 630px.
const shareLogo = await sharp(logo).resize({ width: 520 }).toBuffer();
const shareLogoHeight = (await sharp(shareLogo).metadata()).height;
const shareLogoTop = Math.round((630 - shareLogoHeight) / 2) - 60;
const shareText = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect x="570" y="${shareLogoTop + shareLogoHeight + 34}" width="60" height="4" fill="#1fe894"/>
    <text x="600" y="${shareLogoTop + shareLogoHeight + 84}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
      font-size="24" font-weight="700" letter-spacing="3" fill="#dfe5f3">TOURNAMENT ORGANIZER</text>
    <text x="600" y="${shareLogoTop + shareLogoHeight + 120}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
      font-size="24" font-weight="700" letter-spacing="3" fill="#dfe5f3">GAMING CONTENT STUDIO</text>
  </svg>`,
);
await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#0b1230" } })
  .composite([
    { input: shareLogo, left: Math.round((1200 - 520) / 2), top: shareLogoTop },
    { input: shareText, left: 0, top: 0 },
  ])
  .png()
  .toFile(path.join(root, "public", "og-image.png"));
console.log("wrote og-image.png");

// App icon: just the wordmark (without the "studio" line) on the brand navy.
const mark = await sharp(logo)
  .extract({ left: 0, top: 0, width, height: Math.round(height * 0.68) })
  .resize({ width: 208, height: 208, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();
await sharp({ create: { width: 256, height: 256, channels: 4, background: "#16286b" } })
  .composite([{ input: mark }])
  .png()
  .toFile(path.join(root, "src", "app", "icon.png"));
console.log("wrote icon.png");
