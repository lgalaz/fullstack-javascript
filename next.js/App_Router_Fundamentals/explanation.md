# App Router Fundamentals - Comprehensive Study Guide

## Introduction

The App Router (the `app/` directory) is the modern routing system in Next.js. It uses file-based routing, nested layouts, and server components by default.

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

## App Router vs Pages Router

- App Router uses server components and layouts.
- Pages Router uses `pages/` with `getServerSideProps` and `getStaticProps`.
- App Router is recommended for new apps.

## Interview Questions and Answers

### 1. What is the App Router in Next.js?

It is the `app/` directory-based routing system with nested layouts and server components by default.

### 2. Why use `next/link` instead of `<a>`?

It enables client-side navigation and prefetching for faster transitions.
