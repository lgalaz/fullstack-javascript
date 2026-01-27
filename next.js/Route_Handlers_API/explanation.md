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

```javascript
// app/api/data/route.js
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {

  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {

  return Response.json({ ok: true }, { headers: corsHeaders });
}
```

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

Other useful routing syntax: route groups `(group)` (organize without URL changes).

Route groups example for API routes (folder name does not affect URL). Use them to organize files without changing the path.

```javascript
// app/(internal)/api/users/route.js
// URL: /api/users
export async function GET() {

  return Response.json({ ok: true });
}
```

Note: parentheses mean the segment is for organization only and does not appear in the URL.

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
