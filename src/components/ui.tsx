import { raw, type Child, type SafeHtml } from "@kx/jsx-runtime";
import markPath from "../generated/mark-path.json";
import wordPath from "../generated/wordmark-path.json";
import { type ProductStatus } from "../config/products";
import type { Crumb } from "../lib/page";

/* ---------------------------------------------------------------- Brand -- */

let gradientCount = 0;

/** The KrisLynx mark, traced from the supplied artwork. Never stretched: viewBox keeps its ratio. */
export function Mark(props: { class?: string; tone?: "gradient" | "white" | "ink"; title?: string }): SafeHtml {
  const tone = props.tone ?? "gradient";
  const id = `kxg${++gradientCount}`;
  const fill = tone === "gradient" ? `url(#${id})` : tone === "white" ? "#FFFFFF" : "currentColor";
  const defs =
    tone === "gradient"
      ? `<defs><linearGradient id="${id}" x1="0" y1=".62" x2="1" y2=".38"><stop offset="0" stop-color="#0A4DFF"/><stop offset=".55" stop-color="#08A6F7"/><stop offset="1" stop-color="#7BEFFB"/></linearGradient></defs>`
      : "";
  const label = props.title ? `role="img" aria-label="${props.title}"` : `aria-hidden="true" focusable="false"`;
  return raw(
    `<svg class="${props.class ?? "mark"}" viewBox="0 0 ${markPath.w} ${markPath.h}" ${label}>${defs}<path fill="${fill}" fill-rule="evenodd" d="${markPath.d}"/></svg>`,
  );
}

/** Horizontal lockup: mark + traced KRISLYNX wordmark. Clear space is set in CSS (.lockup gap). */
export function Lockup(props: { tone?: "light" | "dark"; class?: string }): SafeHtml {
  const tone = props.tone ?? "dark";
  return (
    <span class={`lockup lockup--${tone} ${props.class ?? ""}`}>
      <Mark tone={tone === "dark" ? "gradient" : "gradient"} class="lockup__mark" />
      {raw(
        `<svg class="lockup__word" viewBox="0 0 ${wordPath.w} ${wordPath.h}" aria-hidden="true" focusable="false"><path fill="currentColor" fill-rule="evenodd" d="${wordPath.d}"/></svg>`,
      )}
      <span class="lockup__sub">Technologies</span>
    </span>
  );
}

/* --------------------------------------------------------------- Layout -- */

export function Container(props: { children?: Child; class?: string; narrow?: boolean }): SafeHtml {
  return <div class={`container${props.narrow ? " container--narrow" : ""} ${props.class ?? ""}`}>{props.children}</div>;
}

type Tone = "paper" | "white" | "ink" | "ink-deep";

export function Section(props: {
  children?: Child;
  tone?: Tone;
  id?: string;
  labelledBy?: string;
  class?: string;
  tight?: boolean;
}): SafeHtml {
  return (
    <section
      id={props.id}
      aria-labelledby={props.labelledBy}
      class={`section section--${props.tone ?? "paper"}${props.tight ? " section--tight" : ""} ${props.class ?? ""}`}
    >
      {props.children}
    </section>
  );
}

/** Section heading: an h2 with an optional lede. `kicker` is used only where it carries information (e.g. a sequence number). */
/** Compact monospace technical label: "01 / SYSTEMS". Decorative numbering is hidden from screen readers. */
export function TechLabel(props: { index?: string; label: string; class?: string }): SafeHtml {
  return (
    <p class={`tlabel ${props.class ?? ""}`}>
      {props.index ? (
        <span class="tlabel__index" aria-hidden="true">
          {props.index}
        </span>
      ) : null}
      {props.index ? (
        <span class="tlabel__sep" aria-hidden="true">
          /
        </span>
      ) : null}
      <span>{props.label}</span>
    </p>
  );
}

export function SectionHeader(props: {
  id: string;
  title: string;
  lede?: Child;
  kicker?: string;
  /** Technical section index, e.g. "01", rendered as "01 / LABEL". */
  index?: string;
  label?: string;
  align?: "start" | "split";
  level?: 2 | 3;
  children?: Child;
}): SafeHtml {
  const H = props.level === 3 ? "h3" : "h2";
  return (
    <header class={`section-header section-header--${props.align ?? "start"}`}>
      <div class="section-header__title">
        {props.index || props.label ? <TechLabel index={props.index} label={props.label ?? ""} /> : null}
        {props.kicker ? <p class="kicker">{props.kicker}</p> : null}
        <H id={props.id} class="display-2">
          {props.title}
        </H>
      </div>
      {props.lede ? <div class="section-header__lede lede">{props.lede}</div> : null}
      {props.children}
    </header>
  );
}

/* -------------------------------------------------------------- Actions -- */

type Variant = "primary" | "secondary" | "ghost" | "inverse";

export function ButtonLink(props: {
  href: string;
  children?: Child;
  variant?: Variant;
  external?: boolean;
  event?: string;
  eventLabel?: string;
  class?: string;
  size?: "md" | "lg";
}): SafeHtml {
  return (
    <a
      href={props.href}
      class={`btn btn--${props.variant ?? "primary"}${props.size === "lg" ? " btn--lg" : ""} ${props.class ?? ""}`}
      target={props.external ? "_blank" : undefined}
      rel={props.external ? "noopener" : undefined}
      data-event={props.event}
      data-event-label={props.eventLabel}
    >
      <span>{props.children}</span>
      {props.external ? <ExternalIcon /> : null}
      {props.external ? <span class="visually-hidden"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function TextLink(props: { href: string; children?: Child; external?: boolean; event?: string; class?: string }): SafeHtml {
  return (
    <a
      href={props.href}
      class={`text-link ${props.class ?? ""}`}
      target={props.external ? "_blank" : undefined}
      rel={props.external ? "noopener" : undefined}
      data-event={props.event}
    >
      {props.children}
      {props.external ? <ExternalIcon /> : <ChevronIcon />}
      {props.external ? <span class="visually-hidden"> (opens in a new tab)</span> : null}
    </a>
  );
}

/* ---------------------------------------------------------------- Icons -- */

export const ExternalIcon = (): SafeHtml =>
  raw(`<svg class="icon icon--ext" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M6 3h7v7M13 3 5 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

export const ChevronIcon = (): SafeHtml =>
  raw(`<svg class="icon icon--chev" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

export const CheckIcon = (): SafeHtml =>
  raw(`<svg class="icon icon--check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`);

/* --------------------------------------------------------------- Status -- */

/**
 * Public product status labels were removed by owner decision (27 Sep 2026). Status stays in config (used for
 * honesty rules: only the live product links out; structured data lists only real products) but is never rendered.
 */
export function StatusBadge(_props: { status: ProductStatus; class?: string }): SafeHtml {
  return <></>;
}

/* ---------------------------------------------------------- Breadcrumbs -- */

export function Breadcrumbs(props: { crumbs: Crumb[]; tone?: "light" | "dark" }): SafeHtml {
  return (
    <nav aria-label="Breadcrumb" class={`breadcrumbs breadcrumbs--${props.tone ?? "light"}`}>
      <ol>
        {props.crumbs.map((c, i) =>
          i === props.crumbs.length - 1 ? (
            <li>
              <span aria-current="page">{c.name}</span>
            </li>
          ) : (
            <li>
              <a href={c.path}>{c.name}</a>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}

/* ------------------------------------------------------------ Accordion -- */

/** Native <details>: keyboard and screen-reader accessible with zero JavaScript. */
export function Accordion(props: { items: { title: string; body: Child; id?: string }[]; class?: string; headingLevel?: 3 | 4 }): SafeHtml {
  return (
    <div class={`accordion ${props.class ?? ""}`}>
      {props.items.map((item) => (
        <details class="accordion__item" id={item.id}>
          <summary class="accordion__summary">
            <span class="accordion__title">{item.title}</span>
            <span class="accordion__icon" aria-hidden="true"></span>
          </summary>
          <div class="accordion__body">{item.body}</div>
        </details>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------ Page hero -- */

export function PageHero(props: {
  id?: string;
  crumbs?: Crumb[];
  title: string;
  lede?: Child;
  actions?: Child;
  aside?: Child;
  meta?: Child;
  tone?: "ink" | "paper";
}): SafeHtml {
  const tone = props.tone ?? "ink";
  return (
    <section class={`page-hero page-hero--${tone}`} aria-labelledby={props.id ?? "page-title"}>
      <Container>
        {props.crumbs ? <Breadcrumbs crumbs={props.crumbs} tone={tone === "ink" ? "dark" : "light"} /> : null}
        <div class={`page-hero__grid${props.aside ? " page-hero__grid--aside" : ""}`}>
          <div class="page-hero__main">
            {props.meta ? <div class="page-hero__meta">{props.meta}</div> : null}
            <h1 id={props.id ?? "page-title"} class="display-1">
              {props.title}
            </h1>
            {props.lede ? <div class="page-hero__lede lede">{props.lede}</div> : null}
            {props.actions ? <div class="actions">{props.actions}</div> : null}
          </div>
          {props.aside ? <div class="page-hero__aside">{props.aside}</div> : null}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------ CTA band -- */

export function CtaBand(props: { title?: string; body?: string; primary?: { label: string; href: string }; secondary?: { label: string; href: string } }): SafeHtml {
  return (
    <section class="cta-band" aria-labelledby="cta-title">
      <Container>
        <div class="cta-band__inner">
          <Mark tone="white" class="cta-band__mark" />
          <div class="cta-band__text">
            <h2 id="cta-title" class="display-2">
              {props.title ?? "Have a technology problem worth solving?"}
            </h2>
            <p class="lede">
              {props.body ?? "Tell us what you're trying to build or fix. We'll reply within two working days with next steps — or an honest answer if we're not the right team."}
            </p>
          </div>
          <div class="actions">
            <ButtonLink href={props.primary?.href ?? "/contact"} variant="inverse" size="lg" event="cta_click" eventLabel="cta_band">
              {props.primary?.label ?? "Start a conversation"}
            </ButtonLink>
            {props.secondary ? (
              <ButtonLink href={props.secondary.href} variant="ghost" size="lg">
                {props.secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Tags(props: { items: readonly string[]; class?: string; label?: string }): SafeHtml {
  return (
    <ul class={`tags ${props.class ?? ""}`} aria-label={props.label}>
      {props.items.map((t) => (
        <li>{t}</li>
      ))}
    </ul>
  );
}
