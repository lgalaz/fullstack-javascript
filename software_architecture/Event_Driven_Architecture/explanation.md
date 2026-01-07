# Event-Driven Architecture

## Introduction

Event-driven architecture (EDA) uses events to signal changes and trigger reactions. Producers emit events, and consumers react asynchronously. It is closely related to pub/sub (publish-subscribe), which is a common messaging pattern used to implement EDA.

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

## Common Tech and When to Use Them

- Kafka: high-throughput event streams, durable logs, and replay; used for analytics pipelines, audit trails, and large-scale event processing.
- RabbitMQ: reliable message broker with routing and acknowledgments; used for task queues and workflows.
- AWS SQS/SNS: managed queues and pub/sub; used for background jobs and fan-out without running your own broker.
- AWS EventBridge: managed event bus (central channel that receives events and routes them to targets based on rules); used for service-to-service events and SaaS integrations.
- NATS: lightweight pub/sub with low latency; used for internal service messaging.
- Redis Streams: simple streaming on top of Redis; used for smaller event pipelines or when Redis is already in the stack.

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
