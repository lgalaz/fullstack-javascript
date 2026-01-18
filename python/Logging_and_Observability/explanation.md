# Logging and Observability

## Introduction

Logging is essential for debugging and production operations. Python's `logging` module supports structured logs and log levels. Observability tools (logs, metrics, traces) provide visibility into performance, regressions, and refactor impact.

## Key Concepts

- Levels: DEBUG, INFO, WARNING, ERROR, CRITICAL.
- Use structured logs when possible.
- Avoid printing secrets.
- `__name__` is the current module name; `logging.getLogger(__name__)` creates a namespaced logger (it is `"__main__"` when run as a script).

## Example: Basic Logging

```python
# logging_example.py
import logging

# Configure root logging once at app startup.
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Attach structured context with extra fields.
logger.info("server started", extra={"port": 3000})
```

## Example: Structured JSON Logs

```python
# json_logging.py
import json
import logging

class JsonFormatter(logging.Formatter):
    def format(self, record):
        # Convert LogRecord fields into JSON text.
        data = {
            "level": record.levelname,
            "message": record.getMessage(),
        }
        return json.dumps(data)

handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())

logger = logging.getLogger("app")
logger.addHandler(handler)
logger.setLevel(logging.INFO)

logger.info("user logged in")
# {"level": "INFO", "message": "user logged in"}
```

## Practical Guidance

- Include request IDs in web apps.
- Explanation: request IDs let you trace a single request across logs from multiple services.
- Example:

```python
import logging

logger = logging.getLogger(__name__)

class RequestLogger(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        kwargs.setdefault("extra", {})
        # self.extra comes from LoggerAdapter and is set in the constructor.
        kwargs["extra"]["request_id"] = self.extra["request_id"]
        return msg, kwargs

req_logger = RequestLogger(logger, {"request_id": "req-123"})
req_logger.info("fetching profile")
```

- Centralize logs with ELK or cloud logging.
- Explanation: ELK (Elasticsearch, Logstash, Kibana) and cloud logging (CloudWatch, Stackdriver, etc.) aggregate logs for search, alerts, and retention.
- Example:

```python
import json
import logging

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter('%(message)s'))
logger.addHandler(handler)

logger.info(json.dumps({"service": "api", "event": "started"}))
# Ship stdout to ELK or your cloud logging agent.
```

Example: minimal shipping config (Logstash):

```conf
input {
  stdin { }
}
output {
  elasticsearch { hosts => ["http://localhost:9200"] }
}
```

- Emit metrics for latency and error rates.
Explanation: metrics provide numeric signals for alerting and dashboards.
Example:

```python
import time
from prometheus_client import Counter, Histogram
# prometheus_client is the Python client library for Prometheus metrics.
# Prometheus is an open‑source monitoring/observability system focused on collecting and storing time‑series metrics, with alerting and a query language (PromQL).

REQUESTS = Counter("requests_total", "Total requests")
LATENCY = Histogram("request_latency_seconds", "Request latency")

def handle_request():
    start = time.perf_counter()
    try:
        REQUESTS.inc()
        # work...
    finally:
        LATENCY.observe(time.perf_counter() - start)
```

Example: OpenTelemetry tracing

```python
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

resource = Resource.create({"service.name": "api"})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("process_request") as span:
    span.set_attribute("user_id", 123)
    # work...
```
