# Project Layout and Settings

## Typical Layout

```
mysite/
  manage.py
  mysite/
    __init__.py
    settings.py
    urls.py
    wsgi.py
    asgi.py
  app_one/
    models.py
    views.py
    urls.py
    admin.py
    apps.py
    migrations/
```

## Project vs App

- Project: the overall site configuration (settings, root urls).
- App: a reusable unit of functionality (blog, billing, accounts).

You usually have multiple apps inside one project.

## Settings Highlights

- `INSTALLED_APPS`: enables Django apps and third-party packages.
- `MIDDLEWARE`: request/response hooks executed in order.
- `DATABASES`: database configuration.
- `TEMPLATES`: template engine settings and context processors.
- `STATIC_URL`, `STATIC_ROOT`, `MEDIA_URL`, `MEDIA_ROOT`: static and uploaded files.
- `AUTH_USER_MODEL`: custom user model (set early if needed).

## Environment-Specific Settings

Common pattern:

```
settings/
  base.py
  dev.py
  prod.py
```

Then use `DJANGO_SETTINGS_MODULE` to pick the right one. Keep secrets in env vars, not in source.

## Entry Points

- `manage.py`: runs management commands.
- `wsgi.py`: for WSGI servers (Gunicorn, uWSGI).
- `asgi.py`: for ASGI servers (Uvicorn, Daphne), used for async and websockets.
