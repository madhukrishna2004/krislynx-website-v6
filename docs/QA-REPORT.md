# QA report — v1.0.0 (26 September 2026)

> Superseded in detail by `FINAL-RELEASE-REPORT.md` and `reports/RELEASE-AUDIT.md` (pre-launch gate). Figures below are current.

## Automated results
| Check | Tool | Result |
|---|---|---|
| Strict typecheck (site, scripts, tests, functions handlers) | `npm run typecheck` | ✅ 0 errors |
| Lint rules (no `any`, no console.log shipped, no inline styles, no secrets) | `npm run lint` | ✅ 62 files clean |
| Unit + integrity tests | `npm test` | ✅ **293 / 293 pass** |
| Browser interaction tests | `npm run e2e` | ✅ 55 / 55 pass (success path) · ✅ 56 / 56 (failure path, `KX_MOCK_FAIL=1`) |
| Responsive sweep: 29 routes × 320/390/768/1024/1440/1920 px | `npm run sweep` | ✅ no horizontal overflow, no console/CSP errors, all images have alt + dimensions |
| Build integrity (unique titles, one h1, descriptions) | `npm run build` | ✅ 29 pages, 26 in sitemap |
| Release audit: raw-HTML crawler test, sitemap, 14 redirects, 404, headers, exposure, no-JS, CSP, a11y rules | `npm run audit:release` | ✅ pass (local server applying firebase.json) |

### What the tests cover
JSX escaping and CSP enforcement · contact validation and spam rules · assistant matching, fallback and
HTML-injection safety · contact/assistant server handlers (200, 422, 429, 502, 303, 403, spam, oversize) ·
every built page: title, description, canonical, OG image exists, one h1, JSON-LD parses, **zero broken
internal links**, no inline styles/scripts · sitemap ⇄ files ⇄ indexability · robots · absence of the old
site's fabricated claims · company identity (CIN, email, PIN) present.

### E2E interaction checks
Mobile menu opens as modal, reports `aria-expanded`, closes on Esc and returns focus · tabs: one visible
panel, arrow-key navigation · assistant: opens, answers pricing from the approved KB, falls back on unknown
questions, renders hostile input as text · contact: `?need=` preselect, empty-submit errors (6 fields) with
focus on first, email message, country → dial code, successful send, failed send keeps values and offers
email · 404 page status and content · legacy `/about` → `/company`.

## Issues found during QA and fixed
| Issue | Cause | Fix |
|---|---|---|
| Spacing missing on many lists site-wide | Reset `ul[class]` out-ranked component classes | Reset wrapped in `:where()` |
| Hero connector lines drawn as dashes | `pathLength` + dash pattern | Absolute dash lengths |
| Hero nodes misplaced after animation | Animation `transform` overrode centring | Animate `translate` property |
| Office gallery overflowed at 768 px | `height:100%` + `aspect-ratio` derived width | Width-driven sizing |
| 13 px overflow at 320 px (cards, contact heading) | Grid items `min-width:auto` | `minmax(0,1fr)` columns, heading wrapping |
| Contact form buried below intro on mobile | Source order | Grid areas: heading → form → next steps |
| Lowercase "india" in copy | `toLowerCase()` on config text | Explicit copy |
| "(OPC)" legible in 3 office photos | Reception-counter banner in frame | Photos reframed (cropped); banner out of frame |
| Assistant answered unpublished-fact questions with unrelated entries | Keyword overlap | Guarded topics checked before matching |
| Contact H1 split mid-word at 1440 px | Display size in narrow column + `hyphens:auto` | Column-sized heading, no auto-hyphenation |
| Office LCP image lazy-loaded | Default `loading=lazy` | First gallery image eager + `fetchpriority=high` |
| Half the office gallery was placeholders | Empty slots rendered publicly | Only real photos rendered; slots documented |
| Titles too long with suffix | — | Shortened 5 titles |

## Accessibility-oriented implementation (self-assessed against WCAG 2.2 AA criteria; not certified, not independently audited)
✅ Landmarks, skip link, one h1, logical heading order · ✅ Keyboard: all controls reachable, visible 3 px focus
rings (sky on dark, blue on light), native `<dialog>` for menu/assistant/lightbox (focus trap + Esc + return) ·
✅ Target size ≥ 44 px for primary controls · ✅ Form labels, required/optional text, errors linked and announced,
`role="status"` results · ✅ `prefers-reduced-motion` disables all motion · ✅ Text contrast: body #0A1428 on
#F3F6FA ≈ 17:1; secondary #45536B on white ≈ 7.8:1; muted text on ink #A9B8CF on #0A1428 ≈ 9.1:1; status badges ≥ 4.7:1 (lowest pair measured: 4.71:1) ·
✅ Works without JavaScript (except attachments and the assistant, which falls back to a contact link).

## Limits of this QA (honest)
- Built offline: Google Fonts didn't load, so screenshots use fallback fonts. Lighthouse, real devices,
  Safari/Firefox, axe-core and screen readers were **not** run. Browser: **Chromium 1.56 only**.
- Cloud Functions were tested as handlers with fakes, not deployed against real Firestore/Resend.

## Checks to run after deploy
1. Lighthouse (mobile) on `/`, `/products/edulynx-erp`, `/contact` — target ≥ 95 in all four categories.
2. securityheaders.com and Mozilla Observatory on `https://krislynx.com`.
3. Google Rich Results Test on `/`, `/products/edulynx-erp`, `/work/edulynx-erp`.
4. Submit a real enquiry with an attachment; confirm email + Firestore record; submit 6 times to see the rate limit.
5. VoiceOver (iOS Safari) and NVDA (Firefox): menu, assistant, contact form.
6. Test on a mid-range Android on 4G.
7. Verify `www.krislynx.com` and every legacy URL redirects with 301.
