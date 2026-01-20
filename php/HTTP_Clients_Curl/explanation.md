# HTTP Clients (cURL)

## cURL Basics

Use cURL for outbound HTTP calls when you do not use a higher-level client.
Use higher-level clients, like Guzzle, when you need `Consistent error handling`, `Timeouts, retries, and backoff`, `Middleware / cross-cutting concerns`, `JSON, serialization, and content negotiation`, `Testability` (Higher-level clients tend to give you Mockable interfaces and utilities)
```php
<?php

declare(strict_types=1);

$ch = curl_init('https://api.example.com/v1/rates');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 5,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);

$body = curl_exec($ch);
if ($body === false) {
    throw new RuntimeException(curl_error($ch));
}

$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);
```

## Timeouts and Retries

Always set timeouts. Implement idempotent retries at the caller level.

```php
<?php

declare(strict_types=1);

// Good: retry a GET (idempotent) on transient failure.
function fetchRatesWithRetry(): string {
    $attempts = 0;
    $maxAttempts = 3;

    do {
        $attempts++;
        $ch = curl_init('https://api.example.com/v1/rates');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 5,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
        ]);

        $body = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);

        if ($body !== false && $status >= 200 && $status < 300) {
            return $body;
        }
    } while ($attempts < $maxAttempts);

    throw new RuntimeException('Failed to fetch rates after retries');
}

// Bad: retrying a non-idempotent POST risks duplicate charges.
// if you need to retry a non‑idempotent POST, use an idempotency key
function createChargeWithRetry(array $payload): void {
    $attempts = 0;
    $maxAttempts = 3;

    do {
        $attempts++;
        $ch = curl_init('https://api.example.com/v1/charges');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 5,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_THROW_ON_ERROR),
        ]);

        $body = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
    } while ($attempts < $maxAttempts);

    // If the first request succeeded but the response was lost, this can double-charge.
}
```
