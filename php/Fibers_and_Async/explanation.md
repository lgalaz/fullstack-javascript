# Fibers and Async Patterns

## Fibers

Fibers are a cooperative concurrency primitive. They let code suspend and resume explicitly, but they require a scheduler/event loop (provided by async libraries) to be useful.

That following fiber example is synchronous by itself; it just cooperatively pauses/resumes in the same thread.
Async libraries (like Amp or ReactPHP adapters) use fibers to suspend execution while waiting on I/O and resume later, giving you an async/await‑like flow without callbacks.
So fibers are a mechanism; they become “async” only when paired with an event loop or scheduler.

```php
<?php

declare(strict_types=1);

$fiber = new Fiber(function (): void {
    $value = Fiber::suspend('paused');
    echo "resumed with {$value}\n";
});

echo $fiber->start(); // paused
$fiber->resume('data'); // resumed with data
```

## Swoole and Octane 

Swoole provides coroutines and a scheduler, and Octane offers concurrent tasks on top.

Swoole coroutine example:

```php
<?php

use Swoole\Coroutine;
use Swoole\Coroutine\Http\Client;

Co::run(function () {
    go(function () {
        $client = new Client('example.com', 443, true);
        $client->set(['timeout' => 2]);
        $client->get('/');
        echo $client->body;
        $client->close();
    });

    go(function () {
        Coroutine::sleep(0.1);
        echo "another coroutine\n";
    });
});
```

Laravel Octane concurrent tasks example:

```php
<?php

use Laravel\Octane\Facades\Octane;

Route::get('/dashboard', function () {
    [$users, $stats] = Octane::concurrently([
        fn () => User::latest()->take(10)->get(),
        fn () => app(StatsService::class)->summary(),
    ]);

    return compact('users', 'stats');
});
```

## When to Use

Use fibers indirectly through async libraries (HTTP clients, queues) rather than rolling your own scheduling.

Example: a tiny scheduler that simulates async file I/O using a fiber. In real async libraries, the I/O would be non-blocking and resume when the event loop is ready.

```php
<?php

declare(strict_types=1);

final class Scheduler {
    /** @var array<callable(): void> */
    private array $queue = [];

    public function defer(callable $task): void {
        $this->queue[] = $task;
    }

    public function run(): void {
        while ($task = array_shift($this->queue)) {
            $task();
        }
    }
}

$scheduler = new Scheduler();

function readFileAsync(string $path, Scheduler $scheduler): string {
    $fiber = Fiber::getCurrent();
    $scheduler->defer(function () use ($path, $fiber): void {
        $data = file_get_contents($path);
        $fiber->resume($data);
    });

    return Fiber::suspend();
}

$fiber = new Fiber(function () use ($scheduler): void {
    $data = readFileAsync(__DIR__ . '/demo.txt', $scheduler);
    echo "Read bytes: " . strlen($data) . "\n";
});

$fiber->start();
$scheduler->run();
```

## Ecosystem for Concurrency

Common PHP options for async/concurrent work:
- ReactPHP: event loop + promises for non-blocking I/O.
- Amp: fiber-based async utilities and concurrency primitives.
- Swoole: async I/O and coroutine runtime via extension.
- RoadRunner: long-running workers (Go-based server).
- Laravel Octane: app server for concurrency using Swoole or RoadRunner.
- FrankenPHP: modern app server built on Caddy with worker mode and concurrent request handling.

Note: On Enterprise apps, concurrency is often needed for throughput (I/O-heavy tasks, queues, real-time feeds), but correctness usually matters more than raw concurrency. Use database transactions, locks, and idempotency to keep sensitive moves safe.
