# Networking and HTTP

## Introduction

Python has solid HTTP client support through `requests` and async libraries like `httpx` or `aiohttp`. Understanding timeouts and retries is critical for reliability.

## Key Concepts

- Always set timeouts.
- Use retries with backoff for transient errors.
- Separate transport errors from application errors.

## Example: HTTP Request with Timeout

```python
# http_example.py
import requests

resp = requests.get('https://example.com', timeout=2)
resp.raise_for_status()
print(resp.text[:100])
```

## Example: Simple Retry

```python
# retry.py
import time
import requests

for attempt in range(3):
    try:
        resp = requests.get('https://example.com', timeout=2)
        resp.raise_for_status()
        break
    except requests.RequestException:
        time.sleep(2 ** attempt)
```

## Practical Guidance

- Use session objects for connection reuse.
- Log failed requests with enough context.
- Avoid blocking calls in async contexts.
