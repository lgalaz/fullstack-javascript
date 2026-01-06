# Security Best Practices in Node.js

## Introduction

Node.js security is not just about code; it is about dependencies, input validation, and safe runtime configuration. Senior engineers design systems assuming malicious input and compromised clients.

## Key Areas

- Input validation and output encoding
- Dependency auditing
- Secrets management
- TLS and secure headers
- Avoiding prototype pollution and deserialization attacks

## Example: Validate Input and Escape Output

Validation happens at the boundary of your system. This example shows a simple whitelist for usernames to block unexpected input early.

```javascript
// validate.js
function isValidUsername(value) {
  return typeof value === 'string' && /^[a-z0-9_]{3,20}$/i.test(value);
}

function renderUser(username) {
  if (!isValidUsername(username)) {
    throw new Error('Invalid username');
  }
  return `Hello, ${username}`;
}

console.log(renderUser('alice_01'));
```

## Example: Using Helmet (HTTP Security Headers)

Helmet is middleware that sets security-related HTTP headers. This example applies it manually in a low-level HTTP server.

Install dependency:

```
npm install helmet
```

```javascript
const http = require('http');
const helmet = require('helmet');

const server = http.createServer((req, res) => {
  const apply = helmet();
  apply(req, res, () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('secure headers set');
  });
});

server.listen(3000);
```

## Dependency Hygiene

- Run `npm audit` and keep dependencies updated.
- Pin versions with lockfiles and review transitive updates.
- Prefer minimal dependencies and audited libraries.

## Practical Guidance

- Validate all user input at the boundary.
- Never store secrets in code; use env or a secrets manager.
- Terminate TLS at the edge and use HTTPS everywhere.
