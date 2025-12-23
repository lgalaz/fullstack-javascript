# Error Handling and Observability 

## Introduction

Next.js provides route-level error UI and supports logging and tracing for production apps.

## Error UI

Use `error.js` and `not-found.js` for route-level handling.

## Logging

Log on the server for critical failures, and use client logging for UI errors.

```javascript
console.error('Failed to load user');
```

Prefer structured logs with request IDs to correlate errors across services.

## Instrumentation

Next.js supports `instrumentation.ts` for advanced tracing and OpenTelemetry setups.

## Error boundaries

Pair `error.js` with client-side error boundaries for interactive segments, and log errors in `componentDidCatch` or error boundary `useEffect`.

## Interview Questions and Answers

### 1. Where do you define route-level error UI?

In `error.js` and `not-found.js` within the route segment.

### 2. What is `instrumentation.ts` used for?

Hooking into server startup to set up tracing or monitoring.
