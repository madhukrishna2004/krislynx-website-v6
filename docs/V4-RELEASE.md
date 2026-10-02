# V4.0.0 — Intelligent digital environment (context layer) · 27 Sep 2026

**Core idea delivered: context.** The site now knows where the visitor is, what's related and what comes next —
without a SPA, frameworks or tracking.

| Feature | How | Privacy / performance |
|---|---|---|
| Contextual navigation | active item shows its sub-context ("Products └ EduLynx ERP"), from build-time breadcrumbs | 0 JS |
| Adaptive footer | "Next" row per page group (e.g. Technology → Engineering services · Start a project) | 0 JS |
| KX experience state | session-only record of explored **areas** (never identity/text/queries); drives hero memory | sessionStorage; no network (test-enforced) |
| Hero memory | nodes whose area you explored this session carry a tiny mint marker (no badges) | CSS |
| KX Navigator ⌘K / Ctrl+K | native dialog; searches a build-time index of real public pages, key sections and the 12 EduLynx modules | index 3 KB gzip, fetched on first open; hidden routes excluded (test) |
| Spatial page transitions | cross-document View Transitions; header persists, content crossfades in 200ms; anchors acknowledge arrival | CSS only; unsupported browsers navigate instantly; off under reduced motion |
| School day → interface | selecting a stop switches the illustrative EduLynx screen to that module | MutationObserver, no scroll jump |
| Architecture trace | "Trace a request ↓" / "Trace a response ↑" step the dependency signal through all six layers | reduced-motion: slower steps, no signal travel |
| KX Assistant V4 | page-aware intro ("You're exploring EduLynx."), quick navigation commands, answer cards, hand-off ("Let's start with what needs to work."), fallback offers navigation, "KX is preparing an answer…" | conversation never stored; approved answers only |
| Contact | "Sending request…" → "Project request received" + completion sequence | states mirror real behaviour (no fake "securing" step) |
| Touch targets | ≥ 44px on touch devices for every control (checkbox 24px + its label: WCAG 2.2 AA) | CSS (pointer: coarse) |

**Bugs found by V4 testing and fixed:** Escape did not close the navigator after typing (type="search" consumed it).
**Harness issue identified (not a site bug):** Playwright's pointer click mis-measures the sticky header and scrolls
first; the menu test now clicks in-page and proves the page stays put (594 → 594).

**Not done / decisions:** Lottie still not added (no runtime installable here; see V3-LOTTIE.md) — the brief assumed
V3 had Lottie; it did not. Palette: the second V4 brief specified slightly different hexes (#07090C/#F4F5F2/#9AA3AD)
than the V3 brief; V3 tokens kept pending owner confirmation (token-level switch). Hero has five nodes (the brief's
sixth, Infrastructure, is represented by the Data node → Technology); no Next.js migration (would break the
Firebase/GitHub pipeline). Safari/Firefox/Edge/real devices, `audit:deps`, deployment and live-domain checks need
the owner's environment.

**Numbers:** unit 284/284 · e2e 46/46 + 47/47 · 30 routes × 13 widths (320–1920) clean · LCP 156–292ms · CLS ≤0.005 ·
worst interaction 112ms · JS 20.9 KB · CSS 30.8 KB gzip.
