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
        # Store instance state.
        self.user_id = user_id
        self.name = name

    def greet(self):
        return f"Hello {self.name}"

u = User("u1", "Ada")
print(u.greet())
# Hello Ada
```

## Example: Composition

```python
# emailer.py
class EmailService:
    def send(self, to, message):
        # In real code, this would talk to an email API.
        print(f"Sending to {to}: {message}")

class Notifier:
    def __init__(self, email_service):
        # Compose behavior by injecting a dependency.
        self.email = email_service

    def notify(self, user, message):
        self.email.send(user, message)

notifier = Notifier(EmailService())
notifier.notify("ada@example.com", "Welcome")
# Sending to ada@example.com: Welcome
```

## Practical Guidance

- Use `@dataclass` for data-heavy classes.
  Explanation: `@dataclass` is a standard library decorator that generates boilerplate like `__init__`, `__repr__`, and `__eq__` from type-annotated fields.
  The `@` symbol applies a decorator to the class, which transforms it at definition time.

- Keep inheritance shallow and purposeful.
  Explanation: deep inheritance trees are hard to reason about and increase coupling.

- Favor clear, small classes over massive hierarchies.
  Explanation: smaller classes are easier to test, reuse, and maintain.
