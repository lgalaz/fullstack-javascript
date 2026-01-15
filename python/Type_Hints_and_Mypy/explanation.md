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

# Accept any iterable of ints and return an int.
def total(nums: Iterable[int]) -> int:
    return sum(nums)
```

## Example: Mypy Error Prevention

```python
def greet(name: str) -> str:
    return "Hello " + name

# Type checkers will flag this as invalid.
greet(42)  # mypy will flag this
```

## Practical Guidance

- Use hints at module boundaries and core APIs first.
  Explanation: start where types give the most leverage for consumers and integrations.
- Enable strict mode gradually.
  Explanation: tighten rules in stages to avoid blocking adoption with a huge error list.
- Document complex types with `TypedDict` or `Protocol`.
  Explanation: `TypedDict` describes dict shapes; `Protocol` describes structural interfaces.
  Example (TypedDict):

```python
from typing import TypedDict

class User(TypedDict):
    id: int
    name: str

def get_name(user: User) -> str:
    return user["name"]

get_name({"id": 1, "name": "Ada"})  # OK
get_name({"id": "x", "name": "Ada"})  # type checker error: id should be int
```

  Example (Protocol):

```python
from typing import Protocol

class SupportsClose(Protocol):
    def close(self) -> None:
        ...

def shutdown(resource: SupportsClose) -> None:
    resource.close()

class FileLike:
    def close(self) -> None:
        print("closed")

shutdown(FileLike())  # OK (structural match)
shutdown(object())  # type checker error: no close()
```
