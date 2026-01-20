# HTTP Client

Laravel wraps Guzzle with a fluent HTTP client and testing fakes.

Example:

```php
use Illuminate\Support\Facades\Http;

$response = Http::timeout(5)->get('https://api.example.com/users');
$users = $response->json();
```

Error handling:

```php
$response = Http::get('https://api.example.com/users');
$response->throw();
```

Testing with fakes:

```php
Http::fake([
    'api.example.com/*' => Http::response(['ok' => true], 200),
]);
```
