# Scaffolding

## Typical Django Project Layout

```
project_root/
  manage.py
  project_name/
    __init__.py
    settings.py
    urls.py
    wsgi.py
    asgi.py
  app_name/
    __init__.py
    admin.py
    apps.py
    models.py
    tests.py
    views.py
    migrations/
      __init__.py
  templates/
  static/
```

## What Each Part Is For

- `manage.py`: Project CLI entry point (runserver, migrations, tests).
- `project_name/`: Project config package.
- `project_name/settings.py`: Settings for apps, middleware, database, templates, etc.
- `project_name/urls.py`: Root URL routing table.
- `project_name/wsgi.py`: WSGI entry point for sync servers (gunicorn/uWSGI).
- `project_name/asgi.py`: ASGI entry point for async servers (uvicorn/daphne).
- `app_name/`: A Django app that contains a coherent slice of the project.
- `app_name/admin.py`: Admin registrations and admin UI customization.
- `app_name/apps.py`: App configuration (name, signals).
- `app_name/models.py`: Database models and relationships.
- `app_name/views.py`: Request handlers (functions/classes).
- `app_name/tests.py`: Unit/integration tests for the app.
- `app_name/migrations/`: Auto-generated migration files.
- `templates/`: Project-level templates (base layout, shared pages).
- `static/`: Static assets (CSS, JS, images).
- `app_name/modules/`: Optional; use if you split app logic into multiple module files instead of keeping everything in `views.py` or `models.py`.

## Common Additions

- `.env`: Environment variables (SECRET_KEY, DB credentials, etc.).
- `requirements.txt` or `pyproject.toml`: Dependencies.
- `media/`: User uploads (served separately in production).
