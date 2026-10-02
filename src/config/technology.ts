/**
 * TECHNOLOGY SYSTEM. Grouped by layer rather than shown as a logo wall.
 * Only list technologies KrisLynx has used in its own products or is prepared
 * to deliver with. Review this list whenever the team's stack changes.
 */
export interface TechLayer {
  key: string;
  name: string;
  purpose: string;
  items: string[];
}

export const techLayers: TechLayer[] = [
  { key: "frontend", name: "Frontend", purpose: "Interfaces people use every day", items: ["TypeScript", "React", "Responsive, accessible HTML & CSS", "Tailwind CSS"] },
  { key: "backend", name: "Backend", purpose: "APIs, business logic and jobs", items: ["Python", "Flask", "Node.js", "REST APIs", "Background workers"] },
  { key: "ai", name: "AI / ML", purpose: "Assistants, prediction and automation", items: ["Anthropic Claude & LLM APIs", "Retrieval-augmented generation", "PyTorch", "TensorFlow", "Edge AI"] },
  { key: "data", name: "Data", purpose: "Records, reporting and analytics", items: ["PostgreSQL", "Firestore", "CSV & PDF pipelines", "Operational dashboards"] },
  { key: "cloud", name: "Cloud", purpose: "Hosting and delivery", items: ["Google Cloud / Firebase", "Render", "CDN & static hosting", "GitHub Actions CI/CD"] },
  { key: "security", name: "Security", purpose: "Protecting data and access", items: ["JWT with token rotation", "TOTP multi-factor auth", "Role-based access control", "Audit logging", "bcrypt credential hashing"] },
];
