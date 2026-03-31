/**
 * Production entry point — fully static.
 * Serves the built Vite frontend from frontend/dist on PORT (Railway injects this).
 */

import path from "path";

const PORT = parseInt(process.env.PORT ?? "8080", 10);
const DIST_DIR = path.resolve(import.meta.dir, "frontend/dist");

const server = Bun.serve({
  port: PORT,
  idleTimeout: 60,
  async fetch(req) {
    const url = new URL(req.url);

    // Try to serve the file directly
    const filePath = path.join(DIST_DIR, url.pathname);
    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file);
    }

    // SPA fallback — all routes serve index.html
    const index = Bun.file(path.join(DIST_DIR, "index.html"));
    if (await index.exists()) {
      return new Response(index, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[PROD] Static server listening on port ${PORT}`);

const stop = async () => {
  await server.stop();
  process.exit(0);
};

process.on("SIGTERM", stop);
process.on("SIGINT", stop);
