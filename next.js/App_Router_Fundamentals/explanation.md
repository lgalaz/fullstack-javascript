# App Router Fundamental

## Introduction

The App Router (the `app/` directory) is the modern routing system in Next.js. It uses file-based routing, nested layouts, and server components by default.

Server Components run on the server, can access backend resources directly, and ship less JS to the client. A server component is just a React component that renders on the server unless you opt it into client behavior.

## File-Based Routing

- `app/page.js` defines the root route `/`.
- Nested folders map to URL segments.
- `app/about/page.js` maps to `/about`.

File-based routing means the folder and file names determine the URL path. Both the App Router (`app/`) and Pages Router (`pages/`) are file-based; they differ in features and conventions, not in the core idea.

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

Bad practice: using a plain `<a>` for internal navigation causes a full page reload.

```javascript
export default function Home() {
  return <a href="/about">About</a>;
}
```

This bypasses Next.js client-side routing and prefetching, so the browser does a full document request instead of a fast in-app transition.

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

The Pages Router is the older `pages/`-directory system (also file-based routing) that uses data-fetching functions like `getServerSideProps` and `getStaticProps`. The App Router is the newer `app/`-directory system with layouts, server components, and more granular loading/error UI. Both map files to routes; the App Router adds new conventions and rendering features.

`getServerSideProps` runs on every request to fetch data for a page. Use it in the Pages Router when you need per-request data or auth checks.

```javascript
// pages/profile.js
export async function getServerSideProps() {
  const profile = await fetch('https://api.example.com/me').then(r => r.json());
  return { props: { profile } };
}

export default function Profile({ profile }) {
  return <div>{profile.name}</div>;
}
```

`getStaticProps` runs at build time (and optionally on a revalidation schedule) to pre-render pages. Use it for content that can be cached.

```javascript
// pages/blog.js
export async function getStaticProps() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return { props: { posts }, revalidate: 60 };
}

export default function Blog({ posts }) {
  return posts.map(p => <div key={p.id}>{p.title}</div>);
}
```

File-based examples (with `src/` as the project root):

```text
Pages Router:
src/pages/index.js -> /
src/pages/about.js -> /about
src/pages/users/[id].js -> /users/123
```

```text
App Router:
src/app/page.js -> /
src/app/about/page.js -> /about
src/app/users/[id]/page.js -> /users/123
```

## Route conventions

- `layout.js` and `template.js` composes shared UI for a segment and its children.
- `loading.js` renders a Suspense fallback while data loads.
- `error.js` defines a segment-level error boundary.
- `not-found.js` customizes 404s for a route subtree.
- server components by default and explicit `'use client'` boundaries
- built-in streaming with React Suspense

```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

Note: the function name is not special; only the `app/layout.js` filename and default export matter. The root layout must return `<html>` and `<body>`.

```javascript
// app/loading.js
export default function Loading() {
  return <p>Loading...</p>;
}
```

## Interview Questions and Answers

### 1. What is the App Router in Next.js?

It is the `app/` directory-based routing system with nested layouts and server components by default.

### 2. Why use `next/link` instead of `<a>`?

It enables client-side navigation, route prefetching, stateful transitions, and better integration with App Router features like loading/error boundaries.
