# Routing and Middleware Patterns

## What matters

- Middleware is request pipeline composition: logging, auth, parsing, validation, error handling. A pipeline means each step can inspect the request, do work, and pass control onward.
- The common shape is `(req, res, next)`.
- Frameworks differ in syntax, but the core pattern is the same.

## Interview points

- Keep middleware focused and ordered intentionally.
- Validate early, authorize before business logic, and centralize error handling.
- Avoid hidden side effects on `req` and `res` that make flow hard to reason about.

```js
function lookupUser(token) {
  if (token === 'admin-token') return { name: 'Ada', role: 'admin' };
  return { name: 'Sam', role: 'user' };
}

// Hard to reason about: later handlers depend on req fields that appeared
// earlier as side effects.
function loadUser(req, res, next) {
  req.user = lookupUser(req.headers.authorization);
  req.isAdmin = req.user.role === 'admin';
  next();
}

function dashboardHandler(req, res) {
  if (req.isAdmin) {
    res.end(`welcome admin ${req.user.name}`);
    return;
  }

  res.end(`welcome user ${req.user.name}`);
}

// Request flow:
// app.use(loadUser)
// app.get('/dashboard', dashboardHandler)

// Clearer: put auth-related data in one explicit place with one contract.
function loadAuthContext(req, res, next) {
  const user = lookupUser(req.headers.authorization);
  req.auth = {
    user,
    isAdmin: user.role === 'admin',
  };
  next();
}

function dashboardHandlerV2(req, res) {
  if (req.auth.isAdmin) {
    res.end(`welcome admin ${req.auth.user.name}`);
    return;
  }

  res.end(`welcome user ${req.auth.user.name}`);
}

// Request flow:
// app.use(loadAuthContext)
// app.get('/dashboard', dashboardHandlerV2)
```

## Senior notes

- Prefer established frameworks in production.
- Examples of what frameworks usually get right in production:
- Execution order and `next()` behavior: one middleware forgets to call `next()`, so some requests hang forever; another calls `next()` after already sending a response, so later middleware runs unexpectedly.
- Async error propagation: an `await`ed DB call rejects inside middleware and the error never reaches centralized error handling, causing unhandled rejections or stuck requests.
- Body parsing limits and malformed input handling: a client sends a 50 MB JSON body or broken JSON, and the server burns memory or crashes instead of rejecting the request cleanly with a 4xx error.
- Route matching edge cases: `/users/:id` accidentally catches `/users/me`, or `/users/` redirects to `/users` because trailing slash handling differs across frameworks, proxies, or environments.
- Response lifecycle issues like double sends: one middleware sends `401`, but downstream code still tries `res.end()` again, causing `ERR_HTTP_HEADERS_SENT` and noisy logs.
- Ecosystem support for auth, validation, logging, and security middleware: custom auth misses token expiry checks, custom validation returns inconsistent errors, logging omits request IDs, or basic protections like rate limiting and security headers are forgotten.
- The value of understanding middleware is debugging execution order, short-circuiting, and error propagation.

## Example

```javascript
function authMiddleware(req, res, next) {
  if (!req.headers.authorization) {
    res.writeHead(401);
    res.end('Unauthorized');
    return;
  }

  next();
}
```
