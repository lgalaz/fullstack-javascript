# Django REST Framework (DRF)

## Why DRF

DRF is the standard way to build APIs with Django.
It provides serializers, authentication, permissions, and a browsable API.

## Serializers

```python
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'body']
```

## Views and ViewSets

```python
from rest_framework.viewsets import ModelViewSet

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

## Routers

```python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('posts', PostViewSet)
urlpatterns = router.urls
```

## Authentication and Permissions

DRF supports:
- session auth (same as Django)
- token auth
- JWT (via packages)

Permissions can be set globally or per view.

## Pagination, Filtering, Ordering

DRF has built-in support for pagination and filtering.
Use `django-filter` for advanced filters.
