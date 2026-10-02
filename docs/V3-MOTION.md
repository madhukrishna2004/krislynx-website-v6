# V3 motion
Tokens: micro 160ms · ui 320ms · section 700ms · large 1000ms · one easing family. Categories and the V2 motion system
(docs/V2-MOTION-SYSTEM.md) remain. V3 adds: hero line reveal · assistant open (320ms, from its launcher) · assistant
prompts collapse once a conversation starts · contact completion sequence (Request received → Routed to the team →
We'll reply; ~1.1s, textual so it reads the same without motion) · architecture dependency signal (V2.1).
Everything is CSS/SVG + small vanilla TS, inside `prefers-reduced-motion: no-preference`; e2e proves 0 running
animations and 0 hidden content under reduced motion.
