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

```python
# blog/urls.py
from django.urls import re_path
from . import views

urlpatterns = [
    re_path(r"^posts/(?P<slug>[-a-z0-9]+)/$", views.post_detail, name="post_detail"),
]
```

```python
# blog/views.py
from django.http import HttpResponse

def post_detail(request, slug):
    return HttpResponse(f"Post slug: {slug}")
```

## Trailing Slashes

By default Django appends slashes with `APPEND_SLASH=True`.
Be consistent to avoid redirects.

If a URL pattern ends with `/` and a request comes in without it, Django will redirect:

```python
# urls.py
path("posts/", views.post_list)
```

Requesting `/posts` redirects to `/posts/`. This adds an extra round trip, so pick a style and stick to it.

Common practice: keep Django defaults (trailing slashes with `APPEND_SLASH=True`) unless you have a strict API style that omits them. If you go slashless, set `APPEND_SLASH=False` and ensure all URLs and links omit the slash.

Trailing-slash normalization is common in other frameworks too (for example Rails, Laravel, and Express setups that use `strict` routing with redirects).
