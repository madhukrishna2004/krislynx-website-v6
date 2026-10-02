/**
 * Cloud Functions (2nd gen) adapters. Region asia-south1 (Mumbai) to sit
 * close to the team and Indian visitors; hosting rewrites /api/* here.
 *
 * Required configuration (never commit values):
 *   firebase functions:secrets:set RESEND_API_KEY
 *   firebase functions:secrets:set IP_HASH_SALT
 *   CONTACT_TO   (env, default info@krislynx.com — official general enquiries mailbox)
 *   CONTACT_FROM (env) sender on the Resend-verified krislynx.com domain; default info@krislynx.com.
 *   Do not introduce new mailboxes without owner confirmation (see docs/OWNER-CONFIRMATIONS.md).
 */
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret, defineString } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { handleAssistant, handleContact, type Deps, type Res } from "./handlers";

initializeApp();
const db = getFirestore();

const RESEND_API_KEY = defineSecret("RESEND_API_KEY");
const IP_HASH_SALT = defineSecret("IP_HASH_SALT");
const CONTACT_TO = defineString("CONTACT_TO", { default: "info@krislynx.com" });
const CONTACT_FROM = defineString("CONTACT_FROM", { default: "KrisLynx Website <info@krislynx.com>" });

const opts = { region: "asia-south1", memory: "256MiB" as const, maxInstances: 5, timeoutSeconds: 20 };

function send(res: { status(n: number): { json(b: unknown): void; redirect(u: string): void }; redirect(code: number, u: string): void }, out: Res): void {
  if (out.redirect) res.redirect(out.status, out.redirect);
  else res.status(out.status).json(out.json ?? {});
}

export const contact = onRequest({ ...opts, secrets: [RESEND_API_KEY, IP_HASH_SALT] }, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const deps: Deps = {
    now: () => Date.now(),
    salt: IP_HASH_SALT.value(),
    async hitRateLimit(key, windowMs) {
      const ref = db.collection("contactRateLimits").doc(key);
      return db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const now = Date.now();
        const data = snap.data() as { count: number; windowStart: number } | undefined;
        const fresh = !data || now - data.windowStart > windowMs;
        const count = fresh ? 1 : data.count + 1;
        // expireAt enables a Firestore TTL policy so hashes are deleted after 24h.
        tx.set(ref, { count, windowStart: fresh ? now : data.windowStart, expireAt: Timestamp.fromMillis(now + windowMs) });
        return count;
      });
    },
    async store(record) {
      const doc = await db.collection("enquiries").add({ ...record, createdAt: FieldValue.serverTimestamp() });
      return doc.id;
    },
    async sendEmail(msg) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY.value()}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: CONTACT_FROM.value(),
          to: [CONTACT_TO.value()],
          reply_to: msg.replyTo,
          subject: msg.subject,
          text: msg.text,
          attachments: msg.attachment ? [{ filename: msg.attachment.name, content: msg.attachment.data }] : undefined,
        }),
      });
      if (!r.ok) throw new Error(`email ${r.status}`);
    },
  };
  const out = await handleContact(
    { method: req.method, contentType: req.get("content-type") ?? "", body: req.body, ip: req.ip ?? "", origin: req.get("origin") ?? undefined },
    deps,
  );
  // Log only outcome metadata — never the enquiry contents.
  console.info("contact", { status: out.status, redirect: out.redirect ?? null });
  send(res, out);
});

export const assistant = onRequest({ ...opts }, (req, res) => {
  res.set("Cache-Control", "no-store");
  send(res, handleAssistant({ method: req.method, contentType: req.get("content-type") ?? "", body: req.body, ip: "" }));
});
