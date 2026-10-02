# Architecture

## Rendering
`scripts/build.tsx` imports the route registry, renders each `PageDef` through `Document` (head, header,
footer, assistant shell) with a typed JSX→string runtime, and writes `dist/<path>.html`. Firebase `cleanUrls`
serves `/company` from `company.html`. CSS (3 files) and the client script are bundled by esbuild with
content-hashed names. Build fails on duplicate titles/descriptions or pages without exactly one `<h1>`.

## Design system
Tokens in `base.css`: ink navy `#0A1428`, paper `#F3F6FA`, signal blue `#0A4DFF`, sky `#56D4F8` (taken
from the K mark's gradient), four status colours. Type: Saira (display — matches the wordmark's rounded
technical letterforms) and IBM Plex Sans (body). Radius follows hierarchy (6 / 12 / 20 px). The signature
element is the continuous rounded stroke from the logo, used in the hero system map (the site's single
orchestrated animation), lifecycle track and connectors.

## Client
One deferred IIFE (`src/client/main.ts`), each enhancement isolated with try/catch so one failure can't
break others. Native `<dialog>` gives focus containment and Esc for free.

## Data flow for forms
Browser → `/api/contact` (Hosting rewrite) → Cloud Function → Firestore + email. Validation module is
imported by both sides, so rules can't drift.

## Migrating to Next.js later
The component model already matches React function components:
1. `npx create-next-app` with the App Router and `output: 'export'` (or keep SSR if needed).
2. Copy `src/config`, `src/lib`, `src/components`, `src/styles` unchanged; import the CSS in `app/layout.tsx`.
3. Change the JSX import source to React: replace `class=` with `className=`, `for=` with `htmlFor=`,
   `raw(html)` with `dangerouslySetInnerHTML`, and SVG hyphenated attributes with camelCase.
4. Turn each `definePage` into `app/<route>/page.tsx` + `generateMetadata()` from the same fields;
   JSON-LD via `<script type="application/ld+json">`.
5. Keep `src/client/*` as a single `"use client"` component that calls the same `init*` functions.
6. Replace `scripts/build.tsx` sitemap/robots with `app/sitemap.ts` / `app/robots.ts` from the registry.
7. Keep `functions/` as is, or port the handlers to Route Handlers (they're framework-independent).
Tests in `tests/site.test.ts` run against the exported HTML and can verify the migration is lossless.
