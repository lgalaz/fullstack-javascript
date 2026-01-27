# Service Container and Providers

The service container manages dependency injection. Service providers register bindings and boot logic.

Binding a service (inside a provider `register()`):

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\BillingService;
use App\Services\BillingClient;

final class BillingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(BillingService::class, function ($app) {
            return new BillingService(
                $app->make(BillingClient::class)
            );
        });
    }
}
```

Constructor injection:

```php
class InvoiceController extends Controller
{
    public function __construct(private BillingService $billing) {}
}
```

If you instantiate classes manually with `new`, you must pass all dependencies yourself. To use bindings defined in service providers, resolve the class from the container instead so dependencies are injected automatically.

```php
use App\Services\BillingService;
use App\Services\BillingClient;

// Manual instantiation (no container bindings applied).
$billing = new BillingService(new BillingClient());

// Container resolution (bindings + dependencies applied).
$billing = app(BillingService::class);
```

Service providers live in `app/Providers` and are loaded at boot.

Example provider:

```php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\BillingService;

class BillingServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(BillingService::class, function ($app) {
            return new BillingService($app['config']['services.billing']);
        });
    }
}
```
