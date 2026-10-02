/**
 * Minimal, typed JSX → HTML string runtime for static pre-rendering.
 *
 * Why not React? Every public page is rendered once at build time and shipped
 * as plain HTML. We need JSX composition and type safety, not a client-side
 * reconciler. This runtime escapes all text and attribute values by default;
 * the only way to emit unescaped markup is the explicit `raw()` helper, which
 * is reserved for trusted, build-time strings (JSON-LD, traced SVG paths).
 *
 * The component API mirrors React function components, so migrating to
 * React/Next.js later means swapping this import source, not rewriting pages.
 */

export class SafeHtml {
  constructor(readonly html: string) {}
  toString(): string {
    return this.html;
  }
}

export type Child = SafeHtml | string | number | boolean | null | undefined | Child[];

type AttrValue = string | number | boolean | null | undefined;

export interface HtmlAttributes {
  children?: Child;
  class?: string;
  id?: string;
  [attr: string]: AttrValue | Child;
}

export type Component<P = object> = (props: P & { children?: Child }) => SafeHtml;

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESC[c] ?? c);
}

/** Emit trusted, build-time markup without escaping. Never pass user input. */
export function raw(html: string): SafeHtml {
  return new SafeHtml(html);
}

function renderChild(child: Child): string {
  if (child === null || child === undefined || child === false || child === true) return "";
  if (child instanceof SafeHtml) return child.html;
  if (Array.isArray(child)) return child.map(renderChild).join("");
  return escapeHtml(String(child));
}

const ATTR_ALIASES: Record<string, string> = { className: "class", htmlFor: "for" };

function renderAttrs(props: Record<string, unknown>): string {
  let out = "";
  for (const [key, value] of Object.entries(props)) {
    if (key === "children" || key === "dangerouslySetInnerHTML") continue;
    if (key === "style") {
      // Inline styles are blocked by the Content-Security-Policy. Use classes.
      throw new Error("Inline style attributes are not allowed; use a CSS class.");
    }
    if (value === null || value === undefined || value === false) continue;
    const name = ATTR_ALIASES[key] ?? key;
    if (value === true) {
      out += ` ${name}`;
    } else {
      out += ` ${name}="${escapeHtml(String(value))}"`;
    }
  }
  return out;
}

type Tag = string | Component<Record<string, unknown>>;

export function jsx(type: Tag, props: Record<string, unknown>): SafeHtml {
  if (typeof type === "function") return type(props);
  const attrs = renderAttrs(props);
  if (VOID.has(type)) return new SafeHtml(`<${type}${attrs}>`);
  return new SafeHtml(`<${type}${attrs}>${renderChild(props.children as Child)}</${type}>`);
}

export const jsxs = jsx;
export const jsxDEV = jsx;

export function Fragment(props: { children?: Child }): SafeHtml {
  return new SafeHtml(renderChild(props.children));
}

export function render(node: Child): string {
  return renderChild(node);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
  export type Element = SafeHtml;
  export interface ElementChildrenAttribute {
    children: object;
  }
  export interface IntrinsicElements {
    [element: string]: HtmlAttributes;
  }
}
