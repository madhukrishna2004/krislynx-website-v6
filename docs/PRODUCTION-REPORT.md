# Production report — 26 Sep 2026 (pre-deployment)

Design: **frozen at V3.3** (tests/freeze.test.ts; built CSS/JS byte-identical to the approved baseline).

```text
PRODUCTION STATUS:   NOT READY — build is deployment-ready; deployment and real-world verification have not happened.

DOMAIN:              https://krislynx.com
CANONICAL:           PASS (build) — every page, og:url, sitemap and robots use https://krislynx.com (tests/predeploy.test.ts)
                     FAIL (live)  — live site still declares canonical https://www.krislynx.com (old site). Blocker: not deployed.
WWW REDIRECT:        PASS (live, today) — http://www.krislynx.com ends at https://krislynx.com on the CURRENT host.
                     Must be re-verified after hosting moves (npm run audit:domain).
HTTPS:               FAIL (not verified) — blocker: sandbox cannot reach krislynx.com (egress proxy 403); run audit:domain.
BUILD:               PASS — 30 pages, 27 sitemap URLs, clean rebuild from ZIP passes.
TESTS:               293 / 293
CHROME:              PASS (Chromium, automated: e2e 31/31 + 32/32, 7-width sweep). Real Chrome: not yet recorded.
SAFARI:              FAIL (not tested) — blocker: WebKit not installable here; needs a Mac/iPhone.
FIREFOX:             FAIL (not tested) — blocker: Firefox not installable here.
MACOS:               FAIL (not tested) — blocker: needs a real Mac.
IPHONE:              FAIL (not tested) — blocker: needs a real iPhone.
ANDROID:             FAIL (not tested) — blocker: needs a real Android device.
FIREBASE:            FAIL (not configured) — blocker: owner's Firebase project id, billing (Functions), deploy credentials.
                     Offline: config/rules/rewrites/secrets consistency PASS (tests/firebase-config.test.ts).
EMAIL:               FAIL (not verified) — blocker: Resend domain (SPF/DKIM) + secrets; no real email received yet.
CONTACT:             PASS (offline: validation, honeypot, rate limit, 200/422/429/502, no-JS) · FAIL (live: not deployed).
SEO:                 PASS (build: titles, descriptions, canonical, OG/Twitter, JSON-LD, sitemap 27, robots, favicon, 404)
                     FAIL (live: old LLP site indexed; Search Console submission pending deployment).
SECURITY:            PASS (build: CSP without unsafe-inline/eval, headers, deny-all Firestore rules, 0 secrets, no dev URLs)
                     Live headers: verify with audit:release after deployment.
LIVE RELEASE AUDIT:  FAIL (not run) — blocker: not deployed; sandbox cannot reach the domain.
LIVE CONTACT TEST:   FAIL (not run) — blocker: not deployed; needs production secrets.
```

## Pre-deployment gate (automated, tests/predeploy.test.ts — scans dist/)
No LLP / RKLS / (OPC) / old CIN / old address / connect@ / old title / TradeSphere · legal identity + CIN on every public page ·
apex canonical everywhere, no www · sitemap exactly 26 unique URLs, no hidden/dev routes · robots blocks nothing public ·
only info@krislynx.com published · no dev URLs, debug endpoints, source maps or secrets. Proven to fail on injected violations.

## Execution order (owner, networked machine)
1. `npm install && npm --prefix functions install` → commit `package-lock.json` + `functions/package-lock.json` (npm only; no yarn/pnpm locks).
2. Clean dir: `npm ci && npm --prefix functions ci && npm run check && npm run e2e && npm run audit:release` (localhost).
3. Firebase + Resend + secrets (DEPLOYMENT.md §2–§6) → `npm run deploy`.
4. Domain (DEPLOYMENT.md §7): connect apex + www to Firebase Hosting, www as **redirect** to apex. Decommission the old host.
5. `npm run audit:domain` → `KX_BASE=https://krislynx.com npm run audit:release` → `KX_BASE=https://krislynx.com KX_LIVE_TEST=yes npm run test:live-contact` + confirm the email arrives at info@krislynx.com and the Firestore document exists.
6. Browser/device matrix in PRODUCTION-HARDENING.md (record versions + dates).
7. Search Console: domain property, submit https://krislynx.com/sitemap.xml, request indexing for /, /products/edulynx-erp, /company.
   Do not report indexing until Search Console shows it.

## Owner decisions still open
- EduLynx site contact uses founder@krislynx.com; corporate site uses info@krislynx.com (separate property; not changed here).
- Photos, EduLynx screenshots, product evidence, RKLS mention, dotLottie — see OWNER-CONFIRMATIONS.md.
