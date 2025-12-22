# Type Narrowing and Guards - Comprehensive Study Guide

## Introduction

Type narrowing refines a union type to a more specific type at runtime.

## typeof Narrowing

```typescript
function print(value: string | number) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}
```

## in Operator

```typescript
type Cat = { meow: () => void };
type Dog = { bark: () => void };

function speak(pet: Cat | Dog) {
  if ('meow' in pet) {
    pet.meow();
  } else {
    pet.bark();
  }
}
```

## instanceof

```typescript
class ApiError extends Error {}

function handle(err: Error | ApiError) {
  if (err instanceof ApiError) {
    console.log('API error');
  }
}
```

## User-Defined Type Guards

```typescript
type User = { id: number; name: string };

type Admin = { id: number; role: 'admin' };

function isAdmin(u: User | Admin): u is Admin {
  return (u as Admin).role === 'admin';
}
```

## Interview Questions and Answers

### 1. What is a type guard?

A runtime check that narrows a type for the TypeScript compiler.

### 2. When would you use a user-defined type guard?

When built-in checks are not enough to determine a specific type.
