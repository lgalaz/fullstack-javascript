# Service-Oriented Architecture (SOA)

## Introduction

SOA organizes functionality into reusable services with standardized interfaces, often coordinated by an enterprise service bus (ESB). It predates microservices and focuses on reuse and integration across large organizations.

## What It Is

- Services expose business capabilities via well-defined contracts.
- Often uses centralized governance and shared infrastructure.
- Integration may be mediated by an ESB.

## When It Is the Best Solution

- Large enterprises with many legacy systems to integrate.
- Cross-team reuse of shared business capabilities.
- Scenarios requiring strong governance and formal contracts.

## Misuse and When It Is Overkill

- Overkill for greenfield products or small teams.
- ESB can become a bottleneck or single point of failure.
- Can slow delivery if governance is heavy.

## Example (Service Contract)

```text
CustomerService
  - getCustomer(id)
  - updateCustomer(id, data)
```

```javascript
// customer-service.js (contracted API)
app.get('/customers/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Ada' });
});
```
