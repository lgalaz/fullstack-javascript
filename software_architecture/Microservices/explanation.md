# Microservices Architecture

## Introduction

Microservices split a system into independently deployable services, each owning a small, well-defined business capability. They trade operational complexity for scalability and team autonomy.

## What It Is

- Multiple services, each with its own codebase and data store.
- Services communicate via APIs or messaging.
Note: in ideal microservices, each service owns its data to avoid tight coupling. Sharing a database is a common early-stage compromise but reduces independence and makes schema changes risky because multiple services depend on the same tables, so changes require coordination. Separate databases avoid that coupling but require explicit data sync strategies (events, CDC/change data capture, read models) to prevent drift.
- Each service can be deployed independently.

## When It Is the Best Solution

- Large systems with multiple teams and clear domain boundaries.
- Parts of the system scale differently (e.g., search vs. billing).
- You need independent deployment and failure isolation.

## Misuse and When It Is Overkill

- Overkill for small teams or early-stage products.
- Misuse when services are split by technical layers instead of business domains.
- Adds latency, operational overhead, and data consistency challenges.

## Example (Service Separation)

```text
Auth Service -> issues tokens
Billing Service -> charges payments
Orders Service -> manages orders
```

```javascript
// orders-service.js
http.createServer((req, res) => {
  if (req.url === '/orders/1') {
    res.end(JSON.stringify({ id: 1, total: 42 }));
  }
}).listen(4000);
```
