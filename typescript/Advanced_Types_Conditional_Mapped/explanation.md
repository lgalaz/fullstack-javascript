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

Wrap the type in `[]` to prevent distribution. Distribution only happens when the checked type is a "naked" type parameter.

Here, "naked" means the type parameter appears by itself in the `extends` check, not wrapped in another type. For example, `T extends U` is naked, but `[T] extends [U]`, `T[] extends U`, or `{ value: T } extends U` are non-naked and do not distribute.

```typescript
type ToArrayNoDist<T> = [T] extends [any] ? T[] : never;

type A = ToArray<string | number>; // string[] | number[]
type B = ToArrayNoDist<string | number>; // (string | number)[]
```

Difference: `A` is a union of array types (all strings or all numbers), while `B` is a single array type that allows mixed elements.

## Using infer

`infer` lets you capture a type from a conditional branch.

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
