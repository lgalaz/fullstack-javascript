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

## Example: __iter__ with for loop

```python
class CountUp:
    def __init__(self, stop):
        self.stop = stop

    def __iter__(self):
        return iter(range(1, self.stop + 1))

for n in CountUp(3):
    print(n)
    # 1, then 2, then 3
```

## Practical Guidance

- Implement dunders to make custom types feel native.
- Keep `__repr__` unambiguous for debugging.
- Example:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point(x={self.x!r}, y={self.y!r})"

p = Point(1, 2)
print(p)
# Point(x=1, y=2) (clear, developer-focused output)
```

- If you implement `__eq__`, consider `__hash__` for dict/set use.
- Example:

```python
class User:
    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name

    def __eq__(self, other):
        if not isinstance(other, User):
            return NotImplemented
        return self.user_id == other.user_id

    def __hash__(self):
        return hash(self.user_id)

users = {User(1, "Ada"), User(2, "Grace")}
print(User(1, "Ada") in users)  # True
```
