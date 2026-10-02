/**
 * THE KRISLYNX SYSTEM — nodes of the interactive system map.
 * `tech` lists technology.ts layer keys: technology labels are DERIVED from the approved source,
 * never typed here (enforced by tests/system.test.ts). `products: true` derives from products.ts.
 */
export interface SystemNode {
  key: string;
  label: string;
  /** light colour used for this node's paths */
  tone: "blue" | "cyan" | "violet" | "mint";
  what: string;
  does: string;
  tech: string[];
  products?: boolean;
}

export const systemNodes: SystemNode[] = [
  { key: "products", label: "Products", tone: "mint", what: "Software we design, run and support ourselves.", does: "We ship and operate our own products, starting with EduLynx ERP for schools.", tech: [], products: true },
  { key: "software", label: "Software", tone: "blue", what: "Web applications, APIs and the business logic behind them.", does: "We build interfaces people use daily and the services those interfaces depend on.", tech: ["frontend", "backend"] },
  { key: "ai", label: "AI", tone: "violet", what: "Assistants and automation that work from an organization's own data.", does: "We connect language models to real records, with permissions and a person in the loop.", tech: ["ai"] },
  { key: "data", label: "Data", tone: "cyan", what: "Records, events and reports — the memory of an organization.", does: "We model data so every module reads the same truth, and reporting is a by-product.", tech: ["data"] },
  { key: "cloud", label: "Cloud", tone: "blue", what: "Hosting, delivery and automated releases.", does: "We deploy to managed infrastructure with automated, repeatable releases.", tech: ["cloud"] },
  { key: "operations", label: "Operations", tone: "mint", what: "Security, access and audit — keeping systems trustworthy after launch.", does: "We design access control, audit trails and credential handling in from the first sprint.", tech: ["security"] },
];

/** Hero signal track: how work moves through a system. */
export const systemFlow = ["Input", "Processing", "Intelligence", "System", "Outcome"] as const;
