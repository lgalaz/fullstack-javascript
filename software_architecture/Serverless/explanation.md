# Serverless Architecture

## Introduction

Serverless uses managed runtimes (functions or containers) where you deploy code without managing servers. You pay per execution and scale automatically.

## What It Is

- Functions run on demand (FaaS) or managed containers.
- No server management, scaling handled by provider.
- Event-driven by default (HTTP, queues, cron).

## When It Is the Best Solution

- Spiky or unpredictable traffic.
- Small, focused services and background jobs.
- Teams that want minimal operational overhead.

## Misuse and When It Is Overkill

- Overkill for long-running, stateful services.
- Cold starts can hurt latency-sensitive workloads.
- Complex local development or observability needs.

## Example (Function Handler)

```javascript
// handler.js
exports.handler = async (event) => {
  return { statusCode: 200, body: 'ok' };
};
```
