# Authentication and Authorization

## Authentication Basics

Django ships with:
- a User model,
- login/logout views,
- session-based auth.

```python
from django.contrib.auth import authenticate, login

user = authenticate(request, username='alice', password='secret')
if user:
    login(request, user)
```

## Permissions

Every model gets `add`, `change`, `delete`, `view` permissions.
These apply to Django auth users (the `AUTH_USER_MODEL`), regardless of how those users are created.
If you store people in a separate `AppUser` table that is not the auth user model, Django permissions do not apply to those rows unless you link them to auth users.

```python
from django.contrib.auth.decorators import permission_required

@permission_required('blog.change_post')
def edit_post(request, id):
    ...
```

## Groups

Group users and assign permissions to groups for manageability.

## Custom User Model

If you need email-based login or extra fields, define a custom user early:

```python
AUTH_USER_MODEL = 'accounts.User'
```

Changing it later is painful, so decide early.

## Access Control in Views

- `@login_required`
- `UserPassesTestMixin`
- `PermissionRequiredMixin`

## Password Management

Django uses strong password hashing and provides reset flows out of the box.

## Advanced Auth Topics

### Custom Authentication Backends

Use a custom backend when you need non-standard login logic (email login, external IdP, etc.).

```python
# accounts/backends.py
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

class EmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        User = get_user_model()
        try:
            user = User.objects.get(email=username)
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None
```

Enable it:

```python
AUTHENTICATION_BACKENDS = ["accounts.backends.EmailBackend"]
```

### Object-Level Permissions

Django's built-in permissions are model-level. For per-object permissions, use libraries like `django-guardian` or implement checks in your views.

### SSO/OAuth

For social login or SSO, use `django-allauth` or `social-auth-app-django` and keep the Django auth user as the system of record.
