/** Every EduLynx URL the site links to was verified present on the live product site (26 Sep 2026). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const VERIFIED = new Set(["https://erp.edulynxerp.in", "https://erp.edulynxerp.in/", "https://erp.edulynxerp.in/demo", "https://erp.edulynxerp.in/modules",
  "https://erp.edulynxerp.in/refund-policy", "https://erp.edulynxerp.in/security-practices", "https://erp.edulynxerp.in/terms"]);
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : []; });

test("all EduLynx links in the built site are verified live URLs", () => {
  const used = new Set<string>();
  for (const f of walk("dist")) for (const m of readFileSync(f, "utf8").matchAll(/https:\/\/erp\.edulynxerp\.in[^"'\s<)]*/g)) used.add(m[0]);
  const unverified = [...used].filter((u) => !VERIFIED.has(u));
  assert.deepEqual(unverified, [], "re-verify on the live site, then add to VERIFIED");
});
