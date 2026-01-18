# Testing with pytest

## Introduction

pytest is the de facto testing framework in Python. It provides simple test discovery, powerful fixtures, and great ecosystem support.

## Key Concepts

- Tests are functions named `test_*`.
- `assert` is used directly.
- Fixtures provide reusable setup (functions that return data or resources injected into tests).

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

## Example: Fixture with Teardown

```python
import pytest

@pytest.fixture
def temp_dir(tmp_path):
    # tmp_path is a built-in pytest fixture injected by name.
    # Use a temporary directory provided by pytest.
    return tmp_path

def test_writes_file(temp_dir):
    file_path = temp_dir / "note.txt"
    file_path.write_text("hello", encoding="utf8")
    assert file_path.read_text(encoding="utf8") == "hello"
```

## Example: Custom Fixture

```python
import pytest

@pytest.fixture
def api_client():
    # Create a simple test client with shared config.
    return {"base_url": "https://example.test", "token": "test-token"}

def test_builds_url(api_client):
    url = f"{api_client['base_url']}/health"
    assert url.endswith("/health")
```

## Example: Property Test (Hypothesis)

```python
from hypothesis import given, settings
from hypothesis.strategies import integers

@settings(max_examples=200)
@given(integers(), integers())
def test_add_commutative(a, b):
    assert a + b == b + a
```

Note: Hypothesis explores many inputs (including edge cases) and shrinks failures to minimal examples. Faker is better for realistic data generation, not property-based testing.
You can configure settings per environment using profiles (e.g., set `HYPOTHESIS_PROFILE=ci`), or pass `@settings(...)` directly on specific tests.
By default Hypothesis runs many examples per test (default max_examples is 100), not just one. It will stop early on a failure, and may run fewer if data generation is rejected or filtered.

## Practical Guidance

- Keep tests fast and deterministic.
- Use fixtures for shared setup.
- Add integration tests for I/O boundaries.

## Common Testing Stack

- Unit tests: pytest
- API tests: pytest + requests/httpx or framework test clients (FastAPI/Django)
- Async tests: pytest-asyncio
- Property tests: hypothesis (tests general properties across many generated inputs, not single examples)
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
