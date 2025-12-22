# App Router Fundamentals - Comprehensive Study Guide

## Introduction

The App Router (the `app/` directory) is the modern routing system in Next.js. It uses file-based routing, nested layouts, and server components by default.

Server Components run on the server, can access backend resources directly, and ship less JS to the client.

## File-Based Routing

- `app/page.js` defines the root route `/`.
- Nested folders map to URL segments.
- `app/about/page.js` maps to `/about`.

```javascript
// app/about/page.js
export default function AboutPage() {
  return <h1>About</h1>;
}
```

## Linking and Navigation

Use `next/link` for client-side navigation.

```javascript
import Link from 'next/link';

export default function Home() {
  return <Link href="/about">About</Link>;
}
```

For imperative navigation in client components, use `useRouter` from `next/navigation`.

```javascript
'use client';

import { useRouter } from 'next/navigation';

export default function SaveButton() {
  const router = useRouter();
  return <button onClick={() => router.push('/about')}>Go</button>;
}
```

## App Router vs Pages Router

- App Router uses server components and layouts.
- Pages Router uses `pages/` with `getServerSideProps` and `getStaticProps`.
- App Router is recommended for new apps.

## Route conventions

- `layout.js` composes shared UI for a segment and its children.
- `loading.js` renders a Suspense fallback while data loads.
- `error.js` defines a segment-level error boundary.
- `not-found.js` customizes 404s for a route subtree.

## Interview Questions and Answers

### 1. What is the App Router in Next.js?

It is the `app/` directory-based routing system with nested layouts and server components by default.

### 2. Why use `next/link` instead of `<a>`?

It enables client-side navigation and prefetching for faster transitions.
