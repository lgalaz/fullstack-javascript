# Hexagonal Architecture

## Overview

Organizes the system around a domain core with ports and adapters at the edges.
hexagonal architecture is an architectural application of dependency inversion. The core domain depends on ports (abstractions), and adapters depend on those ports. That flips the usual dependency direction so infrastructure depends on the core, not the other way around.

## When to use

- You want domain logic independent of frameworks and IO.
- Multiple interfaces (web, CLI, tests) should be interchangeable.
- You need a clean separation between core and infrastructure.

## Trade-offs

- More abstractions and interfaces to maintain.
- Can be overkill for simple apps.
- Requires discipline to keep boundaries intact.
## PHP example

```php
<?php

interface PaymentPort
{
    public function charge(int $amount): bool;
}

class StripeAdapter implements PaymentPort
{
    public function charge(int $amount): bool
    {
        echo "Charging {$amount}\n";
        return true;
    }
}

class CheckoutService
{
    public function __construct(private PaymentPort $payments)
    {
    }

    public function checkout(int $amount): void
    {
        if (!$this->payments->charge($amount)) {
            throw new RuntimeException('Payment failed');
        }

        echo "Order placed\n";
    }
}

$service = new CheckoutService(new StripeAdapter());
$service->checkout(2500);
```
