# HTTP/HTTPS Servers in Node.js

## What matters

- `req` and `res` are streams: data can arrive or be sent in chunks instead of all at once.
- Large bodies should be streamed, not buffered blindly into memory.
- In production, TLS is often terminated at a proxy or load balancer.

## Interview points

- Set status codes and `Content-Type` explicitly.
- Configure `requestTimeout`, `headersTimeout`, and `keepAliveTimeout` deliberately.
- Cancel downstream work when the client disconnects.
- Know that Node also supports HTTP/2, but many public APIs still sit behind an HTTP/1.1 edge proxy.

### Code examples

Set status codes and `Content-Type` explicitly:

```javascript
const http = require('http');

http
  .createServer((req, res) => {
    if (req.url === '/users' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify([{ id: 1, name: 'Ada' }]));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  })
  .listen(3000);
```

Configure `requestTimeout`, `headersTimeout`, and `keepAliveTimeout` deliberately:

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('ok');
});

// Limit how long the entire request can take.
server.requestTimeout = 15_000;

// Limit how long the client has to finish sending headers.
server.headersTimeout = 10_000;

// Limit how long to keep an idle keep-alive socket open.
server.keepAliveTimeout = 5_000;

server.listen(3000);
```

Cancel downstream work when the client disconnects:

```javascript
const http = require('http');

const server = http.createServer(async (req, res) => {
  const controller = new AbortController();

  req.on('close', () => {
    if (!res.writableEnded) controller.abort();
  });

  try {
    const response = await fetch('https://api.example.com/report', {
      signal: controller.signal,
    });

    const body = await response.text();
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(body);
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Upstream request failed');
  }
});

server.listen(3000);
```

## Senior notes

- Timeouts and body limits are part of security, not just performance.
- A `/health` endpoint is not enough; readiness and graceful shutdown matter too.
- Treat server defaults as something to review, not trust blindly.

## Example

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});
```
