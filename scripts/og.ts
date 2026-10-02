/**
 * Generates a 1200×630 Open Graph image for every indexable page, plus
 * /og/default.png. Output goes to public/og (committed). Re-run after
 * changing page titles: `npm run og`. Requires Playwright Chromium.
 * Fonts: the site's own self-hosted Instrument Sans (embedded as data URLs so the renderer always has it).
 */
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import { pages } from "../src/pages/index";
import { ogPathFor } from "../src/components/layout";

const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

async function main(): Promise<void> {
  await mkdir("public/og", { recursive: true });
  const mark = (await readFile("public/brand/krislynx-mark.svg", "utf8")).replace("<svg ", '<svg class="m" ');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const font = async (f: string): Promise<string> => `data:font/woff2;base64,${(await readFile(`public/fonts/${f}`)).toString("base64")}`;
  const [reg, bold] = [await font("instrument-sans-400-v1.woff2"), await font("instrument-sans-700-v1.woff2")];
  const HERO = "We build software that has to work.";
  // absolute titles carry their own " | KRISLYNX" suffix — the card shows the page's subject, not the suffix
  const cardTitle = (t: string): string => t.replace(/\s*\|\s*KRISLYNX\s*$/i, "");
  const jobs = [
    ...pages.filter((p) => !p.noindex).map((p) => ({ out: `public${ogPathFor(p.path)}`, title: p.path === "/" ? HERO : p.absoluteTitle ? cardTitle(p.title) : p.title, section: p.breadcrumbs?.[1]?.name ?? "" })),
    { out: "public/og/default.png", title: HERO, section: "" },
  ];
  for (const j of jobs) {
    await page.setContent(`<!doctype html><html><head><style>
      @font-face{font-family:"Instrument Sans";src:url(${reg}) format("woff2");font-weight:400}
      @font-face{font-family:"Instrument Sans";src:url(${bold}) format("woff2");font-weight:700}
      *{margin:0;box-sizing:border-box}
      body{width:1200px;height:630px;background:#0a0d0c;color:#F5F7F5;font-family:"Instrument Sans",sans-serif;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
      body:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(185, 242, 208,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(185, 242, 208,.05) 1px,transparent 1px);background-size:56px 56px}
      .m{position:absolute;right:-90px;bottom:-110px;height:620px;width:auto;opacity:.55}
      .top{display:flex;align-items:center;gap:18px;font-weight:700;font-size:26px;letter-spacing:.2em;position:relative}
      .top .s{font-weight:400;letter-spacing:.02em;color:#b9f2d0;font-size:24px}
      h1{position:relative;font-size:${j.title.length > 48 ? 58 : 68}px;line-height:1.04;font-weight:700;max-width:720px;letter-spacing:-.025em}
      .url{position:relative;color:#AAB5AE;font-size:24px}
    </style></head><body>${mark}<div class="top">KRISLYNX${j.section ? `<span class="s">${esc(j.section)}</span>` : ""}</div><h1>${esc(j.title)}</h1><p class="url">krislynx.com</p></body></html>`);
    await page.evaluate(async () => { await document.fonts.ready; });
    await page.screenshot({ path: j.out });
  }
  await browser.close();
  console.log(`✓ ${jobs.length} OG images`);
}
main().catch((e: unknown) => { console.error(e); process.exit(1); });
