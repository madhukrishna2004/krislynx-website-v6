# Deployment runbook

Do these in order. Every step names how it is verified. Nothing here can be performed from the offline build
environment; each step is **PENDING PRODUCTION** until done by someone with account access.

Target: Firebase Hosting (`dist/`) + Cloud Functions 2nd gen, Node 22, region `asia-south1` (`/api/contact`,
`/api/assistant`) + Firestore + Resend.

## 1. Reproducible install (technical blocker T1)
On any networked machine with Node 22:
```bash
npm install                      # creates package-lock.json from the pinned versions
npm --prefix functions install   # creates functions/package-lock.json
npm run check                    # typecheck + lint + tests must pass
npm --prefix functions run build # must produce functions/lib/index.cjs
git add package-lock.json functions/package-lock.json && git commit -m "Add lockfiles"
```
Then prove reproducibility from a clean clone: `git clone … && npm ci && npm run check && npm run build && npm --prefix functions ci && npm --prefix functions run build`.
`npm run audit:deps` → resolve any high/critical advisories before deploy.

## 2. Firebase project
1. Create/choose the project; put its id in `.firebaserc` (currently the placeholder `krislynx-web`).
2. Upgrade to **Blaze** (required for Functions and outbound HTTPS to Resend).
3. Create Firestore in **Native mode**, location `asia-south1` (Mumbai) to match the functions.
4. `firebase login`, `firebase use <project-id>`.

## 3. Firestore access model
| Who | Access | How |
|---|---|---|
| Website visitors (browser) | **None.** Cannot read, write, delete, list or enumerate anything — enquiries, rate-limit records or any future collection. | `firestore.rules`: a single `allow read, write: if false` over `/{document=**}`. The website never loads the Firebase client SDK. |
| `contact` Cloud Function | Create `enquiries/*`; read/write `contactRateLimits/{hash}` in a transaction. | Firebase **Admin SDK** with the function's runtime service account (default compute SA). Admin SDK access is governed by **IAM, not rules**. |
| `assistant` Cloud Function | None. | Answers from the bundled knowledge base only. |
| Company staff | Read/delete enquiries. | Firebase console, via Google accounts granted a project IAM role (e.g. *Cloud Datastore Viewer/User*). Grant the minimum; review quarterly. |

Deploy and verify the rules:
```bash
firebase deploy --only firestore:rules
```
Verify: Firebase console → Firestore → Rules shows the deny-all rule; **Rules Playground**: simulate an
unauthenticated `get` on `/enquiries/test` and a `list` on `/contactRateLimits` → both **Denied**.

## 4. Rate-limit TTL
| Collection | Field | Retention |
|---|---|---|
| `contactRateLimits` | `expireAt` (Timestamp, set to window start + 24 h) | 24 h window; Firestore TTL deletes documents after `expireAt` — typically within 24 h of expiry, not instantly. |
```bash
gcloud firestore fields ttls update expireAt --collection-group=contactRateLimits --enable-ttl --project=<project-id>
```
Correctness never depends on deletion timing: the function starts a fresh window whenever the stored window
is older than 24 h. Verify: console → Firestore → **TTL** lists the policy as *Serving*; 48 h after a test
submission the corresponding `contactRateLimits` document is gone. Documents store only a salted SHA-256 hash of the IP.

## 5. Email (Resend)
1. Resend: add and **verify the domain `krislynx.com`** (SPF + DKIM DNS records it provides).
2. Secrets (Secret Manager — never in files, never in the browser):
   ```bash
   firebase functions:secrets:set RESEND_API_KEY
   firebase functions:secrets:set IP_HASH_SALT      # e.g. output of: openssl rand -hex 32
   ```
3. `cp functions/.env.example functions/.env` (not committed). Values:
   | Param | Value | Meaning |
   |---|---|---|
   | `CONTACT_TO` | `info@krislynx.com` | Recipient of enquiries (official general enquiries mailbox) |
   | `CONTACT_FROM` | `KrisLynx Website <info@krislynx.com>` | Sender; must be on the verified domain |
   | Reply-To | set automatically | the visitor's email address |
   Do not introduce any other mailbox. founder@krislynx.com is only for contexts that specifically intend direct founder contact.

## 6. Deploy
```bash
npm ci && npm --prefix functions ci
npm run deploy         # check → firebase deploy --only hosting,functions:website
firebase deploy --only firestore
```
Optional analytics: only if the owner provides a real GA4 ID, build with `KX_GA_ID=G-…`; never a placeholder.

## 7. Domain
1. Hosting → Add custom domain `krislynx.com` (primary). Add `www.krislynx.com` → **Redirect to krislynx.com**.
2. Apply the DNS records shown; wait for certificates. Firebase Hosting serves HTTPS only and redirects HTTP → HTTPS.
3. Verified by step 8 (`http://`, `https://www.`, `http://www.` → `https://krislynx.com/`, single hop, then 200).


### Current domain state (checked 26 Sep 2026)
The **current** host already redirects `http://www.krislynx.com` → `https://krislynx.com` (apex), but still serves the old
LLP site, whose canonical wrongly points at www. When DNS moves to Firebase Hosting:
- add **both** `krislynx.com` and `www.krislynx.com` as custom domains; set **www → redirect to krislynx.com** (Firebase console);
- remove the old host's records so no old page remains reachable; Firebase serves HTTP→HTTPS and HSTS (set in firebase.json);
- HTML is served with short caching (see firebase.json headers), so no manual CDN purge is needed after deploy; verify with
  `npm run audit:domain` (reports cache-control / age per variant and fails if any LLP content is still served).

## 8. Live validation (all must pass)
```bash
KX_BASE=https://krislynx.com npm run audit:release          # routes, sitemap, robots, canonicals, metadata,
                                                             # redirects, headers, caching, 404, schema, images, domain
KX_BASE=https://krislynx.com KX_LIVE_TEST=yes npm run test:live-contact
```
The contact test creates one marked enquiry plus up to four marked rate-limit probes (and their emails), then
prints the manual confirmations: Firestore record exists, spam records do not, email arrived at info@krislynx.com with correct
From/Reply-To/recipient. **Delete all documents containing the printed `KX-RELEASE-TEST` marker afterwards.**
Also confirm in the browser: submit the form on /contact → success message.

## 9. Search engines
1. Search Console: add **Domain property** `krislynx.com` (DNS TXT).
2. Sitemaps → submit `https://krislynx.com/sitemap.xml`.
3. URL Inspection → *Test live URL* then *Request indexing* for `/`, `/products/edulynx-erp`, `/services`, `/company`, `/contact`.
4. Rich Results Test on `/` (Organization, WebSite), `/products/edulynx-erp` (SoftwareApplication, Breadcrumb), `/work/edulynx-erp`.
5. Record outcomes in FINAL-RELEASE-REPORT.md. Indexing is Google's decision and takes days; don't report it as done until Search Console shows the pages indexed.

## 10. Manual QA
Lighthouse, real devices and screen reader — procedure and result table in FINAL-RELEASE-REPORT.md.

## Rollback
Hosting → Release history → Rollback. Functions: redeploy the previous commit. Rules: redeploy the previous `firestore.rules`.
