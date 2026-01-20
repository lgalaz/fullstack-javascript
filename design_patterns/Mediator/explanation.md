# Mediator

## Overview

Centralizes complex communications and control between related objects.
(ChatRoom and Participants)

## When to use

- Many objects communicate in tangled ways.
- You want to reduce direct dependencies between components.
- Coordination logic should be centralized.

## Trade-offs

- Mediator can become overly complex.
- Centralization can reduce flexibility.
- Harder to reason about interactions if mediator grows.
## PHP example

```php
<?php

class ChatRoom
{
    private array $members = [];

    public function register(Participant $participant): void
    {
        $this->members[] = $participant;
    }

    public function send(string $from, string $message): void
    {
        foreach ($this->members as $member) {
            $member->receive($from, $message);
        }
    }
}

class Participant
{
    public function __construct(private ChatRoom $room, private string $name)
    {
    }

    public function send(string $message): void
    {
        $this->room->send($this->name, $message);
    }

    public function receive(string $from, string $message): void
    {
        echo "{$from} to {$this->name}: {$message}\n";
    }
}

$room = new ChatRoom();
$alice = new Participant($room, 'Alice');
$bob = new Participant($room, 'Bob');
$room->register($alice);
$room->register($bob);

$alice->send('Hello');
```
