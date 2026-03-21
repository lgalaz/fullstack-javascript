# Process Management and Signals

## What matters

- A Node service is an OS process with a lifecycle.
- Production reliability depends on startup validation, signal handling, and graceful shutdown.

### Lifecycle

- `startup`: load config, validate environment, initialize dependencies, and start listening.
- `running`: handle requests, timers, background jobs, and open resource usage.
- `shutdown requested`: receive `SIGTERM` or `SIGINT`, stop taking new work, and begin draining.
- `cleanup`: finish in-flight work where possible and close servers, DB pools, queues, and other resources.
- `exit`: terminate with an exit code once cleanup is complete or a shutdown deadline is reached.

## Interview points

- Handle `SIGTERM` and `SIGINT`.
- Use `process.exitCode` instead of forcing `process.exit()` unless you truly must abort immediately. A signal is an OS notification like “terminate” or “interrupt”.
- Stop accepting new work before shutdown, then drain in-flight work.

## Senior notes

- Shutdown should be idempotent.
- Use a deadline so shutdown cannot hang forever.

```js
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  const deadline = setTimeout(() => {
    console.error(`Forced exit after ${signal} deadline`);
    process.exit(1);
  }, 10_000);

  deadline.unref();

  try {
    await closeHttpServer();
    await closeDatabasePool();
    clearTimeout(deadline);
    process.exitCode = 0;
  } catch (err) {
    clearTimeout(deadline);
    process.exitCode = 1;
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

- Config validation belongs at startup, not halfway through request handling.
