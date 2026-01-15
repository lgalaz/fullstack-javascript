# Ecosystem

This section highlights Django’s built-in components and the most common add-ons teams reach for in production.

## ORM and Migrations

Django ships with a full ORM and migrations framework out of the box, so you usually do not need external ORMs.
Key names: Django ORM, QuerySet, `manage.py makemigrations`, `manage.py migrate`.

## Templates and Admin

Django includes the Django Template Language (DTL) and the admin site, which cover server-rendered UI and internal CRUD tooling.
Key names: DTL, `django.contrib.admin`, `ModelAdmin`.

## Caching

Django includes a built-in cache framework with multiple backends (local memory, file, database, Memcached, Redis).
Key names: `django.core.cache`, Memcached, Redis.

## Storage

Django provides a storage API for file handling. For cloud storage (S3, GCS, Azure), use `django-storages`.
Key names: `django.core.files.storage`, `django-storages`.

## APIs (DRF)

Django REST Framework (DRF) is the standard add-on for building JSON APIs with serializers, viewsets, and auth/permission tooling.
Key names: DRF, Serializer, ViewSet, `DefaultRouter`, `APIView`.

## Testing Tooling

Common add-ons include `pytest-django` for a nicer test runner, `factory_boy` for factories, and `pytest-cov` for coverage.
Key names: `pytest-django`, `factory_boy`, `pytest-cov`, Django `TestCase`.

`factory_boy` builds model instances and relationships; `Faker` generates realistic field values (names, emails, addresses). They are often used together.

Use Django Debug Toolbar locally for profiling SQL queries, headers, diagnostics and request timing. (Similar to PHP Debugbar)

## Background Jobs and Scheduling

Django does not ship a built-in queue or scheduler. Common options are Celery (with Redis/RabbitMQ), Django-Q, RQ, and APScheduler/cron for scheduled jobs.
Key names: Celery, Django-Q, RQ, APScheduler.
