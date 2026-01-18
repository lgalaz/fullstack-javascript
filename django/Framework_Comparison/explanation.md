# Django vs Flask vs FastAPI

## Quick Comparison

| Framework | Best for | Strengths | Trade-offs |
| --- | --- | --- | --- |
| Django | Full-stack web apps | Batteries-included: ORM, admin, auth, templates, migrations | Heavier; more opinionated |
| Flask | Small, custom apps | Minimal core, flexible architecture | You assemble most parts yourself |
| FastAPI | High-performance APIs | Async-first, type hints, automatic OpenAPI docs | Smaller ecosystem for full-stack needs |

## When to Use Django

- You want a cohesive, batteries-included stack.
- You need ORM + migrations + admin without extra assembly.
- You are building a server-rendered app or a large monolith.
- You want strong defaults for security and project structure.

## When to Use Flask

- You want a lightweight core and full control over libraries.
- You are building a small service, prototype, or embedded API.
- You do not need Django's admin/ORM, or you already have your own stack.
- You are okay with assembling auth, migrations, and admin manually.

## When to Use FastAPI

- You are building an API-first service with async I/O.
- You want strict request/response schemas and generated docs.
- You need high throughput and low latency for JSON APIs.
- Your team is comfortable with type hints and Pydantic models.

## Rules of Thumb

- If you need a full product quickly, pick Django.
- If you want a tiny core and custom architecture, pick Flask.
- If you are API-first and performance-focused, pick FastAPI.

## Ecosystem Notes

- Django has the deepest built-in stack (auth, admin, ORM, forms, templating).
- Flask relies on extensions for auth, ORM, and admin (e.g., Flask-Login, SQLAlchemy).
- FastAPI pairs well with SQLAlchemy/SQLModel and async drivers; it is not a full-stack web framework.
