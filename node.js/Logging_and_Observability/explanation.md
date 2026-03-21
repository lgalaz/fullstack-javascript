# Logging and Observability

## What matters

- Observability is logs, metrics, and traces: the signals you use to understand a running system from the outside.
- Production logs should be structured JSON, not ad hoc strings.

## Interview points

- Emit request IDs / correlation IDs and propagate them across async boundaries.
- Track latency, throughput, error rate, saturation, and event-loop health.
- Use tracing for cross-service request flow, especially in distributed systems.

### Code example

```javascript
const http = require('http');
const {
  monitorEventLoopDelay,
  performance,
} = require('perf_hooks');
const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request latency in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

const requestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const requestErrors = new client.Counter({
  name: 'http_request_errors_total',
  help: 'Total HTTP 5xx responses',
  labelNames: ['method', 'route', 'status_code'],
});

const activeRequests = new client.Gauge({
  name: 'http_requests_in_flight',
  help: 'Requests currently being handled',
});

const eventLoopLag = new client.Gauge({
  name: 'nodejs_event_loop_lag_seconds',
  help: 'Mean event loop lag in seconds',
});

register.registerMetric(requestDuration);
register.registerMetric(requestTotal);
register.registerMetric(requestErrors);
register.registerMetric(activeRequests);
register.registerMetric(eventLoopLag);

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  eventLoopLag.set(histogram.mean / 1e9);
  histogram.reset();
}, 5000);

const server = http.createServer(async (req, res) => {
  if (req.url === '/metrics') {
    res.writeHead(200, { 'Content-Type': register.contentType });
    res.end(await register.metrics());
    return;
  }

  const route = req.url === '/users' ? '/users' : 'unknown';
  const start = performance.now();
  activeRequests.inc();

  try {
    if (route === '/users') {
      await new Promise((resolve) => setTimeout(resolve, 120));
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify([{ id: 1, name: 'Ada' }]));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Internal server error');
  } finally {
    const statusCode = String(res.statusCode);
    const durationSeconds = (performance.now() - start) / 1000;

    activeRequests.dec();
    requestTotal.inc({ method: req.method, route, status_code: statusCode });
    requestDuration.observe(
      { method: req.method, route, status_code: statusCode },
      durationSeconds
    );

    if (res.statusCode >= 500) {
      requestErrors.inc({ method: req.method, route, status_code: statusCode });
    }
  }
});

server.listen(3000);
```

This example tracks:

- latency with `http_request_duration_seconds`
- throughput with `http_requests_total`
- error rate with `http_request_errors_total`
- saturation with `http_requests_in_flight`
- event-loop health with `nodejs_event_loop_lag_seconds`

## Senior notes

- `AsyncLocalStorage` is the standard way to keep request-scoped metadata in Node.
- `pino` is a common Node logging library for fast structured JSON logs.
- Use OpenTelemetry for traces and standard instrumentation where possible.
- Good observability reduces MTTR; it is part of system design, not a later add-on.

## Example

```javascript
const pino = require('pino');
const logger = pino();

logger.info({
  requestId: 'req-123',
}, 'server started');
```
