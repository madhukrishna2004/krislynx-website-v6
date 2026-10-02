/**
 * Fast responsive sweep: loads every sitemap route at each width and reports
 * horizontal overflow, elements wider than the viewport, missing alt text,
 * images without dimensions, and console/CSP errors. No screenshots.
 */
import { chromium } from "playwright";
import { readFile } from "node:fs/promises";

const base = process.env.KX_BASE ?? "http://localhost:4173";
const widths = (process.argv[2] ?? "320,390,768,1024,1440,1920").split(",").map(Number);

async function main(): Promise<void> {
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  const routes = [...sitemap.matchAll(/<loc>https:\/\/krislynx\.com([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
  routes.push("/insights", "/contact/thanks", "/this-page-does-not-exist");
  const browser = await chromium.launch();
  const problems: string[] = [];
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    page.on("console", (m) => {
      if (m.type() === "error" && !/Failed to load resource/.test(m.text())) problems.push(`[${w}] ${page.url()} console: ${m.text()}`);
    });
    page.on("pageerror", (e) => problems.push(`[${w}] ${page.url()} pageerror: ${e.message}`));
    for (const r of routes) {
      await page.goto(base + r, { waitUntil: "load" });
      const res = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll<HTMLElement>("body *")]
          .filter((el) => {
            const b = el.getBoundingClientRect();
            if (b.width === 0 || el.closest("dialog:not([open]), .visually-hidden, .hp, .tabs__list")) return false;
            // clipped by an overflow:hidden ancestor (decorative bleed) — not real overflow
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
              const o = getComputedStyle(p).overflowX;
              if (o === "hidden" || o === "clip") return false;
              // inside an intentional horizontal scroller (chip rails on mobile): not page overflow
              if ((o === "auto" || o === "scroll") && p.scrollWidth > p.clientWidth) return false;
            }
            return b.right > vw + 1 || b.left < -1;
          })
          .slice(0, 3)
          .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")}`);
        const imgs = [...document.images].filter((i) => !i.closest("dialog"));
        const noAlt = imgs.filter((i) => !i.hasAttribute("alt")).length;
        const noDims = imgs.filter((i) => !i.getAttribute("width") || !i.getAttribute("height")).length;
        return { overflow: document.documentElement.scrollWidth - vw, wide, noAlt, noDims };
      });
      if (res.overflow > 0) problems.push(`[${w}] ${r} overflow ${res.overflow}px`);
      if (res.wide.length) problems.push(`[${w}] ${r} wide: ${res.wide.join(", ")}`);
      if (res.noAlt) problems.push(`[${w}] ${r} ${res.noAlt} img without alt`);
      if (res.noDims) problems.push(`[${w}] ${r} ${res.noDims} img without width/height`);
    }
    await page.close();
    console.log(`width ${w}: ${routes.length} routes checked`);
  }
  await browser.close();
  console.log(problems.length ? problems.join("\n") : "✓ No overflow, layout or console problems");
  process.exit(problems.length ? 1 : 0);
}
main().catch((e: unknown) => { console.error(e); process.exit(1); });
