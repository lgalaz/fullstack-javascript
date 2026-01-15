# Decorators

## Introduction

Decorators wrap functions or classes to add behavior without changing the original implementation. They are a core Python feature and are frequently used for logging, caching, retries, and authorization.

## The @ Syntax

The `@` syntax is just shorthand. This:

```python
@log_call
def add(a, b):
    return a + b
```

is equivalent to:

```python
def add(a, b):
    return a + b

add = log_call(add)
```

When decorators are stacked, they apply from the bottom up:

```python
@a
@b
def fn():
    pass

fn = a(b(fn))
```

## Basic Function Decorator

```python
def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_call
def add(a, b):
    return a + b
```

## Decorators by Convention

By convention, a decorator takes a function and returns a function. It can return the same function (just with metadata added) or wrap it to change behavior.

```python
def mark(label):
    def decorator(func):
        func.__label__ = label
        return func
    return decorator
```

## Preserve Metadata with functools.wraps

```python
from functools import wraps

def log_call(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper
```

## Decorators with Arguments

```python
from functools import wraps

def retry(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            last_exc = None
            for _ in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    last_exc = exc
            raise last_exc
        return wrapper
    return decorator

@retry(3)
def flaky():
    raise RuntimeError("fail")
```

## Decorators for Metadata

Decorators are often used to attach metadata that frameworks can read.

```python
def route(method, path):
    def decorator(func):
        func.__route__ = {"method": method, "path": path}
        return func
    return decorator

def get(path):
    return route("GET", path)

@get("/users/{id}")
def show_user(id: int) -> dict:
    return {"id": id}

print(show_user.__route__)
# {'method': 'GET', 'path': '/users/{id}'}
```

## Common Standard Library Decorators

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

## When Decorators Are a Good Idea

- You need reusable cross-cutting behavior.
- You want to keep core logic small and focused.
- You need declarative syntax for registration or configuration.

## When to Avoid

- The wrapper makes debugging or stack traces confusing.
- The behavior is so specific that a direct call is clearer.
- The decorator hides expensive work or side effects.

## Practical Guidance

- Always use `functools.wraps` for function decorators.
- Keep decorator logic small and well documented.
- Prefer explicit function calls when clarity matters more than elegance.
