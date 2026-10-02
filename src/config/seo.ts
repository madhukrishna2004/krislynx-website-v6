import { company } from "./company";

export const seo = {
  siteUrl: company.url,
  siteName: "KRISLYNX TECHNOLOGIES PRIVATE LIMITED",
  titleTemplate: (title: string) => `${title} | KRISLYNX`,
  defaultTitle: "KRISLYNX Technologies Private Limited | Software, AI & Products",
  defaultDescription:
    "Software development, AI solutions and technology products from Nandyal, Andhra Pradesh, India — and the maker of EduLynx ERP, a live school management platform.",
  locale: "en_IN",
  lang: "en",
  themeColor: "#0A0D0C",
  defaultOgImage: "/og/default.png",
  /** No verified X/Twitter account yet. Set a handle here once one exists. */
  twitterSite: null as string | null,
} as const;

export const absoluteUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path;
  if (path === "/") return `${seo.siteUrl}/`;
  const clean = path.replace(/\/$/, "");
  return `${seo.siteUrl}${clean}`;
};
