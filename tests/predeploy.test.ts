/**
 * PRE-DEPLOYMENT GATE — scans the built public output (dist/) that would be deployed.
 * Obsolete identity must never ship; the canonical host is the apex https://krislynx.com.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk("dist").filter((f) => /\.(html|xml|txt|js|css|json|webmanifest)$/.test(f));
const read = (f: string) => readFileSync(f, "utf8");
const html = files.filter((f) => f.endsWith(".html"));
const publicHtml = html.filter((f) => !/<meta name="robots" content="noindex/.test(read(f)));

test("no obsolete company identity in anything deployable", () => {
  const banned: [string, RegExp][] = [
    ["LLP identity", /krislynx\s+llp/i], ["RKLS", /\bRKLS\b/i], ["(OPC)", /\(OPC\)/i], ["OPC PRIVATE LIMITED", /OPC\)?\s+PRIVATE LIMITED/i],
    ["old CIN", /U62013AP2024PTC119824/i], ["old house number", /331-103/], ["misspelt locality", /Moo(re|me) Pale/i], ["old mailbox", /connect@krislynx\.com/i],
    ["old site title", /AI Innovators in Emotion Tech/i], ["TradeSphere brand", /TradeSphere/],
  ];
  const hits: string[] = [];
  for (const f of files) for (const [name, rx] of banned) if (rx.test(read(f))) hits.push(`${f}: ${name}`);
  assert.deepEqual(hits, []);
});

test("current legal identity is present on every public page footer", () => {
  for (const f of publicHtml) {
    const t = read(f);
    assert.match(t, /KRISLYNX TECHNOLOGIES PRIVATE LIMITED/, f);
    assert.match(t, /U62013AP2026PTC128241/, f);
  }
});

test("canonical host is the apex https://krislynx.com everywhere (no www, no http)", () => {
  const bad: string[] = [];
  for (const f of html) {
    const t = read(f);
    for (const m of t.matchAll(/<link rel="canonical" href="([^"]+)"|<meta property="og:url" content="([^"]+)"/g)) {
      const u = m[1] ?? m[2] ?? "";
      if (!u.startsWith("https://krislynx.com/") && u !== "https://krislynx.com") bad.push(`${f}: ${u}`);
    }
  }
  for (const u of read("dist/sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)) if (!(u[1] ?? "").startsWith("https://krislynx.com/")) bad.push(`sitemap: ${u[1]}`);
  assert.match(read("dist/robots.txt"), /Sitemap: https:\/\/krislynx\.com\/sitemap\.xml/);
  for (const f of files) if (/https?:\/\/www\.krislynx\.com/.test(read(f))) bad.push(`${f}: www host`);
  assert.deepEqual(bad, []);
});

test("sitemap: exactly 27 unique public URLs (V2 adds /technology), no hidden or development routes", () => {
  const locs = [...read("dist/sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(locs.length, 27);
  assert.equal(new Set(locs).size, 27);
  // whole path segments only (e.g. "/services/software-development" is a real public page)
  for (const l of locs) assert.doesNotMatch(l ?? "", /\/(company\/leadership|contact\/thanks|404|drafts?|dev|test|staging)(\/|$)|localhost/, l);
});

test("robots does not block public content", () => {
  const r = read("dist/robots.txt");
  for (const line of r.split("\n").filter((l) => /^Disallow:/i.test(l))) {
    const path = line.split(":")[1]?.trim() ?? "";
    for (const pub of ["/", "/products", "/products/edulynx-erp", "/company", "/services", "/contact", "/work"]) assert.notEqual(path, pub, `robots blocks ${pub}`);
  }
});

test("only approved email addresses are published", () => {
  const found = new Set<string>();
  for (const f of files) for (const m of read(f).matchAll(/[a-z0-9._%+-]+@krislynx\.com/gi)) found.add(m[0].toLowerCase());
  assert.deepEqual([...found].sort(), ["info@krislynx.com"]);
});

test("no development URLs, debug endpoints or secrets in deployable output", () => {
  // URL forms only: a `hostname === "localhost"` guard (dev-only console warning) is not a development endpoint
  const rx = /https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?|\/debug\b|sourceMappingURL|AIza[0-9A-Za-z_-]{35}|re_[A-Za-z0-9]{24,}|sk_(live|test)_|BEGIN (RSA |EC )?PRIVATE KEY|RESEND_API_KEY|IP_HASH_SALT/;
  const hits = files.filter((f) => rx.test(read(f)));
  assert.deepEqual(hits, []);
});

test("legal identity is always written in its registered form", () => {
  const hits = files.filter((f) => f.endsWith(".html") && /KrisLynx Technologies Private Limited|Krislynx Technologies Private Limited/.test(read(f)));
  assert.deepEqual(hits, [], "use KRISLYNX TECHNOLOGIES PRIVATE LIMITED");
});

/* ─────────────── V5 audit guards (each caught a real defect) ─────────────── */
test("no product status wording in public prose (labels were removed; sentences must follow)", () => {
  const hits = files.filter((f) => f.endsWith(".html")).filter((f) => /\b(is|are) (a |an |in )?(research|concept|prototype|in development)\b/i.test(read(f).replace(/<[^>]+>/g, " ")));
  assert.deepEqual(hits, []);
  assert.doesNotMatch(readFileSync("src/config/assistant.ts", "utf8"), /\bare research projects\b|\bin development\b/i, "assistant answers follow the same rule");
});
test("no page repeats a sentence or paragraph (guard proven in tests/content-guards.test.ts)", async () => {
  const { findRepeatedContent } = await import("../src/lib/content-guards");
  const dup = files.filter((f) => f.endsWith(".html")).flatMap((f) => findRepeatedContent(read(f)).map((d) => `${f}: ${d}`));
  assert.deepEqual(dup, []);
});
test("illustrative interfaces use real capability rows, never skeleton placeholder bars", () => {
  assert.doesNotMatch(read("dist/products/edulynx-erp.html"), /class="sk sk--/);
  assert.match(read("dist/products/edulynx-erp.html"), /EduLynx ERP · illustrative interface/);
});
test("no lifecycle/status labels in public metadata, legends or case-study types", () => {
  const bad = /Not a product|not offered to customers|Solid line: live|\(internal project\)|<dt>Status<\/dt>|Internal development project|Research · /;
  const hits = files.filter((f) => f.endsWith(".html") && !/<meta name="robots" content="noindex/.test(read(f)) && bad.test(read(f)));
  assert.deepEqual(hits, []);
});
