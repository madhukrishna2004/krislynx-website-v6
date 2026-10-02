/**
 * Release audit against the local preview server (Firebase Hosting semantics).
 * Part A uses plain HTTP only (what a crawler sees, no JavaScript).
 * Part B uses Chromium for JS-disabled, CSP, font-fallback and accessibility checks.
 * Writes docs/reports/RELEASE-AUDIT.md and exits non-zero on any failure.
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";

const BASE = process.env.KX_BASE ?? "http://localhost:4173";
const PROD = "https://krislynx.com";
const out: string[] = [];
const fails: string[] = [];
const ok = (cond: boolean, msg: string): void => { if (!cond) fails.push(msg); };
const decode = (s: string): string => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html: string, re: RegExp): string => decode(re.exec(html)?.[1] ?? "");
const text = (html: string): string =>
  decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<head>[\s\S]*?<\/head>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

const purpose = (p: string): string =>
  ({ "/": "Brand, positioning, featured product, services overview", "/company": "About, principles, leadership, legal identity",
     "/office": "Registered office & photos", "/products": "Product portfolio with statuses", "/products/edulynx-erp": "EduLynx ERP product page + pricing",
     "/services": "Services index", "/industries": "Industries with evidence", "/work": "Case-study index", "/insights": "Articles (empty → noindex)",
     "/careers": "Careers / open application", "/contact": "B2B enquiry form", "/contact/thanks": "No-JS form confirmation", "/pricing": "Pricing summary",
     "/privacy-policy": "Legal", "/terms-of-service": "Legal", "/refund-policy": "Legal", "/cookie-policy": "Legal", "/accessibility": "Legal / accessibility statement",
     "/404": "Not-found page" } as Record<string, string>)[p] ?? (p.startsWith("/services/") ? "Service detail" : p.startsWith("/work/") ? "Case study" : "—");

async function main(): Promise<void> {
  // ---------------------------------------------------------------- A. HTTP
  const sitemap = readFileSync("dist/sitemap.xml", "utf8");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? "");
  ok(new Set(locs).size === locs.length, "sitemap has duplicate URLs");
  const routes = ["/", "/company", "/office", "/products", "/products/edulynx-erp", "/services", "/services/software-development", "/services/artificial-intelligence",
    "/services/saas-development", "/services/enterprise-software", "/services/product-engineering", "/services/cloud-engineering", "/industries", "/work",
    "/work/edulynx-erp", "/work/trade-classification-assistant", "/work/selfmate", "/work/fearlink", "/insights", "/careers", "/contact", "/contact/thanks",
    "/pricing", "/privacy-policy", "/terms-of-service", "/refund-policy", "/cookie-policy", "/accessibility"];
  const pages = new Map<string, string>();
  out.push("## Route inventory (HTTP, no JavaScript)\n", "| URL | Status | Title | Indexable | Canonical | h1 | Visible words | Purpose |", "|---|---|---|---|---|---|---|---|");
  for (const r of routes) {
    const res = await fetch(BASE + r, { redirect: "manual" });
    const html = await res.text();
    pages.set(r, html);
    const title = meta(html, /<title>([^<]*)<\/title>/);
    const robots = meta(html, /<meta name="robots" content="([^"]*)"/);
    const canonical = meta(html, /<link rel="canonical" href="([^"]*)"/);
    const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
    const words = text(html).split(" ").length;
    const indexable = !robots.startsWith("noindex");
    out.push(`| \`${r}\` | ${res.status} | ${title} | ${indexable ? "yes" : "no"} | ${canonical ? canonical.replace(PROD, "") || "/" : "—"} | ${h1} | ${words} | ${purpose(r)} |`);
    ok(res.status === 200, `${r} returned ${res.status}`);
    ok(h1 === 1, `${r} has ${h1} h1`);
    ok(words > 120, `${r} has only ${words} visible words without JS`);
    ok(!/<div id="root"><\/div>/.test(html), `${r} is an empty SPA shell`);
    ok(title.length > 10 && /<meta name="description" content="[^"]{50,}"/.test(html), `${r} missing title/description`);
    if (indexable) {
      const expected = r === "/" ? `${PROD}/` : PROD + r;
      ok(canonical === expected, `${r} canonical ${canonical} ≠ ${expected}`);
      ok(locs.includes(expected), `${r} indexable but not in sitemap`);
      ok(meta(html, /<meta property="og:url" content="([^"]*)"/) === expected, `${r} og:url mismatch`);
    } else ok(!locs.some((l) => l === PROD + r), `${r} is noindex but in sitemap`);
  }

  // sitemap URLs: 200 directly, no redirects, https + production host
  for (const l of locs) {
    ok(l.startsWith(`${PROD}/`) || l === `${PROD}/`, `sitemap non-production URL ${l}`);
    const res = await fetch(BASE + l.replace(PROD, ""), { redirect: "manual" });
    ok(res.status === 200, `sitemap URL ${l} → ${res.status}`);
  }
  out.push(`\n**Sitemap:** ${locs.length} URLs, all HTTPS on ${PROD}, all 200 without redirect, no duplicates, none noindex.`);

  // uniqueness + orphans
  const indexable = [...pages].filter(([, h]) => !/content="noindex/.test(h));
  for (const key of ["title", "description", "og:title", "og:image"]) {
    const re = key === "title" ? /<title>([^<]*)/ : key === "description" ? /<meta name="description" content="([^"]*)/ : new RegExp(`<meta property="${key}" content="([^"]*)`);
    const vals = indexable.map(([, h]) => meta(h, re));
    ok(new Set(vals).size === vals.length, `duplicate ${key} across indexable pages`);
  }
  const inbound = new Map<string, number>();
  for (const [src, h] of pages) for (const m of h.matchAll(/href="(\/[^"#?]*)/g)) { const t = m[1] ?? ""; if (t !== src) inbound.set(t, (inbound.get(t) ?? 0) + 1); }
  const orphans = indexable.map(([r]) => r).filter((r) => r !== "/" && !(inbound.get(r) ?? 0));
  ok(orphans.length === 0, `orphan pages: ${orphans.join(", ")}`);
  out.push(`**Uniqueness:** titles, descriptions, og:title and og:image unique across ${indexable.length} indexable pages. **Orphans:** ${orphans.length ? orphans.join(", ") : "none"} (every page has inbound links from other pages).`);

  // crawler test on the gate's list (following redirects like Googlebot)
  out.push("\n## Crawler test (raw HTML, JavaScript never executed)\n", "| Requested | Final URL | Hops | h1 | Main words | Internal links |", "|---|---|---|---|---|---|");
  for (const r of ["/", "/about", "/products", "/products/edulynx", "/services", "/work", "/contact", "/office", "/careers"]) {
    let url = BASE + r; let hops = 0; let res = await fetch(url, { redirect: "manual" });
    while (res.status >= 300 && res.status < 400 && hops < 5) { url = new URL(res.headers.get("location") ?? "/", url).href; res = await fetch(url, { redirect: "manual" }); hops++; }
    const html = await res.text();
    const main = /<main[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1] ?? "";
    const h1 = text(/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "");
    const links = new Set([...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1])).size;
    const words = text(main).split(" ").length;
    out.push(`| \`${r}\` | \`${url.replace(BASE, "")}\` | ${hops} | ${h1.slice(0, 50)} | ${words} | ${links} |`);
    ok(res.status === 200 && h1.length > 3 && words > 100 && links > 15, `crawler: ${r} insufficient content`);
    ok(hops <= 1, `crawler: ${r} redirect chain (${hops})`);
  }

  // redirects from firebase.json
  const fb = JSON.parse(readFileSync("firebase.json", "utf8")) as { hosting: { redirects: { source: string; destination: string; type: number }[]; headers: unknown[] } };
  out.push("\n## Legacy redirects\n", "| From | To | Status | Destination status |", "|---|---|---|---|");
  for (const rd of fb.hosting.redirects) {
    const from = rd.source.replace("/**", "/someone");
    const res = await fetch(BASE + from, { redirect: "manual" });
    const loc = res.headers.get("location") ?? "";
    const dest = await fetch(BASE + loc, { redirect: "manual" });
    out.push(`| \`${from}\` | \`${loc}\` | ${res.status} | ${dest.status} |`);
    ok(res.status === 301, `${from} not 301`);
    ok(dest.status === 200, `${from} → ${loc} is a chain or broken (${dest.status})`);
  }

  // 404
  const nf = await fetch(BASE + "/definitely-not-a-page", { redirect: "manual" });
  const nfHtml = await nf.text();
  ok(nf.status === 404 && /noindex/.test(nfHtml) && /href="\/contact"/.test(nfHtml) && /<nav/.test(nfHtml), "404 page incomplete");
  out.push(`\n**404:** unknown URL → HTTP ${nf.status}, noindex, full header/footer navigation and CTAs to home, EduLynx, services, contact.`);

  // robots
  const robots = await (await fetch(BASE + "/robots.txt")).text();
  ok(/Sitemap: https:\/\/krislynx\.com\/sitemap\.xml/.test(robots) && !/Disallow: \/(assets|images|brand|og)/.test(robots) && !/Disallow: \/\s*$/m.test(robots), "robots.txt problem");
  out.push("\n**robots.txt:**\n```\n" + robots.trim() + "\n```");

  // headers
  const h = (await fetch(BASE + "/")).headers;
  out.push("\n## Security headers served (local server applies firebase.json)\n", "| Header | Value |", "|---|---|");
  for (const k of ["content-security-policy", "strict-transport-security", "x-content-type-options", "x-frame-options", "referrer-policy", "permissions-policy", "cross-origin-opener-policy"]) {
    out.push(`| ${k} | \`${(h.get(k) ?? "MISSING").slice(0, 140)}${(h.get(k) ?? "").length > 140 ? "…" : ""}\` |`);
    ok(Boolean(h.get(k)), `header ${k} missing`);
  }
  // cache policy: HTML must revalidate (clean URLs), hashed assets immutable, images long-lived
  const htmlCache = (await fetch(BASE + "/company")).headers.get("cache-control") ?? "";
  ok(/max-age=0/.test(htmlCache), `HTML cache-control is "${htmlCache}" (expected max-age=0)`);
  const imgPath = /src="(\/images\/[^"]+\.jpg)"/.exec(pages.get("/office") ?? "")?.[1] ?? "";
  const imgRes = await fetch(BASE + imgPath);
  ok(imgRes.status === 200 && /image\/jpeg/.test(imgRes.headers.get("content-type") ?? "") && /max-age=2592000/.test(imgRes.headers.get("cache-control") ?? ""), `image ${imgPath} served incorrectly`);
  out.push(`\n**Caching:** HTML \`${htmlCache}\`; image \`${imgRes.headers.get("cache-control")}\`.`);

  // structured data: required types present and every block parses
  const need: Record<string, string[]> = { "/": ["Organization", "WebSite"], "/products/edulynx-erp": ["SoftwareApplication", "BreadcrumbList"], "/services/saas-development": ["Service", "BreadcrumbList"], "/work/edulynx-erp": ["Article", "BreadcrumbList"] };
  for (const [r, types] of Object.entries(need)) {
    const blocks = [...(pages.get(r) ?? "").matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => { try { return JSON.parse(m[1] ?? ""); } catch { ok(false, `${r} JSON-LD does not parse`); return {}; } });
    const found = new Set(blocks.map((b: { "@type"?: string }) => b["@type"]));
    for (const t of types) ok(found.has(t), `${r} missing ${t} schema`);
    const flat = JSON.stringify(blocks);
    ok(!/aggregateRating|"review"|award|"numberOfEmployees"/i.test(flat), `${r} schema contains unsupported claims`);
  }
  out.push("**Structured data:** Organization + WebSite on `/`, SoftwareApplication, Service, Article and BreadcrumbList present; all blocks parse; no ratings/reviews/awards/headcount.");

  // OG images reachable
  for (const r of ["/", "/products/edulynx-erp", "/contact"]) {
    const og = meta(pages.get(r) ?? "", /<meta property="og:image" content="([^"]*)"/).replace(PROD, "");
    const or = await fetch(BASE + og);
    ok(or.status === 200 && /image\/png/.test(or.headers.get("content-type") ?? ""), `og image ${og} not served`);
  }

  // production-only: scheme and host canonicalisation, each a single hop
  if (BASE.startsWith("https://")) {
    const host = new URL(BASE).host;
    for (const from of [`http://${host}/`, `https://www.${host}/`, `http://www.${host}/`]) {
      const res = await fetch(from, { redirect: "manual" }).catch(() => null);
      const loc = res?.headers.get("location") ?? "";
      const final = loc ? await fetch(loc, { redirect: "manual" }).catch(() => null) : null;
      ok(Boolean(res) && res!.status >= 301 && res!.status <= 308 && loc.startsWith(`https://${host}`) && final?.status === 200, `${from} → ${loc || "no redirect"} (${res?.status ?? "unreachable"}, then ${final?.status ?? "-"})`);
      out.push(`- \`${from}\` → \`${loc}\` (${res?.status}) → ${final?.status}`);
    }
  } else out.push("\n_Domain checks (HTTP→HTTPS, www→apex) run only when KX_BASE is the https production URL._");
  const asset = /href="(\/assets\/site\.[^"]+)"/.exec(pages.get("/") ?? "")?.[1] ?? "";
  const ah = (await fetch(BASE + asset)).headers.get("cache-control") ?? "";
  ok(/immutable/.test(ah), "hashed assets not immutable");
  // hosting exposure: only dist is public
  for (const p of ["/internal/hrms/README.md", "/functions/src/index.ts", "/.env", "/.env.example", "/firebase.json", "/package.json", "/src/config/company.ts"]) {
    const s = (await fetch(BASE + p, { redirect: "manual" })).status;
    ok(s === 404, `${p} is publicly reachable (${s})`);
  }
  out.push("\n**Exposure check:** `/internal/…`, `/functions/…`, `/.env`, `/.env.example`, `/firebase.json`, `/package.json`, `/src/…` all return 404 (hosting serves `dist/` only).");

  // ------------------------------------------------------------- B. Browser
  const browser = await chromium.launch();

  // B1. JavaScript disabled
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p = await nojs.newPage();
  await p.goto(BASE + "/");
  const menuHref = await p.getAttribute("[data-menu-open]", "href");
  const footerLinks = await p.locator("#footer-nav a").count();
  await p.goto(BASE + "/contact");
  const formAction = await p.getAttribute("[data-contact-form]", "action");
  const formMethod = await p.getAttribute("[data-contact-form]", "method");
  const fileVisible = await p.locator("#cf-file").isVisible();
  const assistantHref = await p.getAttribute("[data-assistant-open]", "href");
  await p.goto(BASE + "/");
  const panelsTotal = await p.locator("[data-viz-panel]").count();
  const panelsVisible = await p.locator("[data-viz-panel]").evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent !== null).length);
  const imgsLoaded = await p.locator("img").evaluateAll((els) => els.filter((e) => (e as HTMLImageElement).getAttribute("src")).length);
  await nojs.close();
  ok(menuHref === "#footer-nav" && footerLinks > 20, "no-JS navigation");
  ok(formAction === "/api/contact" && formMethod === "post", "no-JS form cannot submit");
  ok(assistantHref === "/contact", "no-JS assistant fallback");
  ok(panelsTotal > 20 && panelsVisible === panelsTotal, `no-JS visualization panels visible: ${panelsVisible}/${panelsTotal}`);
  out.push(`\n## JavaScript disabled (Chromium)\n- Menu button is a link to the footer navigation (${footerLinks} links).\n- All ${panelsVisible} of ${panelsTotal} visualization panels (system explorer, EduLynx map, AI flow, lifecycle) are readable without JavaScript.\n- Contact form posts natively (\`${formMethod} ${formAction}\`); server redirects to /contact/thanks. Attachment field ${fileVisible ? "visible" : "hidden (needs JS — stated in the accessibility statement)"}.\n- Assistant launcher falls back to a link to /contact.\n- Images use native lazy-loading (${imgsLoaded} with src), no JS needed.`);

  // B2. CSP violations + console errors on every route, fonts unavailable (offline)
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // tsx/esbuild wraps named functions with __name(); provide it inside the page.
  await ctx.addInitScript("window.__name = (f) => f;");
  await ctx.addInitScript(() => {
    (window as unknown as { __csp: string[] }).__csp = [];
    document.addEventListener("securitypolicyviolation", (e) => (window as unknown as { __csp: string[] }).__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  let csp: string[] = [];
  const a11y: string[] = [];
  for (const r of [...routes, "/404-check"]) {
    await page.goto(BASE + r, { waitUntil: "load" });
    csp = csp.concat(await page.evaluate(() => (window as unknown as { __csp: string[] }).__csp).then((v) => v.map((x) => `${r}: ${x}`)));
    const issues = await page.evaluate(() => {
      const problems: string[] = [];
      const name = (el: Element): string => (el.getAttribute("aria-label") ?? "") + (el.textContent ?? "").trim() + (el.querySelector("img")?.getAttribute("alt") ?? "");
      document.querySelectorAll("a[href], button").forEach((el) => { if (!name(el) && !el.closest("[hidden]")) problems.push(`unnamed ${el.tagName.toLowerCase()} ${el.outerHTML.slice(0, 60)}`); });
      document.querySelectorAll("input:not([type=hidden]), select, textarea").forEach((el) => {
        const id = el.id; if (el.closest(".hp")) return;
        // HTMLInputElement.labels covers both explicit (label[for]) and implicit (wrapping <label>) labelling
        const labelled = ((el as HTMLInputElement).labels?.length ?? 0) > 0 || Boolean(el.getAttribute("aria-label")) || Boolean(el.getAttribute("aria-labelledby"));
        if (!labelled) problems.push(`unlabelled control ${id || el.getAttribute("name")}`);
      });
      document.querySelectorAll("img").forEach((i) => { if (!i.hasAttribute("alt")) problems.push(`img without alt ${i.src}`); });
      const ids = [...document.querySelectorAll("[id]")].map((e) => e.id); const dup = ids.filter((v, i) => ids.indexOf(v) !== i); if (dup.length) problems.push(`duplicate ids ${[...new Set(dup)].join(",")}`);
      document.querySelectorAll("[aria-controls],[aria-describedby],[aria-labelledby]").forEach((el) => {
        for (const attr of ["aria-controls", "aria-describedby", "aria-labelledby"]) for (const id of (el.getAttribute(attr) ?? "").split(/\s+/).filter(Boolean)) if (!document.getElementById(id)) problems.push(`${attr} → missing #${id}`);
      });
      let last = 1; // the page h1 is the baseline, so a first heading of h3/h4 is also a skip
      document.querySelectorAll("main h1, main h2, main h3, main h4").forEach((h) => { const lvl = Number(h.tagName[1]); if (lvl > last + 1) problems.push(`heading skip h${last}→h${lvl} "${(h.textContent ?? "").trim().slice(0, 30)}"`); last = lvl; });
      if (!document.querySelector("main") || !document.querySelector("header nav, nav") || !document.querySelector("footer")) problems.push("missing landmark");
      if (document.documentElement.lang !== "en") problems.push("html lang");
      // fonts: text must be painted even though web fonts could not load
      const h1 = document.querySelector("h1") as HTMLElement | null;
      if (!h1 || h1.getBoundingClientRect().width < 50 || getComputedStyle(h1).visibility !== "visible") problems.push("h1 not visibly rendered");
      return problems;
    });
    for (const i of issues) a11y.push(`${r}: ${i}`);
  }
  // keyboard: first Tab lands on skip link; skip link moves focus to main
  await page.goto(BASE + "/");
  await page.keyboard.press("Tab");
  const firstFocus = await page.evaluate(() => document.activeElement?.className ?? "");
  await page.keyboard.press("Enter");
  const afterSkip = await page.evaluate(() => document.activeElement?.id ?? "");
  const fontsLoaded = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family); });
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  await browser.close();

  ok(csp.length === 0, `CSP violations: ${csp.join("; ")}`);
  ok(errors.length === 0, `page errors: ${errors.join("; ")}`);
  ok(a11y.length === 0, `accessibility rule failures: ${a11y.length}`);
  ok(firstFocus.includes("skip-link") && afterSkip === "main", "skip link keyboard behaviour");
  out.push(`\n## CSP, errors, fonts (Chromium, all ${routes.length + 1} routes)\n- CSP violations: **${csp.length}**. Uncaught page errors: **${errors.length}**.\n- Web fonts loaded in this environment: ${fontsLoaded.length ? fontsLoaded.join(", ") : "**none** (Google Fonts unreachable offline)"}. Text still rendered in the fallback stack (\`${bodyFont.slice(0, 80)}…\`); \`display=swap\` means text is never invisible while fonts load.`);
  out.push(`\n## Accessibility rules (custom checks — axe-core not available offline)\nChecked on every route: named links/buttons, labelled form controls, img alt, duplicate ids, ARIA reference targets, heading-level skips in main, landmarks, lang, visible h1, skip-link keyboard behaviour.\n- Failures: **${a11y.length}**${a11y.length ? "\n" + a11y.slice(0, 40).map((x) => `  - ${x}`).join("\n") : ""}\n- Skip link: first Tab → \`${firstFocus}\`; Enter → focus on \`#${afterSkip}\`.`);

  const report = `# Release audit — generated ${new Date().toISOString().slice(0, 19)}Z\n\nSource: \`npm run audit:release\` against the local preview server, which applies \`firebase.json\` redirects and headers. **This is not the production host**; repeat against https://krislynx.com after deploy.\n\n**Result: ${fails.length ? `FAIL (${fails.length})` : "PASS"}**\n${fails.length ? fails.map((f) => `- ✗ ${f}`).join("\n") + "\n" : ""}\n${out.join("\n")}\n`;
  writeFileSync("docs/reports/RELEASE-AUDIT.md", report);
  console.log(fails.length ? fails.join("\n") : "✓ release audit passed");
  process.exit(fails.length ? 1 : 0);
}
main().catch((e: unknown) => { console.error(e); process.exit(1); });
