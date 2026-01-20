# Dependency Injection

## Overview

Supplies an object with its dependencies rather than having it create them.
Dependency Inversion Principle (DIP) is an architectural design principle recommending that high-level modules depend on abstractions (interfaces) rather than low-level, concrete implementations. Dependency Injection (DI) is a coding pattern or technique used to implement this, providing (injecting) the concrete dependencies to a class from the outside, rather than the class creating them

## When to use

- You want testable code with replaceable collaborators.
- Construction logic should live outside business logic.
- You need runtime configuration of implementations.

## Trade-offs

- Requires a wiring strategy or container.
- Can make flow harder to trace.
- Misuse can lead to service locator anti-patterns.
## PHP example

```php
<?php

class EmailSender
{
    public function send(string $to, string $message): void
    {
        echo "Email to {$to}: {$message}\n";
    }
}

class OrderService
{
    public function __construct(private EmailSender $email)
    {
    }

    public function placeOrder(string $email): void
    {
        $this->email->send($email, 'Order placed');
    }
}

$service = new OrderService(new EmailSender());
$service->placeOrder('ada@example.com');
```
