# Modules and Packages

## Introduction

Python modules and packages organize code into reusable units. Understanding imports, package structure, and module search paths prevents common deployment bugs.

## Key Concepts

- A module is a single `.py` file.
- A package is a directory with an `__init__.py` (implicit namespace packages are also possible).
- Imports are resolved via `sys.path`.

## Example: Package Layout

```text
app/
  __init__.py
  services/
    __init__.py
    users.py
  main.py
```

```python
# main.py
from services.users import get_user

print(get_user("u1"))
```

## Practical Guidance

- Use absolute imports for clarity.
- Avoid circular imports; extract shared code to common modules.
- Keep public APIs in package `__init__.py` when needed.
