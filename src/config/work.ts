/**
 * WORK / CASE STUDIES.
 *
 * Format (per directive): challenge → context → approach → solution →
 * technology → product experience → current status.
 *
 * RULE: no invented outcomes. The previous site listed figures such as
 * "30% reduction in anxiety episodes", "200+ emergency incidents assisted",
 * "used by 1000+ firms" and "50% operational boost across 15 institutions".
 * None could be verified, so all were removed. Add results here only when
 * they can be evidenced and the client has agreed to publication.
 */
import type { ProductStatus } from "./products";

export interface CaseStudy {
  slug: string;
  name: string;
  kind: string;
  status: ProductStatus;
  statusDetail: string;
  summary: string;
  challenge: string;
  context: string;
  approach: string[];
  solution: string[];
  technology: string[];
  experience: string;
  links: { label: string; href: string; external?: boolean }[];
  relatedServices: string[];
  image?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "edulynx-erp",
    name: "EduLynx ERP",
    kind: "SaaS product · Education",
    status: "live",
    statusDetail: "Live at erp.edulynxerp.in with published pricing and demo requests open.",
    summary: "A multi-tenant school management platform with an AI operations assistant, built and operated by KrisLynx.",
    challenge:
      "Schools run attendance, fees, examinations and parent communication across registers, spreadsheets and messaging apps. Numbers disagree between departments, and leadership finds out about problems — falling attendance, overdue fees — after they have grown.",
    context:
      "Indian schools have specific fee structures, concessions, exam patterns and report-card formats, and many are price-sensitive. Staff range from confident software users to people using an ERP for the first time.",
    approach: [
      "Modelled the full student lifecycle, from admission to graduation, as the core record every module shares.",
      "Chose a multi-tenant architecture so each school is isolated while the platform is maintained once.",
      "Designed role-based access for administrators, teachers, students and parents from the start.",
      "Added an AI layer that reads live operational data and reports what needs attention, instead of a generic chatbot.",
    ],
    solution: [
      "Twelve integrated modules: students, attendance, academics, examinations, finance and fees, communication, timetable, reports, staff and users, administration, AI assistant, security.",
      "Branded PDF report cards and fee receipts.",
      "WhatsApp integration for bulk reminders.",
      "JWT authentication with TOTP multi-factor authentication, audit logging and tenant isolation.",
    ],
    technology: ["Multi-tenant web platform", "JWT + TOTP MFA", "Role-based access control", "Anthropic Claude (AI assistant)", "PDF generation", "WhatsApp integration"],
    experience:
      "Each role lands on what it needs: administrators get a daily briefing and oversight dashboards, teachers get attendance and marks entry for their sections, and parents see attendance, results and fee status.",
    links: [
      { label: "Product overview", href: "/products/edulynx-erp" },
      { label: "Visit EduLynx ERP", href: "https://erp.edulynxerp.in/", external: true },
    ],
    relatedServices: ["saas-development", "artificial-intelligence", "enterprise-software"],
  },
  {
    // Public name withheld pending owner decision: "TradeSphere" is an established third-party
    // trade-software brand. See docs/OWNER-CONFIRMATIONS.md. Do not rename back without that decision.
    slug: "trade-classification-assistant",
    name: "Trade classification assistant",
    kind: "Trade compliance · AI classification",
    status: "in-development",
    statusDetail: "Internal development project. Not a released product and not available to customers.",
    summary: "An AI-assisted tool to help businesses classify goods and understand tariffs and trade agreements.",
    challenge:
      "Classifying goods under the Harmonized System and working out duties and applicable trade agreements is slow, specialist work. Small importers and exporters often rely on guesswork or expensive advice.",
    context:
      "The product's initial focus is UK and EU trade, where tariff schedules and rules of origin are detailed and change over time.",
    approach: [
      "Treat HS code discovery as decision support: suggest candidate codes with reasoning, and leave the final choice to the user.",
      "Combine tariff reference data with AI assistance, rather than relying on a model's memory of regulations.",
    ],
    solution: [
      "HS code discovery support.",
      "Tariff information and trade-agreement awareness.",
      "Decision-support workflows for compliance checks.",
    ],
    technology: ["Python", "PostgreSQL", "AI-assisted search and classification"],
    experience: "Users describe a product in plain language and are guided to likely classifications and the tariff information that applies.",
    links: [],
    relatedServices: ["artificial-intelligence", "saas-development"],
  },
  {
    slug: "selfmate",
    name: "SelfMate",
    kind: "Personal AI · Digital twin",
    status: "research",
    statusDetail: "Research initiative. No release date.",
    summary: "Exploring a privacy-first digital twin that helps people understand their routines, stress and wellbeing.",
    challenge:
      "Wellbeing apps tend to either collect a lot of personal data or give generic advice. We want to know whether an AI companion can be genuinely useful while leaving the person in control of their data.",
    context:
      "Emotional and behavioural data is among the most sensitive a person has. Any product in this space has to earn trust through its data design before its features.",
    approach: [
      "Start from user-controlled data: the person decides what is collected and can remove it.",
      "Research AI-assisted journaling and pattern recognition over routines and self-reported mood.",
      "Explore future integration with wearables, informed by our FearLink research.",
    ],
    solution: [
      "Research prototypes for emotion and behaviour insights.",
      "Wellness-oriented AI journaling concepts.",
    ],
    technology: ["Large language models", "Privacy-preserving data design", "Mobile and wearable integration (future scope)"],
    experience: "Tagline: “Your digital twin, empowering you.” The intended experience is a private companion, not a feed.",
    links: [],
    relatedServices: ["artificial-intelligence", "product-engineering"],
    image: "product-selfmate-mark",
  },
  {
    slug: "fearlink",
    name: "FearLink",
    kind: "Wearables · Personal safety",
    status: "research",
    statusDetail: "Research and prototyping. Not a commercial product.",
    summary: "Wearable research into detecting acute fear and stress from physiological signals to support personal-safety alerts.",
    challenge:
      "In an emergency, a person may not be able to unlock a phone and call for help. Could a wearable recognise the physiological signs of acute fear and raise an alert automatically?",
    context:
      "This is hard. Physiological signals vary between people and overlap with exercise and excitement, and false alarms quickly destroy trust. It also involves health-related data that must be handled with explicit consent.",
    approach: [
      "Study real-time biometric signals associated with fear and stress responses.",
      "Process on the device where possible, so the system can work offline and keep raw data private.",
      "Treat alerting as a pilot-tested safety feature, with consent and user control at every step.",
    ],
    solution: [
      "Research into real-time emotional sensing from biometric data.",
      "Edge AI processing designed to work without connectivity.",
      "Prototype safety-alert flows.",
    ],
    technology: ["Embedded systems", "Edge AI", "Biometric signal processing"],
    experience: "Intended as a discreet wearable that acts only when the user needs it and has agreed to it.",
    links: [],
    relatedServices: ["artificial-intelligence"],
  },
];

export const caseStudyBySlug = (slug: string): CaseStudy | undefined => caseStudies.find((c) => c.slug === slug);
