# Composition Root

## What it is
The Composition Root is the place where an application's object graph is assembled. It is typically at the application's entry point (CLI, HTTP controller, worker) and is responsible for wiring concrete implementations to interfaces.

## Why it matters
Keeping composition in one place:
- Makes dependencies explicit.
- Keeps constructors free of hidden creation logic.
- Improves testability by allowing easy substitution of implementations.
- Keeps infrastructure concerns at the edge.

## In DDD terms
In DDD, the domain and application layers should not depend on infrastructure. The Composition Root lives at the boundary and wires:
- Domain services and entities.
- Application services (use cases).
- Infrastructure implementations (repositories, gateways, configs).

This preserves dependency direction: infrastructure depends on domain abstractions, not the other way around.

## Example (from this project)
The CLI entry point `bin/calculate-fee` creates:
- An infrastructure repository (`InMemoryFeeTableRepository`).
- Domain services (`FeeInterpolator`, `FeeRoundingPolicy`).
- The application service (`FeeCalculator`).

That assembly is the Composition Root.

## When to use
Always. Every application needs a single place where dependencies are composed. The exact location depends on the delivery mechanism (CLI, HTTP, job runner).
