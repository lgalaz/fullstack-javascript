# Explicit Resource Management (using, Symbol.dispose)

## Introduction

TypeScript supports the proposed "Explicit Resource Management" feature, which adds `using` and `Symbol.dispose` to dispose resources automatically at the end of a block.

## Status (Jan 16th 2026)

This is a TC39 proposal and may not be available in all JavaScript runtimes yet. TypeScript can typecheck the syntax, but you still need runtime support (or a polyfill) for it to work.

## Example: using with Symbol.dispose

```ts
class Resource {
  constructor(private name: string) {}

  read() {
    return `reading ${this.name}`;
  }

  [Symbol.dispose]() {
    console.log(`disposed ${this.name}`);
  }
}

{
  using res = new Resource("file-handle");
  console.log(res.read());
}
// res[Symbol.dispose]() is called automatically here
```

## How to Use It

- Implement `Symbol.dispose` on any class that needs cleanup.
- Use `using` inside a block to ensure cleanup happens at the end of the block.
- Enable the appropriate lib in `tsconfig.json` (for example, `esnext.disposable`).

## When to Use It

- You have short-lived resources (files, sockets, locks) and want guaranteed cleanup.
- You prefer block-scoped cleanup over manual `try/finally`.

## Why Use It

- Cleaner code with less boilerplate.
- Fewer leaks from forgotten cleanup.
- Clear intent: resources are disposed deterministically.

## Notes and Caveats

- You still need runtime support for `Symbol.dispose` and `using`.
- For async cleanup, the proposal also includes `Symbol.asyncDispose`.
