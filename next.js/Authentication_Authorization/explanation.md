# Authentication and Authorization - Comprehensive Study Guide

## Introduction

Next.js can handle auth with server components, middleware, and route handlers. Common solutions include Auth.js (NextAuth).

## Middleware Guard

```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAuthed = request.cookies.get('session');
  if (!isAuthed) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
```

## Server Component Check

```javascript
import { cookies } from 'next/headers';

export default function Dashboard() {
  const session = cookies().get('session');
  if (!session) return <p>Unauthorized</p>;
  return <div>Private</div>;
}
```

## Authorization

Authentication proves identity; authorization controls access to resources. Enforce authorization in data access layers and route handlers.

```javascript
export async function GET(request) {
  const user = await getSessionUser(request);
  if (!user || !user.isAdmin) {
    return new Response('Forbidden', { status: 403 });
  }
  return Response.json(await getAdminData());
}
```

## Interview Questions and Answers

### 1. Where should auth checks happen in Next.js?

At the edge (middleware) for route protection and on the server for data access checks.

### 2. Why use server-side checks even with client auth?

Client state can be spoofed; server checks are the source of truth.
