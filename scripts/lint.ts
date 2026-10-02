/**
 * Project lint rules (no ESLint available offline; these are the rules that matter here).
 *  - no `any` types
 *  - no console.log in shipped code (src/, functions/src)
 *  - no inline style attributes / innerHTML with dynamic data in client code
 *  - no hard-coded secrets (API-key-like strings)
 *  - no http:// links in content (except localhost)
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (f === "node_modules" || f === "lib" || f === "generated") return [];
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(p) ? [p] : [];
  });

const files = [...walk("src"), ...walk("functions/src"), ...walk("scripts"), ...walk("tests")].filter((f) => !f.endsWith("scripts/lint.ts"));
const problems: string[] = [];
for (const f of files) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    const at = `${f}:${i + 1}`;
    const code = line.replace(/\/\/.*$/, "");
    if (/(:\s*any\b|as any\b|<any>)/.test(code)) problems.push(`${at} uses 'any'`);
    if ((f.startsWith("src") || f.startsWith("functions")) && /console\.log\(/.test(code)) problems.push(`${at} console.log in shipped code`);
    if (f.startsWith("src") && /\sstyle=/.test(code)) problems.push(`${at} inline style attribute (CSP)`);
    if (f.startsWith("src/client") && /innerHTML\s*=\s*[^'"]/.test(code)) problems.push(`${at} innerHTML with dynamic value`);
    if (/(sk|re|pk)_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}/.test(code)) problems.push(`${at} looks like a secret`);
    if (f.startsWith("src/config") && /http:\/\/(?!localhost)/.test(code)) problems.push(`${at} insecure http:// link`);
  });
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`✓ lint: ${files.length} files clean`);
