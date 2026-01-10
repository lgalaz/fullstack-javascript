# Middleware and Requests

## Request/Response Lifecycle

1. Request enters middleware (top to bottom).
2. URL resolves to a view.
3. View returns a response.
4. Response passes back through middleware (bottom to top).

## Built-In Middleware

Common ones:
- `SecurityMiddleware`
- `SessionMiddleware`
- `AuthenticationMiddleware`
- `CsrfViewMiddleware`

## Custom Middleware

```python
import time

class RequestTimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.time()
        response = self.get_response(request)
        response['X-Response-Time'] = str(time.time() - start)
        return response
```

## Ordering Matters

The order in `MIDDLEWARE` controls behavior.
For example, `AuthenticationMiddleware` needs sessions to be set up first.
