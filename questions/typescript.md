1. TypeScript’s value proposition (baseline sanity check)

I: What problem does TypeScript actually solve, beyond “types for JavaScript”?

C:
TypeScript is a static analysis and tooling layer over JavaScript, not a runtime system.

Its real value is:

- Early error detection (compile-time instead of production)
- Executable documentation (types encode intent)
- Refactor safety at scale (renames, API changes)
- Better IDE intelligence (navigation, autocomplete, dead-code detection)
- Constraining invalid states before runtime

It does not guarantee correctness, performance, or runtime safety—those still require tests and runtime checks (validations that run in production, like input/schema checks, type guards, and defensive error handling).

2. Structural typing vs nominal typing (different axis from strong vs weak typing)

I: Explain structural typing. Why does it matter in large systems?

C:
TypeScript uses structural typing, meaning compatibility is based on shape, not declared identity.

```
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

```
type UserId = string & { readonly __brand: "UserId" };

function asUserId(id: string): UserId {
  return id as UserId;
}
```

This prevents mixing logically distinct but structurally identical types.

3. any vs unknown (this is a senior filter)

I: Compare any and unknown. When should each be used?

C:

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

4. never: when does it appear and why is it useful?

I: When does TypeScript infer never, and how do you use it intentionally?

C:
never represents impossible states.

It appears when:

- A union is exhaustively narrowed
- A function never returns
- An unreachable code path exists

Exhaustiveness checking:

```
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

5. Type narrowing: how does TS actually narrow?

I: Explain how TypeScript performs type narrowing.

C:
TypeScript narrows via control-flow analysis, not runtime logic.

Common narrowing mechanisms:

typeof

instanceof

equality checks

discriminated unions

user-defined type guards

function isUser(x: unknown): x is { id: string } {
  return typeof x === "object" && x !== null && "id" in x;
}


Important nuance:

Narrowing is flow-sensitive

Mutations can invalidate narrowings

Aliasing can break safety assumptions

6. Generics: constraint vs inference

I: When should you constrain generics, and when should you let inference work?

C:
Prefer inference first, constraints only when needed.

Bad:

function identity<T extends unknown>(x: T): T {
  return x;
}


Good:

function identity<T>(x: T): T {
  return x;
}


Use constraints when:

You rely on specific properties

You want better error messages

You need key relationships

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}


Senior rule: constraints encode assumptions—don’t add them casually.

7. keyof, indexed access, and mapped types

I: Explain how these three work together.

C:

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

DTO transformations

Form modeling

API response shaping

Permission systems

Mapped types are compile-time loops over keys.

8. Conditional types and distributivity

I: What are conditional types, and what does “distributive” mean?

C:

Conditional types:

type IsString<T> = T extends string ? true : false;


Distributive behavior occurs when the checked type is a naked type parameter:

type Result = IsString<string | number>;
// true | false


To disable distribution:

type IsString<T> = [T] extends [string] ? true : false;


This distinction is critical for utility types like Exclude, Extract, etc.

9. interface vs type (no hand-waving)

I: When do you prefer interface vs type?

C:

interface

Object shapes

Public APIs

Declaration merging

Extends well

type

Unions

Intersections

Primitives

Mapped/conditional types

Example merging:

interface Window {
  myProp: string;
}

interface Window {
  anotherProp: number;
}


Senior convention:

Libraries → interfaces

Internal modeling → types

10. Declaration merging: when is it dangerous?

I: Declaration merging is powerful—but when is it risky?

C:

Risks:

Accidental global pollution

Version conflicts in dependencies

Hidden coupling

declare global {
  interface Array<T> {
    custom(): void;
  }
}


This affects every array—often unintentionally.

Best practice:

Use module augmentation narrowly

Avoid global merging in app code

Prefer explicit wrapper types

11. as const: what problem does it solve?

I: Why does as const exist?

C:

It prevents type widening.

const status = "ready";
// string

const status2 = "ready" as const;
// "ready"


Critical for:

Discriminated unions

Configuration objects

Redux-style reducers

const actions = {
  ADD: "add",
  REMOVE: "remove",
} as const;

type Action = typeof actions[keyof typeof actions];

12. TS compile-time vs runtime: common senior pitfall

I: Name a common bug caused by misunderstanding TS’s compile-time nature.

C:

Assuming types exist at runtime.

type User = { id: string };

if (value instanceof User) { // ❌
}


Types are erased.

Correct approach:

Runtime validation (Zod, Yup)

Type predicates

Explicit schemas

Senior engineers design runtime validation consciously.

13. Large codebases: how do you keep TS healthy?

I: How do you maintain TypeScript quality at scale?

C:

Key practices:

strict: true (non-negotiable)

No implicit any

Lint rules for unsafe casts

Boundary typing (unknown at edges)

Avoid as except in narrow, audited places

Centralize shared types

Version types alongside APIs

TypeScript debt compounds silently—discipline matters.

14. Final meta question

I: What’s the most senior TypeScript mindset?

C:

Types are about making invalid states unrepresentable.
