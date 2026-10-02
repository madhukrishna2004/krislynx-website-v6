/**
 * KX EXPERIENCE STATE — local UI context only.
 * Stores which AREAS of the site this browser tab has explored (sessionStorage; cleared when the tab closes).
 * Never stores identity, text, or anything personal, and never leaves the browser.
 */
const KEY = "kx:areas";
const AREAS: [RegExp, string][] = [
  [/^\/products\/edulynx-erp/, "edulynx"], [/^\/products/, "products"], [/^\/technology/, "technology"], [/^\/services\/artificial-intelligence/, "ai"],
  [/^\/services/, "services"], [/^\/work/, "work"], [/^\/(company|office|careers)/, "company"], [/^\/contact/, "contact"],
];
/** hero node → areas that count as "explored" for it */
const NODE_AREAS: Record<string, string[]> = { products: ["products", "edulynx"], ai: ["ai"], data: ["technology"], apps: ["services", "work"], people: ["company"] };
/** homepage sections → areas */
const SECTION_AREAS: Record<string, string> = { products: "products", flagship: "edulynx", intelligence: "ai", technology: "technology", engineer: "services", work: "work", about: "company" };

function read(): Set<string> {
  try { return new Set(JSON.parse(sessionStorage.getItem(KEY) ?? "[]") as string[]); } catch { return new Set(); }
}
function add(area: string): void {
  try { const s = read(); if (s.has(area)) return; s.add(area); sessionStorage.setItem(KEY, JSON.stringify([...s].slice(-16))); } catch { /* storage unavailable: no memory, no problem */ }
}

export function initExperience(): void {
  // recent pages for the KX Navigator (this tab only; paths, nothing personal)
  try { const r = (JSON.parse(sessionStorage.getItem("kx:recent") ?? "[]") as string[]).filter((u) => u !== location.pathname); r.unshift(location.pathname); sessionStorage.setItem("kx:recent", JSON.stringify(r.slice(0, 5))); } catch { /* no storage: no recents */ }
  const hit = AREAS.find(([re]) => re.test(location.pathname));
  if (hit) add(hit[1]);
  document.documentElement.dataset.area = hit?.[1] ?? (location.pathname === "/" ? "home" : "other");
  const nodes = document.querySelectorAll<HTMLElement>(".hc__node[data-node]");
  if (!nodes.length) return;
  const paint = (): void => {
    const s = read();
    nodes.forEach((n) => n.classList.toggle("is-visited", (NODE_AREAS[n.dataset.node ?? ""] ?? []).some((a) => s.has(a))));
  };
  paint();
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { const a = SECTION_AREAS[e.target.id]; if (a) add(a); }
  }, { threshold: 0.35 });
  Object.keys(SECTION_AREAS).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  addEventListener("pageshow", paint);
}
