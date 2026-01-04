# Authentication and Authorization

## Introduction

Authentication answers "who are you?" Authorization answers "what can you do?" Node.js services must handle both explicitly to avoid security gaps.

## Common Approaches

- Session-based auth with secure cookies.
- Token-based auth (JWT) for APIs and mobile clients.
- Role-based or scope-based authorization.

## Example: JWT Authentication

Install dependency:

```
npm install jsonwebtoken
```

```javascript
// auth.js
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-secret';

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.writeHead(401);
    res.end('Missing token');
    return;
  }

  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.writeHead(401);
    res.end('Invalid token');
  }
}

module.exports = { signToken, authMiddleware };
```

```javascript
// server.js
const http = require('http');
const { signToken, authMiddleware } = require('./auth');

const server = http.createServer((req, res) => {
  if (req.url === '/login') {
    const token = signToken({ id: 'user-123', role: 'admin' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token }));
    return;
  }

  if (req.url === '/admin') {
    authMiddleware(req, res, () => {
      if (req.user.role !== 'admin') {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      res.writeHead(200);
      res.end('Welcome admin');
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(3000);
```

## Practical Guidance

- Use short-lived access tokens and refresh tokens when needed.
- Store secrets securely and rotate them.
- Always check authorization in addition to authentication.
