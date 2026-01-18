# Security Best Practices

## Introduction

Python security is about safe dependencies, input validation, and safe defaults. You should assume untrusted input and compromised clients.

## Key Areas

- Validate and sanitize user input.
- Pin and audit dependencies.
- Handle secrets safely.
- Use TLS for all network traffic.

## Example: Input Validation

```python
# validate.py
import re

# Allow letters, numbers, and underscore, 3-20 chars.
username_re = re.compile(r'^[a-z0-9_]{3,20}$', re.I)

def validate_username(value):
    # Reject values that do not match the whitelist.
    if not username_re.match(value):
        raise ValueError('invalid username')
```

## Example: Pin and Audit Dependencies

```bash
# Pin exact versions (requirements.txt)
requests==2.31.0
```

```bash
# Check for known vulnerabilities
pip-audit
```

## Example: Handle Secrets Safely

```python
# config.py
import os

# Load secrets from environment variables, not source control.
DB_PASSWORD = os.environ["DB_PASSWORD"]
```

## Example: Use TLS for Network Traffic

```python
import requests

resp = requests.get("https://example.com", timeout=2)
resp.raise_for_status()
```

## Practical Guidance

- Use secrets managers instead of committing secrets.
  Example:

```python
import os

# e.g., AWS Secrets Manager/SSM injects env vars at runtime.
API_KEY = os.environ["API_KEY"]
```

- Keep dependencies updated.
  Example:

```bash
pip list --outdated
pip install -U requests
```

- Use parameterized queries for SQL.
  Example:

```python
import sqlite3

conn = sqlite3.connect("app.db")
cur = conn.cursor()
cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
```
