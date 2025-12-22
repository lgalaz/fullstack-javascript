# Route Handlers (API Routes) - Comprehensive Study Guide

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

## Interview Questions and Answers

### 1. Where do route handlers live in the App Router?

Inside `app/api/.../route.js`.

### 2. What API does a route handler use?

The standard Web Request/Response APIs.
