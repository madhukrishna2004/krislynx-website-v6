# V2 UX audit — findings and fixes (27 Sep 2026)

| # | Finding | Evidence | Fix |
|---|---|---|---|
| 1 | Every block entered with the same fade-up (generic) | reveal CSS used translateY(18px) for all | content-specific motion system; test bans translateY in reveals |
| 2 | No /technology page though the IA needs one | nav + brief | real page from existing components; in nav, sitemap, OG, schema |
| 3 | Office page was a uniform grid showing 4 "photo to be added" placeholders publicly | page render | editorial sequence; placeholders not rendered (kept in config) |
| 4 | **Homepage CLS 0.145 on phones** | layout-shift attribution: infrastructure figure | phone `<source>` now declares its own width/height → **CLS 0**; test added |
| 5 | All social cards used the obsolete V1 headline, V1 colours and a fallback font | rendered OG images | OG template rebuilt (Instrument Sans embedded, current palette/headline) |
| 6 | Legal name appeared in mixed case in 6 places | build scan | single source changed; guard test |
| 7 | School-day timeline was static | brief §21 | interactive tabs, example times labelled |
| 8 | Corridor/brand-wall photos unenhanced | image review | same restrained enhancement as the workspace photo |
| 9 | Attached ZIP contained a nested 12 MB duplicate ("krislynx-corporate-website 5") and .DS_Store | ZIP audit | excluded from the package; .DS_Store added to .gitignore |

**Not changed on purpose:** Firebase project/.firebaserc, GitHub workflow, functions, contact backend, assistant
knowledge, security headers/CSP, SEO architecture.

## V2.1 — precision release (27 Sep 2026)
| # | Finding | Evidence | Fix |
|---|---|---|---|
| 10 | Architecture showed every layer at once | V2 report | disclosure pattern: Interface active by default; select → responsibility, purpose, technologies; signal travels the real dependency path; unrelated layers quieter, never hidden; desktop side panel, mobile accordion (panel under its layer — measured); no-JS shows all |
| 11 | **7 of the first 60 Tab stops had no visible focus** | keyboard audit (browser) | cause: `transition: all` animated the focus outline in from 0px; all 10 occurrences replaced with explicit properties; guard test |
| 12 | Hero dimming took 300ms | CSS | interaction response 160ms (`--m-micro`); unrelated paths quieter but never invisible |
| 13 | Mobile menu let the page behind rubber-band on iOS | audit | `overscroll-behavior: none` added to the existing lock; e2e proves lock, Escape, focus return at 320px |
| 14 | 404 used generic wording | page | "This route doesn't exist." · Error 404 · system path not found · Return to KrisLynx |
| 15 | Assistant fallback wording | brief §29 | "I don't have verified information about that." |
| 16 | School-day selection changed instantly | UX | detail arrives with its stop (motion-allowed only) |
| 17 | Old architecture CSS left behind | code review | removed (no dead CSS) |

New browser checks (e2e): architecture default/click/keyboard, reduced motion (0 running animations, 0 hidden content,
no smooth scroll), keyboard focus visibility across 60 Tab stops, mobile menu at 320px.
