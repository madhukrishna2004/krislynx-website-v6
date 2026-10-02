# V3.0.0 release
Tests 280/280 · e2e 37/37 + 38/38 · release audit pass · 30 routes × 10 widths (320–1920) no overflow/console errors.
Preserved byte-for-byte from the owner's repository: .firebaserc, firebase.json, .github/workflows/deploy.yml,
package-lock.json. Still required before launch: functions/package-lock.json (`npm install` in functions/),
`npm run audit:deps` (needs internet), Safari/Firefox/real-device testing, deployment, `npm run audit:domain`,
`KX_BASE=https://krislynx.com npm run audit:release`, `npm run test:live-contact`, Search Console.
