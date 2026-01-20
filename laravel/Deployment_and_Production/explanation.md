# Deployment and Production

Typical production steps:
- Set `APP_ENV=production` and `APP_DEBUG=false`.
- Configure `APP_KEY`.
- Run migrations.
- Cache config/routes/views.

Common Artisan commands:

```bash
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Queue workers and schedulers:
- Use Supervisor or systemd to keep `queue:work` running.
- Add a cron entry for `schedule:run`.

Infrastructure options:
- Nginx + PHP-FPM (traditional).
- Laravel Octane (Swoole/RoadRunner) for long-running workers.
- Containerized deployments with Redis and a queue backend.
