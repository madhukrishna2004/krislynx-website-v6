/**
 * CAREERS. Only list roles that are genuinely open. JobPosting structured data
 * is generated automatically for each open role, so stale entries would
 * mislead job seekers and violate search-engine policies.
 * The previous site's roles (Remote India/UK, Hyderabad/London) could not be
 * confirmed as open and were removed.
 */
export interface Role {
  slug: string;
  title: string;
  location: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "INTERN";
  remote: boolean;
  datePosted: string;
  validThrough: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

export const openRoles: Role[] = [];

export const workingHere = [
  { title: "Real products in production", body: "You work on software that runs in production, not throwaway prototypes." },
  { title: "Small team, wide scope", body: "Engineers touch product, design, infrastructure and customers." },
  { title: "Office in Nandyal", body: "We work from our office in Nandyal, Andhra Pradesh." },
];
