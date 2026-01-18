# Django CRUD Sample

This is a minimal Django CRUD app that manages `AppUser` records with server-rendered templates. It includes a simple login gate (session-based, demo credentials) and a small custom middleware example.

## Project description

The app exposes a small set of pages:
- Login/logout.
- List users.
- Create, edit, and delete users.

It is intentionally simple and aimed at learning or demo purposes rather than production use.

## Architecture decisions

- **Django + templates**: Uses server-rendered HTML via Django templates to keep the stack small and easy to follow.
- **Single app**: Business logic lives in the `users` app (`AppUser` profile model + CRUD views).
- **Auth + profile**: Uses Django auth users for login/permissions, with `AppUser` as a profile for extra fields.
- **MySQL backend**: Uses `mysqlclient` and environment-driven settings for local DB configuration.
- **Custom middleware**: `BlockBadUserMiddleware` shows how to intercept requests and return a custom response.
- **Env-driven config**: Loads settings from a `.env` file via `python-dotenv`.

## Setup

1) Create and activate a virtual environment.
```bash
python -m venv .venv
source .venv/bin/activate
```

2) Install dependencies.
```bash
pip install -e .
```

3) Create a MySQL database.
```sql
CREATE DATABASE django CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4) Create a `.env` file in this directory (`samples/django/crud/.env`).
```env
SECRET_KEY=dev-only
DEBUG=true
ALLOWED_HOSTS=127.0.0.1,localhost
DB_NAME=django
DB_USER=root
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306
```

5) Run migrations.
```bash
python manage.py migrate
```

## Run

Development server (WSGI):
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000/`.

ASGI server (uvicorn):
```bash
uvicorn crud_project.asgi:application --reload
```

WSGI server (gunicorn):
```bash
gunicorn crud_project.wsgi:application
```

## Django admin

This project includes Django's built-in admin. To access it:

1) Create an admin user.
```bash
python manage.py createsuperuser
```

2) Visit `http://127.0.0.1:8000/admin/` and log in.

Note: The **Groups** section only appears for superusers (or users with permission to manage groups). If you do not see it, log in with a superuser or create one via `python manage.py createsuperuser`.

Login with:
- Username: `admin`
- Password: `django`

## Notes

- `AppUser.password` is stored in plain text for demo simplicity; do not use this in production.
- The custom middleware blocks sessions with username `bad` as an example.
