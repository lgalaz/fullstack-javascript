# Modular Monolith

## Introduction

A modular monolith is a single deployable application with strict internal module boundaries. It keeps the operational simplicity of a monolith while enforcing architectural discipline.

## What It Is

- One deployment, but multiple well-defined modules.
- Modules own their data and expose explicit interfaces.
- Cross-module communication goes through interfaces, not direct imports.

## When It Is the Best Solution

- You want monolith simplicity but expect the system to grow.
- You need clear ownership boundaries without distributed systems overhead.
- You want to be able to split into services later, if needed.

## Misuse and When It Is Overkill

- Overkill if the system is tiny and boundaries add friction.
- Misuse when modules leak data or call each other directly.
- Not a free path to microservices; you still need real domain separation.

## Common Examples

- Large .NET or Java enterprise apps that keep multiple domains in one deployable unit, often with separate assemblies/modules per domain.
- Monorepo web apps where domains like billing, users, and search are separated by module boundaries but share one runtime.
- Products that need strong internal boundaries today but want the option to split services later.

Note: modular monoliths are often built in monorepos. Modern tooling (Nx, Turborepo, Bazel, pnpm workspaces) makes large monorepos practical by enabling fast builds, caching, and dependency-aware testing.

## Example (Module Boundary)

```javascript
// users/index.js
module.exports = {
  getUser,
};

// billing/service.js
const users = require('../users');

async function charge(userId, amount) {
  const user = await users.getUser(userId); // only through public API
  // billing logic here

  return { ok: true, userId, amount };
}

module.exports = { charge };
```
