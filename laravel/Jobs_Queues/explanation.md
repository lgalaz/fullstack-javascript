# Jobs and Queues

Queues handle background work (emails, reports, imports). Jobs are dispatched and processed by workers.

Create a job:

```bash
php artisan make:job ProcessReport
```

Job example:

```php
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProcessReport implements ShouldQueue
{
    use Queueable;

    public function __construct(private int $reportId) {}

    public function handle(): void
    {
        // heavy processing
    }
}
```

Dispatch:

```php
ProcessReport::dispatch($reportId);
```

Run a worker:

```bash
php artisan queue:work
```

Common drivers: database, Redis, SQS.
