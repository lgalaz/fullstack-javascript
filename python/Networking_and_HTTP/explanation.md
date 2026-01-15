# Networking and HTTP

## Introduction

Python has solid HTTP client support through `requests` and async libraries like `httpx` or `aiohttp`. Understanding timeouts and retries is critical for reliability.

## Key Concepts

- Always set timeouts.
- Use retries with backoff for transient errors.
- Separate transport errors from application errors.

Transport errors are failures to reach or complete the HTTP request (DNS issues, timeouts, connection resets). Application errors are valid HTTP responses that indicate a problem at the app level (4xx/5xx with an error body).

## Example: HTTP Request with Timeout

```python
# http_example.py
import requests

# Make a GET request with a 2s timeout.
resp = requests.get('https://example.com', timeout=2)
# Raise if we got a 4xx/5xx response.
resp.raise_for_status()
# Show a preview of the response body.
print(resp.text[:100])
```

## Example: Simple Retry

```python
# retry.py
import time
import requests

for attempt in range(3):
    try:
        # Try the request up to 3 times.
        resp = requests.get('https://example.com', timeout=2)
        resp.raise_for_status()
        break
    except requests.RequestException:
        # Back off: 1s, 2s, 4s.
        time.sleep(2 ** attempt)
```

## Practical Guidance

- Use session objects for connection reuse.
  Explanation: sessions keep TCP connections alive and reuse them across requests for better performance.
- Log failed requests with enough context.
  Explanation: include URL, method, status code, and a correlation ID to debug failures quickly (a correlation ID is a unique request ID used to trace logs across services).
- Avoid blocking calls in async contexts.
  Explanation: in async code, use async HTTP clients to avoid blocking the event loop.
