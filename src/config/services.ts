/**
 * SERVICES. Each entry generates a full page at /services/<slug>.
 *
 * Use cases describe the kinds of problems each service addresses.
 * They are NOT client references. Do not rewrite them as testimonials.
 */
export interface Service {
  slug: string;
  name: string;
  /** used in navigation and cards */
  short: string;
  /** page <title> fragment, written for search intent */
  seoTitle: string;
  seoDescription: string;
  h1: string;
  lede: string;
  problem: { title: string; points: string[] };
  capabilities: { title: string; body: string }[];
  approach: { title: string; body: string }[];
  technology: string[];
  useCases: { title: string; body: string }[];
  deliverables: string[];
  faqs: { q: string; a: string }[];
  related: string[];
  /** evidence from KrisLynx's own products, shown as proof of capability */
  evidence?: { label: string; href: string; body: string };
}

export const services: Service[] = [
  {
    slug: "product-engineering",
    name: "Product engineering",
    short: "Take a product from idea to a version people pay for, then keep improving it.",
    seoTitle: "Product Engineering Services",
    seoDescription:
      "Product engineering from discovery to production: scoping, UX, architecture, build and iteration. KrisLynx builds and runs its own products, including EduLynx ERP.",
    h1: "Product engineering, from first sketch to a product people use",
    lede:
      "We work as your product team: we decide what to build first, design it, engineer it for production and keep improving it after launch. We run our own products this way, so we know what it takes to keep one alive.",
    problem: {
      title: "Where product builds usually go wrong",
      points: [
        "The first version tries to do everything, so it takes a year and still misses what users needed.",
        "Design and engineering are handed off between separate vendors, and intent gets lost at each step.",
        "Launch is treated as the finish line, with no plan for analytics, support or the next release.",
      ],
    },
    capabilities: [
      { title: "Discovery and scoping", body: "User interviews, workflow mapping and a prioritised scope that fits your budget and timeline." },
      { title: "UX and interface design", body: "Flows, wireframes and a design system that engineers can build from directly." },
      { title: "Architecture", body: "Data model, service boundaries, tenancy, authentication and integration choices written down before code." },
      { title: "Full-stack build", body: "Web applications, APIs and admin tooling built in short, demonstrable increments." },
      { title: "Launch and iteration", body: "Release planning, instrumentation and a backlog driven by what real users do." },
    ],
    approach: [
      { title: "Smallest valuable release first", body: "We agree the one workflow that must work end to end, ship it, then widen." },
      { title: "One accountable team", body: "The same people design, build and support the product, so decisions do not get lost in handover." },
      { title: "Visible progress", body: "You see working software every one to two weeks, not status reports." },
    ],
    technology: ["TypeScript", "React", "Python", "Node.js", "PostgreSQL", "REST APIs", "Cloud hosting"],
    useCases: [
      { title: "A new SaaS product", body: "Turning a validated idea into a first paid version with sign-up, billing and an admin console." },
      { title: "Replacing spreadsheets", body: "Converting an operational process run on spreadsheets into a proper multi-user application." },
      { title: "Rebuilding a legacy tool", body: "Re-engineering an ageing internal system without losing the workflows people depend on." },
    ],
    deliverables: ["Prioritised product scope", "Clickable prototype", "Architecture decision record", "Production application", "Release and analytics plan"],
    faqs: [
      { q: "Do you work with early-stage founders?", a: "Yes. We are useful when you have a clear problem and a target user but need a team to shape and build the first version." },
      { q: "Who owns the code?", a: "You do. Intellectual-property ownership for client work is set out in the contract before work begins." },
      { q: "How do you estimate cost?", a: "After a short discovery phase we give a scoped estimate for a first release, broken into milestones you can approve one at a time." },
    ],
    related: ["saas-development", "software-development", "artificial-intelligence"],
    evidence: { label: "EduLynx ERP", href: "/products/edulynx-erp", body: "Our own school management platform, designed, built and operated by KrisLynx." },
  },
  {
    slug: "artificial-intelligence",
    name: "AI & intelligent systems",
    short: "Put AI to work on your own data — assistants, automation and analysis that people can trust.",
    seoTitle: "AI Development & Automation Services",
    seoDescription:
      "AI software development: LLM assistants grounded in your data, workflow automation, document processing and predictive analytics — built for accuracy and privacy.",
    h1: "AI systems that work on your data and hold up in daily use",
    lede:
      "We build AI features that do a specific job — answering questions from your records, drafting routine work, spotting risk early — and we design them so people can check the output and trust it.",
    problem: {
      title: "Why many AI projects stall after the demo",
      points: [
        "A chatbot is connected to a model but not to the data or permissions that make answers correct.",
        "Nobody measures accuracy, so trust erodes after the first confident wrong answer.",
        "Costs and latency were never designed for real usage volumes.",
      ],
    },
    capabilities: [
      { title: "Assistants grounded in your data", body: "Retrieval and tool use over your documents and databases, respecting each user's access rights." },
      { title: "Workflow automation", body: "AI steps inside existing processes — triage, drafting, classification — with a human approving where it matters." },
      { title: "Document and data extraction", body: "Turning invoices, forms and reports into structured, validated data." },
      { title: "Predictive analytics", body: "Models that flag risk or forecast demand from historical records, with explanations people can act on." },
      { title: "Evaluation and guardrails", body: "Test sets, accuracy tracking, prompt-injection defences and cost monitoring from day one." },
    ],
    approach: [
      { title: "Start from the decision", body: "We define which decision or task the AI should improve and how we will measure it before choosing a model." },
      { title: "Ground every answer", body: "Answers come from your approved sources, with references back to them wherever possible." },
      { title: "Keep humans in charge", body: "High-impact actions are proposed by AI and confirmed by a person." },
    ],
    technology: ["Anthropic Claude and other LLM APIs", "Retrieval-augmented generation", "Python", "PyTorch / TensorFlow", "Vector search", "PostgreSQL"],
    useCases: [
      { title: "Operations briefings", body: "A daily summary of what changed and what needs attention, generated from live operational data." },
      { title: "Internal knowledge assistant", body: "Staff ask questions of policies, manuals and records and get sourced answers." },
      { title: "Risk flags", body: "Early identification of cases that need intervention, such as students with falling attendance." },
    ],
    deliverables: ["Use-case and success-metric definition", "Evaluation dataset", "Working AI feature in your product", "Monitoring for accuracy, latency and cost"],
    faqs: [
      { q: "Will our data be used to train public models?", a: "We design integrations using providers and settings that do not train on your data, and we document where data flows. The exact terms depend on the provider you choose." },
      { q: "Can you add AI to our existing software?", a: "Usually, yes. Most of our AI work is embedded in existing applications rather than built as a separate tool." },
      { q: "How do you stop the AI making things up?", a: "By grounding answers in your data, restricting scope, testing against known questions and showing sources. No system is perfect, so we also design for review." },
    ],
    related: ["product-engineering", "enterprise-software", "cloud-engineering"],
    evidence: { label: "EduLynx AI operations assistant", href: "/products/edulynx-erp#ai", body: "Briefings, attendance trends and at-risk alerts generated from each school's live data." },
  },
  {
    slug: "enterprise-software",
    name: "Enterprise software",
    short: "Secure, role-based systems that run core operations and connect to what you already use.",
    seoTitle: "Enterprise Software Development",
    seoDescription:
      "Enterprise software development for operations, finance and administration: role-based access, audit trails, integrations and reporting, designed for security and scale.",
    h1: "Enterprise software for the work your organization cannot afford to get wrong",
    lede:
      "We build the internal systems that run operations — records, approvals, finance, reporting — with the access control, audit trails and integrations that larger organizations need.",
    problem: {
      title: "Signs your operations have outgrown their tools",
      points: [
        "Critical processes depend on spreadsheets that only one person understands.",
        "Different departments report different numbers for the same thing.",
        "You cannot say who changed a record, or when.",
      ],
    },
    capabilities: [
      { title: "Operational systems", body: "Records management, workflows, approvals and scheduling tailored to how your teams work." },
      { title: "Access control and audit", body: "Roles, permissions, MFA and complete audit logs for regulated or sensitive data." },
      { title: "Integrations", body: "APIs and data pipelines connecting accounting, messaging, identity and legacy systems." },
      { title: "Reporting", body: "Dashboards and exports that give every department the same source of truth." },
      { title: "Multi-entity support", body: "Multi-branch and multi-tenant designs that keep each unit's data separate." },
    ],
    approach: [
      { title: "Map the process first", body: "We document how work actually flows, including the exceptions, before designing screens." },
      { title: "Security is a requirement", body: "Authentication, authorisation and logging are specified alongside features." },
      { title: "Migrate carefully", body: "Data migration is planned, rehearsed and validated so nothing is lost at cut-over." },
    ],
    technology: ["TypeScript", "Python", "PostgreSQL", "JWT / TOTP MFA", "Role-based access control", "REST APIs", "PDF generation"],
    useCases: [
      { title: "Institution management", body: "Administration, finance and records for multi-department institutions." },
      { title: "Fee and invoice management", body: "Structured billing, collection, receipts, concessions and ledgers." },
      { title: "Internal HR tools", body: "Attendance, daily reporting and employee records with role-separated access." },
    ],
    deliverables: ["Process and data map", "Security and access model", "Production system with audit logging", "Migration plan", "Admin and user documentation"],
    faqs: [
      { q: "Can you work with our existing systems?", a: "Yes. We integrate through APIs where they exist and build careful import and sync processes where they do not." },
      { q: "How do you handle sensitive data?", a: "Least-privilege access, encrypted transport, hashed credentials, server-side secrets and audit logs are our baseline. Specific compliance requirements are scoped per project." },
      { q: "Do you provide support after go-live?", a: "Yes. Support and maintenance terms are agreed as part of the engagement." },
    ],
    related: ["software-development", "cloud-engineering", "artificial-intelligence"],
    evidence: { label: "EduLynx ERP", href: "/products/edulynx-erp#security", body: "Multi-tenant, role-based platform with MFA and audit logging, in production for schools." },
  },
  {
    slug: "saas-development",
    name: "SaaS development",
    short: "Multi-tenant platforms with sign-up, billing, roles and the admin tooling to run them.",
    seoTitle: "SaaS Development Company",
    seoDescription:
      "SaaS development: multi-tenant architecture, subscription billing, onboarding, role-based access and operations tooling. Built by a team that runs its own SaaS product.",
    h1: "SaaS platforms built to serve many customers from one codebase",
    lede:
      "A SaaS product is more than an app: it needs tenant isolation, onboarding, billing, permissions and the tooling to support customers. We design those foundations early so growth does not force a rewrite.",
    problem: {
      title: "What breaks when a single-customer app becomes SaaS",
      points: [
        "Customer data is separated by convention rather than by design.",
        "Every new customer needs manual setup by an engineer.",
        "There is no way to see usage, fix an account or roll out a change safely.",
      ],
    },
    capabilities: [
      { title: "Multi-tenant architecture", body: "Tenant isolation strategies chosen for your security, cost and scale needs." },
      { title: "Onboarding and accounts", body: "Self-service sign-up, invitations, roles and organisation settings." },
      { title: "Billing and plans", body: "Plans, licences, invoicing and payment-gateway integration." },
      { title: "Operations console", body: "Internal tooling to manage tenants, support users and monitor health." },
      { title: "Release safety", body: "Environments, automated tests and staged rollouts for changes that affect every customer." },
    ],
    approach: [
      { title: "Tenancy decided up front", body: "We choose the isolation model before the first table is created." },
      { title: "Automate onboarding", body: "A new customer should go live without an engineer." },
      { title: "Instrument everything", body: "Usage and error data guide the roadmap and support." },
    ],
    technology: ["TypeScript", "React", "Node.js / Python APIs", "PostgreSQL", "Payment gateways", "Cloud hosting", "CI/CD"],
    useCases: [
      { title: "Vertical SaaS", body: "Software for one industry's workflow, such as school administration." },
      { title: "Internal tool to product", body: "Turning a tool built for one organisation into a product for many." },
      { title: "B2B portals", body: "Customer-facing portals with accounts, documents and self-service." },
    ],
    deliverables: ["Tenancy and data architecture", "Account, role and billing flows", "Operations console", "Deployment pipeline"],
    faqs: [
      { q: "What is multi-tenant architecture?", a: "One application serving many customer organisations, with each organisation's data, users and settings kept separate." },
      { q: "Can you add billing to our existing app?", a: "Yes, including plan management and payment-gateway integration." },
      { q: "Have you built SaaS before?", a: "EduLynx ERP, our school management platform, is a multi-tenant SaaS product we build and operate." },
    ],
    related: ["product-engineering", "cloud-engineering", "enterprise-software"],
    evidence: { label: "EduLynx ERP", href: "/products/edulynx-erp", body: "Multi-tenant SaaS for schools with role-based access and per-institution isolation." },
  },
  {
    slug: "software-development",
    name: "Custom software development",
    short: "Web applications, APIs and integrations built to your exact requirements.",
    seoTitle: "Custom Software Development Company in India",
    seoDescription:
      "Custom software development from India for clients worldwide: web applications, APIs, integrations and internal tools, delivered in visible increments.",
    h1: "Custom software built around how your organization works",
    lede:
      "When off-the-shelf tools force your team into workarounds, we build software that fits the process instead — web applications, APIs, integrations and internal tools.",
    problem: {
      title: "When custom software is the right call",
      points: [
        "Your process is a competitive advantage that generic tools cannot model.",
        "You pay for several tools and still copy data between them by hand.",
        "An existing system is too fragile to change safely.",
      ],
    },
    capabilities: [
      { title: "Web applications", body: "Responsive, accessible applications for staff, customers or partners." },
      { title: "APIs and back ends", body: "Well-documented APIs, background jobs and data models built for change." },
      { title: "Integrations", body: "Connecting payment, messaging, accounting and identity services." },
      { title: "Modernisation", body: "Incrementally replacing legacy systems while they stay in service." },
      { title: "Quality engineering", body: "Automated tests, code review and CI so changes stay safe." },
    ],
    approach: [
      { title: "Clear scope, short cycles", body: "Work is broken into milestones with working software at each one." },
      { title: "Readable code", body: "We write for the next developer, including you, with documentation and tests." },
      { title: "Straight answers", body: "If something is a bad idea, or not worth building, we say so." },
    ],
    technology: ["TypeScript", "React", "Python", "Flask", "Node.js", "PostgreSQL", "Firebase / Firestore", "Git-based CI/CD"],
    useCases: [
      { title: "Operations dashboards", body: "A single view of data spread across systems." },
      { title: "Customer portals", body: "Self-service access to orders, documents or accounts." },
      { title: "Workflow tools", body: "Approvals, scheduling and tracking for internal teams." },
    ],
    deliverables: ["Requirements and scope", "Source code in your repository", "Automated tests", "Deployment and handover documentation"],
    faqs: [
      { q: "Do you work with clients outside India?", a: "Yes. We are based in India and work remotely with organisations in other countries, agreeing overlap hours for meetings across time zones." },
      { q: "Which time zone do you work in?", a: "India Standard Time (UTC+5:30). We schedule regular calls within your business hours." },
      { q: "Can you take over an existing codebase?", a: "Yes. We start with a technical review so you know the state of the system before we change it." },
    ],
    related: ["product-engineering", "enterprise-software", "cloud-engineering"],
  },
  {
    slug: "cloud-engineering",
    name: "Cloud & platform engineering",
    short: "Hosting, deployment pipelines, monitoring and security that keep software reliable.",
    seoTitle: "Cloud & Platform Engineering Services",
    seoDescription:
      "Cloud and platform engineering: infrastructure setup, CI/CD, monitoring, backups and security hardening so your applications stay fast, available and affordable.",
    h1: "Cloud and platform engineering that keeps software running",
    lede:
      "Good software still fails on bad infrastructure. We set up hosting, deployment, monitoring and backups so releases are routine and incidents are rare and short.",
    problem: {
      title: "Common platform problems",
      points: [
        "Deployments are manual, so they are risky and infrequent.",
        "Nobody is alerted when something breaks; customers report it first.",
        "Secrets live in code or shared documents.",
      ],
    },
    capabilities: [
      { title: "Infrastructure setup", body: "Hosting, networking, domains and environments sized to your usage and budget." },
      { title: "CI/CD pipelines", body: "Automated build, test and deploy on every change." },
      { title: "Observability", body: "Logging, metrics, uptime checks and alerts that reach the right person." },
      { title: "Security hardening", body: "Secret management, least-privilege access, security headers and dependency updates." },
      { title: "Backups and recovery", body: "Automated backups with tested restore procedures." },
    ],
    approach: [
      { title: "Automate the repeatable", body: "If it happens more than twice, it becomes a pipeline." },
      { title: "Measure before optimising", body: "Cost and performance changes are based on real metrics." },
      { title: "Document the runbook", body: "Your team knows what to do when an alert fires." },
    ],
    technology: ["Google Cloud / Firebase", "Render", "Docker", "GitHub Actions", "PostgreSQL", "CDN & edge caching"],
    useCases: [
      { title: "First production launch", body: "Moving an application from a developer's laptop to reliable hosting." },
      { title: "Deployment automation", body: "Replacing manual releases with a tested pipeline." },
      { title: "Security review", body: "Finding and fixing exposed secrets, open ports and missing headers." },
    ],
    deliverables: ["Environment and hosting setup", "CI/CD pipeline", "Monitoring and alerting", "Backup and restore runbook"],
    faqs: [
      { q: "Which cloud providers do you use?", a: "We choose based on your needs. Our own products run on providers including Google Cloud / Firebase and Render." },
      { q: "Can you reduce our hosting costs?", a: "Often. We start by measuring actual usage, then right-size resources and add caching where it helps." },
      { q: "Do you offer ongoing operations support?", a: "Yes, as a defined support arrangement agreed per engagement." },
    ],
    related: ["software-development", "saas-development", "enterprise-software"],
  },
];

export const serviceBySlug = (slug: string): Service | undefined => services.find((s) => s.slug === slug);

/** Homepage grouping: the directive's five capability areas. */
export const homeCapabilities = [
  "product-engineering",
  "artificial-intelligence",
  "enterprise-software",
  "saas-development",
  "cloud-engineering",
] as const;

/**
 * Conceptual flow per service (shown beside service content). These describe how the work is structured,
 * not a specific client's architecture. Only concepts covered by the service's approved description.
 */
export const serviceFlows: Record<string, { title: string; steps: string[] }> = {
  "product-engineering": { title: "Product engineering", steps: ["Idea", "Architecture", "UX", "Development", "QA", "Production"] },
  "artificial-intelligence": { title: "AI systems", steps: ["Data", "Context", "Models", "Guardrails", "Workflow", "Human decision"] },
  "enterprise-software": { title: "Enterprise software", steps: ["Users", "Permissions", "Operations", "Data", "Reports", "Administration"] },
  "saas-development": { title: "SaaS platforms", steps: ["Sign-up", "Tenant isolation", "Roles & billing", "Product", "Operations"] },
  "software-development": { title: "Custom software", steps: ["Discover", "Architect", "Build", "Integrate", "Deploy", "Operate"] },
  "cloud-engineering": { title: "Cloud & platform", steps: ["Application", "Services", "Database", "Cloud", "Monitoring"] },
};
