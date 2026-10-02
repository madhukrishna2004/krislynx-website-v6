import { raw, type Child, type SafeHtml } from "@kx/jsx-runtime";
import { company } from "../config/company";
import { footerNav, legalNav, primaryCta, primaryNav } from "../config/navigation";
import { absoluteUrl, seo } from "../config/seo";
import { social } from "../config/social";
import { assistantConfig } from "../config/assistant";
import { assets } from "../lib/assets";
import type { PageDef } from "../lib/page";
import { breadcrumbSchema } from "../lib/schema";
import { ButtonLink, Container, Lockup } from "./ui";

/* ------------------------------------------------------------- <head> -- */

export const ogPathFor = (path: string): string => `/og/${path === "/" ? "home" : path.slice(1).replace(/\//g, "-")}.png`;

function jsonLd(data: Record<string, unknown>): SafeHtml {
  // Escape "<" so a string value can never close the script element.
  return raw(`<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`);
}

function Head(props: { page: PageDef }): SafeHtml {
  const p = props.page;
  const title = p.absoluteTitle ? p.title : seo.titleTemplate(p.title);
  const canonical = absoluteUrl(p.path);
  const og = absoluteUrl(p.ogImage ?? (p.noindex ? seo.defaultOgImage : ogPathFor(p.path)));
  const schema = [...(p.schema ?? [])];
  if (p.breadcrumbs && p.breadcrumbs.length > 1) schema.push(breadcrumbSchema(p.breadcrumbs));
  return (
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title}</title>
      <meta name="description" content={p.description} />
      <meta name="robots" content={p.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"} />
      {p.noindex ? null : <link rel="canonical" href={canonical} />}
      <meta name="theme-color" content={seo.themeColor} />
      <link rel="preload" href="/fonts/instrument-sans-700-v1.woff2" as="font" type="font/woff2" crossorigin />
      <link rel="preload" href="/fonts/instrument-sans-400-v1.woff2" as="font" type="font/woff2" crossorigin />
      <link rel="stylesheet" href={assets.css} />
      <script src={assets.js} defer></script>
      <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/brand/favicon-32.png" type="image/png" sizes="32x32" />
      <link rel="icon" href="/brand/favicon-16.png" type="image/png" sizes="16x16" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <meta property="og:type" content={p.ogType ?? "website"} />
      <meta property="og:site_name" content={seo.siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={p.description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={og} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${p.title} — KRISLYNX TECHNOLOGIES PRIVATE LIMITED`} />
      <meta property="og:locale" content={seo.locale} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={p.description} />
      <meta name="twitter:image" content={og} />
      {seo.twitterSite ? <meta name="twitter:site" content={seo.twitterSite} /> : null}
      {assets.gaId ? <meta name="kx-ga" content={assets.gaId} /> : null}
      {schema.map(jsonLd)}
    </head>
  );
}

/* ------------------------------------------------------------ Header -- */

function isActive(current: string, href: string): boolean {
  return current === href || current.startsWith(`${href}/`);
}

function Header(props: { path: string; crumbs?: { name: string; path: string }[] }): SafeHtml {
  // context: on a page two levels deep, the active section shows where you are inside it (e.g. Products · EduLynx ERP)
  const ctx = props.crumbs && props.crumbs.length >= 3 ? props.crumbs[props.crumbs.length - 1]?.name : undefined;
  return (
    <header class="site-header" data-header>
      <Container class="site-header__bar">
        <a href="/" class="site-header__home" aria-label="KrisLynx Technologies — home">
          <Lockup tone="dark" />
        </a>
        <nav class="site-nav" aria-label="Primary">
          <ul>
            {primaryNav.map((item) => (
              <li>
                <a href={item.href} aria-current={isActive(props.path, item.href) ? "page" : undefined}>
                  {item.label}
                  {ctx && isActive(props.path, item.href) ? <span class="site-nav__ctx">{ctx}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" class="kxnav-open" data-kxnav-open aria-haspopup="dialog" aria-controls="kxnav" inert>
          <span>Search</span>
          <kbd class="mono">⌘K</kbd>
        </button>
        <ButtonLink href={primaryCta.href} variant="inverse" class="site-header__cta" event="cta_click" eventLabel="header">
          {primaryCta.label}
        </ButtonLink>
        {/* Without JavaScript this jumps to the footer navigation; JS upgrades it to open the menu dialog. */}
        <a href="#footer-nav" class="menu-button" data-menu-open aria-haspopup="dialog" aria-controls="mobile-menu">
          <span class="menu-button__bars" aria-hidden="true"></span>
          <span>Menu</span>
        </a>
      </Container>
      <dialog id="mobile-menu" class="mobile-menu" aria-label="Site menu">
        <div class="mobile-menu__top">
          <Lockup tone="dark" />
          <button type="button" class="mobile-menu__close" data-menu-close>
            <span class="visually-hidden">Close menu</span>
            <span aria-hidden="true" class="close-x"></span>
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul class="mobile-menu__list">
            <li>
              <a href="/" aria-current={props.path === "/" ? "page" : undefined}>
                Home
              </a>
            </li>
            {primaryNav.map((item) => (
              <li>
                <a href={item.href} aria-current={isActive(props.path, item.href) ? "page" : undefined}>
                  <span class="mobile-menu__label">{item.label}</span>
                  <span class="mobile-menu__desc">{item.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div class="mobile-menu__foot">
          <ButtonLink href="/contact" variant="inverse" size="lg">
            {primaryCta.label}
          </ButtonLink>
          <a class="mobile-menu__mail" href={`mailto:${company.email}`}>
            {company.email}
          </a>
        </div>
      </dialog>
    </header>
  );
}

/* ------------------------------------------------------------ Footer -- */

/** Context-aware next steps: the footer suggests where to go from the page you are on (quiet, two links max). */
const footerNext: [string, { label: string; href: string }[]][] = [
  ["/products/edulynx-erp", [{ label: "Explore the EduLynx modules", href: "/products/edulynx-erp#modules-title" }, { label: "Start a project", href: "/contact" }]],
  ["/products", [{ label: "Explore EduLynx ERP", href: "/products/edulynx-erp" }, { label: "Start a project", href: "/contact" }]],
  ["/technology", [{ label: "Explore engineering services", href: "/services" }, { label: "Start a project", href: "/contact" }]],
  ["/services", [{ label: "See how we engineer it", href: "/technology" }, { label: "Start a project", href: "/contact" }]],
  ["/work", [{ label: "Explore engineering services", href: "/services" }, { label: "Start a project", href: "/contact" }]],
  ["/company", [{ label: "Explore our products", href: "/products" }, { label: "Start a project", href: "/contact" }]],
  ["/office", [{ label: "See how we engineer it", href: "/technology" }, { label: "Start a project", href: "/contact" }]],
];

function Footer(props: { path: string }): SafeHtml {
  const year = new Date().getFullYear();
  const next = footerNext.find(([p]) => props.path === p || props.path.startsWith(`${p}/`))?.[1];
  return (
    <footer class="site-footer" id="footer-nav">
      <Container>
        {next ? (
          <nav class="site-footer__next" aria-label="Next steps">
            <span class="mono">Next</span>
            {next.map((l) => (
              <a href={l.href}>
                {l.label} <span aria-hidden="true">→</span>
              </a>
            ))}
          </nav>
        ) : null}
        <div class="site-footer__top">
          <div class="site-footer__brand">
            <Lockup tone="dark" />
            <p class="site-footer__legal-name">{company.legalName}</p>
            <p class="site-footer__tag mono">Software / AI / Products</p>
            <a class="site-footer__mail" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </div>
          <nav class="site-footer__nav" aria-label="Footer">
            {footerNav.map((group) => (
              <div>
                <h2 class="site-footer__heading">{group.title}</h2>
                <ul>
                  {group.items.map((i) => (
                    <li>
                      <a href={i.href}>{i.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div class="site-footer__company">
          <div class="site-footer__reg">
            <h2 class="site-footer__heading">Registered office</h2>
            <address>
              {company.address.building}
              <br />
              {company.address.street}
              <br />
              {company.address.locality}, {company.address.district} – {company.address.postalCode}
              <br />
              {company.address.region}, {company.address.country}
            </address>
          </div>
          <div>
            <h2 class="site-footer__heading">CIN</h2>
            <p class="site-footer__cin mono">{company.cin}</p>
            <p class="site-footer__inc">Incorporated {company.incorporationDateReadable}</p>
          </div>
          <div>
            <h2 class="site-footer__heading">Connect</h2>
            <p>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
            <p>
              <a href={social.linkedin} rel="noopener" target="_blank">
                LinkedIn<span class="visually-hidden"> (opens in a new tab)</span>
              </a>
            </p>
          </div>
        </div>
        <aside class="site-footer__proof" aria-label="Verified company facts">
          <ul class="site-footer__facts mono">
            <li>Incorporated company · CIN {company.cin}</li>
            <li>Registered office · {company.address.locality}, {company.address.region}</li>
            <li>Live product · <a href="/products/edulynx-erp">EduLynx ERP</a></li>
            <li>Real infrastructure · <a href="/office">Office and server room</a></li>
            <li>Direct contact · <a href="/contact">info@krislynx.com</a></li>
          </ul>
        </aside>
        <div class="site-footer__bottom">
          <p>
            © {year} {company.legalNameReadable}
          </p>
          <ul class="site-footer__legal" aria-label="Legal">
            {legalNav.map((i) => (
              <li>
                <a href={i.href}>{i.label}</a>
              </li>
            ))}
            <li>
              <button type="button" class="linklike" data-consent-open hidden>
                Cookie settings
              </button>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}

/* --------------------------------------------------------- Assistant -- */

function Assistant(): SafeHtml {
  return (
    <div class="assistant" data-assistant>
      {/* Without JS the launcher is a plain link to the contact page. */}
      <a href="/contact" class="assistant__launcher" data-assistant-open aria-haspopup="dialog" aria-controls="assistant-dialog">
        <span class="assistant__kx mono" aria-hidden="true">
          KX
        </span>
        <span class="assistant__launcher-text">Assistant</span>
        <span class="assistant__dot" aria-hidden="true"></span>
      </a>
      <dialog id="assistant-dialog" class="assistant__panel" aria-labelledby="assistant-title">
        <div class="assistant__head">
          <div>
            <p class="assistant__eyebrow mono">{assistantConfig.name}</p>
            <h2 id="assistant-title" class="assistant__title">
              {assistantConfig.system}
            </h2>
            <p class="assistant__status mono">
              <span class="assistant__status-dot" aria-hidden="true"></span> Ready · approved answers only
            </p>
          </div>
          <button type="button" class="assistant__close" data-assistant-close>
            <span class="visually-hidden">Close assistant</span>
            <span aria-hidden="true" class="close-x"></span>
          </button>
        </div>
        <div class="assistant__log" data-assistant-log role="log" aria-live="polite" aria-relevant="additions" tabindex="0" aria-label="Conversation"></div>
        <nav class="assistant__commands" aria-label="Go to">
          {assistantConfig.commands.map((c) => (
            <a href={c.href}>{c.label}</a>
          ))}
        </nav>
        <div class="assistant__suggestions" data-assistant-suggestions>
          <p class="assistant__sugg-label mono" data-assistant-context>
            Suggested questions
          </p>
        </div>
        <form class="assistant__form" data-assistant-form>
          <label for="assistant-input" class="visually-hidden">
            Ask a question
          </label>
          <input id="assistant-input" name="q" type="text" autocomplete="off" maxlength={300} placeholder="Ask about KrisLynx…" required />
          <button type="submit" class="btn btn--primary">
            <span>Ask</span>
          </button>
        </form>
        <p class="assistant__disclosure">{assistantConfig.disclosure}</p>
      </dialog>
    </div>
  );
}

/** KX Navigator (⌘K / Ctrl+K): searches a build-time index of real pages, sections and EduLynx modules. */
function Navigator(): SafeHtml {
  return (
    <dialog id="kxnav" class="kxnav" aria-labelledby="kxnav-title">
      <div class="kxnav__head">
        <p id="kxnav-title" class="kxnav__title mono">
          KX Navigator
        </p>
        <p class="kxnav__sub">Search the KRISLYNX system</p>
        <label for="kxnav-q" class="visually-hidden">
          Search the KrisLynx site
        </label>
        <input id="kxnav-q" type="search" autocomplete="off" placeholder="Search pages, products, technology…" aria-controls="kxnav-results" aria-autocomplete="list" />
      </div>
      <ul id="kxnav-results" class="kxnav__results" role="listbox" aria-label="Results"></ul>
      <p class="kxnav__hint mono" aria-hidden="true">
        ↑ ↓ to move · Enter to open · Esc to close
      </p>
    </dialog>
  );
}

/* ---------------------------------------------------------- Consent -- */

function ConsentBanner(): SafeHtml {
  // Rendered only when analytics is configured; hidden until JS checks stored consent.
  return (
    <div class="consent" data-consent hidden role="region" aria-label="Cookie consent">
      <p>
        We'd like to use Google Analytics cookies to understand which pages are useful. We don't collect form contents.{" "}
        <a href="/cookie-policy">Cookie policy</a>
      </p>
      <div class="consent__actions">
        <button type="button" class="btn btn--secondary" data-consent-choice="denied">
          <span>Decline</span>
        </button>
        <button type="button" class="btn btn--primary" data-consent-choice="granted">
          <span>Accept analytics</span>
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- Document -- */

export function Document(props: { page: PageDef; children?: Child }): SafeHtml {
  return (
    <html lang={seo.lang} data-group={props.page.group}>
      <Head page={props.page} />
      <body>
        <a class="skip-link" href="#main">
          Skip to content
        </a>
        <Header path={props.page.path} crumbs={props.page.breadcrumbs} />
        <main id="main" tabindex="-1">
          {props.children}
        </main>
        <Footer path={props.page.path} />
        <Navigator />
        <Assistant />
        {assets.gaId ? <ConsentBanner /> : null}
      </body>
    </html>
  );
}
