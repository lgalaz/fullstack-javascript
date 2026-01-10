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

## When to Use Which

- FBV: small, custom logic, less abstraction.
- CBV: common patterns (list, detail, create, update) and shared behavior.

## Generic Views

Django provides generic views like `ListView`, `DetailView`, `CreateView`, and `UpdateView`.
They reduce boilerplate for common CRUD pages.

## Request and Response Objects

Views receive `request` and return:
- `HttpResponse`
- `JsonResponse`
- `HttpResponseRedirect`

## Common Helpers

- `render(request, template, context)`
- `redirect('route-name')`
- `get_object_or_404(Model, pk=...)`
