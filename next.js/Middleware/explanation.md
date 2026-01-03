# Middleware 

## Introduction

Middleware runs before a request is handled by your route. It can rewrite, redirect, or set headers. It is best for lightweight checks, not heavy data fetching.

## Basic Middleware

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Clone because nextUrl is a readonly, mutable request helper.
  const url = request.nextUrl.clone();
  // We expect an auth cookie to be set after login by your auth flow.
  if (!request.cookies.get('auth')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
```

Note: Next.js supports a single `middleware.ts|js` at the project root (or `src/middleware.ts`). If you have multiple concerns, keep helper functions in separate files (e.g., `src/middleware/auth.ts`) and compose them in the root middleware. You can still scope middleware to specific routes ("scoped middleware") by using `matcher` or to path segments by branching on `request.nextUrl.pathname` ("segment-style middleware"), but it all lives in the one root file.

Example structure:

```text
src/middleware.ts
src/middleware/auth.ts
src/middleware/headers.ts
```

```javascript
// src/middleware.ts
import { withAuth } from './middleware/auth';
import { withHeaders } from './middleware/headers';

export function middleware(request) {
  const response = withAuth(request);
  return withHeaders(request, response);
}
```

```javascript
// src/middleware/auth.ts
import { NextResponse } from 'next/server';

export function withAuth(request) {
  if (!request.cookies.get('auth')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
```

```javascript
// src/middleware/headers.ts
import { NextResponse } from 'next/server';

export function withHeaders(_request, response) {
  const finalResponse = response ?? NextResponse.next();
  finalResponse.headers.set('X-Frame-Options', 'DENY');
  return finalResponse;
}
```

Note: the `_request` name indicates the argument is intentionally unused (a common linting convention).

## Rewrites vs redirects

`rewrite` serves content from a different path without changing the URL, while `redirect` changes the URL in the browser.

```javascript
return NextResponse.rewrite(new URL('/maintenance', request.url));
```

```javascript
return NextResponse.redirect(new URL('/login', request.url));
```

Bad practice: doing heavy database work in middleware.

```javascript
export async function middleware() {
  const user = await db.users.findFirst(); // example DB call, too slow for edge middleware
  return NextResponse.next();
}
```

## Matchers

```javascript
export const config = {
  matcher: ['/dashboard/:path*']
};
```

Example: set a security header only for `/dashboard` routes.

```javascript
import { NextResponse } from 'next/server';

export function middleware() {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*']
};
```

Example: one middleware, different helpers per route segment.

```javascript
// src/middleware.ts
import { withAuth } from './middleware/auth';
import { withHeaders } from './middleware/headers';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const authResponse = withAuth(request);
    if (authResponse) return authResponse;
  }

  if (pathname.startsWith('/docs')) {
    return withHeaders(request);
  }

  return null;
}

export const config = {
  matcher: ['/dashboard/:path*', '/docs/:path*']
};
```

Example: separate middleware per matcher (one global middleware file).

```javascript
// src/middleware.ts
import { withAuth } from './middleware/auth';
import { withDocsHeaders } from './middleware/docs-headers';
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    return withAuth(request) ?? NextResponse.next();
  }

  if (pathname.startsWith('/docs')) {
    return withDocsHeaders(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/docs/:path*']
};
```

## Interview Questions and Answers

### 1. What is middleware used for?

Auth checks, rewrites, redirects, and adding headers before a route runs.

### 2. Where does middleware run?

On the edge runtime by default (lightweight code running at distributed edge locations close to users). See `next.js/Edge_Runtime/explanation.md` for more detail.
