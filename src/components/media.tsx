import type { SafeHtml } from "@kx/jsx-runtime";
import { getImage, largest, srcset } from "../lib/images";

/**
 * Responsive <picture> with AVIF → WebP → JPEG fallback. Intrinsic width and
 * height are always emitted so the browser reserves space (no layout shift).
 * Pass priority for the LCP image only: it disables lazy-loading and raises
 * fetch priority.
 */
export function Picture(props: {
  name: string;
  alt: string;
  sizes: string;
  class?: string;
  priority?: boolean;
  /** Optional art-directed crop for phones (≤ 47.99rem): a separately processed image name. */
  mobile?: string;
  mobileSizes?: string;
}): SafeHtml {
  const img = getImage(props.name);
  const phone = "(max-width: 47.99rem)";
  const mob = props.mobile ? getImage(props.mobile) : null;
  return (
    <picture class={`picture ${props.class ?? ""}`} data-tint={img.color}>
      {/* the phone crop has its own aspect ratio: declare its dimensions so the browser reserves the right box (no CLS) */}
      {mob ? <source media={phone} type="image/avif" srcset={srcset(props.mobile ?? "", "avif")} sizes={props.mobileSizes ?? "100vw"} width={String(mob.width)} height={String(mob.height)} /> : null}
      {mob ? <source media={phone} type="image/webp" srcset={srcset(props.mobile ?? "", "webp")} sizes={props.mobileSizes ?? "100vw"} width={String(mob.width)} height={String(mob.height)} /> : null}
      <source type="image/avif" srcset={srcset(props.name, "avif")} sizes={props.sizes} />
      <source type="image/webp" srcset={srcset(props.name, "webp")} sizes={props.sizes} />
      <img
        src={largest(props.name, "jpg")}
        srcset={srcset(props.name, "jpg")}
        sizes={props.sizes}
        width={img.width}
        height={img.height}
        alt={props.alt}
        loading={props.priority ? "eager" : "lazy"}
        fetchpriority={props.priority ? "high" : undefined}
        decoding="async"
      />
    </picture>
  );
}

/**
 * A designed empty state for photography that has not been supplied yet.
 * It states plainly which photo belongs in the slot — it never imitates one.
 */
export function MediaPlaceholder(props: { label: string; caption: string; ratio?: "4-3" | "16-9" | "3-4" | "1-1"; class?: string }): SafeHtml {
  return (
    <div class={`placeholder placeholder--${props.ratio ?? "4-3"} ${props.class ?? ""}`} role="img" aria-label={`Placeholder: ${props.caption}`}>
      <svg class="placeholder__grid" viewBox="0 0 120 90" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M0 0 120 90M120 0 0 90" stroke="currentColor" stroke-width=".4" vector-effect="non-scaling-stroke" fill="none" />
      </svg>
      <div class="placeholder__text">
        <span class="placeholder__label">{props.label}</span>
        <span class="placeholder__caption">{props.caption}</span>
      </div>
    </div>
  );
}
