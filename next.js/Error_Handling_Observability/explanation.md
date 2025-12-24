# Error Handling and Observability 

## Introduction

Next.js provides route-level error UI and supports logging and tracing for production apps.

## Error UI

Use `error.js` and `not-found.js` for route-level handling.

```javascript
// app/profile/error.js
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

Note: `reset` is a Next.js-provided function that clears the error state for this segment and re-renders it, so clicking the button retries the render after the failure. A segment is one folder level in `app/` that maps to a route part, so the reset is scoped to that route segment and its children.

```javascript
// app/profile/not-found.js
export default function NotFound() {
  return <h1>User not found</h1>;
}
```

## Logging

Log on the server for critical failures, and use client logging for UI errors.

```javascript
console.error('Failed to load user');
```

Prefer structured logs with request IDs to correlate errors across services.

Bad practice: swallowing errors without logs or user feedback.

```javascript
try {
  await doWork();
} catch (error) {
  // ignore
}
```

Good practice: log the error and surface a safe fallback or rethrow.

```javascript
try {
  await doWork();
} catch (error) {
  console.error('doWork failed', error);
  throw error;
}
```

## Instrumentation

Next.js supports `instrumentation.ts` for advanced tracing and OpenTelemetry setups. Instrumentation is code that hooks into app lifecycle and requests to collect logs, metrics, and traces. OpenTelemetry is a standard set of APIs and tools for generating and exporting telemetry (traces, metrics, logs) to observability backends.

Example: initialize OpenTelemetry and export traces to a collector.

```javascript
// instrumentation.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT
  })
});

export async function register() {
  await sdk.start();
}
```

Client-side logging tools (like Sentry, LogRocket, or Datadog RUM) help capture errors and session context when you cannot reproduce issues locally.

```javascript
// app/error.js
'use client';
import * as Sentry from '@sentry/nextjs';

export default function GlobalError({ error }) {
  Sentry.captureException(error);
  return <p>Something went wrong.</p>;
}
```

## Error boundaries

Pair `error.js` with client-side error boundaries for interactive segments, and log errors in `componentDidCatch` or error boundary `useEffect`.

```javascript
'use client';
import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('UI error:', error);
  }, [error]);

  return (
    <div>
      <p>Something went wrong.</p>
      <button onClick={reset}>Retry</button>
    </div>
  );
}
```

## Interview Questions and Answers

### 1. Where do you define route-level error UI?

In `error.js` and `not-found.js` within the route segment.

### 2. What is `instrumentation.ts` used for?

Hooking into server startup to set up tracing or monitoring.
