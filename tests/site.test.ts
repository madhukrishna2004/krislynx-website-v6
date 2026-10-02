/** Integrity checks over the built site (run `npm run build` first). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const htmlFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith(".html") ? [p] : [];
  });
const files = htmlFiles(DIST);
const read = (f: string): string => readFileSync(f, "utf8");
const routeExists = (path: string): boolean => {
  const clean = path.split(/[?#]/)[0] ?? "";
  if (clean === "/" || clean === "") return true;
  const rel = clean.replace(/^\//, "");
  return existsSync(join(DIST, rel)) || existsSync(join(DIST, `${rel}.html`));
};

test("site has pages", () => assert.ok(files.length >= 25, `${files.length}`));

for (const f of files) {
  const html = read(f);
  const noindex = html.includes('content="noindex');
  test(`${f}: head essentials`, () => {
    assert.match(html, /<html lang="en"/);
    assert.match(html, /<title>[^<]{10,}<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]{50,}"/);
    assert.match(html, /<meta property="og:image" content="https:\/\/krislynx\.com\/og\/[\w-]+\.png"/);
    if (!noindex) assert.match(html, /<link rel="canonical" href="https:\/\/krislynx\.com[^"]*"/);
    assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, "exactly one h1");
    assert.doesNotMatch(html, /\sstyle="/, "no inline styles (CSP)");
    assert.doesNotMatch(html, /<script>(?!.*ld\+json)/, "no inline executable scripts");
  });
  test(`${f}: JSON-LD parses`, () => {
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1] ?? "");
  });
  test(`${f}: internal links resolve`, () => {
    const broken = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1] ?? "").filter((h) => !h.startsWith("/api/") && !routeExists(h));
    assert.deepEqual(broken, []);
  });
  test(`${f}: og image file exists`, () => {
    const og = /og:image" content="https:\/\/krislynx\.com(\/og\/[\w-]+\.png)"/.exec(html)?.[1] ?? "";
    assert.ok(existsSync(join(DIST, og)), og);
  });
}

test("titles are unique across indexable pages", () => {
  const titles = files.filter((f) => !read(f).includes('content="noindex')).map((f) => /<title>([^<]*)/.exec(read(f))?.[1]);
  assert.equal(new Set(titles).size, titles.length);
});

test("sitemap lists only existing, indexable pages", () => {
  const sm = read(join(DIST, "sitemap.xml"));
  const locs = [...sm.matchAll(/<loc>https:\/\/krislynx\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  assert.ok(locs.length >= 20);
  for (const l of locs) {
    assert.ok(routeExists(l), l);
    const file = l === "/" ? "index.html" : `${l.slice(1)}.html`;
    assert.doesNotMatch(read(join(DIST, file)), /content="noindex/, l);
  }
  assert.ok(!locs.includes("/insights"), "empty insights stays out of sitemap");
});

test("robots.txt references sitemap and blocks api", () => {
  const r = read(join(DIST, "robots.txt"));
  assert.match(r, /Sitemap: https:\/\/krislynx\.com\/sitemap\.xml/);
  assert.match(r, /Disallow: \/api\//);
});

test("no fabricated claims from the old site survive", () => {
  const all = files.map(read).join("\n");
  for (const bad of ["International Trade Council", "ITC Inc", "30% reduction", "1000+", "50+ institutions", "ISO Compliant", "world's first", "RKLS Towers", "LLP"]) {
    assert.ok(!all.includes(bad), bad);
  }
});

test("general enquiries use info@ only; founder@ is not published without a specific founder context", () => {
  const all = files.map(read).join("\n");
  const addresses = new Set(all.match(/[A-Za-z0-9._%+-]+@krislynx\.com/g) ?? []);
  assert.deepEqual([...addresses], ["info@krislynx.com"]);
});

test("company identity is consistent", () => {
  const home = read(join(DIST, "index.html"));
  assert.match(home, /U62013AP2026PTC128241/);
  assert.match(home, /info@krislynx\.com/);
  assert.match(home, /518502/);
});
