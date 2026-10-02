export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const primaryNav: NavItem[] = [
  { label: "Products", href: "/products", description: "EduLynx ERP and our product portfolio" },
  { label: "Services", href: "/services", description: "AI, software and product engineering" },
  { label: "Technology", href: "/technology", description: "Architecture, AI and engineering" },
  { label: "Work", href: "/work", description: "Projects and case studies" },
  { label: "Company", href: "/company", description: "Who we are and how we build" },
];

export const primaryCta: NavItem = { label: "Start a project", href: "/contact" };

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Company",
    items: [
      { label: "About KrisLynx", href: "/company" },
      { label: "Office", href: "/office" },
      { label: "Careers", href: "/careers" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Products",
    items: [
      { label: "All products", href: "/products" },
      { label: "EduLynx ERP", href: "/products/edulynx-erp" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Services",
    items: [
      { label: "Product engineering", href: "/services/product-engineering" },
      { label: "AI & intelligent systems", href: "/services/artificial-intelligence" },
      { label: "Enterprise software", href: "/services/enterprise-software" },
      { label: "All services", href: "/services" },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "All work", href: "/work" },
      { label: "Industries", href: "/industries" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Cookies", href: "/cookie-policy" },
  { label: "Accessibility", href: "/accessibility" },
];

/** Internal systems. Linked for staff only; never indexed. */
export const internalLinks = {
  // Employee portal link intentionally unpublished until the owner confirms the correct URL
  // (see internal/hrms/README.md). Add it back to the footer only after verification.
  hrPortal: "",
};
