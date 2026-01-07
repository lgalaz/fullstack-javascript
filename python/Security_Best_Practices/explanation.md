# Security Best Practices

## Introduction

Python security is about safe dependencies, input validation, and safe defaults. Senior engineers assume untrusted input and compromised clients.

## Key Areas

- Validate and sanitize user input.
- Pin and audit dependencies.
- Handle secrets safely.
- Use TLS for all network traffic.

## Example: Input Validation

```python
# validate.py
import re

username_re = re.compile(r'^[a-z0-9_]{3,20}$', re.I)

def validate_username(value):
    if not username_re.match(value):
        raise ValueError('invalid username')
```

## Practical Guidance

- Use secrets managers instead of committing secrets.
- Keep dependencies updated.
- Use parameterized queries for SQL.
