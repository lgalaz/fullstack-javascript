# Performance and Profiling

Performance in Laravel usually depends on database queries, caching, and queueing.

Common optimizations:
- Use eager loading to avoid N+1 queries.
- Cache expensive computations.
- Offload heavy work to queues.
- Use OPcache in production.

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
