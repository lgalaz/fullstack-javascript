# Event Driven Architecture

## Overview

Components communicate by publishing and subscribing to events.

## When to use

- You need loose coupling between services.
- Workflows are asynchronous and reactive.
- You want to scale producers and consumers independently.

## Trade-offs

- Eventual consistency and ordering issues.
- Harder debugging and traceability.
- Requires solid observability and schema governance.
## PHP example

```php
<?php

class EventBus
{
    private array $listeners = [];

    public function subscribe(string $event, callable $listener): void
    {
        $this->listeners[$event][] = $listener;
    }

    public function publish(string $event, array $payload): void
    {
        foreach ($this->listeners[$event] ?? [] as $listener) {
            $listener($payload);
        }
    }
}

$bus = new EventBus();
$bus->subscribe('order.placed', fn (array $payload) => print("Email {$payload['id']}
"));

$bus->publish('order.placed', ['id' => 42]);
```
