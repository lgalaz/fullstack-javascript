# Ecosystem

This section collects common Python ecosystem tools referenced across the tutorial.

## Task Queues and Workers

Celery is the most common distributed task queue in Python. It runs background jobs (emails, data processing, scheduled work) using a broker like Redis or RabbitMQ.

## Web Servers (WSGI/ASGI)

WSGI servers: gunicorn, uWSGI.  
ASGI servers: uvicorn, daphne.

## Testing Stack

- pytest (test runner)
- pytest-asyncio (async tests)
- pytest-cov / coverage.py (coverage)
- pytest-xdist (parallel test execution across CPU cores)
- tox or nox (multi-env test runs)
- factory_boy + faker (test data)

## HTTP Clients

- requests (sync HTTP)
- httpx or aiohttp (async HTTP)

## Databases and ORMs

- SQLAlchemy (ORM/SQL toolkit)

## Data Validation and Settings

Pydantic is a data validation and settings library built on Python type hints. It parses input data (dicts, JSON) into typed models, validates fields, and provides clear error messages. It is widely used for request/response schemas in APIs (FastAPI) and for configuration with env-based settings.

Example (validating input at a boundary):

```python
from pydantic import BaseModel, EmailStr, ValidationError

class UserIn(BaseModel):
    id: int
    email: EmailStr
    is_active: bool = True

payload = {"id": "123", "email": "ada@example.com"}
user = UserIn.model_validate(payload)

try:
    UserIn.model_validate({"id": "x", "email": "not-an-email"})
except ValidationError as exc:
    print(exc)
```

## Packaging and Environments

- venv + pip (env + dependencies)
- pyenv (Python versions)
- pyproject.toml (project metadata)

## Type Checking

- mypy (static type checking)
