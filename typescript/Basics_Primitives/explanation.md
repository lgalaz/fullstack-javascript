# TypeScript Basics and Primitives 

## Introduction

TypeScript adds static typing to JavaScript. It helps catch errors early and improves tooling.
Static typing means types are checked at compile time (or build time), not at runtime. It doesn't change JavaScript behavior; it just lets the compiler validate how values are used before you run the code.
TypeScript types are erased at runtime. They are a developer-time contract that sits on top of JavaScript's actual runtime behavior.
TypeScript doesn’t enforce runtime checks. For runtime validation you’d use a schema/validation library like Zod, Yup, Joi, or Valibot (or manual checks). Zod is a common choice because it can also infer TypeScript types from the schema.

## Primitive Types

```typescript
let name: string = 'Ada';
let age: number = 36;
let isActive: boolean = true;
let nothing: null = null;
let notSet: undefined = undefined;
let big: bigint = 9007199254740991n;
let unique: symbol = Symbol('id');
```

Primitives are immutable values. When you pass them around, you pass the value itself, not a reference.

JavaScript still controls runtime semantics. For example, `number` is a double-precision float, `bigint` cannot mix with `number` without explicit conversion, and `symbol` keys are not enumerable by `Object.keys`.

```typescript
const n = 1 + 0.2;
console.log(n); // 1.2, floating point

const id = Symbol('id');
const user = { [id]: 123, name: 'Ada' };
console.log(Object.keys(user)); // ['name']
```

## null and undefined

With `strictNullChecks`, `null` and `undefined` are not assignable to other types without a union. Without it, they flow into everything and reduce safety.
Without `strictNullChecks`, `null`/`undefined` are treated as valid values for any type, so you can accidentally access properties on `null` at runtime without a type error.
You can enable it explicitly in `tsconfig.json` (`"strictNullChecks": true`) or via `"strict": true` (which turns on all strict flags).

```typescript
type User = { name: string };
const maybeUser: User | null = null;
if (maybeUser) {
  console.log(maybeUser.name);
}
```

Note: with `strictNullChecks`, you must narrow a `User | null` before accessing properties (e.g., `if (maybeUser)`), otherwise TypeScript reports an error.

Example without `strictNullChecks` (unsafe but allowed):

```typescript
type User = { name: string };
let user: User = null; // Allowed without strictNullChecks
console.log(user.name); // Runtime error if user is null
```

Example with `strictNullChecks` enabled:

```typescript
type User = { name: string };
let user: User = null; // Error: Type 'null' is not assignable to type 'User'

function greet(u: User | null) {

  return u.name; // Error: Object is possibly 'null'
}
```

## Arrays

```typescript
let nums: number[] = [1, 2, 3];
let names: Array<string> = ['Ada', 'Grace'];
```

Both syntaxes are equivalent; use the one your team prefers.

Arrays are mutable containers. Their element type is a constraint, not a runtime enforcement.

```typescript
const values: number[] = [1, 2, 3];
// values.push('x'); // Compile error, but at runtime JS would allow it.
```

## any vs unknown

`any` disables type checking; `unknown` forces you to narrow before use.

```typescript
let value: unknown = 'text';
if (typeof value === 'string') {
  console.log(value.toUpperCase());
}
```

Prefer `unknown` at boundaries (like JSON parsing) so you must validate before use.

`unknown` is only assignable to itself and `any`, and you cannot access properties or call it without a type guard. That is why it "forces" narrowing: the compiler blocks unsafe operations until you prove the type.
Note: a type guard is a check (like `typeof`, `instanceof`, `in`, or a custom `value is T` function) that narrows a type within a block.

At type‑checking time (compile time), during TypeScript’s static analysis, TypeScript recognizes common type-guard conditionals (like `typeof`, `instanceof`, `in`, or custom `x is Y` functions). Inside the guarded branch, the value is narrowed; outside, it reverts to the original type (e.g., `unknown`).

```typescript
function parseJson(input: string): unknown {

  return JSON.parse(input);
}

const data = parseJson('{"count": 1}');
if (typeof data === 'object' && data && 'count' in data) {
  const count = (data as { count: number }).count;
}
```

## void and never

- `void` means no return value.
- `never` means a function never returns.

```typescript
function log(msg: string): void {
  console.log(msg);
}

function fail(message: string): never {
  throw new Error(message);
}
```

Use `never` in exhaustive checks to ensure all cases are handled.

```typescript
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; size: number };

function area(shape: Shape) {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
```

## Interview Questions and Answers

### 1. Why is `unknown` safer than `any` at boundaries?

`unknown` forces explicit narrowing before use, so you validate data instead of assuming it. This prevents unsafe property access and makes edge cases visible in code.

### 2. When should you use `never` in real code?

For unreachable branches (exhaustive checks in discriminated unions) and functions that truly never return (throw or infinite loop). It gives you compile-time guarantees that all cases are handled.
