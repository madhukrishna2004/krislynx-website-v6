# 27 Sep 2026 — typography, first photograph, product system (owner-directed)
- **Typeface:** Instrument Sans for display and body (Bricolage removed); editorial weight contrast (regular statements,
  bold accents); hero reduced to ~100px desktop / ~48–60px phone; tracking relaxed from poster-tight to breathable.
- **Homepage story:** hero → **real workspace (first photograph)** → what we build → engineering services → **product
  system** → EduLynx flagship → inside EduLynx → intelligence → engineering → technology / **infrastructure (server
  room)** → work → where we build → contact.
- **Product system:** EduLynx dominant flagship panel + every other product with its mark; no status labels anywhere
  (test-enforced); honesty kept through neutral descriptions, live-link only for EduLynx, concepts out of schema.

---

# V4 — real photography integration, limited scope (27 Sep 2026)

Design freeze respected: V4 added **one supplied asset** (allowed under "real supplied assets"); no new sections,
typography roles, palette or navigation changes (tests/freeze.test.ts unchanged and passing).
- **Server/network room** (owner: real room, AI-enhanced) → homepage §08 Technology, directly after the six-layer
  architecture ("Built on real infrastructure."), and /office gallery. Desktop 16:9 derivatives 480–1600 + a
  deliberate 4:5 phone crop centred on the network rack (art-directed `<source media>`; verified the browser loads the
  phone crop at 375px). Editorial labels (Infrastructure / 01 · Network · Local environment · Nandyal), a subtle
  traced line, top/bottom scrim for label contrast; **no invented specs or telemetry** (test-enforced); enhancement
  disclosed in both captions.
- **Office photographs: not integrated** — owner chose to wait for corrected photos (wrong CIN/address on signage).
  The office-spread, photographic scroll story and company-photography parts of the V4 brief remain pending.

---

# V3.3 — typography & restraint (26 Sep 2026)

**Audit correction:** the V3.2 figures (16 sizes, 29% uppercase) counted elements hidden with display:none. The
audit is now `scripts/type-audit.ts` (visible text only, 7 key pages). Corrected V3.2 baseline vs V3.3 at 1440px:

| Metric | V3.2 (corrected) | V3.3 |
|---|---|---|
| Distinct font sizes | 18 | **11** |
| Largest section heading (excl. hero, EduLynx, page H1s) | 68px | **53px** |
| "Where we build" heading | 68px | **53px** (section role) |
| Uppercase share of visible text | 18% | **17%** — every remaining uppercase phrase >4 words is a technical label |
| Uppercase sentences | 7 | **0** (4 remaining long uppercase strings are labels: "Software / AI / Products", "EduLynx ERP · live product", "EduLynx ERP · illustrative interface", "AI system · steps 01–06") |
| Font families / weights | Bricolage Grotesque, Instrument Sans, Geist Mono / 400–700 | unchanged |

**Type roles** (base.css): micro 11 · label 13 · small 15 · body 17 · body-large 19 · subhead 20→24 · title 24→34 ·
section 33→53 · display 37→68 (inner-page H1 only) · hero 48→118 (+ phone recomposition) · product 51→144 (EduLynx only).
Every font-size in the stylesheets maps to a role; the only literal left is the logo lockup descriptor (logo artwork).
Sentence case restored for sentences (hero hint, "AI stops here · people decide", photo captions). Section 02 changed
from "An engineering company that ships its own software" (repeated the hero) to "We run what we build."

**Image readiness (no visual change until assets arrive):** `Picture` accepts an art-directed phone crop
(`mobile`); the EduLynx interface has a per-module screenshot slot driven by `products.ts → edulynx.screenshots`
(`{ image, caption, module, mobileImage }`). With none supplied, every screen stays labelled *Illustrative* — enforced by
tests/design.test.ts.

**Stop condition reached.** Next visual work waits for approved photographs and real EduLynx screenshots.

---

# V3.2 — final polish (26 Sep 2026)

Measured, then refined — no new sections.
- **Type rhythm:** micro labels consolidated to one 11px size (was 9/10/11px, 199 elements under 11px); section statements
  capped at ~52px so only the **hero** and the **EduLynx masthead** are huge; closing reduced from a third headline to a
  statement; "FIG. 0X" numbering removed (duplicated the section eyebrows).
  **Measured after the pass:** huge type (≥80px) only in hero + flagship ✓; readable text under 11px: 0 ✓.
  **Not yet achieved:** still 16 distinct font sizes; uppercase share unchanged at 29%; the "Where we build" heading
  still renders at 68px (not inside a chapter header). Next typography pass: collapse 12/13 and 34/35 steps, apply the
  statement size to that heading, and lower-case secondary mono labels.
- **Hero:** hierarchy = KrisLynx Technologies → four-line composed headline (We build / software / that has / to work.)
  → Software / AI / Products → one line → Explore EduLynx · Start a project. Active node clarifies, others step back; a
  slow dot-field "data" layer adds depth; on touch every node explanation is visible (no hover language).
- **Seams:** eased multi-stop blends; the continuity thread now runs through every room including flagship, about, start.
- **EduLynx:** three-stage handoff (KrisLynx system → Products → EduLynx); orbit panel sequence Module → Relationships →
  Workflow → Interface with a staged reveal; product page no longer repeats the homepage orbit — it shows an
  **illustrative school day** (times are an example; every capability is the module's published text).
- **Architecture:** one contiguous stack. **AI:** the "AI stops here · people decide" boundary is a place in the pipeline.
- **Case files:** document styling. **Chips:** product controls (Product · AI system · Enterprise software · SaaS platform ·
  Cloud · EduLynx demo · Other; values unchanged). **Footer:** services group trimmed.
- **Still not possible without owner input:** real EduLynx screenshots (none supplied — the interface stays labelled
  illustrative); new photographs.

---

# V3.1 — refinement pass (26 Sep 2026)

## Audit → decisions
| Verdict | Item | Action |
|---|---|---|
| KEEP | rooms palette, floating nav, EduLynx masthead + orbit, lilac AI, warm photo room, intake chips, type system | unchanged or polished |
| REFINE | hero diagram (static) | nodes are links with hover/focus notes; related paths light; "people" warms the scene; depth layers (atmosphere → network → core → fragments) move at different parallax rates |
| REFINE | hard colour cuts between rooms | blended seams (each room fades in from the previous room's colour) + one continuous system thread through every room |
| REFINE | orbit neighbours (ring positions, not real relations) | connections **derived from the published module descriptions** (test-enforced); connected-module chips; "See it in the interface" cross-link |
| REFINE | static service flows | interactive engineering diagrams: select a step, progress lights, a one-line method note appears |
| REFINE | case files | Project · The problem · The system · The engineering · The result · Technology |
| REFINE | navigation | states: minimal at top → compact when scrolling → product-aware (mint edge + "EduLynx ERP" tag) inside EduLynx rooms |
| REBUILD | §09 had two visuals (data flow + tech list) | one reference architecture: Interface → Application → API → Services → Data → Infrastructure, every approved technology placed exactly once (test-enforced), security as a rail |
| REMOVE | second "KrisLynx core" diagram (§03 system map) right after the hero | the hero is now the single system instrument; its nodes lead to the rooms that explain them |
| ADD | "where AI stops" | pipeline boundary: steps 01–06 AI system · "AI stops here · people decide" |
| ADD | EduLynx product page | "A school should not need five systems to run one day" — the school-day track on one institution record |

Homepage is now 12 rooms (mobile 375 px: 16,153 → 15,068 px). Research used: blended section colour transitions,
scroll-as-wayfinding, navigation that responds to scroll, interactivity that never blocks the CTA.

---

# Visual transformation — v3 "rooms" (26 Sep 2026)

> v3 supersedes v2/v1 below (kept for history).

## Research (before changing anything)
Current (2026) award-site and trend coverage converged on: expressive typography carrying the design; glass used
as an accent, not the whole language; a move from aggressive high-contrast palettes to softer but deliberate colour;
accessibility and performance built in. dotLottie research: the web player compiles WebAssembly and needs
`'wasm-unsafe-eval'` in the CSP (one release even required `'unsafe-eval'`) — a direct trade-off against this site's
strict CSP. Decision below.

## v3 system
- **Rooms, not a wall of black:** void #07090D · ink #0D1118 · graphite #151A22 (technical) ↔ warm #FAF8F4 (company) ·
  ice #EEF8FC (technology/engineering) · mint #EFFBF5 (product) · lilac #F4F1FF (intelligence). Each room has its own
  ambient light; accent inks per pale room (cyan #06657D, mint #0B6B47, violet #5A44D1) — all AA, tested.
- **Floating glass navigation** (pill, blur only here): Products · Services · Work · Company · Careers · Start a project.
- **Homepage (13 rooms):** 01 Enter (void, HeroCore) · 02 Company (warm) · 03 System (ink, system map) · 04 What we
  engineer (ice, three engineering flows) · 05 **Flagship EduLynx** (mint: masthead, verified facts, 12-module orbit) ·
  06 Inside EduLynx (graphite, illustrative app) · 07 Intelligence (lilac, 7-step AI pipeline) · 08 Engineering (void,
  8-step lifecycle) · 09 Technology (ice, data flow + derived stack) · 10 Products (ink, ecosystem) · 11 Work (graphite,
  case files) · 12 Where we build (warm, full-bleed office photograph + legal identity) · 13 Start (void, intake chips).
- **EduLynx is the flagship** — the only product with its own room, masthead and orbit; its product page also gets the orbit.
- **Founder not public:** removed from /company and from Organization schema; content preserved at the unlinked,
  noindex, sitemap-excluded `/company/leadership` (enforced by tests/founder.test.ts).
- **Contact intake:** "What are we building?" and "Project stage" chip groups (native radios in fieldsets); homepage
  intake chips deep-link to `/contact?need=…`; `stage` is optional, allow-listed, validated server-side and in the email.
- **Typography kept, scaled up:** Bricolage Grotesque / Instrument Sans / Geist Mono were already chosen by in-browser
  comparison and self-hosted (the brief's named candidates are unobtainable offline); v3 pushes display sizes (hero 7rem,
  flagship 9rem) per the research.

## Lottie decision (owner decision required)
Not used. (1) The runtime can't be installed offline; (2) dotLottie needs `'wasm-unsafe-eval'` in `script-src`.
All animations remain CSS/SVG (inventory below, v2). To adopt dotLottie later: approve the CSP change, add
`@lottiefiles/dotlottie-web`, self-host the WASM, lazy-load per room, keep CSS fallbacks for reduced motion.

## Visual passes performed
1 identity (tokens, rooms, nav) · 2 homepage composition · 3 EduLynx flagship · 4 typography/spacing (flow wrapping,
ecosystem proportions) · 5 motion (HeroCore comets + parallax depth layers; orbit neighbour reaction) · 6 mobile/tablet
(header overlap fix, chip legend) · 7 photography (only the meeting-room image is usable — see OWNER-CONFIRMATIONS) ·
8 polish. Reviewed at 1440/1280/1024/768/430/390/375; Chromium only.

---

# Visual transformation — v2 "black glass + pastel light" (26 Sep 2026)

> v2 supersedes the v1 notes further below (kept for history).

## v2 summary
- **Environment:** near-black surfaces (#05070A / #080B10 / #0D1117), cool-white text, pastel light (ice cyan, lavender, mint, blue) used as *light behind objects*, never paint. Light sections (#EEF1F5 / #F8F9FB) carry long reading.
- **Glass as hierarchy:** header, mobile menu, technical panels, product interfaces, nodes. Long text stays on solid surfaces.
- **Homepage:** 13 chapters, each answering one question, alternating dark / light / glass, with a thin data line at each boundary and a section rail (≥1600px) — "entering the system".

## v2 typography — chosen in the browser, self-hosted
Candidates available offline (SIL OFL, from the local font collection) were rendered side by side on the dark surface with real KrisLynx copy (`/tmp/spec`, see chat log):
| Role | Compared | Chosen | Why |
|---|---|---|---|
| Display | Bricolage Grotesque · Outfit · Instrument Sans | **Bricolage Grotesque 700** | editorial proportions and slightly idiosyncratic terminals read as art-directed; Outfit felt rounder/startup-generic; Instrument Sans too neutral for display |
| Body | Instrument Sans · Work Sans | **Instrument Sans 400/700** | crisp and compact; pairs with Bricolage |
| Technical | Geist Mono · JetBrains Mono · DM Mono | **Geist Mono 400** | cleanest at small uppercase sizes |
The brief's named candidates (Space Grotesk, Geist Sans, Sora, Manrope, Inter) were not obtainable offline. Files: `public/fonts/*-v1.woff2` (subset to the 209 characters the site uses; 61 KB total for 4 files) with OFL licence texts alongside; `font-display: swap`; the two critical faces preloaded. WOFF2 built with fontTools + a Brotli shim backed by Node's zlib; every file round-trips through fontTools' WOFF2 decoder. **Verified rendered** in Chromium: `document.fonts` reports all four faces *loaded*; computed fonts: h1 Bricolage Grotesque, body Instrument Sans, labels Geist Mono. Instrument Sans has no ₹ glyph (falls back per character). Google Fonts removed; CSP `style-src`/`font-src` now `'self'` only.

## Animation inventory (Lottie decision)
No Lottie/dotLottie runtime is installable offline, and dotLottie's WASM player would also require loosening the CSP (`'wasm-unsafe-eval'`). All five animations are therefore CSS/SVG — lighter than any Lottie equivalent and CSP-clean. If a Lottie is wanted later: add `@lottiefiles/dotlottie-web`, lazy-load it per section, and extend CSP deliberately.
| # | Animation | Purpose | Trigger | Duration | Payload | Fallback / reduced motion | Mobile |
|---|---|---|---|---|---|---|---|
| 01 | Hero system assembly + signals | explain the company as one system: core → six domains → flow | page load; signals loop slowly, paused offscreen | 1.9 s assembly; 5.2 s signal cycle | inline SVG, ~3 KB | static assembled map; nodes remain links | same composition, smaller nodes |
| 02 | Engineering lifecycle | show 8 connected stages, progress up to selection | select / hover / keys | 500 ms fill | CSS only | all 8 panels readable without JS; no fill motion | swipeable stage rail |
| 03 | AI pipeline | 8-step pipeline with an illustrative example | autoplays once when 50% visible; stops on interaction | 2.2 s per step | CSS + ~40 lines JS (shared) | no autoplay; manual selection | 4×2 grid |
| 04 | Product ecosystem | live vs research vs internal (line styles) | hover / focus | 260 ms | inline SVG | static map | stacked list |
| 05 | Contact / project pipeline | how a project starts: brief → call → proposal → release | loops when visible | 4.8 s | CSS only | static list | same |
Plus: data-flow signals (four typed lanes, legend), EduLynx screen transitions (widgets reveal on module change), pointer light + 2–8 px parallax on hero and closing sections (fine pointers only).

## Performance (v2)
**BUILD-MEASURED:** CSS 18.8 KB gzip · JS 13.5 KB gzip · fonts 61 KB (4 WOFF2) · homepage HTML+CSS+JS 65.4 KB gzip · hero needs no images.
**BROWSER-MEASURED (headless Chromium, software rendering):** LCP 144–240 ms local, 1.7–1.9 s on a throttled 1.6 Mbps / 150 ms network (LCP element: text); CLS 0–0.003; interaction latency (Event Timing, click/key) worst 32–56 ms after optimisation.
**Optimisation found by measurement:** live `backdrop-filter`/`filter: blur` on large panels doubled interaction latency (worst 168 → 80 ms in an A/B run); removed from panels/nodes/light fields, kept on header, mobile menu and assistant launcher.
**PRODUCTION-MEASURED:** none yet (Lighthouse pending deploy).

## Homepage (v2) — mobile height 20,058 px → 14,602 px
01 Hero · 02 What KrisLynx is · 03 The system · 04 What we build · 05 Product ecosystem · 06 EduLynx · 07 AI · 08 Engineering · 09 Services · 10 Work (case files) · 11 Technology (data flow + derived tech matrix) · 12 Company · 13 Contact.

## Not done / limits (v2)
- Safari and Firefox engines are not installed here — **Chromium only**. Real devices, touch hardware and screen readers not tested.
- No product images were supplied with this request; nothing replaced. Miyraa / AP ExportAI not added (not approved).
- Lottie not used (see inventory).

---

# v1 notes — Visual, typography and product-storytelling transformation

## Audit findings (before)
- Homepage was a sequence of conventional sections; the only diagram was a small hero map. Technology was a tab list of words; EduLynx was a static layer diagram plus a 10-item grid; the product story was cards.
- Typography: Saira + IBM Plex Sans, no technical/label layer, uniform weights.
- Founder card on the homepage.

## Principles applied
Visuals must explain something (a request path, a module map, a workflow), use only approved content, label anything illustrative, work without JavaScript, respect `prefers-reduced-motion`, and add no dependencies.

## Typography system
| Role | Family | Treatment |
|---|---|---|
| Display / H1–H3 | **Space Grotesk** 500/600/700 | tight tracking (−0.035em at H1 → −0.015em at H3), 1.02–1.15 line height, balanced wrapping |
| Body | **Inter** 400/500/600 | 17 px base, 1.6 line height |
| Technical labels | system monospace (`ui-monospace`, SF Mono, Cascadia Mono, Roboto Mono, Menlo, Consolas) — **no download** | 12 px, uppercase, 0.14em tracking; `01 / SECTION` pattern via `<TechLabel>` |
Two loaded families. Kickers inherit the label style site-wide. **Verification caveat:** the build environment is offline, so Google Fonts never loaded and all screenshots show the fallback stack; confirm rendering after deploy (RELEASE-BLOCKERS M4).

## New visualizations (`src/components/viz.tsx`, `src/client/viz.ts`, `src/styles/viz.css`)
| # | Visualization | Where | What it explains | Interaction |
|---|---|---|---|---|
| 1 | Hero request path | `/` | People → Product → AI & logic → Data → Cloud → Outcome, with an *illustrative* interface panel (skeleton UI, no numbers) | packet travels the path twice, each layer lights in turn, then rests |
| 2 | System explorer (stack + data flow combined) | `/` §03 | request path through Client → API & services → AI → Data → Infrastructure; security as a cross-cutting rail; approved technologies per layer | select/hover/arrow keys; every layer up to the selection lights |
| 3 | Engineering lifecycle | `/` §08 | 6 approved stages; per stage: what happens, what KrisLynx does, tools (approved list), output | select/hover/keys; progress lights |
| 4 | EduLynx module map | `/` §05, `/products/edulynx-erp` | 10 operational modules around the shared institution record; AI layer reads all; role-based access; security foundation | select/hover/keys; active connection lights; mobile reflows to a grid |
| 5 | AI workflow | `/` §06, EduLynx page | Question → Understanding → Relevant data → Reasoning → Insight, labelled **illustrative**, based on published EduLynx AI capabilities | autoplays once when visible, stops on interaction |
| 6 | Product ecosystem | `/` §04, `/products`, `/company` | KrisLynx → EduLynx (Live), SelfMate (Research), FearLink (Research) on shared engineering; internal trade project marked **NOT A PRODUCT** | links |
| 7 | Service flows | every service page hero; homepage services accordion | conceptual flow per service (e.g. Your data → Model → Application → Decision → Automation) | reveal |
Node positions and "lit path" rules are generated at build time from the same constants that draw the diagrams (CSP forbids inline styles).

## Homepage story (numbered)
Hero → 01 Who we are → 02 What we build → 03 How our systems work → 04 Products → 05 EduLynx ERP → 06 AI / Intelligence → 07 Engineering services → 08 Engineering → 09 Work → 10 Company (mission, vision, office) → Contact.
Light/dark rhythm: dark · paper · white · **dark** · paper · **dark** · white · paper · **dark** · white · paper · blue.

## Deliberately not done
- **Miyraa, AP ExportAI** not added (not approved products — owner item 18).
- **No invented technologies** (the brief's examples Next.js, FastAPI, Redis, containers are not in the approved list).
- **No fabricated screenshots or numbers**; illustrative panels are labelled.
- **No image replacement** — no new images were supplied with this request.
- No WebGL, video, 3D or new dependencies.

## Founder
Removed from the homepage. On `/company`, Leadership is section 07 of 08 (after philosophy and office). Photo, bio and LinkedIn preserved; no email added.
