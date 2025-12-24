# Data Fetching, Caching, and Revalidation 

## Introduction

Next.js extends `fetch` on the server with caching and revalidation. You can control whether data is static (served from cache), dynamic (fetched on every request), or periodically revalidated.

## Default Caching

Server `fetch` requests are cached by default when possible.

```javascript
export default async function Page() {
  const users = await fetch('https://api.example.com/users').then(r => r.json());
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```

`JSON.stringify(value, replacer, space)` takes the data, an optional replacer (function or array of keys), and a spacing value for pretty-printing. Here `null` means no replacer and `2` adds two-space indentation.

Replacer example:

```javascript
const user = { id: 1, name: 'Ada', password: 'secret' };

JSON.stringify(user);
// => {"id":1,"name":"Ada","password":"secret"}

JSON.stringify(user, ['id', 'name'], 2);
// => {
//   "id": 1,
//   "name": "Ada"
// }
```

Function replacer example:

```javascript
JSON.stringify(user, (key, value) => (key === 'password' ? undefined : value), 2);
// => {
//   "id": 1,
//   "name": "Ada"
// }
```

Caching is per request and respects `next` options. If you read cookies or headers, the route often becomes dynamic.

A dynamic route is rendered on each request (no static cache). A static route is rendered at build time and served from cache. ISR is static with periodic revalidation.

Bad practice: forcing dynamic fetches for data that rarely changes.

```javascript
await fetch('https://api.example.com/users', {
  cache: 'no-store'
});
```

Good practice: cache or revalidate data that changes infrequently.

```javascript
await fetch('https://api.example.com/users', {
  next: { revalidate: 3600 }
});
```

## Revalidation

```javascript
await fetch('https://api.example.com/users', {
  next: { revalidate: 60 }
});
```

Revalidation means Next.js serves cached data and refreshes it in the background on a schedule. It is per-request; different fetches in the same page can use different strategies.

## No Store (Always Dynamic)

```javascript
await fetch('https://api.example.com/users', {
  cache: 'no-store'
});
```

## Tags and On-Demand Revalidation

```javascript
await fetch('https://api.example.com/users', {
  next: { tags: ['users'] }
});
```

Tags label cached responses so you can invalidate them later. Call `revalidateTag('users')` in a server action or route handler to refresh.

Example server action:

```javascript
'use server';
import { revalidateTag } from 'next/cache';

export async function refreshUsers() {
  revalidateTag('users');
}
```

Note: `'use server'` marks the file as server-only so its exports run on the server (as Server Actions) and can use server-only APIs like `revalidateTag`.

```javascript
// app/users/page.js
import { refreshUsers } from '../actions';

export default function UsersPage() {
  return (
    <form action={refreshUsers}>
      <button type="submit">Refresh users</button>
    </form>
  );
}
```

## Streaming and Suspense

You can use `Suspense` in server components to stream parts of the UI while data loads.

```javascript
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<p>Loading users...</p>}>
      <Users />
    </Suspense>
  );
}

async function Users() {
  const users = await fetch('https://api.example.com/users').then(r => r.json());
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```

## Dynamic Rendering Controls

```javascript
export const dynamic = 'force-dynamic';
```

Bad practice: forcing dynamic rendering for content that could be cached and reused.

```javascript
export const dynamic = 'force-dynamic';

export default function Page() {
  return <h1>Static marketing page</h1>;
}
```

Good practice: use dynamic rendering for per-request data like user-specific dashboards.

```javascript
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const profile = await fetch('https://api.example.com/me', {
    cache: 'no-store'
  }).then(r => r.json());
  return <div>Welcome, {profile.name}</div>;
}
```

Note: `export const dynamic = 'force-dynamic'` opts the entire route into dynamic rendering, even if individual fetches could be cached.

Example of a non-dynamic (static or revalidated) request:

```javascript
export const dynamic = 'force-static';

export default async function MarketingPage() {
  const pricing = await fetch('https://api.example.com/pricing', {
    next: { revalidate: 3600 }
  }).then(r => r.json());
  return <div>Plans: {pricing.tier}</div>;
}
```

## Interview Questions and Answers

### 1. What does `cache: 'no-store'` do?

It disables caching and makes the request dynamic on every render.

### 2. What is tag-based revalidation?

A way to invalidate cached data by tag instead of by path.
