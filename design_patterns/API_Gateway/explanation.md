# API Gateway

## Overview

Provides a single entry point that routes, aggregates, and secures backend services.

## When to use

- Clients need a unified API over multiple services.
- You want central authentication and rate limiting.
- You need response aggregation and protocol translation.

## Trade-offs

- Gateway can become a bottleneck or single point of failure.
- Must be scaled and secured carefully.
- Changes require coordination across teams.
## PHP example

```php
<?php

class UserServiceClient
{
    public function getUser(int $id): array
    {
        return ['id' => $id, 'name' => 'Ada'];
    }
}

class OrderServiceClient
{
    public function getOrders(int $userId): array
    {
        return [['id' => 1, 'total' => 45]];
    }
}

class ApiGateway
{
    public function __construct(private UserServiceClient $users, private OrderServiceClient $orders)
    {
    }

    public function getUserDashboard(int $userId): array
    {
        return [
            'user' => $this->users->getUser($userId),
            'orders' => $this->orders->getOrders($userId),
        ];
    }
}

$gateway = new ApiGateway(new UserServiceClient(), new OrderServiceClient());
print_r($gateway->getUserDashboard(1));
```
