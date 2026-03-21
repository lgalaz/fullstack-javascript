# Node.js Runtime Architecture and Event Loop

## What matters

- JavaScript runs on one main thread.
- V8 is the JavaScript engine embedded inside Node.js. It parses, compiles, and executes JavaScript.
- `libuv` is the C library that gives Node.js its event loop and async I/O plumbing. It handles timers, sockets, some filesystem work, and the thread pool.
- Node.js is the runtime that combines V8, `libuv`, and Node's built-in APIs like `fs`, `http`, `stream`, `Buffer`, and `process`.
- The thread pool is a small set of worker threads used for operations that cannot stay entirely on the main thread.
- Blocking the main thread blocks all requests in that process.

## Interview points

- Be able to separate responsibilities clearly:
- V8 runs JavaScript.
- `libuv` coordinates the event loop and async I/O work.
- Node.js exposes the runtime APIs and integrates those lower-level pieces into one server-side platform

- Know the queues: `process.nextTick` runs before promise microtasks; microtasks run before the next event-loop phase.
- Know why this matters: long microtask chains can starve I/O just like CPU-heavy loops can.
- Know what uses the thread pool: some filesystem work, DNS, compression, crypto.
- Know what does not become faster just because you used async syntax: CPU-heavy JavaScript still runs on the main thread unless you move it to Worker Threads.
- Know the fix for CPU-heavy work: Worker Threads, not “more async/await”.

## Minimal mental model

- Timers: `setTimeout`, `setInterval`
- Poll: I/O callbacks
- Check: `setImmediate`
- Microtasks: promises, `queueMicrotask`

## Example

```javascript
console.log('start');

setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));

console.log('end');
```

Expected output:

- `start`
- `end`
- `promise`
- `timeout`
