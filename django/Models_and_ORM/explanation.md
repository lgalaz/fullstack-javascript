# Models and ORM

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
