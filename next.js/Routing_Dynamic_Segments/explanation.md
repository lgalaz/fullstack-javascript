# Routing and Dynamic Segments - Comprehensive Study Guide

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

## Catch-All and Optional Segments

- `app/blog/[...slug]/page.js` matches `/blog/a/b/c`.
- `app/blog/[[...slug]]/page.js` also matches `/blog`.

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

## Interview Questions and Answers

### 1. How do you access route params in the App Router?

They are available on the `params` prop in server components.

### 2. When would you use a catch-all route?

When a route can have a variable number of segments, like nested docs or blog slugs.
