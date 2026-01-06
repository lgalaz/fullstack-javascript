# Debugging and Troubleshooting

## Introduction

Debugging Node.js involves stack traces, runtime flags, and tooling like the inspector. Fast triage depends on knowing where to look and how to reproduce issues.

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

Stack traces show the path of function calls leading to an error. They are the first place to look when debugging crashes.

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
- Use heap snapshots for memory leaks and CPU profiles for hot paths.
