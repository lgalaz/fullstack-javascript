# Modules and Packages

## Introduction

Python modules and packages organize code into reusable units. Understanding imports, package structure, and module search paths prevents common deployment bugs.

## Key Concepts

- A module is a single `.py` file.
- Example:

```python
# math_utils.py
def add(a, b):
    return a + b
```

- A package is a directory with an `__init__.py` (implicit namespace packages are also possible).
- Example:

```text
pkg/
  __init__.py
  helpers.py
```

- Imports are resolved via `sys.path`.
  Example:

```python
import sys
print(sys.path)

# If "pkg/" is on sys.path, this import works:
from pkg import helpers
```

`sys.path` typically includes the script directory (or current working directory), the standard library, `site-packages`, and any `PYTHONPATH` entries.

Implicit namespace packages are package directories without an `__init__.py`. Python can merge multiple directories with the same package name into a single logical package (PEP 420).
Example:

```text
# Both dirs are on sys.path
src1/
  acme/
    utils.py
src2/
  acme/
    api.py
```

```python
from acme import utils, api
```

`__init__.py` makes a directory a regular package and gives you a place to define the package's public API or lightweight initialization (it can be empty).
Example:

```python
# pkg/__init__.py
from .helpers import add, subtract

__all__ = ["add", "subtract"]
```

`__init__.py` is just a module that runs at import time to define package-level exports or initialization.
`__all__` only affects `from package import *`. It does not auto-import names for `import package` or `import package.module1`.
`__init__.py` is just a module that runs at import time.

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
# Import a function from a package module.
from services.users import get_user

print(get_user("u1"))
# e.g. {"id": "u1", "name": "Ada"} depending on get_user implementation
```

## Practical Guidance

- Use absolute imports for clarity.
  Example:

```python
from pkg.helpers import add
```

- Avoid circular imports; extract shared code to common modules.
  Example:

```python
# common.py
def shared():
    return "ok"
```

```python
# a.py
from common import shared
```

```python
# b.py
from common import shared
```

- Keep public APIs in package `__init__.py` when needed.
  Example:

```python
# pkg/__init__.py
from .helpers import add

__all__ = ["add"]
```
