/**
 * Proves the duplicate-content guard itself works (V5 found a version that passed with an injected duplicate).
 * Fixtures: clean passes; exact duplicate sentence, repeated paragraph and repeated statement all FAIL.
 * Mutation test on a real built page: clean → pass, inject → FAIL, remove → pass.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { findRepeatedContent } from "../src/lib/content-guards";

const S = "KrisLynx is the company; each product is its own brand.";
test("clean content passes", () => {
  assert.deepEqual(findRepeatedContent(`<p>${S} EduLynx ERP is our flagship.</p><p>We build software that has to work, for real operations.</p>`), []);
});
test("detects an exact duplicate sentence inside a paragraph", () => {
  assert.equal(findRepeatedContent(`<p>${S} ${S} EduLynx ERP is our flagship.</p>`).length, 1);
});
test("detects a repeated paragraph on the same page", () => {
  const p = "<p>One platform for academics, attendance, examinations, fees and communication.</p>";
  assert.ok(findRepeatedContent(`${p}<div>${p}</div>`).some((f) => f.startsWith("repeated paragraph")));
});
test("detects a repeated marketing statement even when surrounded by SVG <path> markup", () => {
  const svg = `<svg><path d="M0 0L1 1"/></svg>`;
  assert.equal(findRepeatedContent(`${svg}<h1>Products we build</h1><p>${S} ${S}</p>`).length, 1, "the V5 bug: <path> swallowed the heading");
});
test("mutation test on the real built /products page: clean → pass, inject → FAIL, remove → pass", () => {
  const clean = readFileSync("dist/products.html", "utf8");
  assert.deepEqual(findRepeatedContent(clean), [], "clean page passes");
  assert.ok(clean.includes(S), "fixture sentence exists on the page");
  const injected = clean.replace(S, `${S} ${S}`);
  assert.notEqual(injected, clean, "the mutation really changed the page");
  assert.ok(findRepeatedContent(injected).length > 0, "injected duplicate is caught");
  assert.deepEqual(findRepeatedContent(injected.replace(`${S} ${S}`, S)), [], "removing the injection passes again");
});
