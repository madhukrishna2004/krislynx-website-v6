# Performance audit — generated 2026-10-02

Measured from the production build. Lighthouse could not be run in the offline build environment;
run it against the deployed site (see docs/QA-REPORT.md, "Checks to run after deploy").

## Shared assets (every page)
| Asset | Raw | Gzip |
|---|---|---|
| CSS `site.d55ad33566.css` | 179.7 KB | 31.7 KB |
| JS `app.4a2ee49c87.js` | 58.2 KB | 21.5 KB |

The JS is deferred and only enhances the page (menu, tabs, assistant, form); all content renders without it.
Hashed filenames are served with `Cache-Control: immutable, max-age=1y`.

## Per page (first visit, excluding web fonts)
| Route | HTML gzip | HTML+CSS+JS gzip | Priority image | Lazy images |
|---|---|---|---|---|
| `/404` | 11.9 KB | 65.1 KB | text (no image) | 0 |
| `/accessibility` | 12.8 KB | 66.0 KB | text (no image) | 0 |
| `/careers` | 12.5 KB | 65.7 KB | text (no image) | 0 |
| `/company` | 24.5 KB | 77.7 KB | text (no image) | 5 |
| `/company/leadership` | 12.4 KB | 65.6 KB | text (no image) | 1 |
| `/contact` | 24.6 KB | 77.8 KB | text (no image) | 0 |
| `/contact/thanks` | 11.8 KB | 65.1 KB | text (no image) | 0 |
| `/cookie-policy` | 12.4 KB | 65.7 KB | text (no image) | 0 |
| `/` | 35.4 KB | 88.7 KB | text (no image) | 7 |
| `/industries` | 17.6 KB | 70.8 KB | text (no image) | 0 |
| `/insights` | 12.3 KB | 65.6 KB | text (no image) | 0 |
| `/office` | 18.5 KB | 71.7 KB | 253.7 KB (jpg fallback) | 4 |
| `/pricing` | 13.0 KB | 66.3 KB | text (no image) | 0 |
| `/privacy-policy` | 13.5 KB | 66.7 KB | text (no image) | 0 |
| `/products` | 22.0 KB | 75.2 KB | text (no image) | 8 |
| `/products/edulynx-erp` | 27.7 KB | 81.0 KB | text (no image) | 0 |
| `/refund-policy` | 12.4 KB | 65.6 KB | text (no image) | 0 |
| `/services` | 22.9 KB | 76.2 KB | text (no image) | 0 |
| `/services/artificial-intelligence` | 23.4 KB | 76.6 KB | text (no image) | 0 |
| `/services/cloud-engineering` | 22.8 KB | 76.0 KB | text (no image) | 0 |
| `/services/enterprise-software` | 23.1 KB | 76.3 KB | text (no image) | 0 |
| `/services/product-engineering` | 23.2 KB | 76.5 KB | text (no image) | 0 |
| `/services/saas-development` | 23.0 KB | 76.2 KB | text (no image) | 0 |
| `/services/software-development` | 22.8 KB | 76.1 KB | text (no image) | 0 |
| `/technology` | 24.6 KB | 77.8 KB | text (no image) | 1 |
| `/terms-of-service` | 12.8 KB | 66.1 KB | text (no image) | 0 |
| `/work` | 18.3 KB | 71.5 KB | text (no image) | 0 |
| `/work/edulynx-erp` | 18.5 KB | 71.8 KB | text (no image) | 0 |
| `/work/fearlink` | 18.0 KB | 71.3 KB | text (no image) | 0 |
| `/work/selfmate` | 18.2 KB | 71.5 KB | text (no image) | 1 |
| `/work/trade-classification-assistant` | 18.0 KB | 71.2 KB | text (no image) | 0 |

Images are served as AVIF → WebP → JPEG via `<picture>` with responsive `srcset`; browsers that support AVIF
download far less than the JPEG size listed. Every `<img>` declares width/height (no layout shift).

## Web fonts
Self-hosted (public/fonts): Bricolage Grotesque 700, Instrument Sans 400/700, Geist Mono 400 — WOFF2, subset, 61 KB total, font-display swap, two critical faces preloaded. No third-party font requests.
