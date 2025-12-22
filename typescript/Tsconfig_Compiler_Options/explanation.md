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

Use `target` and `module` to control output syntax. `strict` enables the strictest safety checks.

### What these options mean and their values

- `target`: JavaScript language level for emitted output. Common values: `ES3`, `ES5`, `ES2015`/`ES6`, `ES2016`, `ES2017`, `ES2018`, `ES2019`, `ES2020`, `ES2021`, `ES2022`, `ES2023`, `ESNext`.
- `module`: Module system for emitted output. Common values: `CommonJS`, `ES2015`/`ES6`, `ES2020`, `ES2022`, `ESNext`, `UMD`, `AMD`, `System`, `Node16`, `NodeNext`.
- `strict`: Enables a bundle of strictness checks (includes `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`). Values: `true` or `false`.
- `noImplicitAny`: Errors on expressions and declarations with an implied `any` type. Values: `true` or `false`.
- `strictNullChecks`: Treats `null` and `undefined` as distinct types that must be handled explicitly. Values: `true` or `false`.
- `esModuleInterop`: Enables compatibility helpers for default imports from CommonJS. Values: `true` or `false`.
- `skipLibCheck`: Skips type-checking of `.d.ts` files to speed up builds. Values: `true` or `false`.

### When the boolean options are useful

- `strict`: Best for new or actively maintained codebases to maximize safety and catch bugs early.
- `noImplicitAny`: Useful when you want to prevent accidental `any` and keep types explicit in team code.
- `strictNullChecks`: Critical when working with data that can be missing (APIs, databases) to avoid null/undefined runtime errors.
- `esModuleInterop`: Helpful when importing CommonJS packages with default imports (e.g. `import express from "express"`).
- `skipLibCheck`: Useful to speed up builds in large projects or when third-party `.d.ts` files cause noise, but it can hide dependency type issues.

## Important Strict Flags

- `noImplicitAny`: disallow implicit `any`
- `strictNullChecks`: make `null` and `undefined` explicit
- `noUncheckedIndexedAccess`: safer indexing

These flags catch subtle bugs like missing null checks or unsafe indexing.

## Emission and build flags

- `noEmit`: type-check only, no JS output.
- `declaration`: emit `.d.ts` files for library consumers.
- `emitDeclarationOnly`: emit only types.
- `sourceMap`: generate source maps for debugging.
- `outDir`/`rootDir`: control output and project structure.

## Module resolution

`moduleResolution` controls how imports are resolved. Use `node` or `bundler` depending on your runtime/bundler.

```json
{
  "compilerOptions": { "moduleResolution": "bundler" }
}
```

## JSX and lib

`jsx` controls JSX emit (`react-jsx`, `preserve`, etc.). `lib` selects the built-in runtime types (DOM, ES2020, etc.).

## Incremental Builds

```json
{
  "compilerOptions": { "incremental": true }
}
```

Incremental builds speed up large projects by reusing previous build information.

`composite` and project `references` enable multi-package builds with dependency-aware ordering.

## Interview Questions and Answers

### 1. What does `strict` enable?

A set of strict type-checking options that reduce runtime errors.

### 2. Why use `skipLibCheck`?

To speed up builds by skipping type checks of dependencies.
