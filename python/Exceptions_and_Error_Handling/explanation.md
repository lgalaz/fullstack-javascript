# Exceptions and Error Handling

## Introduction

Python uses exceptions to signal errors. Senior developers treat exception handling as control of failure paths, not normal flow.

## Key Concepts

- Raise specific exceptions.
- Catch only what you can handle.
- Use `finally` or context managers for cleanup.

## Example: Specific Exception Handling

```python
# exceptions.py
def load_config(path):
    try:
        with open(path, 'r', encoding='utf8') as f:
            return f.read()
    except FileNotFoundError:
        return None
    except PermissionError as exc:
        raise RuntimeError(f"Access denied: {path}") from exc
```

## Example: Custom Exception

```python
class ValidationError(Exception):
    pass

def validate_age(age):
    if age < 0:
        raise ValidationError("age must be positive")
```

## Practical Guidance

- Do not catch `Exception` unless you re-raise or log with context.
- Prefer catching specific exception types so you only handle expected failures.
- Avoid using exceptions for normal control flow.
- Include actionable context in error messages.
- Classify exceptions by origin: user/input errors (validation) vs system/runtime errors (I/O, network, dependencies), and handle them differently.
- Distinguish user errors (invalid input) from system errors (IO, network, dependencies) and handle or surface them differently.

Example:

```python
class UserInputError(ValueError):
    pass

def parse_age(text):
    try:
        age = int(text)
    except ValueError as exc:
        raise UserInputError("age must be a number") from exc
    if age < 0:
        raise UserInputError("age must be non-negative")
    return age

def load_profile(path):
    try:
        with open(path, "r", encoding="utf8") as f:
            return f.read()
    except OSError as exc:
        raise RuntimeError("system error reading profile") from exc
```
