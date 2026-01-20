# Event Loop in JavaScript 

## Introduction

JavaScript is single-threaded, meaning it can only execute one piece of code at a time. The event loop is the mechanism that allows JavaScript to handle asynchronous operations without blocking the main thread.

## Execution Context

An execution context is the runtime container for code execution. It holds the scope chain (lexical environment), variable bindings, and the `this` value for a given piece of code.

How contexts are created:
- **Global/Module context**: created first when the script or module is loaded.
- **Function context**: created each time a function is invoked (or when a class constructor is called).

What a context contains (simplified):
- **Lexical Environment**: where identifiers are resolved (scope chain).
- **Variable Environment**: `var` bindings and function declarations.
- **This binding**: the value of `this` for that call.

Why this matters for the event loop:
- The call stack is a stack of execution contexts (LIFO).
- Async callbacks run later by creating new function contexts when the event loop dequeues them.
- `await`/Promises schedule microtasks; when they resume, they run in fresh contexts pushed onto the stack.

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

### Event Delegation (DOM)

Event delegation is a pattern where you attach a single event listener to a common ancestor instead of adding listeners to many child elements. Because events bubble up the DOM tree, the ancestor can handle events that originated from its descendants. This is useful for performance (fewer listeners) and for elements added dynamically after the listener is set up.

```html
<ul id="list">
  <li data-id="1">Item 1</li>
  <li data-id="2">Item 2</li>
  <li data-id="3">Item 3</li>
</ul>
```

```javascript
const list = document.getElementById('list');

list.addEventListener('click', event => {
  const item = event.target.closest('li');
  if (!item || !list.contains(item)) return;
  console.log('Clicked item id:', item.dataset.id);
});
```

Why it works: when a click happens on an `<li>`, the event bubbles to the `<ul>`. The handler checks `event.target` to find the actual clicked element and handles it if it matches. Use `closest` to support clicks on nested elements inside the `<li>`. You can stop delegation with `event.stopPropagation()` on a child if needed.

Example with nested content:

```html
<ul id="list">
  <li data-id="1"><span>Item 1</span></li>
</ul>
```

```javascript
list.addEventListener('click', event => {
  console.log(event.target.tagName); // "SPAN" if the span was clicked
  const item = event.target.closest('li'); // finds the parent <li>
  console.log(item.dataset.id); // "1"
});
```

### Task Queues

- **Macrotask Queue (Callback Queue)**: Contains tasks like `setTimeout`, `setInterval`, I/O operations, UI rendering.
- **Microtask Queue**: Contains microtasks like `Promise` callbacks, `MutationObserver`, `process.nextTick` (Node.js).

Microtasks have higher priority and are executed before the next macrotask.

## How the Event Loop Works

- Execution contexts (global/module/function) are pushed onto the call stack (LIFO).
- When async work is initiated, the JS engine calls into browser/Node native APIs via bindings (WebIDL is the spec that describes those interfaces; the browser implements the bindings).
- The native API performs the work and, when ready, enqueues a callback as a task or microtask (depending on the API).
- The event loop runs when the stack is empty: it drains all microtasks, then runs one task, then repeats.

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
- Examples: `Promise.then()`, `Promise.catch()`, `MutationObserver`, `queueMicrotask` (browser), `process.nextTick` (Node).

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

If you want "run as soon as possible after the current call stack," a microtask (`Promise.resolve().then(...)` or `queueMicrotask`) is closer to `process.nextTick` than `setTimeout(0)`.

## Event Loop in Node.js vs Browser

### Browser

- Uses Web APIs for async operations.
- Has a rendering phase between macrotasks: after a task finishes and microtasks drain, the browser may recalculate styles, layout, and paint before running the next task.
- The browser engine embeds the JS engine and also handles DOM, layout, paint, and Web APIs. It schedules rendering between tasks (after microtasks) when there is visual work and a frame boundary.

### Node.js

- Uses libuv for async operations.
- Phases: timers, pending callbacks, idle/prepare, poll, check, close callbacks.
- `process.nextTick` is a microtask in Node.js.
- Node also has microtasks vs tasks: Promises/`queueMicrotask` (and `process.nextTick`) run between phases, while the phase queues are macrotasks.

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
