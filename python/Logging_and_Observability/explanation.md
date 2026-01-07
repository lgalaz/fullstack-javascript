# Logging and Observability

## Introduction

Logging is essential for debugging and production operations. Python's `logging` module supports structured logs and log levels.

## Key Concepts

- Levels: DEBUG, INFO, WARNING, ERROR, CRITICAL.
- Use structured logs when possible.
- Avoid printing secrets.

## Example: Basic Logging

```python
# logging_example.py
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info("server started", extra={"port": 3000})
```

## Example: Structured JSON Logs

```python
# json_logging.py
import json
import logging

class JsonFormatter(logging.Formatter):
    def format(self, record):
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
```

## Practical Guidance

- Include request IDs in web apps.
- Centralize logs with ELK or cloud logging.
- Emit metrics for latency and error rates.
