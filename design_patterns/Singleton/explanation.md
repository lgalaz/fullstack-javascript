# Singleton

## Overview

Ensures a class has only one instance and provides a global access point.

## When to use

- There should be exactly one shared instance (for example, configuration).
- You want lazy initialization and central access.
- Shared state must be controlled and synchronized.

## Trade-offs

- Global state can hurt testability and coupling.
- Hidden dependencies complicate reasoning.
- Can become a concurrency bottleneck.
## PHP example

```php
<?php

class Config
{
    private static ?Config $instance = null;

    private function __construct(private array $values)
    {
    }

    public static function getInstance(): Config
    {
        if (!self::$instance) {
            self::$instance = new Config(['env' => 'prod']);
        }

        return self::$instance;
    }

    public function get(string $key): mixed
    {
        return $this->values[$key] ?? null;
    }
}

$config = Config::getInstance();
echo $config->get('env') . "\n";
```
