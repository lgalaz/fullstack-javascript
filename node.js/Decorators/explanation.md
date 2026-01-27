# Decorators

## Introduction

Node.js itself does not provide decorators. Decorators are a JavaScript proposal and require a transpiler (TypeScript or Babel). In Node.js applications, decorators are mostly used in TypeScript backends or frameworks that rely on metadata.

## Example: TypeScript Method Decorator

```typescript
function time(_target: unknown, name: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = async function (...args: unknown[]) {
    const start = Date.now();
    const result = await original.apply(this, args);
    console.log(`${name} took`, Date.now() - start, 'ms');

    return result;
  };
}

class UserService {
  @time
  async getUser(id: string) {
    return { id };
  }
}
```

## When Decorators Are a Good Idea

- You already compile TypeScript and want declarative cross-cutting behavior.
- You use a framework that depends on decorator metadata.

## When to Avoid

- You need plain Node.js without a build step.
- You prefer explicit composition for clarity and debugging.
