# OOP and Classes

## Introduction

Python supports object-oriented programming with classes, inheritance, and composition. Senior Python developers favor composition and explicit interfaces over deep inheritance.

## Key Concepts

- Instances hold state; methods define behavior.
- `__init__` sets initial state.
- Prefer composition (has-a) over inheritance (is-a).

## Example: Simple Class

```python
# user.py
class User:
    def __init__(self, user_id, name):
        self.user_id = user_id
        self.name = name

    def greet(self):
        return f"Hello {self.name}"

u = User("u1", "Ada")
print(u.greet())
```

## Example: Composition

```python
# emailer.py
class EmailService:
    def send(self, to, message):
        print(f"Sending to {to}: {message}")

class Notifier:
    def __init__(self, email_service):
        self.email = email_service

    def notify(self, user, message):
        self.email.send(user, message)

notifier = Notifier(EmailService())
notifier.notify("ada@example.com", "Welcome")
```

## Practical Guidance

- Use `@dataclass` for data-heavy classes.
- Keep inheritance shallow and purposeful.
- Favor clear, small classes over massive hierarchies.
