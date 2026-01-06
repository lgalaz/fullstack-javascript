# Node.js Runtime Architecture and Event Loop

## Introduction

Node.js runs JavaScript on V8 and uses libuv to provide an event-driven, non-blocking I/O model. Understanding the event loop, task queues, and how native I/O is delegated is essential for performance and correctness.

## What the Event Loop Does

- JavaScript runs on a single main thread.
- I/O (network, file system, DNS, timers) is handled by libuv and the OS, then callbacks are scheduled back onto the event loop.
- The event loop runs in phases (timers, pending callbacks, idle/prepare, poll, check, close callbacks).
- Microtasks (Promise callbacks) and `process.nextTick` run between phases and can starve the loop if abused.

## Why It Matters

- Blocking the main thread blocks all requests.
- Understanding queue order helps prevent race conditions and unexpected timing bugs.
- Correct use of microtasks vs. macrotasks avoids subtle performance issues.

## Example: Event Loop Order

This example schedules work in multiple queues (timers, microtasks, immediates, and I/O). It shows how Node orders those queues so you can reason about timing bugs and "why did this run first?" surprises.

```javascript
// event-loop.js
console.log('start');

setTimeout(() => {
  console.log('setTimeout 0');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});

process.nextTick(() => {
  console.log('nextTick');
});

Promise.resolve().then(() => {
  console.log('promise');
});

const fs = require('fs');
fs.readFile(__filename, () => {
  console.log('readFile');
});

console.log('end');
```

Typical output (order can vary slightly by platform):

```
start
end
nextTick
promise
setTimeout 0
setImmediate
readFile
```

### How to Reason About This

- `process.nextTick` runs before Promise microtasks.
- Promise microtasks run before timers and I/O callbacks.
- `setImmediate` runs in the check phase, often after I/O callbacks.
- `fs.readFile` callback runs when the I/O completes and is polled.

## Practical Guidance

- Use async I/O instead of CPU-heavy loops.
- Offload CPU work to Worker Threads for real parallelism.
- Keep microtask chains short to avoid starving I/O.
- Measure with `perf_hooks` and profiling tools when performance matters.
