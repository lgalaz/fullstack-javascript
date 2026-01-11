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
        # Store items as a list so length and iteration are predictable.
        self._items = list(items)

    def __len__(self):
        # len(inv) uses this.
        return len(self._items)

    def __iter__(self):
        # list(inv) uses this to iterate.
        return iter(self._items)

    def __repr__(self):
        # print(inv) falls back to __repr__ when __str__ is not defined.
        return f"Inventory({self._items!r})"

inv = Inventory(["apple", "banana"])
print(len(inv))
 # 2
print(list(inv))
 # ["apple", "banana"]
print(inv)
 # Inventory(['apple', 'banana'])
```

## Practical Guidance

- Implement dunders to make custom types feel native.
- Keep `__repr__` unambiguous for debugging.
- If you implement `__eq__`, consider `__hash__` for dict/set use.
