/**
 * Contact form enhancement: inline validation (shared rules), attachment
 * checks, fetch submission, and explicit loading / success / error states.
 * Field values are never sent to analytics — only the chosen "need" category.
 */
import { contactConfig } from "../config/contact";
import { company } from "../config/company";
import { validateAttachment, validateContact, type ContactField, type ContactInput } from "../lib/contact-validation";
import { track } from "./analytics";

const FIELD_IDS: Record<ContactField, string> = {
  name: "cf-name", email: "cf-email", company: "cf-company", country: "cf-country", phone: "cf-phone",
  need: "cf-need", details: "cf-details", timeline: "cf-timeline", stage: "cf-stage", budget: "cf-budget", consent: "cf-consent",
};

function setError(id: string, message: string | null): void {
  const wrap = document.querySelector<HTMLElement>(`[data-field="${id}"]`);
  const err = document.querySelector<HTMLElement>(`[data-error-for="${id}"]`);
  const control = document.getElementById(id);
  if (!wrap || !err || !control) return;
  if (message) {
    wrap.setAttribute("data-invalid", "");
    control.setAttribute("aria-invalid", "true");
    err.textContent = message;
    err.hidden = false;
  } else {
    wrap.removeAttribute("data-invalid");
    control.removeAttribute("aria-invalid");
    err.textContent = "";
    err.hidden = true;
  }
}

const readFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export function initContact(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;
  const status = form.querySelector<HTMLElement>("[data-form-status]");
  const submit = form.querySelector<HTMLButtonElement>("[data-submit]");
  const country = form.querySelector<HTMLSelectElement>("#cf-country");
  const dial = form.querySelector<HTMLElement>("[data-dial-display]");
  const fileInput = form.querySelector<HTMLInputElement>("#cf-file");
  const started = form.querySelector<HTMLInputElement>("[data-started]");
  const tz = form.querySelector<HTMLInputElement>("[data-tz]");
  const source = form.querySelector<HTMLInputElement>("[data-source]");

  if (started) started.value = String(Date.now());
  try { if (tz) tz.value = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { /* optional */ }
  if (source) source.value = document.referrer ? new URL(document.referrer).hostname : "direct";

  // Pre-select "what do you need" from ?need= (used by product CTAs and the assistant).
  const need = new URLSearchParams(location.search).get("need");
  const stage = new URLSearchParams(location.search).get("stage");
  if (stage && contactConfig.stages.some((n) => n.value === stage)) {
    const r = form.querySelector<HTMLInputElement>(`input[name="stage"][value="${stage}"]`);
    if (r) r.checked = true;
  }
  if (need && contactConfig.needs.some((n) => n.value === need)) {
    const radio = form.querySelector<HTMLInputElement>(`input[name="need"][value="${need}"]`);
    if (radio) radio.checked = true;
  }

  const syncDial = (): void => {
    const opt = country?.selectedOptions[0];
    if (dial) dial.textContent = opt?.dataset.dial ? `+${opt.dataset.dial}` : "+";
  };
  country?.addEventListener("change", syncDial);
  syncDial();

  const collect = (): ContactInput => {
    const fd = new FormData(form);
    const out: Record<string, string> = {};
    fd.forEach((v, k) => { if (typeof v === "string") out[k] = v; });
    return out as ContactInput;
  };

  // Validate a field once the visitor leaves it, then live after the first error.
  form.addEventListener("focusout", (e) => {
    const t = e.target as HTMLElement;
    const entry = (Object.entries(FIELD_IDS) as [ContactField, string][]).find(([, id]) => id === t.id);
    if (!entry) return;
    const [field, id] = entry;
    const r = validateContact(collect());
    const touched = (t as HTMLInputElement).value !== "" || t.closest("[data-invalid]");
    if (touched) setError(id, r.errors[field] ?? null);
  });
  form.addEventListener("change", (e) => {
    const t = e.target as HTMLInputElement;
    if (t.type !== "radio") return;
    const group = t.closest<HTMLElement>("fieldset[data-field]");
    const entry = (Object.entries(FIELD_IDS) as [ContactField, string][]).find(([, id]) => id === group?.id);
    if (entry) setError(entry[1], validateContact(collect()).errors[entry[0]] ?? null);
  });
  form.addEventListener("input", (e) => {
    const t = e.target as HTMLElement;
    if (!t.closest("[data-invalid]")) return;
    const entry = (Object.entries(FIELD_IDS) as [ContactField, string][]).find(([, id]) => id === t.id);
    if (entry) setError(entry[1], validateContact(collect()).errors[entry[0]] ?? null);
  });
  fileInput?.addEventListener("change", () => setError("cf-file", validateAttachment(fileInput.files?.[0] ?? null)));

  const showStatus = (kind: "success" | "error", title: string, body: string, mailto?: string): void => {
    if (!status) return;
    status.className = `form-status form-status--${kind}`;
    status.replaceChildren();
    const h = document.createElement("h3");
    h.textContent = title;
    const p = document.createElement("p");
    p.textContent = body;
    status.append(h, p);
    if (kind === "success") {
      // completion sequence (textual, so it reads the same with or without motion)
      const seq = document.createElement("ol");
      seq.className = "form-seq";
      for (const step of ["Request received", "Routed to the team", "We'll reply within two working days"]) {
        const li = document.createElement("li");
        li.textContent = step;
        seq.append(li);
      }
      status.append(seq);
    }
    if (mailto) {
      const a = document.createElement("a");
      a.href = mailto;
      a.textContent = `Email ${company.email} instead`;
      status.append(a);
    }
    status.hidden = false;
    status.focus();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = collect();
    const result = validateContact(input);
    const file = fileInput?.files?.[0] ?? null;
    const fileError = validateAttachment(file);

    (Object.entries(FIELD_IDS) as [ContactField, string][]).forEach(([f, id]) => setError(id, result.errors[f] ?? null));
    setError("cf-file", fileError);
    const firstInvalid = form.querySelector<HTMLElement>("[aria-invalid='true']");
    if (firstInvalid || fileError) {
      (firstInvalid ?? fileInput)?.focus();
      if (status) status.hidden = true;
      return;
    }

    submit?.setAttribute("aria-busy", "true");
    if (submit) submit.disabled = true;
    const label = submit?.querySelector(".btn__label");
    if (label) label.textContent = "Sending request…";
    try {
      const payload: Record<string, unknown> = { ...input };
      if (file) payload.attachment = { name: file.name.slice(0, 120), type: file.type, data: await readFile(file) };
      const res = await fetch(contactConfig.endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Partial<Record<ContactField, string>>; error?: string };
      if (res.status === 422 && data.errors) {
        (Object.entries(data.errors) as [ContactField, string][]).forEach(([f, msg]) => setError(FIELD_IDS[f], msg));
        form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
        return;
      }
      if (!res.ok || !data.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      track("contact_submit", { need: result.value.need });
      if (result.value.need === "edulynx-demo") track("demo_request", { label: "contact_form" });
      form.reset();
      syncDial();
      if (started) started.value = String(Date.now());
      showStatus("success", "Project request received", `Your message has reached KrisLynx. We'll reply to ${result.value.email} within two working days.`);
    } catch {
      const subject = encodeURIComponent(`Enquiry from ${result.value.company}`);
      showStatus(
        "error",
        "Your message didn't send.",
        "Nothing you typed has been lost — try again in a moment, or email us directly.",
        `mailto:${company.email}?subject=${subject}`,
      );
    } finally {
      submit?.removeAttribute("aria-busy");
      if (submit) submit.disabled = false;
      if (label) label.textContent = "Start the conversation";
    }
  });
}
