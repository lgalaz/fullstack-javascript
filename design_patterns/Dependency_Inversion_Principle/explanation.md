# Dependency Inversion Principle

## Overview

High-level modules should not depend on low-level modules; both should depend on abstractions.
Dependency Inversion Principle (DIP) is an architectural design principle recommending that high-level modules depend on abstractions (interfaces) rather than low-level, concrete implementations. Dependency Injection (DI) is a coding pattern or technique used to implement this, providing (injecting) the concrete dependencies to a class from the outside, rather than the class creating them

## When to use

- You want to decouple business logic from infrastructure details.
- You expect implementations to change (databases, APIs, frameworks).
- You want to unit test without real external dependencies.

## Trade-offs

- Requires defining stable interfaces.
- Adds extra indirection and more types.
- Can feel heavy for small codebases.

## PHP example

```php
<?php

interface Notifier
{
    public function notify(string $message): void;
}

class EmailNotifier implements Notifier
{
    public function notify(string $message): void
    {
        echo "Email: {$message}\n";
    }
}

class SmsNotifier implements Notifier
{
    public function notify(string $message): void
    {
        echo "SMS: {$message}\n";
    }
}

class AlertService
{
    public function __construct(private Notifier $notifier)
    {
    }

    public function sendCriticalAlert(string $message): void
    {
        $this->notifier->notify($message);
    }
}

$service = new AlertService(new EmailNotifier());
$service->sendCriticalAlert('Service down');
```
