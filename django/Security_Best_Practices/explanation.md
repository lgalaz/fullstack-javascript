# Security Best Practices

## Core Defaults

Django protects against common web attacks by default:
- SQL injection (SQLi; attacker tries to modify queries with crafted input). Django uses ORM parameterization by sending query values separately from SQL so user input cannot alter the query structure.
- XSS (cross-site scripting; attacker injects malicious scripts into pages). Django auto-escapes templates by default, with explicit opt-in for unescaped HTML when you mark content safe.
- CSRF (cross-site request forgery; attacker tricks a logged-in user into submitting a request). Django issues a random per-client secret and requires a matching token on unsafe HTTP methods so cross-site requests are rejected. Django generates the secret (not from `.env`), stores it in the CSRF cookie or session, renders a masked token into forms, and the middleware compares the submitted token with the stored secret.

## Other Framework Examples (XSS Defaults)

- Django: templates escape by default; use `|safe` only for trusted content.
- Next.js/React: JSX escapes by default; `dangerouslySetInnerHTML` renders unescaped HTML (sanitize first).
- Blade (Laravel): `{{ }}` escapes; `{!! !!}` renders unescaped HTML (trusted content only).
- Vue.js: templates escape by default; `v-html` renders unescaped HTML (sanitize first).
- Node.js templating: depends on engine. EJS (Embedded JavaScript templates) uses `<%= %>` for escaped and `<%- %>` for unescaped output. Pug is a templating language where `=` escapes and `!=` is unescaped.

## Recommended Settings

- `DEBUG = False` in production to avoid leaking stack traces, settings, or sensitive info.
- `SECURE_SSL_REDIRECT = True` to force HTTPS and prevent downgraded HTTP requests.
- `SESSION_COOKIE_SECURE = True` to send session cookies only over HTTPS.
- `CSRF_COOKIE_SECURE = True` to send CSRF cookies only over HTTPS.
- `SECURE_HSTS_SECONDS = 31536000` to tell browsers to stick to HTTPS for one year.
- `SECURE_CONTENT_TYPE_NOSNIFF = True` to prevent MIME sniffing and reduce content-type attacks.

## Input Validation

Validate user input at the form or serializer layer.
Never trust raw `request.POST` or query params.

## Authentication Hardening

- Use strong password policies.
- Enable MFA if possible (commonly `django-two-factor-auth`, built on `django-otp`, adds TOTP/SMS flows and integrates with Django auth/admin).
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
    # Responds to POST /signup/ (see urls.py)
    return HttpResponse("ok")
```

```python
# app_name/urls.py
from django.urls import path
from .views import signup

urlpatterns = [
    path("signup/", signup, name="signup"),
]
```

With block=True, django-ratelimit returns a 403 Forbidden by default. You can customize the response by handling the Ratelimited exception or using a custom view/handler.

## Secrets

Never commit secrets. Use env vars or a secrets manager.
