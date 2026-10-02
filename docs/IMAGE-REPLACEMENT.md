# Image replacement guide

Originals go in `content/images/source/` (never served). `npm run images` produces AVIF, WebP and
JPEG at several widths into `public/images/`, strips all metadata (including GPS — one old photo
had it), and writes `src/generated/images.json` (dimensions + average colour for the loading tint).

## Replace an existing photo
1. Overwrite the file in `content/images/source/` keeping the same filename.
2. `npm run images && npm run build`.

## Add a new photo
1. Put the file in `content/images/source/`.
2. Add a job in `scripts/images.ts`: `{ name, file, widths, aspect, position }`.
3. `npm run images`, then reference `name` from config (e.g. `office.ts`) and write a real `alt` text
   describing what is in the photo.

## Signage rule (important)
The reception-counter banner reads "(OPC) Private Limited", which does not match the certificate. Three
original photos were **cropped so that banner is out of frame** (not edited). Until the banner is replaced,
do not publish any photo in which it is legible. The wall signs (correct name, CIN, address) are fine.

## Empty office slots (`src/config/office.ts`)
Slots with `image: null` are **not shown publicly** (the gallery renders real photos only). Wanted:
| key | Wanted photo |
|---|---|
| `exterior` | Building exterior, Sreenivasa Nilayam, with the entrance visible |
| `engineering` | Engineering desks (without the counter banner in frame) |
| `team` | The team working (with everyone's consent) |
| `demo` | An EduLynx demonstration in the meeting room |

Set `image` to the processed name and write a real `alt`; the photo appears in the gallery automatically.
Guidance: landscape, ≥ 2000 px wide, daylight, no people who haven't consented, no screens showing
real student data.

## EduLynx screenshots
`products.ts → edulynx.screenshots` is empty, so the section is hidden. Add entries
`{ image, caption }` after processing the files. **Use demo data only** — never a real school's records.
Good set: admin dashboard, attendance entry, fee dashboard, AI briefing, parent view on mobile.

## Brand assets
`public/brand/*.svg` were traced from the supplied logo PNGs (`scripts/trace_logo.py`). They're clean but
not designer-drawn. When you commission a vector master, replace the SVGs, keep the file names, then run
`npm run brand && npm run og` to regenerate favicons, app icons and share images.

## Open Graph images
`npm run og` renders one 1200×630 image per indexable page from its title. Re-run after changing titles.

## Replacement log — 26 Sep 2026 ("fixed-lighting" image set, 9 uploads)

Inspected: none of the uploads carried EXIF or GPS; two uploads were byte-identical. The repository contained
**no flagship-product images** (the only product visual is the SelfMate logo on its case study; Miyraa and AP ExportAI
do not exist on the site), so nothing product-related could be "replaced".

| Upload | Content | Decision | Reason |
|---|---|---|---|
| `…09_49_40_AM.png` 1672×941 PNG, 1.94 MB | Meeting room | **USED** → `content/images/source/office-meeting-room.jpg` | Legal name on screen correct. **Note:** this is an AI re-render, not only a lighting fix — the TV is ~2× its real size, walls changed from grey-green to cream, doorway widened. Replace with a real, professionally lit photo when available. |
| `…09_46_03_AM.png` | Meeting room / wall sign | Rejected | Sign text rewritten: CIN **U62013AP2024PTC119824** (real: U62013AP2026PTC128241), "H No. 331-103, Moore Pale" (real: 33/1-108, Noone Palle); counter banner's "(OPC) PRIVATE LIMITED" line erased (digital alteration of signage). |
| `…11_49_56_AM.png` = `…11_53_06_AM.png` | Reception corridor | Rejected | Same wrong CIN and address; banner line erased. |
| `…09_50_52_AM.png` 941×1672 (sideways) | Desk | Rejected | Legal-name line garbled/mirrored by the AI edit. |
| `…12_29_36_PM.png` | Server room | Held | No original to compare; cannot verify the room/equipment exist as shown; would add a new section (out of scope). Owner confirmation required. |
| `Jul_17…06_28_55`, `06_35_03`, `06_40_44` | "Our Flagship Products" posters | Rejected | Text-as-image with claims that contradict approved content (FearLink/SelfMate presented as launched products with features; TradeSphere as "global B2B network… verified buyers and sellers worldwide"); unlisted products (Miyraa, AP ExportAI); duplicate "04" numbering; EduLynx shown with a different logo/name ("Education Operating System") than erp.edulynxerp.in — unverified. |

Meeting-room derivatives (existing names, 16:9, 1600×900 max — no layout change): AVIF 13–71 KB, WebP 16–109 KB,
JPEG fallback 21–157 KB. All metadata stripped.

## Adding real EduLynx screenshots (V3.3 slot)
1. Use **demo data only** — no real school, student, staff or financial records.
2. Put files in `content/images/source/` (e.g. `edulynx-attendance.png`, optional phone crop `edulynx-attendance-mobile.png`) and
   add jobs in `scripts/images.ts`; run `npm run images`.
3. Register in `src/config/products.ts → edulynx.screenshots`:
   `{ image: "edulynx-attendance", caption: "Attendance by class and section", module: "attendance", mobileImage: "edulynx-attendance-mobile" }`
   Valid `module` keys: students, attendance, academics, exams, finance, communication, timetable, reports, staff, admin, ai.
4. Rebuild. That module's screen switches from the illustrative widgets to the screenshot, tagged "Product screenshot"; the
   window label drops "illustrative" once any screenshot exists. Update the design test that asserts none are supplied.

## Art-directed photo crops
`<Picture name="…" mobile="…-mobile" … />` serves the phone crop below 48rem (AVIF/WebP) and the desktop image above.
Process both through `scripts/images.ts` (EXIF/GPS stripped automatically). Inspect every photo for signage text first.

## Image registry (27 Sep 2026)
| Public asset | Source | Status | Where |
|---|---|---|---|
| krislynx-infrastructure-server-room (+ -mobile) | ChatGPT_Image_Sep_26__2026__12_29_36_PM.png | Owner-confirmed real room, AI-enhanced, disclosed | Home §08, /office |
| office-meeting-room | ChatGPT_Image_Sep_26__2026__09_49_40_AM.png | AI re-render of the real room (TV size, walls differ) — replace with a real photo when available | Home §11, /office |
| krislynx-workspace (+ -mobile) | WhatsApp original 19 Sep 2026, professionally enhanced (WB, levels, midtones, contrast, sharpening) | Real photograph — first photograph on the homepage | Home (after hero) |
| office-workspace | same original, same enhancement | Real | /office |
| office-reception-corridor, office-brand-wall | WhatsApp originals 15/19 Sep 2026 | Real photographs | /office |
| leadership-madhu-krishna | WhatsApp original | Real; hidden route only | /company/leadership |
| product-selfmate-mark | SelfMate poster (crop) | Replaced the old low-legibility logo asset (removed from source, public/ and build) | /products, /work/selfmate |
| product-fearlink-mark, product-miyraa-mark, product-apexportai-mark | product posters (crops) | Marks only; Miyraa/AP ExportAI shown as Concept | /products |
| Rejected, not in public/ | …09_46_03, …11_49_56/…11_53_06 (wrong CIN/address), …09_50_52 (garbled text), product posters, launch invitation (RKLS, pre-incorporation date) | Never published | — |

## V2 (27 Sep 2026)
- office-reception-corridor and office-brand-wall masters enhanced from their untouched originals (WB, levels, midtones, contrast, sharpening).
- Art-directed phone sources now carry their own width/height (fixes mobile CLS).
