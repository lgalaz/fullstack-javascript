# Signals

## What Signals Are

Signals let Django notify interested code when a specific event happens.
They are synchronous hooks used for cross-cutting concerns like auditing, cache invalidation, or denormalized updates.

Common built-in signals:
- `pre_save` / `post_save`
- `pre_delete` / `post_delete`
- `m2m_changed`
- `request_started` / `request_finished`

## Laravel Comparison

Django model signals are similar to Laravel Eloquent model events (`creating`, `created`, `updating`, `updated`, `deleting`, `deleted`).
Django also has broader, app-wide signals (like `request_started` and `request_finished`) and supports custom signals for cross-app events.

## Basic Usage

Define receivers in a `signals.py` module and import them in `apps.py` so they are registered on startup.

```python
# app_name/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Invoice

@receiver(post_save, sender=Invoice)
def invoice_saved(sender, instance, created, **kwargs):
    if created:
        # e.g., enqueue a task or create an audit entry
        pass
```

```python
# app_name/apps.py
from django.apps import AppConfig

class BillingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "billing"

    def ready(self):
        # Register signal handlers.
        from . import signals  # noqa: F401
```

Ensure the app config is used in `INSTALLED_APPS` if you renamed it.

## Best Practices

- Keep signal handlers small; avoid heavy business logic.
- Prefer explicit calls if the behavior is core to the flow.
- Use `transaction.on_commit()` when you need DB changes committed before running side effects.
- Use `dispatch_uid` if there is a risk of duplicate registrations (e.g., tests, reloads).

Example with `on_commit`:

```python
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order

@receiver(post_save, sender=Order)
def order_saved(sender, instance, created, **kwargs):
    if created:
        transaction.on_commit(lambda: instance.send_confirmation_email())
```

## Transaction Savepoints

When you wrap code in `transaction.atomic()`, Django creates a savepoint.
If an exception occurs, Django rolls back to that savepoint instead of the start of the outer transaction.
Nested `atomic()` blocks map to nested savepoints, so failures can be isolated.

```python
from django.db import transaction

with transaction.atomic():
    # outer transaction
    do_primary_write()
    try:
        with transaction.atomic():
            # inner savepoint
            do_optional_write()
    except Exception:
        # inner block rolled back; outer transaction can continue
        pass
```

## When to Avoid Signals

- When the behavior is critical to business logic (make it explicit).
- When ordering matters across multiple actions (signals are not ordered across apps).
- When you need a clear call graph for debugging.
