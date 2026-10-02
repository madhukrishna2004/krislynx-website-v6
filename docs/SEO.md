# SEO & discovery — status 27 Sep 2026

**Automated (tests/seo.test.ts, runs on every build — all pass):** one H1 per page · unique titles (≤70) and
descriptions (50–170) · exactly one https-apex canonical equal to the page URL · complete Open Graph + Twitter
(summary_large_image; og:image exists, 1200×630) · all JSON-LD parses, all nodes typed, all URLs apex · Organization
identity (KRISLYNX TECHNOLOGIES PRIVATE LIMITED, verified address + info@, logo ≥112px, no invented ratings/phone/hours)
· every `<img>` has alt, width, height and a real file · sitemap = exactly the indexable pages, canonical-matched, with
image entries that exist · robots allows assets and names the apex sitemap · full icon set at correct pixel sizes.
Also: tests/predeploy.test.ts (no obsolete identity, apex-only, sitemap 27, only info@).

**Icon & logo system:** favicon.ico (16/32/48), favicon.svg, favicon-16/32/48.png, apple-touch-icon 180, PWA 192/512
+ maskable, `/manifest.webmanifest` (name KRISLYNX TECHNOLOGIES PRIVATE LIMITED, standalone, #07090D). Logo lockups
from the official traced geometry: colour (light/dark backgrounds), white, dark, mono (SVG) + 2400px PNGs; Organization
logo `/brand/krislynx-logo-512.png`. Note: the traced descriptor reads "TECHNOLOGIES" (as on the reception board);
the supplied logo file reads "TECHNOLOGIES PRIVATE LIMITED" — trace that version if it should be the master.

**Structured data graph:** Organization (@id) ← WebSite (publisher) ← WebPage/subtypes (isPartOf, about) on every page;
BreadcrumbList on inner pages; SoftwareApplication on /products/edulynx-erp (verified fields only). No SearchAction
(the site has no search). No LocalBusiness: no verified opening hours or phone — Organization + PostalAddress instead.
Concept products are not in structured data.

**Not possible until deployed (owner):** `npm run audit:domain` (apex/www/http redirects + robots, sitemap,
favicon.ico/.svg, manifest, logo → 200), `KX_BASE=https://krislynx.com npm run audit:release`, Rich Results Test,
Search Console (property, submit https://krislynx.com/sitemap.xml, URL Inspection of /, /products/edulynx-erp,
/products, /contact). Indexing and search appearance are Google's decision — do not report them until verified.
There is no /technology page; technology lives on the homepage (§09) — no URL was invented for it.

---

# SEO architecture

## What's in place
- **Static HTML for every page** — full content, headings and links visible to crawlers without JavaScript.
- **Clean, permanent URLs** (`/services/artificial-intelligence`, `/products/edulynx-erp`); no trailing slashes;
  301 redirects from every legacy URL (`firebase.json`).
- **Per-page metadata** from `definePage()`: unique title (build fails on duplicates), description
  (build warns outside 70–170 chars), canonical, robots, Open Graph, Twitter card, and a generated 1200×630 image.
- **Structured data (JSON-LD)**: `Organization` (legal name, CIN as `identifier`, address, founder, logo, sameAs),
  `WebSite`, `AboutPage`, `ContactPage`, `CollectionPage`+`ItemList`, `Service` ×6, `SoftwareApplication` with
  real published `Offer`s for EduLynx, `Article` for case studies, `BreadcrumbList` everywhere below the home page.
  **Deliberately not used**: `JobPosting` (no open roles — the schema appears automatically when a role is added
  to `careers.ts`), `FAQPage` (Google restricts FAQ rich results to authoritative sites; the FAQs are still on-page),
  `Review`/`AggregateRating` (no verifiable reviews).
- **Sitemap** (`/sitemap.xml`) generated from the route registry, only indexable pages. `/insights` is `noindex`
  and out of the sitemap until real articles exist — an empty section would be thin content.
- **robots.txt** disallows `/api/` and `/contact/thanks`.
- **Internal linking**: every service links to related services, case studies and contact; products link to
  services; breadcrumbs everywhere; footer links all primary pages. Verified: zero broken internal links.
- **Performance** supports Core Web Vitals: ~34–50 KB (gzip) per page before fonts, no render-blocking JS,
  explicit image dimensions, AVIF/WebP with responsive `srcset`.

## Keyword focus by page
| Page | Primary intent |
|---|---|
| `/` | KrisLynx Technologies; AI, software & product engineering company India |
| `/products/edulynx-erp` | school management software India; school ERP with AI |
| `/services/software-development` | custom software development company India |
| `/services/artificial-intelligence` | AI software development; LLM assistant development |
| `/services/saas-development` | SaaS development company; multi-tenant SaaS |
| `/services/enterprise-software` | enterprise software development |
| `/services/product-engineering` | product engineering services; MVP development |
| `/services/cloud-engineering` | cloud engineering; Firebase/GCP deployment |
| `/company`, `/office` | brand + location (Nandyal, Andhra Pradesh) |

## Growing search visibility (in order of impact)
1. **Publish real articles** in `src/config/insights.ts` (see CONTENT-CONFIG). The page becomes indexable
   automatically once one exists. Write from actual EduLynx engineering experience.
2. **Get EduLynx customer permission** to publish a named case study with real metrics.
3. Link `erp.edulynxerp.in` back to `/products/edulynx-erp` ("A product by KrisLynx Technologies").
4. Keep company name/address identical on LinkedIn, Google Business Profile, MCA and directories.
5. Add product screenshots (IMAGE-REPLACEMENT.md) — image search and richer OG previews.

See `reports/SEO-AUDIT.md` for the per-page table (regenerate with `npm run audit:site`).
