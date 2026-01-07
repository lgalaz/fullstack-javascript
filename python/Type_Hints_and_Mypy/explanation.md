# Type Hints and Mypy

## Introduction

Type hints improve readability and tooling without changing runtime behavior. Mypy (or pyright) checks types statically to catch errors earlier.

## Key Concepts

- Hints use `typing` annotations.
- Static checkers enforce type consistency.
- Type hints are optional but powerful at scale.

## Example: Function Annotations

```python
from typing import Iterable

def total(nums: Iterable[int]) -> int:
    return sum(nums)
```

## Example: Mypy Error Prevention

```python
def greet(name: str) -> str:
    return "Hello " + name

greet(42)  # mypy will flag this
```

## Practical Guidance

- Use hints at module boundaries and core APIs first.
- Enable strict mode gradually.
- Document complex types with `TypedDict` or `Protocol`.
