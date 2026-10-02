/** Hashed asset URLs, filled in by scripts/build.tsx before pages render. */
export const assets = {
  css: "/assets/site.css",
  js: "/assets/app.js",
  /** GA4 measurement ID from env KX_GA_ID; empty disables analytics entirely */
  gaId: "",
  buildDate: new Date().toISOString().slice(0, 10),
};
