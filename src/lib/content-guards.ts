/**
 * Content guards used by the release tests. Pure functions over HTML so they can be proven with fixtures
 * (clean → nothing found; injected duplicate → found) as well as run against the built site.
 */
const PARA = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/g; // real <p> only — never <path>, <picture>, <param>
const text = (html: string): string => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const sentences = (t: string): string[] => t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 25);

/** Sentences repeated inside one paragraph, and whole paragraphs (≥ 40 chars) repeated on the same page. */
export function findRepeatedContent(html: string): string[] {
  const found: string[] = [];
  const paras = [...html.matchAll(PARA)].map((m) => text(m[1] ?? ""));
  for (const p of paras) { const s = sentences(p); const d = s.find((x, i) => s.indexOf(x) !== i); if (d) found.push(`repeated sentence: ${d}`); }
  const seen = new Set<string>();
  for (const p of paras) { if (p.length < 40) continue; if (seen.has(p)) found.push(`repeated paragraph: ${p.slice(0, 80)}`); seen.add(p); }
  return found;
}
