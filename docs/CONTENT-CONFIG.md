# Content configuration

All site content lives in typed files under `src/config/`. TypeScript catches missing fields and typos
at build time; `npm run build` then regenerates every page, the sitemap and structured data.

| File | Controls |
|---|---|
| `company.ts` | Legal name, CIN, incorporation date, address, email(s), mission, vision, principles, leadership, positioning lines. **Single source for company identity** — footer, schema, legal pages and the assistant all read it. |
| `products.ts` | Product list and statuses (`live` / `in-development` / `research` / `concept`), EduLynx details: modules, AI, security, roles, pricing, FAQs, screenshots. |
| `services.ts` | The six service pages (H1, SEO title/description, problem, capabilities, approach, use cases, tech, deliverables, FAQs, related services) and which five appear on the homepage. |
| `work.ts` | Case studies. Each needs challenge, context, approach, solution, technology, experience and an honest status. |
| `industries.ts` | Industries, each linked to real evidence (a product/case study) and services. |
| `technology.ts` | The homepage technology tabs. |
| `lifecycle.ts` | The six-stage idea → production process. |
| `office.ts` | Office gallery slots (see IMAGE-REPLACEMENT.md). |
| `navigation.ts` | Header, footer and legal navigation; header CTA; HR portal link. |
| `seo.ts` | Site URL, default title/description, title template, theme colour. |
| `insights.ts` | Articles (empty) and topics. |
| `careers.ts` | Open roles (empty) and "working here" points. |
| `assistant.ts` | Assistant greeting, fallback, suggestions and approved knowledge. See CHATBOT.md. |
| `contact.ts`, `countries.ts` | Form options and limits (shared with the server). |

## Common edits
**Change a product's status** — edit `status` in `products.ts` and the matching case study in `work.ts`.
Badges, the status key, schema and assistant answers update together.

**Add an open role** — append to `openRoles` in `careers.ts` (title, slug, location, summary,
employmentType, datePosted, validThrough, remote). A `JobPosting` schema is emitted automatically.
Remove it when filled — expired postings hurt search trust.

**Publish an article** — add to `articles` in `insights.ts` with `slug`, `title`, `description`,
`topic`, `author`, `published` (ISO date) and `bodyHtml`. `bodyHtml` is inserted as trusted HTML:
write it yourself, never paste third-party HTML. The insights page becomes indexable and
the article gets its own URL, breadcrumbs and `Article` schema.

**Publish another leader** — add to `company.leadership` with `published: true` and a photo processed via
`scripts/images.ts`. Only publish people who have agreed and whose role is current.

**Add a page** — create `src/pages/<name>.tsx` exporting `definePage({...})`, add it to `src/pages/index.ts`,
and link it from `navigation.ts` if needed. The build enforces one `<h1>` and a unique title.

## Rules the content follows (keep them)
- No metrics, clients, testimonials, certifications or awards that can't be evidenced.
- Every product shows its real status.
- Prices shown only where published by the product itself (EduLynx site is authoritative).
- The tests in `tests/site.test.ts` fail the build if known fabricated claims from the old site reappear.
