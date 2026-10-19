/**
 * Rebuild soft, undersized hotel photos at 1920px so full-bleed heroes stay sharp.
 * Run: node scripts/sharpen-small-images.mjs
 */
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const root = path.resolve("public/images");
const TARGET = 1920;
const skip = /amenities|charminar|footer-lattice/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) await sharpen(full);
  }
}

async function sharpen(file) {
  if (skip.test(file)) return;
  const meta = await sharp(file).metadata();
  const width = meta.width ?? 0;
  if (width >= TARGET || width < 400) return;

  const pipeline = sharp(file)
    .rotate()
    .resize({ width: TARGET, kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 0.55, m2: 0.3 });

  const webp = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await pipeline.clone().webp({ quality: 92, effort: 5, smartSubsample: false }).toFile(webp + ".tmp");
  await fs.rename(webp + ".tmp", webp);

  if (/\.jpe?g$/i.test(file)) {
    await pipeline.clone().jpeg({ quality: 92, mozjpeg: true }).toFile(file + ".tmp");
    await fs.rename(file + ".tmp", file);
  }

  console.log("sharp", path.relative(process.cwd(), file), width, "->", TARGET);
}

await walk(root);
console.log("done");
