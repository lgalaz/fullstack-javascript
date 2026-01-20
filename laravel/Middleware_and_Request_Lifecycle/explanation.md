# Middleware and Request Lifecycle

Request lifecycle (high level):
Request lifecycle starts at `public/index.php`, which boots the framework and dispatches the HTTP kernel.
Typically it looks like:

1) `public/index.php`
2) `bootstrap/app.php` (creates the application container and registers core service providers)
3) index resolves `App\Http\Kernel` from the app container: `$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);`
   - kernel runs `$bootstrappers`
   - kernel builds the middleware pipeline: runs global + route middleware
   - kernel resolves the router from the container
4) controller
5) response
6) The middleware stack unwinds, so response middleware runs on the way back out (bottom‑to‑top).

What happens during bootstrap:
- Config and environment are loaded.
- Service providers register bindings and boot features.
- The container is ready for dependency injection.

Middleware wraps the request and response to apply cross-cutting concerns like auth, rate limiting, and headers.

Example middleware:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AddRequestId
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        $response->headers->set('X-Request-Id', $request->header('X-Request-Id', 'generated'));
        return $response;
    }
}
```

Register middleware in `app/Http/Kernel.php`:

```php
protected $middleware = [
    \App\Http\Middleware\AddRequestId::class,
];
```

Route middleware:

```php
Route::middleware('auth')->get('/dashboard', fn () => view('dashboard'));
```
