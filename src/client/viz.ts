/**
 * Interactive visualizations ([data-viz]): tab semantics (one selected node ↔ one visible panel),
 * root[data-active] drives CSS path highlighting. Without JS every panel is visible and nothing is hidden.
 */
const reduce = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = (): boolean => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function initOne(root: HTMLElement): void {
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  if (!tabs.length) return;
  let userTouched = false;
  const select = (tab: HTMLButtonElement, focus = false): void => {
    const key = tab.dataset.key ?? "";
    root.dataset.active = key;
    for (const t of tabs) {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    }
    root.querySelectorAll<HTMLElement>("[data-viz-panel]").forEach((p) => {
      if (p.dataset.vizPanel === key) p.removeAttribute("data-inactive");
      else p.setAttribute("data-inactive", "");
    });
    if (focus) tab.focus();
  };
  const initial = tabs.find((t) => t.getAttribute("aria-selected") === "true") ?? tabs[0];
  if (initial) select(initial);
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => { userTouched = true; select(tab); });
    tab.addEventListener("mouseenter", () => { if (finePointer()) { userTouched = true; select(tab); } });
    tab.addEventListener("keydown", (e) => {
      const n = tabs.length;
      const next: Record<string, number> = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 };
      const idx = next[e.key];
      const target = idx === undefined ? undefined : tabs[idx];
      if (target) { e.preventDefault(); userTouched = true; select(target, true); }
    });
  });
  // One-time autoplay for step sequences, only when visible, never with reduced motion, stops on interaction.
  if (root.hasAttribute("data-viz-autoplay") && !reduce() && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      let i = 0;
      const timer = window.setInterval(() => {
        i++;
        const t = tabs[i];
        if (userTouched || !t) { window.clearInterval(timer); return; }
        select(t);
      }, 2200);
    }, { threshold: 0.5 });
    io.observe(root);
  }
}

export function initViz(): void {
  document.querySelectorAll<HTMLElement>("[data-viz]").forEach(initOne);
}

/** Scroll reveal: elements are only hidden when JS runs AND motion is allowed. */
export function initReveal(): void {
  if (reduce() || !("IntersectionObserver" in window)) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (!els.length) return;
  // Anything already on screen (or above it) is never hidden; printing reveals everything.
  const vh = window.innerHeight;
  const pending = els.filter((el) => el.getBoundingClientRect().top > vh * 0.92);
  if (!pending.length) return;
  document.documentElement.classList.add("reveal-ready");
  els.filter((el) => !pending.includes(el)).forEach((el) => el.classList.add("is-in"));
  window.addEventListener("beforeprint", () => els.forEach((el) => el.classList.add("is-in")));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
  pending.forEach((el) => io.observe(el));
}

const canHover = (): boolean => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Hover/focus maps ([data-map]): hovering a [data-node] lights its connection. Works with keyboard focus too. */
export function initMaps(): void {
  document.querySelectorAll<HTMLElement>("[data-map]").forEach((root) => {
    root.querySelectorAll<HTMLElement>("[data-node]").forEach((n) => {
      const on = (): void => { root.dataset.active = n.dataset.node ?? ""; };
      const off = (): void => { delete root.dataset.active; };
      n.addEventListener("mouseenter", on);
      n.addEventListener("focus", on);
      n.addEventListener("mouseleave", off);
      n.addEventListener("blur", off);
    });
  });
  // "Enter the system": a hero node selects the same node in the system explorer.
  document.querySelectorAll<HTMLAnchorElement>("[data-select]").forEach((a) => {
    a.addEventListener("click", () => {
      const tab = document.getElementById(a.dataset.select ?? "");
      if (tab instanceof HTMLButtonElement) window.setTimeout(() => tab.click(), 0);
    });
  });
}

/** Glass header gains opacity once the page scrolls. */
export function initHeader(): void {
  const h = document.querySelector<HTMLElement>("[data-header]");
  if (!h) return;
  const update = (): void => { h.classList.toggle("is-scrolled", window.scrollY > 8); };
  update();
  window.addEventListener("scroll", update, { passive: true });
  // product-aware state while an EduLynx zone sits under the navigation
  const zones = document.querySelectorAll("[data-product-zone]");
  if (zones.length && "IntersectionObserver" in window) {
    const inView = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target);
        else inView.delete(e.target);
      }
      h.classList.toggle("is-product", inView.size > 0);
    }, { rootMargin: "-10% 0px -80% 0px" });
    zones.forEach((z) => io.observe(z));
  }
}

/**
 * Pointer light + parallax (desktop, fine pointer, motion allowed). Uses CSSOM custom properties,
 * which the CSP permits (it only forbids style attributes in markup).
 */
export function initPointer(): void {
  if (!canHover() || reduce()) return;
  document.querySelectorAll<HTMLElement>(".pointer-light").forEach((el) => {
    const stage = el.querySelector<HTMLElement>("[data-parallax]");
    let raf = 0;
    el.addEventListener("pointermove", (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--px", `${(x * 100).toFixed(1)}%`);
        el.style.setProperty("--py", `${(y * 100).toFixed(1)}%`);
        el.style.setProperty("--pl", "1");
        if (stage) {
          stage.style.setProperty("--tx", `${((x - 0.5) * 8).toFixed(1)}px`);
          stage.style.setProperty("--ty", `${((y - 0.5) * 6).toFixed(1)}px`);
        }
      });
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--pl", "0");
      stage?.style.setProperty("--tx", "0px");
      stage?.style.setProperty("--ty", "0px");
    });
  });
}

/** Section rail: marks the section in view; switches contrast over light sections. Pauses offscreen motion. */
export function initRailAndPause(): void {
  if (!("IntersectionObserver" in window)) return;
  const rail = document.querySelector<HTMLElement>("[data-rail]");
  if (rail) {
    const links = Array.from(rail.querySelectorAll<HTMLAnchorElement>("[data-rail-link]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const id = (e.target as HTMLElement).id;
        for (const l of links) {
          if (l.dataset.railLink === id) l.setAttribute("aria-current", "true");
          else l.removeAttribute("aria-current");
        }
        rail.classList.toggle("on-light", e.target.matches(".section--paper, .section--white"));
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach((l) => { const s = document.getElementById(l.dataset.railLink ?? ""); if (s) io.observe(s); });
  }
  const pause = new IntersectionObserver((entries) => {
    for (const e of entries) {
      e.target.classList.toggle("anim-off", !e.isIntersecting);
    }
  });
  document.querySelectorAll(".smap, .df, .pp").forEach((el) => pause.observe(el));
}

/**
 * Six-layer architecture (disclosure pattern): one layer open at a time; selecting propagates the dependency
 * signal (CSS keyed on root[data-active]). Arrow Up/Down/Home/End move between layers; Enter/Space select (native).
 */
export function initArch(): void {
  document.querySelectorAll<HTMLElement>("[data-arch]").forEach((root) => {
    const btns = Array.from(root.querySelectorAll<HTMLButtonElement>(".arch3__layer"));
    const select = (b: HTMLButtonElement, focus = false): void => {
      const key = b.dataset.key ?? "";
      root.dataset.active = key;
      for (const x of btns) {
        const on = x === b;
        x.setAttribute("aria-expanded", String(on));
        const st = x.querySelector(".arch3__state");
        if (st) st.textContent = on ? "Selected" : "";
      }
      root.querySelectorAll<HTMLElement>("[data-arch-panel]").forEach((p) => {
        if (p.dataset.archPanel === key) p.removeAttribute("data-inactive");
        else p.setAttribute("data-inactive", "");
      });
      if (focus) b.focus();
    };
    // trace: step the dependency signal through every layer, top→bottom (request) or bottom→top (response)
    const trace = root.querySelector<HTMLElement>("[data-arch-trace]");
    let timer = 0;
    trace?.removeAttribute("inert");
    trace?.querySelectorAll<HTMLButtonElement>("button").forEach((t) => t.addEventListener("click", () => {
      window.clearInterval(timer);
      const seq = t.dataset.dir === "up" ? [...btns].reverse() : btns;
      root.dataset.trace = t.dataset.dir === "up" ? "up" : "down";
      btns.forEach((x) => x.classList.remove("is-traced"));
      let k = 0; select(seq[0] as HTMLButtonElement); seq[0]?.classList.add("is-traced");
      timer = window.setInterval(() => {
        k++; const nb = seq[k];
        if (!nb) { window.clearInterval(timer); window.setTimeout(() => { delete root.dataset.trace; btns.forEach((x) => x.classList.remove("is-traced")); }, 1600); return; }
        nb.classList.add("is-traced"); select(nb);
      }, matchMedia("(prefers-reduced-motion: reduce)").matches ? 900 : 520);
    }));
    btns.forEach((b, i) => {
      b.addEventListener("click", () => { window.clearInterval(timer); select(b); });
      b.addEventListener("keydown", (e) => {
        const n = btns.length;
        const to: Record<string, number> = { ArrowDown: (i + 1) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 };
        const t = to[e.key] === undefined ? undefined : btns[to[e.key] as number];
        if (t) { e.preventDefault(); select(t, true); }
      });
    });
  });
}
