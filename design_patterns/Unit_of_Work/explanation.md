# Unit of Work

## Overview

Tracks changes and coordinates writing them as a single transaction.

## When to use

- You need atomic persistence across multiple aggregates.
- You want to batch writes for efficiency.
- Consistency should be enforced at commit time.

## Trade-offs

- Complex lifecycle management of tracked objects.
- Harder to reason about when changes are flushed.
- Requires transaction-aware infrastructure.
## PHP example

```php
<?php

class UnitOfWork
{
    private array $new = [];
    private array $dirty = [];
    private array $deleted = [];

    public function registerNew(object $entity): void
    {
        $this->new[] = $entity;
    }

    public function registerDirty(object $entity): void
    {
        $this->dirty[] = $entity;
    }

    public function registerDeleted(object $entity): void
    {
        $this->deleted[] = $entity;
    }

    public function commit(): void
    {
        foreach ($this->new as $entity) {
            echo "insert\n";
        }
        foreach ($this->dirty as $entity) {
            echo "update\n";
        }
        foreach ($this->deleted as $entity) {
            echo "delete\n";
        }
    }
}

$uow = new UnitOfWork();
$uow->registerNew((object) ['id' => 1]);
$uow->registerDirty((object) ['id' => 2]);
$uow->registerDeleted((object) ['id' => 3]);
$uow->commit();
```
