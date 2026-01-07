# CQRS (Command Query Responsibility Segregation)

## Introduction

CQRS separates reads (queries) from writes (commands). This allows different models for reading and writing data, which can improve performance and scalability.

## What It Is

- Commands change state; queries read state.
- The read model can be denormalized for fast queries.
- The write model enforces business invariants.

## When It Is the Best Solution

- Systems with very different read vs. write patterns.
- Complex domains where writes need strict validation.
- High-scale systems where read performance is critical.

## Misuse and When It Is Overkill

- Overkill for simple CRUD apps.
- Misuse when it splits data without clear ownership.
- Can increase complexity and data synchronization work.

## Example (Separate Read/Write Paths)

```javascript
// command: create order
commandBus.handle('CreateOrder', { userId, items });

// query: list orders
queryBus.handle('GetOrdersForUser', { userId });
```
