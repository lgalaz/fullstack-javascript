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
