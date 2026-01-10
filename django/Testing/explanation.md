# Testing

## TestCase and Client

```python
from django.test import TestCase

class HomeTests(TestCase):
    def test_home(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
```

## Database Isolation

Each test runs in a transaction and rolls back to keep data isolated.

## Factories and Fixtures

- Fixtures for static data.
- Factories (factory_boy) for dynamic data.

## Testing Views and Forms

Use the test client to post form data and assert errors.

## Pytest

Many teams use `pytest-django` for better fixtures and output.
