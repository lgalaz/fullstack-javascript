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

## Data Migrations

Use `RunPython` for data changes:

```python
from django.db import migrations

def forwards(apps, schema_editor):
    Post = apps.get_model('blog', 'Post')
    Post.objects.update(status='published')

class Migration(migrations.Migration):
    operations = [migrations.RunPython(forwards)]
```

## Squashing

Squash older migrations to reduce startup time:

```bash
python manage.py squashmigrations blog 0001 0020
```

## Gotchas

- Merge conflicts in migration files are common.
- Always run migrations in CI and staging.
- Avoid editing old migrations after they are deployed.
