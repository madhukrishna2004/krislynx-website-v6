# V6.3.0 — product experience
See docs/V6.3-RELEASE-REPORT.md.

# V6.2.0 — trust + brand precision
See docs/V6.2-RELEASE-REPORT.md.

# V6.1.0 — art direction pass
See docs/V6.1-RELEASE-REPORT.md. CSS-only changes; JS unchanged from V6.0.

# V6.0.0 — Oct 2026 (visual excellence)
See docs/V6-RELEASE.md. No application-code or test changes from V5.1.1-RC.

# V5.1.0 — 27 Sep 2026 (final QA pass)
See docs/V5.1-FINAL-RELEASE-REPORT.md.

# V5.0.0 — 27 Sep 2026 (finishing pass)
See docs/V5-RELEASE.md.

# V4.0.0 — 27 Sep 2026 (context layer)
See docs/V4-RELEASE.md.

# V3.0.0 — 27 Sep 2026 (technical humanism)
See docs/V3-*.md. Lottie not added (V3-LOTTIE.md).

# V2.1.0 — 27 Sep 2026 (precision release)
See V2-UX-AUDIT.md §V2.1. `npm run audit:deps` could not run here (npm registry not reachable from the build sandbox) — run it on a networked machine. functions/package-lock.json is still missing (run `npm install` in functions/).

# V2.0.0 — 27 Sep 2026
See V2-DESIGN-SYSTEM.md, V2-MOTION-SYSTEM.md, V2-UX-AUDIT.md. Root package-lock.json adopted from the owner's repository (valid, pins match); functions/package-lock.json still missing.

# Final release report — krislynx.com v1.0.0

26 September 2026 · Build environment: offline container, Node 22.22.2, Chromium via Playwright 1.56.0.

**Status: production build complete; deployment configuration and live validation remain.**
The live production path (Firebase, Firestore, Resend, domain) has **not** been tested. The site must not be
described as production-ready until the TECHNICAL BLOCKERS and DEPLOYMENT CONFIGURATION items in
`RELEASE-BLOCKERS.md` are complete.

Statuses: **VERIFIED** = tested in this environment with the result shown · **PENDING PRODUCTION** = requires
live infrastructure, accounts, devices or network · **OWNER DECISION** = business decision.

## Build and tests
| Item | Status | Evidence |
|---|---|---|
| Typecheck (strict, site + scripts + tests + functions handlers) | VERIFIED | 0 errors |
| Lint | VERIFIED | 62 files clean |
| Automated tests | VERIFIED | **293 / 293** (`npm test`; v3 adds founder-visibility, room-contrast, stage-field tests; +22 design invariants: contrast, derived technology, approved products, banned copy, self-hosted fonts). +1 regression test: redirect "shadowing" check made case-exact (Firebase paths are case-sensitive; the old probe gave a false `/Careers` failure on case-insensitive filesystems such as macOS). |
| Build | VERIFIED | 29 pages; 26 URLs in sitemap |
| Build from the unzipped release package | VERIFIED | Only the 6 declared packages, exact pinned versions asserted; `npm run check` + `npm run build` pass (see delivery note) |
| `npm ci` from lockfile | PENDING PRODUCTION | Blocker T1 — lockfiles cannot be generated without registry access |
| Functions compile against real Firebase SDKs | PENDING PRODUCTION | Blocker T2 |

## Website (verified against the local server that applies firebase.json)
| Item | Status | Evidence |
|---|---|---|
| All public routes render server-side HTML | VERIFIED | 28 routes 200, one h1, >120 visible words without JS; 404 → HTTP 404 |
| Crawler test (raw HTML, no JS) | VERIFIED | 9 required routes incl. `/about`, `/products/edulynx` (single 301) |
| JavaScript disabled | VERIFIED | Navigation, content, images, native form POST |
| SEO metadata, canonicals, uniqueness, orphans | VERIFIED | `reports/RELEASE-AUDIT.md` |
| Sitemap / robots | VERIFIED | 26 HTTPS URLs, all 200, no redirects/duplicates/noindex; robots allows assets |
| Structured data | VERIFIED (syntax, types, no unsupported claims) | Organization, WebSite, SoftwareApplication, Service, Article, BreadcrumbList |
| Legacy redirects | VERIFIED | 14 redirects, single 301 hop, correct destinations, none to homepage |
| Security headers (local) | VERIFIED | CSP, HSTS, nosniff, XFO, Referrer, Permissions, COOP |
| CSP | VERIFIED | 0 violations on all routes; 0 with GA enabled after consent; 0 GA requests before consent |
| Caching rules (local) | VERIFIED | HTML revalidates; assets immutable; images 30 days |
| Firebase config consistency | VERIFIED | 9 tests: rewrites↔exports↔region, runtime↔engines, redirects, headers, rules deny-all, secrets |
| Responsive | VERIFIED (Chromium) | 29 routes × 320/375/390/430/768/1024/1280/1440/1920; 36 screenshots inspected |
| Browser interaction tests | VERIFIED (Chromium) | 37 success-path + 38 failure-path checks (incl. 6 interactive visualizations: keyboard, hover, click, hero → system linking) |
| Accessibility — automated rules | VERIFIED (custom rule set, negative-controlled) | Accessibility-oriented implementation; **not certified** |
| Image privacy | VERIFIED | 0/101 deployed images with EXIF/XMP/IPTC; source photos stripped |
| Secret scan (source, dist, package) | VERIFIED | 0 findings |
| Content audit | VERIFIED | `reports/CONTENT-AUDIT.md`: 97 matches, 10 public (all valid), 0 unresolved |
| Company identity | VERIFIED | Certificate identity only; no "(OPC)" in text or photos; no PAN/TAN |
| General enquiries email | VERIFIED | info@krislynx.com (owner-confirmed) is the only address in public output: footer, contact, legal pages, assistant, Organization schema; contact-form recipient + sender config. Enforced by tests. |
| EduLynx claims | VERIFIED | Against erp.edulynxerp.in, 26 Sep 2026 |

## Production
| Item | Status | Notes |
|---|---|---|
| Firebase project / deploy | PENDING PRODUCTION | D1, D6 |
| Firestore rules deployed & verified | PENDING PRODUCTION | D2 — deny-all rule in repo and tested statically |
| Rate-limit TTL | PENDING PRODUCTION | D3 |
| Resend domain + secrets | PENDING PRODUCTION | D4 |
| Contact pipeline (real Firebase, Firestore, Resend) | PENDING PRODUCTION | D7 — `npm run test:live-contact` ready; self-tested against real handlers with in-memory stores only |
| Domain: HTTP→HTTPS, www→apex | PENDING PRODUCTION | D5; audit checks armed for https base |
| Live release audit | PENDING PRODUCTION | D6 — never run against https://krislynx.com |
| Search Console, sitemap submission, indexing | PENDING PRODUCTION | D8 — indexing not claimed |
| Analytics | OWNER DECISION | Off; no placeholder ID shipped |

## Lighthouse — PENDING PRODUCTION (not run; no scores claimed)
| Page | Mobile P / A / BP / SEO | Desktop P / A / BP / SEO |
|---|---|---|
| `/` | — | — |
| `/about` → `/company` | — | — |
| `/products` | — | — |
| `/products/edulynx` → `/products/edulynx-erp` | — | — |
| `/services` | — | — |
| `/work` | — | — |
| `/office` | — | — |
| `/contact` | — | — |
Build-measured context (not Lighthouse): 34–51 KB gzip HTML+CSS+JS per page; no render-blocking JS; CLS 0 in local Chromium.

## Real-device and browser QA — PENDING PRODUCTION
| Device / browser | Tested? | Navigation | Mobile menu | Forms / submit | Assistant | Office gallery | EduLynx link | 404 | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Chromium (headless, Linux) | **Yes** | ✓ | ✓ | ✓ (mock backend) | ✓ | ✓ | link present | ✓ | automated |
| iPhone (Safari) | No | | | | | | | | |
| Android (Chrome) | No | | | | | | | | |
| Mac Safari | No | | | | | | | | |
| Chrome desktop | No (Chromium only) | | | | | | | | |
| Firefox desktop | No | | | | | | | | |

## Screen reader — PENDING PRODUCTION (not performed)
Planned pass (VoiceOver iOS/macOS or NVDA + Firefox): landmarks/headings list, skip link, mobile menu dialog,
buttons, contact form labels + error announcements + status message, office photo viewer dialog, assistant
dialog and its live region. Record findings here. No WCAG conformance is claimed.

## Visual system v2 — black glass + pastel light (26 Sep 2026)
Self-hosted Bricolage Grotesque / Instrument Sans / Geist Mono — **verified rendered in Chromium**; CSP tightened to same-origin fonts; 13-chapter homepage; 8 visualizations; interaction latency 32–56 ms; LCP text, CLS ≈ 0. See VISUAL-TRANSFORMATION.md (v2).

## Visual transformation v1 (26 Sep 2026)
Typography system (Space Grotesk + Inter + system mono), numbered homepage story, 7 visualizations, founder moved to /company — see VISUAL-TRANSFORMATION.md. CSS 10.5 → 14.2 KB gzip, JS 12.2 → 12.9 KB gzip; homepage first visit 50.8 → 58.7 KB gzip (HTML+CSS+JS, excl. fonts). CLS 0 and text LCP with motion on. (v1 font caveat resolved in v2: fonts self-hosted and verified.)

## Image update (26 Sep 2026)
Meeting-room photo replaced with the supplied edited image (AI re-render; alterations documented in IMAGE-REPLACEMENT.md). Eight other supplied images not published — wrong CIN/address, garbled legal name, unverifiable scene, or unsupported product claims. 0 deployed images carry metadata.

## Owner decisions
See OWNER-CONFIRMATIONS.md (signage, TradeSphere, SelfMate, FearLink, team, HR portal, and others).
