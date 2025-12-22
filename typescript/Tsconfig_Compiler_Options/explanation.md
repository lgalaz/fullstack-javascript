# tsconfig and Compiler Options - Comprehensive Study Guide

## Introduction

`tsconfig.json` controls how TypeScript compiles code.

## Common Options

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## Important Strict Flags

- `noImplicitAny`: disallow implicit `any`
- `strictNullChecks`: make `null` and `undefined` explicit
- `noUncheckedIndexedAccess`: safer indexing

## Incremental Builds

```json
{
  "compilerOptions": { "incremental": true }
}
```

## Interview Questions and Answers

### 1. What does `strict` enable?

A set of strict type-checking options that reduce runtime errors.

### 2. Why use `skipLibCheck`?

To speed up builds by skipping type checks of dependencies.
