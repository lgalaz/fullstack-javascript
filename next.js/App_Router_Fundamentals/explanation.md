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

## App Router vs Legacy Pages Router

The legacy Pages Router (`pages/`) is the original Next.js routing model. It still works and is maintained, but it has a flatter mental model and fewer built-in primitives compared to the App Router, which means you often have to assemble features manually (shared layouts, route-level loading and error states, nested composition) and coordinate more app-wide wiring in `_app.js` or custom wrappers instead of relying on first-class routing conventions.

The Pages Router is the older `pages/`-directory system (also file-based routing) that uses data-fetching functions like `getServerSideProps` and `getStaticProps`. The App Router is the newer `app/`-directory system with layouts, server components, and more granular loading/error UI. Both map files to routes; the App Router adds new conventions and rendering features.

At a glance:

- App Router uses server components and layouts.
- Pages Router uses `pages/` with `getServerSideProps` and `getStaticProps`.
- App Router is recommended for new apps.

Key differences:

- Rendering model: App Router defaults to Server Components with explicit `'use client'` boundaries; Pages Router renders client components by default and uses data-fetching hooks for server work (for example, `getServerSideProps`, `getStaticProps`, `getInitialProps`).
- Layouts and nesting: App Router supports nested layouts per route segment; Pages Router relies on patterns like `_app.js` (global layout wrapper) and per-page wrapper components (for example, `Page.getLayout` or layout HOCs) to simulate nesting.
- Data fetching: App Router uses `fetch` in Server Components and route handlers; Pages Router uses `getServerSideProps`, `getStaticProps`, and `getInitialProps`.
- Loading and error UI: App Router has `loading.js`, `error.js`, and `not-found.js`; Pages Router uses custom patterns or page-level checks.
- Streaming and partial rendering: App Router supports streaming with React Suspense; Pages Router is largely request/response per page.

`getServerSideProps` runs on every request to fetch data for a page. Use it in the Pages Router when you need per-request data or auth checks. It receives a context object with details like `req`, `res`, `params`, `query`, `resolvedUrl`, `preview`, and locale info (`locale`, `locales`, `defaultLocale`). Its return value must be an object with a top-level `props` or `redirect` key (or `notFound`).

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

`getStaticProps` runs at build time (and optionally on a revalidation schedule) to pre-render pages. Use it for content that can be cached. It receives a context object with `params`, `preview`, `previewData`, and locale info (`locale`, `locales`, `defaultLocale`). It also returns an object with `props` or `redirect` (or `notFound`).

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

Why App Router is generally the better option for new builds:

- Less client JS by default with Server Components and selective client boundaries.
- Cleaner composition with nested layouts, templates, and route segments.
- First-class loading/error states aligned with routes and UI structure.
- Future-facing model that matches ongoing Next.js and React investment.

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
- Only the root `app/layout.js` must return `<html>` and `<body>`; Next.js throws a dev/build error if they are missing.
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

## Common Route Segment Types

- Static segment: fixed path.

```javascript
// app/about/page.js -> /about
export default function AboutPage() {
  return <h1>About</h1>;
}
```

Note: static segments are the simplest and most predictable; use them for fixed pages like About or Pricing.

- Dynamic segment: path params via `[id]`.

```javascript
// app/users/[id]/page.js -> /users/123
export default function UserPage({ params }) {
  return <div>User ID: {params.id}</div>;
}
```

Note: params are strings; validate and coerce types before using them (for example, parse numeric IDs).

- Catch-all: matches multiple segments into an array.

```javascript
// app/docs/[...slug]/page.js -> /docs/a/b/c
export default function DocsPage({ params }) {
  return <div>Slug: {params.slug.join('/')}</div>;
}
```

Note: `params.slug` is always an array for catch-all routes; handle empty arrays or missing content safely.

- Optional catch-all: matches zero or more segments.

```javascript
// app/docs/[[...slug]]/page.js -> /docs and /docs/a/b
export default function DocsPage({ params }) {
  const slug = params.slug ?? [];
  return <div>Slug: {slug.join('/') || '(root)'}</div>;
}
```

Note: `params.slug` can be `undefined` for the root path; guard for that case explicitly.

- Route group: organizes files without affecting the URL.

```javascript
// app/(marketing)/page.js -> /
export default function MarketingHome() {
  return <h1>Marketing</h1>;
}
```

Note: route groups do not affect the URL, but they do affect layout nesting and shared UI.

## Parallel Routes

Parallel routes let a layout render multiple sibling routes at once using named slots (folders prefixed with `@`). Each slot renders in parallel in the parent layout.

```javascript
// app/layout.js
export default function RootLayout({ children, auth, marketing }) {
  return (
    <div>
      <main>{children}</main>
      <aside>{auth}</aside>
      <section>{marketing}</section>
    </div>
  );
}
```

```javascript
// app/@auth/login/page.js
export default function Login() {
  return <p>Login</p>;
}

// app/@marketing/page.js
export default function Marketing() {
  return <p>Marketing</p>;
}
```

Notes:
- The slot name comes from the `@` folder (`@auth` -> `auth` prop in the layout). The URL still includes the inner route (for example `/login` maps to `app/@auth/login/page.js`).
- Next.js decides which slot page to render based on the current URL and the slot's route tree; the layout just receives the slot props.
- If a slot does not match the current URL, Next.js renders the slot's `default.js` if it exists (for example, `app/@auth/default.js`); otherwise that slot renders nothing (visiting `/` renders `children` from `app/page.js` and `@auth/default.js` if present).

## Intercepting Routes

Intercepting routes use special segments like `(.)` or `(..)` to render one route inside another, commonly for modals. A direct visit shows the full page, while in-app navigation can render it inside a slot. The `@modal` folder is a parallel route slot name, so intercepted pages render into that slot. `(.)` means intercept from the same level, while `(..)` intercepts from one level up. The dots control which segment level the target route is resolved from; pairing with a slot is optional but common so the intercepted page can render alongside the current page.

```javascript
// Full page route
// app/photos/[id]/page.js
export default function PhotoPage({ params }) {
  return <div>Photo {params.id}</div>;
}
```

```javascript
// Intercept inside a modal slot
// app/@modal/(.)photos/[id]/page.js
export default function PhotoModal({ params }) {
  return <div>Modal photo {params.id}</div>;
}
```

```javascript
// Intercept from one level up
// app/@modal/(..)photos/[id]/page.js
export default function PhotoModalFromParent({ params }) {
  return <div>Modal photo {params.id}</div>;
}
```

```javascript
// Deeper nesting example
// app/gallery/photos/[id]/page.js
export default function GalleryPhoto({ params }) {
  return <div>Gallery photo {params.id}</div>;
}

// Intercept from the gallery level
// app/gallery/@modal/(.)photos/[id]/page.js
export default function GalleryPhotoModal({ params }) {
  return <div>Modal gallery photo {params.id}</div>;
}

// Intercept from one level above gallery
// app/@modal/(..)gallery/photos/[id]/page.js
export default function GalleryPhotoModalFromRoot({ params }) {
  return <div>Modal gallery photo {params.id}</div>;
}
```

Note: You can chain more dots like `(...)` to intercept from higher levels (each `..` hops one segment up).

## Interview Questions and Answers

### 1. What is the App Router in Next.js?

It is the `app/` directory-based routing system with nested layouts and server components by default.

### 2. Why use `next/link` instead of `<a>`?

It enables client-side navigation, route prefetching, stateful transitions, and better integration with App Router features like loading/error boundaries.
