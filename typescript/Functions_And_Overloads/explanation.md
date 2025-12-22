# Functions and Overloads - Comprehensive Study Guide

## Introduction

TypeScript lets you type function parameters, returns, and overloads.

## Basic Function Types

```typescript
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;
```

Type annotations go on parameters and return types. When omitted, TypeScript tries to infer them.

## Optional and Default Parameters

```typescript
function greet(name: string, title?: string) {
  return title ? `${title} ${name}` : name;
}

function greet2(name: string, title = 'Dr.') {
  return `${title} ${name}`;
}
```

## Function Overloads

```typescript
function parse(input: string): string;
function parse(input: number): number;
function parse(input: string | number) {
  return input;
}
```

Only the overload signatures are visible to callers. The implementation signature must be compatible with all overloads.

## Rest Parameters

```typescript
function sum(...nums: number[]) {
  return nums.reduce((a, b) => a + b, 0);
}
```

Rest parameters are typed as arrays, so `...nums: number[]` means any number of numbers.

## Interview Questions and Answers

### 1. Why use overloads?

They provide multiple call signatures for better type safety and tooling.

### 2. What is the difference between optional and default parameters?

Optional parameters may be `undefined`; default parameters provide a fallback value.
