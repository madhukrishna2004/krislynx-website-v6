/**
 * Framework-independent request handlers so they can be unit-tested without
 * Firebase. index.ts adapts them to Cloud Functions (2nd gen).
 *
 * Contact flow: parse (JSON or urlencoded) → validate with the SAME rules as
 * the browser → spam checks (honeypot, fill time, link count) → rate limit by
 * salted IP hash → store in Firestore → email via Resend → respond.
 * Secrets come only from environment/Secret Manager; nothing is logged that
 * contains the enquiry's content.
 */
import { createHash } from "node:crypto";
import { validateContact, validateAttachment, type ContactInput, type CleanContact } from "../../src/lib/contact-validation";
import { contactConfig } from "../../src/config/contact";
import { answer, isGreeting } from "../../src/client/assistant/engine";
import { assistantConfig } from "../../src/config/assistant";

export interface Attachment { name: string; type: string; data: string }
export interface Deps {
  now(): number;
  /** returns number of submissions from this key in the window, after recording this one */
  hitRateLimit(key: string, windowMs: number): Promise<number>;
  store(record: CleanContact & { receivedAt: string; ipHash: string; hasAttachment: boolean }): Promise<string>;
  sendEmail(msg: { subject: string; text: string; replyTo: string; attachment?: Attachment }): Promise<void>;
  salt: string;
}

export interface Req { method: string; contentType: string; body: unknown; ip: string; origin?: string }
export interface Res { status: number; json?: Record<string, unknown>; redirect?: string }

export const RATE_LIMIT = { max: 5, windowMs: 24 * 60 * 60 * 1000 };
export const ALLOWED_ORIGINS = ["https://krislynx.com", "https://www.krislynx.com", "http://localhost:4173", "http://localhost:5000"];

const hashIp = (ip: string, salt: string): string => createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
const isForm = (ct: string): boolean => ct.includes("application/x-www-form-urlencoded") || ct.includes("multipart/form-data");

export function emailText(v: CleanContact, labels = contactConfig): string {
  const find = (list: readonly { value: string; label: string }[], val: string): string => list.find((o) => o.value === val)?.label ?? "—";
  return [
    `New enquiry via krislynx.com`,
    ``,
    `Name:      ${v.name}`,
    `Email:     ${v.email}`,
    `Company:   ${v.company}`,
    `Country:   ${v.country}`,
    `Phone:     ${v.phone || "—"}`,
    `Need:      ${find(labels.needs, v.need)}`,
    `Timeline:  ${find(labels.timelines, v.timeline)}`,
    `Stage:     ${find(labels.stages, v.stage)}`,
    `Budget:    ${find(labels.budgets, v.budget)}`,
    `Time zone: ${v.tz || "—"}`,
    `Referrer:  ${v.source || "—"}`,
    ``,
    `Details:`,
    v.details,
  ].join("\n");
}

export async function handleContact(req: Req, deps: Deps): Promise<Res> {
  const form = isForm(req.contentType);
  if (req.method !== "POST") return { status: 405, json: { ok: false, error: "method_not_allowed" } };
  if (req.origin && !ALLOWED_ORIGINS.includes(req.origin)) return { status: 403, json: { ok: false, error: "origin_not_allowed" } };
  if (typeof req.body !== "object" || req.body === null) return { status: 400, json: { ok: false, error: "bad_request" } };

  const raw = req.body as ContactInput & { attachment?: Attachment };
  // No-JS form posts carry no timing field set by script; skip the timing check for them.
  const result = validateContact(raw, { now: deps.now(), checkTiming: !form });

  // Spam: pretend success so bots learn nothing.
  if (result.spam) return form ? { status: 303, redirect: "/contact/thanks" } : { status: 200, json: { ok: true } };
  if (!result.ok) {
    return form ? { status: 303, redirect: "/contact?error=validation" } : { status: 422, json: { ok: false, errors: result.errors } };
  }

  let attachment: Attachment | undefined;
  if (raw.attachment && typeof raw.attachment === "object") {
    const a = raw.attachment;
    const size = Math.floor((String(a.data ?? "").length * 3) / 4);
    const err = validateAttachment({ size, type: String(a.type ?? "") });
    if (err) return { status: 422, json: { ok: false, errors: { details: err } } };
    attachment = { name: String(a.name ?? "attachment").replace(/[^\w.\- ]/g, "_").slice(0, 120), type: String(a.type), data: String(a.data) };
  }

  const ipHash = hashIp(req.ip || "unknown", deps.salt);
  const count = await deps.hitRateLimit(ipHash, RATE_LIMIT.windowMs);
  if (count > RATE_LIMIT.max) {
    return form ? { status: 303, redirect: "/contact?error=rate" } : { status: 429, json: { ok: false, error: "rate_limited" } };
  }

  const id = await deps.store({ ...result.value, receivedAt: new Date(deps.now()).toISOString(), ipHash, hasAttachment: Boolean(attachment) });
  try {
    await deps.sendEmail({
      subject: `[krislynx.com] ${result.value.company} — ${contactConfig.needs.find((n) => n.value === result.value.need)?.label ?? "Enquiry"}`,
      text: emailText(result.value),
      replyTo: result.value.email,
      attachment,
    });
  } catch {
    // Stored already; the team can still see it in Firestore. Report failure so the visitor can email directly.
    return form ? { status: 303, redirect: "/contact?error=send" } : { status: 502, json: { ok: false, error: "delivery_failed", id } };
  }
  return form ? { status: 303, redirect: "/contact/thanks" } : { status: 200, json: { ok: true, id } };
}

/** Assistant endpoint: same approved knowledge base as the browser. No generative model, no storage of questions. */
export function handleAssistant(req: Req): Res {
  if (req.method !== "POST") return { status: 405, json: { ok: false } };
  const q = typeof (req.body as { question?: unknown })?.question === "string" ? String((req.body as { question: string }).question).slice(0, 300) : "";
  if (!q.trim()) return { status: 400, json: { ok: false, error: "empty" } };
  if (isGreeting(q)) return { status: 200, json: { text: assistantConfig.greeting, links: [], matched: "greeting" } };
  const m = answer(q);
  if (!m) return { status: 200, json: { text: assistantConfig.fallback, links: [{ label: "Contact the team", href: "/contact", event: "chatbot_lead" }], matched: null } };
  return { status: 200, json: { text: m.entry.answer, links: m.entry.links ?? [], matched: m.entry.id } };
}
