# Static and Media Files

## Static Files

Static assets (CSS, JS, images) are collected with `collectstatic`.

Settings:

```python
STATIC_URL = '/static/'  # Public URL prefix, e.g. https://example.com/static/app.css
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Filesystem path, e.g. /var/www/project/staticfiles/
```

In production, a CDN or web server serves these files.

## Media Files (Uploads)

User uploads go to media storage:

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

## Development vs Production

- In development, `django.contrib.staticfiles` can serve static files.
- In production, let the web server or CDN handle static and media.

## Storage Backends

Use `DEFAULT_FILE_STORAGE` to store media in S3 or other systems.
