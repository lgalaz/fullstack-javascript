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
- At the top-level, handle errors and set `process.exitCode` rather than calling `process.exit()` immediately.
- Avoid throwing inside `setTimeout` without a try/catch around the callback.

## Avoiding Unhandled Rejections

Unhandled rejections can crash the process in future Node versions and are always a sign of a bug.

```javascript
process.on('unhandledRejection', reason => {
  console.error('Unhandled rejection:', reason);
  process.exitCode = 1;
});
```

## Cancellation with AbortController

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
- Treat every async boundary as an error boundary.
- Use timeouts and cancellation for external I/O.
