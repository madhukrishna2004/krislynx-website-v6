/**
 * DESIGN FREEZE GUARD (accepted baseline: V3.3, 26 Sep 2026).
 * Visual changes are allowed only for factual corrections, supplied assets, accessibility, responsive,
 * compatibility, performance or security defects. These tests make the frozen decisions explicit so an
 * accidental redesign fails CI. To change a frozen value deliberately, update the value here in the same commit
 * and record why in docs/VISUAL-TRANSFORMATION.md.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const css = readdirSync("src/styles").filter((f) => f.endsWith(".css")).map((f) => [f, readFileSync(join("src/styles", f), "utf8")] as const);
const base = readFileSync("src/styles/base.css", "utf8");

test("every font-size uses a typography role token (only exception: the logo lockup descriptor)", () => {
  const offenders: string[] = [];
  for (const [f, t] of css)
    for (const m of t.matchAll(/font-size:\s*([^;}]+)/g)) {
      const v = (m[1] ?? "").trim();
      const ok = /^var\(--(type|fs)-[a-z0-9-]+\)$/.test(v) || v === "inherit" || /em$/.test(v) && !/rem$/.test(v) || v === "100%";
      if (!ok && v !== "0.56rem") offenders.push(`${f}: font-size: ${v}`);
    }
  assert.deepEqual(offenders, [], "use an existing --type-* role");
});

test("the 11 typography roles are defined", () => {
  for (const r of ["micro", "label", "small", "body", "body-large", "subhead", "title", "section", "display", "hero", "product"])
    assert.match(base, new RegExp(`--type-${r}:`), r);
});

test("frozen scale: hero ~100px (owner 27 Sep 2026: editorial, not poster), EduLynx 144px ceiling, section 53px ceiling", () => {
  assert.match(base, /--type-hero: clamp\(3rem, 1\.4rem \+ 5\.4vw, 6\.6rem\);/);
  assert.match(base, /--type-product: clamp\(3\.2rem, 1\.2rem \+ 8vw, 9rem\);/);
  assert.match(base, /--type-section: clamp\(2\.05rem, 1\.25rem \+ 2\.3vw, 3\.3rem\);/);
});

test("frozen palette (V3 technical humanism): rooms and core surfaces", () => {
  for (const [k, v] of [["--bg", "#0a0d0c"], ["--room-warm", "#f4f1ea"], ["--room-ice", "#eaf3fd"], ["--room-mint", "#e4f6eb"], ["--room-lilac", "#f0ecfd"]])
    assert.match(base, new RegExp(`${k}: ${v};`), k);
});

test("frozen font families: Instrument Sans + Geist Mono (owner 27 Sep 2026: Bricolage removed)", () => {
  const faces = [...base.matchAll(/@font-face \{ font-family: "([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(faces)].sort(), ["Geist Mono", "Instrument Sans"]);
});

test("no animation/3D libraries introduced", () => {
  const pkg = readFileSync("package.json", "utf8");
  for (const lib of ["three", "lottie", "gsap", "framer-motion", "pixi", "babylon"]) assert.ok(!pkg.includes(lib), lib);
});

/* ─────────────────────────── V2 design-system guards (27 Sep 2026) ─────────────────────────── */
const allCss = css.map(([, t]) => t).join("\n");

test("V2 motion: no generic fade-up — entrance motion never translates on the Y axis", () => {
  const reveal = [...allCss.matchAll(/\[data-reveal[^{]*\{([^}]*)\}/g)].map((m) => m[1] ?? "").join("\n");
  assert.doesNotMatch(reveal, /translateY/, "reveal must not use translateY (the generic 'AI site' effect)");
});

test("V2 motion: tokens defined, smooth scrolling only when motion is allowed", () => {
  for (const t of ["--m-micro", "--m-ui", "--m-section", "--m-large"]) assert.match(allCss, new RegExp(`${t}:`), t);
  const smooth = allCss.indexOf("scroll-behavior: smooth");
  assert.ok(smooth > 0, "smooth anchor scrolling");
  assert.ok(allCss.lastIndexOf("prefers-reduced-motion: no-preference", smooth) > allCss.lastIndexOf("}", smooth) - 400, "smooth scrolling is inside a no-preference block");
});

test("V2 navigation: Products · Services · Technology · Work · Company, and /technology is a real page", () => {
  const nav = readFileSync("src/config/navigation.ts", "utf8");
  const primary = nav.slice(nav.indexOf("primaryNav"), nav.indexOf("];", nav.indexOf("primaryNav")));
  assert.deepEqual([...primary.matchAll(/label: "([^"]+)"/g)].map((m) => m[1]), ["Products", "Services", "Technology", "Work", "Company"]);
  assert.ok(readFileSync("dist/technology.html", "utf8").includes("<h1"), "/technology renders");
});

test("V2 office: no public placeholder photos", () => {
  assert.doesNotMatch(readFileSync("dist/office.html", "utf8"), /photo to be added/i);
});

test("V2 social cards: OG template uses the site font and current headline", () => {
  const og = readFileSync("scripts/og.ts", "utf8");
  assert.doesNotMatch(og, /Engineering intelligent technology|Saira|IBM Plex|#0A1428/);
  assert.match(og, /instrument-sans-700-v1\.woff2/);
});

/* ─────────────────────────── V2.1 guards ─────────────────────────── */
test("V2.1 architecture: accessible disclosure — native buttons, aria-expanded/controls, Interface open by default, no-JS shows all", () => {
  const html = readFileSync("dist/technology.html", "utf8");
  const btns = html.match(/<button type="button" class="arch3__layer[^"]*"[^>]*>/g) ?? [];
  assert.equal(btns.length, 6, "six layer buttons");
  for (const b of btns) { assert.match(b, /aria-expanded="(true|false)"/); assert.match(b, /aria-controls="arch-panel-/); }
  assert.equal(btns.filter((b) => b.includes('aria-expanded="true"')).length, 1);
  assert.match(btns[0] ?? "", /arch-btn-interface/);
  assert.equal((html.match(/data-arch-panel="/g) ?? []).length, 6, "every layer's detail is in the HTML (readable without JS)");
  assert.match(allCss, /\.js \.arch3__panel\[data-inactive\] \{ display: none; \}/, "panels only hide when JS runs");
});
test("V2.1 architecture: signal motion only when motion is allowed; mobile keeps DOM order (accordion)", () => {
  const gen = readFileSync("src/components/viz.tsx", "utf8");
  assert.match(gen, /prefers-reduced-motion: no-preference\)\{\.arch3\[data-active=/);
  assert.match(gen, /@media \(min-width:64rem\)\{" \+ archLayers\.map/, "grid-row placement is desktop-only");
});
test("V2.1: hero interaction response ≤ 200ms; 404 is a technical recovery page; assistant boundary wording", () => {
  assert.match(allCss, /\.hc\[data-active\] \.hc__node \{ transition: opacity var\(--m-micro\)/);
  assert.match(allCss, /--m-micro: 160ms/);
  const nf = readFileSync("dist/404.html", "utf8");
  assert.match(nf, /system path not found/); assert.match(nf, /Return to KrisLynx/); assert.doesNotMatch(nf, /Oops/i);
  assert.match(readFileSync("src/config/assistant.ts", "utf8"), /I don't have verified information about that\./);
});
test("V2.1 a11y: no `transition: all` (it animates focus outlines in, delaying the focus indicator)", () => {
  assert.doesNotMatch(allCss, /transition:\s*all\b/);
});

/* ─────────────────────────── V4 guards ─────────────────────────── */
test("V4 experience state is session-only and local: no localStorage, cookies or network in experience.ts", () => {
  const src = readFileSync("src/client/experience.ts", "utf8");
  assert.match(src, /sessionStorage/);
  assert.doesNotMatch(src, /localStorage|document\.cookie|fetch\(|sendBeacon|XMLHttpRequest|track\(/);
});
test("V4 KX Navigator index: only real public pages (no hidden/noindex routes), same-origin, small", () => {
  const idx = JSON.parse(readFileSync("dist/navigator.json", "utf8")) as { u: string }[];
  assert.ok(idx.length >= 30 && readFileSync("dist/navigator.json").length < 20000);
  for (const i of idx) assert.doesNotMatch(i.u, /leadership|thanks|404|^https?:/, i.u);
});
test("V4 view transitions are motion-gated and never delay navigation (≤ 250ms)", () => {
  assert.match(allCss, /prefers-reduced-motion: no-preference\) \{\n  @view-transition \{ navigation: auto; \}/);
  assert.match(allCss, /::view-transition-new\(root\) \{ animation-duration: 200ms;/);
});
test("V4 assistant: hand-off, cards and navigation commands exist; fallback offers navigation", () => {
  const cfg = readFileSync("src/config/assistant.ts", "utf8");
  assert.match(cfg, /Let's start with what needs to work\./);
  assert.match(cfg, /commands: \[/);
  assert.match(readFileSync("src/client/assistant/ui.ts", "utf8"), /Explore products/);
});

/* ─────────────────────────── V6.3 product experience guards ─────────────────────────── */
test("V6.3: EduLynx flagship exists with correct name and illustrative-interface disclaimer", () => {
  const edx = readFileSync("dist/products/edulynx-erp.html", "utf8");
  assert.match(edx, /<h1[^>]*>.*EduLynx/s, "H1 contains EduLynx");
  assert.match(edx, /illustrative interface/i, "illustrative disclaimer present");
  assert.match(edx, /Intelligent school management platform/i, "descriptor present");
});
test("V6.3: product ecosystem contains all five approved products, no status labels", () => {
  const p = readFileSync("dist/products.html", "utf8");
  for (const name of ["EduLynx", "SelfMate", "FearLink", "Miyraa", "AP ExportAI"]) assert.ok(p.includes(name), name);
  // check visible text only (not class attributes or meta tags already cleaned)
  const text = p.replace(/<[^>]+>/g, " ");
  assert.doesNotMatch(text, /\b(Research|Concept|Prototype|Coming Soon|Experimental|Internal)\b/i, "visible text");
});
test("V6.3: product constellation SVG is present (not just cards)", () => {
  const p = readFileSync("dist/products.html", "utf8") + readFileSync("dist/index.html", "utf8");
  assert.match(p, /psys__lines/);
});
test("V6.3: EduLynx → Engineering bridge exists on the EduLynx page", () => {
  assert.match(readFileSync("dist/products/edulynx-erp.html", "utf8"), /edx__bridge/);
  assert.match(readFileSync("dist/products/edulynx-erp.html", "utf8"), /From product.*to.*engineering|How we build/i);
});
test("V6.3: screenshot-ready asset directory exists", () => {
  assert.ok(existsSync("public/images/products/edulynx"), "public/images/products/edulynx/ directory");
});
test("V6.3: every product link resolves to a real route", () => {
  const html = readFileSync("dist/products.html", "utf8") + readFileSync("dist/index.html", "utf8");
  const hrefs = [...html.matchAll(/href="(\/products\/[^"]+)"/g)].map((m) => m[1]).filter((h) => !h?.endsWith("/products"));
  for (const h of new Set(hrefs)) {
    if (!h) continue;
    const exists = existsSync(`dist${h}.html`) || existsSync(`dist${h}/index.html`);
    assert.ok(exists, `${h} resolves to a real page`);
  }
});
