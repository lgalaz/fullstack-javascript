# Logging and Observability

## Introduction

Observability is the ability to understand your system from the outside using logs, metrics, and traces. Node.js apps should produce structured logs and expose metrics for production debugging.

## Structured Logging Example

Structured logs emit machine-readable fields so you can filter and aggregate them in log systems (ELK, Datadog, CloudWatch).

```javascript
// logger.js
function log(level, message, context = {}) {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...context,
  };
  console.log(JSON.stringify(entry));
}

log('info', 'server started', { port: 3000 });
```

## Basic Metrics Example

Metrics are numeric signals you can graph. Here we count requests in memory to show the idea of a counter.

```javascript
// metrics.js
const http = require('http');

let requestCount = 0;
const server = http.createServer((_req, res) => {
  requestCount += 1;
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`requests: ${requestCount}`);
});

server.listen(3000);
```

## Tracing (Conceptual)

Distributed tracing correlates a request across multiple services. In Node.js, you typically use OpenTelemetry to create spans and export them to a collector.

## Practical Guidance

- Use structured logs (JSON) in production.
- Include request IDs to correlate logs across services.
- Emit key metrics: latency, error rate, throughput.
