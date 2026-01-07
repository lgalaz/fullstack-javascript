# Layered (N-Tier) Architecture

## Introduction

Layered architecture separates a system into vertical layers such as presentation, application/service, and data. Each layer has a clear responsibility and depends only on the layer below it.

## What It Is

- Presentation layer: UI and HTTP handlers.
- Application layer: business use cases and orchestration.
- Data layer: persistence and external integrations.

## When It Is the Best Solution

- CRUD-heavy applications with clear separation of concerns.
- Teams that want consistent structure across many services.
- Systems that benefit from testable business logic in the middle layer.

## Misuse and When It Is Overkill

- Overkill for tiny apps where layers add boilerplate.
- Misuse when layers are bypassed (e.g., controllers calling DB directly).
- Can become rigid if every change requires touching all layers.

## Example (Simple Layer Flow)

```javascript
// controller.js (presentation)
const userService = require('./userService');

async function getUserHandler(req, res) {
  const user = await userService.getUser(req.params.id);
  res.json(user);
}
```

```javascript
// userService.js (application)
const userRepo = require('./userRepo');

async function getUser(id) {
  return userRepo.findById(id);
}

module.exports = { getUser };
```

```javascript
// userRepo.js (data)
async function findById(id) {
  return { id, name: 'Ada' };
}

module.exports = { findById };
```
