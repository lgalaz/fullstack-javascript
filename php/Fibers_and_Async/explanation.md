# Fibers and Async Patterns

## Fibers

Fibers provide cooperative multitasking at the language level. They are mainly used by async libraries to suspend and resume execution without threads.

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

Note: HTTP Early Hints (103) can also improve perceived performance by sending `Link` preload headers before the final response. In PHP this is primarily done through modern application servers like FrankenPHP, or via reverse proxies/CDNs that support 103.