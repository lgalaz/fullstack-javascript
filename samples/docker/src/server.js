const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 3000);
const dataDir = process.env.DATA_DIR || "/data";
const hitsFile = path.join(dataDir, "hits.json");

function ensureState() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(hitsFile)) {
    fs.writeFileSync(hitsFile, JSON.stringify({ hits: 0 }, null, 2));
  }
}

function readState() {
  ensureState();
  return JSON.parse(fs.readFileSync(hitsFile, "utf8"));
}

function writeState(state) {
  fs.writeFileSync(hitsFile, JSON.stringify(state, null, 2));
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "GET" && url === "/") {
    sendJson(res, 200, {
      message: "Docker tutorial sample",
      routes: ["GET /hits", "POST /reset", "GET /env", "GET /health"],
    });
    return;
  }

  if (method === "GET" && url === "/hits") {
    const state = readState();
    state.hits += 1;
    writeState(state);
    sendJson(res, 200, { hits: state.hits, persistedTo: hitsFile });
    return;
  }

  if (method === "POST" && url === "/reset") {
    const state = { hits: 0 };
    writeState(state);
    sendJson(res, 200, { ok: true, hits: state.hits });
    return;
  }

  if (method === "GET" && url === "/env") {
    sendJson(res, 200, {
      node: process.version,
      port: PORT,
      dataDir,
      pid: process.pid,
    });
    return;
  }

  if (method === "GET" && url === "/health") {
    sendJson(res, 200, { ok: true });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
