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

## QuerySets (Equivalent to Laravel Query Builder)

```python
Post.objects.filter(published_at__isnull=False).order_by('-published_at')
```

QuerySets are lazy and chainable.

## Annotate (Similar to Laravel withCount/selectRaq)

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
- Use `.only()` or `.defer()` to limit columns. defer() marks fields for lazy loading.

`.only()` loads just the listed fields and defers the rest; `.defer()` loads everything except the listed fields. Deferred fields are fetched later only if accessed (extra query).

```python
Post.objects.only("id", "title")
Post.objects.defer("body", "content_blob")
```

## Query Optimization (Practical)

- Prefer `.exists()` over `.count()` when you only need a boolean.
- Avoid `len(queryset)`; it loads all rows. Use `.count()` or `.exists()`.
- Use `.values()`/`.values_list()` to fetch only the columns you need.
- Paginate large lists instead of pulling everything into memory.
- Use `select_related()` for single-valued relationships, `prefetch_related()` for multi-valued.
- Add indexes for fields used in filters, joins, and ordering.

Inspect the SQL and the plan:

```python
qs = Post.objects.filter(status="published").select_related("author")
print(qs.query)
print(qs.explain())  # Uses EXPLAIN on supported DBs
```

## Managers (Similar to Eloquent Query Scopes)

Managers are the entry point for queries (`Post.objects`). Use them to add reusable query logic that can be chained on any query, similar to Laravel query scopes.

```python
class PostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(published_at__isnull=False)
```

Usage:

```python
# models.py
class Post(models.Model):
    title = models.CharField(max_length=200)
    published_at = models.DateTimeField(null=True, blank=True)
    objects = PostQuerySet.as_manager()
```

```python
# anywhere
Post.objects.published()
```

## Managers vs QuerySets (and avoiding fat models)

Managers are the entry point for queries (`Post.objects`), and QuerySets are the chainable query objects (`Post.objects.filter(...)`). Put reusable query filters on a custom QuerySet/Manager, and keep business logic in service modules to avoid bloated models.

## Service Modules (Optional)

If you keep business logic out of models, a simple `services/` package can help keep code organized.

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
# app_name/models.py
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()

    class Meta:
        # Enforces uniqueness at the database level.
        constraints = [
            models.UniqueConstraint(fields=["title"], name="unique_title"),
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

REPEATABLE READ (MySQL/InnoDB default) prevents dirty and non-repeatable reads but can still allow phantom reads, depending on the query and locks used.

MVCC (Multi-Version Concurrency Control) means reads see a consistent snapshot while writes create new row versions. This lets most reads run without blocking writes (and vice versa), improving concurrency.

Lock wait: a transaction blocks because another transaction holds the needed lock; it resumes when the lock is released or times out.

Deadlock: two or more transactions each hold locks the others need, creating a cycle; the database detects this and aborts one transaction so the others can continue.

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

Note: `select_for_update` (Similar to Eloquents `lockForUpdate`) can also prevent lost updates by locking the row inside a transaction, but `F()` is often simpler because it performs the increment in a single atomic SQL statement.

Use `transaction.on_commit()` to enqueue tasks only after the DB commit completes, so background jobs do not run against uncommitted data.

```python
from django.db import transaction
from .tasks import send_post_notification

def publish_post(post):
    with transaction.atomic():
        post.status = "published"
        post.save()
        transaction.on_commit(lambda: send_post_notification.delay(post.id))
```

## Row Locking and Atomic Blocks

`transaction.atomic()` wraps a block in a database transaction so all operations either commit together or roll back on error.

Note: You can also enable `ATOMIC_REQUESTS = True` in `DATABASES` to wrap every request in a transaction.

`select_for_update()` locks selected rows until the transaction completes, which prevents concurrent updates from racing.

```python
from django.db import transaction

with transaction.atomic():
    post = Post.objects.select_for_update().get(id=post_id)
    post.title = "Updated"
    post.save()
```

Note: `select_for_update()` locks the row so the read-modify-write happens safely in Python, but it still performs a separate SELECT and UPDATE.

Atomic update with a direct SQL `UPDATE` (single statement, no read in Python):

```python
Post.objects.filter(id=post_id).update(title="Updated")
```

Difference: `select_for_update()` is for locking and then doing Python-side logic before saving. A direct `update()` happens fully in SQL and is usually simpler and faster when you do not need to read/modify the current value in Python.

Note: `QuerySet.update()` always executes a single SQL `UPDATE` and does not instantiate model objects. `F()` is only needed when the new value depends on the current DB value (e.g., counters), so it is unnecessary for a constant assignment like `title="Updated"`.
