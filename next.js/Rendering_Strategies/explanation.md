# Rendering Strategies (SSR, SSG, ISR, CSR) - Comprehensive Study Guide

## Introduction

Next.js supports multiple rendering modes. In the App Router, pages are static by default unless you opt into dynamic behavior.

## SSG (Static Site Generation)

Pre-rendered at build time. Fast and cacheable.

## ISR (Incremental Static Regeneration)

Static pages that revalidate on a schedule.

```javascript
export const revalidate = 60; // seconds
```

## SSR (Server-Side Rendering)

Rendered on each request. Use dynamic data sources or `cache: 'no-store'`.

## CSR (Client-Side Rendering)

Rendered in the browser. Use client components and fetch on the client.

## Streaming

React Suspense allows partial UI to stream while data loads.

## Interview Questions and Answers

### 1. What makes a route static in the App Router?

If it uses only cached fetches and no dynamic APIs like `cookies()` or `headers()`, it is static.

### 2. When would you choose SSR?

For per-request data or personalized content that cannot be cached.
