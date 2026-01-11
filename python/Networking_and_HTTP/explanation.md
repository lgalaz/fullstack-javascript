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
- Log failed requests with enough context.
- Avoid blocking calls in async contexts.
