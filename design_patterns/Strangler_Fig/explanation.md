# Strangler Fig

## Overview

Gradually replaces a legacy system by routing functionality to new services.
Strangler Fig is about incrementally replacing parts of a system while the old and new run side‑by‑side.

## When to use

- You need to modernize without a big-bang rewrite.
- You can incrementally move features or endpoints.
- You want to de-risk migrations.

## Trade-offs

- Routing and integration logic can be complex.
- You must maintain two systems for a while.
- Clear boundaries are required to avoid duplication.
## PHP example

```php
<?php

class LegacyBilling
{
    public function charge(int $amount): string
    {
        return "legacy charged {$amount}";
    }
}

class NewBilling
{
    public function charge(int $amount): string
    {
        return "new charged {$amount}";
    }
}

class BillingRouter
{
    public function __construct(private LegacyBilling $legacy, private NewBilling $modern)
    {
    }

    public function charge(int $amount, bool $useNew): string
    {
        return $useNew ? $this->modern->charge($amount) : $this->legacy->charge($amount);
    }
}

$router = new BillingRouter(new LegacyBilling(), new NewBilling());
echo $router->charge(1200, true) . "\n";
```
