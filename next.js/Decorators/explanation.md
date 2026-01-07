# Decorators

## Introduction

Next.js runs on top of Node.js and supports JavaScript or TypeScript. Decorators are not a built-in JavaScript feature, so you can only use them if your toolchain compiles them (TypeScript or Babel). Most Next.js apps avoid decorators and stick to explicit composition and functions.

## Example: TypeScript Decorator (Requires Compiler Support)

```typescript
function logCall(
  _target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`${propertyKey} called with`, args);
    return original.apply(this, args);
  };
}

class ApiClient {
  @logCall
  async fetchUser(id: string) {
    return { id };
  }
}
```

## When Decorators Are a Good Idea

- You already rely on TypeScript decorators for a library or shared utilities.
- You want declarative cross-cutting concerns in server-side code.

## When to Avoid

- You want to keep your Next.js config minimal.
- You prefer clearer, explicit function composition.
