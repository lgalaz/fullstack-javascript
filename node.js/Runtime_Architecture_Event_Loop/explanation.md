# Node.js Runtime Architecture and Event Loop

## Introduction

Node.js runs JavaScript on V8 and uses libuv to provide an event-driven, non-blocking I/O model. Understanding the event loop, task queues, and how native I/O is delegated is essential for performance and correctness.

## Libuv in a Nutshell

libuv is the C library that powers Node's event loop and async I/O. It abstracts OS-specific APIs for networking, files, timers, and DNS, and it provides a thread pool for work that cannot be done asynchronously by the OS (like some filesystem operations). It is the reason Node can handle many concurrent I/O operations without blocking the JavaScript thread.

## What the Event Loop Does

- JavaScript runs on a single main thread.
- I/O (network, file system, DNS, timers) is handled by libuv and the OS, then callbacks are scheduled back onto the event loop.
- The event loop runs in phases (timers, pending callbacks, idle/prepare, poll, check, close callbacks).
- Microtasks (Promise callbacks) and `process.nextTick` run between phases and can starve the loop if abused.

## Why It Matters

- Blocking the main thread blocks all requests.
- Understanding queue order helps prevent race conditions and unexpected timing bugs.
- Correct use of microtasks vs. macrotasks avoids subtle performance issues (microtasks run immediately after the current call stack, before the next event loop phase; macrotasks are scheduled into event loop phases like timers or I/O).

Microtask examples:
- `Promise.resolve().then(...)`
- `queueMicrotask(() => ...)`

Macrotask examples (event loop phases):
- Timers phase: `setTimeout`, `setInterval`
- Poll phase (I/O): `fs.readFile`, socket data events
- Check phase: `setImmediate`

## Example: Event Loop Order

This example schedules work in multiple queues (timers, microtasks, immediates, and I/O). It shows how Node orders those queues so you can reason about timing bugs and "why did this run first?" surprises.

```javascript
// event-loop.js
console.log('start');

setTimeout(() => {
  console.log('setTimeout 0'); // timers phase
}, 0);

setImmediate(() => {
  console.log('setImmediate'); // check phase
});

process.nextTick(() => {
  console.log('nextTick'); // nextTick queue (runs before microtasks)
});

Promise.resolve().then(() => {
  console.log('promise'); // microtask queue
});

const fs = require('fs');
fs.readFile(__filename, () => {
  console.log('readFile'); // poll phase (I/O callbacks)
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
- Offload CPU work to Worker Threads for real parallelism (if the machine has only one CPU core, you will not get true speedup, though it can still keep the main thread responsive).
- Keep microtask chains short to avoid starving I/O.
- Measure with `perf_hooks` and profiling tools when performance matters.
