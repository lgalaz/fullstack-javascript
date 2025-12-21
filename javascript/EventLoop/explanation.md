# Event Loop in JavaScript - Comprehensive Study Guide

## Introduction

JavaScript is single-threaded, meaning it can only execute one piece of code at a time. The event loop is the mechanism that allows JavaScript to handle asynchronous operations without blocking the main thread.

## Components of the Event Loop

### Call Stack

The call stack is a data structure that keeps track of function calls. When a function is called, it's pushed onto the stack. When it returns, it's popped off.

```javascript
function foo() {
  console.log('foo');
  bar();
}

function bar() {
  console.log('bar');
}

foo();
// Execution: console.log('foo') -> bar() -> console.log('bar') -> foo() returns
// Output: foo, bar
```

### Web APIs (Browser Environment)

These are browser-provided APIs for asynchronous operations like `setTimeout`, `fetch`, DOM events, etc. When an async operation is initiated, it's handled by the Web API, and the callback is scheduled to run later.

### Task Queues

- **Macrotask Queue (Callback Queue)**: Contains tasks like `setTimeout`, `setInterval`, I/O operations, UI rendering.
- **Microtask Queue**: Contains microtasks like `Promise` callbacks, `MutationObserver`, `process.nextTick` (Node.js).

Microtasks have higher priority and are executed before the next macrotask.

## How the Event Loop Works

1. Execute code on the call stack.
2. When an async operation is encountered, hand it off to Web APIs.
3. When the async operation completes, its callback is added to the appropriate queue.
4. When the call stack is empty, the event loop checks for tasks:
   - First, process all microtasks in the microtask queue.
   - Then, process one macrotask from the macrotask queue.
5. Repeat.

## Execution Order Example

```javascript
console.log('start');

setTimeout(() => {
  console.log('timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('promise');
});

console.log('end');

// Output: start, end, promise, timeout
```

Why? Synchronous code runs first. `setTimeout` callback goes to macrotask queue. Promise callback goes to microtask queue. After sync code, microtasks run first, then macrotasks.

## Microtasks vs Macrotasks

### Microtasks

- Executed after the current operation completes, before the next macrotask.
- Examples: `Promise.then()`, `Promise.catch()`, `MutationObserver`, `process.nextTick`.

### Macrotasks

- Executed one at a time, after all microtasks are processed.
- Examples: `setTimeout`, `setInterval`, `setImmediate`, I/O operations, UI rendering.

### Complex Example

```javascript
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise in timeout'));
}, 0);

Promise.resolve().then(() => {
  console.log('promise 1');
  setTimeout(() => console.log('timeout in promise'), 0);
});

Promise.resolve().then(() => console.log('promise 2'));

console.log('end');

// Output: start, end, promise 1, promise 2, timeout 1, promise in timeout, timeout in promise
```

## Why setTimeout(0) Doesn't Execute Immediately

`setTimeout(callback, 0)` schedules the callback to run after at least 0 milliseconds, but it still goes through the event loop. The callback is placed in the macrotask queue. If there are microtasks pending, they execute first.

```javascript
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('promise'));
// Promise logs first, then timeout
```

## Event Loop in Node.js vs Browser

### Browser

- Uses Web APIs for async operations.
- Has a rendering phase between macrotasks.

### Node.js

- Uses libuv for async operations.
- Phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks.
- `process.nextTick` is a microtask in Node.js.

## Common Pitfalls

### Blocking the Event Loop

Long-running synchronous operations can block the event loop:

```javascript
// Bad: Blocks for 5 seconds
function block() {
  const start = Date.now();
  while (Date.now() - start < 5000) {}
}
```

### Microtask Starvation

Too many microtasks can starve macrotasks:

```javascript
// Creates infinite microtasks
Promise.resolve().then(() => {
  console.log('microtask');
  return Promise.resolve();
}).then(() => {
  // This creates more microtasks
});
```

## Interview Questions and Answers

### 1. Explain the event loop.

The event loop is JavaScript's mechanism for handling asynchronous operations in a single-threaded environment. It continuously checks if the call stack is empty. If so, it processes tasks from queues: first all microtasks, then one macrotask. This allows non-blocking I/O and responsive UIs.

### 2. Difference between micro and macro tasks.

Microtasks (like Promise callbacks) are processed after the current operation but before the next macrotask. Macrotasks (like setTimeout callbacks) are processed one at a time after all microtasks. Microtasks have higher priority.

### 3. Why does setTimeout(0) not execute immediately?

setTimeout(0) schedules the callback for the next tick of the event loop. Even with 0 delay, it goes to the macrotask queue. Any pending microtasks execute first, so the callback doesn't run immediately.