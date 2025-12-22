# Advanced Types: Conditional and Mapped - Comprehensive Study Guide

## Introduction

Conditional and mapped types enable type-level programming for flexible APIs.

## Conditional Types

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

## Mapped Types

```typescript
type Readonlyify<T> = {
  readonly [K in keyof T]: T[K];
};
```

## Key Remapping

```typescript
type PrefixKeys<T> = {
  [K in keyof T as `pref_${string & K}`]: T[K];
};
```

## Interview Questions and Answers

### 1. What is a conditional type?

A type that selects one of two branches based on a type relationship.

### 2. What is a mapped type?

A type that iterates over keys of another type to produce a new type.
