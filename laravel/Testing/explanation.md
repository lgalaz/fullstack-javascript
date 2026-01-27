# Testing

Laravel's testing layer builds on PHPUnit (or Pest) and provides helpers for HTTP, database, and fakes.

## Basic TestCase

```php
namespace Tests\Feature;

use Tests\TestCase;

class HomeTest extends TestCase
{
    public function test_home_returns_ok(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }
}
```

## HTTP Helpers

```php
public function test_creates_post(): void
{
    $response = $this->postJson('/api/posts', [
        'title' => 'Hello',
        'body' => 'World',
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.title', 'Hello');
}
```

Note: `post()` sends form-encoded data; `postJson()` sends JSON.

```php
$response = $this->post('/posts', [
    'title' => 'Hello',
    'body' => 'World',
]);
```

## Database Helpers

```php
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Post;

class PostTest extends TestCase
{
    use RefreshDatabase;

    public function test_persists_post(): void
    {
        Post::factory()->create(['title' => 'Saved']);

        $this->assertDatabaseHas('posts', [
            'title' => 'Saved',
        ]);
    }
}
```

## Fakes

```php
use Illuminate\Support\Facades\Mail;
use App\Mail\InvoicePaid;

public function test_sends_email(): void
{
    Mail::fake();

    // trigger the action that sends mail...

    Mail::assertSent(InvoicePaid::class);
}
```

## Database Isolation

Use `RefreshDatabase` to migrate and reset between tests:

```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostTest extends TestCase
{
    use RefreshDatabase;
}
```

This runs migrations at the start of the test suite and wraps each test in a transaction when possible.

## Factories

```php
$user = User::factory()->create();
$post = Post::factory()->for($user)->create();
```

## HTTP and JSON APIs

```php
$response = $this->postJson('/api/posts', ['title' => 'Hi', 'body' => '...']);
$response->assertStatus(201)->assertJsonPath('data.title', 'Hi');
```

## Fakes for External Side Effects

```php
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;

Mail::fake();
Queue::fake();

// ... execute code

Mail::assertSent(InvoicePaid::class);
Queue::assertPushed(ProcessReport::class);
```

## Typical Laravel Testing Stack

A common setup looks like:
- **Test runner**: PHPUnit or Pest.
- **Factories**: built-in model factories.
- **HTTP tests**: Laravel's `TestCase` helpers (`get`, `postJson`, `assertStatus`).
- **Database isolation**: `RefreshDatabase` or `DatabaseTransactions`.
- **Fakes**: Mail, Queue, Events, Notifications, Storage.
- **API tests**: JSON assertions with `assertJson` and `assertJsonPath`.
- **Browser tests**: Laravel Dusk for end-to-end UI flows. (Playwright or Cypress)
- **Coverage**: `phpunit --coverage` or `pest --coverage` with Xdebug or PCOV.
- **Static analysis**: PHPStan or Psalm for type safety.

## Pest Example

```php
it('returns ok', function () {
    $this->get('/')->assertOk();
});
```
