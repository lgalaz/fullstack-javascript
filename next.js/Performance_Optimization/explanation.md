# Performance Optimization 

## Introduction

Next.js provides built-in optimizations, but senior engineers should know where bottlenecks come from and how to address them.
TTFB (time to first byte) is the time it takes for the server to start sending a response.

## Reduce Client Bundle Size

- Prefer server components
- Avoid large client-only libraries
- Use dynamic imports

Dynamic imports load code on demand (code-splitting) so heavy client-only modules are fetched only when needed, not in the initial bundle.

```javascript
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

How dynamic imports work:
- `import()` is a JavaScript feature that tells the bundler to split code into a separate chunk loaded at runtime.
- `next/dynamic` is a Next.js helper for React components. It adds loading states and optional server rendering control.
- It is similar to `React.lazy`, but `next/dynamic` works with Next.js routing, supports `ssr: false`, and can be used in the App Router with client components.

Example: load a component only when it is needed (client-only).

```javascript
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

export default function Dashboard() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow(true)}>Show chart</button>
      {show ? <Chart /> : null}
    </div>
  );
}
```

Bad practice: importing a heavy client-only library at the top level of a page.

```javascript
'use client';
import Chart from './Chart';

export default function Page() {
  return <Chart />;
}
```

Good practice: dynamically import the heavy client-only library and render it only on the client.

```javascript
import dynamic from 'next/dynamic';

// Signature: dynamic(importer, options?)
const Chart = dynamic(() => import('./Chart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

export default function Page() {
  return <Chart />;
}
```

## Cache Wisely

Use `fetch` caching and revalidation to avoid repeated work.

Use `revalidateTag` for targeted invalidation instead of global revalidation.

Rule of thumb: cache what is shared and stable; avoid caching per-user, highly volatile, or one-off data because it increases cache churn (frequent invalidations and low reuse) and storage pressure (more space and eviction cycles, where cached entries are repeatedly removed to make room for new ones) without improving hit rate.

## Streaming and Suspense

Stream partial UI for faster time-to-first-byte and perceived speed.

Note: the Suspense boundary is the streaming split point. Content outside it can render and stream immediately, while the suspended component streams in later once its async work resolves on the server (data fetch, module load, etc.).

```javascript
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Summary />
      <Suspense fallback={<p>Loading analytics...</p>}>
        <AnalyticsPanel />
      </Suspense>
    </div>
  );
}

function Summary() {
  return <p>Welcome back! Here is your latest overview.</p>;
}

async function AnalyticsPanel() {
  const data = await fetch('https://api.example.com/analytics').then(r => r.json());
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## Optimize Images and Fonts

Use `next/image` and `next/font`.

## Server timing and profiling

Instrument slow routes with logs and server timing. Next.js outputs can be inspected with Vercel analytics or custom tracing.

Server-Timing works by returning a response header that lists named timings; the browser and CDNs can surface these values to help pinpoint backend latency.

Example: add a Server-Timing header in a route handler.

```javascript
import { NextResponse } from 'next/server';

export async function GET() {
  const start = performance.now();
  const data = await fetch('https://api.example.com/slow').then(r => r.json());
  const ms = Math.round(performance.now() - start);

  const res = NextResponse.json(data);
  res.headers.set('Server-Timing', `fetch;dur=${ms}`);
  return res;
}
```

Example: simple custom tracing with a trace ID in logs to correlate start/end and measure the handler duration (including the fetch).

```javascript
import { randomUUID } from 'crypto';

export async function GET() {
  const traceId = randomUUID();
  // console.time starts a timer with a label; the label can be any string you want to use to match time/timeEnd.
  console.time(`route:${traceId}`);
  console.log('start', { traceId });

  await fetch('https://api.example.com/slow');

  // console.timeEnd stops the timer and prints the elapsed time for that label.
  console.timeEnd(`route:${traceId}`);
  console.log('end', { traceId });
  return new Response('ok');
}
```

Example: forward a trace context header (W3C Trace Context, OpenTelemetry-compatible) for distributed tracing. This creates a trace ID and sends it downstream by including it in the outbound `fetch` headers, so other services can add their own spans (timed segments) to the same trace, producing one end-to-end timeline in a tracing UI.
Note: this only links traces if downstream services understand and propagate `traceparent`; otherwise the trace ends at the boundary and the end-to-end timeline stops at that service call.

```javascript
export async function GET() {
  const traceparent = `00-${crypto.randomUUID().replace(/-/g, '')}-0000000000000000-01`;
  await fetch('https://api.example.com/slow', {
    headers: { traceparent },
  });
  return new Response('ok');
}
```

## Interview Questions and Answers

### 1. How can you reduce client bundle size in Next.js?

Keep components server-side and dynamically import heavy client-only code.

### 2. What is a common cause of slow TTFB?

Uncached server data fetching on every request.
