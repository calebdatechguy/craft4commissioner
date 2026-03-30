/**
 * Production entry point.
 * - Starts the zynapse backend on port 3000 (internal)
 * - Serves the built Vite frontend statically + proxies /_api to the backend
 * - Listens on PORT env var (Railway injects this automatically)
 */

import path from "path";

const BACKEND_PORT = 3000;
const FRONTEND_PORT = parseInt(process.env.PORT ?? "8080", 10);
const DIST_DIR = path.resolve(import.meta.dir, "frontend/dist");

// --- Start backend in a subprocess ---
const backendProcess = Bun.spawn({
  cmd: [process.execPath, "run", "src/server/index.ts"],
  cwd: path.resolve(import.meta.dir, "backend"),
  stdout: "inherit",
  stderr: "inherit",
  env: {
    ...process.env,
    PORT: String(BACKEND_PORT),
  },
});

console.log(`[PROD] Backend starting on port ${BACKEND_PORT} (PID ${backendProcess.pid})`);

// Give the backend a moment to boot before accepting traffic
await new Promise((r) => setTimeout(r, 1500));

// --- Frontend static file server + /_api proxy ---
const server = Bun.serve({
  port: FRONTEND_PORT,
  idleTimeout: 60,
  async fetch(req) {
    const url = new URL(req.url);

    // Proxy all /_api/* requests to the backend
    if (url.pathname.startsWith("/_api")) {
      const backendURL = `http://localhost:${BACKEND_PORT}${url.pathname}${url.search}`;
      const proxyReq = new Request(backendURL, {
        method: req.method,
        headers: req.headers,
        body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
      });
      try {
        return await fetch(proxyReq);
      } catch (e) {
        console.error("[PROD] Proxy error:", e);
        return new Response("Bad Gateway", { status: 502 });
      }
    }

    // Serve static files from frontend/dist
    const filePath = path.join(DIST_DIR, url.pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    // SPA fallback — serve index.html for client-side routes
    const index = Bun.file(path.join(DIST_DIR, "index.html"));
    if (await index.exists()) {
      return new Response(index, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[PROD] Frontend server listening on port ${FRONTEND_PORT}`);

const stop = async () => {
  await server.stop();
  backendProcess.kill("SIGINT");
  await backendProcess.exited;
  process.exit(0);
};

process.on("SIGTERM", stop);
process.on("SIGINT", stop);
