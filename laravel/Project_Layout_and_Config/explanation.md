# Project Layout and Config

Laravel uses a conventional directory structure so teams can navigate quickly.

Key directories:
- `app/`: application code (models, controllers, services).
- `routes/`: route definitions (web, api, console, channels).
- `config/`: configuration files (cache, queue, database).
- `database/`: migrations, factories, seeders.
- `resources/`: Blade views, frontend assets, language files.
- `storage/`: logs, cache, uploads.
- `public/`: web root (index.php, built assets).

Environment configuration:
- `.env` holds environment-specific values (DB, cache, queues).
- `config/*.php` reads values via `env()`.

Example config usage:

```php
// config/cache.php
return [
    'default' => env('CACHE_DRIVER', 'file'),
];
```

Load it in code:

```php
$driver = config('cache.default');
```

Request lifecycle starts at `public/index.php`, which boots the framework and dispatches the HTTP kernel.
Typically it looks like:

1) `public/index.php`
2) index calls `bootstrap/app.php` (creates the application container and registers core service providers)
3) app resolves `App\Http\Kernel` from the app container: `$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);`
   - kernel runs `$bootstrappers`
   - kernel builds the middleware pipeline: runs global + route middleware
   - kernel resolves the router from the container
   - controller
   - response
   - The middleware stack unwinds, so response middleware runs on the way back out (bottom‑to‑top).
