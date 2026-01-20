# Advanced Types: Conditional and Mapped 

## Introduction

Conditional and mapped types enable type-level programming for flexible APIs.

## Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

Conditional types can also be distributive over unions by default:

```typescript
type ToArray<T> = T extends any ? T[] : never;
type Result = ToArray<string | number>; // string[] | number[]
```

In this example, `never` is the "no possible values" type, used as the false branch placeholder even though `T extends any` is always true.

Wrap the type in Tuple `[]` to prevent distribution. Distribution only happens when the checked type is a "naked" type parameter. Tuples are fixed-length array types where each position has a specific type. 

Here, "naked" means the type parameter appears by itself in the `extends` check, not wrapped in another type. For example, `T extends U` is naked, but `[T] extends [U]`, `T[] extends U`, or `{ value: T } extends U` are non-naked and do not distribute.

```typescript
// Distributive (naked type parameter)
type ToArray<T> = T extends any ? T[] : never;

type Dist = ToArray<string | number>; // string[] | number[]

// Non-distributive (wrapped in a tuple)
type ToArrayNoDist<T> = [T] extends [any] ? T[] : never;

type NonDist = ToArrayNoDist<string | number>; // (string | number)[]
```

Difference: `A` is a union of array types (all strings or all numbers), while `B` is a single array type that allows mixed elements.

## Using infer

`infer` lets you capture a type from a conditional branch.
It introduces a placeholder type variable that exists only within the conditional, and TypeScript tries to match the left side to the pattern you write.
If the match succeeds, the inferred type is bound and you can return it; if it fails, the conditional falls back to the `false` branch.
In other words, `infer` is pattern matching for types: you describe the shape you want (like `Promise<infer U>` or `(infer U)[]`) and extract the piece you care about.
Also, A type variable must be declared (as a generic parameter) or introduced via infer inside a conditional. It also needs to appear in a position where TypeScript can infer it. If it’s not declared (like a bare U), it’s an error. If it’s declared but only appears in the extends right side, TS usually won’t infer it automatically, so you must supply it or rewrite the conditional to use infer.

```typescript
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Value = UnpackPromise<Promise<{ id: number }>>; // { id: number }
```

Think of `infer U` as "extract the inner type." If `T` is a `Promise<X>`, `U` becomes `X`. Otherwise, the type falls back to `T`.

```typescript
type A = UnpackPromise<Promise<string>>; // string
type B = UnpackPromise<number>; // number
```

This is similar to "set `Value` to whatever the promise resolves to," but it's a pure type-level operation with no runtime effect.

More `infer` examples:

```typescript
// Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : never;
// Parentheses bind `infer U` as the element type; `infer U[]` is not valid syntax.
type E1 = ElementType<string[]>; // string
type E2 = ElementType<[1, 2, 3]>; // 1 | 2 | 3

// Extract function return type
type ReturnTypeOf<T> = T extends (...args: any[]) => infer R ? R : never;
type R1 = ReturnTypeOf<() => number>; // number
type R2 = ReturnTypeOf<(x: string) => Promise<boolean>>; // Promise<boolean>

// Extract tuple first element type
type Head<T> = T extends [infer H, ...any[]] ? H : never;
type H1 = Head<[string, number, boolean]>; // string

type FirstTwo<T> = T extends [infer A, infer B, ...any[]] ? A | B : never;
```

Note: a two-parameter version like `type ElementType<T, U> = T extends U[] ? U : never` does not infer `U` from `T`. Callers must supply `U`, so it is mainly useful for checking a relationship (returning `never` when `T` is not an array of `U`) rather than auto-extracting the element type.

## Mapped Types

```typescript
type Readonlyify<T> = {
  readonly [K in keyof T]: T[K];
};

type User = {
  id: number;
  name: string;
};

type ReadonlyUser = Readonlyify<User>;
// Result:
// {
//   readonly id: number;
//   readonly name: string;
// }
```

Mapped types iterate over keys to build new types from existing shapes.

You can modify modifiers with `+` and `-`:
Note: `+` is optional and is mainly used for clarity or symmetry when paired with `-`.

```typescript
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type ReadonlyUser = {
  readonly id: number;
  readonly name: string;
};

type MutableUser = Mutable<ReadonlyUser>;
// Result:
// {
//   id: number;
//   name: string;
// }
```

Example of a generic utility type that toggles modifiers:

```typescript
type WithReadonly<T, IsReadonly extends boolean> = {
  [K in keyof T]: IsReadonly extends true ? Readonly<T>[K] : T[K];
};

type ReadonlyUser2 = WithReadonly<User, true>;
type MutableUser2 = WithReadonly<ReadonlyUser, false>;
```

Note: `Readonly<T>` is a built-in utility type in TypeScript. Similar to Readonlyify that we defined earlier.


## Key Remapping

```typescript
type PrefixKeys<T> = {
  [K in keyof T as `pref_${string & K}`]: T[K];
};

type Config = {
  host: string;
  port: number;
};

type PrefixedConfig = PrefixKeys<Config>;
// Result:
// {
//   pref_host: string;
//   pref_port: number;
// }
```

Note: `string & K` is an intersection that keeps only the overlap between `K` and `string`. If `K` includes `string | number | symbol`, the intersection removes `number` and `symbol`, leaving just `string` keys. This is needed because template literal types only accept string-like keys.
Template literal types build new string literal types from other types (e.g., `` `pref_${K}` ``). The `&` is the intersection type operator ("and"), so `string & K` narrows `K` to its string keys (filtering out `number` and `symbol`) to make the template literal valid.

You can also filter keys using conditional key remapping:

```typescript
type OnlyFunctions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

type Service = {
  id: string;
  start(): void;
  stop(): void;
  status: 'idle' | 'running';
};

type ServiceFns = OnlyFunctions<Service>;
// Result:
// {
//   start(): void;
//   stop(): void;
// }
```

## Interview Questions and Answers

### 1. What is a conditional type?

A type that selects one of two branches based on a type relationship, such as whether one type is assignable to another (`T extends U`).

### 2. What is a mapped type?

A type that iterates over keys of another type to produce a new type.
