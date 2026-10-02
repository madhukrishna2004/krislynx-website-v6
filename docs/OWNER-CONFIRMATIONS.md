# Owner confirmations

These are **business decisions, not technical blockers**. The site can launch without them because nothing
unconfirmed is published; each row says what stays withheld until you decide. Launch-relevant: 7 and 8 (see
RELEASE-BLOCKERS → deployment configuration).

Decisions only the company can make. Where unsure, the website withholds or states conservatively —
nothing below has been guessed on the public site.

| # | Item | What the site does now | Needed from you |
|---|---|---|---|
| 1 | **Office signage "(OPC)"** | The reception-counter banner reads "KRISLYNX TECHNOLOGIES **(OPC)** PRIVATE LIMITED"; the MCA certificate says **KRISLYNX TECHNOLOGIES PRIVATE LIMITED**. The site uses the certificate everywhere. Three photos showed the counter banner legibly; they were **reframed (cropped) so it is out of frame** — not edited. The wall signs (correct name, CIN, address) remain visible. | **Replace or verify the physical counter banner.** Until then, don't publish new photos in which it is legible. Do not describe the signage as corrected until it is. |
| 2 | **TradeSphere name and status** | Name removed from every public page. Shown only on /work as "Trade classification assistant — *internal development project, not a released product*". Not on /products, not in navigation, no pricing. `/tradesphere` 301-redirects there. | Decide name and status. "TradeSphere®" is an established third-party trade-software brand in the same field; take trademark advice. This is not a legal conclusion. |
| 3 | **SelfMate status** | Research | Confirm or update `status` in `src/config/products.ts` and `work.ts`. |
| 4 | **FearLink status** | Research | Same. |
| 5 | **Leadership / team** | Only Madhu Krishna (Founder & CEO) published. The old site listed five other people — withheld. | Names, current roles, consent and photos for anyone else. |
| 6 | **HR portal URL** | "Employee login" **removed** from the footer. The HRMS code in the old repo cannot log anyone in (see `internal/hrms/README.md`), so the live Render portal must run other code. | Confirm the real portal URL and that it's secure, then re-add it in `navigation.ts` + footer. |
| 7 | **Production email** | Contact form sends via Resend to `CONTACT_TO` = info@krislynx.com (official general enquiries mailbox). Not tested live. | Resend account, verified sending domain (SPF/DKIM), secrets set (see DEPLOYMENT.md). |
| 8 | **Firebase project** | `.firebaserc` uses placeholder id `krislynx-web`. | The real project id; Blaze plan; Firestore enabled. |
| 9 | **Analytics ID** | No analytics (none loads, no banner). | A GA4 measurement ID (`KX_GA_ID`) if you want analytics — or leave off. |
| 10 | **Social URLs** | Only the LinkedIn company page is linked. The old site had two conflicting Instagram handles. | Confirmed profile URLs to add in `src/config/social.ts`. |
| 11 | **Company timeline dates** | /company shows: 2023 initiative, 2024–2025 product work, 2026 EduLynx live, 14 Sep 2026 incorporation. Earlier dates come from the old site. | Confirm the dates. |
| 12 | **EduLynx pricing** | Matches erp.edulynxerp.in as fetched on 26 Sep 2026 (₹35,000 / ₹75,000 one-time + 15% AMC, excl. taxes). The EduLynx site is stated as authoritative. | Re-check on launch day. |
| 13 | **Legal text** | Privacy, terms, refund, cookie and accessibility statements describe what the code does. | Review by Indian counsel (incl. DPDP Act 2023 rules). |
| 14 | **Logo master** | SVG traced from PNG. | Commission a designer-drawn vector (print/signage). |
| 15 | **Photos still needed** | Gallery shows only real photos (4). Slots for exterior, team, engineering desks and an EduLynx demo exist in config but are hidden. EduLynx screenshots section hidden. | Photos per IMAGE-REPLACEMENT.md (demo data only on screens). |
| 16 | **Corrected office images** | Only the meeting-room image was used. Three edited office images show a wrong CIN (U62013AP2024PTC119824) and address, and erase the counter banner's legal line; they are not published. | Re-edit from the original photos with the signage text left untouched — or take new photos — then send again. The counter banner still needs physical replacement (item 1). |
| 17 | **Server-room photo** | Not published. | Confirm it is an unaltered photo of equipment KrisLynx operates at the registered office, and whether an infrastructure section is wanted (it would be new content). |
| 18 | **Product posters / new products** | Not published. Posters present Miyraa and AP ExportAI (not on the site), TradeSphere as a flagship, and features beyond approved content; EduLynx appears with a different logo and tagline. | Decide which products exist publicly and their status; supply approved descriptions and official logos (EduLynx logo matching erp.edulynxerp.in). |
| 19 | **Product completion claims** | You said the products are now completed; the source still records SelfMate and FearLink as Research and has no live URLs or listings for them. Statuses unchanged; Miyraa / AP ExportAI still not published. | Provide evidence (live URL, store listing, release date) for each product you want shown as Live. |
| 20 | **Office-launch invitation image** | Not used. It reads "Powered by RKLS Group" (RKLS belongs to the retired pre-incorporation identity) and dates an office launch (22 Aug 2026) before incorporation (14 Sep 2026). | Confirm whether any RKLS Group relationship should be stated publicly; otherwise leave unpublished. |
| 21 | **dotLottie** | Not used; all motion is CSS/SVG. dotLottie requires adding `'wasm-unsafe-eval'` to the CSP. | Approve or decline that CSP change if Lottie animations are wanted. |
| 22 | **Founder visibility** | Per your instruction: not on public pages, schema, navigation, footer or sitemap; content preserved at `/company/leadership`, which is **noindex and unlinked — hidden from search engines and navigation, but not private** (anyone with the URL can open it; there is no authentication). | None — recorded for traceability. |

## Resolved
- **General enquiries email** — owner confirmed **info@krislynx.com** as the official general enquiries mailbox (26 Sep 2026). Now used on the site, footer, contact page, legal pages, assistant, Organization structured data and as the contact-form recipient and sender. founder@krislynx.com is reserved for contexts that specifically intend direct founder contact; none are published.

## Decisions recorded 27 Sep 2026
| Item | Owner decision | Result |
|---|---|---|
| Server/network room image (`ChatGPT_Image_Sep_26__2026__12_29_36_PM.png`) | **Real room in the Nandyal office; image AI-enhanced.** | Published as `krislynx-infrastructure-server-room` (+ phone crop) in homepage §08 and /office, captioned "Image enhanced for clarity." Editorial labels only — no specs or telemetry. Note: firewall/switch models are legible in the photo (low risk; owner may prefer a crop). |
| Office images with wrong CIN/address sign (`…09_46_03`, `…11_49_56`, `…11_53_06`) | **Do not crop — wait for corrected photos.** | Not used. Replace when signage is corrected or unedited originals are supplied. |
| Desk image (`…09_50_52`) | — | Not used (garbled company text on the sign). |

## Decisions recorded 27 Sep 2026 (product posters)
| Item | Owner decision | Result |
|---|---|---|
| Product posters (`ChatGPT_Image_Jul_17__…06_28_55`, `…06_35_03`, `…06_40_44` (+ duplicate `_2`)) | **Approved as visual references; unapproved products may appear only as Research/Development/Concept.** | Product **marks** cropped for FearLink, SelfMate, Miyraa, AP ExportAI (`product-*-mark`). Full posters not published: their feature lists are unapproved claims and page text must stay HTML. |
| Miyraa, AP ExportAI | Shown as **Concept** | /products only, "Idea stage — not available"; excluded from homepage, ecosystem map and structured data (test-enforced). |
| AP ExportAI name | Open | "AP" may read as an Andhra Pradesh government affiliation — confirm naming before any launch. |
| TradeSphere poster | Not used | Name still withheld (trademark concern, item 2); the internal project stays "trade classification assistant". |
| EduLynx poster | Not used | Its script "Edulynx" logo is older branding than the live product site (erp.edulynxerp.in). Supply the current EduLynx logo if wanted. |
| Logo (`WhatsApp_Image_2026-09-15_at_13_34_06.jpeg`) | Official logo | Byte-identical to the existing logo source — already the basis of every logo on the site. |
| Office images with wrong CIN/address | Still rejected | Owner's brief §24 and previous decision: do not publish. Awaiting corrected photos. |

## Decisions recorded 27 Sep 2026 (typography, photography, product labels)
| Item | Owner decision | Result |
|---|---|---|
| Display typeface | Replace the heavy geometric display face; prefer Instrument Sans | Bricolage Grotesque removed completely (files, @font-face, preload). Instrument Sans for display + body (static 400/700 — the variable file is not obtainable offline; hierarchy uses 400/700 weight contrast). Hero ~100px desktop (was 118). |
| First photograph | Main workspace first; server room later | Real workspace is now the first photograph (after the hero); server room stays in §09 Technology / Infrastructure. |
| `main_working_space_.png` | — | **Not used.** It is the AI-edited file (= `ChatGPT_Image_Sep_26__2026__09_46_03_AM.png`) whose sign shows CIN …2024PTC119824 and "331-103, Moore Pale". The **real** photo of the same room (WhatsApp original, 19 Sep 2026) shows the correct sign (CIN …PTC128241, "33/1-108, Noone Palle") — the errors were introduced by the AI edit. The real photo was professionally enhanced (white balance, levels, midtone lift, contrast, sharpening; nothing added or removed) and used instead. |
| Product status labels | Remove all public status labels; show all products | StatusBadge renders nothing; status key removed; case-file "result" shown only for the live product. Descriptions rewritten to avoid implying availability ("designed to…"); only EduLynx links to a live product site; concepts stay out of structured data (test-enforced). |
| TradeSphere | Not shown | Earlier owner instruction ("do not restore TradeSphere") + unresolved trademark concern. Confirm if it should appear, and under which name. |
| Renamed uploads | — | All 10 files in this upload are byte-identical copies of files assessed earlier (hash-verified). |
