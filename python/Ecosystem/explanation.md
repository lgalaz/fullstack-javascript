# Ecosystem

This section collects common Python ecosystem tools referenced across the tutorial.

## Task Queues and Workers

Celery is the most common distributed task queue in Python. It runs background jobs (emails, data processing, scheduled work) using a broker like Redis or RabbitMQ.

Example (delegate work and schedule a task):

```python
# tasks.py
from celery import Celery

app = Celery(
    "myapp",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)

# a Celery decorator. It registers the function as a Celery task so it can be sent to workers via .delay() or .apply_async().
@app.task
def send_email(user_id: int) -> str:
    # Do email work here
    return f"sent {user_id}"

# Delegate work to the queue
send_email.delay(123)

# Schedule for later (seconds)
send_email.apply_async((456,), countdown=60)
```

## Web Servers (WSGI/ASGI)

WSGI (Web Server Gateway Inerface) servers: gunicorn, uWSGI.  
ASGI (Async Server Gateway Inerface) servers: uvicorn, daphne.

## Testing Stack

- pytest (test runner)
- pytest-asyncio (async tests)
- pytest-cov / coverage.py (coverage)
- pytest-xdist (parallel test execution across CPU cores)
- tox or nox (multi-env test runs)
You run multi‑env tests when you need to ensure compatibility across multiple Python versions or dependency sets (e.g., 3.9/3.10/3.11, or Django LTS vs latest). It’s common for libraries, CI pipelines, and projects that support more than one runtime or optional extras.
- factory_boy + faker (test data: factory_boy builds model factories; faker generates realistic fake values)

## HTTP Clients

- requests (sync HTTP)
- httpx or aiohttp (async HTTP)
- Django test client (for internal request testing in Django apps)

## Databases and ORMs

- SQLAlchemy (ORM/SQL toolkit)
- Django ORM (built-in ORM for Django apps)

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
