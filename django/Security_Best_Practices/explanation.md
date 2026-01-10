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

## Secrets

Never commit secrets. Use env vars or a secrets manager.
