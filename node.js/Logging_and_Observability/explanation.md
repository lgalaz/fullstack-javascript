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

## Metrics Example (Throughput + Latency)

Metrics are numeric signals you can graph over time. A useful baseline is request throughput (count) and latency (how long requests take). The example below tracks both and exposes them in a Prometheus-style endpoint.

```javascript
// metrics.js
const http = require('http');

let requestCount = 0;
let errorCount = 0;
let totalLatencyMs = 0;

function record(durationMs, statusCode) {
  requestCount += 1;
  totalLatencyMs += durationMs;
  if (statusCode >= 500) errorCount += 1;
}

const server = http.createServer((req, res) => {
  const start = Date.now();

  if (req.url === '/metrics') {
    const avgLatency = requestCount ? totalLatencyMs / requestCount : 0;
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(
      [
        `requests_total ${requestCount}`,
        `errors_total ${errorCount}`,
        `latency_avg_ms ${avgLatency.toFixed(2)}`,
      ].join('\n')
    );
    return;
  }

  // Simulate work
  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ok');
    const duration = Date.now() - start;
    record(duration, res.statusCode);
  }, 50);
});

server.listen(3000);
```

## Tracing (Conceptual)

Distributed tracing correlates a request across multiple services. In Node.js, you typically use OpenTelemetry to create spans and export them to a collector.

## Practical Guidance

- Use structured logs (JSON) in production.
- Include request IDs to correlate logs across services.
- Emit key metrics: latency, error rate, throughput.

## Common Tooling

- Logging: `pino` (fast JSON logs), `winston` (flexible transports), `bunyan` (older JSON logger).
- Metrics: `prom-client` for Prometheus-compatible metrics.
- Tracing: OpenTelemetry (`@opentelemetry/api` plus SDKs/exporters).

Example: `pino` logging:

```javascript
// pino-log.js
const pino = require('pino');
const logger = pino();

logger.info({ userId: 'u1' }, 'user logged in');
logger.error({ err: new Error('boom') }, 'request failed');
```

Example: `prom-client` metrics:

```javascript
// prom-metrics.js
const http = require('http');
const client = require('prom-client');

const counter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
});

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': client.register.contentType });
    res.end(client.register.metrics());
    return;
  }

  counter.inc();
  res.writeHead(200);
  res.end('ok');
});

server.listen(3000);
```

Example: OpenTelemetry tracing:

```javascript
// otel-tracing.js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor, ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { trace } = require('@opentelemetry/api');

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

const tracer = trace.getTracer('app');
const span = tracer.startSpan('work');
span.setAttribute('user.id', 'u1');
span.end();
```
