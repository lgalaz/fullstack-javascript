# Utility Types - Comprehensive Study Guide

## Introduction

Utility types help transform existing types.

## Common Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

type UserPartial = Partial<User>;
type UserRequired = Required<User>;
type UserReadonly = Readonly<User>;
type UserPick = Pick<User, 'id' | 'name'>;
type UserOmit = Omit<User, 'email'>;
```

These help express common transformations without rewriting types by hand.

## Record

```typescript
type Flags = Record<string, boolean>;
```

`Record<K, V>` is useful for dictionaries and lookup tables.

## ReturnType and Parameters

```typescript
type Fn = (a: number, b: number) => number;

type Args = Parameters<Fn>;

type Result = ReturnType<Fn>;
```

Use `Parameters` and `ReturnType` to keep types in sync with function signatures.

## Interview Questions and Answers

### 1. What does `Partial<T>` do?

It makes all properties of `T` optional.

### 2. What is `Record<K, V>` used for?

It creates an object type with keys of `K` and values of `V`.
