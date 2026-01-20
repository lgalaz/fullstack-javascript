# CQRS

## Overview

Separates read models from write models to optimize each independently.

## When to use

- Read and write workloads have different performance needs.
- You want to scale reads without affecting writes.
- Complex domain writes should stay in a rich model.

## Trade-offs

- Eventual consistency between models.
- Operational complexity with multiple stores.
- More code and infrastructure to maintain.
## PHP example

```php
<?php

class CreateUserCommand
{
    public function __construct(public string $email)
    {
    }
}

class GetUserQuery
{
    public function __construct(public string $email)
    {
    }
}

class UserCommandHandler
{
    public function __construct(private array &$writeModel)
    {
    }

    public function handle(CreateUserCommand $command): void
    {
        $this->writeModel[$command->email] = ['email' => $command->email];
    }
}

class UserQueryHandler
{
    public function __construct(private array $readModel)
    {
    }

    public function handle(GetUserQuery $query): ?array
    {
        return $this->readModel[$query->email] ?? null;
    }
}

$writeModel = [];
$commandHandler = new UserCommandHandler($writeModel);
$commandHandler->handle(new CreateUserCommand('ada@example.com'));

$queryHandler = new UserQueryHandler($writeModel);
print_r($queryHandler->handle(new GetUserQuery('ada@example.com')));
```
