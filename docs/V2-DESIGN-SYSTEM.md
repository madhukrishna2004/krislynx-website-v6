# V2 design system (27 Sep 2026)

**Principle:** better relationships between things, not more things. V2 evolves the existing architecture; no rewrite.

## Typography (11 roles, base.css) — Instrument Sans (display + body, 400/700 weight contrast) · Geist Mono (labels only)
micro 11 · label 13 · small 15 · body 17 · body-large 19 · subhead 20→24 · title 24→34 · section 33→53 · display 37→68
(inner-page H1) · hero 48→~100 · product 51→144 (EduLynx only). Guarded by tests/freeze.test.ts (no literal font sizes).

## Technical materiality — rooms with a purpose
void/ink/graphite = technical environments · warm white = company/editorial · ice = data/infrastructure/architecture ·
mint = product (EduLynx) · lilac = intelligence. Rooms blend through seams; one continuity line runs through every
room. Glass only on navigation, overlays and the assistant.

## Navigation
Products · Services · Technology · Work · Company · Start a project. Minimal at top → compact on scroll →
product-aware ("EduLynx ERP") inside EduLynx rooms. Careers lives in the footer.

## Pages added / changed in V2
- **/technology** (new): architecture → infrastructure photograph → AI pipeline → engineering lifecycle; built only
  from existing verified content. Sitemap 26 → 27.
- **Homepage hero:** "Systems engineered for real-world operations, not demonstrations."
- **EduLynx school day:** interactive (select a stop → module description + capabilities; times labelled as examples).
- **Office:** editorial sequence (workspace → meeting room + signage → corridor → infrastructure); placeholders no
  longer rendered publicly.
- **Contact:** "Tell us what needs to work." · What are you building? · What problem are you solving? · What stage are
  you at? · How can we reach you? (fields, validation and backend unchanged).
- **Products:** "Explore →" only where a real page exists; mark/type/arrow respond on hover instead of lifting.
- **Identity:** the legal name always appears in its registered form (test-enforced).
- **Social cards:** OG template now uses Instrument Sans, the current palette and the current headline (28 regenerated).
- **Assistant:** "KX Assistant" (knowledge base unchanged).

## V2.1 additions
- **Architecture interaction** (see V2-UX-AUDIT #10). Dependency paths: Interface/Application → Interface→Application→API;
  API → Application→API→Services; Services → API→Services→Data; Data → Services→Data→Infrastructure;
  Infrastructure → Data→Infrastructure. State shown by border, fill, position and the text "Selected" (not colour alone).
- **Interaction timing:** hover/focus response ≤ 200ms everywhere; no `transition: all`.
