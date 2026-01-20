# Strategy

## Overview

Defines a family of algorithms and makes them interchangeable at runtime.

## When to use

- You need multiple ways to perform a task.
- Algorithms should vary without changing clients.
- You want to swap behavior based on configuration.

## Trade-offs

- More types and wiring.
- Clients must choose or be configured with a strategy.
- Can lead to over-abstracted designs.
## PHP example

```php
<?php

interface PaymentStrategy
{
    public function pay(int $amount): void;
}

class CardPayment implements PaymentStrategy
{
    public function pay(int $amount): void
    {
        echo "Paying {$amount} by card\n";
    }
}

class PaypalPayment implements PaymentStrategy
{
    public function pay(int $amount): void
    {
        echo "Paying {$amount} via PayPal\n";
    }
}

class Checkout
{
    public function __construct(private PaymentStrategy $strategy)
    {
    }

    public function complete(int $amount): void
    {
        $this->strategy->pay($amount);
    }
}

$checkout = new Checkout(new CardPayment());
$checkout->complete(5000);
```
