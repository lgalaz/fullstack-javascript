# State

## Overview

Allows an object to change its behavior when its internal state changes.
State is essentially implementing a state machine: each state is an object that defines allowed transitions (steps) and behavior, and the context delegates to the current state.

## When to use

- Behavior depends on an internal state machine.
- You want to avoid large conditional blocks.
- State transitions should be explicit and encapsulated.

## Trade-offs

- More classes and indirection.
- State explosion for complex machines.
- Harder to track transitions without tooling.
## PHP example

```php
<?php

interface OrderState
{
    public function next(Order $order): void;
    public function label(): string;
}

class Order
{
    public function __construct(private OrderState $state)
    {
    }

    public function advance(): void
    {
        $this->state->next($this);
    }

    public function setState(OrderState $state): void
    {
        $this->state = $state;
    }

    public function status(): string
    {
        return $this->state->label();
    }
}

class PendingState implements OrderState
{
    public function next(Order $order): void
    {
        $order->setState(new ShippedState());
    }

    public function label(): string
    {
        return 'pending';
    }
}

class ShippedState implements OrderState
{
    public function next(Order $order): void
    {
        $order->setState(new DeliveredState());
    }

    public function label(): string
    {
        return 'shipped';
    }
}

class DeliveredState implements OrderState
{
    public function next(Order $order): void
    {
        echo "Already delivered\n";
    }

    public function label(): string
    {
        return 'delivered';
    }
}

$order = new Order(new PendingState());
$order->advance();
echo $order->status() . "\n";
```
