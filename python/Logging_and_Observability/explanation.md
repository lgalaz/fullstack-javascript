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
- Centralize logs with ELK or cloud logging.
- Emit metrics for latency and error rates.
