## TypeScript’s value proposition (baseline sanity check). What problem does TypeScript actually solve, beyond “types for JavaScript”?

TypeScript is a static analysis and tooling layer over JavaScript, not a runtime system.

Its real value is:

- Early error detection (compile-time instead of production)
- Executable documentation (types encode intent)
- Refactor safety at scale (renames, API changes)
- Better IDE intelligence (navigation, autocomplete, dead-code detection)
- Constraining invalid states before runtime

It does not guarantee correctness, performance, or runtime safety—those still require tests and runtime checks (validations that run in production, like input/schema checks, type guards, and defensive error handling).

## Structural typing vs nominal typing (different axis from strong vs weak typing). Explain structural typing. Why does it matter in large systems?

TypeScript uses structural typing, meaning compatibility is based on shape, not declared identity.

```typescript
type A = { x: number };
type B = { x: number };

const b: B = { x: 1 };
const a: A = b; // OK
```

Note: “strong vs weak typing” is a different concept (type safety/implicit coercions), not how compatibility is determined.

Examples:
- Structural typing: TypeScript, Go (interfaces), OCaml.
- Nominal typing: Java, C#, Swift, Rust.

Never type note: `never` itself is valid, but the compiler errors when you assign a non-`never` value to a `never` variable (this is why the exhaustiveness check works).

Why this matters:

Pros

- Extremely flexible
- Great for gradual typing
- Works naturally with JS patterns (duck typing: “if it has the right shape, treat it as that type”)

Cons

- Accidental compatibility
- Harder to enforce domain boundaries
- In large systems, we often simulate nominal typing using branding:

```typescript
type UserId = string & { readonly __brand: "UserId" };

function asUserId(id: string): UserId {

  return id as UserId;
}
```

This prevents mixing logically distinct but structurally identical types.

## any vs unknown (this is a senior filter). Compare any and unknown. When should each be used?

Aspect	any	unknown
Type safety	❌ none	✅ enforced
Assignment	Assignable to/from anything	Assignable from anything
Property access	Allowed	❌ must narrow
Use case	Escape hatch	Safe boundary

Example:

let x: unknown;

x.foo(); // ❌ Error
if (typeof x === "object" && x !== null) {
  // still need checks
}

Rule of thumb:

- Use unknown at system boundaries (API input, JSON, catch)
- Avoid any except for legacy interop or incremental migration

## never: when does it appear and why is it useful? When does TypeScript infer never, and how do you use it intentionally?

never represents impossible states.

It appears when:

- A union is exhaustively narrowed
- A function never returns
- An unreachable code path exists

Exhaustiveness checking:

```typescript
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; s: number };

function area(shape: Shape) {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.r ** 2;
    case "square": return shape.s ** 2;
    default:
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

If a new variant is added, the compiler fails—this is deliberate safety.

## Type narrowing: how does TS actually narrow? Explain how TypeScript performs type narrowing.

Type narrowing means refining a broad type (like `unknown` or a union) into a more specific type based on checks in code. TypeScript narrows via control-flow analysis, not runtime logic.

Common narrowing mechanisms:

- typeof
- instanceof
- equality checks
- discriminated unions
- user-defined type guards
  - Note: predicates (`x is T`) are a way to tell the compiler how to narrow.

```typescript
function isUser(x: unknown): x is { id: string } {

  return typeof x === "object" && x !== null && "id" in x;
}
```

Important nuance:

- Narrowing is flow-sensitive
- Mutations can invalidate narrowings
- Aliasing can break safety assumptions

Broader example (union narrowing is scoped to the condition):

```typescript
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; s: number };

function area(shape: Shape) {
  if (shape.kind === "circle") {
    return Math.PI * shape.r ** 2; // circle only
  }

  return shape.s ** 2; // square only
}

function printShape(shape: Shape) {
  if (shape.kind === "square") {
    console.log(shape.s);
  }
  // shape.s is not available here; narrowing ends outside the block
}
```

## Generics: constraint vs inference. When should you constrain generics, and when should you let inference work?

Constraints limit what a generic can be (e.g., `T extends { id: string }`), while inference lets TypeScript deduce `T` from the values you pass. Prefer inference first, constraints only when needed.

Bad:

```typescript
function identity<T extends unknown>(x: T): T {

  return x;
}
```

Good:

```typescript
function identity<T>(x: T): T {

  return x;
}
```

Use constraints when:

- You rely on specific properties
- You want better error messages
- You need key relationships

```typescript
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {

  return obj[key];
}
```

Senior rule: constraints encode assumptions—don’t add them casually.

## keyof, indexed access, and mapped types. Explain how these three work together.

They form the backbone of advanced TS modeling.

type User = {
  id: string;
  age: number;
};

type Keys = keyof User;        // "id" | "age"
type AgeType = User["age"];    // number

type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

This enables:

- DTO transformations
- Form modeling
- API response shaping
- Permission systems

Mapped types are compile-time loops over keys.

## Conditional types and distributivity. What are conditional types, and what does “distributive” mean?

Conditional types:

```typescript
type IsString<T> = T extends string ? true : false;
```

Distributive behavior occurs when the checked type is a naked type parameter:

```typescript
type Result = IsString<string | number>;
// true | false
```

Distributive behavior means a union is checked one member at a time (like mathematical distribution over a set), and the results are unioned back together.

To disable distribution (wrap in square brackets so the union is treated as a single value):

type IsString<T> = [T] extends [string] ? true : false;

This distinction is critical for utility types like Exclude and Extract, which rely on distribution over unions to filter members correctly.

Example:

```typescript
type U = "a" | "b" | "c";
type OnlyB = Extract<U, "b">;   // "b"
type NoB = Exclude<U, "b">;     // "a" | "c"
```

Under the hood, `Extract` and `Exclude` are conditional types that rely on this distributive behavior.

Under-the-hood example (distribution over a union):

```typescript
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

type U = "a" | "b" | "c";
type NoB = MyExclude<U, "b">;  // "a" | "c"
type OnlyB = MyExtract<U, "b">; // "b"
```

Non-distributive variant (wrap in square brackets):

```typescript
type NonDistributiveExtract<T, U> = [T] extends [U] ? T : never;

type U = "a" | "b";
type A = NonDistributiveExtract<U, "b">; // never
```

## interface vs type (no hand-waving — give concrete differences, not vague “it depends”). When do you prefer interface vs type?

interface

- Object shapes
- Public APIs
- Declaration merging
- Extends well

type

- Unions
- Intersections
- Primitives
- Mapped/conditional types

Example merging:

```typescript
interface Window {
  myProp: string;
}

interface Window {
  anotherProp: number;
}
```
Senior convention:

- Libraries → interfaces
- Internal modeling → types

## Declaration merging: when is it dangerous? Declaration merging is powerful—but when is it risky?

Declaration merging is when TypeScript combines multiple declarations with the same name (e.g., interfaces, namespaces, modules) into a single type; it does not apply to `type` aliases.

Example:

```typescript
interface User {
  id: string;
}

// Later in another file:
interface User {
  name: string;
}

// Resulting type has both properties:
const u: User = { id: "1", name: "Ada" };
```

Risks:

- Accidental global pollution
- Version conflicts in dependencies
- Hidden coupling
```typescript
declare global {
  interface Array<T> {
    custom(): void;
  }
}
```

This affects every array—often unintentionally.

Best practice:

- Use module augmentation narrowly (extend a specific module’s types via `declare module "pkg"` instead of changing global types)
- Avoid global merging in app code
- Prefer explicit wrapper types

## as const: what problem does it solve? Why does as const exist?

It prevents type widening (where literal values like `"ready"` or `42` are widened to `string` or `number`).

``
const status = "ready";
// string

const status2 = "ready" as const;
// "ready"
``

Critical for:

- Discriminated unions
- Configuration objects
- Redux-style reducers

```typescript
const actions = {
  ADD: "add",
  REMOVE: "remove",
} as const;

type Action = typeof actions[keyof typeof actions];
// Action is "add" | "remove"
```

Without `as const`:

```typescript
const actions = {
  ADD: "add",
  REMOVE: "remove",
};

type Action = typeof actions[keyof typeof actions];
// Action is string
```

## TS compile-time vs runtime: common senior pitfall. Name a common bug caused by misunderstanding TS’s compile-time nature.

Assuming types exist at runtime.

```typescript
type User = { id: string };

if (value instanceof User) { // ❌
}
```

Types are erased, so `User` is not a runtime constructor and `instanceof` cannot work on it.

Correct approach:

- Runtime validation (Zod, Yup) to check incoming data at runtime and fail fast.
- Type predicates (user-defined type guards) to narrow `unknown` values after checks; the annotation is compile-time, but it must be backed by real runtime checks.
- Explicit schemas to define what valid data looks like and reuse it across runtime and type layers.

Example (schema shared by runtime + types):

```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {

  return UserSchema.parse(input);
}
```

Senior engineers design runtime validation consciously.

## Large codebases: how do you keep TS healthy? How do you maintain TypeScript quality at scale?

Key practices:

- strict: true (non-negotiable)
- No implicit any
- Lint rules for unsafe casts
- Boundary typing (unknown at edges)
- Avoid as except in narrow, audited places
- Centralize shared types
- Version types alongside APIs
- TypeScript debt compounds silently—discipline matters.

## Final meta question. What’s the most senior TypeScript mindset?

Types are about making invalid states unrepresentable.
