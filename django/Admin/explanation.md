# Admin

## Why It Matters

Django admin provides a ready-to-use interface for managing data.
It is a powerful internal tool with minimal setup.

## Registering Models

```python
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

## Customizing Admin

```python
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'published_at')
    search_fields = ('title',)
    list_filter = ('published_at',)
```

## Inlines

```python
class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    inlines = [CommentInline]
```

## Permissions

Admin respects Django permissions and groups.
You can override `has_view_permission` or `has_change_permission` for fine control.
