/**
 * POST-DEPLOY DOMAIN CHECK — run from a machine with internet access after deployment:
 *   npm run audit:domain            (defaults to krislynx.com)
 * For http/https × apex/www it follows redirects hop by hop and verifies: permanent redirects only, final URL is
 * exactly https://krislynx.com/, TLS valid (Node rejects invalid certificates), the final page is the NEW site
 * (apex canonical, current legal identity, no LLP content) and reports cache headers (stale-CDN detection).
 * Exit code 1 on any failure.
 */
const apex = process.env.KX_DOMAIN ?? "krislynx.com";
const target = `https://${apex}/`;
const variants = [`http://${apex}`, `http://www.${apex}`, `https://www.${apex}`, `https://${apex}`];
let failed = false;
const bad = (m: string): void => { failed = true; console.log(`  ✗ ${m}`); };

for (const start of variants) {
  console.log(`\n${start}`);
  let url = start; const chain: string[] = []; let res: Response | undefined;
  try {
    for (let hop = 0; hop < 6; hop++) {
      res = await fetch(url, { redirect: "manual", headers: { "user-agent": "kx-domain-check/1.0", "cache-control": "no-cache" } });
      if (res.status >= 300 && res.status < 400) {
        const next = new URL(res.headers.get("location") ?? "", url).toString();
        chain.push(`${res.status} → ${next}`);
        if (![301, 308].includes(res.status)) bad(`non-permanent redirect ${res.status} at ${url}`);
        url = next; continue;
      }
      break;
    }
  } catch (e) { bad(`request failed (TLS/DNS/network): ${(e as Error).message}`); continue; }
  for (const c of chain) console.log(`  ${c}`);
  if (!res) { bad("no response"); continue; }
  const final = url.endsWith("/") ? url : `${url}/`;
  console.log(`  final ${res.status} ${url}`);
  if (final !== target) bad(`final URL ${url} ≠ ${target}`);
  if (chain.length > 2) bad(`redirect chain too long (${chain.length} hops)`);
  if (res.status !== 200) bad(`final status ${res.status}`);
  const html = await res.text();
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "(none)";
  console.log(`  canonical ${canonical}`);
  if (canonical !== target) bad(`canonical is ${canonical}`);
  if (!html.includes("KRISLYNX TECHNOLOGIES PRIVATE LIMITED")) bad("current legal identity missing — old site still served?");
  if (/krislynx\s+llp/i.test(html) || /RKLS/i.test(html)) bad("obsolete LLP/RKLS content served (cache or old host)");
  const h = res.headers;
  console.log(`  cache-control: ${h.get("cache-control") ?? "-"} · age: ${h.get("age") ?? "-"} · x-cache: ${h.get("x-cache") ?? "-"}`);
  if (!h.get("strict-transport-security")) bad("missing Strict-Transport-Security");
  if (/^https:/.test(url) && /src="http:\/\//.test(html)) bad("mixed content (http:// subresource)");
}
// discovery files on the canonical host (brief §75): must be 200 with the right type, no redirect
console.log("\ndiscovery files");
for (const [path, type] of [["/robots.txt", "text/plain"], ["/sitemap.xml", "xml"], ["/favicon.ico", "icon"], ["/favicon.svg", "svg"], ["/manifest.webmanifest", "manifest"], ["/apple-touch-icon.png", "png"], ["/brand/krislynx-logo-512.png", "png"]] as const) {
  try {
    const r = await fetch(`${target.replace(/\/$/, "")}${path}`, { redirect: "manual" });
    const ct = r.headers.get("content-type") ?? "";
    console.log(`  ${r.status} ${path} (${ct})`);
    if (r.status !== 200) bad(`${path} returned ${r.status}`);
    else if (!ct.includes(type) && !(type === "icon" && /image/.test(ct))) bad(`${path} unexpected content-type ${ct}`);
  } catch (e) { bad(`${path}: ${(e as Error).message}`); }
}
console.log(failed ? "\n✗ domain check FAILED" : `\n✓ all variants resolve to ${target} (new site, apex canonical, HTTPS)`);
process.exit(failed ? 1 : 0);
export {};
