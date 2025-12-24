# Routing and Dynamic Segments 

## Introduction

Dynamic segments let you build routes that accept parameters from the URL.

## Dynamic Segments

Use bracket syntax in folder names:

- `app/users/[id]/page.js` matches `/users/123`.

```javascript
// app/users/[id]/page.js
export default function UserPage({ params }) {
  return <div>User: {params.id}</div>;
}
```

In client components, use `useParams` from `next/navigation`.

```javascript
'use client';
import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams();
  return <div>User: {params.id}</div>;
}
```

Bad practice: trying to use `useParams` in a server component.

```javascript
import { useParams } from 'next/navigation';

export default function UserPage() {
  const params = useParams(); // hooks are not allowed in server components
  return <div>User: {params.id}</div>;
}
```

Good practice: read params from the server component props.

```javascript
// app/users/[id]/page.js
export default function UserPage({ params }) {
  return <div>User: {params.id}</div>;
}
```

## Catch-All and Optional Segments

- `app/blog/[...slug]/page.js` matches `/blog/a/b/c`.
- `app/blog/[[...slug]]/page.js` also matches `/blog`.

Catch-all segments collect multiple URL parts into an array, while optional catch-all also allows the base path.
Note: with `[[...slug]]`, the same file handles `/blog` and `/blog/*`; you don't need a separate `app/blog/page.js` unless you want different behavior.

```javascript
export default function Blog({ params }) {
  return <div>Slug: {params.slug?.join('/')}</div>;
}
```

## generateStaticParams

Pre-generate dynamic routes at build time.

```javascript
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}
```

Complete example:

```javascript
// app/users/[id]/page.js
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}

export const revalidate = 60; // refresh at most once per minute

export default function UserPage({ params }) {
  // Next.js will pre-render /users/1 and /users/2 at build time.
  return <div>User: {params.id}</div>;
}
```

Pair `generateStaticParams` with `revalidate` or caching to keep content fresh.
Note: this is useful for known-at-build-time slugs like popular products, docs pages, or marketing pages; for example, pre-render your top 100 product pages for fast loads.

## Interview Questions and Answers

### 1. How do you access route params in the App Router?

They are available on the `params` prop in server components.

### 2. When would you use a catch-all route?

When a route can have a variable number of segments, like nested docs or blog slugs.
