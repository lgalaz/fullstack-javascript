# Adapter

## Overview

Converts the interface of a class into one clients expect.

## When to use

- You need to integrate legacy or third-party APIs.
- You want to unify multiple interfaces behind a single contract.
- You need to decouple clients from concrete APIs.

## Trade-offs

- Adds another layer to trace when debugging.
- Can mask impedance mismatches instead of fixing them.
- May need multiple adapters for different clients.
## PHP example

```php
<?php

interface Logger
{
    public function info(string $message): void;
}

class LegacyLogger
{
    public function logMessage(string $level, string $message): void
    {
        echo "[{$level}] {$message}\n";
    }
}

class LegacyLoggerAdapter implements Logger
{
    public function __construct(private LegacyLogger $legacy)
    {
    }

    public function info(string $message): void
    {
        $this->legacy->logMessage('INFO', $message);
    }
}

function run(Logger $logger): void
{
    $logger->info('Adapter in action');
}

$logger = new LegacyLoggerAdapter(new LegacyLogger());
run($logger);
```
