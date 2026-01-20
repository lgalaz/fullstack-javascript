# Routing

Routes map HTTP requests to closures or controller actions.

Routes live in:
- `routes/web.php` for browser pages (sessions, CSRF).
- `routes/api.php` for stateless JSON APIs.

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
