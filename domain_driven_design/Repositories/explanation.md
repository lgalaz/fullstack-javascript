# Repositories

## Introduction

Repositories provide collection-like access to aggregates. They hide persistence details and allow the domain to stay clean.

## Example

`OrderRepository.save(order)` and `OrderRepository.byId(id)` are typical methods.

## Practical Guidance

- Keep repository interfaces in the domain layer.
- Implement them in infrastructure layers.

Domain layer interface example:

```php
<?php

interface OrderRepository {
    public function save(Order $order): void;
    public function byId(string $id): ?Order;
}
```

Infrastructure layer implementation example:

```php
<?php

final class SqlOrderRepository implements OrderRepository {
    public function __construct(private PDO $pdo) {}

    public function save(Order $order): void {
        // persist order using SQL
    }

    public function byId(string $id): ?Order {
        // load order from SQL
        return null;
    }
}
```
