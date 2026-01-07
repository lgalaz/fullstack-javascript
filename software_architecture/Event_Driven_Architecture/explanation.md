# Event-Driven Architecture

## Introduction

Event-driven architecture (EDA) uses events to signal changes and trigger reactions. Producers emit events, and consumers react asynchronously.

## What It Is

- Producers publish events when something happens.
- Consumers subscribe and react independently.
- Communication is usually asynchronous via a broker.

## When It Is the Best Solution

- You need loose coupling between components.
- Multiple systems must react to the same business event.
- You want to scale consumers independently.

## Misuse and When It Is Overkill

- Overkill for simple request/response flows.
- Misuse when events are used without clear contracts or schemas.
- Debugging can be harder due to async flows.

## Example (Event Publish/Consume)

```text
OrderPlaced -> Inventory Service
           -> Email Service
           -> Analytics Service
```

```javascript
// pseudo: publish an event
bus.publish('OrderPlaced', { orderId: 123, total: 42 });
```
