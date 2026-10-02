/**
 * Structured data builders. Every schema object must describe content that is
 * visible on the page it is attached to (Google structured-data policy).
 */
import { company } from "../config/company";
import { sameAs } from "../config/social";
import { absoluteUrl, seo } from "../config/seo";
import type { Crumb } from "./page";

const ORG_ID = `${seo.siteUrl}/#organization`;
const SITE_ID = `${seo.siteUrl}/#website`;

export const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: `${company.address.building}, ${company.address.street}`,
  addressLocality: company.address.locality,
  addressRegion: company.address.region,
  postalCode: company.address.postalCode,
  addressCountry: company.address.countryCode,
};

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: company.legalName,
    legalName: company.legalName,
    alternateName: "KRISLYNX",
    url: seo.siteUrl,
    logo: { "@type": "ImageObject", url: absoluteUrl("/brand/krislynx-logo-512.png"), width: 512, height: 512 },
    email: company.email,
    foundingDate: company.incorporationDate,
    address: postalAddress,
    identifier: { "@type": "PropertyValue", propertyID: "CIN", value: company.cin },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: company.email,
      availableLanguage: ["English"],
      areaServed: "Worldwide",
    },
    sameAs,
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: seo.siteUrl,
    name: seo.siteName,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(crumbs: Crumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function serviceSchema(args: { name: string; description: string; path: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
  };
}

export function webPageSchema(args: { type?: string; name: string; description: string; path: string }): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": args.type ?? "WebPage",
    name: args.name,
    description: args.description,
    url: absoluteUrl(args.path),
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
  };
}

export const orgRef = { "@id": ORG_ID };
