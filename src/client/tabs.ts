/** WAI-ARIA tabs: arrow keys, Home/End, automatic activation. */
export function initTabs(): void {
  document.querySelectorAll<HTMLElement>("[data-tabs]").forEach((root) => {
    const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls") ?? ""));
    const select = (i: number, focus: boolean): void => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        const p = panels[j];
        if (p) { if (on) p.removeAttribute("data-inactive"); else p.setAttribute("data-inactive", ""); }
      });
      if (focus) tabs[i]?.focus();
    };
    select(0, false);
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i, false));
      t.addEventListener("keydown", (e) => {
        const n = tabs.length;
        const map: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
        const next = map[e.key];
        if (next !== undefined) { e.preventDefault(); select(next, true); }
      });
    });
  });
}
