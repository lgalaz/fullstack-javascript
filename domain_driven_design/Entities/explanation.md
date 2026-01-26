# Entities

## Introduction

Entities are domain objects defined by identity, not just their attributes. They can change over time but remain the same conceptual thing (They have Lifecycle, mutable state).

## Example

A `User` is still the same user if their email changes, because identity is tied to `id`.

```php
<?php

final class User {
    public function __construct(
        private string $id,
        private string $email
    ) {}

    public function changeEmail(string $email): void {
        if (!str_contains($email, '@')) {
            throw new InvalidArgumentException('Invalid email.');
        }

        $this->email = $email;
    }

    public function id(): string {
        return $this->id;
    }
}
```

An aggregate root example:
Put the invariants and rules that govern the aggregate’s consistency on the aggregate root. Entities inside the aggregate should only enforce their own local invariants (state-specific rules). Anything that requires coordination across the aggregate belongs on the root.

```php
<?php

final class Order {
    /** @var OrderItem[] */
    private array $items = [];

    public function __construct(private string $id) {}

    public function addItem(string $sku, int $qty): void {
        if ($qty <= 0) {
            throw new InvalidArgumentException('Quantity must be positive.');
        }

        $this->items[] = new OrderItem($sku, $qty);
    }

    public function id(): string {
        return $this->id;
    }
}

final class OrderItem {
    public function __construct(
        private string $sku,
        private int $qty
    ) {
        if ($this->sku === '') {
            throw new InvalidArgumentException('SKU cannot be empty.');
        }
    }
}
```

## Practical Guidance

- Use stable identifiers.
- Place business rules on the entity, not in services.
Entities should own the rules that keep their own state valid (invariants), not that they should absorb all business logic. Keep entities focused; put cross‑entity or process logic in domain services or aggregates.
