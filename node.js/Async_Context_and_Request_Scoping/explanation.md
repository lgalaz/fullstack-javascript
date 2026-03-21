# Async Context and Request Scoping

## What matters

- `AsyncLocalStorage` keeps request-scoped metadata across async boundaries, instead of forcing you to thread values like `requestId` manually through every function.

## Interview points

- Use it for correlation IDs, tenant info, auth context, and tracing metadata.
- Initialize it at the outer boundary: HTTP request, job consumer, CLI command.
- Keep context small and avoid hiding core business inputs inside it.

## Example

Without `AsyncLocalStorage`, you often end up threading `requestId` manually through each function:

```javascript
const http = require('http');
const { randomUUID } = require('crypto');

function log(message, requestId) {
  console.log({ requestId, message });
}

async function loadUser(userId, requestId) {
  log(`loading user ${userId}`, requestId);
  await Promise.resolve();
  log(`loaded user ${userId}`, requestId);
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/users/123') {
    const requestId = req.headers['x-request-id'] || randomUUID();
    await loadUser('123', requestId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, requestId }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(3000);
```

With `AsyncLocalStorage`, you set the context once at the request boundary and read it later inside the same async flow:

```javascript
const http = require('http');
const { randomUUID } = require('crypto');
const { AsyncLocalStorage } = require('async_hooks');

const requestContext = new AsyncLocalStorage();

function log(message) {
  const store = requestContext.getStore();
  console.log({
    requestId: store?.requestId,
    message,
  });
}

async function loadUser(userId) {
  log(`loading user ${userId}`);
  await Promise.resolve();
  log(`loaded user ${userId}`);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users/123') {
    const requestId = req.headers['x-request-id'] || randomUUID();

    // Initialize context at the outer boundary and keep it small.
    requestContext.run({ requestId }, async () => {
      await loadUser('123');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, requestId }));
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(3000);
```

## Senior notes

- It solves a real operational problem: consistent logging and tracing without threading IDs through every function.
