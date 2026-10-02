/**
 * SEO CRAWL (built output). Every public page: one H1, unique title + description, exactly one https apex canonical
 * equal to its own URL, complete Open Graph/Twitter, valid JSON-LD, images with alt + dimensions + real files.
 * Sitemap, robots, icons, manifest and Organization identity are verified against the files that will deploy.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const D = "dist";
const ORIGIN = "https://krislynx.com";
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : []; });
const pages = walk(D).map((f) => ({ f, html: readFileSync(f, "utf8") }));
const urlOf = (f: string): string => { const rel = f.slice(D.length).replace(/\.html$/, ""); return rel === "/index" ? `${ORIGIN}/` : `${ORIGIN}${rel}`; };
const indexable = pages.filter((p) => !/<meta name="robots" content="noindex/.test(p.html) && !/\/404\.html$/.test(p.f));
const attr = (html: string, re: RegExp): string[] => [...html.matchAll(re)].map((m) => m[1] ?? "");
const local = (u: string): string => join(D, u.replace(ORIGIN, "").split("?")[0] ?? "");

test("every indexable page: exactly one H1", () => {
  for (const p of indexable) assert.equal((p.html.match(/<h1[\s>]/g) ?? []).length, 1, p.f);
});

test("titles and meta descriptions present and unique", () => {
  const titles = new Map<string, string>(); const descs = new Map<string, string>();
  for (const p of indexable) {
    const t = attr(p.html, /<title>([^<]*)<\/title>/g)[0] ?? ""; const d = attr(p.html, /<meta name="description" content="([^"]*)"/g)[0] ?? "";
    assert.ok(t.length > 5 && t.length <= 70, `${p.f}: title length ${t.length}`);
    assert.ok(d.length >= 50 && d.length <= 170, `${p.f}: description length ${d.length}`);
    assert.ok(!titles.has(t), `duplicate title: ${t} (${p.f}, ${titles.get(t)})`); titles.set(t, p.f);
    assert.ok(!descs.has(d), `duplicate description (${p.f}, ${descs.get(d)})`); descs.set(d, p.f);
  }
});

test("exactly one canonical per page: https apex, equal to the page's own URL", () => {
  for (const p of indexable) {
    const c = attr(p.html, /<link rel="canonical" href="([^"]+)"/g);
    assert.equal(c.length, 1, `${p.f}: ${c.length} canonicals`);
    assert.equal(c[0], urlOf(p.f), p.f);
  }
});

test("Open Graph + Twitter complete; og:image is https, exists and is 1200×630", async () => {
  for (const p of indexable) {
    for (const k of ["og:title", "og:description", "og:url", "og:type", "og:image", "og:image:width", "og:image:height", "og:site_name"])
      assert.match(p.html, new RegExp(`<meta property="${k}" content="[^"]+"`), `${p.f}: ${k}`);
    assert.match(p.html, /<meta name="twitter:card" content="summary_large_image"/, p.f);
    const img = attr(p.html, /<meta property="og:image" content="([^"]+)"/g)[0] ?? "";
    assert.ok(img.startsWith(`${ORIGIN}/`), `${p.f}: og:image ${img}`);
    assert.ok(existsSync(local(img)), `${p.f}: og:image file missing ${img}`);
    const m = await sharp(local(img)).metadata();
    assert.equal(`${m.width}x${m.height}`, "1200x630", `${p.f}: og:image size`);
    assert.equal(attr(p.html, /<meta property="og:url" content="([^"]+)"/g)[0], urlOf(p.f), `${p.f}: og:url ≠ canonical`);
  }
});

test("all JSON-LD parses; nodes typed; URLs are https apex", () => {
  for (const p of pages) for (const raw of attr(p.html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(raw);
    const nodes = (Array.isArray(data) ? data : data["@graph"] ?? [data]) as Record<string, unknown>[];
    for (const n of nodes) assert.ok(n["@type"], `${p.f}: untyped node`);
    for (const u of raw.match(/https?:\/\/[^"\\]+/g) ?? []) if (!/schema\.org|erp\.edulynxerp\.in|linkedin\.com/.test(u)) assert.ok(u.startsWith(ORIGIN), `${p.f}: ${u}`);
  }
});

test("Organization identity: legal name, crawlable logo ≥112px, verified address and email only", async () => {
  const home = pages.find((p) => p.f === join(D, "index.html"))?.html ?? "";
  const org = attr(home, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((r) => JSON.parse(r)).find((j) => j["@type"] === "Organization");
  assert.ok(org, "Organization on homepage");
  assert.equal(org.name, "KRISLYNX TECHNOLOGIES PRIVATE LIMITED");
  assert.equal(org.legalName, "KRISLYNX TECHNOLOGIES PRIVATE LIMITED");
  assert.equal(org.email, "info@krislynx.com");
  assert.match(JSON.stringify(org.address), /33\/1-108, Noone Palle/);
  const logo = typeof org.logo === "string" ? org.logo : org.logo.url;
  const meta = await sharp(local(logo)).metadata();
  assert.ok((meta.width ?? 0) >= 112 && (meta.height ?? 0) >= 112, "logo ≥ 112×112");
  for (const bad of ["aggregateRating", "review", "telephone", "openingHours"]) assert.ok(!(bad in org), `no invented ${bad}`);
});

test("images: every <img> has alt, width and height, and its file exists", () => {
  for (const p of pages) for (const tag of p.html.match(/<img\b[^>]*>/g) ?? []) {
    assert.match(tag, /\balt="/, `${p.f}: img without alt`);
    assert.match(tag, /\bwidth="\d+"/, `${p.f}: img without width`); assert.match(tag, /\bheight="\d+"/, `${p.f}: img without height`);
    const src = /\bsrc="([^"]+)"/.exec(tag)?.[1] ?? "";
    if (src.startsWith("/")) assert.ok(existsSync(join(D, src)), `${p.f}: missing ${src}`);
  }
});

test("sitemap: every URL is an indexable page whose canonical matches; image entries exist; no hidden routes", () => {
  const sm = readFileSync(join(D, "sitemap.xml"), "utf8");
  const locs = attr(sm, /<loc>([^<]+)<\/loc>/g);
  assert.equal(locs.length, indexable.length, "sitemap covers every indexable page and nothing else");
  for (const l of locs) {
    const p = indexable.find((x) => urlOf(x.f) === l); assert.ok(p, `${l}: not an indexable page`);
  }
  for (const i of attr(sm, /<image:loc>([^<]+)<\/image:loc>/g)) assert.ok(existsSync(local(i)), `image missing: ${i}`);
  // namespace URIs (http://www.sitemaps.org/…) are fixed by the standard — check the actual URLs only
  for (const u of [...locs, ...attr(sm, /<image:loc>([^<]+)<\/image:loc>/g)]) assert.doesNotMatch(u, /leadership|www\.|^http:\/\//, u);
});

test("robots.txt allows assets and points at the apex sitemap", () => {
  const r = readFileSync(join(D, "robots.txt"), "utf8");
  assert.match(r, /^Sitemap: https:\/\/krislynx\.com\/sitemap\.xml$/m);
  for (const path of ["/assets", "/images", "/fonts", "/brand", "/og", "/"]) assert.ok(!new RegExp(`^Disallow: ${path}/?$`, "m").test(r), `blocks ${path}`);
});

test("icon system: favicons, apple-touch 180, PWA 192/512/maskable, manifest, logo variants — all present at the right size", async () => {
  const sizes: [string, number][] = [["brand/favicon-16.png", 16], ["brand/favicon-32.png", 32], ["brand/favicon-48.png", 48], ["apple-touch-icon.png", 180], ["brand/icon-192.png", 192], ["brand/icon-512.png", 512], ["brand/icon-maskable-512.png", 512]];
  for (const [f, s] of sizes) { const m = await sharp(join(D, f)).metadata(); assert.equal(`${m.width}x${m.height}`, `${s}x${s}`, f); }
  for (const f of ["favicon.ico", "favicon.svg", "manifest.webmanifest", "brand/krislynx-logo.svg", "brand/krislynx-logo-on-dark.svg", "brand/krislynx-logo-white.svg", "brand/krislynx-logo-dark.svg", "brand/krislynx-logo-mono.svg", "brand/krislynx-logo-2400.png"])
    assert.ok(existsSync(join(D, f)), f);
  const man = JSON.parse(readFileSync(join(D, "manifest.webmanifest"), "utf8"));
  assert.equal(man.name, "KRISLYNX TECHNOLOGIES PRIVATE LIMITED"); assert.equal(man.display, "standalone");
  for (const i of man.icons) assert.ok(existsSync(join(D, i.src)), i.src);
  const home = pages.find((p) => p.f === join(D, "index.html"))?.html ?? "";
  for (const href of ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/manifest.webmanifest"]) assert.ok(home.includes(`href="${href}"`), `head links ${href}`);
});

test("art-directed <source> elements declare their own dimensions (prevents mobile CLS)", () => {
  for (const p of pages) for (const tag of p.html.match(/<source media="[^"]*"[^>]*>/g) ?? []) {
    assert.match(tag, /\bwidth="\d+"/, `${p.f}: media <source> without width`);
    assert.match(tag, /\bheight="\d+"/, `${p.f}: media <source> without height`);
  }
});
