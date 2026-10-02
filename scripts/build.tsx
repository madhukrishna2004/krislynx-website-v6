/**
 * Static site build.
 *   1. Bundle + hash CSS and the client script (esbuild).
 *   2. Pre-render every page to HTML (clean URLs: /company → company.html).
 *   3. Copy public/ assets; emit sitemap.xml (with image entries), robots.txt, manifest.webmanifest.
 *   4. Fail the build on SEO integrity errors (missing/duplicate titles, etc.).
 */
import { build, transform } from "esbuild";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { render } from "../src/jsx/jsx-runtime";
import { assets } from "../src/lib/assets";
import { edulynx } from "../src/config/products";
import { absoluteUrl, seo } from "../src/config/seo";
import { Document } from "../src/components/layout";

const DIST = "dist";
const hash = (s: string | Uint8Array): string => createHash("sha256").update(s).digest("hex").slice(0, 10);

export const outputFile = (path: string): string => {
  if (path === "/") return "index.html";
  if (path === "/404") return "404.html";
  return `${path.replace(/^\//, "")}.html`;
};

async function buildCss(): Promise<string> {
  const files = ["base.css", "components.css", "pages.css", "viz.css", "system.css", "rooms.css"];
  const source = (await Promise.all(files.map((f) => readFile(join("src/styles", f), "utf8")))).join("\n");
  // Diagram node positions are generated from the same constants that draw the SVG lines (CSP: no inline styles).
  const { vizCss, vizCssV3 } = await import("../src/components/viz");
  const generated = vizCss() + vizCssV3();
  const out = await transform(source + "\n" + generated, { loader: "css", minify: true, target: ["chrome100", "safari15", "firefox100"] });
  const name = `/assets/site.${hash(out.code)}.css`;
  await writeFile(join(DIST, name), out.code);
  return name;
}

async function buildJs(): Promise<string> {
  const result = await build({
    entryPoints: ["src/client/main.ts"],
    bundle: true,
    minify: true,
    format: "iife",
    target: ["chrome100", "safari15", "firefox100"],
    write: false,
    legalComments: "none",
  });
  const code = result.outputFiles[0]?.contents ?? new Uint8Array();
  const name = `/assets/app.${hash(code)}.js`;
  await writeFile(join(DIST, name), code);
  return name;
}

async function main(): Promise<void> {
  const started = Date.now();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(join(DIST, "assets"), { recursive: true });
  await cp("public", DIST, { recursive: true });

  assets.css = await buildCss();
  assets.js = await buildJs();
  assets.gaId = process.env.KX_GA_ID ?? "";

  // Import pages after assets are set (layout reads them during render).
  const { pages } = await import("../src/pages/index");

  const errors: string[] = [];
  const seenTitles = new Map<string, string>();
  const seenDescriptions = new Map<string, string>();
  const seenPaths = new Set<string>();

  for (const page of pages) {
    if (seenPaths.has(page.path)) errors.push(`Duplicate path ${page.path}`);
    seenPaths.add(page.path);
    if (!page.noindex) {
      const t = seenTitles.get(page.title);
      if (t) errors.push(`Duplicate title "${page.title}" on ${t} and ${page.path}`);
      seenTitles.set(page.title, page.path);
      const d = seenDescriptions.get(page.description);
      if (d) errors.push(`Duplicate description on ${d} and ${page.path}`);
      seenDescriptions.set(page.description, page.path);
      if (page.description.length < 70 || page.description.length > 170) {
        console.warn(`! ${page.path}: description is ${page.description.length} chars (aim for 70–160)`);
      }
    }
    const html = "<!doctype html>" + render(Document({ page, children: page.render() }));
    if (!page.noindex && (html.match(/<h1[\s>]/g) ?? []).length !== 1) errors.push(`${page.path} must have exactly one <h1>`);
    const file = join(DIST, outputFile(page.path));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }

  const indexable = pages.filter((p) => !p.noindex && !p.excludeFromSitemap);
  // Image sitemap: the real content photographs/marks each page actually renders (largest JPEG/PNG fallback).
  const imagesFor = async (path: string): Promise<string[]> => {
    const file = join(DIST, path === "/" ? "index.html" : `${path.slice(1)}.html`);
    const html = await readFile(file, "utf8").catch(() => "");
    const srcs = [...html.matchAll(/<img[^>]+src="(\/images\/[^"]+)"/g)].map((m) => m[1] ?? "");
    return [...new Set(srcs)].map((u) => absoluteUrl(u));
  };
  const entries: string[] = [];
  for (const p of indexable) {
    const imgs = await imagesFor(p.path);
    entries.push(
      `  <url><loc>${absoluteUrl(p.path)}</loc><lastmod>${assets.buildDate}</lastmod>` +
        `<changefreq>${p.sitemap?.changefreq ?? "monthly"}</changefreq><priority>${(p.sitemap?.priority ?? 0.6).toFixed(1)}</priority>` +
        imgs.map((u) => `<image:image><image:loc>${u}</image:loc></image:image>`).join("") +
        `</url>`,
    );
  }
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    entries.join("\n") +
    `\n</urlset>\n`;
  await writeFile(join(DIST, "sitemap.xml"), sitemap);

  const robots = [
    "# KrisLynx Technologies",
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${seo.siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
  await writeFile(join(DIST, "robots.txt"), robots);
  // KX Navigator index: public pages + key sections + EduLynx modules (no hidden routes, nothing private)
  // navigator shows the page's subject only ("Products", not "Products | Software & AI Products | KRISLYNX")
  const strip = (t: string): string => (t.split(/\s+[|—]\s+/)[0] ?? t).trim();
  const navIndex = [
    // every page maps onto one of the six navigator groups: product · technology · engineering · company (+ edulynx, recent at runtime)
    ...indexable.map((p) => ({ t: strip(p.title), d: p.description, u: p.path,
      k: p.path.startsWith("/products") ? "product" : p.path.startsWith("/technology") ? "technology" : /^\/(services|work|industries)/.test(p.path) ? "engineering" : "company" })),
    { t: "Architecture — six layers", d: "Interface, application, API, services, data and infrastructure.", u: "/technology#t-arch", k: "technology" },
    { t: "AI pipeline", d: "From question to a human decision — AI stops here, people decide.", u: "/technology#t-ai", k: "technology" },
    { t: "Engineering lifecycle", d: "Eight steps from idea to production.", u: "/technology#t-eng", k: "technology" },
    { t: "Start a project", d: "Tell us what needs to work.", u: "/contact", k: "company" },
    ...edulynx.modules.map((m) => ({ t: `EduLynx · ${m.name}`, d: m.body.slice(0, 110), u: "/products/edulynx-erp", k: "edulynx" })),
  ];
  await writeFile(join(DIST, "navigator.json"), JSON.stringify(navIndex));

  const manifest = {
    name: "KRISLYNX TECHNOLOGIES PRIVATE LIMITED",
    short_name: "KRISLYNX",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0D0C",
    theme_color: seo.themeColor,
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  await writeFile(join(DIST, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));

  if (errors.length) {
    console.error(errors.map((e) => `✗ ${e}`).join("\n"));
    process.exit(1);
  }
  console.log(`✓ Built ${pages.length} pages (${indexable.length} in sitemap) in ${Date.now() - started} ms`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
