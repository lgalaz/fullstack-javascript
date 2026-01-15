# Views: Function-Based and Class-Based

## Function-Based Views (FBV)

Simple and explicit.

```python
from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'home.html', {'message': 'Hello'})
```

## Class-Based Views (CBV)

Great for reuse via inheritance and mixins.

```python
from django.views.generic import ListView
from .models import Post

class PostListView(ListView):
    model = Post
    template_name = 'posts/list.html'
    paginate_by = 20
```

You wire the class-based view in `urls.py` using `.as_view()`, which turns it into a callable view:

```python
# app_name/urls.py
from django.urls import path
from .views import PostListView

urlpatterns = [
    path("posts/", PostListView.as_view(), name="post_list"),
]
```

`ListView` renders the template with a `post_list` context variable by default, so the HTML is produced by `posts/list.html`.

If you omit `template_name`, Django will look for the conventional template name `post_list.html` inside your app's templates directory.

You set `template_name` as a class attribute on the view:

```python
# app_name/views.py
from django.views.generic import ListView
from .models import Post

class PostListView(ListView):
    model = Post
    template_name = "posts/list.html"
```

## When to Use Which

- FBV: small, custom logic, less abstraction.
- CBV: common patterns (list, detail, create, update) and shared behavior.

FBVs are especially good for:

- Simple pages with a couple of conditions.
- Endpoints that return JSON or small custom responses.
- One-off flows that do not fit generic CRUD patterns.
- When you want explicit control and minimal indirection for debugging.

## Generic Views

Django provides generic views like `ListView`, `DetailView`, `CreateView`, and `UpdateView`.
They reduce boilerplate for common CRUD pages.

Example `CreateView`:

```python
# app_name/views.py
from django.urls import reverse_lazy
from django.views.generic import CreateView
from .models import Post

class PostCreateView(CreateView):
    model = Post
    fields = ["title", "body"]
    template_name = "posts/form.html"
    success_url = reverse_lazy("post_list")
```

## Request and Response Objects

Views receive `request` and return:
- `HttpResponse`
- `JsonResponse`
- `HttpResponseRedirect`

## Common Helpers

- `render(request, template, context)`
- `redirect('route-name')`
- `get_object_or_404(Model, pk=...)`

Examples:

```python
from django.shortcuts import render, redirect, get_object_or_404
from .models import Post

def post_detail(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    return render(request, "posts/detail.html", {"post": post})

def create_post(request):
    if request.method == "POST":
        # ... save post ...
        return redirect("post_list")
    return render(request, "posts/form.html")
```
