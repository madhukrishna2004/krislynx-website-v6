/**
 * Deterministic answer matching over the approved knowledge base.
 * Returns an entry only above a confidence threshold; otherwise null, and the
 * UI shows the approved fallback. Pure and unit-tested.
 */
import { guardedTopics, knowledge, type KnowledgeEntry } from "../../config/assistant";

const STOP = new Set(
  "a an and are about at be can could do does for from have how i i'm im is it me my of on or please tell the to what whats where which who why will with you your we us our".split(" "),
);

export const normalise = (s: string): string =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

export const tokens = (s: string): string[] => normalise(s).split(" ").filter((t) => t && !STOP.has(t));

const stemEq = (a: string, b: string): boolean => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5));

export interface Match {
  entry: KnowledgeEntry;
  score: number;
}

export const THRESHOLD = 3;

export function score(query: string, entry: KnowledgeEntry): number {
  const q = normalise(query);
  const qt = tokens(query);
  let s = 0;
  for (const trig of entry.triggers) {
    const t = normalise(trig);
    if (q === t) s = Math.max(s, 20);
    else if (q.includes(t)) s = Math.max(s, 8 + t.split(" ").length);
    else {
      const tt = tokens(trig);
      if (tt.length) {
        const overlap = tt.filter((x) => qt.some((y) => stemEq(x, y))).length / tt.length;
        s = Math.max(s, overlap * 6);
      }
    }
  }
  for (const k of entry.keywords) if (qt.some((y) => stemEq(y, k))) s += 2;
  return s;
}

/** Controlled reply for topics the assistant must never answer from general entries. */
export function guarded(query: string): KnowledgeEntry | null {
  const g = guardedTopics.find((t) => t.pattern.test(query));
  return g ? { id: g.id, triggers: [], keywords: [], answer: g.answer, links: [{ label: "Contact the team", href: "/contact", event: "chatbot_lead" }] } : null;
}

export function answer(query: string, kb: KnowledgeEntry[] = knowledge): Match | null {
  if (normalise(query).length < 2) return null;
  const g = guarded(query);
  if (g) return { entry: g, score: 100 };
  let best: Match | null = null;
  for (const entry of kb) {
    const sc = score(query, entry);
    if (!best || sc > best.score) best = { entry, score: sc };
  }
  return best && best.score >= THRESHOLD ? best : null;
}

export const isGreeting = (q: string): boolean => /^(hi|hello|hey|hai|namaste|good (morning|afternoon|evening))\b/.test(normalise(q));
