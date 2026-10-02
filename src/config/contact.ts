/**
 * CONTACT FORM CONFIGURATION. Shared by the page, the client script and the
 * server function so validation rules never drift apart.
 */
export const contactConfig = {
  endpoint: "/api/contact",
  maxDetails: 4000,
  minDetails: 20,
  maxAttachmentBytes: 4 * 1024 * 1024,
  attachmentTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/png",
    "image/jpeg",
  ],
  attachmentAccept: ".pdf,.docx,.pptx,.png,.jpg,.jpeg",
  /** submissions faster than this after page load are treated as bots */
  minFillMs: 3000,
  needs: [
    { value: "new-product", label: "Build a product" },
    { value: "ai", label: "AI / ML system" },
    { value: "school-erp", label: "School ERP" },
    { value: "enterprise", label: "Software engineering" },
    { value: "partnership", label: "Partnership" },
    { value: "other", label: "General enquiry" },
  ],
  timelines: [
    { value: "asap", label: "As soon as possible" },
    { value: "1-3m", label: "Within 1–3 months" },
    { value: "3-6m", label: "In 3–6 months" },
    { value: "exploring", label: "Just exploring" },
  ],
  /** Where the project is today (optional). */
  stages: [
    { value: "idea", label: "Idea" },
    { value: "prototype", label: "Prototype" },
    { value: "existing", label: "Existing system" },
    { value: "scaling", label: "Scaling" },
  ],
  budgets: [
    { value: "undecided", label: "Not decided yet" },
    { value: "lt5k", label: "Under US$5,000 (≈ ₹4 lakh)" },
    { value: "5-15k", label: "US$5,000–15,000 (≈ ₹4–12 lakh)" },
    { value: "15-50k", label: "US$15,000–50,000 (≈ ₹12–40 lakh)" },
    { value: "gt50k", label: "Over US$50,000 (≈ ₹40 lakh+)" },
  ],
  /** Free-mail domains get a gentle hint (not a block) to use a business address. */
  freeMailDomains: ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "rediffmail.com", "proton.me", "aol.com"],
} as const;

export type NeedValue = (typeof contactConfig.needs)[number]["value"];
