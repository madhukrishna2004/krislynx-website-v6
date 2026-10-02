# V6.0.0 — Signature digital experience (visual excellence) · Oct 2026

## What changed
V6 is a visual refinement, not a feature release. Application code (routing, APIs, assistant knowledge, tests) is
unchanged from V5.1.1-RC. Changes are CSS and markup only:

- **Hero:** subtle technical grid background (radial-masked, ≤ 2.5% opacity — invisible until you look for it),
  "System / 01 · Architecture / Active" metadata line, and substantially more vertical breathing room.
- **Buttons:** tertiary "arrow" style for exploratory links (`Explore EduLynx →`).
- **Photography:** workspace and company photos break their containers on desktop, giving a more editorial feel.
- **Section transitions:** a thin shared rule bridges dark/light rooms, replacing the abrupt colour change.
- **Editorial layout:** asymmetric `split` section headers (label + number left, lede right) available to any page.
- **Full-bleed photos:** `.bleed-photo` utility for edge-to-edge images at phone widths, rounded on desktop.

## What did NOT change (on purpose)
- **Palette** (V3 "technical humanism" stays); **Lottie** (still not added); **Firebase/GitHub pipeline**; **test
  suite** (293 unit, 55+56 e2e); **assistant knowledge and behaviour**; **navigator index**; **performance** (CLS
  max 0.0032/8, JS 21.2 KB, CSS 31.1 KB gzip).

## Known limitations
Same as V5.1.1-RC: Safari/Firefox/Edge, real devices, live deployment, functions lockfile, dependency audit, Search
Console and live-domain checks are NOT VERIFIED.
