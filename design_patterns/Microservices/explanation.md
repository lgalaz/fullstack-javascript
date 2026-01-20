# Microservices

## Overview

Splits a system into independently deployable services aligned to business capabilities.

## When to use

- Teams need independent deployment and scaling.
- Bounded contexts can be clearly separated.
- Different services require different tech stacks.

## Trade-offs

- Operational complexity and distributed failures.
- Data consistency across services is harder.
- Requires strong DevOps and observability.

## PHP example

```php
<?php

interface InventoryClient
{
    public function reserve(string $sku, int $qty): bool;
}

interface BillingClient
{
    public function charge(int $amount): bool;
}

class OrderService
{
    public function __construct(private InventoryClient $inventory, private BillingClient $billing)
    {
    }

    public function placeOrder(string $sku, int $qty, int $amount): void
    {
        echo "Reserving inventory\n";
        if (!$this->inventory->reserve($sku, $qty)) {
            throw new RuntimeException('Out of stock');
        }

        echo "Charging customer\n";
        if (!$this->billing->charge($amount)) {
            throw new RuntimeException('Charge failed');
        }

        echo "Order placed\n";
    }
}

class FakeInventoryClient implements InventoryClient
{
    public function reserve(string $sku, int $qty): bool
    {
        return true;
    }
}

class FakeBillingClient implements BillingClient
{
    public function charge(int $amount): bool
    {
        return true;
    }
}

$service = new OrderService(new FakeInventoryClient(), new FakeBillingClient());
$service->placeOrder('sku-1', 2, 5000);
```
