/**
 * Brand icon + logo-variant set, composed from the OFFICIAL traced logo parts in public/brand
 * (mark, wordmark, descriptor). Geometry is never redrawn: each part is nested with its own viewBox; only
 * colour changes (currentColor / the white or mono mark). Run: tsx scripts/brand-icons.ts
 */
import { readFile, writeFile, copyFile } from "node:fs/promises";
import sharp from "sharp";

const B = "public/brand";
const inner = (svg: string): string => svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"));
const mark = await readFile(`${B}/krislynx-mark.svg`, "utf8");
const markWhite = await readFile(`${B}/krislynx-mark-white.svg`, "utf8");
const markMono = await readFile(`${B}/krislynx-mark-mono.svg`, "utf8");
const word = inner(await readFile(`${B}/krislynx-wordmark.svg`, "utf8"));
const desc = inner(await readFile(`${B}/krislynx-descriptor.svg`, "utf8"));

/** Lockup: mark left, KRISLYNX wordmark + TECHNOLOGIES PRIVATE LIMITED stacked right (official proportions). */
function lockup(markSvg: string, wordColor: string, descColor: string, label: string): string {
  const P = 40, MH = 1000, MW = Math.round((975 * MH) / 1128), TX = P + MW + 120;
  const WH = 260, WW = Math.round((2018 * WH) / 242), DH = 100, DW = Math.round((1992 * DH) / 93), TY = P + (MH - (WH + 70 + DH)) / 2;
  const width = TX + Math.max(WW, DW) + P, height = MH + 2 * P;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">` +
    `<svg x="${P}" y="${P}" width="${MW}" height="${MH}" viewBox="0 0 975 1128">${inner(markSvg)}</svg>` +
    `<svg x="${TX}" y="${TY}" width="${WW}" height="${WH}" viewBox="0 0 2018 242" color="${wordColor}">${word}</svg>` +
    `<svg x="${TX}" y="${TY + WH + 70}" width="${DW}" height="${DH}" viewBox="0 0 1992 93" color="${descColor}">${desc}</svg></svg>`;
}
const L = "KRISLYNX TECHNOLOGIES PRIVATE LIMITED";
const variants: Record<string, string> = {
  "krislynx-logo.svg": lockup(mark, "#0D1118", "#1F5BFF", L),            // full colour, for light backgrounds
  "krislynx-logo-on-dark.svg": lockup(mark, "#F5F7FA", "#65E6FF", L),    // full colour, for dark backgrounds
  "krislynx-logo-white.svg": lockup(markWhite, "#FFFFFF", "#FFFFFF", L), // white on transparent
  "krislynx-logo-dark.svg": lockup(markMono.replace(/currentColor/g, "#0D1118"), "#0D1118", "#0D1118", L), // dark on transparent
  "krislynx-logo-mono.svg": lockup(markMono.replace(/currentColor/g, "#000000"), "#000000", "#000000", L), // monochrome
};
for (const [f, svg] of Object.entries(variants)) await writeFile(`${B}/${f}`, svg);
// high-resolution rasters of the lockups (transparent)
await sharp(Buffer.from(variants["krislynx-logo.svg"] ?? "")).resize({ width: 2400 }).png().toFile(`${B}/krislynx-logo-2400.png`);
await sharp(Buffer.from(variants["krislynx-logo-on-dark.svg"] ?? "")).resize({ width: 2400 }).png().toFile(`${B}/krislynx-logo-on-dark-2400.png`);
// favicons from the official mark
await copyFile(`${B}/krislynx-mark.svg`, "public/favicon.svg");
for (const s of [16, 32, 48]) {
  await sharp(Buffer.from(mark)).resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(`${B}/favicon-${s}.png`);
}
console.log("✓ logo variants:", Object.keys(variants).join(", "), "+ 2400px PNGs · ✓ favicon.svg, favicon-16/32/48.png");
