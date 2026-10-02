import type { SafeHtml } from "@kx/jsx-runtime";

export interface Crumb {
  name: string;
  path: string;
}

export interface PageDef {
  /** clean URL path, e.g. "/services/saas-development"; "/" for home */
  path: string;
  /** page title without the site suffix */
  title: string;
  /** use `title` verbatim (home page) */
  absoluteTitle?: boolean;
  description: string;
  noindex?: boolean;
  /** exclude from sitemap even when indexable (e.g. 404) */
  excludeFromSitemap?: boolean;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  breadcrumbs?: Crumb[];
  schema?: Record<string, unknown>[];
  sitemap?: { priority: number; changefreq: "weekly" | "monthly" | "yearly" };
  /** analytics page grouping */
  group: "home" | "company" | "product" | "service" | "work" | "insights" | "careers" | "contact" | "legal" | "system";
  render: () => SafeHtml;
}

export const definePage = (page: PageDef): PageDef => page;
