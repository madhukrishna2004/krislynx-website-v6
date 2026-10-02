/** Owner decision: the founder is not publicly prominent. Content is preserved on an internal, unlinked route. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : []; });
const files = walk("dist");
const internal = join("dist", "company", "leadership.html");

test("internal leadership route exists and preserves the approved content", () => {
  const html = readFileSync(internal, "utf8");
  assert.match(html, /Madhu Krishna/);
  assert.match(html, /Founder &amp; CEO|Founder & CEO/);
  assert.match(html, /linkedin\.com\/in\//);
});

test("internal route is noindex and excluded from the sitemap", () => {
  assert.match(readFileSync(internal, "utf8"), /<meta name="robots" content="noindex/);
  assert.doesNotMatch(readFileSync("dist/sitemap.xml", "utf8"), /company\/leadership/);
});

test("no public page names or links the founder", () => {
  for (const f of files) {
    if (f === internal) continue;
    const html = readFileSync(f, "utf8");
    assert.doesNotMatch(html, /Madhu/, f);
    assert.doesNotMatch(html, /href="\/company\/leadership"/, `${f} links the internal route`);
  }
});

test("Organization structured data has no founder field", () => {
  assert.doesNotMatch(readFileSync("dist/index.html", "utf8"), /"founder"/);
});

test("primary navigation has no founder or leadership item", () => {
  const nav = readFileSync("src/config/navigation.ts", "utf8");
  assert.doesNotMatch(nav, /founder|leadership/i);
});
