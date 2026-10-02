/**
 * INSIGHTS. Content model ready for articles or a future headless CMS.
 * The /insights index is `noindex` while it has no articles, so an empty
 * page is never presented to search engines as content.
 * Do not add placeholder or AI-filler articles.
 */
export interface Article {
  slug: string;
  title: string;
  description: string;
  topic: TopicKey;
  author: string;
  published: string; // ISO date
  updated?: string;
  readingMinutes: number;
  /** body as trusted HTML produced from Markdown at build time */
  bodyHtml: string;
}

export const topics = {
  ai: { name: "AI", body: "Applying language models and machine learning to real operational problems." },
  engineering: { name: "Engineering", body: "Architecture, security and delivery practice." },
  product: { name: "Product", body: "How we decide what to build and how we measure it." },
  edtech: { name: "Education technology", body: "Lessons from building EduLynx ERP for schools." },
  enterprise: { name: "Enterprise", body: "Systems that run core operations." },
  company: { name: "Company updates", body: "News from KrisLynx." },
} as const;

export type TopicKey = keyof typeof topics;

export const articles: Article[] = [];
