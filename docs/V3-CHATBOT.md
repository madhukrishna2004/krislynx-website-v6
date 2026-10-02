# V3 — KX Assistant
**Interface:** KX launcher (mint KX mark + "Assistant" + status dot; mark-only under 30rem) · graphite panel, warm-white
text, mint accent, restrained glass · header "KX ASSISTANT / KrisLynx knowledge system / ● Ready · approved answers only"
(honest: local knowledge base, no generative AI) · bot answers as a system log (mint rule), user messages as quiet
blocks · CTA chips from each answer's approved links · "Source · <page>" under every matched answer · desktop panel
anchored bottom-right; phones: bottom sheet (dvh, safe-area aware).
**Context:** prompts depend on the page (EduLynx, Technology, Services, Contact, default) — every prompt is tested to
resolve to an approved answer. **Loading:** "KX · Thinking…" only if an answer takes >150ms (no fake typing).
**Error:** "I couldn't reach the assistant right now…" + Try again / Explore KrisLynx / Start a project.
**Boundary:** answers only from src/config/assistant.ts; fallback "I don't have verified information about that."
V3 added 5 entries generated from site config (modules, architecture, technology, process, after-contact).
**Safety finding fixed during V3:** two new triggers reduced to a single meaningful token and let a prompt-injection
phrase match; removed, and a test now requires ≥2 meaningful tokens for multi-word triggers. Injection prompts →
fallback (tested). Answers rendered with textContent only; only the matched topic id is tracked.
**Accessibility:** native modal dialog (focus containment, Escape, focus returns to launcher), labelled input,
aria-live log, visible focus on every control, reduced-motion safe.
