# Union and Intersection Types - Comprehensive Study Guide

## Introduction

Union types allow a value to be one of several types. Intersection types combine multiple types.

## Union Types

```typescript
type ID = string | number;

function printId(id: ID) {
  console.log(id);
}
```

With unions, you must narrow before using type-specific operations.

```typescript
function formatId(id: ID) {
  return typeof id === 'string' ? id.toUpperCase() : id.toFixed(0);
}
```

## Intersection Types

```typescript
type Timestamped = { createdAt: string };

type User = { id: number; name: string };

type UserWithTime = User & Timestamped;
```

Intersections combine all properties. If two types conflict (same key, different types), the result can become `never` for that property.

## Interview Questions and Answers

### 1. When would you use a union?

When a value can legitimately be one of several types.

### 2. When would you use an intersection?

When you need a type that satisfies multiple type requirements at once.
