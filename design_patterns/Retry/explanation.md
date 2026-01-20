# Retry

## Overview

Automatically re-attempts failed operations with backoff and limits.
Retry is the pattern; exponential backoff is one common strategy for implementing it. You can retry with fixed delay, exponential backoff, jitter, or capped attempts depending on the failure mode.

## When to use

- Failures are transient and likely to succeed on retry.
- You want to improve robustness without user involvement.
- Operations are idempotent or safely repeatable.

## Trade-offs

- Can amplify load during outages.
- Non-idempotent operations risk duplication.
- Requires careful backoff strategy.
## PHP example

```php
<?php

function retry(callable $operation, int $attempts): mixed
{
    $lastException = null;

    for ($i = 0; $i < $attempts; $i++) {
        try {
            return $operation();
        } catch (Throwable $exception) {
            $lastException = $exception;
        }
    }

    throw $lastException;
}

$call = fn () => throw new RuntimeException('Temporary failure');

try {
    retry($call, 3);
} catch (Throwable $exception) {
    echo $exception->getMessage() . "\n";
}
```
