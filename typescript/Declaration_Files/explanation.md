# Declaration Files (.d.ts) - Comprehensive Study Guide

## Introduction

Declaration files describe the shape of JavaScript code for TypeScript. They allow you to type libraries without TS source.

## Ambient Declarations

```typescript
// globals.d.ts
declare const VERSION: string;
```

## Module Declarations

```typescript
declare module 'legacy-lib' {
  export function run(input: string): number;
}
```

## Generating Declarations

Enable `declaration: true` in `tsconfig.json` to emit `.d.ts` files.

## Interview Questions and Answers

### 1. What is a .d.ts file?

A file that describes types for JavaScript code.

### 2. When would you write one manually?

When using an untyped library or global runtime values.
