/**
 * V6.2 — Legal identity audit. Fails the build if the wrong company name, suffix, CIN or address
 * appears anywhere in the public output. This is a permanent regression test: it prevents the
 * LLP/old-name mistake from returning in any future version.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const LEGAL_ENTITY = "KRISLYNX TECHNOLOGIES PRIVATE LIMITED";
const CIN = "U62013AP2026PTC128241";
const REGISTERED_STREET = "H. No. 33/1-108, Noone Palle";

const D = "dist";
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(D).filter((f) => f.endsWith(".html") || f.endsWith(".json") || f.endsWith(".xml") || f.endsWith(".webmanifest") || f.endsWith(".txt"));
const read = (f: string): string => readFileSync(f, "utf8");

// §01: obsolete company identities must not appear
const FORBIDDEN = [
  /\bLLP\b(?!\s*APIs?\b)/i,  // "LLP" as a legal suffix (not inside "LLM APIs" etc.)
  /\bSREE INNOVATIONS\b/i,
  /\bRKLS GROUP/i,
  /\bPVT LTD LLP\b/i,
  /\bPRIVATE LIMITED LLP\b/i,
  /\b\(OPC\)\b/,
];

test("no obsolete company identity in any public file", () => {
  for (const f of files) {
    const text = read(f);
    for (const re of FORBIDDEN) {
      // allow the word "LLP" only in a historical/commentary context inside source code comments — never in rendered HTML
      if (f.endsWith(".html") || f.endsWith(".json") || f.endsWith(".xml")) {
        assert.doesNotMatch(text, re, `${f}: matched ${re}`);
      }
    }
  }
});

test("current legal entity name appears on the homepage and in structured data", () => {
  const home = read(join(D, "index.html"));
  assert.ok(home.includes(LEGAL_ENTITY), "homepage must contain the full legal name");
  assert.match(home, new RegExp(`"legalName":\\s*"${LEGAL_ENTITY}"`), "Organization schema legalName");
});

test("CIN is correct wherever it appears", () => {
  for (const f of files) {
    const text = read(f);
    // if any CIN-shaped string appears, it must be the correct one
    for (const m of text.matchAll(/U\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}/g)) {
      assert.equal(m[0], CIN, `${f}: wrong CIN ${m[0]}`);
    }
  }
});

test("registered address street appears in the footer of every HTML page", () => {
  for (const f of files.filter((x) => x.endsWith(".html") && !x.includes("404"))) {
    assert.ok(read(f).includes(REGISTERED_STREET), `${f}: missing registered address`);
  }
});

test("no mixed-case legal name where the full registered form is required", () => {
  // the mixed-case "KrisLynx Technologies Private Limited" was a V2 bug — it must not return
  for (const f of files.filter((x) => x.endsWith(".html"))) {
    assert.doesNotMatch(read(f), /KrisLynx Technologies Private Limited/, `${f}`);
  }
});
