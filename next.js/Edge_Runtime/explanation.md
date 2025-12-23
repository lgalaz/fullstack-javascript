# Edge Runtime 

## Introduction

The Edge Runtime runs on a V8 isolate with low latency but has limitations compared to the Node runtime.

## Where It Applies

- Middleware runs on the edge by default
- Route handlers can opt into edge

```javascript
export const runtime = 'edge';
```

You can set it per route handler or page. It affects available APIs and performance characteristics.

## Limitations

- No Node.js APIs (like `fs`)
- Smaller runtime environment
- Use Web APIs instead

## Use cases

- Geolocation-based routing
- Lightweight auth checks
- A/B testing at the edge

## Interview Questions and Answers

### 1. Why use the edge runtime?

For lower latency and fast global responses.

### 2. What is a common limitation of the edge runtime?

It cannot use Node.js built-in modules like `fs`.
