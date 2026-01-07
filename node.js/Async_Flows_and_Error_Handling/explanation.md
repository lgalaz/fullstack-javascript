# Async Flows and Error Handling in Node.js

## Introduction

Node.js is asynchronous by default. Senior-level Node work depends on understanding how asynchronous code schedules, how errors propagate, and how to design reliable flow control.

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
- At the top-level, handle errors and set `process.exitCode` rather than calling `process.exit()` immediately (this keeps the current event loop turn alive so buffered logs flush, in-flight requests can finish, and `finally` blocks or graceful shutdown logic can run; only set it if it is still `0` so later failures do not get overwritten).
- Avoid throwing inside `setTimeout` without a try/catch around the callback (errors thrown there are not caught by outer try/catch, become uncaught exceptions, and can crash the process; handle the error in the callback or reject a promise instead).

These patterns are called "error boundaries" because they are the places where errors cross async boundaries. If you miss these boundaries, errors can become unhandled rejections or uncaught exceptions that crash the process.

Example: try/catch inside an async function:

```javascript
// async-try-catch.js
const fs = require('fs/promises');

async function loadUser(id) {
  try {
    const text = await fs.readFile(`./users/${id}.json`, 'utf8');
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Failed to load user ${id}: ${error.message}`);
  }
}

loadUser('123')
  .then(user => console.log(user))
  .catch(error => console.error(error.message));
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

Unhandled rejections can terminate the process (Node has tightened this behavior over time) and are always a sign of a bug.

```javascript
process.on('unhandledRejection', reason => {
  console.error('Unhandled rejection:', reason);
  process.exitCode = 1;
});
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

const controller = new AbortController();

work(controller.signal)
  .then(console.log)
  .catch(error => {
    console.error('Canceled:', error.name);
  });

controller.abort();
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
