# V3 UX audit (27 Sep 2026)
| Finding | Fix |
|---|---|
| Palette read as generic "dark SaaS + cyan" | V3 semantic palette (V3-COLOR-SYSTEM) |
| Assistant looked like a generic chat widget; same prompts everywhere | KX Assistant redesign; page-aware prompts; sources; CTAs |
| 5 page-relevant questions had no approved answer | 5 entries generated from site config |
| New triggers opened a prompt-injection match (found by existing test) | triggers strengthened; new guard test |
| Assistant prompts crowded answers once a conversation started | prompts collapse to one scrollable row |
| Headline appeared as a static block | line-by-line system reveal |
| Contact success was a static message | textual completion sequence |
| Design values scattered | radius/border/shadow/z-index/width tokens centralised |
Not done: Lottie (V3-LOTTIE), Safari/Firefox/real devices (not available here), live-domain checks (not deployed).
