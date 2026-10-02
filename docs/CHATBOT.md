# KrisLynx Assistant

## What it is — and isn't
A **guided answer tool over approved company information**. It is not a generative AI model and
says so in its header. It can't invent facts, quote prices that aren't published, or make promises.
When it has no approved answer, it says so and points to the contact page.

## How it works
- Knowledge: `src/config/assistant.ts` — 14 entries (about, EduLynx, pricing, demo, services, build,
  AI, location, international, contact, products, careers, legal, security). Each has `triggers`
  (phrases), `keywords`, an `answer` and optional `links`.
- Matching: `src/client/assistant/engine.ts` — normalises text, scores phrase containment, trigger-token
  overlap and keyword hits; answers only above a confidence threshold, otherwise the fallback.
- **Guarded topics** (`guardedTopics` in `assistant.ts`) are checked *before* matching. Questions about
  unpublished facts — revenue, funding, customer/client counts or names, awards, certifications, partnerships,
  headcount — always get "not published, ask the team"; questions about the internal trade project never
  return product pricing. Without this guard, keyword overlap routed e.g. "annual revenue?" to the company overview.
- Rendering uses `textContent` only — visitor input can never inject HTML (tested).
- **Privacy**: in the default `local` mode, questions never leave the browser. Analytics (if consented)
  records only the matched topic id, never the question.

## Editing answers
Add or edit entries in `assistant.ts`. Every answer must be something you'd put on the website.
`npm test` checks every entry is reachable by its own trigger, bans superlatives, and runs adversarial cases
(prompt injection, markup, unpublished-fact questions, internal-project pricing).

## Provider modes
`assistantConfig.mode`:
- `local` (default) — in-browser matching.
- `remote` — POSTs `{question}` to `/api/assistant`; on any error falls back to local.
  The shipped function (`functions/src/handlers.ts → handleAssistant`) uses the **same** knowledge base.

## Adding a real LLM later (safely)
Implement it inside `handleAssistant` on the server — never call a model from the browser, never ship keys.
Required guardrails: retrieval restricted to `knowledge` + published pages; a system prompt forbidding
claims beyond them; refusal → fallback; rate limiting (reuse the contact limiter); no storage of
questions without a privacy-policy update; human review of a sample of answers before launch.
Update the disclosure text and privacy policy in the same change.
