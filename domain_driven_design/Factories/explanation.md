# Factories

## Introduction

Factories create complex objects while enforcing invariants and hiding construction complexity. They keep construction logic out of entities and services.

## Example

A factory can build an `Order` with required items and compute initial totals.

```php
<?php

final class Order {
    /** @var OrderItem[] */
    private array $items;
    private int $totalCents;

    public function __construct(array $items, int $totalCents) {
        $this->items = $items;
        $this->totalCents = $totalCents;
    }
}

final class OrderFactory {
    /**
     * @param OrderItem[] $items
     */
    public static function create(array $items): Order {
        if ($items === []) {
            throw new InvalidArgumentException('Order must have items.');
        }

        $totalCents = 0;
        foreach ($items as $item) {
            $totalCents += $item->priceCents();
        }

        return new Order($items, $totalCents);
    }
}

final class OrderItem {
    public function __construct(
        private string $sku,
        private int $priceCents
    ) {}

    public function priceCents(): int {
        return $this->priceCents;
    }
}

$items = [
    new OrderItem('SKU-1', 500),
    new OrderItem('SKU-2', 700),
];

$order = OrderFactory::create($items);
```

## Practical Guidance

- Use factories when construction has rules.
- Prefer static factory methods for small object graphs.

Example of a static factory method:

```php
<?php

final class Money {
    private function __construct(
        private int $amount,
        private string $currency
    ) {}

    public static function usd(int $amount): self {
        return new self($amount, 'USD');
    }
}
```
