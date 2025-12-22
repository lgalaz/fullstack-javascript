# Data Fetching, Caching, and Revalidation - Comprehensive Study Guide

## Introduction

Next.js extends `fetch` on the server with caching and revalidation. You can control whether data is static, dynamic, or periodically revalidated.

## Default Caching

Server `fetch` requests are cached by default when possible.

```javascript
export default async function Page() {
  const users = await fetch('https://api.example.com/users').then(r => r.json());
  return <pre>{JSON.stringify(users, null, 2)}</pre>;
}
```

## Revalidation

```javascript
await fetch('https://api.example.com/users', {
  next: { revalidate: 60 }
});
```

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

Call `revalidateTag('users')` in a server action or route handler to refresh.

## Dynamic Rendering Controls

```javascript
export const dynamic = 'force-dynamic';
```

## Interview Questions and Answers

### 1. What does `cache: 'no-store'` do?

It disables caching and makes the request dynamic on every render.

### 2. What is tag-based revalidation?

A way to invalidate cached data by tag instead of by path.
