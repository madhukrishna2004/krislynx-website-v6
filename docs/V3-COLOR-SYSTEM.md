# V3 colour system
| Role | Value | Token |
|---|---|---|
| Ink · Deep Graphite · Graphite · Soft Graphite | #0A0D0C · #121614 · #1B211E · #2A312D | --bg · --bg-2 · --surface · --surface-3 |
| Warm Paper · Soft White · Cool Paper | #F4F1EA · #FAF9F6 · #F1F5F4 | --room-warm · --white · --paper |
| Kris Mint · Ice Blue · Soft Lavender · Warm Sand | #B9F2D0 · #DCEEFF · #E8E1FF · #EADCC8 | --mint/--cyan · --ice/--blue · --lilac/--violet · --peach |
| Text primary/secondary on light | #101411 · #56615B | --text · --text-2/-3 |
| Text primary/secondary on dark | #F5F7F5 · #AAB5AE | --text-hi · --muted |

**Semantics:** graphite = systems · warm paper = company/human · mint = products/operations · ice = data/infrastructure
· lavender = intelligence · sand = people/environment. **Decision:** accent colours at full strength mark state and
emphasis; *room backgrounds* are tints of each accent mixed into Soft White (mint room #E4F6EB, ice room #EAF3FD,
lavender room #F0ECFD) so large areas stay calm. Accent inks for text on tinted rooms: #1E6B45 (mint), #2A5A86 (ice),
#5B4BB8 (lavender). Links on light surfaces use primary ink (#101411). Focus ring on light: #1E6B45; on dark: Kris Mint.
All 24 foreground/background pairings are contrast-tested (WCAG AA text 4.5:1, UI 3:1).
