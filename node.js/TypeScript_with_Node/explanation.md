# TypeScript with Node.js

## What matters

- TypeScript improves refactoring, tooling, and maintainability.
- It does not replace runtime validation.

## Interview points

- Use strict mode.
- Align TypeScript module settings with the actual Node runtime, usually `NodeNext` for modern ESM-aware projects.
- Validate external data: env vars, JSON, HTTP payloads, and database rows.

## Senior notes

- Good TypeScript design is about clear boundaries and accurate domain models, not maximal type cleverness.
- Compile predictable output for production.

## Example

```typescript
type User = { id: string; email: string };

function formatUser(user: User) {
  return `${user.id}:${user.email}`;
}
```
