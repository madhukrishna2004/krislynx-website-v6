/**
 * OFFICE GALLERY. Real photographs only.
 *
 * Slots with `image: null` render as designed placeholders that say what
 * photo belongs there. To fill a slot: add the photo to content/images/source,
 * register it in scripts/images.ts, run `npm run images`, then set `image`
 * to the manifest key. No layout changes needed.
 */
export interface OfficeShot {
  key: string;
  category: "Exterior" | "Entrance" | "Corridor" | "Signage" | "Workspace" | "Engineering" | "Infrastructure" | "Meeting room" | "Leadership" | "Team" | "Product demonstration";
  image: string | null;
  alt: string;
  caption: string;
  layout: "wide" | "tall" | "standard";
}

export const officeShots: OfficeShot[] = [
  { key: "workspace", category: "Workspace", image: "office-workspace", alt: "Workspace with a desk and chair facing the KRISLYNX TECHNOLOGIES PRIVATE LIMITED sign showing the CIN and registered address", caption: "The main workspace, with our registered-office signage.", layout: "wide" },
  { key: "meeting", category: "Meeting room", image: "office-meeting-room", alt: "Meeting room with a long white table, office chairs and a wall-mounted screen showing the KRISLYNX TECHNOLOGIES PRIVATE LIMITED logo", caption: "The meeting room, where we run client calls and product demos.", layout: "wide" },
  { key: "brand", category: "Signage", image: "office-brand-wall", alt: "KRISLYNX TECHNOLOGIES PRIVATE LIMITED sign showing the company address in Nandyal", caption: "Registered-office sign with our CIN and address.", layout: "standard" },
  { key: "entrance", category: "Corridor", image: "office-reception-corridor", alt: "Office corridor on the second floor with a large KrisLynx sign on the wall", caption: "Main corridor, second floor, Sreenivasa Nilayam.", layout: "tall" },
  { key: "infrastructure", category: "Infrastructure", image: "krislynx-infrastructure-server-room", alt: "The office network and server room: workstation towers on a shelf, a firewall, network switch and patch panel in an open rack, a UPS, a NAS and a locked cabinet, lit in blue", caption: "Network and server room, Nandyal office. Image enhanced for clarity.", layout: "wide" },
  { key: "engineering", category: "Engineering", image: null, alt: "", caption: "Engineering desks — photo to be added.", layout: "standard" },
  { key: "exterior", category: "Exterior", image: null, alt: "", caption: "Building exterior — photo to be added.", layout: "standard" },
  { key: "team", category: "Team", image: null, alt: "", caption: "The team at work — photo to be added.", layout: "standard" },
  { key: "demo", category: "Product demonstration", image: null, alt: "", caption: "EduLynx ERP demonstration — photo to be added.", layout: "standard" },
];

/** Photos used on the homepage office section (in order). */
export const homeOfficeKeys = ["workspace", "entrance", "meeting"] as const;
