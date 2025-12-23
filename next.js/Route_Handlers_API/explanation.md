# Route Handlers (API Routes) 

## Introduction

Route handlers live under `app/api` and let you build API endpoints using the Web Request/Response APIs.

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
  return Response.json({ ok: true, body });
}
```

## Headers and Status

```javascript
return new Response('Created', { status: 201 });
```

## Dynamic segments and params

```javascript
// app/api/users/[id]/route.js
export async function GET(_request, { params }) {
  return Response.json({ id: params.id });
}
```

## Edge vs Node runtimes

Route handlers can run on the Edge or Node.js runtimes depending on your configuration and APIs used.

## Interview Questions and Answers

### 1. Where do route handlers live in the App Router?

Inside `app/api/.../route.js`.

### 2. What API does a route handler use?

The standard Web Request/Response APIs.
