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

## Intersection Types

```typescript
type Timestamped = { createdAt: string };

type User = { id: number; name: string };

type UserWithTime = User & Timestamped;
```

## Interview Questions and Answers

### 1. When would you use a union?

When a value can legitimately be one of several types.

### 2. When would you use an intersection?

When you need a type that satisfies multiple type requirements at once.
