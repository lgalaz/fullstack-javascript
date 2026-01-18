# Ecosystem

This section highlights Django’s built-in components and the most common add-ons teams reach for in production.

## ORM and Migrations

Django ships with a full ORM (Django ORM) and migrations framework out of the box, so you usually do not need external ORMs.

## Templates and Admin

Django includes the Django Template Language (DTL) and the admin site, which cover server-rendered UI and internal CRUD tooling.

## Caching

Django includes a built-in cache (django.core.cache) framework with multiple backends (local memory, file, database, Memcached, Redis).

## Django Core Cache (details)

`django.core.cache` provides a unified API for storing computed data so you can avoid repeated database or expensive work. It supports per-view caching, low-level key/value caching, and template fragment caching.

Template fragment caching means caching only a specific block of a rendered template (not the whole page), so expensive sections can be reused while the rest stays dynamic.

Common configuration (local memory, good for dev):

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "unique-app-cache",
        "TIMEOUT": 300,
    }
}
```

Redis (via `django-redis`):

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    }
}
```

Memcached:

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        "LOCATION": "127.0.0.1:11211",
    }
}
```

Database-backed cache (simple, slower):

```python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "django_cache",
    }
}
```

Basic usage:

```python
from django.core.cache import cache

def get_stats():
    stats = cache.get("stats_v1")
    if stats is None:
        stats = expensive_stats_query()
        cache.set("stats_v1", stats, timeout=300)
    return stats
```

## Caching Strategy (Practical)

- Cache at the right layer: per-view, template fragment, or low-level key/value.
- Use versioned keys (`stats_v1`) so you can invalidate by bumping the version.
- Prefer short TTLs for volatile data; use explicit invalidation for critical correctness.
- Avoid cache stampedes by using a lock or "dogpile" protection in hot paths.
- Keep cache keys deterministic and stable across deployments.

Per-view cache example:

```python
from django.views.decorators.cache import cache_page

@cache_page(60)  # seconds
def homepage(request):
    return render(request, "home.html")
```

## Storage

Django provides a storage API for file handling. For cloud storage (S3, GCS, Azure), use `django-storages`.


Example usage:

```python
# models.py
from django.db import models

class Document(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to="docs/")
```

```python
# views.py
# FileField handles storage; saving the model writes the uploaded file to the configured backend.
def upload_doc(request):
    if request.method == "POST":
        doc = Document.objects.create(
            title=request.POST.get("title", ""),
            file=request.FILES["file"],
        )
        return redirect("doc_detail", doc_id=doc.id)
    return render(request, "doc_upload.html")
```

```html+django
<!-- templates/doc_upload.html -->
<form method="post" enctype="multipart/form-data">
  {% csrf_token %}
  <input type="text" name="title" placeholder="Title">
  <input type="file" name="file" required>
  <button type="submit">Upload</button>
</form>
```

By default, files are stored locally using `MEDIA_ROOT`/`MEDIA_URL`. To use S3, configure a storage backend (via `django-storages`) and keep the same model/view code:

```python
# settings.py
INSTALLED_APPS = [
    # ...
    "storages",
]

DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
AWS_STORAGE_BUCKET_NAME = "my-bucket"
AWS_S3_REGION_NAME = "us-east-1"
AWS_ACCESS_KEY_ID = "..."
AWS_SECRET_ACCESS_KEY = "..."
```

## APIs (DRF)

Django REST Framework (DRF) is the standard add-on for building JSON APIs with serializers, viewsets, and auth/permission tooling.

## Testing Tooling

Common add-ons include `pytest-django` for a nicer test runner, `factory_boy` for factories, and `pytest-cov` for coverage.

`factory_boy` (equivalent of model factories in Laravel) builds model instances and relationships; `Faker` generates realistic field values (names, emails, addresses). They are often used together.

Use Django Debug Toolbar locally for profiling SQL queries, headers, diagnostics and request timing. (Similar to PHP Debugbar)

## Background Jobs and Scheduling

Django does not ship a built-in queue or scheduler. Common options are Celery (with Redis/RabbitMQ), Django-Q, RQ, and APScheduler/cron for scheduled jobs.
Key names: Celery, Django-Q, RQ, APScheduler.

`Django-Q` is a Django-native task queue that can use Redis or the database as a broker and includes a scheduler and an admin UI.
