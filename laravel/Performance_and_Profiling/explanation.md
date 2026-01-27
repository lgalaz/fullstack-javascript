# Performance and Profiling

Performance in Laravel usually depends on database queries, caching, and queueing.

Common optimizations:
- Use eager loading to avoid N+1 queries.
- Cache expensive computations.
- Offload heavy work to queues.
- Use OPcache in production.
- Cache config/routes/views in production (`php artisan config:cache`, `route:cache`, `view:cache`).
- Use Redis/Memcached for cache/session/queue stores in high-traffic apps.
- Use chunking/cursors for large datasets to avoid memory spikes.
- Consider Octane (Swoole/RoadRunner) to reduce per-request bootstrap overhead.

Eager loading example:

```php
$posts = Post::with('author')->latest()->get();
```

Query logging (development only):

```php
DB::listen(function ($query) {
    logger()->info($query->sql, $query->bindings);
});
```

Monitoring:
- Laravel Telescope for local debugging.
- Laravel Horizon for queue monitoring.
- APM (Application Performance Monitoring) tools (Sentry, New Relic, Datadog).
- Local profilers: Laravel Debugbar, Clockwork.
- Production profilers: Xdebug (limited), Blackfire, Tideways, Datadog profiler.

Note: HTTP Early Hints (103) can improve perceived performance by sending `Link` preload headers before the final response. In Laravel/PHP this is typically done via modern application servers (e.g., FrankenPHP) or reverse proxies/CDNs that support 103.
