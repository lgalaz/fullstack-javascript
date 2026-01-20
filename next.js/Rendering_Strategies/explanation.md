# Rendering Strategies (SSR, SSG, ISR, CSR) 

## Introduction

Next.js supports multiple rendering modes. In the App Router, pages are static by default unless you opt into dynamic behavior.

- SSG: build-time HTML
- ISR: build-time HTML that revalidates on a schedule
- SSR: render on every request
- CSR: render in the browser

## SSG (Static Site Generation)

Pre-rendered at build time. Fast and cacheable.

```javascript
export default async function Page() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
```

Bad practice: using SSG for per-user data.

```javascript
export default async function Page() {
  const profile = await fetch('https://api.example.com/me', {
    cache: 'force-cache'
  }).then(r => r.json());
  return <div>{profile.name}</div>;
}
```

## ISR (Incremental Static Regeneration)

Static pages that revalidate on a schedule.

```javascript
export const revalidate = 60; // seconds
```

## SSR (Server-Side Rendering)

Rendered on each request. Use dynamic data sources or `cache: 'no-store'`.

Use `export const dynamic = 'force-dynamic'` when you must opt out of static optimization.

```javascript
export const dynamic = 'force-dynamic';

export default async function Page() {
  const profile = await fetch('https://api.example.com/me', {
    cache: 'no-store'
  }).then(r => r.json());
  return <div>{profile.name}</div>;
}
```

## CSR (Client-Side Rendering)

Rendered in the browser. Use client components and fetch on the client.

CSR still benefits from server-rendered shells when combined with App Router layouts.
Note: a server-rendered shell is the initial HTML frame (layout, nav, placeholders) sent by the server before client components hydrate.

```javascript
// app/layout.js (server-rendered shell)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <nav>App Nav</nav>
        {children}
      </body>
    </html>
  );
}

// app/profile/page.js (client-rendered content inside the shell)
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setProfile);
  }, []);

  if (!profile) return <p>Loading...</p>;
  return <div>{profile.name}</div>;
}
```

## Streaming

React Suspense allows partial UI to stream while data loads.

## Partial Prerendering (PPR)

PPR mixes static HTML with streamed dynamic parts in a single route. The shell is prerendered and cached, while dynamic islands stream in at request time.

Use PPR when most of a page is static but small regions are personalized or real-time.

Example (static shell + streamed dynamic region):

```javascript
// app/page.js (server component)
import { Suspense } from 'react';

async function LivePrice() {
  const price = await fetch('https://api.example.com/price', {
    cache: 'no-store'
  }).then(r => r.json());
  return <span>${price.value}</span>;
}

function PriceSkeleton() {
  return <span>Loading price...</span>;
}

export default function Page() {
  return (
    <main>
      <h1>Product</h1>
      <p>Most of this page is static and cached.</p>
      <Suspense fallback={<PriceSkeleton />}>
        <LivePrice />
      </Suspense>
    </main>
  );
}
```

What happens: the static HTML for the page is cached and sent immediately; the `LivePrice` region is rendered on the server at request time and streamed into the page once it resolves.

Islands vs PPR:
PPR "islands" are streamed server-rendered regions inside a single route. The islands concept (popularized by Astro) usually means static HTML with isolated client-hydrated components. PPR is about server streaming and caching boundaries; island architecture is about client hydration boundaries. They can look similar in the UI, but they solve different problems.

## Interview Questions and Answers

### 1. What makes a route static in the App Router?

Routes are static by default. If a route uses only cached fetches and no dynamic APIs like `cookies()` or `headers()`, it stays static.

### 2. When would you choose SSR?

For per-request data or personalized content that cannot be cached.
