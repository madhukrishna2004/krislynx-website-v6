/** Full-screen mobile menu using a native modal <dialog> (focus containment, Esc, inert background). */
export function initMenu(): void {
  const dialog = document.getElementById("mobile-menu") as HTMLDialogElement | null;
  const opener = document.querySelector<HTMLAnchorElement>("[data-menu-open]");
  if (!dialog || !opener || typeof dialog.showModal !== "function") return;
  opener.setAttribute("role", "button");
  opener.setAttribute("aria-expanded", "false");

  const close = (): void => {
    if (dialog.open) dialog.close();
  };
  opener.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.showModal();
    opener.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("menu-open");
  });
  dialog.addEventListener("close", () => {
    opener.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
    opener.focus();
  });
  dialog.querySelector("[data-menu-close]")?.addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) close();
  });
  window.matchMedia("(min-width: 72rem)").addEventListener("change", (m) => { if (m.matches) close(); });
}
