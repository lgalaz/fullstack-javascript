# Decorators

## Introduction

JavaScript has a decorators proposal (Stage 3) that allows you to wrap or modify classes and class members. Decorators are increasingly supported in modern tooling, but support still depends on your runtime and build setup, so many projects use TypeScript or Babel to compile them.

## Enabling Decorators

- TypeScript 5.0+ supports the current Stage 3 decorators model.
- TypeScript's `experimentalDecorators` flag enables the older legacy decorator model, which behaves differently.
- Babel supports decorators through its decorators plugin, but you must configure which decorator version/proposal mode you want.

The exact behavior depends on whether you are using the current standard-style decorators or legacy decorators. They are not interchangeable, so check your toolchain docs before copying examples.

## Class Decorator Example (Proposal Style)

```javascript
function sealed(value, context) {
  if (context.kind === 'class') {
    Object.seal(value);

    Object.seal(value.prototype);
  }
}

@sealed
class User {
  constructor(name) {
    this.name = name;
  }
}
```

**Note**: The `context` argument is provided by the decorators proposal runtime (or by your transpiler). You do not pass it manually; the engine calls the decorator with `(value, context)` when it applies `@sealed`.

```javascript
// Example shape (simplified)
function sealed(value, context) {
  // context.kind: "class"
  // context.name: "User"
  // context.addInitializer: (fn) => void
  console.log(context.kind, context.name);
}
```

## Method Decorator Example (Proposal Style)

```javascript
function logCall(value, context) {
  if (context.kind === 'method') {
    return function (...args) {
      console.log(`${context.name} called with`, args);

      return value.apply(this, args);
    };
  }
}

class Account {
  constructor() {
    this.balance = 0;
  }

  @logCall
  deposit(amount) {
    this.balance += amount;
  }
}
```

## When Decorators Are a Good Idea

- You need reusable, declarative behavior across many classes.
- You want to attach metadata for frameworks or DI systems.
- You prefer a declarative syntax over manual wrapper code.

## When to Avoid

- You cannot rely on a build step.
- Debugging or stack traces need to stay explicit.
- The behavior is simple enough for direct function composition.

## Interview Questions and Answers

### 1. Are decorators part of JavaScript today?

They are still a Stage 3 proposal. Modern toolchains support them, but runtime support is not universal, so many projects still rely on TypeScript or Babel.

### 2. How do decorators differ between toolchains?

Some toolchains use legacy decorator semantics while others use the current Stage 3 proposal. The APIs and behavior differ, not just the syntax.

### 3. What is a risk of decorators?

They can hide behavior and make call flows less obvious.
