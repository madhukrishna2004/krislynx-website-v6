/** Office gallery lightbox. Without JS each photo link opens the full image. */
export function initLightbox(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-lightbox]"));
  if (!links.length) return;
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.setAttribute("aria-label", "Photo viewer");
  dialog.innerHTML =
    '<figure><img alt=""><figcaption class="lightbox__bar"><span data-cap></span>' +
    '<span><button type="button" class="btn btn--ghost" data-prev><span>Previous</span></button> ' +
    '<button type="button" class="btn btn--ghost" data-next><span>Next</span></button> ' +
    '<button type="button" class="btn btn--inverse" data-close><span>Close</span></button></span></figcaption></figure>';
  document.body.appendChild(dialog);
  const img = dialog.querySelector("img") as HTMLImageElement;
  const cap = dialog.querySelector("[data-cap]") as HTMLElement;
  let index = 0;
  const show = (i: number): void => {
    index = (i + links.length) % links.length;
    const a = links[index];
    if (!a) return;
    img.src = a.href;
    img.alt = a.querySelector("img")?.alt ?? "";
    cap.textContent = a.dataset.caption ?? "";
  };
  links.forEach((a, i) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      show(i);
      dialog.showModal();
    }),
  );
  dialog.querySelector("[data-prev]")?.addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-next]")?.addEventListener("click", () => show(index + 1));
  dialog.querySelector("[data-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
}
