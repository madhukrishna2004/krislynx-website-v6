# V2 motion system

**Rule:** motion must communicate structure, state, relationship, progression or interaction — otherwise it is removed.

| Token | Value | Used for |
|---|---|---|
| --m-micro | 160ms | hover, focus, arrows |
| --m-ui | 320ms | tabs, nodes, borders |
| --m-section | 700ms | section settles |
| --m-large | 1000ms | diagram draw-in, photo unmask |
| --ease-out-kx | cubic-bezier(.2,.7,.2,1) | all of the above |

| Category | Behaviour |
|---|---|
| A · Entrance (text) | opacity settle only — **no translateY** (the generic "AI site" fade-up is banned by test) |
| B · Continuity | blended room seams; continuity line; smooth anchor scrolling with header offset |
| C · Interaction | node dim/brighten, product mark/arrow response, service & lifecycle steps light progress |
| D · System state | diagrams draw in left→right (clip-path) when they enter — the system "comes online" |
| E · Navigation | header state changes (top / scrolled / product-aware) |
| F · Media | photographs unmask upward with a 1.035→1 depth settle |

**Reduced motion:** every entrance, continuous and smooth-scroll rule sits inside
`@media (prefers-reduced-motion: no-preference)`; with reduce, content is simply present and state changes still work.
No animation libraries; CSS + SVG + small vanilla TS. `:has()` drives the diagram variant (browsers without it fall
back to the opacity settle).
