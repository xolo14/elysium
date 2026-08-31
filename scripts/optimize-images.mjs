/**
 * Generate WebP companions for public/images (keeps PNG/JPEG as fallback).
 * Run: node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const root = path.resolve("public/images");
const MAX = 1600;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else if (/\.(png|jpe?g)$/i.test(e.name)) await optimize(full);
  }
}

async function optimize(file) {
  const stat = await fs.stat(file);
  if (stat.size < 40_000) return;
  const webp = file.replace(/\.(png|jpe?g)$/i, ".webp");
  try {
    const meta = await sharp(file).metadata();
    await sharp(file)
      .rotate()
      .resize({
        width: Math.min(meta.width ?? MAX, MAX),
        withoutEnlargement: true,
      })
      .webp({ quality: 76, effort: 4 })
      .toFile(webp);
    console.log("ok", path.relative(process.cwd(), webp));
  } catch (err) {
    console.warn("skip", file, err.message);
  }
}

await walk(root);
console.log("done");
