# Async Flows and Error Handling in Node.js

## What matters

- Node code is mostly async: callbacks, promises, and `async`/`await`.
- `async`/`await` is usually the default for readability, but it does not remove the need for error boundaries. An error boundary is a place where async failures are caught, logged, and translated into a controlled response or shutdown.

## Interview points

- Catch errors at async boundaries: request handler, job handler, CLI entrypoint, startup, shutdown.
- Use `try/catch` in `async` code and preserve context with `new Error(message, { cause })`.
- Handle `unhandledRejection` and `uncaughtException` for logging and controlled shutdown.
- Prefer `process.exitCode` over `process.exit()` so logs and cleanup can finish.

## Common mistakes

- Fire-and-forget promises with no `.catch()`
- Throwing inside timer callbacks and expecting outer `try/catch` to catch it
- Hiding the original failure by rethrowing without context or `cause`

## Example

```javascript
async function main() {
  try {
    await loadConfig();
  } catch (error) {
    throw new Error('Startup failed', { cause: error });
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
```
