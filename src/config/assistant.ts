/**
 * KRISLYNX ASSISTANT — APPROVED KNOWLEDGE BASE.
 *
 * The assistant may ONLY answer from these entries. Each answer is reviewed
 * company information. If a question does not match an entry with enough
 * confidence, the assistant says it does not have an approved answer and
 * offers to connect the visitor with the team. It never improvises.
 *
 * Provider modes (see src/client/assistant/):
 *   "local"  – deterministic matching against this file (default; no AI).
 *   "remote" – POST /api/assistant, a server function that may use an LLM
 *              constrained to this same knowledge base. Disabled until the
 *              function is deployed and ASSISTANT_MODE is switched.
 */
import { edulynx } from "./products";
import { lifecycle } from "./lifecycle";
import { techLayers } from "./technology";

export interface KnowledgeEntry {
  id: string;
  /** phrases a visitor might use; matched after normalisation */
  triggers: string[];
  /** strong single-word signals */
  keywords: string[];
  answer: string;
  links?: { label: string; href: string; event?: string }[];
  /** where the answer comes from on the site — shown under the answer (never invented) */
  source?: string;
  /** optional structured card: a destination on the site, described with approved wording */
  card?: { kicker: string; title: string; href: string; cta: string };
}

export const assistantConfig = {
  name: "KX Assistant",
  system: "KrisLynx knowledge system",
  mode: "local" as "local" | "remote",
  remoteEndpoint: "/api/assistant",
  disclosure:
    "Answers come only from KrisLynx's approved company information. This assistant does not use generative AI and cannot see your data.",
  greeting: "Hi — I can answer questions about KrisLynx, our products and our services. What would you like to know?",
  fallback:
    "I don't have verified information about that. The team can answer directly — email info@krislynx.com or use the contact form.",
  /** page-aware prompts: first matching path prefix wins; every prompt must resolve to an approved entry (tested) */
  contexts: [
    { prefix: "/products/edulynx-erp", intro: "You're exploring EduLynx.", label: "Ask about EduLynx", prompts: ["What does EduLynx manage?", "How does the school-day workflow work?", "What modules are included?", "How much does EduLynx cost?", "Can I request an EduLynx demo?"] },
    { prefix: "/products", intro: "You're exploring the product portfolio.", label: "Ask about the products", prompts: ["What does KrisLynx build?", "Tell me about EduLynx.", "What modules are included?", "How can I start a project?"] },
    { prefix: "/technology", intro: "You're exploring how KrisLynx engineers software.", label: "Ask about the architecture", prompts: ["What are the six architecture layers?", "What technology do you use?", "Do you build AI systems?", "How do you handle security?"] },
    { prefix: "/services", intro: "You're exploring engineering services.", label: "Ask about engineering services", prompts: ["What services do you provide?", "How do you run a project?", "Do you build AI systems?", "How can I start a project?"] },
    { prefix: "/contact", intro: "You're about to start a project.", label: "Ask about starting a project", prompts: ["What happens after I send the form?", "How can I start a project?", "Can I request an EduLynx demo?"] },
  ] as { prefix: string; intro: string; label: string; prompts: string[] }[],
  /** quick commands: plain navigation to the site's main destinations */
  commands: [
    { label: "Products", href: "/products" }, { label: "EduLynx", href: "/products/edulynx-erp" }, { label: "Services", href: "/services" },
    { label: "Technology", href: "/technology" }, { label: "Work", href: "/work" }, { label: "Company", href: "/company" }, { label: "Contact", href: "/contact" },
  ],
  suggestions: [
    "What does KrisLynx build?",
    "Tell me about EduLynx.",
    "What services do you provide?",
    "How can I start a project?",
    "Where is KrisLynx based?",
  ],
};

/**
 * Guarded topics are checked BEFORE normal matching (see engine.ts). They stop the
 * assistant from answering an unrelated approved entry when asked for facts that
 * KrisLynx does not publish — so it can never appear to confirm revenue, customer
 * counts, awards, certifications, partnerships, headcount or client names.
 */
export const guardedTopics: { id: string; pattern: RegExp; answer: string }[] = [
  {
    id: "internal-project",
    pattern: /trade\s?sphere|trade[- ]classification|hs code tool/i,
    answer:
      "That is an internal development project, not a product KrisLynx sells. It has no public pricing or release date. EduLynx ERP is the product available today.",
  },
  {
    id: "unpublished",
    pattern:
      /\b(revenue|turnover|profit|funding|valuation|investors?|how many (customers|clients|schools|users|employees|people|staff)|headcount|number of (customers|clients|schools|employees)|which (schools|companies|clients|customers)|client list|customer list|awards?|certif\w*|iso ?\d*|soc ?2|accredit\w*|partners?(hip)?s?|ranked|market share)\b/i,
    answer:
      "I can only share information KrisLynx has published, and that isn't something published here. Please ask the team directly — they'll give you an accurate answer.",
  },
];

const layerLine = "Interface, Application, API, Services, Data and Infrastructure — with security running through every layer";
export const knowledge: KnowledgeEntry[] = [
  {
    id: "handoff",
    triggers: ["work with you", "work with krislynx", "hire krislynx", "hire your team", "work together", "want to work with"],
    keywords: [],
    answer: "Let's start with what needs to work. Tell us what you're building and what has to change — a senior engineer reads every enquiry.",
    links: [{ label: "Start a project", href: "/contact", event: "chatbot_lead" }],
    card: { kicker: "Contact", title: "Tell us what needs to work", href: "/contact", cta: "Start a project" },
    source: "Contact page",
  },
  {
    id: "modules",
    triggers: ["modules included", "modules are included", "edulynx modules", "module list", "modules does edulynx"],
    keywords: ["modules"],
    answer: `EduLynx ERP has ${edulynx.modules.length} modules on one institution record: ${edulynx.modules.map((m) => m.name).join(", ")}.`,
    links: [{ label: "Explore EduLynx ERP", href: "/products/edulynx-erp", event: "chatbot_product" }],
    source: "EduLynx ERP page",
  },
  {
    id: "architecture",
    triggers: ["architecture layers", "six layers", "six architecture", "reference architecture"],
    keywords: ["architecture"],
    answer: `Every system we build has six layers: ${layerLine}. On the Technology page you can select each layer to see its responsibility and the technology we use there.`,
    links: [{ label: "Explore the architecture", href: "/technology" }],
    source: "Technology page",
    card: { kicker: "Technology", title: "Six-layer architecture", href: "/technology", cta: "Explore the architecture" },
  },
  {
    id: "stack",
    triggers: ["tech stack", "technology stack", "technology do you use", "technologies do you use", "programming languages"],
    keywords: ["stack"],
    answer: `We choose the architecture first, then tools. Technologies we work with include ${techLayers.filter((l) => l.key !== "security").flatMap((l) => l.items.slice(0, 2)).join(", ")}. Each project uses the subset it needs.`,
    links: [{ label: "See it by layer", href: "/technology" }],
    source: "Technology page",
  },
  {
    id: "process",
    triggers: ["run a project", "run projects", "engineering process", "project process", "engineering lifecycle", "delivery process"],
    keywords: ["lifecycle", "methodology"],
    answer: `We work in eight steps — ${lifecycle.map((l) => l.name).join(", ")} — and each step ends with something you can review.`,
    links: [{ label: "Engineering services", href: "/services" }, { label: "Start a project", href: "/contact", event: "chatbot_lead" }],
    source: "Services and Technology pages",
  },
  {
    id: "after-contact",
    triggers: ["after i send", "happens after", "after the form", "what happens next", "when will you reply"],
    keywords: [],
    answer: "A senior engineer reads every enquiry and replies to business enquiries within two working days. If it's a fit, we arrange a 30–45 minute call, then send a clear proposal — or an honest \"we're not the right fit\".",
    links: [{ label: "Start a project", href: "/contact", event: "chatbot_lead" }],
    source: "Contact page",
  },
  {
    id: "about",
    triggers: ["what does krislynx do", "who are you", "what is krislynx", "about krislynx", "tell me about the company"],
    keywords: ["krislynx", "company", "about", "who", "do"],
    answer:
      "KrisLynx Technologies is a software, AI and product engineering company based in Nandyal, Andhra Pradesh, India. We build our own products — our live product is EduLynx ERP for schools — and we engineer custom software, AI systems and SaaS platforms for other organizations.",
    links: [{ label: "About the company", href: "/company" }],
  },
  {
    id: "edulynx",
    triggers: ["tell me about edulynx", "what is edulynx", "school erp", "school management software", "edulynx erp"],
    keywords: ["edulynx", "school", "erp", "schools", "education"],
    answer:
      "EduLynx ERP is our school management platform. It covers students, attendance, academics, examinations, fees, communication, timetables, reports and administration, with an AI operations assistant that analyses live school data. It is multi-tenant and secured with MFA, role-based access and audit logging. It is live now.",
    links: [
      { label: "EduLynx overview", href: "/products/edulynx-erp" },
      { label: "Visit EduLynx ERP", href: "https://erp.edulynxerp.in/", event: "external_product_click" },
    ],
    card: { kicker: "EduLynx ERP", title: "School management platform", href: "/products/edulynx-erp", cta: "Explore EduLynx" },
  },
  {
    id: "pricing",
    triggers: ["how much does edulynx cost", "edulynx price", "pricing", "cost", "how much"],
    keywords: ["price", "pricing", "cost", "fees", "licence", "license", "amc"],
    answer:
      "EduLynx ERP has two published plans: Standard at ₹35,000 one-time and AI Enterprise at ₹75,000 one-time, each plus a 15% annual maintenance contract, excluding taxes. There are no per-student fees. Custom software projects are quoted after a short discovery phase.",
    links: [{ label: "Pricing", href: "/pricing" }],
  },
  {
    id: "demo",
    triggers: ["how can i request a demo", "request a demo", "book a demo", "see a demo", "demo"],
    keywords: ["demo", "demonstration", "trial", "walkthrough"],
    answer:
      "You can request an EduLynx ERP demo on the EduLynx site, or email info@krislynx.com. We walk you through the platform using your school's own workflows.",
    links: [
      { label: "Request an EduLynx demo", href: "https://erp.edulynxerp.in/demo", event: "demo_request" },
      { label: "Contact us", href: "/contact?need=edulynx-demo" },
    ],
  },
  {
    id: "services",
    triggers: ["what services do you provide", "services", "what can you build", "what do you offer"],
    keywords: ["services", "service", "offer", "provide", "capabilities"],
    answer:
      "We offer product engineering, AI and intelligent systems, enterprise software, SaaS development, custom software development, and cloud and platform engineering.",
    links: [{ label: "All services", href: "/services" }],
    card: { kicker: "Services", title: "Product, AI and enterprise engineering", href: "/services", cta: "Explore services" },
  },
  {
    id: "build",
    triggers: ["i want to build a software product", "build an app", "build a product", "develop software", "custom software", "hire you"],
    keywords: ["build", "develop", "app", "product", "project", "hire", "startup", "mvp"],
    answer:
      "We can help. We usually start with a short discovery phase to agree the first release, then build in increments you can see every one to two weeks. Tell us about your project through the contact form and we'll reply within two working days.",
    links: [
      { label: "Start a conversation", href: "/contact?need=new-product", event: "chatbot_lead" },
      { label: "Product engineering", href: "/services/product-engineering" },
    ],
  },
  {
    id: "ai",
    triggers: ["ai development", "do you build ai", "chatbot", "machine learning", "automation"],
    keywords: ["ai", "llm", "ml", "machine", "learning", "automation", "chatbot", "intelligent"],
    answer:
      "We build AI features grounded in an organization's own data — assistants, workflow automation, document extraction and predictive analytics — with evaluation and human review built in. EduLynx ERP's AI operations assistant is an example.",
    links: [{ label: "AI & intelligent systems", href: "/services/artificial-intelligence" }],
  },
  {
    id: "location",
    triggers: ["where is krislynx located", "where are you", "address", "office location", "where is your office"],
    keywords: ["where", "located", "location", "address", "office", "india", "nandyal"],
    answer:
      "Our registered office is at Sreenivasa Nilayam, 2nd Floor, H. No. 33/1-108, Noone Palle, Nandyal, Kurnool – 518502, Andhra Pradesh, India. We work with organizations in India and internationally.",
    links: [
      { label: "See the office", href: "/office" },
      { label: "Company information", href: "/company#company-information" },
    ],
  },
  {
    id: "international",
    triggers: ["do you work internationally", "work with clients outside india", "time zone", "timezone", "remote"],
    keywords: ["international", "global", "abroad", "usa", "uk", "europe", "timezone", "remote", "overseas"],
    answer:
      "Yes. We're based in India (IST, UTC+5:30) and work remotely with organizations in other countries, scheduling regular calls inside your business hours.",
    links: [{ label: "Start a conversation", href: "/contact", event: "chatbot_lead" }],
  },
  {
    id: "contact",
    triggers: ["i want to contact the team", "contact", "email", "talk to someone", "get in touch", "phone"],
    keywords: ["contact", "email", "talk", "reach", "call", "touch", "speak"],
    answer:
      "Email info@krislynx.com or use the contact form. We reply to business enquiries within two working days.",
    links: [{ label: "Contact form", href: "/contact", event: "chatbot_lead" }],
  },
  {
    id: "products",
    triggers: ["what products do you have", "your products", "product list"],
    keywords: ["products", "portfolio"],
    answer:
      "Our flagship is EduLynx ERP, a live school management platform. The portfolio also includes SelfMate (personal AI), FearLink (safety wearables), Miyraa (a social platform) and AP ExportAI (trade intelligence). EduLynx ERP is the product schools can use today.",
    links: [{ label: "All products", href: "/products" }],
  },
  {
    id: "careers",
    triggers: ["are you hiring", "jobs", "careers", "work at krislynx", "internship"],
    keywords: ["hiring", "job", "jobs", "career", "careers", "vacancy", "internship", "resume", "cv"],
    answer:
      "We don't have open positions listed right now. You're welcome to send your CV and a note about what you'd like to work on to info@krislynx.com.",
    links: [{ label: "Careers", href: "/careers" }],
  },
  {
    id: "legal",
    triggers: ["cin", "company registration", "is krislynx registered", "legal name"],
    keywords: ["cin", "registered", "registration", "legal", "incorporated", "private", "limited"],
    answer:
      "KRISLYNX TECHNOLOGIES PRIVATE LIMITED was incorporated on 14 September 2026 under the Companies Act, 2013. CIN: U62013AP2026PTC128241.",
    links: [{ label: "Company information", href: "/company#company-information" }],
  },
  {
    id: "security",
    triggers: ["is edulynx secure", "security", "data protection", "how do you protect data"],
    keywords: ["security", "secure", "privacy", "mfa", "encryption", "protect"],
    answer:
      "EduLynx ERP uses JWT authentication with token rotation, TOTP multi-factor authentication, role-based access control, tenant data isolation, audit logging and bcrypt-hashed passwords, with secrets kept server-side.",
    links: [{ label: "EduLynx security", href: "/products/edulynx-erp#security" }],
  },
];
