import manifestJson from "../generated/images.json";

export interface ImageEntry {
  width: number;
  height: number;
  widths: number[];
  color: string;
}

const manifest = manifestJson as Record<string, ImageEntry>;

export function getImage(name: string): ImageEntry {
  const entry = manifest[name];
  if (!entry) throw new Error(`Image "${name}" is not in src/generated/images.json. Run npm run images.`);
  return entry;
}

export const hasImage = (name: string): boolean => name in manifest;

export const srcset = (name: string, format: "avif" | "webp" | "jpg"): string =>
  getImage(name).widths.map((w) => `/images/${name}-${w}.${format} ${w}w`).join(", ");

export const largest = (name: string, format: "webp" | "jpg" = "jpg"): string => {
  const e = getImage(name);
  return `/images/${name}-${e.widths[e.widths.length - 1]}.${format}`;
};
