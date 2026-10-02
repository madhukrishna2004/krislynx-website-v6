/**
 * Typography audit (visible text only). Reports distinct sizes with the roles using them, the largest
 * heading outside hero/flagship, the "Where we build" heading, uppercase share, uppercase sentences,
 * families and weights. Usage: tsx scripts/type-audit.ts [routes] [width]
 */
import { chromium } from "playwright";
const base = process.env.KX_BASE ?? "http://localhost:4173";
const routes = (process.argv[2] ?? "/").split(",");
const width = Number(process.argv[3] ?? 1440);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width, height: 900 } });
await p.addInitScript("window.__name = (f) => f;");
const all = { sizes: new Map<number, Set<string>>(), upper: 0, total: 0, upperSentences: new Set<string>(), fams: new Set<string>(), weights: new Set<string>(), largestOther: { px: 0, text: "" }, where: 0 };
for (const r of routes) {
  await p.goto(base + r, { waitUntil: "networkidle" });
  const res = await p.evaluate(() => {
    const out: { fs: number; role: string; upper: boolean; text: string; fam: string; w: string; heroOrFlag: boolean; heading: boolean; where: boolean }[] = [];
    document.querySelectorAll("main *").forEach((el) => {
      const t = [...el.childNodes].filter((n) => n.nodeType === 3 && (n.textContent ?? "").trim()).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
      if (!t) return;
      const he = el as HTMLElement;
      if (!he.getClientRects().length || el.closest(".visually-hidden,[hidden],dialog:not([open])")) return; // visible only
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.opacity === "0") return;
      const cls = (el.getAttribute("class") ?? el.tagName.toLowerCase()).split(" ")[0] || el.tagName.toLowerCase();
      out.push({ fs: Math.round(parseFloat(cs.fontSize)), role: cls, upper: cs.textTransform === "uppercase", text: t.slice(0, 60), fam: (cs.fontFamily.split(",")[0] ?? "").replace(/"/g, ""), w: cs.fontWeight,
        heroOrFlag: Boolean(el.closest(".hero3, .flagship__mast, .page-hero, h1")), heading: /^H[1-3]$/.test(el.tagName) || Boolean(el.closest("h1,h2,h3")), where: Boolean(el.closest("#about-title")) });
    });
    return out;
  });
  for (const e of res) {
    if (!all.sizes.has(e.fs)) all.sizes.set(e.fs, new Set());
    all.sizes.get(e.fs)?.add(e.role);
    all.total++; if (e.upper) { all.upper++; if (e.text.split(" ").length > 4) all.upperSentences.add(`${e.role}: "${e.text}"`); }
    all.fams.add(e.fam); all.weights.add(e.w);
    if (e.heading && !e.heroOrFlag && e.fs > all.largestOther.px) all.largestOther = { px: e.fs, text: `${r} ${e.text.slice(0, 40)}` };
    if (e.where) all.where = Math.max(all.where, e.fs);
  }
}
await b.close();
console.log(`width ${width}px · routes: ${routes.join(" ")}`);
console.log(`distinct font sizes: ${all.sizes.size}`);
for (const [s, roles] of [...all.sizes.entries()].sort((a, b) => a[0] - b[0])) console.log(`  ${String(s).padStart(4)}px  ${[...roles].slice(0, 9).join(", ")}${roles.size > 9 ? ` …+${roles.size - 9}` : ""}`);
console.log(`largest section heading (excl. hero, EduLynx, page H1s): ${all.largestOther.px}px (${all.largestOther.text})`);
console.log(`"Where we build" heading: ${all.where}px`);
console.log(`uppercase: ${Math.round((all.upper / all.total) * 100)}% of ${all.total} visible text elements`);
console.log(`uppercase sentences (>4 words): ${all.upperSentences.size}`); for (const u of all.upperSentences) console.log("  · " + u);
console.log(`families: ${[...all.fams].join(", ")} · weights: ${[...all.weights].sort().join(", ")}`);
