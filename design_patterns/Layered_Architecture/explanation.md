# Layered Architecture

## Overview

Organizes code into layers (presentation, domain, data) with clear dependencies.

## When to use

- You need a straightforward separation of concerns.
- You want to limit coupling between UI and data access.
- The system is a classic CRUD-style application.

## Trade-offs

- Layers can become leaky and tightly coupled.
- Strict layering may hurt performance.
- Business logic can get scattered.
## PHP example

```php
<?php

class UserRepository
{
    public function findName(int $id): string
    {
        return $id === 1 ? 'Ada' : 'unknown';
    }
}

class UserService
{
    public function __construct(private UserRepository $repo)
    {
    }

    public function getName(int $id): string
    {
        return $this->repo->findName($id);
    }
}

class UserController
{
    public function __construct(private UserService $service)
    {
    }

    public function show(int $id): void
    {
        echo $this->service->getName($id) . "\n";
    }
}

$controller = new UserController(new UserService(new UserRepository()));
$controller->show(1);
```
