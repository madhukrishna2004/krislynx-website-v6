import type { SafeHtml } from "@kx/jsx-runtime";
import { edulynx } from "../config/products";
import { lifecycle } from "../config/lifecycle";
import { Mark, StatusBadge } from "./ui";

/**
 * Hero system map — the one orchestrated motion on the site.
 * Continuous rounded strokes (the logo's line language) connect KrisLynx
 * engineering to the three things we build. Lines draw once on load;
 * static under prefers-reduced-motion.
 */
export function HeroSystem(): SafeHtml {
  const nodes = [
    { cls: "n1", title: "Products", body: "EduLynx ERP — school management", status: true },
    { cls: "n2", title: "Intelligent systems", body: "AI assistants grounded in live data" },
    { cls: "n3", title: "Enterprise technology", body: "Secure, multi-tenant platforms" },
  ];
  return (
    <figure class="system" aria-labelledby="system-caption">
      <svg class="system__lines" viewBox="0 0 100 92" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M27 46 C42 46 42 14.7 57 14.7" />
        <path d="M27 46 L57 46" />
        <path d="M27 46 C42 46 42 77.3 57 77.3" />
      </svg>
      <div class="system__core">
        <Mark tone="gradient" class="system__mark" />
        <span>KrisLynx engineering</span>
      </div>
      {nodes.map((n) => (
        <div class={`system__node system__node--${n.cls}`}>
          <span class="system__title">{n.title}</span>
          <span class="system__body">{n.body}</span>
          {n.status ? <StatusBadge status="live" class="system__status" /> : null}
        </div>
      ))}
      <figcaption id="system-caption" class="visually-hidden">
        KrisLynx engineering connects three areas: products such as EduLynx ERP, intelligent systems, and enterprise technology.
      </figcaption>
    </figure>
  );
}

/** Idea → production lifecycle. A genuine sequence, so it is numbered. */
export function Lifecycle(props: { compact?: boolean }): SafeHtml {
  return (
    <div class={`lifecycle${props.compact ? " lifecycle--compact" : ""}`}>
      <ol class="lifecycle__track">
        {lifecycle.map((step, i) => (
          <li class="lifecycle__step">
            <span class="lifecycle__node" aria-hidden="true">
              {String(i + 1)}
            </span>
            <h3 class="lifecycle__name">{step.name}</h3>
            <p class="lifecycle__body">{step.body}</p>
            <p class="lifecycle__output">
              <span class="visually-hidden">Output: </span>
              {step.output}
            </p>
          </li>
        ))}
      </ol>
      <p class="lifecycle__loop">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="icon">
          <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        What we learn in Improve becomes the next Discover. Products are never "done".
      </p>
    </div>
  );
}

/** EduLynx layered architecture — who uses it, what it does, what protects it. */
export function EduLynxArchitecture(): SafeHtml {
  const modules = ["Students", "Attendance", "Academics", "Examinations", "Finance & fees", "Timetable", "Communication", "Reports"];
  return (
    <figure class="arch" aria-labelledby="arch-caption">
      <div class="arch__row arch__row--roles">
        <span class="arch__label">Who uses it</span>
        <ul class="arch__chips">
          {edulynx.architecture.roles.map((r) => (
            <li>{r}</li>
          ))}
        </ul>
      </div>
      <div class="arch__layer arch__layer--access">
        <span class="arch__label">Role-based access</span>
        <span class="arch__desc">Each role sees only what it is authorised to see</span>
      </div>
      <div class="arch__row arch__row--modules">
        <span class="arch__label">Operational modules</span>
        <ul class="arch__modules">
          {modules.map((m) => (
            <li>{m}</li>
          ))}
        </ul>
      </div>
      <div class="arch__layer arch__layer--ai">
        <span class="arch__label">AI operations assistant</span>
        <span class="arch__desc">Reads live data · briefings · trends · at-risk alerts</span>
      </div>
      <div class="arch__layer arch__layer--platform">
        <span class="arch__label">Platform &amp; security</span>
        <span class="arch__desc">Tenant isolation · JWT + TOTP MFA · audit log · server-side secrets</span>
      </div>
      <figcaption id="arch-caption" class="arch__caption">
        How EduLynx ERP is structured: four user roles, role-based access, eight operational modules sharing one student record, an AI layer over live data, and a secure multi-tenant platform underneath.
      </figcaption>
    </figure>
  );
}
