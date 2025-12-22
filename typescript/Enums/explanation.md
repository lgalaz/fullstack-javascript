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

Numeric enums generate a runtime object with reverse mappings.

## String Enums

```typescript
enum Role {
  Admin = 'admin',
  User = 'user'
}
```

String enums are more stable and easier to debug because their values are readable.

## When to Avoid Enums

Union of string literals is often simpler and tree-shake friendly.

```typescript
type Role = 'admin' | 'user';
```

Prefer unions when you do not need a runtime enum object.

## Interview Questions and Answers

### 1. Why prefer string enums?

They are more readable and stable at runtime.

### 2. When would you avoid enums?

When a union of literals is sufficient and you want smaller bundles.
