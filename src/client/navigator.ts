/**
 * KX Navigator — ⌘K / Ctrl+K. Searches /navigator.json (built from real public pages, key sections and EduLynx
 * modules). Loaded on first open only. Native <dialog>: focus containment + Escape; focus returns to the trigger.
 */
interface Item { t: string; d: string; u: string; k: string }
const START = ["EduLynx ERP", "Products", "Technology", "Engineering services", "Start a project"];

export function initNavigator(): void {
  const dlg = document.getElementById("kxnav") as HTMLDialogElement | null;
  const input = document.getElementById("kxnav-q") as HTMLInputElement | null;
  const list = document.getElementById("kxnav-results");
  const trigger = document.querySelector<HTMLButtonElement>("[data-kxnav-open]");
  if (!dlg || !input || !list || typeof dlg.showModal !== "function") return;
  trigger?.removeAttribute("inert");
  let index: Item[] | null = null; let items: Item[] = []; let active = 0; let opener: HTMLElement | null = null;
  const norm = (s: string): string => s.toLowerCase().normalize("NFKD").replace(/[^\w\s]/g, " ");
  const search = (q: string): Item[] => {
    const all = index ?? [];
    const toks = norm(q).split(/\s+/).filter(Boolean);
    if (!toks.length) return START.map((s) => all.find((i) => i.t.toLowerCase().startsWith(s.toLowerCase()))).filter((i): i is Item => Boolean(i));
    return all.map((i) => { const t = norm(i.t), d = norm(i.d); /* grouped by kind after ranking */ if (!toks.every((k) => t.includes(k) || d.includes(k))) return null; return { i, s: toks.reduce((n, k) => n + (t.includes(k) ? 3 : 1), 0) + (t.startsWith(toks[0] ?? "") ? 2 : 0) }; })
      .filter((x): x is { i: Item; s: number } => Boolean(x)).sort((a, b) => b.s - a.s).slice(0, 10).map((x) => x.i).sort((a, b) => (a.k === b.k ? 0 : all.findIndex((x) => x.k === a.k) - all.findIndex((x) => x.k === b.k)));
  };
  const GROUP: Record<string, string> = { recent: "Recent", product: "Products", technology: "Technology", engineering: "Engineering", company: "Company", edulynx: "EduLynx modules" };
  const recent = (): Item[] => { try { const r = JSON.parse(sessionStorage.getItem("kx:recent") ?? "[]") as string[]; return r.map((u) => (index ?? []).find((i) => i.u === u)).filter((i): i is Item => Boolean(i)).map((i) => ({ ...i, k: "recent" })); } catch { return []; } };
  const render = (): void => {
    list.replaceChildren();
    let last = "";
    items.forEach((it, n) => {
      const g = GROUP[it.k] ?? "Company";
      if (g !== last) { const h = document.createElement("li"); h.className = "kxnav__group mono"; h.setAttribute("role", "presentation"); h.textContent = g; list.append(h); last = g; }
      const li = document.createElement("li"); li.id = `kxnav-o${n}`; li.setAttribute("role", "option"); li.setAttribute("aria-selected", String(n === active));
      const a = document.createElement("a"); a.href = it.u; a.tabIndex = -1;
      const k = document.createElement("span"); k.className = "kxnav__kind mono"; k.textContent = it.k;
      const t = document.createElement("span"); t.className = "kxnav__t"; t.textContent = it.t;
      const d = document.createElement("span"); d.className = "kxnav__d"; d.textContent = it.d;
      a.append(k, t, d); li.append(a); list.append(li);
    });
    if (!items.length) { const li = document.createElement("li"); li.className = "kxnav__empty"; li.textContent = "No matching page. Try “EduLynx”, “architecture” or “contact”."; list.append(li); }
    input.setAttribute("aria-activedescendant", items.length ? `kxnav-o${active}` : "");
  };
  const open = async (): Promise<void> => {
    if (dlg.open) return;
    opener = document.activeElement as HTMLElement | null;
    dlg.showModal(); input.value = ""; input.focus();
    if (!index) { try { index = (await (await fetch("/navigator.json")).json()) as Item[]; } catch { index = []; } }
    const rec = recent().slice(0, 3);
    items = [...rec, ...search("").filter((i) => !rec.some((r) => r.u === i.u))]; active = 0; render();
  };
  trigger?.addEventListener("click", () => void open());
  addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); if (dlg.open) dlg.close(); else void open(); } });
  input.addEventListener("input", () => { items = search(input.value); active = 0; render(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); if (!items.length) return; active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length; render(); list.querySelector(`#kxnav-o${active}`)?.scrollIntoView({ block: "nearest" }); }
    if (e.key === "Enter" && items[active]) { e.preventDefault(); location.href = items[active]?.u ?? "/"; }
    // type="search" clears on Escape instead of closing the dialog; Escape must always close the navigator
    if (e.key === "Escape") { e.preventDefault(); dlg.close(); }
  });
  dlg.addEventListener("close", () => opener?.focus());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
}

/** EduLynx school day → the illustrative interface follows the selected stop (same module, no scroll jump). */
export function initDaySync(): void {
  const day = document.querySelector<HTMLElement>('[data-viz="day"]');
  if (!day) return;
  new MutationObserver(() => {
    const tab = document.getElementById(`em-tab-${day.dataset.active ?? ""}`) as HTMLElement | null;
    if (tab && tab.getAttribute("aria-selected") !== "true") tab.click();
  }).observe(day, { attributes: true, attributeFilter: ["data-active"] });
}
