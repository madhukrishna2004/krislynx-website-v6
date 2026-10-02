# V3 — Lottie / dotLottie decision
**Not added in this release.** Reasons, in order:
1. No Lottie runtime can be installed in the build environment (no npm registry access), and the brief forbids an
   external animation CDN for core UI.
2. The dotLottie web player needs `'wasm-unsafe-eval'` in the CSP; the brief also says "do not weaken CSP". This is an
   owner decision (OWNER-CONFIRMATIONS item 18), not something to change silently.
3. Every motion the brief assigns to Lottie is delivered with CSS/SVG at ~0 KB extra: hero system (living SVG diagram +
   line reveal), product transition (room seam + product-system activation), AI pipeline (SVG flow + human-decision
   boundary), architecture (dependency signal — the brief itself prefers SVG here), contact completion sequence,
   assistant (open transition + status indicator).

**If you want Lottie later:** add `lottie-web` (light build, SVG renderer — no WASM, so CSP stays as-is) to
package.json on a networked machine; self-host JSON files under `public/animations/<name>.json` (budget ≤ 8 files,
≤ 60 KB each); load them with `IntersectionObserver` + dynamic `import()`; render the existing SVG as the static
fallback and for `prefers-reduced-motion: reduce`.
