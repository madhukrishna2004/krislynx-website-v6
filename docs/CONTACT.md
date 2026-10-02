# Contact system

## Flow
1. **Browser** (`src/client/contact.ts`): validates with `src/lib/contact-validation.ts` on blur and submit,
   links errors to fields (`aria-describedby`, `aria-invalid`), focuses the first error, checks the attachment
   (≤ 4 MB; PDF/DOCX/PPTX/PNG/JPG), then POSTs JSON (attachment base64) to `/api/contact`.
   States: *Sending…* (button busy) → success message **or** error message with a pre-filled `mailto:` fallback.
   Field values are kept on failure.
2. **No JavaScript**: the form posts `application/x-www-form-urlencoded` to the same endpoint, which 303-redirects
   to `/contact/thanks` (or back to `/contact?error=…`). Attachments require JS.
3. **Server** (`functions/src/handlers.ts`): same validation module → spam checks → rate limit → store → email.

## Anti-spam (layered, invisible to people)
- Honeypot field `website` (off-screen, `aria-hidden`, `tabindex=-1`).
- Minimum fill time 3 s (timestamp set when the form becomes interactive).
- More than 5 links in the message → spam.
- Spam receives a normal-looking success so bots learn nothing; nothing is stored.
- Rate limit: 5 submissions per salted-SHA-256 IP hash per 24 h (Firestore transaction, TTL-deleted).
- Origin check: only krislynx.com (+ localhost for development).
If abuse appears later, add Firebase App Check or Cloudflare Turnstile (then update CSP `script-src`/`frame-src`).

## Where enquiries go
- Firestore `enquiries` collection (backup, visible in the console).
- Email to `CONTACT_TO` with `reply-to` set to the visitor, plus the attachment.
- If email fails the record is still stored and the visitor is told to email directly (HTTP 502).

## Pre-filling
`/contact?need=edulynx-demo` (or `ai`, `saas`, `enterprise`, `cloud`, `new-product`, `other`) pre-selects
"What do you need?". Service pages and product CTAs already use this.

## Tests
`tests/contact-validation.test.ts`, `tests/functions.test.ts` (success, 422, spam, 429, 502, no-JS redirect,
foreign origin, oversized attachment) and `scripts/e2e.ts` (real browser, success + failure states).
