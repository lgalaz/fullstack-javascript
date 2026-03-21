# Security Best Practices in Node.js

## What matters

- Validate input at the boundary.
- Protect secrets and dependencies.
- Put limits on what one request can consume: body size, execution time, upload size, query size, and downstream resource usage should all be bounded so one client cannot monopolize the service.

## Interview points

- Know common Node risks: injection, SSRF, path traversal, prototype pollution, unsafe deserialization, and DoS through large bodies or slow requests. SSRF means tricking your server into making attacker-chosen outbound requests.
- Use secure headers, TLS, rate limiting, body limits, and timeouts.
- Treat outbound requests as an attack surface too.

```js
const express = require('express');
const http = require('http');

const app = express();

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

app.use((req, res, next) => {
  req.setTimeout(5_000);
  next();
});

app.get('/search', (req, res) => {
  const requestedLimit = Number(req.query.limit) || 20;
  const limit = Math.min(requestedLimit, 100);
  res.json({ limit });
});

const server = http.createServer(app);
server.headersTimeout = 10_000;
server.requestTimeout = 15_000;

server.listen(3000);
```

- This config limits JSON and form body size, caps request duration, bounds a query parameter, and prevents headers or full requests from hanging forever.

## Senior notes

- Most security failures are design or operational failures, not just missing regexes.
- Examples:
- Design failure: the API checks whether a user is logged in, but does not verify whether that user is allowed to access a specific account or record.
- Design failure: the server accepts arbitrary URLs for “fetch this image” functionality, which turns into SSRF because internal network targets were never restricted.
- Operational failure: secrets are stored in `.env` files committed to the repo or exposed in logs, CI output, or crash reports.
- Operational failure: dependencies are outdated or compromised, and lockfile changes are merged without review.
- Operational failure: production runs without rate limiting, request size limits, or timeouts, so one client can degrade availability for everyone else.
- Minimize dependencies and review lockfile changes.
- Never trust auth alone; enforce authorization and input validation separately.
