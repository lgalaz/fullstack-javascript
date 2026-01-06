# Process Management and Signals

## Introduction

Node.js runs as a single OS process. Understanding process lifecycle, environment variables, and signals is critical for production reliability.

## Key Concepts

- `process.env` holds environment variables.
- `process.exitCode` sets the exit code without forcing immediate exit.
- Signals like `SIGTERM` and `SIGINT` let you shut down gracefully.

## Example: Graceful Shutdown

A graceful shutdown stops accepting new requests, finishes in-flight work, and then exits. This prevents dropped connections and partial writes.

```javascript
// shutdown.js
const http = require('http');

const server = http.createServer((_req, res) => {
  res.writeHead(200);
  res.end('ok');
});

server.listen(3000, () => {
  console.log('Server running');
});

function shutdown(signal) {
  console.log(`Received ${signal}, closing...`);
  server.close(err => {
    if (err) {
      console.error('Close error:', err.message);
      process.exitCode = 1;
    }
    process.exit();
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

## Environment Variables

Environment variables are strings provided by the operating system or container runtime. Convert and validate them before use.

```javascript
// env.js
const port = Number(process.env.PORT || 3000);
console.log('Port:', port);
```

## Practical Guidance

- Always handle `SIGTERM` in server processes.
- Use `process.exitCode` instead of `process.exit()` for clean shutdowns.
- Validate environment variables at startup.
