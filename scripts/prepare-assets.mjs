/**
 * Turns the character renders in ../assets into web-ready images.
 *
 *   npm run assets
 *
 * Sources (4096×6144 cut-outs, transparent background):
 *   A1-standing.png     the main pose (both hands on the phone)
 *   A3-eyes-closed.png  the same pose with closed eyes, for the blink
 *   A5-wave-hd.png      the waving pose, for Contact
 *
 * Outputs (committed, so the build never needs the 9 MB originals). Every file
 * name carries a hash of its contents (avatar-3f9a1c2e.webp), so a new export
 * always gets a new URL and no browser, CDN or Next.js image cache can mix an
 * old file with a new one. The names are written to the manifest.
 *   public/images/avatar/avatar-*.webp             full body, 2000px tall (Next.js re-encodes to AVIF)
 *   public/images/avatar/avatar-hd-{2800,4000}-*.{avif,webp}
 *                                                   sharper copies for the camera's close-ups;
 *                                                   the page loads only the size the screen needs
 *   public/images/avatar/eyes-*.webp               closed-eyes patch for the blink (two soft ovals), at HD scale
 *   public/images/avatar/wave-*.webp               the waving pose, 1200px tall
 *   public/images/avatar/close-{id}-*.{avif,webp}  phone close-ups (head, phone, shoulders, sneakers)
 *   src/content/generated/avatar.json              file names, sizes + where the eyes sit (in %)
 */
import { createHash } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const assetsDir = path.resolve(root, "..", "assets");
const outDir = path.join(root, "public", "images", "avatar");
const manifestPath = path.join(root, "src", "content", "generated", "avatar.json");

const SOURCE = {
  standing: path.join(assetsDir, "A1-standing.png"),
  eyesClosed: path.join(assetsDir, "A3-eyes-closed.png"),
  wave: path.join(assetsDir, "A5-wave-hd.png"),
};

/** Height the base avatar is exported at (2x the largest on-screen size). */
const OUTPUT_HEIGHT = 2000;
/**
 * HD heights. The closest zoom (the head, ~4.7x) needs about 3,600px on a
 * 1440×900 screen; most laptops need far less, so they get the smaller file.
 */
const HD_HEIGHTS = [2800, 4000];
/** The waving pose only appears at card size. */
const WAVE_HEIGHT = 1200;
/** Transparent breathing room kept around the trimmed figure, in source px. */
const PAD = 40;

/**
 * "Eyes closed" was rendered separately, so it is slightly smaller and offset.
 * Measured by matching the head (hair, ears, jaw, eyes excluded): scale it by
 * 1.03, then shift it by (dx, dy) to sit exactly on "standing".
 */
const EYES_ALIGN = { scale: 1.03, dx: -72, dy: -60 };
/**
 * The blink patch is two soft ovals, one per eye (source px on "standing"). Each is
 * solid over the open eye (INNER) and fades out by OUTER, so its edge falls on the
 * eyelid skin: clear of the brows (which sit 16px lower in "eyes closed") and of the
 * sideburns (shaped differently in the two renders), where a seam would show.
 * The right eye mirrors the left across the face's centre line.
 */
const EYES = [
  { cx: 1800, cy: 1190 },
  { cx: 2247, cy: 1190 },
];
const EYE_INNER = { rx: 128, ry: 92 };
const EYE_OUTER = { rx: 178, ry: 116 };
/** Patch bounds, derived from the ovals. */
const EYE_PATCH = {
  left: Math.min(...EYES.map((e) => e.cx)) - EYE_OUTER.rx,
  top: EYES[0].cy - EYE_OUTER.ry,
  width: Math.max(...EYES.map((e) => e.cx)) - Math.min(...EYES.map((e) => e.cx)) + EYE_OUTER.rx * 2,
  height: EYE_OUTER.ry * 2,
};
/** Skin under each eye (source px on "standing"), used to match the two renders' skin tone. */
const CHEEKS = [
  { left: 1700, top: 1330, width: 120, height: 50 },
  { left: 2240, top: 1330, width: 120, height: 50 },
];

/**
 * Phone close-ups: one still crop per story stop, shown at the top of its card.
 * Each is designed for a CLOSE_FRAME-sized window (CSS px) over the figure drawn
 * `width` px wide, with the figure's top-left corner at (left, top). Numbers come
 * from the approved Mobile Body Map canvas. Exported at up to 3x for sharp phones.
 */
const CLOSE_FRAME = { width: 358, height: 240 };
const CLOSE_UPS = [
  { id: "about", width: 260, left: 49, top: 8 },
  { id: "work", width: 770, left: -221, top: -779 },
  { id: "stack", width: 900, left: -10, top: -740 },
  { id: "experience", width: 420, left: -31, top: -976 },
];
const CLOSE_MAX_DENSITY = 3;

/** Bounding box of everything with alpha > 20, plus PAD, clamped to the image. */
async function figureBox(file) {
  const { data, info } = await sharp(file).extractChannel("alpha").raw().toBuffer({ resolveWithObject: true });
  let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  const left = Math.max(0, minX - PAD);
  const top = Math.max(0, minY - PAD);
  return {
    left,
    top,
    width: Math.min(info.width, maxX + PAD) - left,
    height: Math.min(info.height, maxY + PAD) - top,
  };
}

/** Average RGB of the CHEEKS boxes in an image (raw RGBA), in its own pixel coordinates offset by (dx, dy). */
async function cheekTone(image, dx = 0, dy = 0) {
  const sum = [0, 0, 0];
  let n = 0;
  for (const c of CHEEKS) {
    const { data } = await sharp(image)
      .extract({ left: c.left - dx, top: c.top - dy, width: c.width, height: c.height })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 3) {
      sum[0] += data[i];
      sum[1] += data[i + 1];
      sum[2] += data[i + 2];
      n++;
    }
  }
  return sum.map((v) => v / n);
}

/** The closed eyes: two soft ovals from the aligned blink frame, toned to match "standing". */
async function eyePatch() {
  const meta = await sharp(SOURCE.eyesClosed).metadata();
  if (!meta.width || !meta.height) throw new Error("Could not read the eyes-closed size");
  const scaled = await sharp(SOURCE.eyesClosed)
    .resize(Math.round(meta.width * EYES_ALIGN.scale), Math.round(meta.height * EYES_ALIGN.scale))
    .png()
    .toBuffer();
  const target = await cheekTone(SOURCE.standing);
  const current = await cheekTone(scaled, EYES_ALIGN.dx, EYES_ALIGN.dy);
  const tone = target.map((v, c) => v / current[c]);

  const { left, top, width, height } = EYE_PATCH;
  const raw = await sharp(scaled)
    .extract({ left: left - EYES_ALIGN.dx, top: top - EYES_ALIGN.dy, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = left + x;
      const py = top + y;
      // Solid inside an eye's inner oval, fading to nothing at its outer oval (smoothstep).
      let alpha = 0;
      for (const e of EYES) {
        const inner = Math.hypot((px - e.cx) / EYE_INNER.rx, (py - e.cy) / EYE_INNER.ry);
        const outer = Math.hypot((px - e.cx) / EYE_OUTER.rx, (py - e.cy) / EYE_OUTER.ry);
        let k;
        if (inner <= 1) k = 1;
        else if (outer >= 1) k = 0;
        else {
          const t = (1 - outer) / (1 - outer + (inner - 1));
          k = t * t * (3 - 2 * t);
        }
        alpha = Math.max(alpha, k);
      }
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) raw[i + c] = Math.min(255, Math.round(raw[i + c] * tone[c]));
      raw[i + 3] = Math.round(raw[i + 3] * alpha);
    }
  }
  return sharp(raw, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

/** Writes `buffer` as `<base>-<hash>.<ext>` and returns its public URL. */
async function save(buffer, base, ext) {
  const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
  const name = `${base}-${hash}.${ext}`;
  await writeFile(path.join(outDir, name), buffer);
  return `/images/avatar/${name}`;
}

async function main() {
  // Start clean: every run replaces the whole folder, so no stale file lingers.
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });

  const crop = await figureBox(SOURCE.standing);
  const figure = () => sharp(SOURCE.standing).extract(crop);

  const src = await save(
    await figure().resize({ height: OUTPUT_HEIGHT }).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toBuffer(),
    "avatar",
    "webp",
  );

  const hd = [];
  for (const height of HD_HEIGHTS) {
    const h = Math.min(height, crop.height);
    hd.push({
      height,
      avif: await save(await figure().resize({ height: h }).avif({ quality: 60, effort: 5 }).toBuffer(), `avatar-hd-${height}`, "avif"),
      webp: await save(await figure().resize({ height: h }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toBuffer(), `avatar-hd-${height}`, "webp"),
    });
  }

  // The blink patch, exported at the largest HD scale so it stays sharp in close-ups.
  const hdScale = Math.min(Math.max(...HD_HEIGHTS), crop.height) / crop.height;
  const eyesSrc = await save(
    await sharp(await eyePatch())
      .resize({ width: Math.round(EYE_PATCH.width * hdScale), height: Math.round(EYE_PATCH.height * hdScale) })
      .webp({ quality: 88, alphaQuality: 95, effort: 6 })
      .toBuffer(),
    "eyes",
    "webp",
  );

  const waveCrop = await figureBox(SOURCE.wave);
  const { data: waveBuffer, info: wave } = await sharp(SOURCE.wave)
    .extract(waveCrop)
    .resize({ height: WAVE_HEIGHT })
    .webp({ quality: 86, alphaQuality: 95, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  const waveSrc = await save(waveBuffer, "wave", "webp");

  // Phone close-ups. The figure is scaled so the frame is drawn at up to 3x, never
  // past the source resolution, then padded with transparency where a frame runs off it.
  const closeUps = {};
  for (const c of CLOSE_UPS) {
    const k = Math.min(CLOSE_MAX_DENSITY, crop.width / c.width);
    const figW = Math.round(c.width * k);
    const scaled = await figure().resize({ width: figW }).png().toBuffer();
    const pad = Math.round(CLOSE_FRAME.width * k);
    const out = {
      left: pad + Math.round(-c.left * k),
      top: pad + Math.round(-c.top * k),
      width: Math.round(CLOSE_FRAME.width * k),
      height: Math.round(CLOSE_FRAME.height * k),
    };
    const framed = sharp(scaled)
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png();
    const region = await sharp(await framed.toBuffer()).extract(out).png().toBuffer();
    closeUps[c.id] = {
      avif: await save(await sharp(region).avif({ quality: 58, effort: 5 }).toBuffer(), `close-${c.id}`, "avif"),
      webp: await save(await sharp(region).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toBuffer(), `close-${c.id}`, "webp"),
      width: out.width,
      height: out.height,
    };
  }

  const pct = (v, total) => Number(((v / total) * 100).toFixed(3));
  const manifest = {
    src,
    eyesSrc,
    hd,
    width: Math.round(crop.width * (OUTPUT_HEIGHT / crop.height)),
    height: OUTPUT_HEIGHT,
    eyes: {
      left: pct(EYE_PATCH.left - crop.left, crop.width),
      top: pct(EYE_PATCH.top - crop.top, crop.height),
      width: pct(EYE_PATCH.width, crop.width),
      height: pct(EYE_PATCH.height, crop.height),
    },
    wave: { src: waveSrc, width: wave.width, height: wave.height },
    closeUps,
  };
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("avatar", manifest.width, "x", OUTPUT_HEIGHT, "crop", crop, "eyes", manifest.eyes, "wave", manifest.wave);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
