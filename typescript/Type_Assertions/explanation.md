# Type Assertions - Comprehensive Study Guide

## Introduction

Type assertions tell the compiler to treat a value as a specific type. Use them when you know more than the compiler.

## Basic Assertions

```typescript
const value: unknown = 'text';
const len = (value as string).length;
```

## Non-Null Assertion

```typescript
const input = document.getElementById('name')!;
```

## Assertion vs Casting

Assertions do not change runtime behavior; they only affect types.

## Interview Questions and Answers

### 1. When is a type assertion appropriate?

When runtime guarantees exist but the compiler cannot infer them.

### 2. Why can assertions be risky?

They can hide real type errors and cause runtime failures.
