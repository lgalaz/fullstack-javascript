# Deployment and Production

## Core Checklist

- `DEBUG = False`
- Set `ALLOWED_HOSTS`
- Configure `SECRET_KEY` via env
- Set up static/media hosting
- Run migrations
- Set secure headers

## WSGI vs ASGI

- WSGI for traditional sync apps (Gunicorn).
- ASGI for async, websockets, or background tasks (Uvicorn, Daphne).

## Typical Stack

- Nginx or Caddy as reverse proxy
- Gunicorn or Uvicorn as app server
- Postgres as the database
- Redis for cache and sessions (optional)

## Logging

Configure `LOGGING` to emit structured logs and errors to your observability stack.

## CI/CD

Run tests and migrations in staging before production.
