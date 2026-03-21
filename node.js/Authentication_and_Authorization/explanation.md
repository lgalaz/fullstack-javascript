# Authentication and Authorization

## What matters

- Authentication is identity.
- Authorization is permission.
- They are separate checks.

## Interview points

- Browser apps often use secure cookies; APIs often use bearer tokens.
- Short-lived access tokens and refresh-token rotation are common.
- Always validate claims such as expiry, issuer, audience, role, or scope.
- Enforce authorization at every protected boundary, not just at login.

## Senior notes

- JWT is a transport format, not a security strategy.
- Revocation, MFA, rate limiting, and audit logging matter in real systems.

## Example

```javascript
function requireAdmin(req, res, next) {
  if (!req.user) {
    res.writeHead(401);
    res.end('Unauthenticated');
    return;
  }

  if (req.user.role !== 'admin') {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  next();
}
```
