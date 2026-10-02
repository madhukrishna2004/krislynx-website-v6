/**
 * PRODUCTS.
 *
 * Status must reflect reality. Allowed values:
 *   live            – publicly available and in use
 *   in-development  – being actively built; not generally available
 *   research        – exploratory R&D; no product commitment
 *   concept         – idea stage only
 *
 * EduLynx ERP facts below are taken from the live product site
 * (https://erp.edulynxerp.in) as of September 2026. If the product site
 * changes, update this file — the KrisLynx site must never contradict it.
 *
 * `reviewNote` fields mark facts that the company should confirm before launch.
 */
export type ProductStatus = "live" | "in-development" | "research" | "concept";

export const statusLabel: Record<ProductStatus, string> = {
  live: "Live",
  "in-development": "In development",
  research: "Research",
  concept: "Concept",
};

export const statusMeaning: Record<ProductStatus, string> = {
  live: "Available now and in use.",
  "in-development": "Being built. Not generally available yet.",
  research: "Exploratory R&D. No release commitment.",
  concept: "Idea stage.",
};

export interface Product {
  slug: string;
  name: string;
  category: string;
  status: ProductStatus;
  summary: string;
  audience: string;
  /** internal page on krislynx.com */
  href: string;
  externalUrl?: string;
  externalLabel?: string;
  reviewNote?: string;
  /** Product mark (logo artwork) — from owner-supplied product posters. */
  mark?: { image: string; alt: string };
}

export const edulynx = {
  slug: "edulynx-erp",
  name: "EduLynx ERP",
  tagline: "Intelligent school management platform",
  status: "live" as ProductStatus,
  url: "https://erp.edulynxerp.in/",
  demoUrl: "https://erp.edulynxerp.in/demo",
  modulesUrl: "https://erp.edulynxerp.in/modules",
  securityUrl: "https://erp.edulynxerp.in/security-practices",
  summary:
    "One platform for academics, attendance, examinations, fees, communication, timetables and administration — with an AI operations assistant that reads your school's live data.",
  audience: "Schools and educational institutions in India",

  why: [
    {
      title: "One system instead of five",
      body: "Attendance, fees, exams and parent communication usually live in separate spreadsheets and apps. EduLynx keeps them in one place so numbers agree.",
    },
    {
      title: "Built around Indian school workflows",
      body: "Fee structures, concessions, exam patterns and report-card formats follow how Indian schools actually operate.",
    },
    {
      title: "Answers, not just dashboards",
      body: "The AI operations assistant surfaces attendance drops, overdue fees and at-risk students from live data, so staff know where to act first.",
    },
    {
      title: "Every school's data kept separate",
      body: "Multi-tenant architecture isolates each institution's records, users and settings.",
    },
  ],

  modules: [
    { key: "students", name: "Student management", body: "Profiles, enrolment, academic records, medical and transport details, bulk import, admission-to-graduation lifecycle." },
    { key: "attendance", name: "Attendance", body: "Student and staff attendance by class and section, session locking, corrections, leave management and CSV export." },
    { key: "academics", name: "Academics", body: "Academic years, terms, classes, sections, subjects, departments, homework, assignments and lesson plans." },
    { key: "exams", name: "Examinations", body: "Exams and papers, marks entry and verification, grade scales, branded PDF report cards and exam analysis." },
    { key: "finance", name: "Finance & fees", body: "Fee categories and structures, invoices, collection, receipts, refunds, concessions, ledger and fee reports." },
    { key: "communication", name: "Communication", body: "Central notifications, WhatsApp bulk reminders, in-app messaging and escalation workflows." },
    { key: "timetable", name: "Timetable", body: "Periods, section and teacher timetables and substitute-teacher assignment." },
    { key: "reports", name: "Reports & analytics", body: "Operational dashboards, academic, attendance and financial reports with CSV export." },
    { key: "staff", name: "Staff & users", body: "Users, roles, permissions, bulk invitations and staff records with role-based access." },
    { key: "admin", name: "Administration", body: "Institution settings, files, notice board, calendar events and a full audit trail." },
    { key: "ai", name: "AI operations assistant", body: "Daily briefings, attendance trends, fee-reminder suggestions, at-risk students and class performance insights." },
    { key: "security", name: "Security & MFA", body: "JWT authentication, TOTP multi-factor authentication, role permissions, security event monitoring and backups." },
  ],

  architecture: {
    roles: ["Administrators", "Teachers", "Students", "Parents"],
    layers: [
      { name: "Role-based access", body: "Each role sees only the data it is authorised to see." },
      { name: "Operational modules", body: "Students · Attendance · Academics · Exams · Fees · Timetable · Communication · Reports" },
      { name: "AI operations assistant", body: "Reads live institutional data to produce briefings and recommendations." },
      { name: "Platform & security", body: "Multi-tenant isolation · JWT + TOTP MFA · audit logging · server-side secrets" },
    ],
  },

  ai: {
    provider: "Anthropic Claude",
    capabilities: [
      "Daily operational briefings with real numbers from your school",
      "Attendance trend analysis and section-by-section comparison",
      "Fee collection insights and reminder suggestions",
      "At-risk student identification from attendance and academic data",
      "Class performance analytics",
      "Natural-language questions about your institution's data",
    ],
  },

  security: [
    { name: "JWT authentication", body: "Token-based sign-in with access and refresh token rotation." },
    { name: "Multi-factor authentication", body: "TOTP-based MFA with recovery codes for critical accounts." },
    { name: "Role-based access control", body: "Granular permissions so users only reach authorised data." },
    { name: "Tenant isolation", body: "Strict data boundaries between institutions." },
    { name: "Audit logging", body: "Significant actions recorded with time, actor and detail." },
    { name: "Protected credentials", body: "Passwords hashed with bcrypt; API keys and secrets kept server-side only." },
  ],

  steps: [
    { title: "Set up your institution", body: "Configure the school, academic structure, fee plans, users and roles." },
    { title: "Run daily operations", body: "Mark attendance, collect fees, enter marks, manage admissions and message parents from one place." },
    { title: "Act on insights", body: "The AI assistant turns live data into attendance, fee and performance insights your team can act on." },
  ],

  roles: [
    { name: "Schools & institutions", body: "Run academics, operations and administration with data isolated per institution." },
    { name: "Administrators & principals", body: "Dashboards, AI briefings, fee oversight and attendance monitoring from one view." },
    { name: "Teachers", body: "Attendance, marks entry, lesson plans and homework at section level." },
    { name: "Students & parents", body: "Attendance history, results, fee status and school communication." },
  ],

  pricing: {
    verifiedFrom: "https://erp.edulynxerp.in/",
    verifiedOn: "2026-09-26",
    note: "One-time licence plus 15% annual maintenance contract. No per-student fees. Prices exclude applicable taxes.",
    plans: [
      {
        name: "EduLynx Standard",
        price: 35000,
        currency: "INR",
        display: "₹35,000",
        basis: "one-time + 15% AMC",
        includes: ["All core ERP modules", "Student & staff management", "Attendance & examinations", "Finance & fee management", "Reports & dashboards", "Communication & notices", "Security & audit logging"],
      },
      {
        name: "EduLynx AI Enterprise",
        price: 75000,
        currency: "INR",
        display: "₹75,000",
        basis: "one-time + 15% AMC",
        includes: ["Everything in Standard", "AI operations assistant and daily briefings", "Attendance & fee AI insights", "At-risk student identification", "Class performance analytics", "WhatsApp integration", "Priority support"],
      },
    ],
  },

  /**
   * Real product screenshots. Add files to content/images/source, register them
   * in scripts/images.ts, then list the manifest keys here. The EduLynx page
   * renders a screenshot gallery automatically once this list is non-empty.
   */
  /** module: EduLynx module key the screenshot shows (drives the interface slot); mobileImage: optional phone crop. */
  screenshots: [] as { image: string; caption: string; module?: string; mobileImage?: string }[],

  faqs: [
    { q: "What is EduLynx ERP?", a: "A school management platform that brings academics, attendance, examinations, fees, communication, administration and AI-powered insights into one secure system. It is built and maintained by KRISLYNX TECHNOLOGIES PRIVATE LIMITED." },
    { q: "Who is it for?", a: "Schools and educational institutions. Administrators, principals, teachers, students and parents each get role-appropriate access." },
    { q: "Can one installation serve several schools?", a: "Yes. EduLynx is multi-tenant: each school operates in isolation with its own users, settings and records." },
    { q: "How do we see it working?", a: "Request a demo on the EduLynx site or email info@krislynx.com. We walk you through the platform using your school's workflows." },
  ],
};

export const products: Product[] = [
  {
    slug: "edulynx-erp",
    name: "EduLynx ERP",
    category: "Education technology",
    status: "live",
    summary: edulynx.summary,
    audience: edulynx.audience,
    href: "/products/edulynx-erp",
    externalUrl: edulynx.url,
    externalLabel: "Visit EduLynx ERP",
  },

  {
    slug: "selfmate",
    mark: { image: "product-selfmate-mark", alt: "SelfMate logo: a heart with a pulse line" },
    name: "SelfMate",
    category: "Personal AI",
    status: "research",
    summary: "A privacy-first digital twin: an AI companion designed to help a person understand their routines, stress and wellbeing, with the person in control of their data.",
    audience: "Individuals",
    href: "/work/selfmate",
    reviewNote: "Confirm status remains Research.",
  },
  {
    slug: "fearlink",
    mark: { image: "product-fearlink-mark", alt: "FearLink wordmark with the tagline Predict. Protect. Prevent" },
    name: "FearLink",
    category: "Safety wearables",
    status: "research",
    summary: "Wearable technology designed to detect acute fear and stress from physiological signals, with on-device processing, to trigger personal-safety alerts.",
    audience: "Personal safety",
    href: "/work/fearlink",
    reviewNote: "Earlier site used '™' and 'world's first'. Both removed until trademark filing and a prior-art review are confirmed.",
  },
  // ── Concepts (owner, 27 Sep 2026: posters approved as visual references; unapproved products shown only as Concept) ──
  {
    slug: "miyraa",
    name: "Miyraa",
    category: "Social platform",
    status: "concept",
    summary: "A social platform designed around verified identity, privacy and trusted family and community connections.",
    audience: "Families and communities",
    href: "/products",
    mark: { image: "product-miyraa-mark", alt: "Miyraa logo: three figures forming a heart, above the word miyraa" },
    reviewNote: "Poster feature claims (emotional intelligence, human-verified identity) not published — concept only.",
  },
  {
    slug: "ap-exportai",
    name: "AP ExportAI",
    category: "Trade intelligence",
    status: "concept",
    summary: "An AI tool designed to help small businesses in Andhra Pradesh explore export markets.",
    audience: "Small businesses in Andhra Pradesh",
    href: "/products",
    mark: { image: "product-apexportai-mark", alt: "AP ExportAI mark: a globe with a rising arrow over bar charts" },
    reviewNote: "'AP' may read as an Andhra Pradesh government affiliation — owner to confirm naming before any launch.",
  },
];
