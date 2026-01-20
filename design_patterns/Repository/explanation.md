# Repository

## Overview

Mediates between the domain and data mapping layers using a collection-like interface.

## When to use

- You want to decouple domain logic from persistence details.
- You need testable data access behind interfaces.
- Aggregates should be retrieved and saved consistently.

## Trade-offs

- Can hide performance characteristics of queries.
- Complex queries may not fit a repository abstraction.
- Requires careful boundary between domain and persistence.

## Note on ORMs

Active Record-style ORMs often mix domain logic and persistence on the model. A repository can complement this by centralizing complex queries and collection creation, while the model still enforces its own invariants.

In a Data Mapper setup:

- Domain model has no persistence logic.
- Data Mapper handles mapping to/from storage.
- Repository sits above the mapper, exposing collection-like operations and hiding storage details.
So the flow is usually: domain ↔ repository ↔ data mapper ↔ database. In Active Record, the model itself plays both domain and mapper roles.

## PHP example

```php
<?php

class UserEntity
{
    public function __construct(public int $id, public string $name)
    {
    }
}

class UserRepository
{
    // Acts as a simple in-memory data mapper for the example.
    private array $users = [];

    public function save(UserEntity $user): void
    {
        $this->users[$user->id] = $user;
    }

    public function getById(int $id): ?UserEntity
    {
        return $this->users[$id] ?? null;
    }
}

$repository = new UserRepository();
$repository->save(new UserEntity(1, 'Ada'));

echo $repository->getById(1)?->name . "\n";
```
