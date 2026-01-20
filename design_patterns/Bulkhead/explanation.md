# Bulkhead

## Overview

Isolates resources so failures in one part do not sink the whole system.

## When to use

- You want to limit blast radius of failures.
- Different workloads should not contend for the same resources.
- You need predictable capacity for critical paths.

## Trade-offs

- Resource partitioning can reduce overall utilization.
- Requires tuning and monitoring.
- More configuration and operational overhead.
## PHP example

```php
<?php

class Bulkhead
{
    private int $inFlight = 0;

    public function __construct(private int $limit)
    {
    }

    public function run(callable $task): void
    {
        if ($this->inFlight >= $this->limit) {
            throw new RuntimeException('Bulkhead limit exceeded');
        }

        $this->inFlight++;
        try {
            $task();
        } finally {
            $this->inFlight--;
        }
    }
}

$paymentsBulkhead = new Bulkhead(2);
$notificationsBulkhead = new Bulkhead(5);

$paymentsBulkhead->run(fn () => print("charge card
"));
$notificationsBulkhead->run(fn () => print("send email
"));
```
