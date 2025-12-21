# Closures in JavaScript - Comprehensive Study Guide

## Introduction

A closure is a function that has access to its own scope, the outer function's scope, and the global scope. It's created when a function is defined inside another function and the inner function is returned or passed as a value.

### Example of returning the inner function:

```javascript
function createMultiplier(factor) {
  return function(number) {  // Inner function is returned
    return number * factor;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10
```

### Example of passing the inner function as a value:

```javascript
function setupTimer(callback) {
  setTimeout(callback, 1000);  // Inner function passed as callback
}

function outer() {
  let count = 0;
  function inner() {  // Inner function defined
    count++;
    console.log('Count:', count);
  }
  setupTimer(inner);  // Inner function passed as value
}

outer(); // After 1 second: "Count: 1"
```

## How Closures Work

When a function is created, it creates a closure that captures the variables from its lexical environment.

Example:

```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```

Here, `inner` has access to `count` even after `outer` has finished executing.

## Use Cases

- **Data privacy**: Encapsulate variables to prevent external access.

```javascript
function createCounter() {
  let count = 0;
  return {
    increment: function() { count++; return count; },
    decrement: function() { count--; return count; },
    getCount: function() { return count; }
  };
}

const counter = createCounter();
console.log(counter.getCount()); // 0
counter.increment();
console.log(counter.getCount()); // 1
// count is not accessible directly
```

- **Partial application**: Fix some arguments of a function, creating a new function that takes the remaining arguments.

```javascript
function multiply(a, b) {
  return a * b;
}

function partialMultiply(a) {
  return function(b) {
    return multiply(a, b);
  };
}

const double = partialMultiply(2);
console.log(double(5)); // 10

const triple = partialMultiply(3);
console.log(triple(4)); // 12
```

This allows creating specialized functions from general ones, improving code reusability.

- **Event handlers**: Maintain state across events.

```javascript
function setupButton(buttonId) {
  let clickCount = 0;
  document.getElementById(buttonId).addEventListener('click', function() {
    clickCount++;
    console.log(`Button clicked ${clickCount} times`);
  });
}
```

- **Callbacks**: Preserve context in asynchronous operations.

```javascript
function fetchData(url) {
  let retries = 0;
  return function(callback) {
    // Simulate retry logic
    if (retries < 3) {
      retries++;
      // fetch logic here
      callback(null, `Data from ${url}, attempt ${retries}`);
    } else {
      callback(new Error('Max retries reached'));
    }
  };
}
```

## Common Pitfalls

- **Memory leaks if not careful**: Closures can prevent garbage collection of variables that are no longer needed.

Example of a memory leak:

```javascript
function createLeak() {
  const largeObject = { data: new Array(1000000).fill('data') };
  return function() {
    console.log(largeObject.data.length);
  };
}

const leakyFunction = createLeak();
// largeObject is kept in memory even if not used elsewhere
// To fix: set largeObject = null when done, or restructure code
```

Prevention: Be mindful of what variables are captured. Use weak references (WeakMap, WeakSet) when possible. Clean up event listeners and timers.

- **Unexpected behavior with loops**: Due to variable hoisting and scoping.

With `var` (function-scoped):

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Logs 3, 3, 3
}
```

All closures share the same `i`, which is 3 after the loop ends.

With `let` (block-scoped):

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // Logs 0, 1, 2
}
```

Each iteration creates a new `i` in its own scope.

Alternative fix with `var`:

```javascript
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(() => console.log(j), 100);
  })(i); // Logs 0, 1, 2
}
```

Using an IIFE to capture the current value.

## Interview Questions and Answers

### 1. What is a closure?

A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has finished executing. It's created whenever a function is defined inside another function and the inner function references variables from the outer scope.

### 2. Explain with an example.

Consider this counter example:

```javascript
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

The returned function (closure) maintains access to the `count` variable from `createCounter`, even though `createCounter` has finished executing. Each call to `counter` increments and returns the shared `count`.

### 3. How are closures used in JavaScript?

Closures are used for:
- **Data encapsulation and privacy**: Creating private variables
- **Partial application and currying**: Fixing some function arguments
- **Event handlers and callbacks**: Maintaining state across asynchronous operations
- **Module pattern**: Organizing code with private/public interfaces
- **Memoization**: Caching expensive computations

### 4. What are the advantages and disadvantages?

**Advantages:**
- Enable data privacy and encapsulation
- Allow for functional programming patterns like partial application
- Maintain state in asynchronous code
- Create clean, modular code structures

**Disadvantages:**
- Can cause memory leaks if not managed properly
- May lead to unexpected behavior with loops (if not using proper scoping)
- Can make code harder to debug due to hidden state
- Performance overhead from maintaining references to outer scope variables