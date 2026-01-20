# Event Sourcing

## Overview

Persists state as a sequence of events instead of storing only current state.

## When to use

- You need full audit history and replayability.
- Business changes should be traceable over time.
- You want to build projections for different read models.

## Trade-offs

- Event versioning and schema evolution complexity.
- Rehydration can be costly without snapshots.
- Harder to reason about current state without tooling.
## PHP example

```php
<?php

class BankAccount
{
    private int $balance = 0;
    private array $changes = [];

    public function deposit(int $amount): void
    {
        $this->record(['type' => 'deposited', 'amount' => $amount]);
    }

    public function withdraw(int $amount): void
    {
        $this->record(['type' => 'withdrew', 'amount' => $amount]);
    }

    public function apply(array $event): void
    {
        if ($event['type'] === 'deposited') {
            $this->balance += $event['amount'];
        }

        if ($event['type'] === 'withdrew') {
            $this->balance -= $event['amount'];
        }
    }

    private function record(array $event): void
    {
        $this->apply($event);
        $this->changes[] = $event;
    }

    public function getChanges(): array
    {
        return $this->changes;
    }
}

$events = [];
$account = new BankAccount();
$account->deposit(100);
$account->withdraw(30);
$events = array_merge($events, $account->getChanges());

$replay = new BankAccount();
foreach ($events as $event) {
    $replay->apply($event);
}
```
