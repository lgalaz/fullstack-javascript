# Monolith Architecture

## Introduction

A monolith is a single deployable application that contains all business capabilities in one codebase and one runtime process. It is the simplest operational model and often the best starting point.

## What It Is

- One codebase and one deployable unit.
- All modules run in the same process and share memory.
- Internal calls are function calls, not network calls.

## When It Is the Best Solution

- Early-stage products where speed of iteration matters most.
- Small to medium teams that benefit from one repository and one deployment.
- Systems where low latency between modules is important.

## Misuse and When It Is Overkill

- Not overkill on its own, but it becomes painful if the codebase lacks modular boundaries.
- Overkill to split into services before you have clear scaling or ownership needs.
- Common misuse is turning it into a "big ball of mud" with no domain boundaries.

## Example (Modularized Monolith Structure)

```text
app/
  users/
    service.js
    repository.js
  billing/
    service.js
    repository.js
  http/
    routes.js
  main.js
```

```javascript
// main.js
const users = require('./users/service');
const billing = require('./billing/service');

async function handleRequest(req) {
  if (req.path === '/charge') {
    const user = await users.getUser(req.userId);
    return billing.charge(user, req.amount);
  }
}
```
