# Performance Optimization 

## Introduction

Next.js provides built-in optimizations, but senior engineers should know where bottlenecks come from and how to address them.

## Reduce Client Bundle Size

- Prefer server components
- Avoid large client-only libraries
- Use dynamic imports

```javascript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

## Cache Wisely

Use `fetch` caching and revalidation to avoid repeated work.

Use `revalidateTag` for targeted invalidation instead of global revalidation.

## Streaming and Suspense

Stream partial UI for faster time-to-first-byte and perceived speed.

## Optimize Images and Fonts

Use `next/image` and `next/font`.

## Server timing and profiling

Instrument slow routes with logs and server timing. Next.js outputs can be inspected with Vercel analytics or custom tracing.

## Interview Questions and Answers

### 1. How can you reduce client bundle size in Next.js?

Keep components server-side and dynamically import heavy client-only code.

### 2. What is a common cause of slow TTFB?

Uncached server data fetching on every request.
