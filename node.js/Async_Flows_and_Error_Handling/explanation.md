# Async Flows and Error Handling in Node.js

## Introduction

Node.js is asynchronous by default. 

## Core Patterns

- Callback style: `function(err, result)`
- Promises: explicit success/failure channels
- `async`/`await`: structured, try/catch-based flow

## Example: Promise + async/await

```javascript
// read-file.js
const fs = require('fs/promises');

async function readConfig() {
  try {
    const text = await fs.readFile('./config.json', 'utf8');
    const config = JSON.parse(text);
    return config;
  } catch (error) {
    // Wrap or enrich errors with context
    throw new Error(`Failed to load config: ${error.message}`);
  }
}

readConfig()
  .then(config => {
    console.log('Config loaded:', config);
  })
  .catch(error => {
    console.error('Startup error:', error.message);
    process.exitCode = 1;
  });
```

## Error Boundaries in Async Code

- Use `try/catch` inside `async` functions.
- At the top-level, handle errors and set `process.exitCode` rather than calling `process.exit()` immediately (this keeps the current event loop turn alive so buffered logs flush, in-flight requests can finish, and `finally` blocks or graceful shutdown logic can run; only set it if it is still `0` so earlier failures do not get overwritten).
- Also handle `unhandledRejection` so promise rejections do not go unnoticed.
```javascript
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  if (!process.exitCode || process.exitCode === 0) {
    process.exitCode = 1;
  }
});
```
- Also handle `uncaughtException` and termination signals (`SIGINT`, `SIGTERM`) so you can log, set `exitCode`, and shut down cleanly.
```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  if (!process.exitCode || process.exitCode === 0) {
    process.exitCode = 1;
  }
});

function handleShutdown(signal) {
  console.error(`Received ${signal}, shutting down...`);
  if (!process.exitCode || process.exitCode === 0) {
    process.exitCode = 1;
  }
  // Close servers, flush logs, etc.
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
```
- Avoid throwing inside `setTimeout` without a try/catch around the callback (outer `try/catch` only covers the current call stack; timer callbacks run later on a new turn, so errors there become uncaught exceptions unless you handle them inside the callback or reject a promise).

These patterns are called "error boundaries" because they are the places where errors cross async boundaries. If you miss these boundaries, errors can become unhandled rejections or uncaught exceptions that crash the process.

Example: throwing inside a timer vs handling it safely:

```javascript
// timer-error-boundary.js
try {
  setTimeout(() => {
    throw new Error('boom'); // Not caught by the outer try/catch.
  }, 10);
} catch (error) {
  // This never runs.
  console.error('Outer catch:', error.message);
}

// The callback runs on a later event-loop turn, after the outer try/catch scope has finished.

setTimeout(() => {
  try {
    throw new Error('boom');
  } catch (error) {
    console.error('Handled in callback:', error.message);
  }
}, 20);

function rejectFromTimer() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('boom'));
    }, 30);
  });
}

rejectFromTimer().catch(error => {
  console.error('Handled via promise:', error.message);
});
```

Example: try/catch inside an async function:

```javascript
// async-try-catch.js
const fs = require('fs/promises');

async function loadUser(id) {
  try {
    const text = await fs.readFile(`./users/${id}.json`, 'utf8');
    return JSON.parse(text);
  } catch (error) {
    // Preserve the original error as the cause for better debugging.
    throw new Error(`Failed to load user ${id}: ${error.message}`, { cause: error });
  }
}

loadUser('123')
  .then(user => console.log(user))
  .catch(error => console.error(error.message));
```

why add cause:

Adding `cause` preserves the original error while still giving your higher-level message. That keeps the stack trace and root failure intact, which makes debugging much faster, and allows logging tools to show both the high‑level context and the underlying error.

```javascript
// async-try-catch.js
const fs = require('fs/promises');

async function loadUser(id) {
  try {
    const text = await fs.readFile(`./users/${id}.json`, 'utf8');
    return JSON.parse(text);
  } catch (error) {
    // Preserve the original error for better diagnostics.
    throw new Error(`Failed to load user ${id}`, { cause: error });
  }
}
```

Example of how it shows up:

```javascript
loadUser('123').catch(err => {
  console.error(err.message);       // Failed to load user 123
  console.error(err.cause);         // Original error (e.g., ENOENT)
});
```

Example: top-level error handling with `process.exitCode`:

```javascript
// top-level-error.js
async function main() {
  throw new Error('startup failed');
}

main().catch(error => {
  console.error('Fatal:', error.message);
  process.exitCode = 1;
});
```

Example: handle errors inside `setTimeout` callbacks:

```javascript
// timeout-error.js
setTimeout(() => {
  try {
    throw new Error('timer failed');
  } catch (error) {
    console.error('Timer error:', error.message);
  }
}, 100);
```

## Avoiding Unhandled Rejections

It’s when a promise rejects and there’s no rejection handler attached by the time the current turn of the event loop finishes.

Common cases:

- throw inside an async function with no .catch() on the returned promise.
- Promise.reject(...) without a handler.
- A promise chain where a .catch() is missing at the end.
- Fire‑and‑forget async calls you never await or handle.
- Rejections inside callbacks where the promise is created but nobody consumes it.

If a handler is attached later, Node will emit rejectionHandled, but it’s still a bug: the rejection was unhandled at the time it occurred.

Unhandled rejections can terminate the process (Node has tightened this behavior over time) and are always a sign of a bug.

```javascript
async function syncUser() {
  throw new Error('sync failed');
}

function handleRequest(req, res) {
  syncUser(); // fire-and-forget: no await, no .catch()
  res.end('ok');
}

process.on('unhandledRejection', reason => {
  console.error('Unhandled rejection:', reason);
  process.exitCode = 1;
});
```

Example: rejectionHandled (handler attached after the rejection fires):

```javascript
// rejection-handled.js
process.on('unhandledRejection', reason => {
  console.error('Unhandled rejection:', reason.message);
});

process.on('rejectionHandled', promise => {
  console.error('rejectionHandled: handler attached later');
});

const p = Promise.reject(new Error('late handler'));

setTimeout(() => {
  p.catch(() => {}); // Handler added on a later turn.
}, 0);
```

## Cancellation with AbortController

`AbortController` is a standard API for canceling asynchronous work. It creates an `AbortSignal` that you pass into an operation. When you call `abort()`, the signal flips to an aborted state and the operation should stop and reject with an `AbortError`.

Key pieces:

- `new AbortController()` creates `{ signal, abort() }`.
- `signal.aborted` is a boolean you can check.
- `signal.addEventListener('abort', ...)` lets you react to cancellation.
- Many Node APIs accept `{ signal }` (fetch, timers, streams, etc.).
- You can combine signals with `AbortSignal.any([signalA, signalB])` so any canceler stops the operation.
- You can create timeouts with `AbortSignal.timeout(ms)` and combine them with manual aborts.

Example below uses `timers/promises` to show a cancelable delay.

```javascript
// cancelable-fetch.js
const { setTimeout: delay } = require('timers/promises');

async function work(signal) {
  await delay(500, null, { signal });
  return 'done';
}

// Done case: no cancellation.
const doneController = new AbortController();
work(doneController.signal)
  .then(result => console.log('Done:', result))
  .catch(error => console.error('Done error:', error.name));

// Canceled case: abort before the delay completes.
const canceledController = new AbortController();
work(canceledController.signal)
  .then(result => console.log('Canceled result:', result))
  .catch(error => console.error('Canceled:', error.name));

setTimeout(() => {
  canceledController.abort();
}, 100);
```

## Practical Guidance

- Prefer promises/`async`/`await` for readability and consistent error handling.
- Treat every async boundary as an error boundary (an async boundary is any handoff where work continues later, like promises, timers, or callbacks; an error boundary is the place you must catch and handle errors so they do not become unhandled).
- Use timeouts and cancellation for external I/O (networks and databases can hang indefinitely; timeouts cap how long you wait, and cancellation stops work so your app can recover or retry).

Example: timeout + cancellation with `fetch`:

```javascript
// fetch-timeout.js
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

fetchWithTimeout('https://example.com', 1000)
  .then(text => console.log(text.slice(0, 50)))
  .catch(error => {
    console.error('Request failed:', error.name);
  });
```

Example: timeout + cancellation with a database client pattern:

```javascript
// db-timeout.js
const { setTimeout: delay } = require('timers/promises');

async function queryWithTimeout(queryFn, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // queryFn should accept a signal and stop work if aborted.
    return await queryFn({ signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Example usage (pseudo client)
async function fakeDbQuery({ signal }) {
  await delay(200, null, { signal });

  return { rows: [{ id: 1 }] };
}

queryWithTimeout(fakeDbQuery, 100)
  .then(result => console.log(result))
  .catch(error => console.error('DB error:', error.name));
```
