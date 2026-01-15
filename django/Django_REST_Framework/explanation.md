# Django REST Framework (DRF)

## Why DRF

DRF is the standard way to build APIs with Django.
It provides serializers, authentication, permissions, and a browsable API.

## Serializers

Serializers turn Django model instances into JSON-friendly data and validate incoming JSON into Python types. Think of them like a DTO plus validation: they define the output schema and enforce what input is allowed.

```python
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'body']
```

### Serializer Pitfalls (Performance)

`SerializerMethodField` and `to_representation()` are easy ways to customize output, but they can cause N+1 queries if you hit the database per object. This happens when each serialized row triggers extra queries (e.g., fetching related data inside the serializer).

Why it happens: serializers run per object, so any DB call inside them multiplies with the list size.

How to avoid it:

- Use `select_related`/`prefetch_related` on the queryset.
- Use `annotate()` to compute values in the database.
- Pass precomputed maps in the serializer context.

Example pattern:

```python
# app_name/views.py
from django.db.models import Count

class PostViewSet(ModelViewSet):
    queryset = Post.objects.select_related("author").annotate(comment_count=Count("comment"))
    serializer_class = PostSerializer
```

## Views and ViewSets

In DRF, "views" are still HTTP request handlers, but they return JSON responses instead of HTML. A `ViewSet` groups related actions (list, retrieve, create, update, delete) into a single class so you can wire up CRUD endpoints quickly.

```python
from rest_framework.viewsets import ModelViewSet

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

`queryset` is a Django ORM QuerySet: a lazy, chainable database query that defines which records the API operates on.

## Routers

Routers generate URL patterns for `ViewSet` classes, so you do not have to write each route manually.

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('posts', PostViewSet)
urlpatterns = [
    path("api/", include(router.urls)),
]
```

`PostViewSet` is a class you define (usually in `views.py`) and it typically subclasses `ModelViewSet` from `rest_framework.viewsets`.
`ModelViewSet` provides default CRUD actions (list, retrieve, create, update, delete) based on your queryset and serializer.

When Django starts, `urlpatterns` is loaded by the root URL conf. The router generates URLs like:

- `GET /api/posts/` (list)
- `POST /api/posts/` (create)
- `GET /api/posts/<id>/` (retrieve)
- `PUT/PATCH /api/posts/<id>/` (update)
- `DELETE /api/posts/<id>/` (delete)

## Authentication and Permissions

DRF supports:
- session auth (same as Django)
- token auth
- JWT (via packages)

Permissions can be set globally or per view.

## Throttling

Throttles limit request rates to protect APIs from abuse or accidental overload. DRF supports anonymous and user-based throttling out of the box, and you can add custom throttle classes.

Example settings:

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
}
```

Rate limiting is the general API concept; DRF's "throttling" is its implementation of rate limiting.

## Typical DRF Scaffold

DRF uses the same Django project layout, but adds API-focused pieces:

```
project_root/
  manage.py
  project_name/
    settings.py
    urls.py
  app_name/
    models.py
    serializers.py
    views.py
    urls.py
```

Common pattern: `serializers.py` for API schemas, `views.py` for API views/viewsets, and `urls.py` for API routes.

## Pagination, Filtering, Ordering

DRF has built-in support for pagination and filtering.
Use `django-filter` for advanced filters.

Example settings:

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_FILTER_BACKENDS": [
        "rest_framework.filters.OrderingFilter",
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
}
```

Example viewset:

```python
# app_name/views.py
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["author_id"]
    ordering_fields = ["created_at", "title"]
    ordering = ["-created_at"]
```

Example query params:

- Pagination: `?page=2`
- Filtering: `?author_id=3`
- Ordering: `?ordering=title` or `?ordering=-created_at`
