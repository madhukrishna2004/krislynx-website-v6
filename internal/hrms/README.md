# KrisLynx HRMS (internal — not part of the public website)

Moved out of the old website repository so HR code is never built into, deployed with, or indexed as part
of krislynx.com. Hosting serves only `dist/`; `/internal/…` returns 404 (verified).

## What was found
1. `backend/firebase_admin.py` shadowed the `firebase_admin` package while routes imported `firebase_admin_init` (non-existent) — the app could not start.
2. Service-account JSON loaded from a file inside the repo directory.
3. `app.run(debug=True)` — Werkzeug debugger exposed.
4. `login_required` lacked `functools.wraps` (Flask endpoint collision on the second decorated view).
5. `SECRET_KEY` could be `None`; no Secure/HttpOnly/SameSite cookie flags.
6. `auth/routes.py` defines `hr_bp` (an HR dashboard), but `app.py` imports `auth_bp`. **There is no login handler anywhere** — no password check, no session creation.
7. POST forms (attendance, EOD, payroll) have no CSRF protection.
8. No password hashing, MFA or lockout.
9. `frontend/templates/employee/profile.html` initialises the Firebase **client** SDK and reads Firestore directly from the browser (config values are placeholders — no secret exposed). HR data security therefore depends on that project's Firestore rules.

## What was fixed (minimal, safe changes only)
Items 1–5: renamed to `firebase_admin_init.py`; credentials from `GOOGLE_APPLICATION_CREDENTIALS`; debug off unless `FLASK_DEBUG=1`; `@wraps` added; `SECRET_KEY` required; cookie flags set. `.env.example` added. Python files compile.

## What remains
Items 6–9. Authentication was **not** invented — that needs an owner decision and a proper design (hashing, MFA, CSRF, rules).

## What needs owner verification
- Which repository/branch Render actually deploys for `https://hr-portal-krislynx.onrender.com/login`.
- Whether that deployment has working, secure authentication.
- The HR Firebase project's Firestore rules.
The public website **no longer links** to the portal until this is confirmed.

`../tools/tradesphere_db_explorer.py` is a desktop DB utility from the old repo, unrelated to the website; kept for reference only.
