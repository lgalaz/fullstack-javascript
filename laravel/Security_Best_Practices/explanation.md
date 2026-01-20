# Security Best Practices

Laravel ships with sensible defaults, but you still need safe patterns.

Key practices:
- Use validation for all inputs and cast types.
- Protect state-changing routes with CSRF (web middleware group).
- Use authorization policies for sensitive actions.
- Hash passwords with `Hash::make`.
- Avoid exposing debug info in production.

Example: hashing passwords

```php
use Illuminate\Support\Facades\Hash;

$user->password = Hash::make($request->input('password'));
```

Example: rate limiting

```php
Route::middleware('throttle:60,1')->post('/login', [AuthController::class, 'login']);
```
