# Sessions and Cookies

Laravel manages session state for web routes using session drivers (file, database, Redis, etc.).

Key points:
- Session cookie name is `laravel_session` by default.
- Sessions are scoped per browser via the session cookie (not per authenticated user).
- Drivers trade off speed and durability (Redis is common in production).
- Session data is server-side; the cookie stores only the session ID (and is encrypted/signed).

Read/write session:

```php
$request->session()->put('cart_id', 123);
$cartId = $request->session()->get('cart_id');
```

Flash data (one request):
Flash data is for one‑time messages that survive a redirect, like “Saved successfully” or validation errors. It’s stored in the session and automatically cleared after the next request.

```php
$request->session()->flash('status', 'Saved');
```

Cookies:

```php
return response('ok')->cookie('theme', 'dark', 60);
```
