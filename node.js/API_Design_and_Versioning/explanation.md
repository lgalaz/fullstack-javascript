# API Design and Versioning

## Introduction

Designing APIs involves consistency, explicit contracts, and backward compatibility. Versioning helps you evolve APIs without breaking clients.

## Principles

- Use predictable resource naming and HTTP methods.
- Be explicit about errors and status codes.
- Support pagination, filtering, and sorting.

## Example: Versioned HTTP API

This example exposes the same resource in two versions. v1 returns an array, v2 returns a wrapper object to demonstrate a breaking response change.

```javascript
// api-server.js
const http = require('http');

const users = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Grace' },
];

const server = http.createServer((req, res) => {
  if (req.url === '/v1/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  }

  if (req.url === '/v2/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
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

```javascript
// pagination.js
function paginate(items, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

console.log(paginate([1, 2, 3, 4, 5], 2, 2));
```

## Practical Guidance

- Prefer additive changes (new fields) over breaking changes.
- Version at the URL or via headers; document the approach.
- Keep error shapes consistent across endpoints.
