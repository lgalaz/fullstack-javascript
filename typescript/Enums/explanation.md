# Enums - Comprehensive Study Guide

## Introduction

Enums define a set of named constants. Use string enums for safer output.

## Numeric Enums

```typescript
enum Status {
  Idle,
  Loading,
  Success,
  Error
}
```

## String Enums

```typescript
enum Role {
  Admin = 'admin',
  User = 'user'
}
```

## When to Avoid Enums

Union of string literals is often simpler and tree-shake friendly.

```typescript
type Role = 'admin' | 'user';
```

## Interview Questions and Answers

### 1. Why prefer string enums?

They are more readable and stable at runtime.

### 2. When would you avoid enums?

When a union of literals is sufficient and you want smaller bundles.
