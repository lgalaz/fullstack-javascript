# Performance, Profiling, and Memory

## Introduction

Performance in Node.js is about avoiding event-loop blocking and controlling memory usage. Profiling helps you find bottlenecks rather than guessing.

## Key Concepts

- CPU-bound code blocks the event loop.
- Memory leaks often come from retained references or unbounded caches.
- The V8 garbage collector can cause latency spikes if memory grows.

## Example: Measuring Event Loop Delay

```javascript
// loop-delay.js
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
