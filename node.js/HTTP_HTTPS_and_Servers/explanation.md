# HTTP/HTTPS Servers in Node.js

## Introduction

Node.js includes a built-in HTTP server. Understanding request/response streaming, headers, and keep-alive behavior is crucial for building reliable APIs.

## Example: Basic HTTP Server

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

## HTTPS (TLS)

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
