# Authentication and Authorization

## Introduction

Authentication answers "who are you?" Authorization answers "what can you do?" Node.js services must handle both explicitly to avoid security gaps.

## Common Approaches

- Session-based auth with secure cookies.
- Token-based auth (JWT) for APIs and mobile clients.
- Role-based or scope-based authorization.

## Example: JWT Authentication

This example issues a JWT on `/login` and protects `/admin` with a middleware that validates the token and checks the user's role.

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

- Prefer short-lived access tokens and rotate refresh tokens (short-lived tokens limit damage if leaked; refresh tokens should be stored securely, rotated on use, and revoked on suspicious activity).
- Store secrets securely and rotate them (use a secrets manager or env vars, never commit to code, and plan regular key rotation with minimal downtime).
- Always check authorization in addition to authentication (who you are is different from what you can do; enforce roles/scopes at every protected endpoint).
- Choose token-based auth for APIs and session cookies for browser apps (cookies can be `HttpOnly`/`Secure`/`SameSite`, while API tokens suit mobile and service-to-service calls where one backend talks to another).
- Validate token claims on every request (issuer, audience, expiration, and required scopes/roles; reject tokens with missing or unexpected claims).
- Implement logout and revocation (track refresh tokens or session IDs so you can revoke access when a user is disabled or a token is compromised).
- Add rate limiting and MFA for high-risk actions (credential stuffing and account takeover are common real-world incidents; these controls reduce blast radius).
- Log auth events (login, logout, failures, and permission denials) for auditing and incident response.
