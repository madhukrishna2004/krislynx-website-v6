/**
 * Controlled production test of the contact pipeline:
 *   browser-equivalent request → /api/contact → validation → spam checks → rate limit → Firestore → Resend.
 *
 * Usage (after deploy):  KX_BASE=https://krislynx.com KX_LIVE_TEST=yes npm run test:live-contact
 * Optional: KX_SKIP_RATE=1 to skip the rate-limit step (it uses up this IP's 5-per-24h quota).
 *
 * Creates at most ONE real enquiry, marked "[KX-RELEASE-TEST <id>]". Delete it from Firestore afterwards.
 * Automated here: HTTP behaviour. Must be confirmed by a person: the Firestore record and the email.
 */
const BASE = process.env.KX_BASE ?? "";
const selfTest = process.env.KX_SELFTEST === "1"; // local run against real handlers + in-memory fakes
if ((!BASE.startsWith("https://") && !selfTest) || process.env.KX_LIVE_TEST !== "yes") {
  console.error("Refusing to run: set KX_BASE=https://<production host> and KX_LIVE_TEST=yes");
  process.exit(2);
}
const run = `KX-RELEASE-TEST ${new Date().toISOString().replace(/[:.]/g, "")}`;
const valid = {
  name: "Release Test", email: "info@krislynx.com", company: "KrisLynx release test", country: "IN", need: "other",
  details: `[${run}] Controlled production test of the contact pipeline. Safe to delete.`, consent: "yes",
  started: String(Date.now() - 10_000), tz: "Asia/Kolkata", source: "release-test",
};
let failures = 0;
const check = (name: string, ok: boolean, detail = ""): void => { console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`); if (!ok) failures++; };
const post = async (body: unknown, raw = false): Promise<{ status: number; json: Record<string, unknown> }> => {
  const res = await fetch(`${BASE}/api/contact`, { method: "POST", headers: { "content-type": "application/json", origin: BASE }, body: raw ? String(body) : JSON.stringify(body) });
  return { status: res.status, json: (await res.json().catch(() => ({}))) as Record<string, unknown> };
};

async function main(): Promise<void> {
  // 4. no secret reaches the browser
  const home = await (await fetch(BASE)).text();
  const js = /src="(\/assets\/app\.[^"]+\.js)"/.exec(home)?.[1] ?? "";
  const bundle = await (await fetch(BASE + js)).text();
  check("no secret in browser bundle", !/re_[A-Za-z0-9]{20,}|RESEND|IP_HASH_SALT|api\.resend\.com/.test(bundle + home), js);

  // 5. invalid / malformed requests rejected
  check("malformed JSON rejected", [400, 422].includes((await post("{not json", true)).status));
  const bad = await post({ ...valid, email: "not-an-email", name: "" });
  check("invalid enquiry → 422 with field errors", bad.status === 422 && Boolean((bad.json.errors as Record<string, string>)?.email), JSON.stringify(bad.json.errors ?? {}));
  const get = await fetch(`${BASE}/api/contact`);
  check("GET rejected", get.status === 405 || get.status === 404, String(get.status));

  // 8. attachment limits (validation happens before any write)
  const exe = await post({ ...valid, attachment: { name: "x.exe", type: "application/x-msdownload", data: "TVqQ" } });
  check("unsupported attachment type → 422", exe.status === 422);
  const big = await post({ ...valid, attachment: { name: "big.pdf", type: "application/pdf", data: "A".repeat(6 * 1024 * 1024) } });
  check("attachment over 4 MB rejected", big.status === 422 || big.status === 413, String(big.status));

  // 6. spam: silently accepted, must NOT be stored or emailed (confirm manually below)
  const hp = await post({ ...valid, website: "http://spam.example", details: `[${run} HONEYPOT] must not be stored` });
  check("honeypot → silent 200", hp.status === 200);
  const fast = await post({ ...valid, started: String(Date.now()), details: `[${run} TOO-FAST] must not be stored` });
  check("too-fast submission → silent 200", fast.status === 200);

  // 1–3. one real enquiry
  const good = await post(valid);
  check("valid enquiry accepted", good.status === 200 && good.json.ok === true, `id=${String(good.json.id ?? "none")}`);

  // 7. rate limit (uses remaining quota for this IP)
  if (process.env.KX_SKIP_RATE !== "1") {
    let limited = false;
    for (let i = 0; i < 6 && !limited; i++) {
      // Valid payloads are needed to reach the limiter (validation and spam checks run first).
      // Requests within quota create probe records; the over-quota request stores nothing.
      const r = await post({ ...valid, details: `[${run} RATE ${i}] Rate-limit probe. Safe to delete.` });
      limited = r.status === 429;
    }
    check("rate limit reached (429) within quota + 1 requests", limited);
  }

  console.log(`
Now confirm by hand (these cannot be proven over HTTP):
  2. Firestore → collection "enquiries": a document containing "[${run}]" exists (id ${String(good.json.id ?? "?")}).
     Documents containing "${run} HONEYPOT" or "${run} TOO-FAST" must NOT exist.
     Rate-limit probes ("${run} RATE n") may exist up to the quota; none after the 429.
  3. info@krislynx.com (CONTACT_TO) received "[krislynx.com] KrisLynx release test — Something else"
     From: the CONTACT_FROM sender · Reply-To: info@krislynx.com (the test's synthetic visitor email).
  9. In a browser, submit the form once more on /contact → success message; then (optional) repeat to see the
     rate-limit error message with the email fallback.
Then delete every document containing "${run}" from "enquiries".
`);
  process.exit(failures ? 1 : 0);
}
main().catch((e: unknown) => { console.error(e); process.exit(1); });
