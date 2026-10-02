/**
 * Image pipeline.
 *
 * Source photographs live in content/images/source (originals, never served).
 * This script writes responsive AVIF / WebP / JPEG variants to public/images
 * and a manifest (src/generated/images.json) that the <Picture> component reads
 * for intrinsic width/height (prevents CLS) and a dominant placeholder colour.
 *
 * EXIF (including any GPS data) is stripped: sharp does not copy metadata
 * unless .withMetadata() is called, and we never call it.
 *
 * To replace or add a photo: drop the file in content/images/source with a
 * descriptive, hyphenated filename, add an entry below, run `npm run images`.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface Job {
  /** manifest key and output filename stem */
  name: string;
  file: string;
  widths: number[];
  /** optional crop to a fixed aspect ratio, e.g. 4/3 */
  aspect?: number;
  /** focal point for aspect crops */
  position?: "centre" | "top" | "bottom" | "left" | "right" | "attention";
  quality?: number;
}

const SRC = "content/images/source";
const OUT = "public/images";

const jobs: Job[] = [
  { name: "office-reception-corridor", file: "office-reception-corridor.jpg", widths: [480, 800, 1200, 1600], aspect: 3 / 4, position: "centre" },
  { name: "office-meeting-room", file: "office-meeting-room.jpg", widths: [480, 800, 1200, 1600], aspect: 16 / 9 },
  { name: "office-workspace", file: "office-workspace.jpg", widths: [480, 800, 1200, 1600, 2000], aspect: 4 / 3 },
  { name: "office-brand-wall", file: "office-brand-wall.jpg", widths: [480, 800, 1200], aspect: 4 / 3 },
  { name: "leadership-madhu-krishna", file: "leadership-madhu-krishna.jpg", widths: [320, 480, 720], aspect: 4 / 5, position: "top" },
  { name: "product-selfmate-mark", file: "product-selfmate-mark.png", widths: [240, 480], aspect: 1 },
  // product marks cropped from the owner-supplied product posters (27 Sep 2026); marks only — poster claims not used
  { name: "product-fearlink-mark", file: "product-fearlink-mark.png", widths: [240], aspect: 1 },
  { name: "product-miyraa-mark", file: "product-miyraa-mark.png", widths: [240], aspect: 1 },
  { name: "product-apexportai-mark", file: "product-apexportai-mark.png", widths: [240], aspect: 1 },
  // Real workspace (WhatsApp original 19 Sep 2026, professionally enhanced — exposure/WB/levels/sharpening only)
  { name: "krislynx-workspace", file: "krislynx-workspace.jpg", widths: [640, 960, 1280, 1600, 2000], aspect: 3 / 2 },
  { name: "krislynx-workspace-mobile", file: "krislynx-workspace-mobile.jpg", widths: [480, 800, 1200], aspect: 4 / 5 },
  // V4 (27 Sep 2026): real network/server room, owner-confirmed; image AI-enhanced (disclosed in captions)
  { name: "krislynx-infrastructure-server-room", file: "krislynx-infrastructure-server-room.jpg", widths: [480, 800, 1200, 1600], aspect: 16 / 9 },
  { name: "krislynx-infrastructure-server-room-mobile", file: "krislynx-infrastructure-server-room-mobile.jpg", widths: [480, 720], aspect: 4 / 5 },
];

interface Entry {
  width: number;
  height: number;
  widths: number[];
  color: string;
}

async function run(): Promise<void> {
  await mkdir(OUT, { recursive: true });
  const manifest: Record<string, Entry> = {};

  for (const job of jobs) {
    const input = sharp(join(SRC, job.file)).rotate();
    const meta = await input.metadata();
    const srcW = meta.width ?? 0;
    const srcH = meta.height ?? 0;

    let baseW = srcW;
    let baseH = srcH;
    if (job.aspect) {
      if (srcW / srcH > job.aspect) {
        baseW = Math.round(srcH * job.aspect);
      } else {
        baseH = Math.round(srcW / job.aspect);
      }
    }
    const widths = job.widths.filter((w) => w <= baseW);
    if (widths.length === 0) widths.push(baseW);

    const stats = await sharp(join(SRC, job.file)).resize(32).stats();
    const { r, g, b } = stats.dominant;
    const color = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;

    for (const w of widths) {
      const h = Math.round((w * baseH) / baseW);
      const pipeline = () =>
        sharp(join(SRC, job.file))
          .rotate()
          .resize(w, h, { fit: "cover", position: job.position ?? "centre" });
      const q = job.quality ?? 72;
      await pipeline().avif({ quality: q - 22, effort: 5 }).toFile(join(OUT, `${job.name}-${w}.avif`));
      await pipeline().webp({ quality: q }).toFile(join(OUT, `${job.name}-${w}.webp`));
      await pipeline().jpeg({ quality: q + 6, mozjpeg: true, progressive: true }).toFile(join(OUT, `${job.name}-${w}.jpg`));
    }
    const maxW = widths[widths.length - 1] ?? baseW;
    manifest[job.name] = { width: maxW, height: Math.round((maxW * baseH) / baseW), widths, color };
    console.log(`✓ ${job.name}: ${widths.join(", ")}`);
  }

  await writeFile("src/generated/images.json", JSON.stringify(manifest, null, 2) + "\n");
}

run().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
