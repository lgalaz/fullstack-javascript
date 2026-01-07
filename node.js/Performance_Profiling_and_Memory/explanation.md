# Performance, Profiling, and Memory

## Introduction

Performance in Node.js is about avoiding event-loop blocking and controlling memory usage. Profiling helps you find bottlenecks rather than guessing.

## Key Concepts

- CPU-bound code blocks the event loop.
- Memory leaks often come from retained references or unbounded caches.
- The V8 garbage collector can cause latency spikes if memory grows.

## Example: Measuring Event Loop Delay

`monitorEventLoopDelay` measures how long the event loop is blocked. Higher numbers mean your code (or GC) is delaying timers and I/O.

```javascript
// loop-delay.js
// Use this in production-like environments to detect event loop stalls.
// It is useful when requests feel slow, timers drift, or CPU spikes occur.
// Run it on a server to spot blocking code or heavy GC pauses.
const { monitorEventLoopDelay } = require('perf_hooks');

const histogram = monitorEventLoopDelay();
histogram.enable();

setInterval(() => {
  const mean = Math.round(histogram.mean / 1e6); // ns to ms
  console.log('Event loop delay (ms):', mean);
  histogram.reset();
}, 1000);
```

## Example: Basic Memory Reporting

This example logs resident set size (RSS) and heap usage so you can detect leaks or unexpected growth.

```javascript
// memory.js
setInterval(() => {
  const mem = process.memoryUsage();
  console.log({
    rss: Math.round(mem.rss / 1024 / 1024) + ' MB',
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + ' MB',
  });
}, 2000);
```

## Practical Guidance

- Use `node --inspect` and the Chrome DevTools profiler.
- Look for high event loop delay and long GC pauses.
- Avoid large in-memory caches without eviction policies.
- Benchmark with realistic data and concurrency.
