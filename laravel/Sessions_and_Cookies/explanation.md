# Sessions and Cookies

Laravel manages session state for web routes using session drivers (file, database, Redis, etc.).

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
