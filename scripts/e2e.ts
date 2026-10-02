/**
 * End-to-end interaction checks against the local preview server.
 * Run: npm run serve (in another terminal), then npm run e2e.
 * Set KX_MOCK_FAIL=1 on the server to exercise the contact error state.
 */
import { chromium, type Page } from "playwright";

const base = process.env.KX_BASE ?? "http://localhost:4173";
let failures = 0;
const check = (name: string, ok: boolean, detail = ""): void => {
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

async function fillValid(page: Page): Promise<void> {
  await page.fill("#cf-name", "Asha Rao");
  await page.fill("#cf-email", "asha@example.org");
  await page.fill("#cf-company", "Example Academy");
  await page.selectOption("#cf-country", "IN");
  await page.fill("#cf-phone", "+91 98765 43210");
  await page.check('input[name="need"][value="school-erp"]');
  await page.check('input[name="stage"][value="existing"]');
  await page.fill("#cf-details", "We run two schools and want to move attendance and fees into one system.");
  await page.check("#cf-consent");
}

async function main(): Promise<void> {
  const browser = await chromium.launch();
  const errors: string[] = [];

  // ---- Mobile menu
  const m = await browser.newPage({ viewport: { width: 390, height: 844 } });
  m.on("pageerror", (e) => errors.push(e.message));
  await m.goto(base + "/");
  await m.click("[data-menu-open]");
  check("mobile menu opens as modal dialog", await m.locator("#mobile-menu").evaluate((d) => (d as HTMLDialogElement).open));
  check("menu button reports expanded", (await m.getAttribute("[data-menu-open]", "aria-expanded")) === "true");
  await m.keyboard.press("Escape");
  check("Esc closes menu", !(await m.locator("#mobile-menu").evaluate((d) => (d as HTMLDialogElement).open)));
  check("focus returns to menu button", await m.evaluate(() => document.activeElement?.hasAttribute("data-menu-open") ?? false));

  // ---- Tabs
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  d.on("pageerror", (e) => errors.push(e.message));
  await d.goto(base + "/");
  // Interactive visualizations (V3.1): one visible panel each, keyboard, hover, click, cross-links.
  for (const v of ["orbit", "edulynx", "ai", "lifecycle", "svc-0"]) {
    const n = await d.locator(`[data-viz="${v}"] [data-viz-panel]:not([data-inactive])`).count();
    check(`${v}: exactly one panel visible`, n === 1, `${n} visible`);
  }
  await d.hover('.hc__node--ai');
  check("hero: hovering AI explains it and lights its path", (await d.getAttribute(".hc", "data-active")) === "ai" && (await d.isVisible("#hc-note-ai")));
  check("hero: AI node links to the Intelligence room", (await d.getAttribute(".hc__node--ai", "href")) === "#intelligence");
  await d.focus("#orb-tab-students");
  await d.keyboard.press("ArrowRight");
  check("orbit: arrow key moves to Attendance", (await d.getAttribute('[data-viz="orbit"]', "data-active")) === "attendance");
  await d.click('#orb-panel-attendance a[data-select="orb-tab-reports"]');
  await d.waitForTimeout(100);
  check("orbit: a connected-module chip selects that module", (await d.getAttribute('[data-viz="orbit"]', "data-active")) === "reports" && (await d.isVisible("#orb-panel-reports")));
  await d.click('#orb-panel-reports a[data-select="em-tab-reports"]');
  await d.waitForTimeout(150);
  check("orbit: 'See it in the interface' selects the same module in Inside EduLynx", (await d.getAttribute('[data-viz="edulynx"]', "data-active")) === "reports");
  await d.click("#em-tab-ai");
  check("EduLynx interface: AI layer selectable", (await d.isVisible("#em-panel-ai")) && ((await d.textContent("#em-panel-ai")) ?? "").includes("AI LAYER"));
  await d.click("#lf-tab-engineer");
  check("lifecycle: click shows Engineer output", ((await d.textContent("#lf-panel-engineer")) ?? "").includes("Working increments"));
  await d.click("#ssy-1-tab-3");
  check("service diagram: selecting Guardrails lights steps 1–4 and explains it", (await d.getAttribute('[data-viz="svc-1"]', "data-active")) === "ssy-1-3" && ((await d.textContent("#ssy-1-p-3")) ?? "").includes("Validate"));
  // V2.1 architecture (on /technology): default Interface, click → dependency path, keyboard, single open panel
  const t = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await t.goto(`${base}/technology`, { waitUntil: "networkidle" });
  check("architecture: Interface is the default active layer", (await t.getAttribute(".arch3", "data-active")) === "interface" && (await t.getAttribute("#arch-btn-interface", "aria-expanded")) === "true");
  await t.click("#arch-btn-data");
  check("architecture: selecting Data opens only its panel and lights Services → Data → Infrastructure",
    (await t.getAttribute(".arch3", "data-active")) === "data" && (await t.locator(".arch3__panel:not([data-inactive])").count()) === 1 && ((await t.textContent("#arch-panel-data .arch3__path")) ?? "").replace(/\s+/g, " ").includes("Services → Data → Infrastructure"));
  await t.focus("#arch-btn-data");
  await t.keyboard.press("ArrowDown");
  check("architecture: ArrowDown moves to Infrastructure (keyboard only)", (await t.evaluate(() => document.activeElement?.id)) === "arch-btn-infrastructure" && (await t.getAttribute("#arch-btn-infrastructure", "aria-expanded")) === "true");
  await t.close();
  // V2.1 reduced motion: nothing animates continuously, nothing is left hidden, state still works
  const rm = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await rm.goto(`${base}/`, { waitUntil: "networkidle" });
  for (let y = 0; y < 16000; y += 1200) await rm.evaluate((yy) => window.scrollTo(0, yy), y);
  const rmState = await rm.evaluate(() => ({
    running: document.getAnimations().filter((a) => a.playState === "running").length,
    hidden: [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).opacity === "0").length,
    smooth: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  check("reduced motion: no running animations, no hidden content, no smooth scrolling", rmState.running === 0 && rmState.hidden === 0 && rmState.smooth !== "smooth", JSON.stringify(rmState));
  await rm.click("#arch-btn-api").catch(() => undefined);
  await rm.close();
  // V2.1 keyboard: every Tab stop through the homepage shows a visible focus indicator
  const kb = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await kb.goto(`${base}/`, { waitUntil: "networkidle" });
  let invisible = 0; let stops = 0;
  for (let k = 0; k < 60; k++) {
    await kb.keyboard.press("Tab");
    const f = await kb.evaluate(() => { const e = document.activeElement as HTMLElement | null; if (!e || e === document.body) return null; const cs = getComputedStyle(e); return { visible: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none" }; });
    if (!f) continue; stops++; if (!f.visible) invisible++;
  }
  check("keyboard: 60 Tab stops on the homepage, every one with a visible focus indicator", stops >= 40 && invisible === 0, `${stops} stops, ${invisible} without visible focus`);
  await kb.close();
  // V2.1 mobile menu at 320px: background locked, Escape closes, focus returns to the trigger
  const mm = await browser.newPage({ viewport: { width: 320, height: 640 } });
  await mm.goto(`${base}/`, { waitUntil: "networkidle" });
  // jump instantly (the page uses smooth scrolling) and let it settle before measuring the lock
  await mm.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" as ScrollBehavior }));
  await mm.waitForTimeout(200);
  // in-page click: Playwright's pointer click mis-measures the sticky header and scrolls first (harness artifact, verified)
  await mm.evaluate(() => (document.querySelector("[data-menu-open]") as HTMLElement).click());
  await mm.waitForTimeout(150);
  const before = await mm.evaluate(() => window.scrollY);
  await mm.mouse.wheel(0, 800);
  await mm.waitForTimeout(150);
  const lock = await mm.evaluate(() => ({ y: window.scrollY, overflow: getComputedStyle(document.documentElement).overflow }));
  await mm.keyboard.press("Escape");
  // wait for the real state transition: dialog closed AND focus restored (no fixed delay)
  await mm.waitForFunction(() => !(document.getElementById("mobile-menu") as HTMLDialogElement).open && document.activeElement?.matches("[data-menu-open]"), undefined, { timeout: 2000 }).catch(() => undefined);
  const after = await mm.evaluate(() => ({ open: (document.getElementById("mobile-menu") as HTMLDialogElement).open, focusIsTrigger: document.activeElement?.matches("[data-menu-open]") ?? false }));
  check("mobile menu (320px): page behind does not scroll; Escape closes; focus returns to Menu", lock.y === before && lock.overflow === "hidden" && !after.open && after.focusIsTrigger, JSON.stringify({ before, ...lock, ...after }));
  // Close-button path: focus returns to Menu; navigation path: choosing a page closes the menu and navigates
  await mm.evaluate(() => (document.querySelector("[data-menu-open]") as HTMLElement).click());
  await mm.waitForFunction(() => (document.getElementById("mobile-menu") as HTMLDialogElement).open);
  await mm.click("[data-menu-close]");
  await mm.waitForFunction(() => !(document.getElementById("mobile-menu") as HTMLDialogElement).open && document.activeElement?.matches("[data-menu-open]"), undefined, { timeout: 2000 }).catch(() => undefined);
  check("mobile menu: Close button closes and returns focus to Menu", await mm.evaluate(() => !(document.getElementById("mobile-menu") as HTMLDialogElement).open && (document.activeElement?.matches("[data-menu-open]") ?? false)));
  await mm.evaluate(() => (document.querySelector("[data-menu-open]") as HTMLElement).click());
  await mm.waitForFunction(() => (document.getElementById("mobile-menu") as HTMLDialogElement).open);
  await Promise.all([mm.waitForURL(/\/technology$/), mm.click("#mobile-menu a[href='/technology']")]);
  check("mobile menu: choosing a page navigates normally", mm.url().endsWith("/technology"));
  await mm.close();
  // KX Navigator — keyboard lifecycle, grouping and data integrity
  const nv = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await nv.goto(`${base}/products`, { waitUntil: "networkidle" });
  await nv.keyboard.press("Control+k");
  await nv.waitForFunction(() => document.querySelectorAll(".kxnav__results [role=option]").length > 0);
  await nv.keyboard.press("Tab"); await nv.keyboard.press("Shift+Tab"); await nv.keyboard.press("Shift+Tab");
  check("navigator: Tab / Shift+Tab never move focus to the page behind", await nv.evaluate(() => Boolean(document.activeElement?.closest("#kxnav")) || document.activeElement === document.body));
  await nv.focus("#kxnav-q");
  await nv.keyboard.type("zzqx");
  await nv.waitForFunction(() => Boolean(document.querySelector(".kxnav__empty")));
  check("navigator: no-results state is explicit", ((await nv.textContent(".kxnav__empty")) ?? "").includes("No matching page"));
  await nv.fill("#kxnav-q", "");
  await nv.waitForFunction(() => document.querySelectorAll(".kxnav__results [role=option]").length > 0);
  check("navigator: clearing the search restores suggestions", (await nv.$$eval(".kxnav__results [role=option]", (e) => e.length)) > 0);
  await nv.fill("#kxnav-q", "e");
  await nv.waitForFunction(() => document.querySelectorAll(".kxnav__results [role=option]").length > 3);
  const groups = await nv.$$eval(".kxnav__group", (e) => e.map((x) => x.textContent ?? ""));
  const urls = await nv.$$eval(".kxnav__results [role=option] a", (e) => e.map((x) => x.getAttribute("href") ?? ""));
  check("navigator: only the six approved groups, no duplicate or hidden destinations",
    groups.every((g) => ["Recent", "Products", "Technology", "Engineering", "Company", "EduLynx modules"].includes(g)) && new Set(groups).size === groups.length &&
    !urls.some((u) => /leadership|thanks|404/.test(u)), JSON.stringify({ groups, n: urls.length }));
  await nv.keyboard.press("ArrowDown"); await nv.keyboard.press("ArrowDown");
  check("navigator: arrow keys move the active option", (await nv.getAttribute("#kxnav-q", "aria-activedescendant")) === "kxnav-o2");
  await nv.keyboard.press("Escape");
  await nv.waitForFunction(() => !(document.getElementById("kxnav") as HTMLDialogElement).open);
  // assistant: Products context + unanswerable questions never invent facts
  await nv.click("[data-assistant-open]");
  await nv.waitForFunction(() => (document.querySelector("[data-assistant-log]")?.textContent ?? "").length > 0);
  check("assistant: Products page context", ((await nv.textContent("[data-assistant-log]")) ?? "").includes("product portfolio"));
  for (const q of ["How many customers do you have?", "What is your annual revenue?", "Which awards have you won?", "Are you ISO 27001 certified?", "How many employees work at KrisLynx?"]) {
    await nv.fill("#assistant-input", q);
    await nv.press("#assistant-input", "Enter");
  }
  await nv.waitForFunction(() => document.querySelectorAll(".msg--bot").length >= 6);
  const bot = await nv.$$eval(".msg--bot .msg__text", (e) => e.slice(1).map((x) => x.textContent ?? ""));
  check("assistant: unanswerable questions get no invented numbers, awards or certifications",
    bot.length >= 5 && bot.every((t) => !/\b\d{2,}\b|ISO \d|award(ed)? (for|by)|certified (by|to)/i.test(t)), JSON.stringify(bot.map((t) => t.slice(0, 60))));
  await nv.close();
  // V4 context layer
  const v4 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await v4.goto(`${base}/products/edulynx-erp`, { waitUntil: "networkidle" });
  check("V4 nav: active section shows its context (Products └ EduLynx ERP)", ((await v4.textContent(".site-nav [aria-current=page] .site-nav__ctx")) ?? "").includes("EduLynx"));
  await v4.click("[data-assistant-open]");
  check("V4 assistant: page-aware intro on EduLynx", ((await v4.textContent("[data-assistant-log]")) ?? "").includes("You're exploring EduLynx"));
  await v4.keyboard.press("Escape");
  await v4.click("#day-tab-finance");
  await v4.waitForTimeout(100);
  check("V4 school day drives the interface: Finance stop → Finance & fees screen", (await v4.getAttribute("#em-tab-finance", "aria-selected")) === "true");
  await v4.goto(`${base}/technology`, { waitUntil: "networkidle" });
  await v4.keyboard.press("Control+k");
  await v4.waitForTimeout(250);
  await v4.keyboard.type("fees");
  await v4.waitForTimeout(150);
  const hits = await v4.$$eval(".kxnav__t", (els) => els.map((e) => e.textContent ?? ""));
  check("V4 KX Navigator: Ctrl+K opens; 'fees' finds the EduLynx module", hits.some((h) => h.includes("Finance & fees")), JSON.stringify(hits));
  await v4.keyboard.press("Escape");
  check("V4 KX Navigator: Escape closes and returns focus", !(await v4.evaluate(() => (document.getElementById("kxnav") as HTMLDialogElement).open)));
  await v4.click(".arch3__trace-btn[data-dir='down']");
  await v4.waitForTimeout(3300);
  check("V4 architecture: request trace steps Interface → … → Infrastructure", (await v4.getAttribute(".arch3", "data-active")) === "infrastructure");
  check("V4 footer: context-aware next steps on /technology", ((await v4.textContent(".site-footer__next")) ?? "").includes("engineering services"));
  await v4.goto(`${base}/`, { waitUntil: "networkidle" });
  const visited = await v4.$$eval(".hc__node.is-visited", (els) => els.map((e) => (e as HTMLElement).dataset.node));
  check("V4 hero memory: explored areas (EduLynx, Technology) are marked on the hero", visited.includes("products") && visited.includes("data"), JSON.stringify(visited));
  await v4.close();
  // touch targets on phones
  const tt = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  await tt.goto(`${base}/products/edulynx-erp`, { waitUntil: "networkidle" });
  const smallT = await tt.$$eval(".orb__node, .edx__tab, .day__stop, .btn, .menu-button", (els) => els.filter((e) => e.getClientRects().length).map((e) => e.getBoundingClientRect().height).filter((h) => h > 0 && h < 44).length);
  check("V4 touch targets ≥ 44px on phones (EduLynx controls)", smallT === 0, `${smallT} small`);
  await tt.close();
  await d.click("#ai-tab-decision");
  check("AI pipeline: ends with a human decision", ((await d.textContent("#ai-panel-decision")) ?? "").includes("people act"));

  // ---- Assistant
  await d.click("[data-assistant-open]");
  check("assistant opens", await d.locator("#assistant-dialog").evaluate((x) => (x as HTMLDialogElement).open));
  await d.fill("#assistant-input", "How much does EduLynx cost?");
  await d.press("#assistant-input", "Enter");
  const priceAnswer = (await d.locator(".msg--bot").last().textContent()) ?? "";
  check("assistant answers pricing from approved KB", priceAnswer.includes("35,000"), priceAnswer.slice(0, 80));
  await d.fill("#assistant-input", "What is the weather in Paris tomorrow?");
  await d.press("#assistant-input", "Enter");
  const fallback = (await d.locator(".msg--bot").last().textContent()) ?? "";
  check("assistant uses fallback for unknown questions", /don't have|contact/i.test(fallback), fallback.slice(0, 80));
  await d.fill("#assistant-input", "<img src=x onerror=alert(1)>");
  await d.press("#assistant-input", "Enter");
  check("assistant renders user input as text", (await d.locator(".msg--user img").count()) === 0);
  await d.keyboard.press("Escape");

  // ---- Contact validation
  await d.goto(base + "/contact?need=ai");
  check("?need= preselects the matching chip", await d.isChecked('input[name="need"][value="ai"]'));
  await d.click("[data-submit]");
  const invalid = await d.locator("[aria-invalid='true']").count();
  check("empty submit shows field errors", invalid >= 5, `${invalid} invalid fields`);
  // rule: focus lands on the FIRST invalid field in DOM order (form is staged "what you're building" first)
  check("focus moves to first invalid field", await d.evaluate(() => {
    const first = document.querySelector("[aria-invalid='true']");
    return first !== null && document.activeElement === first;
  }), await d.evaluate(() => document.activeElement?.id ?? ""));
  await d.fill("#cf-email", "not-an-email");
  await d.locator("#cf-email").blur();
  check("invalid email message", ((await d.textContent('[data-error-for="cf-email"]')) ?? "").includes("valid email"));
  await d.selectOption("#cf-country", "GB");
  check("dial code follows country", (await d.textContent("[data-dial-display]"))?.trim() === "+44");

  // ---- Contact submission (mock server)
  await d.goto(base + "/contact");
  await d.waitForTimeout(3200); // pass the minimum-fill-time spam check
  await fillValid(d);
  await d.click("[data-submit]");
  await d.waitForSelector("[data-form-status]:not([hidden])");
  const statusClass = (await d.getAttribute("[data-form-status]", "class")) ?? "";
  const expectFail = process.env.KX_EXPECT_FAIL === "1";
  check(
    expectFail ? "failed submit shows error state with email fallback" : "successful submit shows success state",
    expectFail ? statusClass.includes("error") && (await d.locator("[data-form-status] a[href^='mailto:']").count()) === 1 : statusClass.includes("success"),
    statusClass,
  );
  if (expectFail) check("form keeps values after failure", (await d.inputValue("#cf-name")) === "Asha Rao");

  // ---- 404 and redirects
  const r404 = await d.goto(base + "/does-not-exist");
  check("unknown URL returns 404 page", r404?.status() === 404 && ((await d.textContent("h1")) ?? "").includes("route doesn't exist"));
  const redir = await d.goto(base + "/about");
  check("legacy /about redirects to /company", redir?.url().endsWith("/company") ?? false);

  check("no uncaught page errors", errors.length === 0, errors.join("; "));
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : "\nAll interaction checks passed");
  process.exit(failures ? 1 : 0);
}
main().catch((e: unknown) => { console.error(e); process.exit(1); });
