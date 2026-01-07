# Decorators

## Introduction

JavaScript has a decorators proposal (stage 3) that allows you to wrap or modify classes and class members. As of today, decorators are not universally available in runtimes, so you typically use a transpiler (Babel or TypeScript) to enable them.

## Enabling Decorators

- Babel: use the decorators plugin.
- TypeScript: set `experimentalDecorators` and compile to JavaScript.

The exact syntax depends on whether you are using the newer proposal or legacy decorators, so follow your toolchain's docs.

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

They are a proposal and not universally supported in runtimes, so you usually need a transpiler.

### 2. How do decorators differ between toolchains?

Some toolchains use legacy decorator semantics while others use the newer proposal, which changes the function signature.

### 3. What is a risk of decorators?

They can hide behavior and make call flows less obvious.
