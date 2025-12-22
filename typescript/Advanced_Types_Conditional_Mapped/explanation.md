# Advanced Types: Conditional and Mapped - Comprehensive Study Guide

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

Wrap the type in `[]` to prevent distribution.

## Mapped Types

```typescript
type Readonlyify<T> = {
  readonly [K in keyof T]: T[K];
};
```

Mapped types iterate over keys to build new types from existing shapes.

## Key Remapping

```typescript
type PrefixKeys<T> = {
  [K in keyof T as `pref_${string & K}`]: T[K];
};
```

Note: `string & K` is an intersection that narrows `K` to string keys only, since template literal types require strings. This avoids `number` or `symbol` keys that cannot be used in template literals.

## Interview Questions and Answers

### 1. What is a conditional type?

A type that selects one of two branches based on a type relationship.

### 2. What is a mapped type?

A type that iterates over keys of another type to produce a new type.
