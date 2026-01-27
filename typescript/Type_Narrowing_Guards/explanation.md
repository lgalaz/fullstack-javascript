# Type Narrowing and Guards 

## Introduction

Type narrowing refines a union type to a more specific type at runtime.

TypeScript uses control-flow analysis to track these checks and refine types in each branch.

Control-flow analysis means TypeScript looks at the flow of your code (if/else, return, throw, loops, etc.) to narrow types within each path based on the checks it sees.

Narrowing is based on real JavaScript checks, so you should align type guards with runtime behavior to avoid unsoundness.

“Unsoundness” means the type system allows a program that can still go wrong at runtime. In other words, TypeScript’s types say something is safe, but the actual JavaScript behavior can violate that.

Example: using a type assertion that doesn’t match reality can make TS think a value is a number, but it’s actually a string, leading to runtime errors.

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

## Truthiness and null checks

```typescript
function greet(name?: string) {
  if (!name) return 'Hello';

  return `Hello ${name.toUpperCase()}`;
}
```

Be careful: truthiness checks also exclude empty strings and 0, not just null/undefined.

## User-Defined Type Guards

```typescript
type User = { id: number; name: string };

type Admin = { id: number; role: 'admin' };

function isAdmin(u: User | Admin): u is Admin {

  return (u as Admin).role === 'admin';
}
```

User-defined guards are useful when the built-in checks are not enough to distinguish shapes.
User‑defined type guards are functions that return a type predicate (value is T). So they’re predicates in the TypeScript sense: boolean checks that narrow types.

A safer guard avoids assertions and checks the shape directly:

```typescript
function isAdminSafe(u: User | Admin): u is Admin {

  return 'role' in u && u.role === 'admin';
}
```

The `u is Admin` part is a type predicate. It tells TypeScript that when the function returns `true`, the argument can be treated as `Admin` in that branch. The function still returns a boolean at runtime.

```typescript
function printRole(u: User | Admin) {
  if (isAdminSafe(u)) {
    // u is Admin here
    console.log(u.role);
  }
}
```

## Assertion Functions

Assertion functions narrow types by throwing on invalid inputs.

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Expected string');
  }
}

function parse(value: unknown) {
  assertIsString(value);

  return value.toUpperCase();
}
```

`asserts value is string` declares an assertion function: if it returns normally, TypeScript narrows `value` to `string` after the call.
The `if` block is the runtime check that enforces the assertion by throwing when the value is not a string.

## Array and discriminant guards

```typescript
function take(value: string | string[]) {
  if (Array.isArray(value)) {
    return value.join(',');
  }

  return value;
}

type Event =
  | { type: 'click'; x: number; y: number }
  | { type: 'keydown'; key: string };

function handleEvent(event: Event) {
  if (event.type === 'click') {
    return event.x + event.y;
  }

  return event.key;
}
```

## Interview Questions and Answers

### 1. What is a type guard?

A runtime check that narrows a type for the TypeScript compiler.

### 2. When would you use a user-defined type guard?

When built-in checks are not enough to determine a specific type.

### 3. What is the risk of assertions and assertion functions?

Type assertions and assertion functions are trusted by the compiler. If their runtime checks are wrong or missing, TypeScript will still narrow the type and you can get runtime errors.
