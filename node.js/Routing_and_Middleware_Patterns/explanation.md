# Routing and Middleware Patterns

## Introduction

Node's core `http` module is low-level. A common pattern is to build a router and middleware pipeline to compose request handling cleanly.

## What Middleware Does

- Middleware is a function `(req, res, next)`.
- It can read/modify the request, end the response, or pass control to the next middleware.
- This pattern enables logging, auth, parsing, and routing without tight coupling.

## Example: Minimal Router + Middleware

```javascript
// mini-framework.js
const http = require('http');

const middlewares = [];
const routes = [];

function use(fn) {
  middlewares.push(fn);
}

function route(method, path, handler) {
  routes.push({ method, path, handler });
}

function runMiddlewares(req, res, done) {
  let index = 0;
  function next(err) {
    if (err) {
      res.writeHead(500);
      res.end('Internal Server Error');
      return;
    }
    const mw = middlewares[index++];
    if (!mw) return done();
    mw(req, res, next);
  }
  next();
}

const server = http.createServer((req, res) => {
  runMiddlewares(req, res, () => {
    const match = routes.find(r => r.method === req.method && r.path === req.url);
    if (match) {
      return match.handler(req, res);
    }
    res.writeHead(404);
    res.end('Not found');
  });
});

use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

route('GET', '/health', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(3000);
```

## Practical Guidance

- Prefer established frameworks for production, but understand the pattern.
- Keep middleware small and focused.
- Ensure errors propagate in a consistent way.
