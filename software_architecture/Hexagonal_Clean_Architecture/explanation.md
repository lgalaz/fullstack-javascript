# Hexagonal (Ports and Adapters) / Clean Architecture

## Introduction

Hexagonal (Ports and Adapters) and Clean Architecture separate business logic from external dependencies. The core domain is isolated, and adapters connect to databases, web frameworks, and third-party services.

Why “hexagonal”: the diagram often shows a hexagon in the center (the domain) with ports on its sides. The shape is just a metaphor to show that the core can have many adapters around it and should not depend on any one of them. This is essentially separation of concerns and decoupling, formalized with explicit boundaries.

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

## Common Use Cases

- Domains with long-lived rules (billing, subscriptions, inventory) where the business logic should outlive frameworks.
- Apps that must support multiple entry points (HTTP API, CLI, background jobs) using the same use cases.
- Systems that may swap infrastructure (database vendors, message brokers) without rewriting core logic.

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

Example: HTTP adapter calling the same use case:

```javascript
// http-adapter.js
function createGetUserHandler(getUser) {

  return async function handler(req, res) {
    const user = await getUser.execute(req.params.id);
    res.json(user);
  };
}
```
