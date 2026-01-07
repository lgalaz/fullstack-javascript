# Hexagonal (Ports and Adapters) / Clean Architecture

## Introduction

Hexagonal (Ports and Adapters) and Clean Architecture separate business logic from external dependencies. The core domain is isolated, and adapters connect to databases, web frameworks, and third-party services.

## What It Is

- Domain logic in the center with no framework dependencies.
- Ports define interfaces the domain uses.
- Adapters implement ports for databases, HTTP, or messaging.

## When It Is the Best Solution

- You need strong testability and long-lived domain logic.
- You want to swap infrastructure without rewriting core logic.
- Multiple delivery mechanisms (HTTP, CLI, jobs) share the same use cases.

## Misuse and When It Is Overkill

- Overkill for small apps with simple logic.
- Misuse when the abstraction layers add more code than value.
- Can slow delivery if the team is not aligned on boundaries.

## Example (Ports and Adapters)

```javascript
// port (interface)
class UserRepository {
  findById(id) {}
}

// adapter (database)
class PostgresUserRepository extends UserRepository {
  findById(id) {
    return { id, name: 'Ada' };
  }
}

// use case (domain)
class GetUser {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  execute(id) {
    return this.userRepo.findById(id);
  }
}
```
