/** Internal consistency of firebase.json, .firebaserc, Firestore rules and the functions package. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname } from "node:path";

interface Header { source: string; headers: { key: string; value: string }[] }
const fb = JSON.parse(readFileSync("firebase.json", "utf8")) as {
  hosting: { public: string; cleanUrls: boolean; trailingSlash: boolean; redirects: { source: string; destination: string; type: number }[];
    rewrites: { source: string; function: { functionId: string; region: string } }[]; headers: Header[] };
  functions: { source: string; codebase: string; runtime: string; predeploy: string[] }[];
  firestore: { rules: string; indexes: string };
};
const fnSrc = readFileSync("functions/src/index.ts", "utf8");
const fnPkg = JSON.parse(readFileSync("functions/package.json", "utf8")) as { main: string; engines: { node: string }; scripts: Record<string, string>; devDependencies: Record<string, string> };
const rootPkg = JSON.parse(readFileSync("package.json", "utf8")) as { devDependencies: Record<string, string> };
const routeFile = (p: string): string => (p === "/" ? "dist/index.html" : `dist${p}.html`);
/**
 * Case-exact file check. Firebase Hosting matches paths case-sensitively, but macOS/Windows filesystems are
 * case-insensitive, where existsSync("dist/Careers.html") is true because careers.html exists. Comparing the
 * exact directory entry makes this test evaluate paths the way Hosting does, on every OS.
 */
const existsExact = (file: string): boolean => existsSync(dirname(file)) && readdirSync(dirname(file)).includes(basename(file));

test("hosting serves dist only, clean URLs, no trailing slash", () => {
  assert.equal(fb.hosting.public, "dist");
  assert.equal(fb.hosting.cleanUrls, true);
  assert.equal(fb.hosting.trailingSlash, false);
});

test("every rewrite targets an exported function in the configured region", () => {
  const region = /region:\s*"([^"]+)"/.exec(fnSrc)?.[1];
  for (const r of fb.hosting.rewrites) {
    assert.match(fnSrc, new RegExp(`export const ${r.function.functionId}\\s*=\\s*onRequest`), r.function.functionId);
    assert.equal(r.function.region, region, `${r.source} region`);
  }
});

test("functions runtime, engines and bundle entry agree", () => {
  const f = fb.functions[0];
  assert.ok(f);
  assert.equal(f.runtime, `nodejs${fnPkg.engines.node}`);
  assert.equal(f.source, "functions");
  assert.match(fnPkg.scripts.build ?? "", new RegExp(`--outfile=${fnPkg.main.replace(".", "\\.")}`));
  assert.ok(f.predeploy.some((c) => c.includes("run build")));
  assert.equal(fnPkg.devDependencies.esbuild, rootPkg.devDependencies.esbuild, "same esbuild version in both packages");
});

test("secrets are declared via Secret Manager, never inlined", () => {
  assert.match(fnSrc, /defineSecret\("RESEND_API_KEY"\)/);
  assert.match(fnSrc, /defineSecret\("IP_HASH_SALT"\)/);
  assert.doesNotMatch(fnSrc, /re_[A-Za-z0-9]{20,}/);
  assert.doesNotMatch(readFileSync("functions/.env.example", "utf8"), /RESEND_API_KEY|IP_HASH_SALT/);
});

test("mail addresses are only confirmed ones", () => {
  // Configuration values only: strip comments (a comment explaining founder@'s reserved use is not a config value).
  const noComments = (t: string): string => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").replace(/^#.*$/gm, "");
  const all = [fnSrc, readFileSync("functions/.env.example", "utf8"), readFileSync("src/config/company.ts", "utf8")].map(noComments).join("\n");
  const found = new Set(all.match(/[A-Za-z0-9._%+-]+@krislynx\.com/g) ?? []);
  assert.deepEqual([...found], ["info@krislynx.com"], "only the owner-confirmed general mailbox");
});

test("case-exact check matches Hosting semantics", () => {
  assert.equal(existsExact("dist/careers.html"), true);
  assert.equal(existsExact("dist/Careers.html"), false, "must be false even on case-insensitive filesystems");
});

test("redirects: 301, destination exists, no chains, no shadowed real pages, no homepage dumping", () => {
  const sources = new Set(fb.hosting.redirects.map((r) => r.source));
  for (const r of fb.hosting.redirects) {
    assert.equal(r.type, 301, r.source);
    assert.ok(existsExact(routeFile(r.destination)), `${r.source} → ${r.destination} missing`);
    assert.ok(!sources.has(r.destination), `${r.source} chains via ${r.destination}`);
    if (!r.source.includes("*") && r.source !== "/index.html") assert.ok(!existsExact(routeFile(r.source)), `${r.source} shadows a real page`);
    if (r.source !== "/index.html") assert.notEqual(r.destination, "/", `${r.source} dumps to homepage`);
  }
});

test("headers: security set on every response; HTML revalidates; hashed assets immutable (later rule overrides)", () => {
  const all = fb.hosting.headers[0];
  assert.equal(all?.source, "**", "catch-all header block must be first so specific blocks override it");
  const keys = new Set(all?.headers.map((h) => h.key));
  for (const k of ["Strict-Transport-Security", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy", "Content-Security-Policy", "Cache-Control"]) assert.ok(keys.has(k), k);
  assert.match(all?.headers.find((h) => h.key === "Cache-Control")?.value ?? "", /max-age=0/);
  const assets = fb.hosting.headers.find((h) => h.source === "/assets/**");
  assert.match(assets?.headers[0]?.value ?? "", /immutable/);
  assert.ok(!fb.hosting.headers.some((h) => h.source === "**/*.html"), "*.html rule never matches clean URLs");
  const csp = all?.headers.find((h) => h.key === "Content-Security-Policy")?.value ?? "";
  assert.doesNotMatch(csp, /unsafe-inline|unsafe-eval/);
  assert.match(csp, /form-action 'self'/);
  assert.match(csp, /frame-ancestors 'none'/);
});

test("Firestore rules deny every client read and write", () => {
  assert.equal(fb.firestore.rules, "firestore.rules");
  const rules = readFileSync("firestore.rules", "utf8").replace(/\/\/.*$/gm, "");
  assert.match(rules, /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/);
  assert.doesNotMatch(rules, /if true|request\.auth != null/);
  assert.equal((rules.match(/allow /g) ?? []).length, 1, "exactly one allow statement (the deny)");
});

test(".firebaserc names a default project", () => {
  const rc = JSON.parse(readFileSync(".firebaserc", "utf8")) as { projects: { default: string } };
  assert.ok(rc.projects.default.length > 0);
});
