# Debugging and Troubleshooting

## Introduction

Debugging Node.js involves stack traces, runtime flags (command-line options like `--inspect`, `--trace-warnings`, or `--trace-deprecation`), and tooling like the inspector (the built-in debugging interface that lets you attach Chrome DevTools to set breakpoints and profile). Fast triage depends on knowing where to look and how to reproduce issues.

## Common Tools

- `node --inspect` to enable the debugger.
- `node --trace-warnings` to locate warning sources.
- `node --trace-deprecation` to find deprecated API usage.

## Example: Using the Inspector

The inspector lets you attach Chrome DevTools to a Node process for breakpoints, profiling, and heap snapshots.

Run:

```
node --inspect server.js
```

Then open Chrome and visit:

```
chrome://inspect
```

## Example: Capture Stack Traces

Stack traces show the path of function calls leading to an error. They are the first place to look when debugging crashes. By default, unhandled errors print stack traces to the process stderr; if you run under a process manager (PM2, systemd, Docker), the stack trace shows up in that manager's logs.

```javascript
function risky() {
  throw new Error('boom');
}

try {
  risky();
} catch (error) {
  console.error(error.stack);
}
```

## Practical Guidance

- Reproduce issues with minimal input and realistic data.
- Add targeted logs around suspected code paths.
- Use heap snapshots for memory leaks and CPU profiles for hot paths (a heap snapshot captures the objects in memory and their references at a point in time, which helps you find what is retaining memory).

Example: take a heap snapshot when memory keeps growing:

```javascript
// heap-snapshot.js
const fs = require('fs');
const v8 = require('v8');

// If RSS (resident set size: total memory held by the process) or heap usage
// grows over time without dropping, it can indicate a leak.
// Capture a snapshot to inspect retained objects in DevTools.
function takeSnapshot(label) {
  const file = `${label}-${Date.now()}.heapsnapshot`;
  const snapshot = v8.getHeapSnapshot();
  const out = fs.createWriteStream(file);
  snapshot.pipe(out);
  out.on('finish', () => {
    console.log('Heap snapshot written to', file);
  });
}

setInterval(() => {
  const { heapUsed } = process.memoryUsage();
  console.log('heapUsed MB:', Math.round(heapUsed / 1024 / 1024));
  if (heapUsed > 200 * 1024 * 1024) {
    takeSnapshot('high-heap');
  }
}, 5000);
```
