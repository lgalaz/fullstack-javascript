# API Design and Versioning

## Introduction

Designing APIs involves consistency, explicit contracts, and backward compatibility. Versioning helps you evolve APIs without breaking clients.

## Principles

- Use predictable resource naming and HTTP methods so clients and tools can infer behavior from standard REST conventions.
- Be explicit about errors and status codes.
- Support pagination, filtering, and sorting.

## Example: Versioned HTTP API

This example exposes the same resource in two versions. v1 returns an array, v2 returns a wrapper object to demonstrate a breaking response change.

```javascript
// api-server.js
const http = require('http');

// Demo data source: in-memory array for clarity.
// In a real service, fetch this from a database or another backend:
// e.g., const users = await db.fetchUsers() or an HTTP call to a user service.
const users = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Grace' },
];

const server = http.createServer((req, res) => {
  if (req.url === '/v1/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // v1 response uses the raw list returned by the data source.
    res.end(JSON.stringify(users));
    return;
  }

  if (req.url === '/v2/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    // v2 wraps the same data source to add metadata like count.
    res.end(JSON.stringify({ data: users, count: users.length }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3000);
```

## Pagination Example

Pagination limits response size and supports large datasets. This simple helper slices an array to show the concept.

Node.js core doesn’t include pagination helpers—offset/cursor pagination is handled in your data layer (SQL LIMIT/OFFSET, keyset queries) or via framework utilities.

```javascript
// pagination.js
function paginate(items, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;

  return items.slice(start, start + pageSize);
}

console.log(paginate([1, 2, 3, 4, 5], 2, 2));
```

## Rate Limiting

Rate limiting protects APIs from abuse and helps keep latency predictable. In most Node.js frameworks, you configure this with middleware (for example, `express-rate-limit` or `@fastify/rate-limit`) and a shared store like Redis for multi-instance deployments.

Below is a bare Node.js implementation using a fixed window per IP address. This is intentionally simple and best suited for single-instance demos; in production you would use a shared store.

```javascript
// rate-limit.js
const http = require('http');

const windowMs = 60_000; // 1 minute
const maxRequests = 10;  // max requests per window per IP
const buckets = new Map();

function isAllowed(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now - bucket.start >= windowMs) {
    buckets.set(ip, { start: now, count: 1 });
    return true;
  }

  if (bucket.count < maxRequests) {
    bucket.count += 1;
    return true;
  }

  return false;
}

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress || 'unknown';

  if (!isAllowed(ip)) {
    res.writeHead(429, { 'Content-Type': 'text/plain' });
    res.end('Too Many Requests');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(3000);
```

## Practical Guidance

- Prefer additive changes (new fields) over breaking changes.
- Version at the URL or via headers; document the approach.
- Keep error shapes consistent across endpoints.
