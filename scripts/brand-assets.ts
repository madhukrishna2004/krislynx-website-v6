/**
 * Generates raster brand assets from the traced SVG mark:
 * favicons, PWA/maskable icons, apple-touch icon and the 512px logo used in
 * Organization structured data. Run after changing public/brand/*.svg.
 */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const INK = "#0A1428";

async function onBackground(svg: Buffer, size: number, pad: number, bg: string | null, out: string): Promise<void> {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(svg, { density: 600 }).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(out);
}

// Minimal ICO writer: embeds PNG images (supported by all modern browsers).
function ico(pngs: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + 16 * pngs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = header.length;
  pngs.forEach((p, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(p.size >= 256 ? 0 : p.size, e);
    header.writeUInt8(p.size >= 256 ? 0 : p.size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(p.data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += p.data.length;
  });
  return Buffer.concat([header, ...pngs.map((p) => p.data)]);
}

async function main(): Promise<void> {
  const gradient = await readFile("public/brand/krislynx-mark.svg");
  const white = await readFile("public/brand/krislynx-mark-white.svg");
  await onBackground(gradient, 512, 0.08, null, "public/brand/krislynx-logo-512.png");
  await onBackground(white, 192, 0.16, INK, "public/brand/icon-192.png");
  await onBackground(white, 512, 0.16, INK, "public/brand/icon-512.png");
  await onBackground(white, 512, 0.24, INK, "public/brand/icon-maskable-512.png");
  await onBackground(white, 180, 0.16, INK, "public/apple-touch-icon.png");
  const sizes = [16, 32, 48];
  const pngs = await Promise.all(
    sizes.map(async (size) => {
      const tmp = `/tmp/fav-${size}.png`;
      await onBackground(gradient, size, 0.04, null, tmp);
      return { size, data: await readFile(tmp) };
    }),
  );
  await writeFile("public/favicon.ico", ico(pngs));
  console.log("✓ brand assets");
}
main().catch((e: unknown) => { console.error(e); process.exit(1); });
