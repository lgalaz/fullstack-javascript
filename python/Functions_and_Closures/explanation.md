# Functions and Closures

## Introduction

Functions are first-class objects in Python. Closures let you capture variables from outer scopes, which is useful for factories, decorators, and configuration.

## Key Concepts

- Functions can be passed, stored, and returned.
- Closures capture free variables from enclosing scopes.
- Default arguments are evaluated once at definition time.

## Example: Closure as a Factory

```python
# closures.py
def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

by_three = make_multiplier(3)
print(by_three(10))  # 30
```

## Example: Default Argument Gotcha

```python
# defaults.py
# Default list is shared across calls.

def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item(1))  # [1]
print(add_item(2))  # [1, 2]
```

Correct approach:

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

## Practical Guidance

- Use closures for small, local configuration patterns.
- Avoid mutable defaults.
- Keep function signatures explicit and readable.
