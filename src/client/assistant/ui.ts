/**
 * KrisLynx Assistant UI. Provider abstraction:
 *   local  – engine.ts over the approved knowledge base (default)
 *   remote – POST to assistantConfig.remoteEndpoint; on any failure the
 *            local provider answers instead, so visitors always get an
 *            approved answer or the approved fallback.
 */
import { assistantConfig, type KnowledgeEntry } from "../../config/assistant";
import { answer, isGreeting } from "./engine";
import { track } from "../analytics";

interface Reply { text: string; links: NonNullable<KnowledgeEntry["links"]>; matched: string | null; source?: string; card?: KnowledgeEntry["card"] }

interface Provider { ask(q: string): Promise<Reply> }

const local: Provider = {
  async ask(q) {
    if (isGreeting(q)) return { text: assistantConfig.greeting, links: [], matched: "greeting" };
    const m = answer(q);
    if (!m) return { text: assistantConfig.fallback, links: [{ label: "Explore KrisLynx", href: "/" }, { label: "Explore products", href: "/products" }, { label: "Start a project", href: "/contact", event: "chatbot_lead" }], matched: null };
    return { text: m.entry.answer, links: m.entry.links ?? [], matched: m.entry.id, source: m.entry.source ?? "KrisLynx website", card: m.entry.card };
  },
};

const remote: Provider = {
  async ask(q) {
    try {
      const res = await fetch(assistantConfig.remoteEndpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q.slice(0, 300) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as Partial<Reply>;
      if (typeof data.text !== "string") throw new Error("bad payload");
      return { text: data.text, links: Array.isArray(data.links) ? data.links : [], matched: data.matched ?? null };
    } catch {
      return local.ask(q);
    }
  },
};

const provider: Provider = assistantConfig.mode === "remote" ? remote : local;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  n.className = cls;
  if (text) n.textContent = text; // textContent only: never inject HTML
  return n;
}

export function initAssistant(): void {
  const dialog = document.getElementById("assistant-dialog") as HTMLDialogElement | null;
  const opener = document.querySelector<HTMLAnchorElement>("[data-assistant-open]");
  const log = document.querySelector<HTMLElement>("[data-assistant-log]");
  const form = document.querySelector<HTMLFormElement>("[data-assistant-form]");
  const sugg = document.querySelector<HTMLElement>("[data-assistant-suggestions]");
  if (!dialog || !opener || !log || !form || !sugg || typeof dialog.showModal !== "function") return;
  const input = form.querySelector("input") as HTMLInputElement;
  opener.setAttribute("role", "button");
  opener.setAttribute("aria-expanded", "false");

  const addMsg = (who: "bot" | "user", text: string, links: Reply["links"] = [], source?: string, card?: Reply["card"]): HTMLElement => {
    const m = el("div", `msg msg--${who}`);
    m.appendChild(el("p", "msg__text", text));
    if (card) {
      const c = el("a", "msg__card"); c.href = card.href;
      c.append(el("span", "msg__card-k mono", card.kicker), el("span", "msg__card-t", card.title), el("span", "msg__card-cta", `${card.cta} →`));
      m.appendChild(c);
      links = links.filter((l) => l.href !== card.href);
    }
    if (links.length) {
      const wrap = el("div", "msg__links");
      for (const l of links) {
        const a = el("a", "", l.label);
        a.href = l.href;
        if (/^https?:/.test(l.href)) { a.target = "_blank"; a.rel = "noopener"; }
        if (l.event) a.dataset.event = l.event;
        wrap.appendChild(a);
      }
      m.appendChild(wrap);
    }
    if (source) m.appendChild(el("p", "msg__source mono", `Source · ${source}`));
    log.appendChild(m);
    log.scrollTop = log.scrollHeight;
    return m;
  };

  /** Honest loading: only shown if an answer takes longer than 150ms (the local knowledge base answers instantly). */
  const thinking = (): (() => void) => {
    let node: HTMLElement | null = null;
    const t = window.setTimeout(() => { node = el("div", "msg msg--bot msg--thinking"); node.appendChild(el("p", "msg__text mono", "KX is preparing an answer…")); log.appendChild(node); log.scrollTop = log.scrollHeight; }, 150);
    return () => { window.clearTimeout(t); node?.remove(); };
  };

  const errorMsg = (q: string): void => {
    const m = addMsg("bot", "I couldn't reach the assistant right now. You can still explore KrisLynx or start a project directly.", [{ label: "Explore KrisLynx", href: "/" }, { label: "Start a project", href: "/contact", event: "chatbot_lead" }]);
    const retry = el("button", "msg__retry", "Try again");
    retry.type = "button";
    retry.addEventListener("click", () => { m.remove(); void ask(q, true); });
    m.querySelector(".msg__links")?.prepend(retry);
  };

  const ask = async (q: string, retrying = false): Promise<void> => {
    const question = q.trim();
    if (!question) return;
    if (!retrying) addMsg("user", question);
    dialog.classList.add("is-conversing"); // prompts collapse to one scrollable row so the answer gets the space
    const done = thinking();
    let r: Reply;
    try { r = await provider.ask(question); } catch { done(); errorMsg(question); return; }
    done();
    addMsg("bot", r.text, r.links, r.matched && r.matched !== "greeting" ? r.source : undefined, r.card);
    // Only the matched topic id is tracked — never the visitor's words.
    track("chatbot_question", { topic: r.matched ?? "unmatched" });
  };

  // page-aware prompts (e.g. EduLynx questions on the EduLynx page)
  const ctx = assistantConfig.contexts.find((c) => location.pathname.startsWith(c.prefix));
  const label = sugg.querySelector("[data-assistant-context]");
  if (label && ctx) label.textContent = ctx.label;
  (ctx ? ctx.prompts : assistantConfig.suggestions).forEach((s) => {
    const b = el("button", "", s);
    b.type = "button";
    b.addEventListener("click", () => void ask(s));
    sugg.appendChild(b);
  });

  let greeted = false;
  opener.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.showModal();
    opener.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("dialog-open");
    if (!greeted) { addMsg("bot", ctx ? `${ctx.intro} ${assistantConfig.greeting}` : assistantConfig.greeting); greeted = true; }
    input.focus();
    track("chatbot_open");
  });
  dialog.addEventListener("close", () => {
    opener.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("dialog-open");
    opener.focus();
  });
  dialog.querySelector("[data-assistant-close]")?.addEventListener("click", () => dialog.close());
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = "";
    void ask(q);
  });
}
