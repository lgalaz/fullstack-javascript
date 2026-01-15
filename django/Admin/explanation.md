# Admin

## Why It Matters

Django admin provides a ready-to-use interface for managing data.
It is a powerful internal tool with minimal setup, and gives you CRUD over your models without building a custom UI.

Models are defined in Python code (e.g., `models.py`), not through the admin interface.
The admin is a management UI for those models. You opt models into the admin by registering them and then customize how they appear and behave (list views, filters, search, field layouts, inlines, permissions, custom actions, and more).

The admin UI itself comes from Django's built-in `django.contrib.admin` app. You typically only register models and optionally define `ModelAdmin` classes to control how each model is displayed and managed.

## Registering Models

The leading dot in `from .models` means "import from the current app package".
In Django apps, `models.py` lives alongside `admin.py`, so a relative import keeps the import local to that app.

```python
# app_name/admin.py
from django.contrib import admin
from .models import Post

admin.site.register(Post)
```

This example registers the `Post` model with the admin so it shows up in the admin UI.

## Defining a Model (example)

Models are defined in code, not in the admin UI. This is where you add fields (columns/keys) and behavior.

```python
# app_name/models.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title
```

## Customizing Admin

```python
# app_name/admin.py
@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'published_at')
    search_fields = ('title',)
    list_filter = ('published_at',)
```

`ModelAdmin` is an optional configuration class. You use it to control how the model appears in the admin:

- Which fields show in lists (`list_display`)
- Which fields are searchable (`search_fields`)
- Which filters appear in the sidebar (`list_filter`)
- Field layout, read-only fields, inlines, and custom actions

## Inlines

Inlines let you edit related models on the same admin page. For example, you can edit `Comment` rows directly on the `Post` edit screen instead of navigating to a separate admin page.

```python
# app_name/admin.py
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

Django permissions are per-model capabilities (add, change, delete, view) that are assigned to users or groups. Groups are collections of permissions that make it easier to manage access for teams (e.g., "Editors" can add/change posts). You define permissions in code (model `Meta`), in Django admin (create groups and assign permissions), or via migrations/fixtures.

`has_view_permission` controls whether a user can view an object in the admin (list and detail pages). `has_change_permission` controls whether a user can edit and save changes to that object. Both can be overridden on a `ModelAdmin` to enforce custom rules.

Note: The **Groups** section only appears in the admin for superusers (or users with permission to manage groups). If you do not see it, log in with a superuser or create one via `python manage.py createsuperuser`.

These permissions and groups apply to Django's built-in auth users, not custom user tables like `AppUser`. If you need permissions on a custom model, either switch to Django's auth user or build your own permission checks.

Custom permissions defined in `Meta.permissions` are created for Django auth users and can be assigned in the admin UI. They do not apply to custom user tables unless you integrate them with Django's auth system.

## Using AppUser as a Profile for Auth Users

If you want to keep a custom `AppUser` model but still use Django auth permissions, make `AppUser` a profile linked to `auth.User`.

```python
# app_name/models.py
from django.conf import settings
from django.db import models

class AppUser(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.display_name
```

You authenticate with Django's `User`, and read extra profile data from `AppUser`.

Example custom permissions on a model:

```python
# app_name/models.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)

    class Meta:
        permissions = [
            ("publish_post", "Can publish post"),
            ("archive_post", "Can archive post"),
        ]
```
