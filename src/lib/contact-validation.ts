/**
 * Contact enquiry validation — shared by the browser (inline errors) and the
 * server function (authoritative). Pure: no DOM, no Node APIs.
 */
import { contactConfig } from "../config/contact";
import { isCountryCode } from "../config/countries";

export interface ContactInput {
  name?: string;
  email?: string;
  company?: string;
  country?: string;
  phone?: string;
  need?: string;
  details?: string;
  timeline?: string;
  stage?: string;
  budget?: string;
  consent?: string;
  website?: string; // honeypot
  started?: string; // ms timestamp when the form became interactive
  tz?: string;
  source?: string;
}

export interface CleanContact {
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  need: string;
  details: string;
  timeline: string;
  stage: string;
  budget: string;
  tz: string;
  source: string;
}

export type ContactField = "name" | "email" | "company" | "country" | "phone" | "need" | "details" | "timeline" | "stage" | "budget" | "consent";

export interface ValidationResult {
  ok: boolean;
  /** true when spam signals fired; callers should respond as if successful */
  spam: boolean;
  errors: Partial<Record<ContactField, string>>;
  value: CleanContact;
  /** non-blocking advice, e.g. free-mail address */
  hints: Partial<Record<ContactField, string>>;
}

// Strip control characters (except newlines/tabs in the details field) and trim.
const clean = (v: unknown, max: number, multiline = false): string => {
  const s = typeof v === "string" ? v : "";
  const stripped = multiline ? s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") : s.replace(/[\u0000-\u001F\u007F]/g, " ");
  return stripped.trim().slice(0, max);
};

export const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()\-.]{7,24}$/;

const inList = (value: string, list: readonly { value: string }[]): boolean => list.some((o) => o.value === value);

export function validateContact(input: ContactInput, opts: { now?: number; checkTiming?: boolean } = {}): ValidationResult {
  const value: CleanContact = {
    name: clean(input.name, 120),
    email: clean(input.email, 200).toLowerCase(),
    company: clean(input.company, 160),
    country: clean(input.country, 2).toUpperCase(),
    phone: clean(input.phone, 24),
    need: clean(input.need, 40),
    details: clean(input.details, contactConfig.maxDetails, true),
    timeline: clean(input.timeline, 20),
    stage: clean(input.stage, 20),
    budget: clean(input.budget, 20),
    tz: clean(input.tz, 64),
    source: clean(input.source, 200),
  };
  const errors: ValidationResult["errors"] = {};
  const hints: ValidationResult["hints"] = {};

  if (value.name.length < 2) errors.name = "Enter your name.";
  if (!EMAIL_RE.test(value.email)) errors.email = "Enter a valid email address, like name@company.com.";
  else {
    const domain = value.email.split("@")[1] ?? "";
    if ((contactConfig.freeMailDomains as readonly string[]).includes(domain)) hints.email = "A business address helps us reply faster, but this one is fine.";
  }
  if (value.company.length < 2) errors.company = "Enter your company or organization name.";
  if (!isCountryCode(value.country)) errors.country = "Select your country.";
  if (value.phone && !PHONE_RE.test(value.phone)) errors.phone = "Use digits, spaces and an optional leading +.";
  if (!inList(value.need, contactConfig.needs)) errors.need = "Choose what you need help with.";
  if (value.details.length < contactConfig.minDetails)
    errors.details = `Add a little more detail — at least ${contactConfig.minDetails} characters.`;
  if (value.timeline && !inList(value.timeline, contactConfig.timelines)) errors.timeline = "Choose a timeline from the list.";
  if (value.stage && !inList(value.stage, contactConfig.stages)) errors.stage = "Choose a project stage from the list.";
  if (value.budget && !inList(value.budget, contactConfig.budgets)) errors.budget = "Choose a budget range from the list.";
  if (input.consent !== "yes" && input.consent !== "on" && input.consent !== "true") errors.consent = "Please confirm you agree so we can reply.";

  let spam = false;
  if (typeof input.website === "string" && input.website.trim() !== "") spam = true;
  if (opts.checkTiming) {
    const started = Number(input.started);
    const now = opts.now ?? Date.now();
    if (!Number.isFinite(started) || started <= 0 || now - started < contactConfig.minFillMs) spam = true;
  }
  const links = (value.details.match(/https?:\/\//g) ?? []).length;
  if (links > 5) spam = true;

  return { ok: Object.keys(errors).length === 0 && !spam, spam, errors, value, hints };
}

export function validateAttachment(file: { size: number; type: string } | null): string | null {
  if (!file) return null;
  if (file.size > contactConfig.maxAttachmentBytes) return "The file is larger than 4 MB. Attach a smaller file or email it to us.";
  if (!(contactConfig.attachmentTypes as readonly string[]).includes(file.type)) return "Attach a PDF, DOCX, PPTX, PNG or JPG file.";
  return null;
}
