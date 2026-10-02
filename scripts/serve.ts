/**
 * Local production preview with Firebase Hosting semantics:
 * clean URLs (/company → company.html), redirects from firebase.json,
 * 404.html fallback, and the security headers declared in firebase.json.
 * /api/contact and /api/assistant are answered by local mocks so forms can be
 * exercised without deploying functions (set KX_MOCK_FAIL=1 to test errors).
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const DIST = "dist";
const PORT = Number(process.env.PORT ?? 4173);
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain", ".webmanifest": "application/manifest+json",
};

interface HostingConfig {
  redirects?: { source: string; destination: string; type: number }[];
  headers?: { source: string; headers: { key: string; value: string }[] }[];
}

async function exists(p: string): Promise<boolean> {
  try { return (await stat(p)).isFile(); } catch { return false; }
}

const globToRegex = (glob: string): RegExp =>
  new RegExp("^" + glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "§").replace(/\*/g, "[^/]*").replace(/§/g, ".*") + "$");

async function main(): Promise<void> {
  const cfg = JSON.parse(await readFile("firebase.json", "utf8")) as { hosting: HostingConfig };
  const hosting = cfg.hosting;
  createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    let path = decodeURIComponent(url.pathname);

    if (path.startsWith("/api/")) {
      let body = "";
      for await (const chunk of req) body += chunk;
      const fail = process.env.KX_MOCK_FAIL === "1";
      res.writeHead(fail ? 500 : 200, { "content-type": "application/json" });
      res.end(JSON.stringify(fail ? { ok: false, error: "mock_failure" } : { ok: true, id: "local-mock", received: body.length }));
      return;
    }

    for (const r of hosting.redirects ?? []) {
      if (globToRegex(r.source).test(path)) {
        res.writeHead(r.type, { location: r.destination });
        res.end();
        return;
      }
    }
    if (path.length > 1 && path.endsWith("/")) {
      res.writeHead(301, { location: path.slice(0, -1) + url.search });
      res.end();
      return;
    }

    const headers: Record<string, string> = {};
    for (const h of hosting.headers ?? []) {
      if (globToRegex(h.source).test(path)) for (const kv of h.headers) headers[kv.key] = kv.value;
    }

    path = normalize(path).replace(/^(\.\.[/\\])+/, "");
    const candidates = path === "/" ? ["index.html"] : [path.slice(1), `${path.slice(1)}.html`];
    for (const c of candidates) {
      const file = join(DIST, c);
      if (await exists(file)) {
        res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", ...headers });
        res.end(await readFile(file));
        return;
      }
    }
    res.writeHead(404, { "content-type": TYPES[".html"], ...headers });
    res.end(await readFile(join(DIST, "404.html")).catch(() => "Not found"));
  }).listen(PORT, () => console.log(`Serving ${DIST} on http://localhost:${PORT}`));
}

main().catch((e: unknown) => { console.error(e); process.exit(1); });
