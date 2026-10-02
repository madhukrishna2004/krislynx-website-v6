/**
 * Visual QA: full-page screenshots of each route at each viewport.
 * Usage: tsx scripts/screenshots.ts [routes comma-separated] [widths comma-separated]
 * Requires `npm run serve` running and Playwright's Chromium installed.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.KX_BASE ?? "http://localhost:4173";
const routes = (process.argv[2] ?? "/").split(",");
const widths = (process.argv[3] ?? "1440,390").split(",").map(Number);

async function main(): Promise<void> {
  await mkdir("qa/screenshots", { recursive: true });
  const browser = await chromium.launch();
  const consoleErrors: string[] = [];
  for (const w of widths) {
    // reducedMotion: deterministic captures (no mid-animation frames); this is also the path motion-sensitive visitors get.
    const page = await browser.newPage({ viewport: { width: w, height: w < 768 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: process.env.KX_MOTION === "1" ? "no-preference" : "reduce" });
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(`${w} ${page.url()}: ${m.text()}`); });
    page.on("pageerror", (e) => consoleErrors.push(`${w} ${page.url()}: ${e.message}`));
    for (const r of routes) {
      await page.goto(base + r, { waitUntil: "networkidle" });
      // scroll through the page so lazy images load, then return to top
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1800); // let the one-time hero animation finish
      const name = (r === "/" ? "home" : r.slice(1).replace(/\//g, "_")) + `-${w}.png`;
      await page.screenshot({ path: `qa/screenshots/${name}`, fullPage: true });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) console.log(`! horizontal overflow ${overflow}px on ${r} @${w}`);
    }
    await page.close();
  }
  await browser.close();
  // Font requests fail offline; ignore those.
  const real = consoleErrors.filter((e) => !/fonts\.(googleapis|gstatic)/.test(e) && !/ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|net::ERR/.test(e));
  if (real.length) console.log(real.join("\n"));
  console.log(`✓ ${routes.length * widths.length} screenshots`);
}
main().catch((e: unknown) => { console.error(e); process.exit(1); });
