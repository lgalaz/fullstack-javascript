# Testing with pytest

## Introduction

pytest is the de facto testing framework in Python. It provides simple test discovery, powerful fixtures, and great ecosystem support.

## Key Concepts

- Tests are functions named `test_*`.
- `assert` is used directly.
- Fixtures provide reusable setup.

## Example: Unit Test

```python
# math.py
def add(a, b):
    return a + b
```

```python
# test_math.py
from math import add

def test_add():
    assert add(2, 3) == 5
```

## Example: Fixture

```python
# test_db.py
import pytest

@pytest.fixture
def user():
    return {"id": 1, "name": "Ada"}

def test_user_name(user):
    assert user["name"] == "Ada"
```

## Practical Guidance

- Keep tests fast and deterministic.
- Use fixtures for shared setup.
- Add integration tests for I/O boundaries.
