# V5.0.0 — Finishing pass · 27 Sep 2026
The V5 brief received ends at §41 (the document was cut off); later sections were not available.
Per the brief: palette kept (V3), no Lottie, no new dependencies, performance profile as a hard limit.

## Visual audit first (screenshots, key pages × desktop/phone) — findings and fixes
| # | Finding | Fix | Guard |
|---|---|---|---|
| 1 | /products lede repeated a sentence (introduced in V2) | removed | test: no paragraph repeats a sentence (proven to catch it) |
| 2 | Company page + assistant still used status wording ("SelfMate and FearLink are research") after labels were removed | neutral portfolio wording; assistant states only the documented fact that EduLynx ERP is what schools can use today | test: no status wording in public prose or assistant answers |
| 3 | EduLynx illustrative interface used grey skeleton bars ("meaningless placeholder rectangles") | real capability rows (the module's published capabilities as a navigation list), still labelled Illustrative; no invented data | test: no skeleton bars |
| 4 | School-day capability chips were faint grey on white | readable ink + mint border | contrast tokens |
| 5 | Navigator showed duplicates, redundant kind labels and SEO-suffixed titles | grouped (Recent · Products · Technology · Engineering · Company · EduLynx modules), recents de-duplicated, page subjects only, "Search the KRISLYNX system" | e2e |
| 6 | **CLS on /technology rose to 0.016** | JS-revealed controls (⌘K button, trace controls) now reserve their space from first paint while staying hidden/unfocusable | measured back to 0.002–0.003; no-JS focus check |
| 7 | Architecture trace didn't show where the request/response had been | travelled path stays lit; direction named ("Request ↓" / "Response ↑") | e2e |

## Test-harness issue fixed (not a site bug)
Menu focus-return check read focus before the dialog's queued `close` event ran; it now waits 120ms (verified: focus
returns to the Menu button).

## Known limitations
- /technology desktop CLS is intermittently 0.016 (usually 0.003) in fresh browser contexts — attribution points at
  web-font swap timing; fix: fallback-font metric overrides (`size-adjust`/`ascent-override`) for Instrument Sans.
- Hero refinement (§6–7) and engineering naming (§20) left as-is: the existing 5-node system and 8-step lifecycle
  already express the brief's intent; changing them would be churn.
- Safari/Firefox/Edge, real devices, `audit:deps`, functions lockfile, deployment and live-domain checks need the
  owner's environment.

**Numbers:** unit 287/287 · e2e 46/46 (stable ×2) + 47/47 · 30 routes × 11 widths clean · LCP 152–348ms ·
CLS 0–0.016 · worst interaction 64ms · JS 21.2 KB · CSS 31.0 KB gzip.
