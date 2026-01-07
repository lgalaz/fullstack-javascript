# Databases and ORMs

## Introduction

Python supports direct SQL access and ORMs like SQLAlchemy or Django ORM. The right approach depends on performance, complexity, and team preferences.

## Key Concepts

- ORMs speed up development but can hide inefficient queries.
- Parameterized queries prevent SQL injection.
- Connection pooling is critical for web apps.

## Example: SQLAlchemy Core

```python
# db.py
from sqlalchemy import create_engine, text

engine = create_engine('postgresql+psycopg://user:pass@localhost/db', pool_size=5)

with engine.begin() as conn:
    result = conn.execute(text('SELECT id, name FROM users WHERE id = :id'), {'id': 1})
    print(result.fetchone())
```

## Practical Guidance

- Inspect queries in production.
- Use migrations for schema changes.
- Keep transactions short.
