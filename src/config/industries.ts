/**
 * INDUSTRIES. Evidence-led: each entry states what KrisLynx has actually built
 * in that space. No implied client lists.
 */
import type { ProductStatus } from "./products";

export interface Industry {
  key: string;
  name: string;
  body: string;
  evidence: { label: string; href: string; status: ProductStatus }[];
  services: string[];
}

export const industries: Industry[] = [
  {
    key: "education",
    name: "Education",
    body: "Schools need administration, academics, fees and parent communication to work together. This is where our live product, EduLynx ERP, operates.",
    evidence: [{ label: "EduLynx ERP", href: "/products/edulynx-erp", status: "live" }],
    services: ["saas-development", "artificial-intelligence"],
  },
  {
    key: "trade",
    name: "Trade & compliance",
    body: "Importers and exporters need faster, more reliable answers on classification, tariffs and trade agreements.",
    evidence: [{ label: "Trade classification assistant", href: "/work/trade-classification-assistant", status: "in-development" }],
    services: ["artificial-intelligence", "software-development"],
  },
  {
    key: "wellbeing",
    name: "Personal safety & wellbeing",
    body: "Wearables and personal AI raise hard questions about sensitive data and false alarms. We are researching both carefully.",
    evidence: [
      { label: "FearLink", href: "/work/fearlink", status: "research" },
      { label: "SelfMate", href: "/work/selfmate", status: "research" },
    ],
    services: ["artificial-intelligence"],
  },
  {
    key: "operations",
    name: "Business operations",
    body: "Any organisation running core processes on spreadsheets and disconnected tools: finance, records, approvals, reporting.",
    evidence: [],
    services: ["enterprise-software", "software-development", "cloud-engineering"],
  },
];
