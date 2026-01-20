# Service Layer

## Overview

Defines an application-level API that orchestrates use cases and transactions.
- Use case: a specific business scenario or workflow (e.g., “place order”, “register user”) that coordinates domain rules.
- Transaction: a unit of work that must succeed or fail as a whole, usually around persistence or external calls (DB writes, message publish, payment). It’s about consistency, not just “any I/O.”

## When to use

- You want a clear boundary between UI and domain logic.
- Use cases must coordinate multiple domain objects.
- You need a single place for application policies.

## Trade-offs

- Can become a thin pass-through if not designed well.
- Too much logic here leads to an anemic domain.
- Requires discipline to keep responsibilities clear.
## PHP example

```php
<?php

class OrderRepository
{
    private array $orders = [];

    public function add(array $order): void
    {
        $this->orders[] = $order;
    }
}

class EmailSender
{
    public function send(string $message): void
    {
        echo "Email: {$message}\n";
    }
}

class OrderService
{
    public function __construct(private OrderRepository $repo, private EmailSender $email)
    {
    }

    public function placeOrder(int $id): void
    {
        $order = ['id' => $id, 'status' => 'new'];
        $this->repo->add($order);
        $this->email->send("Order {$id} placed");
    }
}

$service = new OrderService(new OrderRepository(), new EmailSender());
$service->placeOrder(1001);
```
