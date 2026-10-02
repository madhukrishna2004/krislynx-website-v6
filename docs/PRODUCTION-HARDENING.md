# Production hardening — status after design freeze (26 Sep 2026)

**Design is frozen at V3.3** (enforced by `tests/freeze.test.ts`: typography roles, frozen scale, room palette, font
families, no animation/3D libraries). Visual changes only for: factual corrections, supplied assets, accessibility,
responsive, compatibility, performance or security defects.

## ⚠ Live-site finding (checked 26 Sep 2026)
`https://krislynx.com` is **still serving the old site**: title "KrisLynx LLP: AI & TradeTech Innovators",
"KrisLynx LLP" identity, "RKLS Groups" in keywords, TradeSphere and FearLink™ presented as products, founder-centred
metadata, canonical `https://www.krislynx.com`. Every one of these is corrected in this build. **Deploying is the single
highest-impact remaining task.** The new canonical host is the apex `https://krislynx.com`, so the
`www → apex` redirect (DEPLOYMENT.md §7) is required to consolidate search signals.

## Status matrix
| # | Area | Status | Evidence / action |
|---|---|---|---|
| 1 | Lockfiles | **BLOCKED here** (no npm registry in build environment) | Owner/dev machine: `npm install && npm --prefix functions install && npm run check`, commit both lockfiles (DEPLOYMENT §1). |
| 2 | Browsers | Chromium **VERIFIED**; Safari/WebKit and Firefox **not installed here** | Manual matrix below. |
| 3 | Real devices | **PENDING** | Manual matrix below. |
| 4 | Firebase (hosting, functions, Firestore, rules) | **NEEDS CONFIGURATION** | DEPLOYMENT §2–§6; rules file + config consistency tested offline (9 tests). |
| 5 | Email (Resend, SPF, DKIM, Reply-To, delivery) | **NEEDS CONFIGURATION** | DEPLOYMENT §5; then `npm run test:live-contact`. |
| 6 | Domain (apex, www, HTTPS, redirects, canonical) | **PENDING DEPLOYMENT** | DEPLOYMENT §7; audit checks armed for https base. |
| 7 | Live checks | **PENDING DEPLOYMENT** — the sandbox proxy blocks krislynx.com (HTTP 403) | `KX_BASE=https://krislynx.com npm run audit:release` and `KX_BASE=https://krislynx.com KX_LIVE_TEST=yes npm run test:live-contact`. |
| 8 | EduLynx product links | **VERIFIED live** | All 7 linked URLs present on erp.edulynxerp.in; claims (12 modules, pricing, Claude, security) match. `tests/links.test.ts`. |

## Manual browser / device matrix (record results here)
| Check | Chrome (mac) | Safari (mac) | Firefox (mac) | iPhone Safari | Android Chrome |
|---|---|---|---|---|---|
| Fonts render (Bricolage headings, Instrument body, Geist Mono labels) | | | | | |
| Floating nav: top → scrolled → EduLynx states; backdrop blur | | | | | |
| Sticky header does not cover anchors (#flagship etc.) | | | | | |
| Hero: nodes focus/hover (desktop), tap navigates + explanations visible (mobile) | | | | | |
| SVG: hero paths, orbit spokes, architecture spine, dashed AI boundary | | | | | |
| Room seams/blends look continuous (no banding) | | | | | |
| Orbit: select, relationships, "See the interface" cross-link | | | | | |
| Service step diagrams: tap/keyboard selection | | | | | |
| Contact chips: tap targets, selection, errors, success/failure states | | | | | |
| Photo crop (meeting room) and no layout shift | | | | | |
| prefers-reduced-motion: all motion stops | | | | | |
| Keyboard: skip link, focus rings, menu dialog, assistant dialog | | | | | |

## Owner items raised by this check
- **erp.edulynxerp.in lists `founder@krislynx.com`** as its contact, while krislynx.com now uses the confirmed
  `info@krislynx.com` for general enquiries. Decide whether the EduLynx site should also move to info@ (separate property).
