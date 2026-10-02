# Release blockers

Complete list — nothing is tracked anywhere else. Updated 26 Sep 2026 (final release packaging).

## ⚠ URGENT
| ID | Issue | Action |
|---|---|---|
| U1 | **krislynx.com still serves the old LLP site** (checked 26 Sep 2026): "KrisLynx LLP", "RKLS Groups", TradeSphere/FearLink™ as products, canonical on www. | Deploy this build (DEPLOYMENT.md) with the www → apex redirect. See PRODUCTION-HARDENING.md. |

## TECHNICAL BLOCKERS
Must be fixed in the repository before a reproducible, verified deploy.

| ID | Issue | Why it blocks | Resolution | Owner of task |
|---|---|---|---|---|
| T1 | **Lockfiles missing** (`package-lock.json`, `functions/package-lock.json`). The build environment has no npm registry or cache, so npm cannot generate them. Hand-writing a lockfile without being able to validate it with `npm ci` was rejected as unsafe. | `npm ci` (and CI) cannot run; installs are not reproducible. | DEPLOYMENT.md §1 on any networked machine (5 commands), commit both files. | Developer |
| T2 | **Functions never installed/compiled against the real Firebase SDKs** (`firebase-functions` ^6, `firebase-admin` ^12). The request handlers are fully tested (framework-independent); the thin adapter `functions/src/index.ts` is not. | A type or API mismatch would only surface at deploy. | After T1: `npm --prefix functions run build`; deploy to a preview/staging project first. | Developer |

## DEPLOYMENT CONFIGURATION
Requires account access; cannot be done from the build environment. Each has an exact procedure in DEPLOYMENT.md.

| ID | Item | Verification |
|---|---|---|
| D1 | Firebase project id in `.firebaserc` (placeholder `krislynx-web`), Blaze plan, Firestore Native in `asia-south1` | `firebase use` succeeds |
| D2 | Deploy + verify deny-all Firestore rules | Rules Playground: unauthenticated get/list **Denied** |
| D3 | TTL policy `contactRateLimits.expireAt` | Console → TTL: *Serving*; record gone ≤ 48 h |
| D4 | Resend domain `krislynx.com` verified; secrets `RESEND_API_KEY`, `IP_HASH_SALT`; params `CONTACT_TO` = info@krislynx.com, `CONTACT_FROM` = KrisLynx Website <info@krislynx.com> | `npm run test:live-contact` + email received |
| D5 | Custom domain `krislynx.com` + `www` redirect | `audit:release` domain checks |
| D6 | **Live release audit** against https://krislynx.com — including confirmation that specific cache rules override the catch-all header on Firebase | `KX_BASE=https://krislynx.com npm run audit:release` passes |
| D7 | **Production contact test** — real Firebase, Firestore, Resend | `test:live-contact` passes + manual Firestore/email confirmation |
| D8 | Search Console: property, sitemap submitted, indexing requested, Rich Results Test | Recorded in FINAL-RELEASE-REPORT |
| D9 | Lighthouse (mobile + desktop), real-device QA, one screen-reader pass — including the interactive visualizations on Safari/Firefox (only Chromium available here); self-hosted fonts are verified in Chromium | Recorded in FINAL-RELEASE-REPORT |
| D10 | `npm run audit:deps` clean at high/critical | CI step green |

## OWNER DECISIONS
Not launch blockers — nothing unconfirmed is published. See OWNER-CONFIRMATIONS.md for the full table.
Signage "(OPC)" correction · TradeSphere name/status · SelfMate status ·
FearLink status · team members/bios · HR portal URL · analytics ID (optional) · social URLs · timeline dates ·
EduLynx price re-check on launch day · legal review · logo master · additional photos.

## Resolved during this release (for the record)
Invented sender `web@krislynx.com` removed · general enquiries switched to the owner-confirmed info@krislynx.com (recipient, sender, site, schema) · dead `**/*.html` cache rule replaced by a
catch-all revalidate rule with overrides after it · Firebase config consistency now enforced by 9 tests ·
production-only domain, caching, schema and image checks added to the release audit · guarded live contact test
script added and self-tested against the real handlers · content audit report with 0 unresolved matches.
