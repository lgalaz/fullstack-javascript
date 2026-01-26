# Domain Events

## Introduction

Domain events represent something meaningful that happened in the domain. They capture facts and enable decoupled reactions.
In layered DDD, lower layers should not directly call upper layers. Upward “communication” typically happens via dependency inversion (interfaces/ports defined in upper layers, implemented below), or by emitting domain events that upper layers handle.
This is a guideline, not a hard rule; the key is preserving dependency direction and avoiding tight coupling.

## Example

`OrderPlaced` can trigger email notifications, inventory updates, and analytics, without the order aggregate knowing the details.

Example with layers (domain, application, infrastructure):

```php
<?php

declare(strict_types=1);

// Domain
interface DomainEvent {}

final class OrderPlaced implements DomainEvent {
    public function __construct(
        public readonly string $orderId,
        public readonly int $totalCents
    ) {}
}

final class Order {
    /** @var DomainEvent[] */
    private array $events = [];

    public function __construct(private string $id) {}

    public function place(int $totalCents): void {
        // business rules...
        $this->events[] = new OrderPlaced($this->id, $totalCents);
    }

    /** @return DomainEvent[] */
    public function pullEvents(): array {
        $events = $this->events;
        $this->events = [];
        return $events;
    }
}

// Application
interface EventBus {
    /** @param DomainEvent[] $events */
    public function publish(array $events): void;
}

final class PlaceOrderService {
    public function __construct(private EventBus $bus) {}

    public function handle(Order $order, int $totalCents): void {
        $order->place($totalCents);
        $this->bus->publish($order->pullEvents());
    }
}

// Infrastructure
final class SendOrderEmail {
    public function __invoke(OrderPlaced $event): void {
        // send email...
    }
}

final class SimpleEventBus implements EventBus {
    /** @var array<class-string, callable[]> */
    private array $handlers = [];

    public function subscribe(string $eventClass, callable $handler): void {
        $this->handlers[$eventClass][] = $handler;
    }

    public function publish(array $events): void {
        foreach ($events as $event) {
            foreach ($this->handlers[$event::class] ?? [] as $handler) {
                $handler($event);
            }
        }
    }
}

// Composition root (wiring)
$bus = new SimpleEventBus();
$bus->subscribe(OrderPlaced::class, new SendOrderEmail());
$service = new PlaceOrderService($bus);
...
... 
$service->handle($order, 1000);
```

## Practical Guidance

- Name events in past tense.
- Treat events as immutable facts.
