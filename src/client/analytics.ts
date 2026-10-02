/**
 * Consent-aware analytics.
 * - Does nothing unless a GA4 ID is configured at build time (KX_GA_ID).
 * - Loads Google Analytics only after the visitor accepts analytics cookies.
 * - Events carry only non-sensitive metadata (event name, label, page group).
 *   Form field values are never sent.
 */
type Params = Record<string, string | number | boolean>;
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: Gtag }
}

const KEY = "kx-consent";
const gaId = (): string => document.querySelector<HTMLMetaElement>('meta[name="kx-ga"]')?.content ?? "";

const readConsent = (): string | null => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
const writeConsent = (v: "granted" | "denied"): void => {
  try { localStorage.setItem(KEY, v); } catch { /* storage unavailable: choice lasts for this page only */ }
};

let loaded = false;
function loadGa(id: string): void {
  if (loaded) return;
  loaded = true;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

export function track(event: string, params: Params = {}): void {
  if (!loaded || !window.gtag) return;
  window.gtag("event", event, { page_group: document.documentElement.dataset.group ?? "", ...params });
}

export function initAnalytics(): void {
  const id = gaId();
  const banner = document.querySelector<HTMLElement>("[data-consent]");
  const settings = document.querySelector<HTMLElement>("[data-consent-open]");
  if (!id) return;
  if (settings) settings.hidden = false;
  const consent = readConsent();
  if (consent === "granted") loadGa(id);
  else if (consent === null && banner) banner.hidden = false;

  banner?.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-consent-choice]");
    if (!btn) return;
    const choice = btn.dataset.consentChoice === "granted" ? "granted" : "denied";
    writeConsent(choice);
    banner.hidden = true;
    if (choice === "granted") loadGa(id);
    else if (loaded) window.location.reload(); // stop an already-loaded GA session
  });
  settings?.addEventListener("click", () => { if (banner) banner.hidden = false; });

  // Declarative events: <a data-event="product_click" data-event-label="...">
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-event]");
    if (el?.dataset.event) track(el.dataset.event, el.dataset.eventLabel ? { label: el.dataset.eventLabel } : {});
  });
  if (document.documentElement.dataset.group === "product") track("product_view", { label: location.pathname });
}
