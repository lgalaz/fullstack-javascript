# Decorators

## Introduction

Decorators are functions that can wrap or modify classes, methods, accessors, properties, or parameters. In TypeScript they are a compiler feature (not enabled by default) and are commonly used for metadata and cross-cutting concerns like logging and validation.

## Enabling Decorators

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

Some libraries also rely on `emitDecoratorMetadata` plus `reflect-metadata` to read type metadata at runtime.

## Class Decorator

```typescript
function sealed<T extends { new (...args: any[]): {} }>(constructor: T) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class User {
  constructor(public name: string) {}
}
```

## Method Decorator

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

class Account {
  private balance = 0;

  @logCall
  deposit(amount: number) {
    this.balance += amount;
  }
}
```

## Parameter Decorator (metadata use)

```typescript
import 'reflect-metadata';

function required(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  const existing = Reflect.getOwnMetadata('required', target, propertyKey) || [];
  existing.push(parameterIndex);
  Reflect.defineMetadata('required', existing, target, propertyKey);
}

class Mailer {
  send(@required to: string, subject: string) {
    return { to, subject };
  }
}
```

Parameter decorators are mostly useful when combined with runtime metadata.

## When Decorators Are a Good Idea

- You need reusable, declarative behavior like validation, caching, or authorization.
- You want to attach metadata for frameworks or dependency injection.
- You prefer a readable, declarative syntax over manual wrapper code.

## When to Avoid

- The behavior is simple enough for a plain function wrapper.
- You need maximum runtime transparency or easy debugging.
- Your team prefers explicit composition over metaprogramming.

## Interview Questions and Answers

### 1. Why are decorators disabled by default?

Because they are a compiler feature and not part of standard JavaScript in most runtimes, so you must opt in explicitly.

### 2. What is a typical use case for method decorators?

Logging, timing, authorization checks, or caching around method calls.

### 3. What do parameter decorators enable?

They let you associate metadata with parameters (often for validation or DI frameworks).

### 4. What is a common gotcha with decorators?

They can hide side effects and make call flows less obvious, which can hurt debugging.
