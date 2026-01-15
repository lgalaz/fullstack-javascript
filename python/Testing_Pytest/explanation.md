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
# Simple function under test.
def add(a, b):
    return a + b
```

```python
# test_math.py
from math import add

def test_add():
    # pytest will fail the test if this is False.
    assert add(2, 3) == 5
```

## Example: Fixture

```python
# test_db.py
import pytest

@pytest.fixture
def user():
    # Provide shared setup data to tests.
    return {"id": 1, "name": "Ada"}

def test_user_name(user):
    # Fixture value is injected by pytest.
    assert user["name"] == "Ada"
```

## Practical Guidance

- Keep tests fast and deterministic.
- Use fixtures for shared setup.
- Add integration tests for I/O boundaries.

## Common Testing Stack

- Unit tests: pytest
- API tests: pytest + requests/httpx or framework test clients (FastAPI/Django)
- Async tests: pytest-asyncio
- Property tests: hypothesis
- Coverage: pytest-cov (coverage.py)
- Test envs: tox or nox
- Mocks: unittest.mock or pytest-mock
- Factories/fixtures: factory_boy, faker
- HTTP mocking: responses or respx
- HTTP test server: pytest-httpserver for predictable upstream responses
- Time control: freezegun

Notes:

- hypothesis generates randomized inputs to validate general properties, not just fixed examples.
  Example:

```python
from hypothesis import given
from hypothesis.strategies import integers

@given(integers(), integers())
def test_add_commutative(a, b):
    assert a + b == b + a
# Hypothesis generates many integer pairs and checks the property holds.
```

- factory_boy builds test objects with sensible defaults to reduce boilerplate.
  Example:

```python
import factory

class UserFactory(factory.Factory):
    class Meta:
        model = dict

    id = factory.Sequence(lambda n: n + 1)
    name = "Ada"

user = UserFactory()
print(user["id"], user["name"])
```

- faker generates realistic fake data (names, emails, addresses) for tests.
  Example:

```python
from faker import Faker

fake = Faker()
print(fake.name())
print(fake.email())
```
