# Routing

Routes map HTTP requests to closures or controller actions.

Routes live in:
- `routes/web.php` for browser pages (sessions, CSRF).
- `routes/api.php` for stateless JSON APIs.

Note: Laravel routes are strict about trailing slashes, so `/posts` and `/posts/` are different routes unless you normalize or define both. Be consistent to avoid extra redirects or 404s.

You can normalize trailing slashes with middleware to keep a canonical URL and avoid duplicate routes.
You can also do it at the web server/proxy (Nginx) for even earlier handling. For fewer round trips, ideally enforce a consistent URL scheme in links and routes so redirects are rarely needed.

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TrimTrailingSlash
{
    public function handle(Request $request, Closure $next)
    {
        $path = $request->path();

        if ($path !== '/' && str_ends_with($path, '/')) {
            $normalized = rtrim($request->getRequestUri(), '/');
            return redirect($normalized, 301);
        }

        return $next($request);
    }
}
```

Example routes:

```php
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => view('welcome'));

Route::get('/posts', [PostController::class, 'index']);
Route::post('/posts', [PostController::class, 'store']);

Route::prefix('api')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
});

Route::group(['prefix' => 'admin', 'middleware' => ['auth']], function () {
    Route::get('/users', [UserController::class, 'index']);
});
```

Route parameters and model binding:

```php
Route::get('/posts/{post}', [PostController::class, 'show'])->whereNumber('post');
Route::get('/users/{user}/posts/{post}', ...)
    ->where(['user' => '[0-9]+', 'post' => '[0-9]+']);
```

Laravel will automatically resolve `{post}` to a `Post` model if the controller type hints it.
In Laravel you customize model binding in app/Providers/RouteServiceProvider::boot() using Route::model() or Route::bind(). You can also override getRouteKeyName() (and resolveRouteBinding) on the model to change how the lookup happens.

Named routes:

```php
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');
```

Then generate URLs:

```php
url(route('posts.show', $post));
```
