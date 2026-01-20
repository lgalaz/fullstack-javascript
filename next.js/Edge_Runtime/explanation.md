# Edge Runtime 

## Introduction

The Edge Runtime runs on a V8 isolate (a lightweight JS sandbox) close to users, which reduces latency. It is not full Node.js, so some APIs are unavailable.

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
- Use Web APIs instead (the browser-like standards such as `fetch`, `Request`, `Response`, `Headers`, and `URL` available in edge runtimes)
- No TCP sockets or long-lived connections (no WebSockets from the edge runtime)
- Tighter CPU and memory limits (provider-dependent)

Note: use Web Crypto (global `crypto`) instead of Node's `crypto` module.

Good: use Web APIs in an edge route handler.

```javascript
// app/api/geo/route.js
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const country = request.geo?.country ?? 'US';
  return Response.json({ country });
}
```

Bad: using Node-only modules on the edge.

```javascript
import fs from 'fs';

export const runtime = 'edge';

export async function GET() {
  const data = fs.readFileSync('data.json', 'utf8');
  return new Response(data);
}
```

This will throw at runtime because the Edge Runtime does not provide the `fs` module (for example, "Module not found: fs" or "`fs` is not defined").

## Use cases

- Geolocation-based routing
- Lightweight auth checks
- A/B testing at the edge

## Interview Questions and Answers

### 1. Why use the edge runtime?

For lower latency and fast global responses.

### 2. What is a common limitation of the edge runtime?

It cannot use Node.js built-in modules like `fs`.
