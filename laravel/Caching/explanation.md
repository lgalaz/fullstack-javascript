# Caching

Laravel supports multiple cache stores (file, Redis, Memcached, database).

Basic usage:

```php
use Illuminate\Support\Facades\Cache;

$value = Cache::remember('posts.home', 60, function () {
    return Post::latest()->take(10)->get();
});
```

Tagged cache (supported by Redis/Memcached):

```php
Cache::tags(['posts', 'home'])->put('latest', $data, 60);
```

Configuration lives in `config/cache.php` and `.env` (`CACHE_DRIVER`).
