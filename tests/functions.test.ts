import { test } from "node:test";
import assert from "node:assert/strict";
import { handleAssistant, handleContact, type Deps } from "../functions/src/handlers";

const body = {
  name: "Asha Rao", email: "asha@example.org", company: "Example Academy", country: "IN", need: "ai",
  details: "We need an assistant over our policy documents for staff.", consent: "yes", started: "1000",
};

function deps(over: Partial<Deps> = {}): Deps & { stored: number; sent: number } {
  const d = {
    stored: 0, sent: 0, salt: "s", now: () => 100_000,
    hitRateLimit: async () => 1,
    store: async () => { d.stored++; return "id1"; },
    sendEmail: async () => { d.sent++; },
    ...over,
  };
  return d;
}
const req = (b: unknown, extra: Partial<{ contentType: string; origin: string; method: string }> = {}) => ({
  method: "POST", contentType: "application/json", body: b, ip: "1.2.3.4", ...extra,
});

test("valid JSON enquiry is stored and emailed", async () => {
  const d = deps();
  const r = await handleContact(req(body), d);
  assert.equal(r.status, 200);
  assert.equal(d.stored, 1);
  assert.equal(d.sent, 1);
});

test("invalid enquiry returns 422 with field errors", async () => {
  const r = await handleContact(req({ ...body, email: "nope" }), deps());
  assert.equal(r.status, 422);
  assert.ok((r.json?.errors as Record<string, string>).email);
});

test("honeypot spam gets a fake success and is not stored", async () => {
  const d = deps();
  const r = await handleContact(req({ ...body, website: "x" }), d);
  assert.equal(r.status, 200);
  assert.equal(d.stored, 0);
});

test("rate limit returns 429", async () => {
  const r = await handleContact(req(body), deps({ hitRateLimit: async () => 6 }));
  assert.equal(r.status, 429);
});

test("email failure returns 502 so the visitor can email directly", async () => {
  const r = await handleContact(req(body), deps({ sendEmail: async () => { throw new Error("down"); } }));
  assert.equal(r.status, 502);
});

test("no-JS form post redirects to thanks page", async () => {
  const r = await handleContact(req(body, { contentType: "application/x-www-form-urlencoded" }), deps());
  assert.equal(r.status, 303);
  assert.equal(r.redirect, "/contact/thanks");
});

test("foreign origins are refused", async () => {
  const r = await handleContact(req(body, { origin: "https://evil.example" }), deps());
  assert.equal(r.status, 403);
});

test("oversized attachment is refused", async () => {
  const big = "A".repeat(6 * 1024 * 1024);
  const r = await handleContact(req({ ...body, attachment: { name: "a.pdf", type: "application/pdf", data: big } }), deps());
  assert.equal(r.status, 422);
});

test("assistant endpoint answers from approved KB only", () => {
  const ok = handleAssistant(req({ question: "How much does EduLynx cost?" }));
  assert.match(String(ok.json?.text), /35,000/);
  const fb = handleAssistant(req({ question: "Write me a poem about the sea" }));
  assert.equal(fb.json?.matched, null);
});

test("missing/too-fast timing from a JS client is treated as spam, silently", async () => {
  const d = deps();
  const r = await handleContact(req({ ...body, started: "99900" }), d);
  assert.equal(r.status, 200);
  assert.equal(d.stored, 0);
});

test("malformed request bodies are rejected with 400", async () => {
  for (const b of [null, "not json", 42]) assert.equal((await handleContact(req(b), deps())).status, 400);
});

test("non-POST is rejected", async () => {
  assert.equal((await handleContact(req(body, { method: "GET" }), deps())).status, 405);
});

test("missing name or message returns 422 naming those fields", async () => {
  const r = await handleContact(req({ ...body, name: "", details: "" }), deps());
  const errs = r.json?.errors as Record<string, string>;
  assert.equal(r.status, 422);
  assert.ok(errs.name && errs.details);
});

test("unsupported attachment type is refused", async () => {
  const r = await handleContact(req({ ...body, attachment: { name: "run.exe", type: "application/x-msdownload", data: "TVqQAAMAAAAEAAAA" } }), deps());
  assert.equal(r.status, 422);
});

test("malicious HTML is kept as inert text in a plain-text email", async () => {
  let sent = "";
  const d = deps({ sendEmail: async (m) => { sent = m.text; } });
  const r = await handleContact(req({ ...body, details: "<script>alert(1)</script> please build us a portal" }), d);
  assert.equal(r.status, 200);
  assert.ok(sent.includes("<script>alert(1)</script>"), "stored verbatim as text");
  // the handler only ever sends `text`; there is no HTML body to execute it in
});

test("attachment filename is sanitised", async () => {
  let name = "";
  const d = deps({ sendEmail: async (m) => { name = m.attachment?.name ?? ""; } });
  await handleContact(req({ ...body, attachment: { name: "../../etc/pass<wd>.pdf", type: "application/pdf", data: "JVBERi0=" } }), d);
  assert.doesNotMatch(name, /[<>/]/);
});

test("repeated submissions: 5 allowed, 6th limited", async () => {
  let n = 0;
  const d = deps({ hitRateLimit: async () => ++n });
  const codes: number[] = [];
  for (let i = 0; i < 6; i++) codes.push((await handleContact(req(body), d)).status);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429]);
});

test("email includes the project stage label", async () => {
  let text = "";
  const d = deps({ sendEmail: async (m) => { text = m.text; } });
  await handleContact(req({ ...body, stage: "scaling" }), d);
  assert.match(text, /Stage:\s+Scaling/);
});
