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
    # queryset = Laravel Eloquents QueryBuilder
    queryset = (
        Post.objects
        .select_related("author")
        .annotate(comment_count=Count("comment"))
    )
    serializer_class = PostSerializer
```

`PostSerializer` is the schema for both output and input. It declares which fields are exposed, how related objects are represented, and which fields are read-only (like computed annotations).

```python
# app_name/serializers.py
from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ["id", "title", "body", "author", "author_name", "comment_count"]
        read_only_fields = ["id", "author_name", "comment_count"]
```

How it fits together in a request/response:

`author_name` does not cause N+1 because the viewset uses `select_related("author")`, so each post's author is fetched in the same query.

1) Request hits `GET /api/posts/`.
2) Router maps the URL to `PostViewSet.list`.
3) `queryset` runs (including `select_related` + `annotate`).
4) `PostSerializer(queryset, many=True)` converts rows to JSON.
5) DRF returns a JSON response.

Example response:

```json
[
  {
    "id": 1,
    "title": "Hello",
    "body": "First post",
    "author": 3,
    "author_name": "alice",
    "comment_count": 5
  }
]
```

Example create flow (`serializer.save()`):

```python
# app_name/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

class PostCreateViewSet(ViewSet):
    def create(self, request):
        serializer = PostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        post = serializer.save(author=request.user)
        return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)
```

Complete flow (route -> view -> serializer -> response):

```python
# app_name/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostCreateViewSet

router = DefaultRouter()
router.register("posts", PostCreateViewSet, basename="post")

urlpatterns = [
    path("api/", include(router.urls)),
]
```

1) Client sends `POST /api/posts/` with JSON body.
2) Router maps the URL to `PostCreateViewSet.create`.
3) Serializer validates input and `serializer.save()` creates the row.
4) DRF returns `201` with the serialized response.

Example request:

```http
POST /api/posts/
Content-Type: application/json

{"title": "Hello", "body": "First post", "author": 3}
```

Example response:

```json
{
  "id": 1,
  "title": "Hello",
  "body": "First post",
  "author": 3,
  "author_name": "alice",
  "comment_count": 0
}
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
    # Base queryset for all actions (list/retrieve/update/delete).
    queryset = Post.objects.all()
    # Serializer used to validate input and format output.
    serializer_class = PostSerializer
    # Enables filtering and ordering via query params.
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    # Fields allowed for ?author_id=... filtering.
    filterset_fields = ["author_id"]
    # Fields allowed for ?ordering=created_at or ?ordering=-title.
    ordering_fields = ["created_at", "title"]
    # Default ordering if no ?ordering=... is provided.
    ordering = ["-created_at"]
```

Note: For a `ModelViewSet`, the minimal required configuration is `queryset` and `serializer_class` (or their `get_*` overrides). Everything else is optional.

Example query params:

- Pagination: `?page=2`
- Filtering: `?author_id=3`
- Ordering: `?ordering=title` or `?ordering=-created_at`

## Advanced Patterns

### Per-Action Permissions and Serializers

```python
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer
        return PostSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated()]
        return []
```

### Custom Actions

```python
from rest_framework.decorators import action
from rest_framework.response import Response

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        post = self.get_object()
        post.publish()
        return Response({"status": "published"})
```

### Versioning

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
    "DEFAULT_VERSION": "v1",
    "ALLOWED_VERSIONS": ["v1", "v2"],
}
```

Example URL: `/api/v1/posts/`

### Schema and Docs

DRF can generate OpenAPI schemas. Common add-ons like `drf-spectacular` provide nicer docs and schema customization.
