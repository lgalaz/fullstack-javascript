# Facades

Facades are static-looking proxies to services in the container. They provide a clean API while still using DI under the hood.

Example:

```php
use Illuminate\Support\Facades\Cache;

Cache::put('key', 'value', 60);
$value = Cache::get('key');
```

Behind the scenes, the facade resolves a service from the container.

Roughly equivalent behind the scenes:

```php
$cache = app('cache'); // or app(\Illuminate\Contracts\Cache\Factory::class)
$cache->put('key', 'value', 60);
$value = $cache->get('key');
```

When to use:
- Convenience at the edges of your app (controllers, routes).
- Avoid heavy use inside core business logic to keep code testable.
