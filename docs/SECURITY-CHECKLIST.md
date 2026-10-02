# Security checklist

✅ = implemented and verified in this build · ☐ = action required at/after deploy

## Transport & headers (`firebase.json`)
- ✅ HSTS (1 year, includeSubDomains) — ☐ submit to hstspreload.org once stable
- ✅ Content-Security-Policy: `default-src 'self'`; no `unsafe-inline`/`unsafe-eval`; scripts only from self (+ GTM when GA is enabled); `frame-ancestors 'none'`; `object-src 'none'`; `form-action 'self'`
- ✅ Verified in a real browser: **zero CSP violations** on all routes
- ✅ CSP tightened: fonts self-hosted, so `style-src` and `font-src` are `'self'` only (Google font hosts removed)
- ✅ X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy (camera/mic/geo/payment off), COOP
- ✅ No inline scripts or style attributes anywhere (enforced by the JSX runtime, `npm run lint` and `tests/site.test.ts`); JSON-LD `<` escaped

## Output safety
- ✅ JSX runtime escapes all text/attributes; `raw()` only for build-time trusted strings
- ✅ Assistant and form status messages use `textContent`, never `innerHTML` with data (tested with an `<img onerror>` payload)
- ✅ External links `rel="noopener"`
- ✅ Unverified HR portal link removed from the public site (owner item 6)

## Contact endpoint
- ✅ Server-side validation with the same rules as the browser; lengths capped; control characters stripped
- ✅ Allow-listed select values; email/phone formats; attachment type + 4 MB limit; filename sanitised
- ✅ Honeypot, timing and link-count spam checks; silent fake success for bots
- ✅ Rate limit by **salted hash** of IP (raw IPs never stored), 24 h TTL
- ✅ Origin allow-list; POST only; `Cache-Control: no-store`
- ✅ Logs record outcome only, never enquiry content
- ☐ Set secrets `RESEND_API_KEY`, `IP_HASH_SALT`; configure Firestore TTL on `contactRateLimits.expireAt`
- ✅ Deny-all `firestore.rules` in repo and referenced by `firebase.json`
- ☐ **Deploy and verify the rules in the live project (BLOCKER B3)**
- ☐ Consider Firebase App Check if spam gets through

## Secrets & repository
- ✅ No secrets in the repo (lint scans for key patterns); `.gitignore` excludes `.env*` and service-account JSON
- ✅ Only public values in the browser bundle (GA measurement ID is public by design)
- ☐ Rotate the HRMS Firebase service-account key if the old repo ever contained `firebase-admin.json`
  (check git history: `git log --all -- '*firebase-admin*.json'`)

## Privacy
- ✅ No analytics/cookies without consent; nothing if `KX_GA_ID` unset
- ✅ EXIF/GPS stripped: 0 of 101 deployed images carry EXIF/XMP/IPTC (verified with sharp); source photos also stripped
- ✅ No photo shows the incorrect "(OPC)" legal form (reframed; see OWNER-CONFIRMATIONS item 1)
- ✅ PAN/TAN not published; only registry-public company data (name, CIN, address)
- ✅ Privacy, cookie and accessibility statements describe what the code actually does
- ☐ Have privacy/terms reviewed by Indian counsel (DPDP Act 2023 rules as they come into force)

## Separation
- ✅ HRMS moved to `internal/`, not built or deployed with the site; `/api/` and `/contact/thanks` disallowed in robots
- ☐ HRMS has **no working login code** in this repo; its template reads Firestore from the browser — see `internal/hrms/README.md`

## Dependencies
- ✅ Zero runtime dependencies in the browser bundle; site build deps are dev-only
- ✅ CI runs `npm audit --audit-level=high`
- ☐ Run `npm run audit:deps` once lockfiles exist (BLOCKER B1 / HIGH H2) and enable Dependabot
