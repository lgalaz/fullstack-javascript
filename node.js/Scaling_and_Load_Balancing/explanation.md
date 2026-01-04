# Scaling and Load Balancing

## Introduction

Node.js scales well with I/O, but real systems need horizontal scaling, stateless services, and externalized state. Scaling is as much architecture as it is code.

## Key Concepts

- Stateless services allow easy horizontal scaling.
- Load balancers distribute traffic across instances.
- Sticky sessions should be avoided unless required.

## Example: Stateless Service

```javascript
// stateless.js
const http = require('http');

const server = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ pid: process.pid }));
});

server.listen(3000);
```

## Practical Guidance

- Store sessions in a shared store (Redis) if you need session state.
- Use a reverse proxy (NGINX, ELB) for load balancing.
- Implement health checks and auto-scaling rules.
- Avoid per-instance caches unless they are strictly optional.
