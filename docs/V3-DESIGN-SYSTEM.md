# V3 design system — "Technical humanism" (27 Sep 2026)
Engineering foundation unchanged (static pre-render, typed JSX, Firebase Hosting/Functions/Firestore, GitHub Actions).
V3 changes the experience layer only.

**Signatures (recognisable without the logo):** 1) the continuity line through every room · 2) Geist Mono technical
metadata · 3) the interactive architecture stack · 4) environmental room transitions · 5) the KX Assistant interface.

**Tokens (src/styles/base.css :root):** colour (see V3-COLOR-SYSTEM) · type roles (V3-TYPOGRAPHY) · spacing `--s-1…--s-9`,
`--section-y` · radius `--r-square` 2px (architecture), `--r-sm` 6, `--r-md` 10, `--r-lg` 14 · borders `--border-quiet`,
`--border-structure`, `--border-dark` · shadows `--shadow-ambient/-directional/-elevated` (dark surfaces use border +
contrast) · motion `--m-micro/-ui/-section/-large`, `--ease-out-kx` · z-index `--z-rail/-header/-assistant/-dialog` ·
widths `--container` 78rem, `--container-narrow`, `--measure` 42rem · breakpoints (CSS can't read vars in media
queries, so they are fixed values used consistently): 30 · 48 · 64 · 72 · 90rem.

**Glass:** navigation, assistant, overlays only. **Guards:** tests/freeze.test.ts (palette, type roles, no
`transition: all`, no generic fade-up, no animation/3D libraries), tests/design.test.ts (WCAG contrast of every pairing).
