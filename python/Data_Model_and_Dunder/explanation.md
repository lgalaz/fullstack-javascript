# Data Model and Dunder Methods

## Introduction

Python's data model is defined by special "dunder" methods (double underscore). Implementing them lets your objects integrate with Python syntax and built-ins.

## Key Concepts

- `__repr__` controls developer-facing representation.
- `__str__` controls user-facing string conversion.
- `__len__`, `__iter__`, `__getitem__` enable collection behavior.
- `__eq__` and `__hash__` control equality and hashing.

## Example: Custom Collection

```python
# inventory.py
class Inventory:
    def __init__(self, items):
        self._items = list(items)

    def __len__(self):
        return len(self._items)

    def __iter__(self):
        return iter(self._items)

    def __repr__(self):
        return f"Inventory({self._items!r})"

inv = Inventory(["apple", "banana"])
print(len(inv))
print(list(inv))
print(inv)
```

## Practical Guidance

- Implement dunders to make custom types feel native.
- Keep `__repr__` unambiguous for debugging.
- If you implement `__eq__`, consider `__hash__` for dict/set use.
