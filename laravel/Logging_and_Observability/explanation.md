# Logging and Observability

Laravel uses Monolog under the hood and supports multiple channels.

Basic logging:

```php
use Illuminate\Support\Facades\Log;

Log::info('User logged in', ['user_id' => $user->id]);
```

Configure channels in `config/logging.php`. Common channels:
- `stack` (default)
- `single` (single file)
- `daily`
- `syslog`
- `slack`

Add correlation IDs with middleware for tracing requests. Combine with tools like Sentry, Datadog, or OpenTelemetry.

Example correlation ID middleware:

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class CorrelationId
{
    public function handle(Request $request, Closure $next)
    {
        $id = $request->header('X-Correlation-Id');

        if ($id === null && $request->hasSession()) {
            $id = $request->session()->get('correlation_id');
        }

        if ($id === null) {
            $id = (string) Str::uuid();
            if ($request->hasSession()) {
                $request->session()->put('correlation_id', $id);
            }
        }

        $request->headers->set('X-Correlation-Id', $id);

        Log::withContext(['correlation_id' => $id]);

        $response = $next($request);
        $response->headers->set('X-Correlation-Id', $id);
        return $response;
    }
}
```
