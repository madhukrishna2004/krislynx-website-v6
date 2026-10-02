# krislynx.com — KrisLynx Technologies corporate website

Production source for **https://krislynx.com**, the website of
**KRISLYNX TECHNOLOGIES PRIVATE LIMITED** (CIN U62013AP2026PTC128241).

Every public page is **pre-rendered to static HTML at build time**, so search engines and
visitors get full content instantly — the old site served an empty JavaScript shell.
A small deferred script (≈12 KB gzip) adds the menu, tabs, assistant and form enhancements;
everything important works without it.

## Quick start
```bash
npm install                          # first time: creates package-lock.json (commit it); afterwards use `npm ci`
npx playwright install chromium      # only for OG images, screenshots and e2e tests
npm run build                        # → dist/
npm run serve                        # http://localhost:4173 (Firebase-like: redirects, headers, mock /api)
npm run check                        # typecheck + lint + 293 unit/integrity/config/design/freeze/pre-deploy/SEO tests
npm run e2e                          # browser interaction tests (with `serve` running)
npm run audit:release                # crawler/SEO/redirect/header/no-JS/CSP/a11y audit (with `serve` running)
```

## How it's organised
| Path | What |
|---|---|
| `src/config/` | **All content.** Company facts, products, services, case studies, office photos, navigation, SEO defaults, assistant knowledge. Edit here, not in pages. See `docs/CONTENT-CONFIG.md`. |
| `src/pages/` | One file per page type; `index.ts` is the route registry (order = sitemap order). |
| `src/components/` | Layout (head/header/footer/assistant), UI primitives, diagrams, **interactive visualizations (`viz.tsx`)**, cards, contact form. |
| `src/styles/` | Design system: `base.css` tokens → `components.css` → `pages.css`. |
| `src/client/` | Browser enhancements (menu, tabs, assistant, contact, lightbox, consent-aware analytics). |
| `src/lib/` | Shared logic: contact validation (browser **and** server), JSON-LD builders, image manifest. |
| `src/jsx/` | ~100-line typed JSX→HTML runtime. Escapes by default; `raw()` is the only bypass. |
| `functions/` | Firebase Cloud Functions: `/api/contact`, `/api/assistant`. |
| `scripts/` | build, images, brand assets, OG images, preview server, lint, audit, QA tools. |
| `content/images/source/` | Original photos (never served directly; EXIF/GPS stripped on processing). |
| `public/` | Static files copied to `dist/` as-is (generated images, icons, OG images). |
| `internal/` | Old HRMS code and a desktop DB utility, moved out of the website. **Not deployed.** |
| `docs/` | Everything below. |

## Documentation
- [Deployment](docs/DEPLOYMENT.md) · [SEO](docs/SEO.md) · [Content config](docs/CONTENT-CONFIG.md)
- [Image replacement](docs/IMAGE-REPLACEMENT.md) · [Assistant](docs/CHATBOT.md) · [Contact system](docs/CONTACT.md) · [Analytics](docs/ANALYTICS.md)
- [Visual transformation & typography](docs/VISUAL-TRANSFORMATION.md) · [Security checklist](docs/SECURITY-CHECKLIST.md) · [QA report](docs/QA-REPORT.md) · [Architecture & Next.js migration](docs/ARCHITECTURE.md)
- Generated: [SEO audit](docs/reports/SEO-AUDIT.md) · [Performance audit](docs/reports/PERFORMANCE-AUDIT.md)
- **[Production report](docs/PRODUCTION-REPORT.md)** · **[Production hardening](docs/PRODUCTION-HARDENING.md)** · **[Final release report](docs/FINAL-RELEASE-REPORT.md)** · **[Release blockers](docs/RELEASE-BLOCKERS.md)** · **[Owner confirmations](docs/OWNER-CONFIRMATIONS.md)** ← read before launch
- Generated: [Release audit](docs/reports/RELEASE-AUDIT.md)

Requires **Node.js 22+**. Dependencies are pinned to the exact versions the build was verified with.

## Why not Next.js?
The brief suggested Next.js. The build environment had no package registry access, so the site is
a static generator with the same component model (typed function components + JSX). For a
content site this produces the same output Next.js static export would, with a smaller surface.
`docs/ARCHITECTURE.md` describes a mechanical migration path if you later want Next.js.
