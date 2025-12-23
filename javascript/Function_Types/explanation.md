# Function Types in JavaScript 

## Introduction

JavaScript supports several ways to define and invoke functions. Each has different hoisting and `this` behavior.

## Function Declarations

Hoisted entirely, so they can be called before they appear.

```javascript
sayHi();

function sayHi() {
  console.log('Hi');
}
```

## Function Expressions

Assigned to a variable; only the variable is hoisted.

```javascript
const sayHi = function () {
  console.log('Hi');
};
```

## Named Function Expressions

Useful for stack traces and self-reference.

```javascript
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
```

## Arrow Functions

Short syntax and lexical `this`.

```javascript
const add = (a, b) => a + b;
```

## IIFE (Immediately Invoked Function Expression)

Runs immediately to create a local scope.

```javascript
(function () {
  const secret = 'hidden';
  console.log('IIFE ran');
})();
```

## Methods

Functions stored as object properties.

```javascript
const user = {
  name: 'Ada',
  greet() {
    console.log(this.name);
  }
};
```

## Constructor Functions

Called with `new` to create instances.

```javascript
function Person(name) {
  this.name = name;
}
const p = new Person('Ada');
```

## Generators and Async Functions

```javascript
function* counter() {
  yield 1;
  yield 2;
}

async function fetchData() {
  const res = await fetch('/api');
  return res.json();
}
```

## Interview Questions and Answers

### 1. What is the difference between a function declaration and expression?

Declarations are hoisted with their body; expressions are not.

### 2. Why use an IIFE?

To create a local scope and avoid polluting the global namespace.
