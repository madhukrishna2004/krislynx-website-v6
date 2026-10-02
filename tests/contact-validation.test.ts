import { test } from "node:test";
import assert from "node:assert/strict";
import { validateAttachment, validateContact } from "../src/lib/contact-validation";

const valid = {
  name: "Asha Rao", email: "Asha@Example.org", company: "Example Academy", country: "IN", phone: "+91 98765 43210",
  need: "school-erp", details: "We run two schools and need attendance and fees in one place.", consent: "yes",
};

test("accepts a complete enquiry and normalises email", () => {
  const r = validateContact(valid);
  assert.equal(r.ok, true);
  assert.equal(r.value.email, "asha@example.org");
});

test("reports each missing required field", () => {
  const r = validateContact({});
  assert.equal(r.ok, false);
  for (const f of ["name", "email", "company", "country", "need", "details", "consent"]) assert.ok(r.errors[f as keyof typeof r.errors], f);
});

test("rejects unknown select values and bad phone", () => {
  const r = validateContact({ ...valid, country: "XX", need: "hack", budget: "1m", phone: "call me" });
  assert.ok(r.errors.country && r.errors.need && r.errors.budget && r.errors.phone);
});

test("honeypot marks spam", () => {
  assert.equal(validateContact({ ...valid, website: "http://spam" }).spam, true);
});

test("too-fast submission marks spam when timing is checked", () => {
  const now = 1_000_000;
  assert.equal(validateContact({ ...valid, started: String(now - 500) }, { now, checkTiming: true }).spam, true);
  assert.equal(validateContact({ ...valid, started: String(now - 10_000) }, { now, checkTiming: true }).spam, false);
});

test("many links mark spam", () => {
  const details = Array.from({ length: 6 }, (_, i) => `https://x${i}.example`).join(" ");
  assert.equal(validateContact({ ...valid, details }).spam, true);
});

test("control characters are stripped and lengths capped", () => {
  const r = validateContact({ ...valid, name: "Asha\u0000 Rao", company: "C".repeat(500) });
  assert.equal(r.value.name, "Asha  Rao");
  assert.equal(r.value.company.length, 160);
});

test("free-mail address gives a hint, not an error", () => {
  const r = validateContact({ ...valid, email: "asha@gmail.com" });
  assert.equal(r.ok, true);
  assert.ok(r.hints.email);
});

test("attachment rules", () => {
  assert.equal(validateAttachment(null), null);
  assert.equal(validateAttachment({ size: 1000, type: "application/pdf" }), null);
  assert.ok(validateAttachment({ size: 5 * 1024 * 1024, type: "application/pdf" }));
  assert.ok(validateAttachment({ size: 10, type: "application/x-msdownload" }));
});

test("project stage is optional and allow-listed", () => {
  assert.equal(validateContact({ ...valid, stage: "prototype" }).ok, true);
  assert.equal(validateContact({ ...valid }).ok, true);
  assert.ok(validateContact({ ...valid, stage: "moonshot" }).errors.stage);
});
