# Middleware and Requests

## Request/Response Lifecycle

1. Request enters middleware (top to bottom).
2. URL resolves to a view.
3. View returns a response.
4. Response passes back through middleware (bottom to top).

Top-to-bottom means Django applies middleware in the order listed in `settings.MIDDLEWARE` for incoming requests. Bottom-to-top means the response runs back through those same middleware in reverse order.

Example order:

```python
# settings.py
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
]
```

Request flow:

```
SecurityMiddleware -> SessionMiddleware -> CommonMiddleware -> view
```

Response flow:

```
view -> CommonMiddleware -> SessionMiddleware -> SecurityMiddleware
```

Responses run through middleware so each layer can apply cross-cutting behavior after the view executes. Common uses include setting security headers, saving sessions, compressing responses, handling caching, and modifying cookies.

## Middleware Hooks

In modern Django middleware, `__call__` wraps both the request and response via the `get_response` callable. Optional hooks like `process_response` and `process_exception` let you target specific phases.

```python
import time

class ExampleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Request-only logic: attach data for views/logging.
        request.start_time = time.time()
        response = self.get_response(request)
        # Response is returned unchanged.
        return response

    def process_response(self, request, response):
        # Old-style middleware hook; runs after the view and can modify the response.
        response["X-Example"] = "true"
        return response

    def process_exception(self, request, exception):
        # Old-style middleware hook; runs if the view raises an exception.
        return None
```

New-style exception handling uses `try/except` around `get_response`:

```python
class ExceptionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            return self.get_response(request)
        except Exception:
            # handle or re-raise
            raise
```

Because middleware wraps `get_response`, the same middleware is invoked on the way in and out. The request hits `__call__` top-to-bottom, the response returns through those same `__call__` frames bottom-to-top.

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
