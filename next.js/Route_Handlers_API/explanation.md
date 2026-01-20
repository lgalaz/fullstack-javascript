# Route Handlers (API Routes) 

## Introduction

Route handlers live under `app/api` and let you build non-UI endpoints using the Web Request/Response APIs.
They are called "handlers" because you export functions for HTTP methods (GET, POST, etc.) that handle those requests.
Non-API routes are still routes, but they render UI (pages/layouts) instead of returning raw responses like JSON or files.
Note: Non-API routes are often called UI routes or page routes in the App Router.
Note: API routes use `route.js`, while UI routes use `page.js` (and `layout.js` for shared UI).

## Basic Handler

```javascript
// app/api/users/route.js
export async function GET() {
  return Response.json([{ id: 1, name: 'Ada' }]);
}
```

## POST Example

```javascript
export async function POST(request) {
  const body = await request.json();
  const user = { id: crypto.randomUUID(), ...body };
  // Example: persist to DB here (omitted) before responding
  return Response.json({ ok: true, user }, { status: 201 });
}
```

Note: the "do something" step (validate, write to a DB, call a service) happens between parsing the request body and returning the response.

Multiple methods can live in the same route file.

```javascript
// app/api/users/route.js
export async function GET() {
  return Response.json([{ id: 1, name: 'Ada' }]);
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ ok: true, body }, { status: 201 });
}
```

Bad practice: trusting client input without validation.

```javascript
export async function POST(request) {
  const body = await request.json();
  // missing validation
  return Response.json({ ok: true });
}
```

Good practice: validate input and return errors with a clear status.

```javascript
export async function POST(request) {
  const body = await request.json();

  if (!body?.email || typeof body.email !== 'string') {
    return Response.json({ ok: false, error: 'Invalid email' }, { status: 400 });
  }

  return Response.json({ ok: true });
}
```

Note: Next.js does not include a built-in validator like Laravel FormRequest; common choices are schema libraries such as Zod or Joi.

## Headers and Status

```javascript
return new Response('Created', { status: 201 });
```

Example with headers:

```javascript
return new Response(JSON.stringify({ ok: true }), {
  status: 201,
  headers: { 'Content-Type': 'application/json' }
});
```

## NextRequest and helpers

Use `NextRequest` when you need cookies, headers, or URL parsing helpers.

```javascript
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const search = request.nextUrl.searchParams.get('q');
  return Response.json({ token, search });
}
```

You can also parse form data:

```javascript
export async function POST(request) {
  const form = await request.formData();
  return Response.json({ name: form.get('name') });
}
```

## CORS and OPTIONS

If your API is called cross-origin, add an `OPTIONS` handler for preflight requests and set `Access-Control-*` headers.

## Dynamic segments and params

```javascript
// app/api/users/[id]/route.js
export async function GET(_request, { params }) {
  return Response.json({ id: params.id });
}
```

Note: dynamic segment names are the keys in `params` (e.g., `[id]` -> `params.id`), and you can use `[...slug]` or `[[...slug]]` for catch-all and optional catch-all routes.

Catch-all example:

```javascript
// app/api/docs/[...slug]/route.js
export async function GET(_request, { params }) {
  return Response.json({ path: params.slug }); // e.g. ["guides", "setup"]
}
```

Optional catch-all example:

```javascript
// app/api/docs/[[...slug]]/route.js
export async function GET(_request, { params }) {
  return Response.json({ path: params.slug ?? [] }); // [] when no segments
}
```

Note: the double brackets make the catch-all optional, so it matches `/api/docs` and `/api/docs/a/b`, with `params.slug` undefined when no segments are present.

Other useful routing syntax: route groups `(group)` (organize without URL changes), parallel routes `@slot`, and intercepting routes `(.)`, `(..)`, `(...)` for rendering one route inside another context.

Route groups example (folder name does not affect URL). Use them to organize files or apply a shared layout without changing the path.

```javascript
// app/(marketing)/pricing/page.js
// URL: /pricing
```

```javascript
// app/(marketing)/layout.js
export default function MarketingLayout({ children }) {
  return <section className="marketing">{children}</section>;
}
```
Note: parentheses mean the segment is for organization only and does not appear in the URL.

Parallel routes example (named slots):

```javascript
// app/dashboard/layout.js
export default function Layout({ children, analytics }) {
  return (
    <div>
      {children}
      {analytics}
    </div>
  );
}

// app/dashboard/@analytics/page.js
// renders into the analytics slot
```

Note: a named slot is a parallel route rendered into a specific prop on the segment's layout (e.g., `@analytics` -> `analytics`). Next.js wires this automatically; you only use the slot prop in that segment's `layout.js`, not in sibling pages.

Intercepting routes examples:

```javascript
// app/photos/(.)[id]/page.js
// intercepts /photos/[id] within the same segment

// app/photos/(..)[id]/page.js
// intercepts a sibling segment one level up

// app/photos/(...)[id]/page.js
// intercepts from the root segment
```

Use intercepting routes when you want a route to render inside another route's UI (for example, open a photo detail as a modal on top of the photos list without leaving the list page).

Example: modal over a list in the same segment.

```javascript
// app/photos/page.js
export default function Photos() {
  return <div>Photos grid</div>;
}

// app/photos/@modal/(.)[id]/page.js
// Navigating to /photos/123 keeps the /photos UI and renders this inside it.
export default function PhotoModal({ params }) {
  return <div className="modal">Photo {params.id}</div>;
}
```
Note: this pattern uses a `@modal` slot in `app/photos/layout.js` (e.g., `export default function Layout({ children, modal }) { ... }`). `(.)` is the convention for "intercept in the same segment," so `/photos/[id]` renders inside `/photos` instead of replacing it.

## Edge vs Node runtimes

Route handlers can run on the Edge or Node.js runtimes depending on your configuration and APIs used.

## When to Use a Separate Backend

Next.js route handlers work well for simple backend-for-frontend use cases: auth callbacks, small CRUD endpoints, and aggregating data for pages.

Consider a separate Node.js backend when server responsibilities grow beyond request/response handlers, such as:
- long-running processes or background jobs
- real-time connections (WebSockets, Socket.IO)
- queues and worker orchestration
- a shared API for multiple clients (web, mobile, internal services)
- independent scaling and deployment of the API layer

In those cases, a dedicated backend provides clearer layering, more reliable process control, and decoupled scaling from the UI.

Quick decision guide:

- Tiny UI-only state changes (no server) → keep it in the component.
- HTTP request/response needs → Route Handlers or Server Actions.
- Simple forms (e.g., signup) → keep UI state in the component, handle validation + persistence in a Route Handler or Server Action (no separate controller unless you already have a backend layer).
- Complex server concerns (queues, WebSockets, long-running jobs, shared APIs) → separate backend.

## Interview Questions and Answers

### 1. Where do route handlers live in the App Router?

Inside `app/api/.../route.js`.
Note: `app/api` is the fixed convention for route handlers; you cannot rename it.

### 2. What API does a route handler use?

The standard Web Request/Response APIs.
