# Authentication and Authorization 

## Introduction

Next.js can handle auth with server components, middleware, and route handlers. Common solutions include Auth.js (NextAuth).

Authentication proves who a user is. Authorization decides what that user can access.

Auth.js (formerly NextAuth) is a popular, batteries-included authentication library for Next.js. It handles OAuth providers (GitHub, Google), session management (JWT or database sessions), and helpers for server components and route handlers.

## Auth.js (NextAuth) Example

This example uses GitHub OAuth and JWT sessions (default). You create a route handler that hosts the auth endpoints and a shared config that your app can import on the server to read the current session.

Environment variables (in `.env.local`):

```bash
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret
NEXTAUTH_SECRET=long_random_string
```

Auth route handler:

```javascript
// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  ],
  session: { strategy: 'jwt' }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

Server component session read:

```javascript
// app/dashboard/page.js
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return <p>Unauthorized</p>;
  return <div>Welcome, {session.user.name}</div>;
}
```

Client sign-in/out buttons:

```javascript
'use client';
import { signIn, signOut } from 'next-auth/react';

export function AuthButtons() {
  return (
    <div>
      <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
```

Notes:
- `NEXTAUTH_SECRET` is used to sign/encrypt session tokens. Keep it private.
- `getServerSession` runs on the server, so it can safely read cookies and validate the session.
- If you want database sessions, configure an adapter and set `session: { strategy: 'database' }`.

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

Bad practice: relying only on client state for access control.

```javascript
'use client';

export default function Dashboard() {
  const session = localStorage.getItem('session');
  return session ? <div>Private</div> : <p>Unauthorized</p>;
}
```

This is unsafe because client state can be spoofed or modified, so it cannot protect data. Always enforce access on the server.

Good practice: verify the session on the server and return protected data only when authorized. In the App Router, `cookies()` reads the request cookies on the server for the current request, not browser state. That makes it safe for server-only checks and works with `HttpOnly` cookies (flagged so browser JavaScript cannot read or write them), unlike `localStorage` which is client-only and easy to spoof. The browser sends both `HttpOnly` and non-`HttpOnly` cookies in the `Cookie` header as long as they match the request rules: `Secure` means HTTPS only, `SameSite` controls cross-site sending (Strict/Lax/None), `Path` limits to a URL prefix, and `Expires`/`Max-Age` determine if the cookie is still valid.

```javascript
// app/dashboard/page.js
import { cookies } from 'next/headers';

export default async function Dashboard() {
  const session = cookies().get('session');
  if (!session) return <p>Unauthorized</p>;
  const data = await getDashboardData(session.value);
  return <div>{data.title}</div>;
}
```

## Authorization

Authentication proves identity; authorization controls access to resources. Enforce authorization in data access layers and route handlers.

A data access layer is the set of server-only functions that read/write your database or services (e.g., `lib/db`, `lib/repos`). Centralize authorization checks there so every caller is protected.

```javascript
// lib/users.js
export async function getAdminData(userId) {
  const user = await db.users.findById(userId);
  if (!user || !user.isAdmin) throw new Error('Forbidden');
  return db.adminData.findMany();
}
```

```javascript
// app/api/admin/route.js
import { getAdminData } from '@/lib/users';

export async function GET(request) {
  const user = await getSessionUser(request);
  return Response.json(await getAdminData(user.id));
}
```

```javascript
export async function GET(request) {
  // getSessionUser returns the authenticated user from the request.
  const user = await getSessionUser(request);
  if (!user || !user.isAdmin) {
    return new Response('Forbidden', { status: 403 });
  }
  // getAdminData returns a protected resource.
  return Response.json(await getAdminData());
}
```

## Interview Questions and Answers

### 1. Where should auth checks happen in Next.js?

At the edge (middleware) to block or redirect unauthorized requests early, and on the server (route handlers, server actions, or data layer) to enforce access to data and mutations. Use middleware for coarse route gating and server checks for fine-grained authorization based on roles, ownership, or permissions.

### 2. Why use server-side checks even with client auth?

Client state can be spoofed or stale; server checks are the source of truth and ensure policies are enforced regardless of what runs in the browser. This protects against tampered tokens (forged or modified auth claims), direct API calls (bypassing the UI), and privilege escalation (accessing higher-permission actions).
