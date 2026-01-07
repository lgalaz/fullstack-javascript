# Annotations

## Introduction

Annotations attach metadata to functions, parameters, and variables. They are commonly used for type hints, but they do not enforce types at runtime by themselves. An annotation can be any Python expression, so frameworks can read them for routing, validation, serialization, or other metadata.

## Function Annotations

```python
def greet(name: str) -> str:
    return f"Hello {name}"
```

Annotations live in `__annotations__`:

```python
print(greet.__annotations__)
# {'name': <class 'str'>, 'return': <class 'str'>}
```

## Annotations as General Metadata

```python
def route(method: str, path: str):
    def decorator(func):
        func.__route__ = {"method": method, "path": path}
        return func
    return decorator

def get(path: str):
    return route("GET", path)

@get("/users/{id}")
def show_user(id: int) -> dict:
    return {"id": id}

print(show_user.__annotations__)
# {'id': <class 'int'>, 'return': <class 'dict'>}
print(show_user.__route__)
# {'method': 'GET', 'path': '/users/{id}'}
```

This example shows how frameworks might combine annotations (type hints) with separate metadata (here a decorator) to define behavior like routing.

## Variable Annotations

```python
count: int = 0
names: list[str] = ["Ada", "Linus"]
```

## Forward References

```python
from __future__ import annotations

class Node:
    def __init__(self, next: Node | None = None):
        self.next = next
```

`from __future__ import annotations` stores annotations as strings to avoid runtime name issues.

## Annotated Metadata

```python
from typing import Annotated

def parse_port(port: Annotated[int, "1-65535"]):
    return port
```

`Annotated` lets you attach extra metadata for validators or tooling.

## When Annotations Are a Good Idea

- Public APIs and shared codebases for clarity.
- Tooling support with mypy, pyright, or IDEs.
- Runtime metadata for validation or serialization frameworks.

## When to Avoid

- Small scripts where type hints add noise.
- Highly dynamic code where annotations become misleading.

## Practical Guidance

- Keep annotations accurate and maintain them as code changes.
- Pair with static type checking for real safety.
- Avoid runtime dependency on annotations unless you control evaluation order.
