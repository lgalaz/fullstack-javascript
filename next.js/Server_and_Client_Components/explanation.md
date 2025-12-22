# Server and Client Components - Comprehensive Study Guide

## Introduction

In the App Router, components are server components by default. Client components are opt-in with the `'use client'` directive.

## Server Components

- Render on the server
- Can access server-only resources (DB, secrets)
- Do not include client-side JS unless needed

```javascript
// app/users/page.js
export default async function Users() {
  const users = await getUsers();
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```

## Client Components

Add `'use client'` at the top to enable hooks and browser APIs.

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## When to Use Which

- Server components for data fetching and static UI
- Client components for interactivity and state

## Interview Questions and Answers

### 1. Why are server components useful?

They reduce client bundle size and allow secure data access on the server.

### 2. What does `'use client'` do?

It marks a component and its imports as client-side, enabling hooks and browser APIs.
