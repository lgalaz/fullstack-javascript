# Type Checking vs Runtime - Comprehensive Study Guide

## Introduction

TypeScript adds a type-checking step before JavaScript runs. Types are erased at build time, so runtime behavior is always JavaScript.

## Typical Lifecycle

1) Authoring time (editor/IDE)
   - The language server type-checks as you type and shows errors inline.

2) Build/type-check time
   - `tsc` (or a type checker) validates types.
   - Optionally emits JavaScript (`tsc`) or only checks types (`tsc --noEmit`).

3) Transpile/bundle time (optional)
   - Babel or a bundler can transpile TS, often without full type checks.
   - Types are removed from output.

4) Runtime
   - JavaScript executes in Node or the browser.
   - Only runtime checks/guards (if you wrote them) can validate data.

## Key Takeaways

- Type checks happen before runtime; they do not affect runtime behavior.
- Type-only imports/exports are erased and do not load code at runtime.
- If a value comes from the outside world (API, user input), you still need runtime validation.
