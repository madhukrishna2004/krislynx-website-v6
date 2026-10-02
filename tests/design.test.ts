/** Design-system invariants for the black-glass redesign (run after `npm run build`). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { systemNodes } from "../src/config/system";
import { techLayers } from "../src/config/technology";
import { techFor, featuresOf, relatedModules, moduleConcepts, archLayers, archItems } from "../src/components/viz";
import { edulynx } from "../src/config/products";
import { products } from "../src/config/products";

// ---------- contrast (WCAG 2.x relative luminance)
const lum = (hex: string): number => {
  const c = [0, 2, 4].map((i) => parseInt(hex.slice(1 + i, 3 + i), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * (c[0] ?? 0) + 0.7152 * (c[1] ?? 0) + 0.0722 * (c[2] ?? 0);
};
const ratio = (a: string, b: string): number => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return ((x ?? 0) + 0.05) / ((y ?? 0) + 0.05); };
const pairs: [string, string, string, number][] = [
  // V3 "technical humanism" palette — dark systems
  ["primary light on ink", "#f5f7f5", "#0a0d0c", 4.5], ["text-mid on ink", "#cdd5d0", "#0a0d0c", 4.5], ["secondary light on ink", "#aab5ae", "#0a0d0c", 4.5],
  ["secondary light on deep graphite", "#aab5ae", "#121614", 4.5], ["secondary light on graphite", "#aab5ae", "#1b211e", 4.5], ["text-mid on graphite", "#cdd5d0", "#1b211e", 4.5],
  ["kris mint on ink", "#b9f2d0", "#0a0d0c", 4.5], ["kris mint on graphite (assistant)", "#b9f2d0", "#1b211e", 4.5], ["lavender on ink", "#e8e1ff", "#0a0d0c", 4.5],
  ["ice on ink (UI graphics)", "#dceeff", "#0a0d0c", 3],
  // light environments
  ["primary dark on warm paper", "#101411", "#f4f1ea", 4.5], ["secondary dark on warm paper", "#56615b", "#f4f1ea", 4.5], ["secondary dark on soft white", "#56615b", "#faf9f6", 4.5],
  ["secondary dark on cool paper", "#56615b", "#f1f5f4", 4.5], ["secondary dark on ice room", "#56615b", "#eaf3fd", 4.5], ["secondary dark on mint room", "#56615b", "#e4f6eb", 4.5],
  ["secondary dark on lavender room", "#56615b", "#f0ecfd", 4.5], ["ice ink on ice room", "#2a5a86", "#eaf3fd", 4.5], ["mint ink on mint room", "#1e6b45", "#e4f6eb", 4.5],
  ["lavender ink on lavender room", "#5b4bb8", "#f0ecfd", 4.5], ["mint ink on white panel", "#1e6b45", "#ffffff", 4.5], ["links (ink) on warm paper", "#101411", "#f4f1ea", 4.5],
  ["inverse button: ink on primary light", "#0a0d0c", "#f5f7f5", 4.5], ["focus ring on warm paper (non-text 3:1)", "#1e6b45", "#f4f1ea", 3],
];
for (const [name, fg, bg, min] of pairs) test(`contrast: ${name} ≥ ${min}:1`, () => assert.ok(ratio(fg, bg) >= min, `${ratio(fg, bg).toFixed(2)}:1`));

test("tokens in base.css match the contrast-tested values", () => {
  const css = readFileSync("src/styles/base.css", "utf8");
  for (const [k, v] of [["--bg", "#0a0d0c"], ["--bg-2", "#121614"], ["--surface", "#1b211e"], ["--text-hi", "#f5f7f5"], ["--text-mid", "#cdd5d0"], ["--muted", "#aab5ae"], ["--cyan", "#b9f2d0"],
    ["--mint", "#b9f2d0"], ["--violet", "#e8e1ff"], ["--lilac", "#e8e1ff"], ["--room-warm", "#f4f1ea"], ["--room-ice", "#eaf3fd"], ["--room-mint", "#e4f6eb"], ["--room-lilac", "#f0ecfd"],
    ["--ink-cyan", "#2a5a86"], ["--ink-mint", "#1e6b45"], ["--ink-violet", "#5b4bb8"], ["--signal", "#101411"], ["--text", "#101411"], ["--text-2", "#56615b"], ["--white", "#faf9f6"], ["--paper", "#f1f5f4"]])
    assert.match(css, new RegExp(`${k}: ${v};`), k);
});

// ---------- technology & product truthfulness
const approved = new Set(techLayers.flatMap((l) => l.items));
test("system map technology is derived from technology.ts only", () => {
  for (const n of systemNodes) {
    for (const k of n.tech) assert.ok(techLayers.some((l) => l.key === k), `${n.key}: unknown layer ${k}`);
    for (const t of techFor(n.tech)) assert.ok(approved.has(t), t);
  }
});
test("no unapproved technologies anywhere in rendered pages", () => {
  const html = readdirSync("dist").filter((f) => f.endsWith(".html")).map((f) => readFileSync(join("dist", f), "utf8")).join("\n");
  for (const t of ["Next.js", "FastAPI", "Redis", "Kubernetes", "AWS", "Azure", "Docker", "GraphQL"]) assert.ok(!html.includes(t), t);
});
test("homepage product system: every product visible, EduLynx dominant, TradeSphere withheld (owner decisions 27 Sep 2026)", () => {
  const html = readFileSync("dist/index.html", "utf8");
  const sys = html.slice(html.indexOf('class="psys"'));
  for (const p of products) assert.ok(sys.includes(p.name), p.name);
  assert.match(sys, /class="psys__flag"[\s\S]*?EduLynx ERP/, "EduLynx is the flagship panel");
  assert.ok(!html.includes("TradeSphere"), "TradeSphere name still withheld");
});

test("no public product status labels anywhere (owner decision 27 Sep 2026)", () => {
  const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const q = join(d, f); return statSync(q).isDirectory() ? walk(q) : q.endsWith(".html") ? [q] : []; });
  const bad: string[] = [];
  for (const f of walk("dist")) {
    // the contact form's project-stage chips (Idea / Prototype / …) describe the VISITOR's project, not a product
    const t = readFileSync(f, "utf8").replace(/<label class="choice">[\s\S]*?<\/label>/g, "");
    if (/class="status[ "]/.test(t)) bad.push(`${f}: status badge element`);
    for (const lbl of ["Idea stage", "Not available", "Coming soon", "What each status means"]) if (t.includes(lbl)) bad.push(`${f}: "${lbl}"`);
    for (const lbl of ["Research", "Concept", "In development", "Prototype"]) if (new RegExp(`>\\s*${lbl}\\s*<`).test(t)) bad.push(`${f}: label "${lbl}"`);
  }
  assert.deepEqual(bad, []);
});

test("honesty without labels: only EduLynx is live and links to a product site; concepts stay out of structured data", () => {
  assert.deepEqual(products.filter((p) => p.status === "live").map((p) => p.name), ["EduLynx ERP"]);
  for (const p of products.filter((x) => x.status !== "live")) assert.equal(p.externalUrl, undefined, `${p.name} must not link to a product site`);
  const page = readFileSync("dist/products.html", "utf8");
  const schema = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("");
  for (const c of products.filter((p) => p.status === "concept")) assert.ok(!schema.includes(c.name), `${c.name} must not be in structured data`);
});
test("EduLynx widget titles come from approved module text", () => {
  assert.deepEqual(featuresOf("Profiles, enrolment, medical and transport details, bulk import."), ["Profiles", "Enrolment", "Medical and transport details", "Bulk import"]);
});

// ---------- copy: no AI-cliché marketing language in rendered text
test("rendered copy avoids generic AI-marketing phrases", () => {
  const text = readdirSync("dist").filter((f) => f.endsWith(".html")).map((f) => readFileSync(join("dist", f), "utf8").replace(/<[^>]+>/g, " ")).join("\n");
  for (const p of ["unlock the future", "revolutionary", "next-generation", "transform your business", "where innovation meets", "empowering businesses", "cutting-edge", "seamless", "game-changing", "synergy"])
    assert.ok(!text.toLowerCase().includes(p), p);
});

// ---------- fonts
test("fonts are self-hosted, licensed, and no Google Fonts remain", () => {
  for (const f of ["instrument-sans-400-v1.woff2", "instrument-sans-700-v1.woff2", "geist-mono-400-v1.woff2"]) assert.ok(existsSync(join("public/fonts", f)), f);
  for (const l of ["InstrumentSans-OFL.txt", "GeistMono-OFL.txt"]) assert.ok(existsSync(join("public/fonts", l)), l);
  assert.ok(!readdirSync("public/fonts").some((f) => /bricolage/i.test(f)), "old display font fully removed");
  const home = readFileSync("dist/index.html", "utf8");
  assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(home), "no Google Fonts link");
  const csp = JSON.stringify(JSON.parse(readFileSync("firebase.json", "utf8")).hosting.headers);
  assert.ok(!/googleapis|gstatic/.test(csp), "CSP no longer allows Google font hosts");
  assert.match(home, /rel="preload" href="\/fonts\/instrument-sans-700-v1\.woff2" as="font"/);
  assert.ok(!/Bricolage/i.test(home), "no Bricolage references in output");
});

test("EduLynx module relations are derived only from the published descriptions", () => {
  const rel = relatedModules();
  for (const [a, list] of Object.entries(rel)) for (const b of list) {
    const bodyA = edulynx.modules.find((m) => m.key === a)?.body ?? "";
    const bodyB = edulynx.modules.find((m) => m.key === b)?.body ?? "";
    assert.ok((moduleConcepts[b]?.test(bodyA) ?? false) || (moduleConcepts[a]?.test(bodyB) ?? false), `${a}↔${b} has no textual basis`);
    assert.ok(rel[b]?.includes(a), `${a}→${b} not symmetric`);
  }
  assert.ok((rel.attendance ?? []).includes("students"));
});

test("reference architecture places every approved non-security technology exactly once", () => {
  const placed = archLayers.flatMap((l) => archItems(l));
  const approved = techLayers.filter((l) => l.key !== "security").flatMap((l) => l.items);
  assert.equal(new Set(placed).size, placed.length, "no duplicates");
  assert.deepEqual([...placed].sort(), [...approved].sort());
});

test("EduLynx interface stays labelled illustrative while no screenshots are supplied", () => {
  const html = readFileSync("dist/index.html", "utf8");
  assert.equal(edulynx.screenshots.length, 0);
  assert.match(html, /EduLynx ERP · illustrative interface/);
  assert.doesNotMatch(html, /Product screenshot ·/);
});

test("V4 infrastructure photo: supplied asset, enhancement disclosed, editorial labels only (no telemetry)", () => {
  const html = readFileSync("dist/index.html", "utf8");
  const fig = html.slice(html.indexOf('<figure class="infra"'), html.indexOf("</figure>", html.indexOf('<figure class="infra"')));
  assert.ok(fig.length > 0, "infrastructure figure present");
  assert.match(fig, /Image enhanced for clarity\./);
  assert.match(fig, /media="\(max-width: 47\.99rem\)"/, "phone crop served");
  assert.doesNotMatch(fig.replace(/<[^>]+>/g, " "), /\d+\s*(%|ms|Gbps|Mbps|TB|GB|uptime|online|servers?)/i, "no invented specs or telemetry");
  const office = readFileSync("dist/office.html", "utf8");
  assert.match(office, /Image enhanced for clarity\./);
});
