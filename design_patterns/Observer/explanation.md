# Observer

## Overview

Defines a one-to-many dependency so observers are notified of changes.

## When to use

- You need event-driven updates between components.
- You want to decouple publishers from subscribers.
- Multiple listeners should react to a change.

## Trade-offs

- Notification order can be unpredictable.
- Memory leaks if subscriptions are not cleaned up.
- Debugging event cascades can be hard.
## PHP example

```php
<?php

class Subject
{
    private array $observers = [];

    public function attach(callable $observer): void
    {
        $this->observers[] = $observer;
    }

    public function notify(string $event): void
    {
        foreach ($this->observers as $observer) {
            $observer($event);
        }
    }
}

$subject = new Subject();
$subject->attach(fn (string $event) => print("Observer 1: {$event}
"));
$subject->attach(fn (string $event) => print("Observer 2: {$event}
"));

$subject->notify('order shipped');
```
