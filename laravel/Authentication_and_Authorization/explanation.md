# Authentication and Authorization

Authentication answers "who is the user?" Authorization answers "can they do this?"

Laravel provides:
- Session-based auth for web routes.
- Token auth (Sanctum) and OAuth2 (Passport) for APIs.

Example: protect routes with auth middleware:

```php
Route::middleware('auth')->get('/dashboard', fn () => view('dashboard'));
```

Check auth in code:

```php
if (auth()->check()) {
    $user = auth()->user();
}
```

Authorization is usually handled with Gates or Policies.