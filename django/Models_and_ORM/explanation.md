# Models and ORM

## Django ORM vs SQLAlchemy

When you are using Django, the built-in ORM is usually the right default.
It integrates with Django models, migrations, admin, and forms, so you get a single, consistent data layer.
SQLAlchemy is powerful, but using it alongside Django often means duplicating model definitions and losing tight integration with Django features.

## Defining Models

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    published_at = models.DateTimeField(null=True, blank=True)
```

## Relationships

- `ForeignKey` (many-to-one)
- `ManyToManyField`
- `OneToOneField`

```python
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
```

## QuerySets

```python
Post.objects.filter(published_at__isnull=False).order_by('-published_at')
```

QuerySets are lazy and chainable.

## Annotate

`annotate()` adds computed fields to each row in a QuerySet. These values are calculated in the database and appear as attributes on each result.

```python
from django.db.models import Count

posts = Post.objects.annotate(comment_count=Count("comment"))
for post in posts:
    print(post.title, post.comment_count)
```

This is similar to Laravel "appended" attributes in spirit (extra fields on model instances), but in Django they come from query expressions rather than model accessors.

## Performance Tips

- Use `select_related` for foreign keys.
- Use `prefetch_related` for many-to-many.
- Use `.only()` or `.defer()` to limit columns.

## Managers

Add custom query logic:

```python
class PostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(published_at__isnull=False)
```

## Managers vs QuerySets (and avoiding fat models)

Managers are the entry point for queries (`Post.objects`), and QuerySets are the chainable query objects (`Post.objects.filter(...)`). Put reusable query filters on a custom QuerySet/Manager, and keep business logic in service modules to avoid bloated models.

Example scaffolding:

```
app_name/
  models.py
  services/
    posts.py
```

```python
# app_name/models.py
class PostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(published_at__isnull=False)

class Post(models.Model):
    title = models.CharField(max_length=200)
    published_at = models.DateTimeField(null=True, blank=True)

    objects = PostQuerySet.as_manager()
```

```python
# app_name/services/posts.py
def publish_post(post):
    post.published_at = timezone.now()
    post.save()
```

## Constraints and Indexes

```python
class Meta:
    constraints = [
        models.UniqueConstraint(fields=['title'], name='unique_title'),
    ]
```

## Transactions

```python
from django.db import transaction

with transaction.atomic():
    ...
```

Isolation levels are database guarantees about how concurrent transactions see each other. They trade off correctness vs. concurrency.

READ COMMITTED (Postgres default) prevents dirty reads but allows non-repeatable reads and phantom reads. It is usually fine when you use row locks and constraints correctly.

Dirty read: a transaction reads data written by another transaction that has not committed yet.

Non-repeatable read: the same row is read twice in one transaction and returns different values because another transaction committed updates in between.

Phantom read: a query is re-run in the same transaction and returns a different set of rows because another transaction inserted/deleted rows that now match the query.

SERIALIZABLE makes concurrent transactions behave as if they ran one at a time. It prevents phantoms but can cause more retries and complexity.

Example (Postgres) changing the isolation level in Django:

```python
# settings.py
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "OPTIONS": {
            "isolation_level": "serializable",
        },
    }
}
```

Counters: Use F() expressions to avoid read-modify-write races:

```python
from django.db.models import F

Post.objects.filter(id=post_id).update(view_count=F("view_count") + 1)
```

In Django, `F()` expressions tell the database: "Use the value that is already in the column and compute against it inside the database, not in Python."
They are called `F()` because they reference model **fields**.

Example:

```python
from django.db.models import F

Post.objects.filter(id=post_id).update(likes=F("likes") + 1)
```

Use `transaction.on_commit()` to enqueue tasks only after the DB commit completes, so background jobs do not run against uncommitted data.

## Row Locking and Atomic Blocks

`transaction.atomic()` wraps a block in a database transaction so all operations either commit together or roll back on error.

`select_for_update()` locks selected rows until the transaction completes, which prevents concurrent updates from racing.

```python
from django.db import transaction

with transaction.atomic():
    post = Post.objects.select_for_update().get(id=post_id)
    post.title = "Updated"
    post.save()
```
