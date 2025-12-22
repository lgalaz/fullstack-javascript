# Deployment and Caching - Comprehensive Study Guide

## Introduction

Next.js apps are commonly deployed on Vercel, but can run on any Node or edge-compatible platform. Caching strategy impacts performance and cost.

## Output Targets

- Node runtime for server rendering and route handlers
- Edge runtime for low-latency middleware and handlers

## Caching Layers

- CDN caching for static assets
- Server `fetch` caching for data
- ISR for background revalidation

Cache headers should align with your data freshness requirements. For static assets, long `max-age` with immutable is common.

```javascript
return new Response(body, {
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable'
  }
});
```

## Headers

You can set cache headers in route handlers or `next.config.js`.

## Interview Questions and Answers

### 1. What is ISR used for?

Refreshing static content without rebuilding the entire site.

### 2. Why is CDN caching important?

It reduces latency and offloads traffic from your origin.
