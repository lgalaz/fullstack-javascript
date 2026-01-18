# Testing

## TestCase and Client

```python
from django.test import TestCase

class HomeTests(TestCase):
    def test_home(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
```

## Database Isolation

Each test runs in a transaction and rolls back to keep data isolated.

Django creates a separate test database. If your `DATABASES` setting uses SQLite, tests run on a temporary SQLite DB by default. For Postgres/MySQL, Django creates a dedicated test database for that backend. Use the same engine as production if you rely on database-specific behavior.

Why SQLite for tests:

- Fast setup (no external server).
- Clean, isolated database per test run.
- Good fit for unit and view tests where DB-specific behavior is not the focus.

Note: Django's test runner wraps each test in a transaction and rolls back, which is fast. If you're testing concurrency or database locks, use `TransactionTestCase` for more realistic behavior.

## DB Connection Limits and Pooling (PgBouncer)

Postgres has a hard limit on concurrent connections, and each connection consumes memory. In larger apps or during test runs with parallel workers, you can hit connection limits even if queries are light. PgBouncer is a lightweight Postgres connection pooler that sits between Django and Postgres, multiplexing many short-lived client connections over fewer database connections (multiplexing means one server connection is reused by many clients, but only one client uses it at a time).

Why use it:

- Avoid "too many connections" errors as traffic or test concurrency grows.
- Reduce database memory overhead from idle connections.
- Smooth spikes when many processes start at once (test runners, job workers).

When to use it:

- You have multiple app servers or background workers.
- You run tests in parallel (pytest-xdist runs tests across CPU cores) or heavy integration tests.
- Your DB connection limit is low relative to your process count.

Pool modes matter:

- `session`: one client holds one server connection for the entire session.
- `transaction`: server connections are assigned per transaction; lower DB load but some features (like server-side cursors that stream large result sets and require a stable connection) are incompatible.

Django settings for PgBouncer (transaction pooling):

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "app",
        "USER": "app",
        "PASSWORD": "secret",
        "HOST": "pgbouncer",
        "PORT": "6432",
        "CONN_MAX_AGE": 0,  # keep Django from holding long-lived connections
        "DISABLE_SERVER_SIDE_CURSORS": True,  # required for transaction pooling
    }
}
```

If you use `session` pooling, you can allow persistent connections (`CONN_MAX_AGE`) like normal. Always align Django's connection behavior with the PgBouncer pool mode.

## Factories and Fixtures

- Fixtures for static data.
- Factories (factory_boy) for dynamic data.

## Testing Views and Forms

Use the test client to post form data and assert errors.

## Pytest

Many teams use `pytest-django` for better fixtures and output.

## Typical Django Testing Stack

A common, practical setup looks like:

- **Test runner**: `pytest` with `pytest-django` (or Django's built-in test runner for smaller projects).
- **Factories**: `factory_boy` for model instances with sensible defaults.
- **API tests**: Django REST Framework's `APIClient` or `APIRequestFactory` if you're building APIs.
- **View tests**: Django's `TestCase` (class) + test client (`self.client.get/post`) to assert status, templates, redirects, and context.
- **External HTTP**: `pytest-httpserver` for predictable upstream responses when your app calls other services.
- **Async/browser tests**: `playwright` or `selenium` for full-page flows and JS-heavy UI.
- **Coverage**: `coverage.py` or `pytest-cov`.
- **Linters**: `ruff` or `flake8` to keep tests and code clean.

Django adds helpful testing utilities on top of plain Python:

- `TestCase` with database isolation and automatic migrations.
- The test client for views and forms (`self.client.get/post`).
- URL reversing (`reverse`, like Laravel route helper for named routes)  and test helpers for middleware/auth.
- DRF's (Django REST Framework) API test helpers when building JSON APIs. (APIClient and APIRequestFactory). APIRequestFactory builds mock HTTP requests for views.

## URL Reversing

URL reversing means generating a URL path from a named route, instead of hard-coding paths in tests.
It keeps tests resilient to URL changes and ensures routes match the URL conf.

```python
from django.urls import reverse

url = reverse("post_list")
response = self.client.get(url)
```

## Django's Built-in Test Runner

Django's built-in test runner is invoked via `manage.py test`. Example:

```bash
python manage.py test
```

You can target an app or test module:

```bash
python manage.py test users
python manage.py test users.tests.test_views
```

## API Test Example (DRF)

```python
from rest_framework.test import APITestCase
from django.urls import reverse

class PostApiTests(APITestCase):
    def test_list_posts(self):
        url = reverse("post-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
```

## flake8 (linting)

flake8 is a Python linter that checks code style and common errors.
It runs multiple checks (pycodestyle + pyflakes + optional plugins) and reports issues with line numbers.

```bash
flake8
flake8 users tests
```
