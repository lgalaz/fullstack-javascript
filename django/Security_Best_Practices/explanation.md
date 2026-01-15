# Security Best Practices

## Core Defaults

Django protects against common web attacks by default:
- SQL injection (ORM parameterization).
- XSS (template auto-escaping).
- CSRF (CSRF middleware + tokens).

## Recommended Settings

- `DEBUG = False` in production.
- `SECURE_SSL_REDIRECT = True`
- `SESSION_COOKIE_SECURE = True`
- `CSRF_COOKIE_SECURE = True`
- `SECURE_HSTS_SECONDS = 31536000`
- `SECURE_BROWSER_XSS_FILTER = True`
- `SECURE_CONTENT_TYPE_NOSNIFF = True`

## Input Validation

Validate user input at the form or serializer layer.
Never trust raw `request.POST` or query params.

## Authentication Hardening

- Use strong password policies.
- Enable MFA if possible.
- Protect login endpoints with rate limiting.

## Rate Limiting (Non-DRF)

Django does not ship a built-in rate limiter. Common options:

- `django-ratelimit` for per-view throttling
- `django-axes` for login abuse protection
- Edge limits via Nginx/Cloudflare

Minimal example with `django-ratelimit`:

```python
# app_name/views.py
from django.http import HttpResponse
from ratelimit.decorators import ratelimit

@ratelimit(key="ip", rate="10/m", block=True)
def signup(request):
    return HttpResponse("ok")
```

With block=True, django-ratelimit returns a 403 Forbidden by default. You can customize the response by handling the Ratelimited exception or using a custom view/handler.

## Secrets

Never commit secrets. Use env vars or a secrets manager.
