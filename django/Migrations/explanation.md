# Migrations

## What They Are

Migrations are versioned schema changes generated from your models.
They make database changes reproducible and team-friendly.

## Common Commands

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations
```

## Rollbacks and Resets

You can migrate an app back to a previous migration:

```bash
python manage.py migrate app_name 0003
```

To reset an app to zero (drop its tables), migrate to `zero`:

```bash
python manage.py migrate app_name zero
```

There is no single "reset database" command, but a common workflow is:

```bash
python manage.py flush
```

`flush` removes all data and re-runs initial data migrations without dropping tables.

## Data Migrations

Use `RunPython` for data changes:

`RunPython` is a migration operation that runs Python code inside the migration system. It integrates with Django's ORM and migration graph, so data changes are versioned, repeatable, and run in the right order with your schema changes.

```python
from django.db import migrations

def forwards(apps, schema_editor):
    Post = apps.get_model('blog', 'Post')
    Post.objects.update(status='published')

class Migration(migrations.Migration):
    operations = [migrations.RunPython(forwards)]
```

You can also define a reverse function for rollbacks:

```python
def backwards(apps, schema_editor):
    Post = apps.get_model('blog', 'Post')
    Post.objects.update(status='draft')

class Migration(migrations.Migration):
    operations = [migrations.RunPython(forwards, backwards)]
```

To run data migrations, use the normal migrate command:

```bash
python manage.py migrate
```

## Squashing

Squash older migrations to reduce startup time:

```bash
python manage.py squashmigrations blog 0001 0020
```

## Advanced Migrations

### Dependencies and Conflicts

When two branches add migrations, Django may generate a merge migration. Resolve conflicts by creating a new migration that depends on both heads.

### RunSQL and SeparateDatabaseAndState

Use `RunSQL` for custom SQL and `SeparateDatabaseAndState` when the DB change does not match the Django model state.

```python
from django.db import migrations

class Migration(migrations.Migration):
    operations = [
        migrations.RunSQL("CREATE INDEX CONCURRENTLY idx_post_title ON blog_post(title);"),
    ]
```

### Large Table Changes

- Add nullable columns first, backfill in batches, then add `NOT NULL`.
- Avoid long locks by using `CREATE INDEX CONCURRENTLY` (Postgres) via `RunSQL`.
- Prefer data migrations with idempotent logic.

## Gotchas

- Merge conflicts in migration files are common.
- Always run migrations in CI and staging.
- Avoid editing old migrations after they are deployed.
