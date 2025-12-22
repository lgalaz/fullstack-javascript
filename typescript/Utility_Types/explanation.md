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

## Record

```typescript
type Flags = Record<string, boolean>;
```

## ReturnType and Parameters

```typescript
type Fn = (a: number, b: number) => number;

type Args = Parameters<Fn>;

type Result = ReturnType<Fn>;
```

## Interview Questions and Answers

### 1. What does `Partial<T>` do?

It makes all properties of `T` optional.

### 2. What is `Record<K, V>` used for?

It creates an object type with keys of `K` and values of `V`.
