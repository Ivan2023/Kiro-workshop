// Tiny static-file server + Bored API proxy.
//
// The Bored API (https://bored-api.appbrewery.com) does not send CORS headers,
// so a browser can't fetch it directly from a web page ("Failed to fetch").
// This server serves the front-end AND forwards /api/* requests to the Bored
// API from the server side (where CORS doesn't apply), then returns the JSON.
//
// Run with:  node server.js   then open http://localhost:3000
//
// Requires Node 18+ (uses the built-in global fetch). No npm install needed.

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const UPSTREAM = "https://bored-api.appbrewery.com";
const ROOT = __dirname;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(typeof body === "string" ? body : JSON.stringify(body));
}

async function handleApi(req, res, url) {
  // Map /api/random -> /random, /api/filter?... -> /filter?...
  const upstreamPath = url.pathname.replace(/^\/api/, "") || "/";
  const target = UPSTREAM + upstreamPath + (url.search || "");
  try {
    const upstreamRes = await fetch(target, {
      headers: { Accept: "application/json" },
    });
    const text = await upstreamRes.text();
    res.writeHead(upstreamRes.status, {
      "Content-Type": "application/json; charset=utf-8",
    });
    res.end(text);
  } catch (err) {
    sendJson(res, 502, { error: "Upstream request failed: " + err.message });
  }
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";

  // Prevent path traversal; resolve inside ROOT only.
  const filePath = path.join(ROOT, path.normalize(pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith("/api/")) {
    return handleApi(req, res, url);
  }
  serveStatic(req, res, url);
});

server.listen(PORT, () => {
  console.log(`Activity Suggester running at http://localhost:${PORT}`);
});
