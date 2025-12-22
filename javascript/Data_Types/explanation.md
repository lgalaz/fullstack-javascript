# JavaScript Data Types - Comprehensive Study Guide

## Introduction

JavaScript has primitive types and reference types. Primitives are immutable values, while reference types are objects stored by reference.

## Primitive Types

- **string**: text
- **number**: floating point numbers
- **bigint**: arbitrary precision integers
- **boolean**: true/false
- **undefined**: uninitialized value
- **null**: explicit empty value
- **symbol**: unique identifiers

```javascript
const name = 'Ada';
const count = 42;
const big = 9007199254740991n;
const active = true;
let missing;
const empty = null;
const id = Symbol('id');
```

### Symbol

Symbols are unique even if created with the same description. They are often used as non-colliding object keys.

```javascript
const a = Symbol('key');
const b = Symbol('key');
console.log(a === b); // false

const obj = { [a]: 'secret' };
```

## Reference Types

- **object**: plain objects, arrays, functions, dates, maps, sets

```javascript
const user = { id: 1, name: 'Ada' };
const list = [1, 2, 3];
const fn = () => {};
```

## typeof Results

```javascript
typeof 'x'; // "string"
typeof 1; // "number"
typeof 1n; // "bigint"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (historical bug)
typeof Symbol('x'); // "symbol"
typeof {}; // "object"
typeof []; // "object"
typeof (() => {}); // "function"
```

## Interview Questions and Answers

### 1. What are the primitive types in JavaScript?

string, number, bigint, boolean, undefined, null, and symbol.

### 2. Why is `typeof null` equal to "object"?

It is a historical bug in JavaScript that cannot be changed for compatibility.
