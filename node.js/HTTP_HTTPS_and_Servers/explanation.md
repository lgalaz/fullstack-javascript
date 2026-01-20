# HTTP/HTTPS Servers in Node.js

## Introduction

Node.js includes a built-in HTTP server. Understanding request/response streaming, headers, and keep-alive behavior is crucial for building reliable APIs.

## Example: Basic HTTP Server

This server handles two routes and writes explicit status codes and headers. The request handler runs for every connection, so keep it fast and non-blocking.

```javascript
// server.js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
```

## Reading Request Bodies

Incoming request bodies are streams. You need to collect chunks or stream them directly to a destination (file, parser, etc.).

```javascript
// echo.js
const http = require('http');

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: body }));
  });
});

server.listen(3001);
```

## HTTP Early Hints (103)

Early Hints is an interim response that sends `Link` headers (preload/preconnect) before the final response. This lets the browser start fetching critical CSS/JS while your server is still rendering or querying the database, improving perceived load times.

Node supports this in core with `res.writeEarlyHints()`:

```javascript
const http = require('http');

http.createServer((req, res) => {
  res.writeEarlyHints({
    link: [
      '</assets/app.css>; rel=preload; as=style',
      '</assets/app.js>; rel=preload; as=script',
    ],
  });

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<html>...</html>');
}).listen(3000);
```

## HTTPS (TLS)

HTTPS wraps HTTP in TLS. In production you usually terminate TLS at a load balancer, but the built-in server is useful for local testing and internal services.

```javascript
// https-server.js
const https = require('https');
const fs = require('fs');

const server = https.createServer(
  {
    key: fs.readFileSync('./certs/server.key'),
    cert: fs.readFileSync('./certs/server.crt'),
  },
  (req, res) => {
    res.writeHead(200);
    res.end('secure');
  }
);

server.listen(3443);
```

## Practical Guidance

- Set `Content-Type` and status codes explicitly.
- Treat request and response as streams for large bodies.
- Use HTTPS in production and terminate TLS at a load balancer if needed.
