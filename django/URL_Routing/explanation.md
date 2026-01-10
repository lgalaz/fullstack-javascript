# URL Routing

## Basics

URLs map paths to views.

```python
# mysite/urls.py
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('blog/', include('blog.urls')),
]
```

## Path Converters

```python
path('posts/<int:id>/', views.post_detail)
path('users/<slug:username>/', views.profile)
```

Common converters: `int`, `slug`, `uuid`, `str`, `path`.

## App URLs and Namespacing

```python
# blog/urls.py
app_name = 'blog'
urlpatterns = [
    path('posts/<int:id>/', views.post_detail, name='detail'),
]
```

Then reverse with `reverse('blog:detail', args=[id])`.

## Reversing URLs

Use `reverse()` or `{% url %}` to avoid hardcoded paths.

```python
from django.urls import reverse
reverse('blog:detail', args=[42])
```

## Regular Expressions

For complex matching use `re_path`, but prefer `path` for readability.

## Trailing Slashes

By default Django appends slashes with `APPEND_SLASH=True`.
Be consistent to avoid redirects.
