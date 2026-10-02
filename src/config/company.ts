/**
 * COMPANY FACTS — single source of truth.
 *
 * Everything here must be verifiable. Legal identity comes from the MCA
 * Certificate of Incorporation dated 14 September 2026. Do not add numbers,
 * clients, awards or certifications that cannot be evidenced.
 *
 * PAN and TAN are intentionally NOT stored or published anywhere on the site.
 */
export const company = {
  brandName: "KrisLynx",
  displayName: "KrisLynx Technologies",
  legalName: "KRISLYNX TECHNOLOGIES PRIVATE LIMITED",
  legalNameReadable: "KRISLYNX TECHNOLOGIES PRIVATE LIMITED",
  companyType: "Private company limited by shares",
  cin: "U62013AP2026PTC128241",
  incorporationDate: "2026-09-14",
  incorporationDateReadable: "14 September 2026",
  registrar: "Registrar of Companies, Central Registration Centre (Ministry of Corporate Affairs)",
  /** Year the KrisLynx initiative began, as stated in the company's own earlier website. */
  initiativeStartYear: 2023,

  url: "https://krislynx.com",
  /** Official general enquiries mailbox (owner-confirmed). Used for contact, careers and privacy requests. */
  email: "info@krislynx.com",
  careersEmail: "info@krislynx.com",
  privacyEmail: "info@krislynx.com",
  // founder@krislynx.com is reserved for contexts that specifically intend direct founder contact; none are published.

  address: {
    building: "Sreenivasa Nilayam, 2nd Floor",
    street: "H. No. 33/1-108, Noone Palle",
    locality: "Nandyal",
    district: "Kurnool",
    region: "Andhra Pradesh",
    postalCode: "518502",
    country: "India",
    countryCode: "IN",
  },

  /** Short, human location line used across the site. */
  locationShort: "Nandyal, Andhra Pradesh, India",
  timezone: "Asia/Kolkata",
  timezoneLabel: "IST (UTC+5:30)",
  responseTime: "We reply to business enquiries within two working days.",

  positioning: {
    promise: "Engineering intelligent technology for the real world.",
    support: "AI, software and product engineering for organizations building what comes next.",
    oneLiner:
      "KrisLynx Technologies is a software, AI and product engineering company based in India. We build our own products, such as EduLynx ERP for schools, and engineer software for organizations that need it to work.",
    global: "Based in India. Building technology for a global market.",
  },

  mission:
    "Build dependable software, AI and products that organizations can run real work on — and be honest about what they do.",
  vision:
    "A technology company from India whose products and engineering are trusted by organizations anywhere in the world.",

  /** Values carried forward from the original KrisLynx site and made concrete. */
  principles: [
    {
      title: "Truth over trend",
      body: "We build for problems that will still exist after the hype cycle. If a feature does not help someone do their job, it does not ship.",
    },
    {
      title: "Built for real people",
      body: "Every product starts with the person using it — a school accountant closing fees, a teacher marking attendance, an engineer on call.",
    },
    {
      title: "Secure by default",
      body: "Authentication, access control and audit trails are designed in from the first sprint, not bolted on before launch.",
    },
    {
      title: "Radical ownership",
      body: "The people who build a system stay accountable for how it runs in production. We own outcomes, not just tickets.",
    },
  ],

  leadership: [
    {
      name: "Madhu Krishna",
      role: "Founder & CEO",
      image: "leadership-madhu-krishna",
      bio: "Madhu Krishna founded KrisLynx to build software products and AI systems from India for use anywhere. He leads product direction, engineering and client partnerships, and is the first point of contact for new projects.",
      linkedin: "https://www.linkedin.com/in/madhu-krishna-b143bb231/",
      published: true,
    },
  ],
} as const;

export type Company = typeof company;

export const formattedAddressLines = [
  company.address.building,
  company.address.street,
  `${company.address.locality}, ${company.address.district} – ${company.address.postalCode}`,
  `${company.address.region}, ${company.address.country}`,
];
